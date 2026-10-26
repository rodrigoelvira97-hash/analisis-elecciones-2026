"""Search programme PDFs by term and report PDF page numbers."""

import argparse
import re
import sys
from pathlib import Path

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    parser = argparse.ArgumentParser()
    parser.add_argument("term", help="Texto o expresión regular que se desea buscar")
    parser.add_argument("files", nargs="*", help="PDF concretos; por defecto, todos")
    args = parser.parse_args()

    pattern = re.compile(args.term, re.IGNORECASE)
    pdfs = [ROOT / name for name in args.files] if args.files else sorted(ROOT.glob("*.pdf"))

    for pdf_path in pdfs:
        reader = PdfReader(str(pdf_path))
        for page_number, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or ""
            if pattern.search(text):
                compact = " ".join(text.split())
                match = pattern.search(compact)
                start = max(0, (match.start() if match else 0) - 120)
                end = min(len(compact), (match.end() if match else 0) + 220)
                print(f"{pdf_path.name}\tPDF p. {page_number}\t{compact[start:end]}")


if __name__ == "__main__":
    main()
