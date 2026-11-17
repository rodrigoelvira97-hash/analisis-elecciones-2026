from __future__ import annotations

import json
import math
import re
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "web"
SOURCE_FILES = {
    "PP": "PP-PROGRAMA 2026.pdf",
    "PSOE": "PSOE-programa 2026.pdf",
    "VOX": "VOX-PROGRAMA 2026.pdf",
    "Frente Amplio": "Frente-Amplio-PROGRAMA 2026.pdf",
}

PARTY_CONFIG = {
    "PP": {
        "indexPdfPages": "7",
        "indexPage": 7,
        "minMeasurePage": 12,
        "maxNumber": 249,
        "placeholderNumbers": [83, 109, 132, 164, 167, 200, 210],
        "numberLabel": "Propuesta",
        "blockTitles": [
            "REPARAR EL ESTADO",
            "REGENERAR LA DEMOCRACIA",
            "REUNIR A LA NACIÓN",
            "RECUPERAR LA AMBICIÓN Y LA AUTOESTIMA",
        ],
        "blockPdfPages": [12, 24, 31, 41],
    },
    "PSOE": {
        "indexPdfPages": "2-4",
        "indexPages": [2, 3, 4],
        "minMeasurePage": 14,
        "maxNumber": 500,
        "numberLabel": "Compromiso",
        "blockTitles": [
            "Un modelo económico para el crecimiento y la prosperidad compartida",
            "Una política ambiciosa para garantizar el derecho a la vivienda",
            "Un país que protege: mejores salarios, trabajo digno y menos desigualdad",
            "Un Estado de bienestar fuerte: servicios públicos de calidad para todas las etapas de la vida",
            "Un país que combate el cambio climático y aprovecha la transición verde",
            "La fuerza de la gente, la fuerza de las mujeres",
            "Calidad democrática, convivencia y derechos",
            "España en Europa y en el mundo",
        ],
        "blockPdfPages": [12, 25, 36, 46, 64, 77, 89, 106],
    },
    "VOX": {
        "indexPdfPages": "5",
        "indexPage": 5,
        "minMeasurePage": 7,
        "maxNumber": 115,
        "numberLabel": "Propuesta",
        "blockTitles": [
            "Ceuta y Melilla",
            "Economía, industria y energía",
            "Inmigración",
            "Prioridad nacional",
            "Vivienda",
            "Desregulación",
            "Sector primario y Mundo rural",
            "Sanidad",
            "Educación, Cultura y Deporte",
            "Seguridad y Defensa",
            "Familia y Vida",
            "Independencia de la Justicia y lucha contra la corrupción",
            "Infraestructuras y Transportes",
        ],
        "blockPdfPages": [7, 9, 15, 19, 23, 27, 33, 37, 41, 45, 51, 55, 61],
    },
    "Frente Amplio": {
        "indexPdfPages": "3-5",
        "indexPages": [3, 4, 5],
        "minMeasurePage": 9,
        "numberLabel": "",
        "blockTitles": [
            "Acabar con la especulación y garantizar el derecho a la vivienda",
            "Derechos sociales para una vida digna",
            "Una reforma fiscal en profundidad",
            "Salarios y pensiones dignos y precios asequibles",
            "Continuar el impulso hacia una transición ecológica justa",
            "Estado emprendedor y política industrial activa",
            "Agricultura, ganadería y pesca: hacia su sostenibilidad medioambiental, social y económica",
            "Autónomos, pymes y economía social",
            "Lucha contra la despoblación y retos de la insularidad",
            "Empleo público de calidad",
            "Financiación autonómica y vertebración territorial",
            "Ayuntamientos con recursos y autonomía",
            "Democratización económica y poder financiero",
            "Poder digital y pluralismo informativo",
            "Igualdad y más derechos para todas, todos y todes",
            "Migraciones y antirracismo",
            "La seguridad humana: paz, solidaridad y Europa",
            "Hacia una democracia avanzada",
        ],
        "blockPdfPages": [10, 21, 44, 51, 60, 80, 87, 92, 97, 100, 103, 109, 115, 119, 123, 126, 130, 140],
        "missingTocSections": [
            ("3.1", "Que las grandes empresas paguen lo que les corresponde", 49),
            ("8.1", "Simplificación burocrática, digitalización, protección a las pymes y fiscalidad", 103),
            ("10.1", "Dignificar el empleo público", 112),
            ("16.1", "Ley Integral Antirracismo y el Estatuto del Pueblo Gitano", 149),
        ],
    },
}

BLOCK_OVERRIDES = {
    "VOX": {
        2: ["migracion-asilo"],
        4: ["vivienda-proximidad"],
        7: ["sanidad-salud"],
        11: ["justicia"],
    },
    "Frente Amplio": {
        0: ["vivienda-proximidad"],
        2: ["impuestos-fiscalidad"],
    },
}

