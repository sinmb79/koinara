from __future__ import annotations

import math
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
DOCS_DIR = ROOT / "docs"
FIGURES_DIR = DOCS_DIR / "figures" / "whitepaper"

CANVAS_WIDTH = 1600
CANVAS_HEIGHT = 900

THEME = {
    "background": "#F4EFE6",
    "panel": "#FFFFFF",
    "ink": "#162236",
    "muted": "#667085",
    "line": "#CAD2DE",
    "accent": "#0F766E",
    "accent_soft": "#D8F0EC",
    "accent_two": "#D97706",
    "accent_two_soft": "#FDEBD3",
    "shadow": "#D5D2CB",
}


def windows_font_path(name: str) -> Path:
    return Path(os.environ.get("WINDIR", r"C:\Windows")) / "Fonts" / name


def load_font(size: int, *, bold: bool = False, korean: bool = False, mono: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates: list[Path]
    if mono:
        candidates = [windows_font_path("consola.ttf"), windows_font_path("cour.ttf")]
    elif korean:
        candidates = [windows_font_path("malgunbd.ttf" if bold else "malgun.ttf")]
    else:
        candidates = [
            windows_font_path("segoeuib.ttf" if bold else "segoeui.ttf"),
            windows_font_path("arialbd.ttf" if bold else "arial.ttf"),
        ]

    for path in candidates:
        if path.exists():
            return ImageFont.truetype(str(path), size=size)

    return ImageFont.load_default()


def new_canvas() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    image = Image.new("RGB", (CANVAS_WIDTH, CANVAS_HEIGHT), THEME["background"])
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((36, 36, CANVAS_WIDTH - 36, CANVAS_HEIGHT - 36), radius=30, fill=THEME["panel"], outline=THEME["line"], width=2)
    return image, draw


def text_width(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont) -> int:
    left, _, right, _ = draw.textbbox((0, 0), text, font=font)
    return right - left


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont, max_width: int) -> str:
    words = text.split()
    if not words:
        return text

    lines: list[str] = []
    current = words[0]
    for word in words[1:]:
        candidate = f"{current} {word}"
        if text_width(draw, candidate, font) <= max_width:
            current = candidate
        else:
            lines.append(current)
            current = word
    lines.append(current)
    return "\n".join(lines)


def draw_header(draw: ImageDraw.ImageDraw, *, eyebrow: str, title: str, subtitle: str, korean: bool) -> None:
    eyebrow_font = load_font(24, bold=True, korean=korean)
    title_font = load_font(44, bold=True, korean=korean)
    subtitle_font = load_font(22, korean=korean)

    draw.text((92, 90), eyebrow, fill=THEME["accent"], font=eyebrow_font)
    draw.text((92, 132), title, fill=THEME["ink"], font=title_font)
    draw.text((92, 198), subtitle, fill=THEME["muted"], font=subtitle_font)
    draw.line((92, 242, CANVAS_WIDTH - 92, 242), fill=THEME["line"], width=2)


def draw_shadowed_box(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], *, title: str, fill: str, outline: str, title_font: ImageFont.ImageFont) -> None:
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 8, y0 + 8, x1 + 8, y1 + 8), radius=22, fill=THEME["shadow"])
    draw.rounded_rectangle(box, radius=22, fill=fill, outline=outline, width=3)
    bbox = draw.multiline_textbbox((0, 0), title, font=title_font, spacing=6, align="center")
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    draw.multiline_text((x0 + (x1 - x0 - text_w) / 2, y0 + (y1 - y0 - text_h) / 2), title, fill=THEME["ink"], font=title_font, spacing=6, align="center")


def draw_arrow(draw: ImageDraw.ImageDraw, start: tuple[int, int], end: tuple[int, int], *, color: str, width: int = 6, label: str | None = None, label_font: ImageFont.ImageFont | None = None) -> None:
    draw.line((start, end), fill=color, width=width)
    angle = math.atan2(end[1] - start[1], end[0] - start[0])
    arrow_size = 18
    p1 = (
        end[0] - arrow_size * math.cos(angle - math.pi / 6),
        end[1] - arrow_size * math.sin(angle - math.pi / 6),
    )
    p2 = (
        end[0] - arrow_size * math.cos(angle + math.pi / 6),
        end[1] - arrow_size * math.sin(angle + math.pi / 6),
    )
    draw.polygon([end, p1, p2], fill=color)

    if label and label_font:
        mid_x = (start[0] + end[0]) / 2
        mid_y = (start[1] + end[1]) / 2
        label_box = draw.textbbox((0, 0), label, font=label_font)
        lw = label_box[2] - label_box[0]
        lh = label_box[3] - label_box[1]
        draw.rounded_rectangle((mid_x - lw / 2 - 10, mid_y - lh / 2 - 6, mid_x + lw / 2 + 10, mid_y + lh / 2 + 6), radius=10, fill=THEME["panel"], outline=THEME["line"])
        draw.text((mid_x - lw / 2, mid_y - lh / 2), label, fill=THEME["muted"], font=label_font)


