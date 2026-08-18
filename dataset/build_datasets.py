#!/usr/bin/env python3
"""Parse public Arabic word lists into sourced JSON files."""

from __future__ import annotations

import json
import re
import unicodedata
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent
AGENT = Path(
    "/Users/azeem/.cursor/projects/Users-azeem-workspace-code-personal-arabic/agent-tools"
)
TODAY = date.today().isoformat()
ARABIC_RE = re.compile(r"[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+")


def dump(name: str, payload: dict) -> None:
    path = ROOT / name
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {path.name:55} {payload['wordCount']:>6} entries")


def source(**kwargs) -> dict:
    data = {"retrievedAt": TODAY}
    data.update(kwargs)
    return data


def parse_msa_gloss_list() -> list[dict]:
    text = (AGENT / "01146f53-d9c1-4424-a535-e42e22d5792a.txt").read_text(encoding="utf-8")
    entries = []
    for match in re.finditer(r"^\|\s*(\d+)\s*\|\s*(.+?)\s*\|$", text, re.MULTILINE):
        rank = int(match.group(1))
        body = match.group(2).strip()
        if " : " not in body:
            continue
        arabic, meaning = body.split(" : ", 1)
        entries.append(
            {
                "rank": rank,
                "arabic": arabic.strip(),
                "meaning": meaning.strip(),
                "notes": "Glosses are a learner guide from the source page, not a scholarly lexicon.",
            }
        )
    return entries


def parse_quran_lemma_file(filename: str, rank_offset: int) -> list[dict]:
    text = (AGENT / filename).read_text(encoding="utf-8")
    entries = []
    pattern = re.compile(
        r"^(\d+)\.\s+(\S+?)\((.*?)\),\s*(\d+)\s*$",
        re.MULTILINE,
    )
    for match in pattern.finditer(text):
        local_rank = int(match.group(1))
        arabic = match.group(2).strip()
        inner = match.group(3).strip()
        frequency = int(match.group(4))
        transliteration = None
        pos = None
        if "," in inner:
            left, right = inner.rsplit(",", 1)
            pos = right.strip()
            left = left.strip()
            if left and not left.startswith("“") and ARABIC_RE.search(left) is None:
                transliteration = left
        else:
            pos = inner or None
            if pos and ARABIC_RE.search(pos):
                pos = None
        entries.append(
            {
                "rank": local_rank + rank_offset,
                "arabic": arabic,
                "transliteration": transliteration,
                "pos": pos,
                "frequency": frequency,
                "frequencyNote": "Lemma frequency in the Quranic Arabic Corpus.",
            }
        )
    return entries


def parse_quran_verbs(filename: str, rank_offset: int) -> list[dict]:
    text = (AGENT / filename).read_text(encoding="utf-8")
    entries = []
    pattern = re.compile(
        r"^(\d+)\.\s+(\S+?)\((.*?)\),\s*(?:Appendix:Arabic roots/)?([^,]+),\s*(\S+)\s*$",
        re.MULTILINE,
    )
    for match in pattern.finditer(text):
        inner = match.group(3)
        transliteration = None
        meaning = None
        if "“" in inner or '"' in inner:
            parts = re.split(r"[“\"]", inner, maxsplit=2)
            transliteration = parts[0].strip(" ,") or None
            meaning = parts[1].rstrip("”\"").strip() if len(parts) > 1 else None
        elif "," in inner:
            transliteration, meaning = [p.strip() for p in inner.split(",", 1)]
        else:
            transliteration = inner.strip() or None
        root = re.sub(r"\([^)]*\)", "", match.group(4)).replace(" ", "").strip()
        entries.append(
            {
                "rank": int(match.group(1)) + rank_offset,
                "arabic": match.group(2),
                "transliteration": transliteration,
                "meaning": meaning,
                "root": root,
                "verbForm": match.group(5),
            }
        )
    return entries


