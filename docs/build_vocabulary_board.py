#!/usr/bin/env python3
"""Generate docs/vocabulary-adventures.excalidraw — a planning board for scenes."""

from __future__ import annotations

import json
import random
from pathlib import Path

random.seed(16)
NOW = 1_724_000_000_000
N = 0
ELEMENTS: list[dict] = []


def nid() -> str:
    global N
    N += 1
    return f"v{N:04d}"


def el(**kw) -> dict:
    item = {
        "id": nid(),
        "x": 0,
        "y": 0,
        "width": 100,
        "height": 40,
        "angle": 0,
        "strokeColor": "#1e1e1e",
        "backgroundColor": "transparent",
        "fillStyle": "hachure",
        "strokeWidth": 1,
        "strokeStyle": "solid",
        "roughness": 1,
        "opacity": 100,
        "groupIds": [],
        "frameId": None,
        "roundness": None,
        "seed": random.randint(1, 2**31),
        "version": 1,
        "versionNonce": random.randint(1, 2**31),
        "isDeleted": False,
        "boundElements": None,
        "updated": NOW,
        "link": None,
        "locked": False,
    }
    item.update(kw)
    ELEMENTS.append(item)
    return item


def text(x, y, content, size=18, align="left", color="#1e1e1e", frame=None, width=None):
    lines = content.split("\n")
    w = width or max(8, max(len(line) for line in lines) * size * 0.58)
    h = max(size * 1.3, len(lines) * size * 1.35)
    return el(
        type="text",
        x=x,
        y=y,
        width=w,
        height=h,
        text=content,
        originalText=content,
        fontSize=size,
        fontFamily=1,
        textAlign=align,
        verticalAlign="top",
        baseline=size,
        lineHeight=1.25,
        autoResize=True,
        strokeColor=color,
        frameId=frame,
        containerId=None,
    )


def rect(x, y, w, h, bg, frame=None, dashed=False, stroke="#1e1e1e", fill="solid"):
    return el(
        type="rectangle",
        x=x,
        y=y,
        width=w,
        height=h,
        backgroundColor=bg,
        fillStyle=fill,
        roundness={"type": 3},
        strokeStyle="dashed" if dashed else "solid",
        strokeColor=stroke,
        strokeWidth=1.5 if dashed else 1,
        frameId=frame,
    )


def labeled(x, y, w, h, content, bg, frame=None, size=16, dashed=False, fill="solid"):
    gid = nid()
    box = rect(x, y, w, h, bg, frame=frame, dashed=dashed, fill=fill)
    box["groupIds"] = [gid]
    lines = content.split("\n")
    tw = min(w - 16, max(len(line) for line in lines) * size * 0.58)
    th = len(lines) * size * 1.3
    t = text(
        x + (w - tw) / 2,
        y + (h - th) / 2,
        content,
        size=size,
        align="center",
        frame=frame,
        width=tw,
    )
    t["groupIds"] = [gid]
    t["textAlign"] = "center"
    return box


def arrow(x1, y1, x2, y2, frame=None):
    return el(
        type="arrow",
        x=x1,
        y=y1,
        width=x2 - x1,
        height=y2 - y1,
        points=[[0, 0], [x2 - x1, y2 - y1]],
        lastCommittedPoint=None,
        startBinding=None,
        endBinding=None,
        startArrowhead=None,
        endArrowhead="arrow",
        elbowed=False,
        roundness={"type": 2},
        frameId=frame,
    )


def frame(x, y, w, h, name):
    return el(
        type="frame",
        x=x,
        y=y,
        width=w,
        height=h,
        name=name,
        backgroundColor="transparent",
        strokeColor="#868e96",
        roundness=None,
        fillStyle="solid",
    )


