"""Build the site's logo assets from the client's logo images.

Usage (from the project root):
    python -I scripts/process-logo.py \
        docs/source/entometrics-africa-logo-v2.jpg \
        docs/source/entometrics-africa-logo-horizontal-v2.jpg

Both sources are JPEGs on a near-white background inside a light frame. The
background is removed with colour-to-alpha against each image's own
background colour, so artwork pixels keep their exact appearance on light
backgrounds; nothing is redrawn or recoloured.

The header shows the emblem as an image with "EntoMetrics Africa" and the
tagline as live text (so the tagline stays legible at nav-bar size), in the
colours sampled from the supplied horizontal logo (see app/components/Logo.tsx).

Outputs:
  app/assets/logo/logo-emblem.png      header emblem (hexagons, capsule, waves; high resolution)
  app/assets/logo/logo-horizontal.png  the supplied horizontal logo, background removed (reference)
  app/assets/logo/logo-stacked.png     footer logo (the supplied stacked logo)
  public/logo.png                      stacked logo at a stable URL (structured data)
  public/favicon.png, public/apple-touch-icon.png   capsule and hexagons
  public/og-image.png                  1200x630 social preview
"""

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "app" / "assets" / "logo"
PUBLIC = ROOT / "public"
PAPER = (248, 249, 250)  # site background (--color-paper)
PAD = 4

Color = tuple[int, int, int]

# Stacked logo (720x690): background colour and regions (left, top, right, bottom).
STACKED_BG: Color = (252, 252, 250)
STACKED_ARTWORK = (50, 70, 670, 655)  # inside the light frame
ICON = (146, 83, 574, 491)  # capsule and hexagons without the side waves (favicon)
MARK = (66, 83, 654, 491)  # hexagons, capsule and signal waves (header emblem)

# Horizontal logo (720x207).
HORIZONTAL_BG: Color = (250, 251, 246)
HORIZONTAL_ARTWORK = (44, 50, 700, 198)  # inside the light frame


def ink(c: Color, bg: Color) -> float:
    """How far a pixel is from the background colour (0 = background)."""
    return max((bg[i] - c[i]) / bg[i] if c[i] < bg[i] else 0.0 for i in range(3))


def background_mask(src: Image.Image, bg: Color, limit: float = 0.25) -> list[list[bool]]:
    """Light regions that are background: the outside plus enclosed areas such
    as hexagon interiors and letter counters. Regions that are mostly whiter
    than the background are the capsule's segment lines and stay opaque."""
    w, h = src.size
    px = src.load()
    region = [[-1] * w for _ in range(h)]
    is_background: list[bool] = []
    for sy in range(h):
        for sx in range(w):
            if region[sy][sx] != -1 or ink(px[sx, sy], bg) >= limit:
                continue
            label = len(is_background)
            members = 0
            white = 0
            stack = [(sx, sy)]
            while stack:
                x, y = stack.pop()
                if x < 0 or y < 0 or x >= w or y >= h or region[y][x] != -1 or ink(px[x, y], bg) >= limit:
                    continue
                region[y][x] = label
                members += 1
                c = px[x, y]
                # Brighter than the background in green or blue: JPEG-tinted stripe white.
                if c[1] >= max(254, bg[1] + 2) or c[2] >= max(253, bg[2] + 3):
                    white += 1
                stack.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
            is_background.append(white / members < 0.5)
    return [[region[y][x] != -1 and is_background[region[y][x]] for x in range(w)] for y in range(h)]


def color_to_alpha(img: Image.Image, bg: Color) -> Image.Image:
    """Remove the background. Background pixels get alpha from their difference
    to bg (colour unmultiplied, so edges stay smooth); every other pixel is
    copied unchanged."""
    src = img.convert("RGB")
    outside = background_mask(src, bg)
    out = Image.new("RGBA", src.size)
    sp, op = src.load(), out.load()
    for y in range(src.height):
        for x in range(src.width):
            c = sp[x, y]
            if not outside[y][x]:
                op[x, y] = (*c, 255)
                continue
            a = ink(c, bg)
            if a < 0.03:  # background and JPEG noise
                op[x, y] = (0, 0, 0, 0)
                continue
            rgb = tuple(max(0, min(255, round(bg[i] - (bg[i] - c[i]) / a))) for i in range(3))
            op[x, y] = (*rgb, round(a * 255))
    return out


def clean_source(path: str, artwork: tuple[int, int, int, int], bg: Color) -> Image.Image:
    """Transparent copy of the image, keeping only the artwork area (drops the
    outer frame and stray edge pixels). Coordinates stay those of the source."""
    source = Image.open(path).convert("RGB")
    clean = Image.new("RGBA", source.size, (0, 0, 0, 0))
    clean.paste(color_to_alpha(source.crop(artwork), bg), artwork[:2])
    return clean


def trim(img: Image.Image, pad: int = PAD) -> Image.Image:
    box = img.getbbox()
    assert box, "empty region"
    cropped = img.crop(box)
    framed = Image.new("RGBA", (cropped.width + 2 * pad, cropped.height + 2 * pad), (0, 0, 0, 0))
    framed.paste(cropped, (pad, pad))
    return framed


def square(img: Image.Image, size: int) -> Image.Image:
    side = max(img.width, img.height)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(img, ((side - img.width) // 2, (side - img.height) // 2))
    return canvas.resize((size, size), Image.LANCZOS)


def main() -> None:
    stacked_path, horizontal_path = sys.argv[1], sys.argv[2]
    OUT.mkdir(parents=True, exist_ok=True)

    clean = clean_source(stacked_path, STACKED_ARTWORK, STACKED_BG)
    stacked = trim(clean)
    stacked.save(OUT / "logo-stacked.png", optimize=True)
    stacked.save(PUBLIC / "logo.png", optimize=True)  # stable URL for structured data (JSON-LD logo)

    emblem = trim(clean.crop(MARK))
    emblem.save(OUT / "logo-emblem.png", optimize=True)

    horizontal = trim(clean_source(horizontal_path, HORIZONTAL_ARTWORK, HORIZONTAL_BG))
    horizontal.save(OUT / "logo-horizontal.png", optimize=True)

    icon = trim(clean.crop(ICON))
    square(icon, 64).save(PUBLIC / "favicon.png", optimize=True)
    apple = Image.new("RGBA", (180, 180), (*PAPER, 255))
    inner = square(icon, 148)
    apple.paste(inner, (16, 16), inner)
    apple.convert("RGB").save(PUBLIC / "apple-touch-icon.png", optimize=True)

    og = Image.new("RGB", (1200, 630), PAPER)
    scale = 500 / stacked.height
    logo = stacked.resize((round(stacked.width * scale), 500), Image.LANCZOS)
    og.paste(logo, ((1200 - logo.width) // 2, (630 - logo.height) // 2), logo)
    og.save(PUBLIC / "og-image.png", optimize=True)

    print("stacked", stacked.size, "emblem", emblem.size, "horizontal", horizontal.size)


if __name__ == "__main__":
    main()
