"""Crop supplied team photos to squares and export web-sized versions.

Usage (from the project root):
    python -I scripts/process-photos.py

Reads docs/source/team-*-original.jpg and writes app/assets/team/<slug>.webp and .jpg.
Crop boxes are (left, top, size) in source pixels, chosen to frame head and shoulders.
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "docs" / "source"
OUT = ROOT / "app" / "assets" / "team"
SIZE = 480

CROPS = {
    "fernan-gizzi": (60, 0, 600),
    "clinton-adoga": (68, 30, 760),
    "paul-murani": (0, 0, 1254),
    "mary-wairimu": (0, 60, 1098),
    "cephas-gweth": (98, 0, 783),
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for slug, (left, top, size) in CROPS.items():
        img = Image.open(SRC / f"team-{slug}-original.jpg").convert("RGB")
        size = min(size, img.width - left, img.height - top)
        square = img.crop((left, top, left + size, top + size)).resize((SIZE, SIZE), Image.LANCZOS)
        square.save(OUT / f"{slug}.webp", "WEBP", quality=80, method=6)
        square.save(OUT / f"{slug}.jpg", "JPEG", quality=82, optimize=True, progressive=True)
        print(slug, img.size, "->", (SIZE, SIZE))


if __name__ == "__main__":
    main()