def parse_swadesh() -> list[dict]:
    raw = json.loads((AGENT / "6d84e65e-7f40-4f81-8395-c720ee55a988.txt").read_text(encoding="utf-8"))
    text = raw["parse"]["text"]["*"]
    start = text.find("1 I")
    end = text.find("Swadesh lists")
    chunk = text[start:end]
    pieces = re.split(r"(?=\b(?:[1-9]|[1-9]\d|1\d\d|20[0-7])\s)", chunk)
    entries = []
    for piece in pieces:
        match = re.match(
            r"(\d+)\s+(.+?)\s+(" + ARABIC_RE.pattern + r".+)$",
            piece.strip(),
            re.DOTALL,
        )
        if not match:
            continue
        rank = int(match.group(1))
        if rank < 1 or rank > 207:
            continue
        english = re.sub(r"\s+", " ", match.group(2)).strip()
        rest = re.sub(r"\s+", " ", match.group(3)).strip()
        ipas = re.findall(r"/[^/]+/", rest)
        arabic_forms = []
        for form in re.finditer(
            r"(" + ARABIC_RE.pattern + r")\s*\(\s*([^)]+?)\s*\)",
            rest,
        ):
            arabic_forms.append(
                {
                    "arabic": form.group(1),
                    "transliteration": form.group(2).strip(),
                }
            )
        if not arabic_forms:
            found = ARABIC_RE.findall(rest)
            arabic_forms = [{"arabic": found[0], "transliteration": None}] if found else []
        if not arabic_forms:
            continue
        entries.append(
            {
                "rank": rank,
                "swadeshNo": rank,
                "meaning": english,
                "arabic": arabic_forms[0]["arabic"],
                "transliteration": arabic_forms[0]["transliteration"],
                "ipa": ipas[0] if ipas else None,
                "variants": arabic_forms[1:] or None,
                "allIpa": ipas or None,
            }
        )
    entries.sort(key=lambda item: item["rank"])
    return entries


