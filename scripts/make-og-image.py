"""Render public/og-image.png (1200x630) from the extracted horizontal logo.

Usage (from the project root, after extract-logo.py):
    python -I scripts/make-og-image.py
"""

from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
LOGO = ROOT / "app" / "assets" / "logo" / "logo-horizontal.svg"
OUT = ROOT / "public" / "og-image.png"
PAPER = (248, 249, 250)


def main() -> None:
    doc = pymupdf.open(LOGO)
    page = doc[0]
    target_width = 860
    zoom = target_width / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=True)
    logo = Image.frombytes("RGBA", (pix.width, pix.height), pix.samples)

    canvas = Image.new("RGB", (1200, 630), PAPER)
    canvas.paste(logo, ((1200 - logo.width) // 2, (630 - logo.height) // 2), logo)
    canvas.save(OUT, "PNG", optimize=True)
    print("wrote", OUT.relative_to(ROOT), canvas.size)


if __name__ == "__main__":
    main()
