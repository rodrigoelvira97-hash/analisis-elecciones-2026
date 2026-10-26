from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "web" / "source-catalog-2023.js"


def normalize(value: str) -> str:
    value = unicodedata.normalize("NFD", value)
    value = "".join(char for char in value if unicodedata.category(char) != "Mn")
    return re.sub(r"\s+", " ", value.replace("\u00ad", "")).strip().lower()


def clean_lines(raw: str) -> list[str]:
    lines = []
    for line in raw.replace("\r", "").split("\n"):
        line = line.replace("\u00ad", "")
        line = re.sub(r"(?<=\w)-\s+(?=\w)", "", line)
        line = re.sub(r"\s+", " ", line).strip()
        if line:
            lines.append(line)
    return lines


def pages_for(filename: str) -> list[tuple[int, list[str]]]:
    extracted = ROOT / "tmp" / "pdf_text" / f"{Path(filename).stem}.txt"
    if extracted.exists():
        raw = extracted.read_text(encoding="utf-8")
        chunks = re.split(r"^--- PAGE (\d+) ---\s*$", raw, flags=re.MULTILINE)
        pages = []
        for index in range(1, len(chunks), 2):
            pages.append((int(chunks[index]), clean_lines(chunks[index + 1])))
        return pages
    reader = PdfReader(str(ROOT / filename))
    return [(number, clean_lines(page.extract_text() or "")) for number, page in enumerate(reader.pages, 1)]


def flatten(lines: list[str]) -> str:
    return re.sub(r"\s+", " ", " ".join(lines)).strip()


def title_and_detail(lines: list[str], number: int | None = None) -> tuple[str, str]:
    text = flatten(lines)
    if number is not None:
        text = re.sub(rf"^{number}\.?\s+", "", text)
    text = re.sub(r"^(?:NUESTRAS MEDIDAS|PROPUESTAS|MEDIDAS)\s+", "", text, flags=re.I)
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return "Propuesta sin título extraíble", ""
    sentence = re.split(r"(?<=[.!?])\s+", text, maxsplit=1)[0]
    title = sentence[:160].strip()
    if len(title) < 24:
        title = text[:160].strip()
    detail = text[:420].strip()
    if len(text) > 420:
        detail += "…"
    return title, detail


def page_section(party: str, page: int) -> tuple[int, str]:
    if party == "PP":
        if page <= 41:
            return 0, "Crecer de forma sostenible"
        if page <= 64:
            return 1, "Cuidar y prosperar"
        if page <= 81:
            return 3, "Regenerar y respetar"
        if page <= 91:
            return 4, "Servir"
        return 4, "Liderar e influir"
    if party == "PSOE":
        if page <= 52:
            return 0, "Política económica y crecimiento justo"
        if page <= 94:
            return 1, "Transición ecológica, digitalización y territorio"
        if page <= 123:
            return 2, "Educación, ciencia, conocimiento y cultura"
        if page <= 228:
            return 3, "Igualdad, bienestar, derechos y vivienda"
        return 4, "Cohesión territorial, instituciones y política exterior"
    if party == "SUMAR":
        if page <= 36:
            return 0, "Economía y trabajo"
        if page <= 71:
            return 1, "Transición ecológica, rural y alimentación"
        if page <= 85:
            return 2, "Hábitat, vivienda y movilidad"
        if page <= 106:
            return 3, "Bienestar, cuidados y salud"
        return 4, "Democracia, derechos, conocimiento y política exterior"
    if page <= 20:
        return 0, "Igualdad entre españoles y unidad de España"
    if page <= 54:
        return 1, "Empleo, producción y fiscalidad"
    if page <= 88:
        return 2, "Educación, vivienda, salud y protección social"
    if page <= 106:
        return 3, "Seguridad, defensa, inmigración y justicia"
    return 4, "Medio ambiente, energía, Europa, mundo rural y familia"