def parse_freq_space(path: Path, limit: int) -> list[dict]:
    entries = []
    with path.open(encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line:
                continue
            parts = line.rsplit(" ", 1)
            if len(parts) != 2 or not parts[1].isdigit():
                continue
            arabic, freq = parts
            if not ARABIC_RE.search(arabic):
                continue
            entries.append(
                {
                    "rank": len(entries) + 1,
                    "arabic": arabic,
                    "frequency": int(freq),
                }
            )
            if len(entries) >= limit:
                break
    return entries


def parse_camel(path: Path, limit: int) -> list[dict]:
    entries = []
    with path.open(encoding="utf-8") as handle:
        for line in handle:
            parts = line.rstrip("\n").split("\t")
            if len(parts) < 2:
                continue
            arabic, freq = parts[0], parts[1]
            if not freq.isdigit() or not ARABIC_RE.search(arabic):
                continue
            entries.append(
                {
                    "rank": len(entries) + 1,
                    "arabic": arabic,
                    "frequency": int(freq),
                }
            )
            if len(entries) >= limit:
                break
    return entries


def strip_wiki(text: str) -> str:
    text = re.sub(r"\{\{Lang\|ar\|([^}]+)\}\}", r"\1", text)
    text = re.sub(r"\{\{Lang\|ar-Latn\|''([^']+)''\}\}", r"\1", text)
    text = re.sub(r"\{\{Lang\|ar-Latn\|([^}]+)\}\}", r"\1", text)
    text = re.sub(r"\{\{[^}]+\}\}", "", text)
    text = re.sub(r"'{2,}", "", text)
    text = re.sub(r"\[\[(?:[^|\]]+\|)?([^\]]+)\]\]", r"\1", text)
    return unicodedata.normalize("NFC", text).strip()


def parse_wikivoyage_phrasebook() -> list[dict]:
    raw = json.loads((AGENT / "ac0f1912-1852-4fa3-bebb-f0c4a529830a.txt").read_text(encoding="utf-8"))
    wikitext = raw["parse"]["wikitext"]["*"]
    entries = []
    section = "basics"
    for line in wikitext.splitlines():
        heading = re.match(r"^={2,4}\s*(.+?)\s*={2,4}$", line)
        if heading:
            section = heading.group(1).strip().lower()
            continue
        if line.startswith(";"):
            cleaned = strip_wiki(line[1:].strip())
            if ":" not in cleaned:
                continue
            english, rest = cleaned.split(":", 1)
            english = english.strip()
            rest = rest.strip()
            arabic = " ".join(ARABIC_RE.findall(rest))
            latin = re.sub(ARABIC_RE, " ", rest)
            latin = re.sub(r"\s+", " ", latin).strip(" :.-")
            if not english or (not arabic and not latin):
                continue
            entries.append(
                {
                    "rank": len(entries) + 1,
                    "category": section,
                    "meaning": english,
                    "arabic": arabic or None,
                    "transliteration": latin or None,
                    "kind": "phrase" if " " in (arabic or "") else "word",
                }
            )
    return entries


def parse_egyptian_phrasebook() -> list[dict]:
    raw = json.loads((AGENT / "egyptian-phrasebook.json").read_text(encoding="utf-8"))
    wikitext = raw["parse"]["wikitext"]["*"]
    start = wikitext.find("==Phrase list==")
    if start != -1:
        wikitext = wikitext[start:]
    entries = []
    section = "basics"
    for raw_line in wikitext.splitlines():
        heading = re.match(r"^={2,4}\s*(.+?)\s*={2,4}$", raw_line)
        if heading:
            section = heading.group(1).strip().lower()
            continue
        line = raw_line
        if line.startswith(";"):
            line = line[1:]
        line = re.sub(r"</?br\s*/?>", " | ", line, flags=re.I)
        line = strip_wiki(line)
        line = re.sub(r"<[^>]+>", " ", line)
        if ":" not in line:
            continue
        english, rest = line.split(":", 1)
        english = re.sub(r"\s+", " ", english).strip(" '")
        rest = re.sub(r"\s+", " ", rest).strip()
        arabic = " ".join(ARABIC_RE.findall(rest))
        latin = re.sub(ARABIC_RE, " ", rest)
        latin = re.sub(r"\s+", " ", latin).strip(" :.-|")
        if len(english) < 2 or (not arabic and not latin):
            continue
        if english.lower() in {"a", "ā", "à", "â", "o", "ō", "ū", "e", "ē", "ī"}:
            continue
        entries.append(
            {
                "rank": len(entries) + 1,
                "category": section,
                "meaning": english,
                "arabic": arabic or None,
                "transliteration": latin or None,
                "kind": "phrase" if " " in (arabic or "") else "word",
            }
        )
    return entries


def main() -> None:
    msa = parse_msa_gloss_list()
    dump(
        "msa-top-5000-with-glosses.json",
        {
            "id": "msa-top-5000-with-glosses",
            "title": "Top 5000+ Modern Standard Arabic words with English glosses",
            "description": "Learner-oriented frequency list of 5,313 MSA items with English glosses, ranked by how often the source says the words appear in media and publications.",
            "source": source(
                name="Modern Standard Arabic",
                url="http://www.modernstandardarabic.com/top-5000-arabic-words/",
                relatedUrl="http://www.modernstandardarabic.com/top-50000-arabic-words/",
                license="All rights remain with the source site. Copied here for prototype research with attribution.",
            ),
            "context": {
                "variety": "Modern Standard Arabic",
                "kind": "frequency-with-glosses",
                "notes": "The source says the Arabic ranking is frequency-based; English is a simple guide. Some rows are multiword expressions (ولا…ولا, كل شيء).",
            },
            "wordCount": len(msa),
            "entries": msa,
        },
    )

    quran = []
    quran.extend(parse_quran_lemma_file("b17b71cd-96da-4b29-ac32-fc8c23a736d9.txt", 0))
    quran.extend(
        parse_quran_lemma_file(
            "e09ee520-6e05-4b96-8e9a-71e19d48f352.txt",
            1000,
        )
    )
    quran.extend(
        parse_quran_lemma_file(
            "a368a913-a617-4651-9fd7-2e515c2ef769.txt",
            2000,
        )
    )
    dump(
        "wiktionary-quran-lemmas.json",
        {
            "id": "wiktionary-quran-lemmas",
            "title": "Quranic Arabic lemma frequency list",
            "description": "Lemmas from the Quran ranked by frequency, compiled on Wiktionary from the Quranic Arabic Corpus (University of Leeds / Kais Dukes).",
            "source": source(
                name="Wiktionary",
                url="https://en.wiktionary.org/wiki/Appendix:Arabic_Frequency_List_from_Quran",
                originalCorpus="https://corpus.quran.com/lemmas.jsp",
                license="CC BY-SA 4.0 (Wiktionary). Quranic Arabic Corpus is GNU GPL with attribution to corpus.quran.com.",
            ),
            "context": {
                "variety": "Quranic / Classical Arabic",
                "kind": "lemma-frequency",
                "notes": "A lemma groups inflected forms that share meaning. Verbs are listed separately in the verb concordance. Frequency counts are from the Quranic Arabic Corpus, not a later scholarly recount.",
                "pagesIncluded": ["1-1000", "1001-2000", "2001-3000"],
            },
            "wordCount": len(quran),
            "entries": quran,
        },
    )

    verbs = parse_quran_verbs("b9e49d34-ece6-4278-939f-5764a40b8b43.txt", 0)
    verbs.extend(parse_quran_verbs("11fe8df0-afdf-44eb-a28f-c1643cdd3b28.txt", 500))
    verbs.extend(parse_quran_verbs("d4e5a8bd-a0d3-4ac1-b252-d45be572ae8a.txt", 1000))
    dump(
        "wiktionary-quranic-verbs.json",
        {
            "id": "wiktionary-quranic-verbs",
            "title": "Quranic Arabic verbs",
            "description": "Quranic verbs with English glosses, triliteral roots, and Arabic verb forms (I–X+), from Wiktionary's concordance based on corpus.quran.com.",
            "source": source(
                name="Wiktionary",
                url="https://en.wiktionary.org/wiki/Appendix:Arabic_Quranic_Verbs",
                originalCorpus="https://corpus.quran.com/verbs.jsp",
                license="CC BY-SA 4.0 (Wiktionary). Underlying corpus: GNU GPL with attribution.",
            ),
            "context": {
                "variety": "Quranic / Classical Arabic",
                "kind": "verbs",
                "notes": "Form numbers follow the traditional Arabic verb-form system. Roots are given as separate letters. This extract covers Wiktionary's full verb appendix (1–1475).",
            },
            "wordCount": len(verbs),
            "entries": verbs,
        },
    )

    swadesh = parse_swadesh()
    dump(
        "wiktionary-arabic-swadesh.json",
        {
            "id": "wiktionary-arabic-swadesh",
            "title": "Arabic Swadesh list",
            "description": "Morris Swadesh's 207-item basic vocabulary list for Classical Arabic, with MSA pronunciations, transliteration, and IPA.",
            "source": source(
                name="Wiktionary",
                url="https://en.wiktionary.org/wiki/Appendix:Arabic_Swadesh_list",
                license="CC BY-SA 4.0",
            ),
            "context": {
                "variety": "Classical Arabic with MSA pronunciation",
                "kind": "core-vocabulary",
                "notes": "Wiktionary notes that the list is Classical Arabic exclusively, while pronunciations are MSA equivalents. Multiple forms in one cell are gender, number, or near-synonym variants. This is a comparative-linguistics list, not a travel phrasebook.",
            },
            "wordCount": len(swadesh),
            "entries": swadesh,
        },
    )

    opensubs = parse_freq_space(AGENT / "7ca5a8ca-2581-4e52-bfc8-8167394ac5ab.txt", 5000)
    dump(
        "opensubtitles-arabic-top-5000.json",
        {
            "id": "opensubtitles-arabic-top-5000",
            "title": "OpenSubtitles Arabic frequency list (top 5000)",
            "description": "The 5,000 most frequent Arabic tokens in the OpenSubtitles 2016 corpus, from hermitdave/FrequencyWords. Spoken/subtitle Arabic, including dialectal and film register.",
            "source": source(
                name="hermitdave/FrequencyWords",
                url="https://github.com/hermitdave/FrequencyWords",
                fileUrl="https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2016/ar/ar_50k.txt",
                corpus="http://opus.lingfil.uu.se/OpenSubtitles2016.php",
                license="CC BY-SA 4.0 for content; MIT for generator code",
            ),
            "context": {
                "variety": "Mixed Arabic (subtitle / spoken register)",
                "kind": "token-frequency",
                "notes": "These are surface tokens, not lemmas. The full source file has 50,000 types; this extract keeps the head. Expect dialect, names, and movie slang (نعم, تبا, القهوة) alongside MSA function words.",
                "fullListSize": 50000,
            },
            "wordCount": len(opensubs),
            "entries": opensubs,
        },
    )

    wiki = parse_freq_space(AGENT / "fb452784-5942-452a-bcc6-fd37a1d06496.txt", 5000)
    dump(
        "wikipedia-arabic-top-5000.json",
        {
            "id": "wikipedia-arabic-top-5000",
            "title": "Arabic Wikipedia word frequency (top 5000)",
            "description": "Most frequent tokens in the Arabic Wikipedia dump dated 2022-08-29, generated by Ilya Semenov.",
            "source": source(
                name="IlyaSemenov/wikipedia-word-frequency",
                url="https://github.com/IlyaSemenov/wikipedia-word-frequency",
                fileUrl="https://raw.githubusercontent.com/IlyaSemenov/wikipedia-word-frequency/master/results/arwiki-2022-08-29.txt",
                license="See repository; derived from Wikipedia (CC BY-SA 4.0).",
            ),
            "context": {
                "variety": "Modern Standard Arabic (encyclopedic)",
                "kind": "token-frequency",
                "notes": "Wikipedia Arabic is formal and topical (عام, المتحدة, بعد). Function words dominate the head. The dump file contains ~89k types; this extract is the top 5,000.",
                "dumpDate": "2022-08-29",
            },
            "wordCount": len(wiki),
            "entries": wiki,
        },
    )

    camel = parse_camel(Path("/tmp/camel-freq/msa-top-5000.tsv"), 5000)
    dump(
        "camel-msa-top-5000.json",
        {
            "id": "camel-msa-top-5000",
            "title": "CAMeL MSA frequency list (top 5000)",
            "description": "Head of the CAMeL Lab Modern Standard Arabic frequency list, derived from CAMeLBERT pretraining data (12.6 billion MSA tokens / 11.4 million types).",
            "source": source(
                name="CAMeL-Lab/Camel_Arabic_Frequency_Lists",
                url="https://github.com/CAMeL-Lab/Camel_Arabic_Frequency_Lists",
                fileUrl="https://github.com/CAMeL-Lab/Camel_Arabic_Frequency_Lists/releases/download/v1.0/MSA_freq_lists.tsv.zip",
                license="See the GitHub repository LICENSE.",
            ),
            "context": {
                "variety": "Modern Standard Arabic",
                "kind": "token-frequency",
                "notes": "CAMeL also publishes Classical, Dialectal, and mixed lists. Digits, punctuation, and non-Arabic tokens were excluded by the authors. This extract is the first 5,000 types by frequency, not the full 11.4M-type file.",
                "corpusTokens": 12600000000,
                "corpusTypes": 11400000,
            },
            "wordCount": len(camel),
            "entries": camel,
        },
    )

    phrases = parse_wikivoyage_phrasebook()
    dump(
        "wikivoyage-msa-phrasebook.json",
        {
            "id": "wikivoyage-msa-phrasebook",
            "title": "Wikivoyage Modern Standard Arabic phrasebook",
            "description": "Travel phrases, numbers, directions, food, lodging, and shopping vocabulary from the English Wikivoyage Arabic phrasebook. Aimed at getting by, not at MSA purity.",
            "source": source(
                name="Wikivoyage",
                url="https://en.wikivoyage.org/wiki/Arabic_phrasebook",
                license="CC BY-SA 4.0",
            ),
            "context": {
                "variety": "Modern Standard Arabic with some dialect notes",
                "kind": "phrasebook",
                "notes": "Wikivoyage warns that MSA and dialects are often mutually unintelligible in speech. Some entries mix Levantine or Egyptian forms (شوي شوي, على طول). Categories follow the page sections (basics, numbers, eating, taxi, etc.).",
            },
            "wordCount": len(phrases),
            "entries": phrases,
        },
    )

    egyptian = parse_egyptian_phrasebook()
    dump(
        "wikivoyage-egyptian-arabic-phrasebook.json",
        {
            "id": "wikivoyage-egyptian-arabic-phrasebook",
            "title": "Wikivoyage Egyptian Arabic phrasebook",
            "description": "Cairene Egyptian Arabic travel phrases with gender variants, numbers, time, colors, and directions. The most widely understood spoken variety in the Arab world.",
            "source": source(
                name="Wikivoyage",
                url="https://en.wikivoyage.org/wiki/Egyptian_Arabic_phrasebook",
                license="CC BY-SA 4.0",
            ),
            "context": {
                "variety": "Egyptian Arabic (Cairo)",
                "kind": "phrasebook",
                "notes": "Pronunciation follows metropolitan Cairo. Many lines include masculine, feminine, and plural forms. qāf is usually a glottal stop. Useful as a spoken counterpart to the MSA phrasebook.",
            },
            "wordCount": len(egyptian),
            "entries": egyptian,
        },
    )

    index = {
        "title": "Arabic Experiences — vocabulary datasets",
        "retrievedAt": TODAY,
        "schema": {
            "id": "stable dataset id",
            "source": "name, url, license, retrievedAt",
            "context": "variety, kind, notes",
            "entries": "arabic plus optional meaning, transliteration, frequency, pos, root, category",
        },
        "datasets": sorted(
            [
                {
                    "file": path.name,
                    "id": json.loads(path.read_text(encoding="utf-8"))["id"],
                    "title": json.loads(path.read_text(encoding="utf-8"))["title"],
                    "wordCount": json.loads(path.read_text(encoding="utf-8"))["wordCount"],
                    "sourceUrl": json.loads(path.read_text(encoding="utf-8"))["source"]["url"],
                }
                for path in ROOT.glob("*.json")
                if path.name != "index.json"
            ],
            key=lambda item: item["file"],
        ),
    }
    dump("index.json", {**index, "wordCount": sum(item["wordCount"] for item in index["datasets"])})


if __name__ == "__main__":
    main()