# La clasificación usa el índice original y el texto inmediato de cada propuesta.
# Las expresiones de contexto evitan etiquetar una medida por una palabra aislada.
CLASSIFICATION_RULES: dict[str, tuple[str, ...]] = {
    "empleo-formacion": (
        "empleo", "laboral", "trabajo digno", "salarios", "salario mínimo", "convenio colectivo",
        "contratación", "contratos", "desempleo", "formación profesional", "formación para el empleo",
        "mercado de trabajo", "jornada laboral", "derechos laborales", "sindicatos", "autónomos",
    ),
    "empresa-industria": (
        "empresas", "empresarial", "industria", "industrial", "industrialización", "pymes", "pequeñas empresas",
        "innovación", "investigación y desarrollo", "i+d", "productividad", "emprendimiento", "economía social",
        "política industrial", "autonomía estratégica", "transformación productiva",
    ),
    "produccion-rural": (
        "agricultura", "agrícola", "agricultores", "ganadería", "ganadero", "pesca", "pesquero", "sector primario",
        "mundo rural", "campo", "agroalimentario", "cadena alimentaria", "pac agrícola", "pesca artesanal",
        "sanidad animal", "sanidad vegetal", "plagas agrícolas",
    ),
    "impuestos-fiscalidad": (
        "impuestos", "impuesto sobre", "tributación", "tributario", "fiscalidad", "irpf", "iva", "sociedades",
        "presión fiscal", "rebaja fiscal", "bajada de impuestos", "deducción fiscal", "fraude fiscal", "paraísos fiscales",
    ),
    "finanzas-publicas": (
        "presupuestos", "presupuesto público", "gasto público", "deuda pública", "déficit", "regla de gasto",
        "financiación autonómica", "financiación local", "financiación territorial", "condonación de deuda", "estabilidad presupuestaria",
    ),
    "sanidad-salud": (
        "sanidad pública", "sistema sanitario", "salud pública", "atención primaria", "lista de espera", "historia clínica", "tarjeta sanitaria",
        "hospital", "hospitalario", "centro de salud", "profesionales sanitarios", "salud mental", "pediatría", "vacunación",
        "medicamentos", "atención sanitaria", "sistema nacional de salud", "cuidados paliativos",
    ),
    "educacion-conocimiento": (
        "educación", "educativo", "educativa", "enseñanza", "colegio", "escuela", "escolar", "profesorado", "docentes",
        "formación profesional", "universidad", "universitario", "becas", "alumnado", "currículo", "ciencia", "investigación científica",
    ),
    "pensiones-cuidados": (
        "pensiones", "pensión", "pensionistas", "dependencia", "cuidados", "personas cuidadoras", "sistema de cuidados",
        "atención a mayores", "personas mayores", "residencias", "jubilación", "envejecimiento", "autonomía personal",
    ),
    "servicios-sociales": (
        "servicios sociales", "inclusión social", "pobreza", "renta mínima", "ingreso mínimo", "prestación universal",
        "discapacidad", "personas vulnerables", "protección social", "exclusión social", "dependencia económica",
    ),
    "vivienda-proximidad": (
        "vivienda", "viviendas", "alquiler", "inquilinos", "inquilinas", "arrendamiento", "hipoteca", "desahucio",
        "parque público", "vivienda protegida", "suelo residencial", "mercado de la vivienda", "acceso residencial",
    ),
    "coste-vida": (
        "coste de vida", "poder adquisitivo", "precios", "cesta de la compra", "inflación", "consumo de los hogares",
        "factura de la luz", "precio de la energía", "márgenes empresariales", "precios asequibles",
    ),
    "organizacion-territorial": (
        "comunidades autónomas", "financiación autonómica", "competencias autonómicas", "autogobierno", "modelo territorial",
        "organización territorial", "unidad de españa", "unidad nacional", "estado federal", "reforma constitucional",
        "vertebración territorial", "lenguas cooficiales", "administración general del estado", "cooperación interterritorial",
    ),
    "cohesion-territorial": (
        "despoblación", "reto demográfico", "mundo rural", "españa vaciada", "cohesión territorial", "insularidad",
        "servicios en el medio rural", "conectividad rural", "brecha territorial", "equilibrio territorial",
    ),
    "administracion-local": (
        "ayuntamientos", "municipios", "gobiernos locales", "administración local", "entidades locales", "alcaldías", "concejalías",
    ),
    "transporte-infraestructuras": (
        "transporte público", "movilidad sostenible", "ferrocarril", "trenes", "cercanías", "autobús", "carreteras",
        "infraestructura ferroviaria", "transporte de mercancías", "red de transporte", "intermodalidad",
    ),
    "infraestructuras": (
        "infraestructuras", "infraestructura", "conectividad digital", "banda ancha", "red eléctrica", "puertos", "aeropuertos",
        "obras públicas", "infraestructura hidráulica", "red de comunicaciones",
    ),
    "medio-ambiente": (
        "cambio climático", "crisis climática", "emisiones", "descarbonización", "biodiversidad", "protección ambiental",
        "medio ambiente", "economía circular", "residuos", "incendios forestales", "adaptación climática", "transición ecológica",
    ),
    "energia": (
        "energía", "energético", "renovables", "energía renovable", "soberanía energética", "suministro eléctrico", "electricidad",
        "hidrógeno", "red eléctrica", "eficiencia energética", "centrales nucleares", "tarifa eléctrica",
    ),
    "agua": (
        "agua", "hídrico", "recursos hídricos", "sequía", "desalación", "regadío", "plan nacional del agua", "gestión del agua",
        "abastecimiento de agua", "cuenca hidrográfica",
    ),
    "fronteras-control": (
        "control de fronteras", "frontera sur", "control fronterizo", "vigilancia fronteriza", "frontera marítima",
        "entrada irregular", "entrada ilegal", "devolución en frontera", "expulsión inmediata", "tráfico de personas",
    ),
    "migracion-asilo": (
        "inmigración", "migración", "personas migrantes", "personas inmigrantes", "extranjería", "asilo", "refugiados",
        "refugiadas", "regularización de personas migrantes", "regularización de personas extranjeras", "regularización extraordinaria",
        "política migratoria", "inmigrantes", "migrantes", "solicitantes de asilo",
        "personas extranjeras", "retorno de migrantes", "menores extranjeros",
    ),
    "integracion-migracion": (
        "integración de personas migrantes", "integración de migrantes", "integración migratoria", "convivencia intercultural",
        "inclusión de personas migrantes", "antirracismo", "personas refugiadas", "discriminación racial", "racismo contra migrantes",
    ),
    "instituciones-democracia": (
        "democracia", "transparencia", "participación ciudadana", "rendición de cuentas", "parlamento", "constitución",
        "integridad pública", "corrupción", "sistema electoral", "financiación de partidos", "calidad democrática", "instituciones del estado",
    ),
    "justicia": (
        "justicia", "judicial", "jueces", "fiscales", "fiscalía", "poder judicial", "tribunal constitucional", "independencia judicial",
        "administración de justicia", "proceso judicial", "sistema judicial",
    ),
    "administracion-digital": (
        "administración pública", "trámites administrativos", "digitalización de la administración", "servicios digitales", "ventanilla única",
        "interoperabilidad", "administración electrónica", "inteligencia artificial en la administración", "empleo público", "función pública",
    ),
    "seguridad-interior": (
        "seguridad ciudadana", "policía", "guardia civil", "fuerzas y cuerpos de seguridad", "delincuencia", "delitos", "crimen organizado",
        "violencia policial", "seguridad interior", "prisión permanente", "protección de agentes", "seguridad en los barrios",
    ),
    "defensa-soberania": (
        "fuerzas armadas", "defensa nacional", "defensa", "soberanía nacional", "integridad territorial", "ume", "industria de defensa",
        "gasto militar", "misiones militares", "seguridad nacional", "frontera de ceuta", "frontera de melilla",
    ),
    "proteccion-civil": (
        "protección civil", "emergencias", "catástrofes", "inundaciones", "dana", "incendios", "respuesta ante emergencias",
        "prevención de riesgos", "unidad militar de emergencias",
    ),
    "derechos-igualdad": (
        "igualdad", "derechos civiles", "no discriminación", "derechos humanos", "violencia machista", "violencia de género",
        "derechos lgtbi", "libertad de expresión", "memoria democrática", "derechos digitales", "igualdad salarial", "feminismo",
    ),
    "familia-conciliacion": (
        "familias", "familia", "conciliación", "natalidad", "crianza", "infancia", "adolescencia", "maternidad", "paternidad",
        "permiso parental", "corresponsabilidad", "protección a la infancia", "prestación por hijo",
    ),
    "cultura": (
        "cultura", "cultural", "patrimonio cultural", "deporte", "creación artística", "industria cultural", "museos", "lectura",
    ),
    "union-europea": (
        "unión europea", "instituciones europeas", "política europea", "fondos europeos", "parlamento europeo", "comisión europea",
        "mercado único europeo", "consejo europeo",
    ),
    "politica-exterior": (
        "política exterior", "relaciones internacionales", "cooperación internacional", "diplomacia", "iberoamérica", "multilateralismo",
        "ayuda al desarrollo", "oriente medio", "ucrania", "sáhara occidental", "alianzas internacionales", "acción exterior",
    ),
}

