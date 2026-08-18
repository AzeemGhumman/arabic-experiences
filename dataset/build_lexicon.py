#!/usr/bin/env python3
"""Merge public datasets into a compact lexicon for scenes."""

from __future__ import annotations

import json
import re
import unicodedata
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT.parent / "src" / "lexicon"
TASHKEEL = dict.fromkeys(
    map(
        ord,
        "ًٌٍَُِّْٰٕٖٜۣٓٔٗ٘ٙٚٛٝٞۖۗۘۙۚۛۜ۟۠ۡۢۤۥۦۧۨ۩۪ۭ۫۬",
    ),
    None,
)


def load(name: str) -> dict:
    return json.loads((ROOT / name).read_text(encoding="utf-8"))


def bare(text: str | None) -> str:
    if not text:
        return ""
    text = unicodedata.normalize("NFC", text)
    text = text.translate(TASHKEEL)
    text = text.replace("ـ", "")
    for src, dst in (("أ", "ا"), ("إ", "ا"), ("آ", "ا"), ("ٱ", "ا")):
        text = text.replace(src, dst)
    text = re.sub(r"[^\u0600-\u06FF]+", "", text)
    return text


def strip_marks(text: str | None) -> str:
    if not text:
        return ""
    return unicodedata.normalize("NFC", text).translate(TASHKEEL).replace("ـ", "")


def first_arabic_token(text: str | None) -> str:
    if not text:
        return ""
    match = re.search(r"[\u0600-\u06FF]+", text)
    return bare(match.group(0) if match else "")


