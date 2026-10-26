"""Extract text and basic metadata from the electoral programme PDFs.

Usage:
    python tools/extract_pdf_text.py

The generated text files are temporary working material and are written to
tmp/pdf_text so the source PDFs remain unchanged.
"""

from pathlib import Path

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "tmp" / "pdf_text"


def extract_pdf(pdf_path: Path) -> tuple[int, int]:
    reader = PdfReader(str(pdf_path))
    pages = []
    for page_number, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        pages.append(f"--- PAGE {page_number} ---\n{text}")

    output_path = OUTPUT_DIR / f"{pdf_path.stem}.txt"
    output_path.write_text("\n\n".join(pages), encoding="utf-8")
    return len(reader.pages), output_path.stat().st_size


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    pdfs = sorted(ROOT.glob("*.pdf"))
    if not pdfs:
        raise SystemExit("No se han encontrado PDF en la carpeta raíz del proyecto.")

    for pdf_path in pdfs:
        page_count, text_size = extract_pdf(pdf_path)
        print(f"{pdf_path.name}\t{page_count} páginas\t{text_size} bytes de texto")


if __name__ == "__main__":
    main()
