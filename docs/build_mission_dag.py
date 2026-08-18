#!/usr/bin/env python3
"""Generate docs/mission-dag.excalidraw from the Umrah / Arabic mission graphs."""

from __future__ import annotations

import json
import random
from pathlib import Path

random.seed(18)
NOW = 1_724_000_000_000
N = 0
ELEMENTS: list[dict] = []

NODE_W = 168
NODE_H = 78
COL_GAP = 56
ROW_H = 150

UMRAH_NODES = [
    {"id": "immigration", "label": "Passport", "row": 0, "col": 1, "kind": "core", "requires": []},
    {"id": "airport-arrival", "label": "Airport", "row": 1, "col": 1, "kind": "core", "requires": ["immigration"]},
    {"id": "taxi-hotel", "label": "Taxi", "row": 2, "col": 1, "kind": "core", "requires": ["airport-arrival"]},
    {"id": "find-haram", "label": "Gate", "row": 3, "col": 1, "kind": "core", "requires": ["taxi-hotel"]},
    {"id": "enter-haram", "label": "Enter", "row": 4, "col": 1, "kind": "core", "requires": ["find-haram"]},
    {"id": "order-dinner", "label": "Dinner", "row": 4, "col": 0, "kind": "side", "requires": ["taxi-hotel"]},
    {"id": "begin-tawaf", "label": "Tawaf", "row": 5, "col": 1, "kind": "core", "requires": ["enter-haram"]},
    {"id": "lost-group", "label": "Lost?", "row": 5, "col": 0, "kind": "side", "requires": ["enter-haram"]},
    {"id": "something-wrong", "label": "Help", "row": 5, "col": 2, "kind": "side", "requires": ["enter-haram"]},
    {"id": "find-zamzam", "label": "Zamzam", "row": 6, "col": 1, "kind": "core", "requires": ["begin-tawaf"]},
    {"id": "complete-sai", "label": "Sa'i", "row": 7, "col": 1, "kind": "core", "requires": ["find-zamzam"]},
    {"id": "barber", "label": "Barber", "row": 8, "col": 1, "kind": "core", "requires": ["complete-sai"]},
    {"id": "day-madinah", "label": "Madinah", "row": 9, "col": 1, "kind": "core", "requires": ["barber"]},
]

UMRAH_EDGES = [
    ("immigration", "airport-arrival", "core"),
    ("airport-arrival", "taxi-hotel", "core"),
    ("taxi-hotel", "find-haram", "core"),
    ("taxi-hotel", "order-dinner", "side"),
    ("find-haram", "enter-haram", "core"),
    ("enter-haram", "begin-tawaf", "core"),
    ("enter-haram", "lost-group", "side"),
    ("enter-haram", "something-wrong", "side"),
    ("begin-tawaf", "find-zamzam", "core"),
    ("find-zamzam", "complete-sai", "core"),
    ("complete-sai", "barber", "core"),
    ("barber", "day-madinah", "core"),
]

STAGES = [
    (0, "Arrival"),
    (3, "Makkah"),
    (9, "Madinah"),
]

ARABIC_NODES = [
    {"id": "taxi-hotel", "label": "Taxi", "row": 0, "col": 0, "kind": "core", "requires": []},
    {"id": "find-haram", "label": "Gate", "row": 0, "col": 2, "kind": "core", "requires": []},
    {"id": "order-dinner", "label": "Dinner", "row": 1, "col": 0, "kind": "core", "requires": ["taxi-hotel"]},
    {"id": "enter-haram", "label": "Enter", "row": 1, "col": 2, "kind": "core", "requires": ["find-haram"]},
]
ARABIC_EDGES = [
    ("taxi-hotel", "order-dinner", "core"),
    ("find-haram", "enter-haram", "core"),
]


def nid() -> str:
    global N
    N += 1
    return f"d{N:04d}"


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
        "fillStyle": "solid",
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


def rect(x, y, w, h, bg, frame=None, dashed=False, stroke="#1e1e1e"):
    return el(
        type="rectangle",
        x=x,
        y=y,
        width=w,
        height=h,
        backgroundColor=bg,
        fillStyle="solid",
        roundness={"type": 3},
        strokeStyle="dashed" if dashed else "solid",
        strokeColor=stroke,
        strokeWidth=1.5 if dashed else 1,
        frameId=frame,
    )


def labeled(x, y, w, h, content, bg, frame=None, size=16, dashed=False, stroke="#1e1e1e"):
    gid = nid()
    box = rect(x, y, w, h, bg, frame=frame, dashed=dashed, stroke=stroke)
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


def arrow(x1, y1, x2, y2, frame=None, color="#1971c2", dashed=False):
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
        strokeColor=color,
        strokeStyle="dashed" if dashed else "solid",
        strokeWidth=1.5,
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


