#!/usr/bin/env python3
"""Batch-generate MSA audio clips per lesson and mission pack (offline-first assets)."""

from __future__ import annotations

import asyncio
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

try:
    import edge_tts
except ImportError:
    print("Install edge-tts: pip install edge-tts", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/data/learning/audio-packs.source.json"
OUT_DIR = ROOT / "public/audio"
VOICE = "ar-SA-HamedNeural"


async def synthesize(text: str, out_path: Path, voice: str, *, force: bool = False) -> None:
    if out_path.exists() and not force:
        return
    out_path.parent.mkdir(parents=True, exist_ok=True)
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(str(out_path))


async def main() -> None:
    force = "--force" in sys.argv
    source = json.loads(SOURCE.read_text(encoding="utf-8"))
    voice = source.get("voice", VOICE)
    manifest = {
        "version": 1,
        "voice": voice,
        "register": source.get("register", "msa"),
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "packs": {},
    }

    total = sum(len(p["clips"]) for p in source["packs"].values())
    generated = 0
    skipped = 0

    for pack_id, pack in source["packs"].items():
        manifest["packs"][pack_id] = {"clips": {}}
        for clip_id, arabic in pack["clips"].items():
            rel = f"/audio/packs/{pack_id}/{clip_id}.mp3"
            out_path = OUT_DIR / "packs" / pack_id / f"{clip_id}.mp3"
            if out_path.exists() and not force:
                skipped += 1
            else:
                generated += 1
                print(f"  [{generated}/{total - skipped}] {pack_id}/{clip_id} …")
                await synthesize(arabic, out_path, voice, force=force)
            manifest["packs"][pack_id]["clips"][clip_id] = {
                "src": rel,
                "arabic": arabic,
            }

    if skipped:
        print(f"\nSkipped {skipped} existing clips (use --force to regenerate)")
    print(f"Generated {generated} new clips")

    manifest_path = OUT_DIR / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"\nWrote {manifest_path} ({len(manifest['packs'])} packs)")


if __name__ == "__main__":
    print(f"Generating MSA audio with {VOICE} …")
    asyncio.run(main())