def main() -> None:
    swadesh = load("wiktionary-arabic-swadesh.json")["entries"]
    quran = load("wiktionary-quran-lemmas.json")["entries"]
    msa = load("msa-top-5000-with-glosses.json")["entries"]
    phrases = load("wikivoyage-msa-phrasebook.json")["entries"]
    vocab_src = (ROOT.parent / "src" / "data" / "vocabulary.ts").read_text(encoding="utf-8")
    seeds = re.findall(
        r'id:\s*"([^"]+)"\s*,\s*arabic:\s*"([^"]+)"\s*,\s*transliteration:\s*"([^"]+)"\s*,\s*meaning:\s*"([^"]+)"',
        vocab_src,
    )

    quran_by_bare: dict[str, list[dict]] = {}
    for item in quran:
        key = first_arabic_token(item.get("arabic"))
        if key:
            quran_by_bare.setdefault(key, []).append(item)

    msa_by_bare: dict[str, list[dict]] = {}
    for item in msa:
        key = first_arabic_token(item.get("arabic"))
        if key:
            msa_by_bare.setdefault(key, []).append(item)

    phrase_by_bare: dict[str, list[dict]] = {}
    want_template = None
    for item in phrases:
        if item.get("meaning") == "I want _____." and item.get("arabic"):
            want_template = item
        arabic = item.get("arabic") or ""
        tokens = [bare(token) for token in re.findall(r"[\u0600-\u06FF]+", arabic)]
        if len(tokens) < 2:
            continue
        for key in tokens:
            if len(key) >= 2:
                phrase_by_bare.setdefault(key, []).append(item)

    # Swadesh / scene forms that the Quran lists under a related lemma.
    quran_aliases = {
        "طائر": ["طير"],
    }

    entries: dict[str, dict] = {}

    def ensure(key: str) -> dict:
        if key not in entries:
            entries[key] = {
                "id": key,
                "arabic": "",
                "arabicBare": key,
                "meaning": "",
                "transliteration": None,
                "ipa": None,
                "sceneIds": [],
                "swadeshNo": None,
                "quranFrequency": None,
                "quranPos": None,
                "quranLemma": None,
                "msaRank": None,
                "msaGloss": None,
                "phrases": [],
                "sources": [],
            }
        return entries[key]

    def attach_lookups(entry: dict) -> None:
        key = entry["arabicBare"]
        q_hits = list(quran_by_bare.get(key, []))
        alias_used = None
        if not q_hits:
            for alias in quran_aliases.get(key, []):
                q_hits = list(quran_by_bare.get(alias, []))
                if q_hits:
                    alias_used = alias
                    break
        if q_hits:
            best = max(q_hits, key=lambda item: item.get("frequency") or 0)
            entry["quranFrequency"] = best.get("frequency")
            entry["quranPos"] = best.get("pos")
            if alias_used:
                entry["quranLemma"] = best.get("arabic")
            if "quran-lemmas" not in entry["sources"]:
                entry["sources"].append("quran-lemmas")
            if not entry["transliteration"]:
                entry["transliteration"] = best.get("transliteration")
        m_hits = msa_by_bare.get(key, [])
        if m_hits:
            best = min(m_hits, key=lambda item: item.get("rank") or 99999)
            entry["msaRank"] = best.get("rank")
            entry["msaGloss"] = best.get("meaning")
            if "msa-glosses" not in entry["sources"]:
                entry["sources"].append("msa-glosses")
            if not entry["meaning"]:
                entry["meaning"] = best.get("meaning") or ""
        seen_phrases = {p["arabic"] for p in entry["phrases"]}
        for phrase in phrase_by_bare.get(key, [])[:8]:
            arabic = phrase.get("arabic")
            if not arabic or arabic in seen_phrases:
                continue
            entry["phrases"].append(
                {
                    "arabic": arabic,
                    "transliteration": (phrase.get("transliteration") or "").strip("() "),
                    "meaning": phrase.get("meaning"),
                    "category": phrase.get("category"),
                }
            )
            seen_phrases.add(arabic)
            if "wikivoyage-msa" not in entry["sources"]:
                entry["sources"].append("wikivoyage-msa")
            if len(entry["phrases"]) >= 3:
                break
        restaurant_ids = {"water", "rice", "bread", "chicken", "food", "menu"}
        if (
            want_template
            and restaurant_ids.intersection(entry["sceneIds"])
            and entry["arabic"]
            and len(entry["phrases"]) < 3
        ):
            spoken = strip_marks(entry["arabic"]) or entry["arabicBare"]
            composed = f"{want_template['arabic']} {spoken}".strip()
            if composed not in seen_phrases:
                roman = (entry["transliteration"] or entry["meaning"]).split("/")[0].strip()
                entry["phrases"].insert(
                    0,
                    {
                        "arabic": composed,
                        "transliteration": f"ureed {roman}",
                        "meaning": f"I want {entry['meaning']}.",
                        "category": "eating",
                    },
                )
                if "wikivoyage-msa" not in entry["sources"]:
                    entry["sources"].append("wikivoyage-msa")

    for item in swadesh:
        key = first_arabic_token(item.get("arabic"))
        if not key:
            continue
        entry = ensure(key)
        entry["arabic"] = item.get("arabic") or entry["arabic"]
        entry["meaning"] = re.sub(r"\s+", " ", item.get("meaning") or "").strip()
        entry["transliteration"] = item.get("transliteration")
        entry["ipa"] = item.get("ipa")
        entry["swadeshNo"] = item.get("swadeshNo")
        if "swadesh" not in entry["sources"]:
            entry["sources"].append("swadesh")
        attach_lookups(entry)

    for scene_id, arabic, transliteration, meaning in seeds:
        key = first_arabic_token(arabic)
        if not key:
            continue
        entry = ensure(key)
        if scene_id not in entry["sceneIds"]:
            entry["sceneIds"].append(scene_id)
        if not entry["arabic"]:
            entry["arabic"] = arabic
        if not entry["transliteration"]:
            entry["transliteration"] = transliteration
        if not entry["meaning"]:
            entry["meaning"] = meaning
        if "scene-seed" not in entry["sources"]:
            entry["sources"].append("scene-seed")
        attach_lookups(entry)

    out = {
        "id": "scene-lexicon",
        "title": "Merged lexicon for experiences",
        "generatedAt": date.today().isoformat(),
        "description": "Swadesh, Quran lemma frequencies, MSA gloss ranks, and Wikivoyage phrases joined on undiacritized Arabic.",
        "sources": [
            "dataset/wiktionary-arabic-swadesh.json",
            "dataset/wiktionary-quran-lemmas.json",
            "dataset/msa-top-5000-with-glosses.json",
            "dataset/wikivoyage-msa-phrasebook.json",
            "src/data/vocabulary.ts",
        ],
        "wordCount": len(entries),
        "entries": sorted(
            entries.values(),
            key=lambda item: (
                0 if item["sceneIds"] else 1,
                item["swadeshNo"] or 999,
                item["msaRank"] or 99999,
            ),
        ),
    }
    SRC.mkdir(parents=True, exist_ok=True)
    path = SRC / "words.json"
    path.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    scene_ids = {seed[0] for seed in seeds}
    covered = {sid for entry in out["entries"] for sid in entry["sceneIds"]}
    with_quran = sum(1 for e in out["entries"] if e["quranFrequency"])
    with_ipa = sum(1 for e in out["entries"] if e["ipa"])
    with_phrases = sum(1 for e in out["entries"] if e["phrases"])
    print(f"wrote {path} ({out['wordCount']} entries)")
    print(f"scene ids covered {len(covered)}/{len(scene_ids)}")
    print(f"with quran {with_quran}, ipa {with_ipa}, phrases {with_phrases}")
    missing = sorted(scene_ids - covered)
    if missing:
        print("missing scene ids:", ", ".join(missing))


if __name__ == "__main__":
    main()
