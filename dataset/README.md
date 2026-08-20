# Vocabulary datasets

Public Arabic word lists collected for the prototype. Each resource is its own JSON file with source URL, license, and extra context (variety, corpus, notes).

`index.json` is the catalog. `build_datasets.py` rebuilds the files from the scraped sources.

These are research extracts, not a replacement for a reviewed lexicon. Frequency numbers come from the named corpora. Do not treat Quran counts as a new scholarly tally.

The app does not load these lists as a word bank. They are research extracts for later review.

## Files

| File | What it is | Entries | Best for |
| --- | --- | --- | --- |
| `msa-top-5000-with-glosses.json` | MSA frequency list with English glosses | 5,301 | Learner core + meanings |
| `camel-msa-top-5000.json` | CAMeL Lab MSA corpus frequencies | 5,000 | Formal written MSA |
| `wikipedia-arabic-top-5000.json` | Arabic Wikipedia token frequencies | 5,000 | Encyclopedic MSA |
| `opensubtitles-arabic-top-5000.json` | OpenSubtitles 2016 frequencies | 5,000 | Spoken / film Arabic |
| `wiktionary-quran-lemmas.json` | Quran lemma frequencies | 3,000 | Quranic vocabulary |
| `wiktionary-quranic-verbs.json` | Quran verbs, roots, forms I–X | 1,475 | Quranic verbs |
| `wiktionary-arabic-swadesh.json` | Swadesh 207 with IPA | 207 | Basic world vocabulary |
| `wikivoyage-msa-phrasebook.json` | Travel phrases (MSA) | 414 | Restaurant, taxi, hotel |
| `wikivoyage-egyptian-arabic-phrasebook.json` | Travel phrases (Cairene) | 206 | Spoken Egyptian |

## JSON shape

```json
{
  "id": "wiktionary-arabic-swadesh",
  "title": "...",
  "description": "...",
  "source": { "name": "...", "url": "...", "license": "...", "retrievedAt": "2026-08-16" },
  "context": { "variety": "...", "kind": "...", "notes": "..." },
  "wordCount": 207,
  "entries": [
    {
      "rank": 1,
      "arabic": "أَنَا",
      "transliteration": "ʔanā",
      "meaning": "I (1sg)",
      "ipa": "/ʔa.naː/"
    }
  ]
}
```

Entry fields vary by source. Frequency lists often have only `arabic` + `frequency`. Phrasebooks add `category`. Quran verbs add `root` and `verbForm`.

## Not copied

These are popular but copyrighted or gated, so they were not scraped into this folder:

- Buckwalter & Parkinson, *A Frequency Dictionary of Arabic* (Routledge)
- Laila Familiar, *A Frequency Dictionary of Contemporary Arabic Fiction* (Routledge)
- Full CAMeL dumps (millions of types) — only the top 5,000 MSA types are here
- Leipzig Corpora Collection word lists (linked from Wiktionary; download separately if needed)

## Licenses

Keep attribution when reusing:

- Wiktionary / Wikivoyage: CC BY-SA 4.0
- OpenSubtitles FrequencyWords content: CC BY-SA 4.0
- Quranic Arabic Corpus: GNU GPL, credit [corpus.quran.com](https://corpus.quran.com)
- CAMeL Lab: see their GitHub license
- modernstandardarabic.com: attributed; rights remain with that site