STRONG_BODY_PHRASES = {
    "empleo-formacion": ("mercado laboral", "salario mínimo interprofesional", "jornada laboral", "negociación colectiva", "formación para el empleo", "derechos laborales"),
    "empresa-industria": ("política industrial", "transformación productiva", "economía social", "autonomía estratégica", "pequeñas y medianas empresas"),
    "produccion-rural": ("sector primario", "mundo rural", "cadena alimentaria", "política pesquera común"),
    "impuestos-fiscalidad": ("sistema tributario", "reforma fiscal", "presión fiscal", "impuesto sobre la renta", "impuesto de sociedades", "impuesto sobre el patrimonio", "fraude fiscal", "bajada de impuestos"),
    "finanzas-publicas": ("deuda pública", "gasto público", "financiación autonómica", "financiación local", "regla de gasto", "estabilidad presupuestaria"),
    "sanidad-salud": ("atención primaria", "lista de espera", "tarjeta sanitaria", "historia clínica", "salud mental", "sistema nacional de salud", "profesionales sanitarios"),
    "educacion-conocimiento": ("formación profesional", "educación pública", "educación infantil", "becas universitarias", "sistema educativo", "alumnado universitario"),
    "pensiones-cuidados": ("sistema de cuidados", "sistema de dependencia", "pensiones públicas", "personas cuidadoras", "atención a mayores"),
    "servicios-sociales": ("servicios sociales", "inclusión social", "ingreso mínimo vital", "prestación universal por crianza", "lucha contra la pobreza"),
    "vivienda-proximidad": ("parque público de vivienda", "vivienda protegida", "acceso a la vivienda", "mercado de la vivienda", "derecho a la vivienda"),
    "coste-vida": ("coste de vida", "poder adquisitivo", "cesta de la compra", "control de márgenes", "precios asequibles"),
    "organizacion-territorial": ("financiación autonómica", "competencias autonómicas", "unidad de españa", "estado autonómico", "modelo territorial", "autogobierno"),
    "cohesion-territorial": ("reto demográfico", "cohesión territorial", "despoblación", "mundo rural", "españa vaciada", "insularidad"),
    "administracion-local": ("administración local", "gobiernos locales", "financiación local", "ayuntamientos"),
    "transporte-infraestructuras": ("transporte público", "movilidad sostenible", "transporte de mercancías", "red ferroviaria", "infraestructura ferroviaria"),
    "infraestructuras": ("plan nacional de infraestructuras", "red eléctrica", "banda ancha", "infraestructura hidráulica", "conectividad digital"),
    "medio-ambiente": ("cambio climático", "crisis climática", "transición ecológica", "economía circular", "protección ambiental", "biodiversidad"),
    "energia": ("soberanía energética", "energía renovable", "suministro eléctrico", "eficiencia energética", "transición energética"),
    "agua": ("plan nacional del agua", "gestión del agua", "recursos hídricos", "abastecimiento de agua", "cuenca hidrográfica"),
    "fronteras-control": ("control de fronteras", "frontera sur", "control fronterizo", "vigilancia fronteriza", "devolución en frontera", "entrada irregular"),
    "migracion-asilo": ("política migratoria", "solicitantes de asilo", "personas migrantes", "regularización de migrantes", "protección internacional", "vías legales y seguras"),
    "integracion-migracion": ("integración de personas migrantes", "integración de migrantes", "convivencia intercultural", "discriminación racial", "antirracismo"),
    "instituciones-democracia": ("calidad democrática", "rendición de cuentas", "transparencia pública", "sistema electoral", "financiación de partidos", "integridad pública"),
    "justicia": ("independencia judicial", "administración de justicia", "poder judicial", "tribunal constitucional", "sistema judicial"),
    "administracion-digital": ("administración electrónica", "ventanilla única", "digitalización de la administración", "empleo público", "función pública"),
    "seguridad-interior": ("seguridad ciudadana", "fuerzas y cuerpos de seguridad", "crimen organizado", "seguridad en los barrios", "protección de agentes"),
    "defensa-soberania": ("fuerzas armadas", "defensa nacional", "industria de defensa", "soberanía nacional", "integridad territorial"),
    "proteccion-civil": ("protección civil", "respuesta ante emergencias", "unidad militar de emergencias", "prevención de riesgos"),
    "derechos-igualdad": ("derechos humanos", "igualdad salarial", "violencia machista", "violencia de género", "derechos lgtbi", "libertad de expresión"),
    "familia-conciliacion": ("prestación universal por crianza", "permiso parental", "conciliación familiar", "protección a la infancia", "apoyo a las familias"),
    "cultura": ("patrimonio cultural", "industria cultural", "creación artística", "participación cultural"),
    "union-europea": ("unión europea", "instituciones europeas", "comisión europea", "fondos europeos", "parlamento europeo"),
    "politica-exterior": ("política exterior", "relaciones internacionales", "cooperación internacional", "ayuda al desarrollo", "acción exterior"),
}