def draw_note(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], *, text: str, korean: bool) -> None:
    draw.rounded_rectangle(box, radius=20, fill=THEME["accent_soft"], outline=THEME["accent"], width=2)
    font = load_font(24, korean=korean)
    wrapped = wrap_text(draw, text, font, box[2] - box[0] - 36)
    draw.multiline_text((box[0] + 18, box[1] + 18), wrapped, fill=THEME["ink"], font=font, spacing=8)


def generate_state_machine(language: str) -> None:
    korean = language == "ko"
    image, draw = new_canvas()
    draw_header(
        draw,
        eyebrow="FIGURE 1" if not korean else "FIGURE 1",
        title="Job Lifecycle State Machine" if not korean else "Job 상태 기계",
        subtitle="Minimum protocol validity follows explicit state transitions." if not korean else "최소 프로토콜 유효성은 명시적 상태 전이를 따른다.",
        korean=korean,
    )

    title_font = load_font(28, bold=True)
    label_font = load_font(20, korean=korean)

    boxes = {
        "Created": (110, 310, 300, 400),
        "Open": (360, 310, 550, 400),
        "Submitted": (610, 310, 800, 400),
        "Under\nVerification": (860, 300, 1090, 410),
        "Accepted": (1150, 250, 1340, 340),
        "Rejected": (1150, 390, 1340, 480),
        "Settled": (1380, 250, 1520, 340),
        "Expired": (360, 470, 550, 560),
    }

    for title, box in boxes.items():
        if title in {"Accepted", "Settled"}:
            fill = THEME["accent_soft"]
            outline = THEME["accent"]
        elif title in {"Rejected", "Expired"}:
            fill = THEME["accent_two_soft"]
            outline = THEME["accent_two"]
        else:
            fill = THEME["panel"]
            outline = THEME["line"]
        draw_shadowed_box(draw, box, title=title, fill=fill, outline=outline, title_font=title_font)

    draw_arrow(draw, (300, 355), (360, 355), color=THEME["accent"])
    draw_arrow(draw, (550, 355), (610, 355), color=THEME["accent"])
    draw_arrow(draw, (800, 355), (860, 355), color=THEME["accent"])
    draw_arrow(draw, (1090, 330), (1150, 295), color=THEME["accent"], label="pass" if not korean else "통과", label_font=label_font)
    draw_arrow(draw, (1090, 385), (1150, 435), color=THEME["accent_two"], label="fail" if not korean else "실패", label_font=label_font)
    draw_arrow(draw, (1340, 295), (1380, 295), color=THEME["accent"])
    draw_arrow(draw, (455, 400), (455, 470), color=THEME["accent_two"], label="no response" if not korean else "응답 없음", label_font=label_font)

    note_text = (
        "Accepted jobs mint protocol rewards. Rejected and expired jobs remain terminal non-mint outcomes in v1."
        if not korean
        else "v1에서는 Accepted job만 프로토콜 보상을 발행한다. Rejected와 Expired는 비발행 종료 상태로 남는다."
    )
    draw_note(draw, (110, 640, 1490, 790), text=note_text, korean=korean)

    output = FIGURES_DIR / language / "figure-01-state-machine.png"
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output)