def col_x(origin_x: float, col: int) -> float:
    return origin_x + col * (NODE_W + COL_GAP)


def row_y(origin_y: float, row: int) -> float:
    return origin_y + row * ROW_H


def place_nodes(origin_x, origin_y, nodes, frame_id):
    placed = {}
    for node in nodes:
        x = col_x(origin_x, node["col"])
        y = row_y(origin_y, node["row"])
        side = node["kind"] == "side"
        bg = "#ffd8a8" if side else "#fff3bf"
        if not node["requires"] and not side:
            bg = "#b2f2bb"
        if node["id"] == "day-madinah":
            bg = "#d3f9d8"
        labeled(
            x,
            y,
            NODE_W,
            NODE_H,
            f"{node['label']}\n{node['id']}",
            bg,
            frame=frame_id,
            size=15,
            dashed=side,
        )
        placed[node["id"]] = {
            "x": x,
            "y": y,
            "cx": x + NODE_W / 2,
            "top": y,
            "bottom": y + NODE_H,
            "left": x,
            "right": x + NODE_W,
        }
    return placed


def draw_edges(placed, edges, frame_id):
    for src, dst, kind in edges:
        a, b = placed[src], placed[dst]
        side = kind == "side"
        color = "#e8590c" if side else "#1971c2"
        x1, y1 = a["cx"], a["bottom"]
        x2, y2 = b["cx"], b["top"]
        if abs(x1 - x2) > 40:
            y1 = a["y"] + NODE_H / 2
            x1 = a["left"] if x2 < x1 else a["right"]
            y2 = b["y"] + NODE_H / 2
            x2 = b["right"] if x2 < a["cx"] else b["left"]
        arrow(x1, y1, x2, y2, frame=frame_id, color=color, dashed=side)


def main() -> None:
    text(80, 32, "Umrah journey DAG", size=36)
    text(
        80,
        84,
        "A trip spine: Arrival → Makkah → Madinah. Side stops (Dinner, Lost, Help) do not block the way.",
        size=18,
        color="#495057",
    )

    legend = frame(80, 130, 1560, 90, "Legend")
    lid = legend["id"]
    labeled(100, 150, 220, 50, "Entry", "#b2f2bb", frame=lid, size=14)
    labeled(340, 150, 280, 50, "Spine  requires previous", "#fff3bf", frame=lid, size=14)
    labeled(640, 150, 280, 50, "Side  optional", "#ffd8a8", frame=lid, size=14, dashed=True)
    labeled(940, 150, 220, 50, "Madinah", "#d3f9d8", frame=lid, size=14)
    labeled(1180, 150, 430, 50, "Hajj / Quran: no graph yet", "#e9ecef", frame=lid, size=14, dashed=True)

    umrah = frame(80, 250, 820, 1680, "Umrah  ·  one parent each  ·  max 3 columns")
    uid = umrah["id"]
    origin_x, origin_y = 168, 310
    for row, label in STAGES:
        y = row_y(origin_y, row) - 28
        labeled(100, y, 140, 36, label, "#d0ebff", frame=uid, size=14)
    placed = place_nodes(origin_x, origin_y, UMRAH_NODES, uid)
    draw_edges(placed, UMRAH_EDGES, uid)

    notes = frame(940, 250, 700, 520, "How unlock works now")
    nid_frame = notes["id"]
    labeled(
        960,
        280,
        660,
        140,
        "Spine: each place needs only the one before it.\nNo more AND of the whole previous row.",
        "#fff3bf",
        frame=nid_frame,
        size=16,
    )
    labeled(
        960,
        440,
        660,
        140,
        "Dinner / Lost? / Help branch off and never gate\nBarber or Madinah.",
        "#ffd8a8",
        frame=nid_frame,
        size=16,
    )
    labeled(
        960,
        600,
        660,
        140,
        "Unplayable places: Prep → Continue the journey\nso the path can still move.",
        "#d0ebff",
        frame=nid_frame,
        size=16,
    )

    arabic = frame(940, 800, 700, 520, "Arabic for Real Life  ·  two short tracks")
    aid = arabic["id"]
    text(
        960,
        820,
        "Taxi → Dinner and Gate → Enter. Each track unlocks on its own.",
        size=14,
        color="#495057",
        frame=aid,
    )
    arabic_placed = place_nodes(980, 880, ARABIC_NODES, aid)
    draw_edges(arabic_placed, ARABIC_EDGES, aid)

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
    path = Path(__file__).with_name("mission-dag.excalidraw")
    path.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {path} ({len(ELEMENTS)} elements)")


if __name__ == "__main__":
    main()