STOP_WORDS = set("""
a al algo algunas algunos ante antes como con contra cual cuando de del desde donde durante e el ella ellas ellos en entre era es esa ese eso esta estaba este esto estos fue ha hacia hasta hay la las le les lo los mas más me mi mis mucha mucho muchas muchos nada ni no nos o otra otras otro otros para pero por porque que se ser si sin sobre son su sus te tenga tiene tienen toda todas todo todos tras tu tus un una unas uno unos y ya
acuerdo avanzar avanzar avanzaríamos aprobar aprobaremos aprobarán apoyar apoyaremos garantizar garantizaremos impulsar impulsaremos promover promoveremos mejorar mejoraremos reforzar reforzaremos desarrollar desarrollaremos crear crearemos establecer estableceremos ampliar ampliaremos reducir reduciremos asegurar aseguraremos hacer haremos será serán debe deben deberá podrán podrá necesario medida medidas propuesta propuestas plan marco ley proyecto sistema programa país españa español españoles española gobierno estatal nacional público pública públicos públicas ciudadano ciudadanos persona personas derecho derechos política políticas acción actuaciones administración conjunto forma través objetivo objetivos garantizará garantizarán
""".split())
STOP_WORDS.update({
    "años", "año", "actual", "actuales", "asimismo", "común", "comunes", "cada", "caso", "casos", "centro", "centros",
    "comunidad", "comunidades", "conjunto", "cualquier", "dicho", "dicha", "demás", "efecto", "efectos", "españa", "español",
    "española", "españoles", "españolas", "estado", "estados", "forma", "general", "generales", "gran", "grandes", "hoy",
    "mediante", "nacional", "nacionales", "nuestro", "nuestra", "nuestros", "nuestras", "país", "países", "parte", "personas",
    "público", "pública", "públicos", "públicas", "realizar", "realizará", "realizarán", "sociedad", "social", "sociales", "todo",
    "todos", "todas", "toda", "tener", "tendrá", "tendrán", "través", "veces", "vida", "vigente", "vigentes", "ámbito", "ámbitos",
})
def normalize(value: str) -> str:
    value = unicodedata.normalize("NFD", value)
    value = "".join(char for char in value if unicodedata.category(char) != "Mn")
    value = value.replace("\u00ad", "")
    return re.sub(r"\s+", " ", value).strip().lower()


STOP_WORDS = {normalize(word) for word in STOP_WORDS}


