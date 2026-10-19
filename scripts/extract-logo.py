"""Extract logo SVGs from the supplied logo PDF without redrawing them.

Usage (from the project root):
    python -I scripts/extract-logo.py docs/source/entometrics-africa-logo-wordmark.pdf

Writes app/assets/logo/*.svg and public/favicon.svg.

The PDF holds the mark as vector paths and the wordmark as Type3 text, so the
page is exported with text converted to outlines. Paths and colours are copied
verbatim. The horizontal lockup is a derived arrangement (pending client
approval): the original mark and the original wordmark placed side by side, the
wordmark uniformly scaled so it stays legible at header size.
"""

import re
import sys
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "app" / "assets" / "logo"

# Bounds in PDF points, measured with page.get_drawings() / get_text("dict").
MARK = pymupdf.Rect(80, 101, 337, 279)
WORDMARK = pymupdf.Rect(144, 302, 273, 346)
STACKED = pymupdf.Rect(78, 99, 339, 348)
# Capsule and hexagons without the side waves, for the favicon.
ICON = pymupdf.Rect(116, 99, 301, 281)

NS = 'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"'


def export(pdf_path: Path) -> tuple[str, list[str], list[str]]:
    """Return (glyph defs, mark path elements, wordmark glyph elements)."""
    doc = pymupdf.open(pdf_path)
    svg = doc[0].get_svg_image(text_as_path=True)
    doc.close()
    defs = re.search(r"<defs>(.*?)</defs>", svg, flags=re.S).group(1)
    # Drop the page-level clip rect; keep only glyph definitions.
    defs = re.sub(r"<clipPath.*?</clipPath>", "", defs, flags=re.S)
    body = svg[svg.index("</defs>") + len("</defs>"):]
    paths = re.findall(r"<path\b[^>]*/>", body)
    glyphs = re.findall(r"<use\b[^>]*/>", body)
    return defs, paths, glyphs


def doc_svg(view: pymupdf.Rect | str, content: str) -> str:
    vb = view if isinstance(view, str) else f"{view.x0:g} {view.y0:g} {view.width:g} {view.height:g}"
    return (
        f'<svg {NS} viewBox="{vb}" role="img" aria-label="EntoMetrics Africa">'
        f"<title>EntoMetrics Africa</title>{content}</svg>\n"
    )


def main() -> None:
    pdf = Path(sys.argv[1])
    OUT.mkdir(parents=True, exist_ok=True)
    defs, paths, glyphs = export(pdf)
    mark = "".join(paths)
    word = "".join(glyphs)

    (OUT / "logo-stacked.svg").write_text(
        doc_svg(STACKED, f"<defs>{defs}</defs>{mark}{word}"), encoding="utf-8"
    )
    (OUT / "logo-mark.svg").write_text(doc_svg(MARK, mark), encoding="utf-8")
    (ROOT / "public" / "favicon.svg").write_text(doc_svg(ICON, mark), encoding="utf-8")

    # Horizontal lockup: mark left; wordmark right, scaled so its height is
    # ~60% of the mark's, vertically centred.
    scale = (MARK.height * 0.6) / WORDMARK.height
    gap = 18
    ww = WORDMARK.width * scale
    wh = WORDMARK.height * scale
    total_w = MARK.width + gap + ww
    tx = MARK.width + gap
    ty = (MARK.height - wh) / 2
    lockup = (
        f"<defs>{defs}</defs>"
        f'<g transform="translate({-MARK.x0:g} {-MARK.y0:g})">{mark}</g>'
        f'<g transform="translate({tx:.3f} {ty:.3f}) scale({scale:.5f}) '
        f'translate({-WORDMARK.x0:g} {-WORDMARK.y0:g})">{word}</g>'
    )
    (OUT / "logo-horizontal.svg").write_text(
        doc_svg(f"0 0 {total_w:.2f} {MARK.height:g}", lockup), encoding="utf-8"
    )
    print("wrote", sorted(p.name for p in OUT.iterdir()), "+ public/favicon.svg")


if __name__ == "__main__":
    main()