def generate_network_flow(language: str) -> None:
    korean = language == "ko"
    image, draw = new_canvas()
    draw_header(
        draw,
        eyebrow="FIGURE 2",
        title="Main Network Flow" if not korean else "메인 네트워크 흐름",
        subtitle="Demand, response, verification, and settlement stay distinct." if not korean else "수요, 응답, 검증, 정산은 서로 분리된 채 연결된다.",
        korean=korean,
    )

    node_font = load_font(28, bold=True)
    badge_font = load_font(20, bold=True)
    nodes = [
        "User",
        "Inference Job",
        "Provider Network",
        "Candidate Responses",
        "Verifier Network",
        "MAI Check",
        "PoI + Settlement",
    ]

    x0, x1 = 480, 1120
    top = 285
    gap = 76
    height = 62

    for index, label in enumerate(nodes, start=1):
        y0 = top + (index - 1) * gap
        y1 = y0 + height
        draw.rounded_rectangle((x0 + 6, y0 + 6, x1 + 6, y1 + 6), radius=20, fill=THEME["shadow"])
        fill = THEME["accent_soft"] if index in {2, 6, 7} else THEME["panel"]
        outline = THEME["accent"] if index in {2, 6, 7} else THEME["line"]
        draw.rounded_rectangle((x0, y0, x1, y1), radius=20, fill=fill, outline=outline, width=3)
        draw.ellipse((380, y0 + 8, 436, y0 + 64), fill=THEME["ink"])
        draw.text((399, y0 + 23), str(index), fill=THEME["panel"], font=badge_font)
        bbox = draw.textbbox((0, 0), label, font=node_font)
        draw.text((x0 + (x1 - x0 - (bbox[2] - bbox[0])) / 2, y0 + 14), label, fill=THEME["ink"], font=node_font)
        if index < len(nodes):
            draw_arrow(draw, (800, y1), (800, y1 + gap - height), color=THEME["accent"])

    note_text = (
        "Koinara does not force a single routing market. Discovery can happen through relays, indexers, order books, or future peer-to-peer meshes."
        if not korean
        else "Koinara는 단일 라우팅 시장을 강제하지 않는다. 발견은 relay, indexer, order book, 혹은 미래의 peer-to-peer mesh를 통해 이뤄질 수 있다."
    )
    draw_note(draw, (120, 650, 420, 820), text=note_text, korean=korean)
    note_text_right = (
        "Only the minimum path is canonical at protocol level: job publication, response submission, MAI verification, PoI recording, and reward settlement."
        if not korean
        else "프로토콜 계층에서 정전화되는 것은 최소 경로뿐이다. job 게시, 응답 제출, MAI 검증, PoI 기록, 보상 정산만이 canonical path다."
    )
    draw_note(draw, (1180, 650, 1480, 820), text=note_text_right, korean=korean)

    output = FIGURES_DIR / language / "figure-02-network-flow.png"
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output)


def generate_layered_architecture(language: str) -> None:
    korean = language == "ko"
    image, draw = new_canvas()
    draw_header(
        draw,
        eyebrow="FIGURE 3",
        title="Layered Architecture" if not korean else "계층형 아키텍처",
        subtitle="The protocol stays minimal by separating logical responsibilities." if not korean else "논리적 책임을 분리함으로써 프로토콜을 최소로 유지한다.",
        korean=korean,
    )

    title_font = load_font(30, bold=True)
    body_font = load_font(22, korean=korean)
    layers = [
        ("Job Layer", "Request commitments, schema commitments, deadline, premium escrows" if not korean else "요청 commitment, 스키마 commitment, deadline, premium escrow"),
        ("Provider Layer", "Human or AI providers observe open jobs and submit candidate responses" if not korean else "인간 또는 AI provider가 열린 job을 관찰하고 후보 응답을 제출"),
        ("Verification Layer", "MAI checks, quorum approvals, rejection paths, verifier set commitments" if not korean else "MAI 검사, quorum 승인, reject 경로, verifier set commitment"),
        ("Settlement Layer", "PoI recording, KOIN issuance, verifier payout, job finalization" if not korean else "PoI 기록, KOIN 발행, verifier 지급, job final화"),
    ]

    left = 140
    right = 1460
    top = 285
    band_height = 112
    gap = 28

    for index, (title, body) in enumerate(layers):
        y0 = top + index * (band_height + gap)
        y1 = y0 + band_height
        fill = THEME["accent_soft"] if index % 2 == 0 else THEME["panel"]
        outline = THEME["accent"] if index % 2 == 0 else THEME["line"]
        draw.rounded_rectangle((left + 8, y0 + 8, right + 8, y1 + 8), radius=24, fill=THEME["shadow"])
        draw.rounded_rectangle((left, y0, right, y1), radius=24, fill=fill, outline=outline, width=3)
        draw.rounded_rectangle((left + 24, y0 + 22, left + 256, y1 - 22), radius=18, fill=THEME["ink"])
        tb = draw.textbbox((0, 0), title, font=title_font)
        draw.text((left + 140 - (tb[2] - tb[0]) / 2, y0 + 36), title, fill=THEME["panel"], font=title_font)
        wrapped = wrap_text(draw, body, body_font, 1050)
        draw.multiline_text((left + 300, y0 + 28), wrapped, fill=THEME["ink"], font=body_font, spacing=10)

    footer_text = (
        "Market complexity can grow above these layers without turning the protocol into a centralized quality judge."
        if not korean
        else "이 계층 위에서는 시장 복잡성이 커질 수 있지만, 프로토콜 자체가 중앙집중적 품질 심판이 될 필요는 없다."
    )
    draw_note(draw, (180, 760, 1420, 840), text=footer_text, korean=korean)

    output = FIGURES_DIR / language / "figure-03-layered-architecture.png"
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output)


