#!/usr/bin/env python3
"""Crop a square NxN contact sheet into per-topic webp tiles."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/data/learning/images.source.json"
OUT_DIR = ROOT / "public/images/prep"
MANIFEST = ROOT / "public/images/manifest.json"


def crop_sheet(image: Image.Image, cols: int, rows: int, inset_ratio: float) -> list[Image.Image]:
    w, h = image.size
    cw, ch = w // cols, h // rows
    inset = int(min(cw, ch) * inset_ratio)
    tiles: list[Image.Image] = []
    for row in range(rows):
        for col in range(cols):
            box = (
                col * cw + inset,
                row * ch + inset,
                (col + 1) * cw - inset,
                (row + 1) * ch - inset,
            )
            tiles.append(image.crop(box).resize((512, 512), Image.Resampling.LANCZOS))
    return tiles


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("sheet", type=Path, help="Path to the generated contact sheet")
    parser.add_argument("--sheet-id", required=True, help="id in images.source.json sheets[]")
    args = parser.parse_args()

    source = json.loads(SOURCE.read_text(encoding="utf-8"))
    sheet = next((item for item in source["sheets"] if item["id"] == args.sheet_id), None)
    if not sheet:
        raise SystemExit(f"Unknown sheet id: {args.sheet_id}")

    grid = source.get("grid", {"cols": 2, "rows": 2})
    cols, rows = int(grid["cols"]), int(grid["rows"])
    inset = float(source.get("gutterInset", 0.04))
    image = Image.open(args.sheet).convert("RGB")
    tiles = crop_sheet(image, cols, rows, inset)
    expected = cols * rows
    if len(sheet["tiles"]) != expected:
        raise SystemExit(f"Sheet {args.sheet_id} has {len(sheet['tiles'])} tiles, grid is {expected}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    written: dict[str, str] = {}
    for spec, tile in zip(sheet["tiles"], tiles, strict=True):
        rel = f"/images/prep/{spec['id']}.webp"
        dest = OUT_DIR / f"{spec['id']}.webp"
        tile.save(dest, "WEBP", quality=86, method=6)
        written[spec["id"]] = rel
        print(f"  {spec['id']} → {dest} ({dest.stat().st_size} bytes)")

    manifest = {"version": 1, "prep": {}}
    if MANIFEST.exists():
        manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
        manifest.setdefault("prep", {})
    manifest["prep"].update(written)
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Updated {MANIFEST}")


if __name__ == "__main__":
    main()