SUBTHEME_RULES: list[tuple[str, tuple[str, ...]]] = [
    ("fronteras-control", ("frontera", "control fronterizo", "protección fronteriza", "devolución de inmigrantes", "entrada ilegal")),
    ("migracion-asilo", ("inmigr", "migración", "migrante", "extranjer", "asilo", "refugi")),
    ("integracion-migracion", ("integración de migr", "integración y convivencia", "convivencia intercultural")),
    ("sanidad-salud", ("sanidad", "salud pública", "sistema nacional de salud", "atención primaria", "salud mental", "hospital")),
    ("educacion-conocimiento", ("educación", "educativo", "universidad", "formación profesional", "ciencia", "investigación", "docente")),
    ("pensiones-cuidados", ("pensiones", "dependencia", "cuidados", "envejecer", "mayores", "personas dependientes")),
    ("servicios-sociales", ("servicios sociales", "inclusión social", "ingreso mínimo", "discapacidad", "protección social")),
    ("impuestos-fiscalidad", ("impuesto", "fiscal", "tribut", "presión fiscal", "irpf", "iva", "sociedades")),
    ("finanzas-publicas", ("presupuesto", "déficit", "deuda pública", "gasto público", "regla de gasto")),
    ("vivienda-proximidad", ("vivienda", "alquiler", "hipoteca", "suelo residencial", "rehabilitación")),
    ("coste-vida", ("coste de vida", "precios", "consumo", "poder adquisitivo")),
    ("transporte-infraestructuras", ("transporte", "movilidad", "ferrocarril", "carretera", "cercanías", "mercancías")),
    ("infraestructuras", ("infraestructura", "conectividad", "banda ancha", "5g", "equipamiento")),
    ("agua", ("agua", "hídrico", "desalación", "sequía")),
    ("energia", ("energía", "energético", "renovable", "hidrógeno", "electricidad")),
    ("medio-ambiente", ("medio ambiente", "clima", "biodiversidad", "contaminación", "patrimonio natural")),
    ("produccion-rural", ("agricultura", "ganadería", "pesca", "mundo rural", "agroalimentario", "campo")),
    ("cohesion-territorial", ("despoblación", "cohesión territorial", "rural", "territorial")),
    ("organizacion-territorial", ("autonom", "competencias", "modelo territorial", "unidad de españa", "cogobernanza")),
    ("administracion-local", ("municipio", "ayuntamiento", "administración local")),
    ("instituciones-democracia", ("democracia", "transparencia", "participación", "parlamento", "rendición de cuentas", "instituciones")),
    ("justicia", ("justicia", "judicial", "jueces", "fiscalía")),
    ("administracion-digital", ("administración pública", "trámite", "digitalización", "interoperabilidad", "gobierno digital")),
    ("seguridad-interior", ("seguridad ciudadana", "policía", "guardia civil", "delito", "ocupación")),
    ("defensa-soberania", ("defensa", "fuerzas armadas", "soberanía", "integridad territorial")),
    ("proteccion-civil", ("protección civil", "emergencia", "catástrofe")),
    ("derechos-igualdad", ("igualdad", "derechos", "discriminación", "libertad", "lgtbi", "violencia de género")),
    ("familia-conciliacion", ("familia", "conciliación", "maternidad", "paternidad", "infancia")),
    ("cultura", ("cultura", "patrimonio cultural", "deporte")),
    ("union-europea", ("unión europea", "europa", "fondos europeos")),
    ("politica-exterior", ("política exterior", "cooperación internacional", "iberoamérica", "diplomacia")),
]


def classify(party: str, page: int, text: str) -> list[str]:
    haystack = normalize(text)
    found: list[str] = []
    for subtheme, terms in SUBTHEME_RULES:
        matches = any(normalize(term) in haystack for term in terms)
        if subtheme == "migracion-asilo" and matches:
            migration_context = (
                "inmigr" in haystack
                or "migr" in haystack
                or "asilo" in haystack
                or "refugi" in haystack
                or any(term in haystack for term in (
                    "persona extranj", "personas extranjer", "extranjería", "nacionalidad",
                    "frontera", "regular", "irregular", "acogida", "protección internacional",
                    "arraigo", "mena", "expuls", "devolución", "flujos", "tráfico de personas"
                ))
            )
            matches = matches and migration_context
        if matches:
            found.append(subtheme)
    # Fallbacks keep every extracted proposal attached to a meaningful parent.
    if not found:
        index, _ = page_section(party, page)
        found = [{
            "PP": ["empresa-industria", "servicios-sociales", "instituciones-democracia", "administracion-digital", "politica-exterior"][index],
            "PSOE": ["empresa-industria", "medio-ambiente", "educacion-conocimiento", "derechos-igualdad", "instituciones-democracia"][index],
            "SUMAR": ["empleo-formacion", "medio-ambiente", "vivienda-proximidad", "servicios-sociales", "instituciones-democracia"][index],
            "VOX": ["organizacion-territorial", "empleo-formacion", "sanidad-salud", "seguridad-interior", "familia-conciliacion"][index],
        }[party]]
    # Avoid turning a generic occurrence into an unrelated second category.
    return found[:3]


def make_record(party: str, page: int, lines: list[str], number: int | None) -> dict:
    title, detail = title_and_detail(lines, number)
    _, section = page_section(party, page)
    subthemes = classify(party, page, f"{section} {title} {detail}")
    return {
        "title": title,
        "detail": detail,
        "page": page,
        "number": number,
        "section": section,
        "subthemeIds": subthemes,
        "priorityIndex": page_section(party, page)[0],
        "kind": "document",
    }


