"""Build the site's logo assets from the client's logo image (v2).

Usage (from the project root):
    python -I scripts/process-logo.py docs/source/entometrics-africa-logo-v2.jpg

The source is a JPEG on a near-white background. The background is removed
with colour-to-alpha against that background colour, so artwork pixels keep
their exact appearance on light backgrounds; nothing is redrawn or recoloured.

Outputs:
  app/assets/logo/logo-horizontal.png  header/footer lockup: the original mark,
                                       scaled down, beside the original wordmark
  app/assets/logo/logo-stacked.png     the full logo as supplied (transparent)
  public/logo.png                      full logo at a stable URL (structured data)
  public/favicon.png, public/apple-touch-icon.png   capsule and hexagons
  public/og-image.png                  1200x630 social preview
"""

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "app" / "assets" / "logo"
PUBLIC = ROOT / "public"
BG = (252, 252, 250)  # the logo's background colour
PAPER = (248, 249, 250)  # site background (--color-paper)

# Regions in source pixels (left, top, right, bottom), measured from the image.
ARTWORK = (50, 70, 670, 655)  # inside the light frame
MARK = (66, 83, 654, 491)  # hexagons, capsule and signal waves
ICON = (146, 83, 574, 491)  # without the side waves (favicon)
WORDMARK_ROWS = (545, 640)  # "EntoMetrics" and "AFRICA"
PAD = 4


def ink(c: tuple[int, int, int]) -> float:
    """How far a pixel is from the background colour (0 = background)."""
    return max((BG[i] - c[i]) / BG[i] if c[i] < BG[i] else 0.0 for i in range(3))


def background_mask(src: Image.Image, limit: float = 0.25) -> list[list[bool]]:
    """Light regions that are background: the outside plus enclosed areas such
    as hexagon interiors and letter counters (all #FCFCFA). Regions that are
    mostly pure white are the capsule's segment lines and stay opaque."""
    w, h = src.size
    px = src.load()
    region = [[-1] * w for _ in range(h)]
    is_background: list[bool] = []
    for sy in range(h):
        for sx in range(w):
            if region[sy][sx] != -1 or ink(px[sx, sy]) >= limit:
                continue
            label = len(is_background)
            members = 0
            white = 0
            stack = [(sx, sy)]
            while stack:
                x, y = stack.pop()
                if x < 0 or y < 0 or x >= w or y >= h or region[y][x] != -1 or ink(px[x, y]) >= limit:
                    continue
                region[y][x] = label
                members += 1
                c = px[x, y]
                # Brighter than the background in green or blue: JPEG-tinted stripe white.
                if c[1] >= 254 or c[2] >= 253:
                    white += 1
                stack.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
            is_background.append(white / members < 0.5)
    return [[region[y][x] != -1 and is_background[region[y][x]] for x in range(w)] for y in range(h)]


def color_to_alpha(img: Image.Image) -> Image.Image:
    """Remove the background. Background pixels get alpha from their difference
    to BG (colour unmultiplied, so edges stay smooth); every other pixel is
    copied unchanged."""
    src = img.convert("RGB")
    outside = background_mask(src)
    out = Image.new("RGBA", src.size)
    sp, op = src.load(), out.load()
    for y in range(src.height):
        for x in range(src.width):
            c = sp[x, y]
            if not outside[y][x]:
                op[x, y] = (*c, 255)
                continue
            a = ink(c)
            if a < 0.03:  # background and JPEG noise
                op[x, y] = (0, 0, 0, 0)
                continue
            rgb = tuple(max(0, min(255, round(BG[i] - (BG[i] - c[i]) / a))) for i in range(3))
            op[x, y] = (*rgb, round(a * 255))
    return out


def trim(img: Image.Image, pad: int = PAD) -> Image.Image:
    box = img.getbbox()
    assert box, "empty region"
    left, top, right, bottom = box
    cropped = img.crop((left, top, right, bottom))
    framed = Image.new("RGBA", (cropped.width + 2 * pad, cropped.height + 2 * pad), (0, 0, 0, 0))
    framed.paste(cropped, (pad, pad))
    return framed


def square(img: Image.Image, size: int) -> Image.Image:
    side = max(img.width, img.height)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(img, ((side - img.width) // 2, (side - img.height) // 2))
    return canvas.resize((size, size), Image.LANCZOS)


def main() -> None:
    # Work inside the artwork area only: drops the image's outer frame and a stray
    # grey edge column. Region coordinates below are relative to the full image.
    source = Image.open(sys.argv[1]).convert("RGB")
    artwork = source.crop(ARTWORK)
    clean = Image.new("RGBA", source.size, (0, 0, 0, 0))
    clean.paste(color_to_alpha(artwork), ARTWORK[:2])
    OUT.mkdir(parents=True, exist_ok=True)

    stacked = trim(clean)
    stacked.save(OUT / "logo-stacked.png", optimize=True)
    stacked.save(PUBLIC / "logo.png", optimize=True)  # stable URL for structured data (JSON-LD logo)

    mark = trim(clean.crop(MARK))
    wordmark = trim(clean.crop((0, WORDMARK_ROWS[0], clean.width, WORDMARK_ROWS[1])))

    # Lockup at the wordmark's native resolution (never upscale): the mark is
    # scaled down so the wordmark is about 60% of its height.
    mark_h = round(wordmark.height / 0.6)
    mark_small = mark.resize((round(mark.width * mark_h / mark.height), mark_h), Image.LANCZOS)
    gap = round(mark_h * 0.08)
    lockup = Image.new("RGBA", (mark_small.width + gap + wordmark.width, mark_h), (0, 0, 0, 0))
    lockup.paste(mark_small, (0, 0), mark_small)
    lockup.paste(wordmark, (mark_small.width + gap, (mark_h - wordmark.height) // 2), wordmark)
    lockup.save(OUT / "logo-horizontal.png", optimize=True)

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

    print("stacked", stacked.size, "mark", mark.size, "wordmark", wordmark.size, "lockup", lockup.size)


if __name__ == "__main__":
    main()