def main() -> None:
    # Title
    text(80, 40, "Vocabulary adventures — starting board", size=36)
    text(
        80,
        92,
        "Duplicate a scene card. Notice 3–6 objects first. One spoken mission. Reuse lexicon ids before adding words.",
        size=18,
        color="#495057",
    )

    # Recipe
    recipe = frame(80, 150, 2280, 280, "How any adventure is built")
    rid = recipe["id"]
    steps = [
        (100, "1. Place\nwhere the body is", "#fff3bf"),
        (560, "2. Notice\ntap what you can see", "#ffd8a8"),
        (1020, "3. Name\nlexicon: Arabic · IPA · meaning", "#b2f2bb"),
        (1480, "4. Do\none phrase you can say", "#a5d8ff"),
        (1940, "5. Return\nword lives on the map", "#eebefa"),
    ]
    for x, label, bg in steps:
        labeled(x, 210, 400, 160, label, bg, frame=rid, size=20)
    for x in (500, 960, 1420, 1880):
        arrow(x, 290, x + 60, 290, frame=rid)

    # Shared lexicon
    shared = frame(80, 460, 2280, 250, "Shared lexicon — words that travel")
    sid = shared["id"]
    text(
        100,
        500,
        "A hotspot points at a lexicon id. Same Arabic can appear in two scenes (water at the table, water in the garden).",
        size=16,
        color="#495057",
        frame=sid,
    )
    chips = [
        ("ماء  water\nrestaurant · garden · zamzam?", "#a5d8ff"),
        ("أكل  eat\nrestaurant · home", "#b2f2bb"),
        ("بيت  house\nhome · hotel", "#ffd8a8"),
        ("باب  door\nhome · haram", "#ffc9c9"),
        ("نور  light\nhome · garden", "#fff3bf"),
        ("شمس  sun\ngarden · sky", "#ffec99"),
        ("أرض  earth\ngarden · tawaf ground", "#e9ecef"),
        ("يريد  I want\nrestaurant · market", "#eebefa"),
    ]
    for i, (label, bg) in enumerate(chips):
        labeled(100 + i * 280, 560, 260, 110, label, bg, frame=sid, size=15)

    # Four journeys
    journeys = [
        (
            80,
            "Arabic for Real Life",
            "#b2f2bb",
            [
                ("Restaurant  LIVE", True, "table · water · rice · bread · chicken\nmission: أريد ماء / أريد أرز"),
                ("Airport", False, "gate · bag · passport · help\nmission: where is gate ___?"),
                ("Taxi", False, "car · driver · mosque · hotel\nmission: take me to ___"),
                ("Hotel", False, "lobby · room · key · elevator\nmission: I have a reservation"),
                ("Market", False, "fruit · price · fresh · scale\nmission: how much is this?"),
                ("Directions / Pharmacy", False, "left · right · mosque · medicine\nmission: where is ___?"),
            ],
        ),
        (
            660,
            "Quranic Vocabulary",
            "#a5d8ff",
            [
                ("Garden  LIVE", True, "tree · water · sun · earth · sky · bird\nthen: real Quran lemma counts"),
                ("Animals", False, "camel · cow · horse · bee · ant · spider\nQuran names as living things"),
                ("Actions", False, "walk · sit · open · give · eat · hear\nbody in motion, then the ayah"),
                ("Home", False, "house · door · light · food · family\neveryday world, Quranic core"),
            ],
        ),
        (
            1240,
            "Umrah companion",
            "#ffc9c9",
            [
                ("Prepare / Ihram", False, "intention · clothing · niyyah\nnotice first, rites second"),
                ("Travel / Arrive", False, "airport · road · hotel · Makkah\nreuse Arabic mission words"),
                ("Enter the Haram  PAGE", True, "marble · courtyard · Kaaba glimpse\ncompanion page, not hotspots yet"),
                ("Tawaf / Sa'i", False, "circle · Safa · Marwah · water\nlexicon: باب · ماء · بيت"),
            ],
        ),
        (
            1820,
            "Hajj companion",
            "#ffec99",
            [
                ("Ihram / Mina", False, "tent · simplicity · night\nshared with Umrah ihram"),
                ("Arafat", False, "plain · standing · sun · earth\nreuse garden sun / earth"),
                ("Muzdalifah / Jamarat", False, "pebbles · night · flow of people"),
                ("Tawaf / Return", False, "close the circle · gratitude\nnot a checklist"),
            ],
        ),
    ]

    for x, title, accent, cards in journeys:
        h = 120 + len(cards) * 130
        fr = frame(x, 740, 560, h, title)
        fid = fr["id"]
        labeled(x + 20, 760, 520, 48, title, accent, frame=fid, size=20)
        for i, (name, live, body) in enumerate(cards):
            cy = 830 + i * 130
            labeled(
                x + 20,
                cy,
                520,
                114,
                f"{name}\n{body}",
                "#ffffff" if live else "#f8f9fa",
                frame=fid,
                size=15,
                dashed=not live,
                fill="solid" if live else "hachure",
            )

    # Stencil
    st = frame(80, 1680, 2280, 420, "New adventure stencil — duplicate this")
    tid = st["id"]
    labeled(100, 1720, 520, 340, "Scene name\n______________", "#fff3bf", frame=tid, size=22)
    fields = [
        (660, "Place\nkitchen / courtyard / tent / gate"),
        (1100, "Notice first (3–6 objects)\n•\n•\n•"),
        (1540, "Mission (one line you can say)\n______________"),
        (1980, "Lexicon\nreuse ids:\nnew words only if needed:"),
    ]
    for x, label in fields:
        labeled(x, 1720, 400, 340, label, "#ffffff", frame=tid, size=16, dashed=True)

    out = {
        "type": "excalidraw",
        "version": 2,
        "source": "https://excalidraw.com",
        "elements": ELEMENTS,
        "appState": {
            "gridSize": 20,
            "gridModeEnabled": False,
            "viewBackgroundColor": "#fdf8f1",
            "currentItemFontFamily": 1,
        },
        "files": {},
    }
    path = Path(__file__).with_name("vocabulary-adventures.excalidraw")
    path.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {path} ({len(ELEMENTS)} elements)")


if __name__ == "__main__":
    main()