def extract_blocks(pages: list[tuple[int, list[str]]], pattern, valid_number, require_marker: str | None = None) -> list[dict]:
    records: list[dict] = []
    current: tuple[int, int, list[str]] | None = None
    seen: set[int] = set()
    active = require_marker is None
    for page, lines in pages:
        for line in lines:
            if require_marker and require_marker.lower() in normalize(line):
                active = True
            match = pattern.match(line) if active else None
            if match:
                number = int(match.group(1))
                if not valid_number(number) or number in seen:
                    continue
                if current:
                    records.append(make_record("__PARTY__", current[0], current[2], current[1]))
                seen.add(number)
                rest = match.group(2).strip() if match.lastindex and match.lastindex >= 2 else ""
                current = (page, number, [rest] if rest else [])
                continue
            if current:
                current[2].append(line)
    if current:
        records.append(make_record("__PARTY__", current[0], current[2], current[1]))
    return records


def extract_pp() -> list[dict]:
    pages = pages_for("PP-GENERALES-2023.pdf")
    out = []
    current = None
    seen = set()
    for page, lines in pages:
        if page < 15:
            continue
        for line_index, line in enumerate(lines):
            match = re.match(r"^(\d{1,3})$", line)
            if match and 1 <= int(match.group(1)) <= 365:
                number = int(match.group(1))
                # The PP PDF prints its page number next to the continued
                # proposal number on some pages (for example: 14 / 6).
                if line_index + 1 < len(lines) and re.fullmatch(r"\d{1,3}", lines[line_index + 1]):
                    continue
                if number in seen:
                    continue
                if current:
                    out.append(make_record("PP", current[0], current[2], current[1]))
                seen.add(number)
                current = [page, number, []]
            elif current:
                current[2].append(line)
    if current:
        out.append(make_record("PP", current[0], current[2], current[1]))
    return out


def extract_numbered(party: str, filename: str, max_number: int, marker: str | None = None) -> list[dict]:
    pages = pages_for(filename)
    pattern = re.compile(r"^(\d{1,3})\.\s+(.+)$")
    out = []
    current = None
    seen = set()
    active = marker is None
    for page, lines in pages:
        if page < 7:
            continue
        for line in lines:
            if marker and normalize(marker) in normalize(line):
                active = True
            match = pattern.match(line) if active else None
            if match:
                number = int(match.group(1))
                if not 1 <= number <= max_number or number in seen:
                    continue
                if current:
                    out.append(make_record(party, current[0], current[2], current[1]))
                seen.add(number)
                current = [page, number, [match.group(2)]]
            elif current:
                current[2].append(line)
    if current:
        out.append(make_record(party, current[0], current[2], current[1]))
    return out


def extract_sumar() -> list[dict]:
    pages = pages_for("SUMAR-GENERALES-2023.pdf")
    pattern = re.compile(r"^(\d{1,3})\.\s+(.+)$")
    out = []
    current = None
    for page, lines in pages:
        if page < 7:
            continue
        for line in lines:
            match = pattern.match(line)
            if match and len(match.group(2).strip()) >= 24:
                if current:
                    out.append(make_record("SUMAR", current[0], current[2], current[1]))
                current = [page, int(match.group(1)), [match.group(2)]]
            elif current:
                current[2].append(line)
    if current:
        out.append(make_record("SUMAR", current[0], current[2], current[1]))
    return out


def extract_psoe() -> list[dict]:
    pages = pages_for("PSOE-GENERALES-2023.pdf")
    out = []
    current = None
    for page, lines in pages:
        if page < 15:
            continue
        for line in lines:
            if re.match(r"^[•●▪]\s*", line):
                if current:
                    out.append(make_record("PSOE", current[0], current[1], None))
                current = [page, [re.sub(r"^[•●▪]\s*", "", line)]]
            elif current:
                current[1].append(line)
    if current:
        out.append(make_record("PSOE", current[0], current[1], None))
    # Short bullets are usually navigation fragments or list labels, not measures.
    return [record for record in out if len(record["detail"]) >= 55]


def main() -> None:
    catalogs = {
        "PP": extract_pp(),
        "PSOE": extract_psoe(),
        "SUMAR": extract_sumar(),
        "VOX": extract_numbered("VOX", "VOX-GENERALES-2023.pdf", 365, "NUESTRAS MEDIDAS"),
    }
    payload = {party: records for party, records in catalogs.items()}
    OUTPUT.write_text(
        "window.ELECTION_SOURCE_CATALOG = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print({party: len(records) for party, records in catalogs.items()})


if __name__ == "__main__":
    main()