def draw_dashed_line(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str, width: int, dash: int = 14, gap: int = 10) -> None:
    for start, end in zip(points, points[1:]):
        length = math.dist(start, end)
        if length == 0:
            continue
        dx = (end[0] - start[0]) / length
        dy = (end[1] - start[1]) / length
        progress = 0.0
        while progress < length:
            seg_start = progress
            seg_end = min(progress + dash, length)
            p0 = (start[0] + dx * seg_start, start[1] + dy * seg_start)
            p1 = (start[0] + dx * seg_end, start[1] + dy * seg_end)
            draw.line((p0, p1), fill=color, width=width)
            progress += dash + gap


def generate_issuance_curve(language: str) -> None:
    korean = language == "ko"
    image, draw = new_canvas()
    draw_header(
        draw,
        eyebrow="FIGURE 4",
        title="Issuance Curve" if not korean else "발행 곡선",
        subtitle="Epoch emissions decline while market rewards grow in importance." if not korean else "Epoch 발행은 감소하고 시장 보상의 중요성은 커진다.",
        korean=korean,
    )

    chart_left = 150
    chart_top = 300
    chart_right = 980
    chart_bottom = 730
    axis_color = THEME["ink"]
    label_font = load_font(22, korean=korean)
    mono_font = load_font(24, mono=True)

    draw.line((chart_left, chart_bottom, chart_right, chart_bottom), fill=axis_color, width=4)
    draw.line((chart_left, chart_bottom, chart_left, chart_top), fill=axis_color, width=4)

    steps = [
        (chart_left, 360),
        (320, 360),
        (320, 450),
        (500, 450),
        (500, 525),
        (680, 525),
        (680, 585),
        (860, 585),
        (860, 635),
        (chart_right, 635),
    ]

    for i in range(0, len(steps) - 1, 2):
        x0, y0 = steps[i]
        x1, y1 = steps[i + 1]
        draw.rectangle((x0, y0, x1, chart_bottom), fill=THEME["accent_soft"])
        if i + 2 < len(steps):
            nx, ny = steps[i + 2]
            draw.rectangle((x1, min(y0, ny), nx, chart_bottom), fill=THEME["accent_soft"])

    draw.line(steps, fill=THEME["accent"], width=8, joint="curve")

    rising = [(chart_left, 640), (300, 610), (450, 570), (620, 520), (800, 460), (chart_right, 400)]
    draw_dashed_line(draw, rising, color=THEME["accent_two"], width=6)

    for x in [320, 500, 680, 860]:
        draw.line((x, chart_bottom, x, chart_bottom + 12), fill=axis_color, width=3)

    draw.text((chart_left - 18, chart_top - 36), "Issuance" if not korean else "발행량", fill=axis_color, font=label_font)
    draw.text((chart_right - 30, chart_bottom + 22), "Epoch" if not korean else "Epoch", fill=axis_color, font=label_font)

    band_labels = [
        ("1-H", 230),
        ("H-2H", 405),
        ("2H-3H", 590),
        ("3H-4H", 770),
    ]
    for label, x in band_labels:
        bbox = draw.textbbox((0, 0), label, font=label_font)
        draw.text((x - (bbox[2] - bbox[0]) / 2, chart_bottom + 26), label, fill=THEME["muted"], font=label_font)

    formula_box = (1080, 320, 1450, 430)
    draw.rounded_rectangle(formula_box, radius=24, fill=THEME["panel"], outline=THEME["line"], width=3)
    draw.text((1110, 345), "Emission Function" if not korean else "발행 함수", fill=THEME["ink"], font=load_font(26, bold=True, korean=korean))
    draw.text((1110, 387), "E_t = E_0 * (1/2)^(floor(t / H))", fill=THEME["accent"], font=mono_font)

    draw_note(
        draw,
        (1060, 480, 1480, 650),
        text=(
            "Protocol issuance bootstraps the network early. Over time, premium market rewards become the dominant incentive."
            if not korean
            else "초기에는 프로토콜 발행이 네트워크를 부트스트랩하고, 시간이 갈수록 premium market reward가 주요 인센티브가 된다."
        ),
        korean=korean,
    )

    legend_y = 705
    draw.line((1080, legend_y, 1160, legend_y), fill=THEME["accent"], width=8)
    draw.text((1180, legend_y - 16), "Protocol issuance" if not korean else "프로토콜 발행", fill=THEME["ink"], font=label_font)
    draw_dashed_line(draw, [(1080, legend_y + 48), (1160, legend_y + 48)], color=THEME["accent_two"], width=6)
    draw.text((1180, legend_y + 32), "Market reward influence" if not korean else "시장 보상 영향력", fill=THEME["ink"], font=label_font)

    output = FIGURES_DIR / language / "figure-04-issuance-curve.png"
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output)


def generate_figures() -> None:
    for language in ("en", "ko"):
        generate_state_machine(language)
        generate_network_flow(language)
        generate_layered_architecture(language)
        generate_issuance_curve(language)


if __name__ == "__main__":
    generate_figures()