def searchable(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", normalize(value)).strip()


def contains_phrase(value: str, phrase: str) -> bool:
    haystack = f" {searchable(value)} "
    needle = f" {searchable(phrase)} "
    return needle != "  " and needle in haystack


def clean_lines(raw: str) -> list[str]:
    raw = raw.replace("\r", "").replace("\u00ad", "")
    raw = re.sub(r"(?<=[^\W\d_])\s*-\s*\n\s*(?=[^\W\d_])", "", raw)
    lines = []
    for line in raw.split("\n"):
        line = re.sub(r"(?<=\w)-\s+(?=\w)", "", line)
        line = re.sub(r"\s+", " ", line).strip()
        if line:
            lines.append(line)
    return lines


def read_pages(filename: str) -> list[tuple[int, list[str]]]:
    reader = PdfReader(str(ROOT / filename))
    return [(index, clean_lines(page.extract_text() or "")) for index, page in enumerate(reader.pages, 1)]


def flatten(lines: list[str]) -> str:
    return re.sub(r"\s+", " ", " ".join(lines)).strip()


def clean_toc_title(value: str) -> str:
    value = re.sub(r"\s+", " ", value).strip()
    value = re.sub(r"\s*\.{1,}\s*\d{1,3}\.?\s*$", "", value).strip(" .")
    value = re.sub(r"\s*-\s*Pág\.\s*\d{1,3}\s*$", "", value, flags=re.I).strip(" .")
    return value


def parse_pp_index(pages: list[tuple[int, list[str]]]) -> dict:
    toc = next(lines for page, lines in pages if page == PARTY_CONFIG["PP"]["indexPage"])
    sections: list[dict] = []
    current_code = None
    current_lines: list[str] = []
    for line in toc:
        if re.match(r"^\d+\.\d+\s+", line):
            if current_code:
                sections.append({"code": current_code, "title": clean_toc_title(" ".join(current_lines)), "page": current_page, "pdfPageStart": current_page})
            match = re.match(r"^(\d+\.\d+)\s+(.*)$", line)
            current_code, current_lines = match.group(1), [match.group(2)]
            current_page = None
        elif current_code:
            current_lines.append(line)
        if current_code:
            page_match = re.search(r"-\s*Pág\.\s*(\d+)", line, flags=re.I)
            if page_match:
                current_page = int(page_match.group(1))
                sections.append({"code": current_code, "title": clean_toc_title(" ".join(current_lines)), "page": current_page, "pdfPageStart": current_page})
                current_code, current_lines = None, []
    blocks = []
    for block_index, title in enumerate(PARTY_CONFIG["PP"]["blockTitles"]):
        block_sections = [section for section in sections if int(section["code"].split(".")[0]) == block_index + 1]
        blocks.append({
            "title": title,
            "page": block_sections[0]["page"] if block_sections else PARTY_CONFIG["PP"]["blockPdfPages"][block_index],
            "pdfPageStart": PARTY_CONFIG["PP"]["blockPdfPages"][block_index],
            "sections": block_sections,
        })
    return {"indexPdfPages": PARTY_CONFIG["PP"]["indexPdfPages"], "blocks": blocks}


def extract_period_toc_rows(pages: list[tuple[int, list[str]]], index_pages: list[int]) -> list[tuple[str, int]]:
    page_map = dict(pages)
    rows: list[tuple[str, int]] = []
    buffer: list[str] = []
    for page in index_pages:
        for line in page_map[page]:
            if line.strip() in {"ÍNDICE", "Contenido"} or re.fullmatch(r"\d{1,2}", line.strip()):
                continue
            buffer.append(line)
            suffix = re.search(r"\.{1,}\s*(\d{1,3})\.?\s*$", line)
            if not suffix:
                continue
            printed_page = int(suffix.group(1))
            title = clean_toc_title(" ".join(buffer))
            if title:
                rows.append((title, printed_page))
            buffer = []
    return rows


def parse_psoe_index(pages: list[tuple[int, list[str]]]) -> dict:
    cfg = PARTY_CONFIG["PSOE"]
    rows = extract_period_toc_rows(pages, cfg["indexPages"])
    blocks = []
    active_index = None
    main_titles = [normalize(title) for title in cfg["blockTitles"]]
    for title, page in rows:
        normalized = normalize(title)
        matched = next((index for index, expected in enumerate(main_titles) if normalized == expected), None)
        if matched is not None:
            active_index = matched
            blocks.append({
                "title": cfg["blockTitles"][matched],
                "page": page,
                "pdfPageStart": cfg["blockPdfPages"][matched],
                "sections": [],
            })
            continue
        if active_index is None:
            continue
        # Repair one contents line where the PDF text layer joined two rows.
        merged = re.search(r"^(.*?)\s+84\s+Igualdad en las instituciones, voz en la vida pública$", title)
        if merged:
            blocks[active_index]["sections"].append({"title": merged.group(1).strip(" ."), "page": 84, "pdfPageStart": 84})
            blocks[active_index]["sections"].append({"title": "Igualdad en las instituciones, voz en la vida pública", "page": 86, "pdfPageStart": 86})
            continue
        blocks[active_index]["sections"].append({"title": title, "page": page, "pdfPageStart": page})
    return {"indexPdfPages": cfg["indexPdfPages"], "blocks": blocks}


def fa_toc_sections(pages: list[tuple[int, list[str]]]) -> list[dict]:
    cfg = PARTY_CONFIG["Frente Amplio"]
    page_map = dict(pages)
    toc_text = " ".join(flatten(page_map[page]) for page in cfg["indexPages"])
    starts = list(re.finditer(r"(?<![\d.])(\d{1,2}\.\d{1,2})\.\s*", toc_text))
    sections = []
    seen: set[str] = set()
    for index, match in enumerate(starts):
        code = match.group(1)
        if code in seen:
            continue
        seen.add(code)
        end = starts[index + 1].start() if index + 1 < len(starts) else len(toc_text)
        # A top-level chapter can appear between two numbered subsections.
        top_level = re.search(r"(?<![\d.])\d{1,2}\.\s+(?=[A-ZÁÉÍÓÚÑ])", toc_text[match.end():end])
        if top_level:
            end = match.end() + top_level.start()
        entry = toc_text[match.start():end]
        page_match = re.search(r"\s(\d{1,3})\s*$", entry)
        if not page_match:
            continue
        printed_page = int(page_match.group(1))
        title = re.sub(r"^\d{1,2}\.\d{1,2}\.\s*", "", entry[:page_match.start()]).strip(" .")
        sections.append({"code": code, "title": title, "page": printed_page, "pdfPageStart": None})

    for code, title, printed_page in cfg["missingTocSections"]:
        if code not in seen:
            sections.append({"code": code, "title": title, "page": printed_page, "pdfPageStart": None})
    sections.sort(key=lambda section: tuple(int(part) for part in section["code"].split(".")))

    body_pages = [(page, lines) for page, lines in pages if page > 5]
    for section in sections:
        code = re.escape(section["code"])
        for page, lines in body_pages:
            if any(re.match(rf"^{code}\.\s+", line) for line in lines):
                section["pdfPageStart"] = page
                break
        if section["pdfPageStart"] is None:
            # A few headings are split by the PDF text layer; page ranges still
            # remain correct for all following proposals once the next heading is found.
            block_index = int(section["code"].split(".")[0]) - 1
            section["pdfPageStart"] = cfg["blockPdfPages"][block_index]

    blocks = []
    for block_index, title in enumerate(cfg["blockTitles"]):
        block_sections = [section for section in sections if int(section["code"].split(".")[0]) == block_index + 1]
        blocks.append({
            "title": title,
            "page": block_sections[0]["page"] if block_sections else cfg["blockPdfPages"][block_index],
            "pdfPageStart": cfg["blockPdfPages"][block_index],
            "sections": block_sections,
        })
    return {"indexPdfPages": cfg["indexPdfPages"], "blocks": blocks}


def parse_vox_index() -> dict:
    cfg = PARTY_CONFIG["VOX"]
    return {
        "indexPdfPages": cfg["indexPdfPages"],
        "blocks": [
            {"title": title, "page": page, "pdfPageStart": page, "sections": []}
            for title, page in zip(cfg["blockTitles"], cfg["blockPdfPages"])
        ],
    }


def program_structure(all_pages: dict[str, list[tuple[int, list[str]]]]) -> dict:
    structures = {
        "PP": parse_pp_index(all_pages["PP"]),
        "PSOE": parse_psoe_index(all_pages["PSOE"]),
        "VOX": parse_vox_index(),
        "Frente Amplio": fa_toc_sections(all_pages["Frente Amplio"]),
    }
    parties = {}
    for name, structure in structures.items():
        parties[name] = {
            "sourceFile": SOURCE_FILES[name],
            "indexPdfPages": structure["indexPdfPages"],
            "numberLabel": PARTY_CONFIG[name]["numberLabel"],
            "blocks": structure["blocks"],
        }
    return {"year": 2026, "parties": parties}


def find_block_index(blocks: list[dict], page: int) -> int:
    index = 0
    for candidate, block in enumerate(blocks):
        if page >= block["pdfPageStart"]:
            index = candidate
        else:
            break
    return index


def find_section_index(block: dict, page: int) -> int | None:
    index = None
    for candidate, section in enumerate(block.get("sections", [])):
        if page >= section.get("pdfPageStart", block["pdfPageStart"]):
            index = candidate
        else:
            break
    return index


def is_document_heading(line: str, known_headings: set[str] | None = None) -> bool:
    normalized = normalize(line).strip(" .-–—")
    normalized = re.sub(r"\s*-\s*p[aá]g\.\s*\d{1,3}\s*$", "", normalized).strip(" .-–—")
    return bool(known_headings and any(
        normalized == heading
        or normalized.startswith(f"{heading}:")
        or normalized.startswith(f"{heading} - pag.")
        for heading in known_headings
    ))


def strip_document_noise(line: str, known_headings: set[str] | None = None) -> bool:
    normalized = normalize(line).strip(" .-–—")
    normalized = re.sub(r"\s*-\s*p[aá]g\.\s*\d{1,3}\s*$", "", normalized).strip(" .-–—")
    if not normalized or re.fullmatch(r"\d{1,4}", normalized):
        return True
    if known_headings and normalized in known_headings:
        return True
    if normalized in {
        "es sentido común", "programa electoral", "índice", "contenido", "el programa del cambio necesario para españa",
        "frente amplio", "partido popular", "psoe", "vox", "nuestras medidas", "propuestas", "medidas",
    }:
        return True
    return False


def clean_record_text(lines: list[str], known_headings: set[str] | None = None, party: str = "") -> str:
    kept = [line for line in lines if not strip_document_noise(line, known_headings)]
    text = re.sub(r"\s+", " ", " ".join(kept)).strip()
    if party == "VOX":
        text = re.sub(r"\bES SENTIDO COMÚN\b", "", text, flags=re.I)
        text = re.sub(r"\s+", " ", text).strip()
    return text


def make_title_detail(text: str) -> tuple[str, str]:
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return "Propuesta sin texto extraíble", ""
    colon = text.find(":")
    if 18 <= colon <= 130:
        title = text[:colon].strip(" .:;–—")
    else:
        sentence = re.split(r"(?<=[.!?])\s+", text, maxsplit=1)[0]
        title = sentence.strip()
        if len(title) < 22:
            title = text[:150].strip()
    if len(title) > 160:
        title = title[:157].rsplit(" ", 1)[0] + "…"
    title_prefix = title[:-1] if title.endswith("…") else title
    detail_text = text[len(title_prefix):].lstrip(" .:;–—") if text.startswith(title_prefix) else text
    detail = detail_text[:720].strip()
    if len(detail_text) > len(detail):
        detail = detail.rstrip() + "…"
    return title, detail


def classification_for(record: dict, party: str) -> list[str]:
    # La sección del índice suele abarcar muchas medidas distintas. No debe
    # etiquetar automáticamente cada propuesta de un capítulo con su tema.
    contextual = record["title"]
    body = record.get("fullText", "")
    result: list[str] = []
    overrides = BLOCK_OVERRIDES.get(party, {}).get(record["originalBlockIndex"], [])
    for subtheme, anchors in CLASSIFICATION_RULES.items():
        if subtheme in overrides:
            result.append(subtheme)
            continue
        if any(contains_phrase(contextual, anchor) for anchor in anchors):
            result.append(subtheme)
            continue
        strong = STRONG_BODY_PHRASES.get(subtheme, ())
        if any(contains_phrase(body, phrase) for phrase in strong):
            result.append(subtheme)
    # Remove adjacent duplicate concepts and keep labels focused.
    return result[:4]


def section_for_line(party: str, line: str, block: dict, current: int | None) -> int | None:
    if party == "PP":
        match = re.match(r"^(\d+\.\d+)\s+", line)
        if match:
            for index, section in enumerate(block.get("sections", [])):
                if section.get("code") == match.group(1):
                    return index
    if party == "Frente Amplio":
        match = re.match(r"^(\d+\.\d+)\.\s+", line)
        if match:
            for index, section in enumerate(block.get("sections", [])):
                if section.get("code") == match.group(1):
                    return index
    return current


def extract_records(party: str, pages: list[tuple[int, list[str]]], structure: dict) -> list[dict]:
    cfg = PARTY_CONFIG[party]
    blocks = structure["parties"][party]["blocks"]
    source_headings = [
        clean_toc_title(title)
        for block in blocks
        for title in [block["title"], *(section["title"] for section in block.get("sections", []))]
    ]
    known_headings = {normalize(title) for title in source_headings}
    known_headings.update(normalize(title.split(":", 1)[0]) for title in source_headings if ":" in title)
    records: list[dict] = []
    seen: set[int] = set()
    current: dict | None = None
    active_block = 0
    active_section: int | None = None
    bullet_index = 0

    def finish() -> None:
        nonlocal current
        if not current:
            return
        text = clean_record_text(current["lines"], known_headings, party)
        if len(text) < 18:
            current = None
            return
        title, detail = make_title_detail(text)
        block_index = current["blockIndex"]
        section_index = current["sectionIndex"]
        section = blocks[block_index].get("sections", [])
        section_title = section[section_index]["title"] if section_index is not None and section_index < len(section) else blocks[block_index]["title"]
        record = {
            "id": current["id"],
            "title": title,
            "detail": detail,
            "fullText": text,
            "page": current["page"],
            "number": current.get("number"),
            "numberLabel": cfg["numberLabel"],
            "section": section_title,
            "blockTitle": blocks[block_index]["title"],
            "subthemeIds": [],
            "priorityIndex": block_index,
            "originalBlockIndex": block_index,
            "originalSectionIndex": section_index,
            "kind": "document",
        }
        record["subthemeIds"] = classification_for(record, party)
        records.append(record)
        current = None

    for page, lines in pages:
        if page < cfg["minMeasurePage"]:
            continue
        block_index = find_block_index(blocks, page)
        if block_index != active_block:
            finish()
            active_block = block_index
            active_section = find_section_index(blocks[active_block], page)
        else:
            page_section = find_section_index(blocks[active_block], page)
            if page_section is not None:
                active_section = page_section

        for line in lines:
            if current and is_document_heading(line, known_headings):
                finish()
                continue
            marker_section = section_for_line(party, line, blocks[active_block], active_section)
            if marker_section != active_section:
                finish()
                active_section = marker_section
                if (party == "PP" and re.match(r"^\d+\.\d+\s+", line)) or (party == "Frente Amplio" and re.match(r"^\d+\.\d+\.\s+", line)):
                    continue

            if party == "Frente Amplio":
                if re.match(r"^\d{1,2}\.\d{1,2}\.\s+", line):
                    finish()
                    continue
                if line.startswith("●"):
                    finish()
                    bullet_index += 1
                    rest = re.sub(r"^●\s*", "", line).strip()
                    current = {
                        "id": f"FA26-B{bullet_index:04d}",
                        "page": page,
                        "number": None,
                        "lines": [rest] if rest else [],
                        "blockIndex": active_block,
                        "sectionIndex": active_section,
                    }
                elif current:
                    current["lines"].append(line)
                continue

            if party == "PP":
                if re.match(r"^\d+\.\d+\s+", line):
                    continue
                match = re.match(r"^(\d{1,3})\s+(.+)$", line)
            else:
                match = re.match(r"^(\d{1,3})\.\s+(.+)$", line)
                if not match:
                    standalone = re.fullmatch(r"(\d{1,3})\.", line)
                    if standalone:
                        number = int(standalone.group(1))
                        if 1 <= number <= cfg["maxNumber"] and number not in seen:
                            finish()
                            seen.add(number)
                            current = {
                                "id": f"{party.replace(' ', '')[:3].upper()}26-N{number:04d}",
                                "page": page,
                                "number": number,
                                "lines": [],
                                "blockIndex": active_block,
                                "sectionIndex": active_section,
                            }
                            continue
            if match:
                number = int(match.group(1))
                if 1 <= number <= cfg["maxNumber"] and number not in seen:
                    finish()
                    seen.add(number)
                    current = {
                        "id": f"{party.replace(' ', '')[:3].upper()}26-N{number:04d}",
                        "page": page,
                        "number": number,
                        "lines": [match.group(2)],
                        "blockIndex": active_block,
                        "sectionIndex": active_section,
                    }
                    continue
            if current:
                current["lines"].append(line)
    finish()
    return records


def tokens(value: str) -> list[str]:
    value = normalize(value)
    words = re.findall(r"[a-záéíóúñ]+", value)
    result = []
    for word in words:
        if len(word) < 4 or word in STOP_WORDS:
            continue
        if word.endswith("es") and len(word) > 6:
            word = word[:-2]
        elif word.endswith("s") and len(word) > 5:
            word = word[:-1]
        result.append(word)
    return result


def build_relations(catalogs: dict[str, list[dict]]) -> tuple[dict, dict]:
    all_records = [record for name in catalogs for record in catalogs[name]]
    document_frequency = Counter()
    vectors: dict[str, dict[str, float]] = {}
    raw_terms: dict[str, set[str]] = {}
    term_counts: dict[str, Counter] = {}
    record_lookup = {record["id"]: record for records in catalogs.values() for record in records}
    records_by_party_tag: dict[str, dict[str, list[dict]]] = {}
    ids_by_party_tag: dict[str, dict[str, set[str]]] = {}
    anchor_terms = {
        tag: set(tokens(" ".join(anchors)))
        for tag, anchors in CLASSIFICATION_RULES.items()
    }

    for record in all_records:
        counts = Counter(tokens(record["fullText"]))
        counts.update({token: count * 2 for token, count in Counter(tokens(record["title"])).items()})
        term_counts[record["id"]] = counts
        terms = set(counts)
        raw_terms[record["id"]] = terms
        document_frequency.update(terms)

    total = max(len(all_records), 1)
    rare_limit = max(15, int(total * 0.08))
    rare_terms_by_id = {
        record["id"]: {term for term in raw_terms[record["id"]] if document_frequency[term] <= rare_limit}
        for record in all_records
    }
    inverted_rare_terms: dict[str, dict[str, set[str]]] = defaultdict(lambda: defaultdict(set))
    for party, records in catalogs.items():
        for record in records:
            for term in rare_terms_by_id[record["id"]]:
                inverted_rare_terms[term][party].add(record["id"])

    for record in all_records:
        counts = term_counts[record["id"]]
        weighted = {term: (1.0 + math.log(count)) * (math.log((total + 1) / (document_frequency[term] + 1)) + 1.0) for term, count in counts.items()}
        norm = math.sqrt(sum(value * value for value in weighted.values())) or 1.0
        vectors[record["id"]] = {term: value / norm for term, value in weighted.items()}

    for party, records in catalogs.items():
        by_tag: dict[str, list[dict]] = defaultdict(list)
        for record in records:
            for tag in set(record["subthemeIds"]):
                by_tag[tag].append(record)
        records_by_party_tag[party] = by_tag
        ids_by_party_tag[party] = {tag: {record["id"] for record in tagged} for tag, tagged in by_tag.items()}

    relations: dict[str, list[dict]] = {}
    related_counts: Counter = Counter()
    for source_party, source_records in catalogs.items():
        for source in source_records:
            source_tags = set(source["subthemeIds"])
            if not source_tags:
                continue
            source_rare_terms = rare_terms_by_id[source["id"]]
            if len(source_rare_terms) < 2:
                continue
            per_party: dict[str, list[dict]] = defaultdict(list)
            for target_party in catalogs:
                if target_party == source_party:
                    continue
                candidates = []
                possible_ids = set()
                for term in source_rare_terms:
                    possible_ids.update(inverted_rare_terms.get(term, {}).get(target_party, set()))
                tagged_ids = set()
                for tag in source_tags:
                    tagged_ids.update(ids_by_party_tag[target_party].get(tag, set()))
                for target_id in possible_ids.intersection(tagged_ids):
                    target = record_lookup[target_id]
                    common_tags = source_tags.intersection(target["subthemeIds"])
                    a, b = vectors[source["id"]], vectors[target["id"]]
                    if len(a) > len(b):
                        a, b = b, a
                    score = sum(value * b.get(term, 0.0) for term, value in a.items())
                    shared = raw_terms[source["id"]].intersection(raw_terms[target["id"]])
                    evidence = sorted(
                        (term for term in shared if document_frequency[term] <= rare_limit),
                        key=lambda term: (-math.log((total + 1) / (document_frequency[term] + 1)), -len(term), term),
                    )[:4]
                    if len(evidence) < 2:
                        continue
                    if score < 0.12:
                        continue
                    subtheme = max(
                        common_tags,
                        key=lambda tag: len(shared.intersection(anchor_terms.get(tag, set()))),
                    )
                    candidates.append({
                        "party": target_party,
                        "id": target["id"],
                        "subthemeId": subtheme,
                        "sharedTerms": evidence[:3],
                        "sharedPhrase": "",
                        "score": round(score, 4),
                    })
                candidates.sort(key=lambda candidate: (-candidate["score"], -len(candidate["sharedTerms"]), candidate["id"]))
                per_party[target_party] = candidates[:2]
            selected = [candidate for target_party in catalogs if target_party != source_party for candidate in per_party.get(target_party, [])]
            if selected:
                relations[source["id"]] = selected
                related_counts[source_party] += 1
    return relations, dict(related_counts)


def write_js(path: Path, variable: str, payload) -> None:
    path.write_text(f"window.{variable} = " + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")


def main() -> None:
    pages = {party: read_pages(filename) for party, filename in SOURCE_FILES.items()}
    structure = program_structure(pages)
    catalogs = {party: extract_records(party, pages[party], structure) for party in SOURCE_FILES}
    relations, related_counts = build_relations(catalogs)

    write_js(WEB / "program-structure-2026.js", "ELECTION_PROGRAM_STRUCTURE", structure)
    write_js(WEB / "source-catalog-2026.js", "ELECTION_SOURCE_CATALOG", catalogs)
    write_js(WEB / "measure-relations-2026.js", "ELECTION_MEASURE_RELATIONS", relations)

    print("Unidades extraídas:", {party: len(records) for party, records in catalogs.items()})
    print("Bloques del índice:", {party: len(structure["parties"][party]["blocks"]) for party in catalogs})
    print("Apartados del índice:", {party: sum(len(block["sections"]) for block in structure["parties"][party]["blocks"]) for party in catalogs})
    print("Propuestas con subtema:", {party: sum(bool(record["subthemeIds"]) for record in records) for party, records in catalogs.items()})
    print("Propuestas con relaciones candidatas:", related_counts)
    print("Relaciones candidatas:", sum(len(items) for items in relations.values()))
    missing = {}
    for party, records in catalogs.items():
        if PARTY_CONFIG[party]["numberLabel"]:
            found = {record["number"] for record in records if record["number"] is not None}
            missing[party] = [number for number in range(1, PARTY_CONFIG[party]["maxNumber"] + 1) if number not in found]
    print("Numeración no localizada:", {party: gaps[:30] for party, gaps in missing.items() if gaps})
    print("Marcadores promocionales del PP omitidos:", PARTY_CONFIG["PP"]["placeholderNumbers"])
    for party in catalogs:
        path = WEB / ("source-catalog-2026.js" if party == "PP" else "measure-relations-2026.js")
        if not path.exists():
            raise RuntimeError("No se generó el catálogo local esperado")


if __name__ == "__main__":
    main()
