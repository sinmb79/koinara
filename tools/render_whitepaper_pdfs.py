from __future__ import annotations

import html
import os
import re
from dataclasses import dataclass
from pathlib import Path

from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import HRFlowable, Image as PlatypusImage, PageBreak, Paragraph, Preformatted, SimpleDocTemplate, Spacer

from generate_whitepaper_figures import generate_figures


ROOT = Path(__file__).resolve().parents[1]
DOCS_DIR = ROOT / "docs"
PDF_DIR = DOCS_DIR / "pdf"
IMAGE_PATTERN = re.compile(r"^!\[([^\]]*)\]\(([^)]+)\)$")


@dataclass(frozen=True)
class RenderConfig:
    source: Path
    output: Path
    language_label: str
    body_font: str
    bold_font: str
    footer_font: str
    cover_note: str
    cover_tagline: str
    edition_label: str
    cover_summary: str


def register_optional_fonts() -> None:
    windows_dir = Path(os.environ.get("WINDIR", r"C:\Windows"))
    malgun = windows_dir / "Fonts" / "malgun.ttf"
    malgun_bold = windows_dir / "Fonts" / "malgunbd.ttf"

    if malgun.exists() and "MalgunGothic" not in pdfmetrics.getRegisteredFontNames():
        pdfmetrics.registerFont(TTFont("MalgunGothic", str(malgun)))

    if malgun_bold.exists() and "MalgunGothic-Bold" not in pdfmetrics.getRegisteredFontNames():
        pdfmetrics.registerFont(TTFont("MalgunGothic-Bold", str(malgun_bold)))


def paragraph_styles(config: RenderConfig) -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "cover_kicker": ParagraphStyle(
            "CoverKicker",
            parent=base["BodyText"],
            fontName=config.bold_font,
            fontSize=10,
            leading=14,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#6B7280"),
            spaceAfter=14,
        ),
        "cover_title": ParagraphStyle(
            "CoverTitle",
            parent=base["Title"],
            fontName=config.bold_font,
            fontSize=24,
            leading=32,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#111827"),
            spaceAfter=10,
        ),
        "cover_tagline": ParagraphStyle(
            "CoverTagline",
            parent=base["BodyText"],
            fontName=config.body_font,
            fontSize=13,
            leading=20,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#374151"),
            spaceAfter=14,
        ),
        "cover_meta": ParagraphStyle(
            "CoverMeta",
            parent=base["BodyText"],
            fontName=config.body_font,
            fontSize=10.5,
            leading=16,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#6B7280"),
            spaceAfter=8,
        ),
        "title": ParagraphStyle(
            "WhitepaperTitle",
            parent=base["Title"],
            fontName=config.bold_font,
            fontSize=21,
            leading=28,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#111827"),
            spaceAfter=10,
        ),
        "meta": ParagraphStyle(
            "WhitepaperMeta",
            parent=base["BodyText"],
            fontName=config.body_font,
            fontSize=9.8,
            leading=14,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#6B7280"),
            spaceAfter=18,
        ),
        "h2": ParagraphStyle(
            "WhitepaperH2",
            parent=base["Heading2"],
            fontName=config.bold_font,
            fontSize=15,
            leading=22,
            alignment=TA_LEFT,
            textColor=colors.HexColor("#111827"),
            spaceBefore=14,
            spaceAfter=8,
        ),
        "h3": ParagraphStyle(
            "WhitepaperH3",
            parent=base["Heading3"],
            fontName=config.bold_font,
            fontSize=11.5,
            leading=17,
            alignment=TA_LEFT,
            textColor=colors.HexColor("#1F2937"),
            spaceBefore=8,
            spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "WhitepaperBody",
            parent=base["BodyText"],
            fontName=config.body_font,
            fontSize=10.5,
            leading=16.5,
            alignment=TA_JUSTIFY,
            textColor=colors.HexColor("#111827"),
            spaceAfter=8,
        ),
        "callout": ParagraphStyle(
            "WhitepaperCallout",
            parent=base["BodyText"],
            fontName=config.body_font,
            fontSize=10.2,
            leading=15.5,
            alignment=TA_LEFT,
            textColor=colors.HexColor("#1F2937"),
            leftIndent=10,
            rightIndent=10,
            borderPadding=10,
            borderWidth=0.7,
            borderColor=colors.HexColor("#D1D5DB"),
            backColor=colors.HexColor("#F9FAFB"),
            spaceAfter=12,
        ),
        "bullet": ParagraphStyle(
            "WhitepaperBullet",
            parent=base["BodyText"],
            fontName=config.body_font,
            fontSize=10.5,
            leading=16,
            alignment=TA_LEFT,
            leftIndent=14,
            firstLineIndent=-10,
            textColor=colors.HexColor("#111827"),
            spaceAfter=4,
        ),
        "number": ParagraphStyle(
            "WhitepaperNumber",
            parent=base["BodyText"],
            fontName=config.body_font,
            fontSize=10.5,
            leading=16,
            alignment=TA_LEFT,
            leftIndent=18,
            firstLineIndent=-14,
            textColor=colors.HexColor("#111827"),
            spaceAfter=4,
        ),
        "code": ParagraphStyle(
            "WhitepaperCode",
            parent=base["Code"],
            fontName="Courier",
            fontSize=8.8,
            leading=12,
            leftIndent=8,
            rightIndent=8,
            borderPadding=8,
            borderWidth=0.7,
            borderColor=colors.HexColor("#D1D5DB"),
            backColor=colors.HexColor("#F9FAFB"),
            textColor=colors.HexColor("#111827"),
            spaceAfter=12,
        ),
    }


def is_ordered_item(line: str) -> bool:
    return re.match(r"^\d+\.\s+", line) is not None


def is_bullet_item(line: str) -> bool:
    return line.startswith("- ")


def is_heading(line: str) -> bool:
    return line.startswith("# ")


def is_subheading(line: str) -> bool:
    return line.startswith("## ")


def is_minor_heading(line: str) -> bool:
    return line.startswith("### ")


def is_image_line(line: str) -> bool:
    return IMAGE_PATTERN.match(line.strip()) is not None


def is_special(line: str) -> bool:
    stripped = line.strip()
    return (
        not stripped
        or is_heading(stripped)
        or is_subheading(stripped)
        or is_minor_heading(stripped)
        or is_image_line(stripped)
        or is_bullet_item(stripped)
        or is_ordered_item(stripped)
    )


def format_inline(text: str, code_font: str = "Courier") -> str:
    linked = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1 (\2)", text)
    parts = linked.split("`")
    chunks: list[str] = []

    for index, part in enumerate(parts):
        escaped = html.escape(part)
        if index % 2 == 1:
            chunks.append(f'<font name="{code_font}">{escaped}</font>')
        else:
            chunks.append(escaped)

    return "".join(chunks)


def parse_blocks(text: str) -> list[tuple[str, object]]:
    lines = text.replace("\r\n", "\n").split("\n")
    blocks: list[tuple[str, object]] = []
    index = 0

    while index < len(lines):
        line = lines[index].strip()

        if not line:
            index += 1
            continue

        if is_heading(line):
            blocks.append(("title", line[2:].strip()))
            index += 1
            continue

        image_match = IMAGE_PATTERN.match(line)
        if image_match:
            blocks.append(("image", {"alt": image_match.group(1), "path": image_match.group(2)}))
            index += 1
            continue

        if line.startswith("```"):
            fence_lang = line[3:].strip()
            code_lines: list[str] = []
            index += 1
            while index < len(lines) and not lines[index].startswith("```"):
                code_lines.append(lines[index].rstrip("\n"))
                index += 1
            if index < len(lines) and lines[index].startswith("```"):
                index += 1
            code_block = "\n".join(code_lines)
            if fence_lang:
                code_block = f"[{fence_lang}]\n{code_block}"
            blocks.append(("code", code_block))
            continue

        if is_subheading(line):
            blocks.append(("h2", line[3:].strip()))
            index += 1
            continue

        if is_minor_heading(line):
            blocks.append(("h3", line[4:].strip()))
            index += 1
            continue

        if is_bullet_item(line):
            items: list[str] = []
            while index < len(lines) and is_bullet_item(lines[index].strip()):
                items.append(lines[index].strip()[2:].strip())
                index += 1
            blocks.append(("bullet_list", items))
            continue

        if is_ordered_item(line):
            items: list[str] = []
            while index < len(lines) and is_ordered_item(lines[index].strip()):
                items.append(re.sub(r"^\d+\.\s+", "", lines[index].strip()))
                index += 1
            blocks.append(("ordered_list", items))
            continue

        paragraph_lines = [line]
        index += 1
        while index < len(lines) and not is_special(lines[index]):
            paragraph_lines.append(lines[index].strip())
            index += 1

        blocks.append(("paragraph", " ".join(paragraph_lines)))

    return blocks


def add_cover(story: list[object], styles: dict[str, ParagraphStyle], config: RenderConfig, title: str) -> None:
    story.append(Spacer(1, 46))
    story.append(Paragraph(config.edition_label, styles["cover_kicker"]))
    story.append(HRFlowable(width="18%", thickness=1.1, color=colors.HexColor("#9CA3AF"), lineCap="round"))
    story.append(Spacer(1, 22))
    story.append(Paragraph(format_inline(title), styles["cover_title"]))
    story.append(Paragraph(config.cover_tagline, styles["cover_tagline"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(config.language_label, styles["cover_meta"]))
    story.append(Paragraph(config.cover_note, styles["cover_meta"]))
    story.append(Spacer(1, 22))
    story.append(Paragraph(config.cover_summary, styles["callout"]))
    story.append(PageBreak())


def build_image_flowable(config: RenderConfig, payload: dict[str, str]) -> PlatypusImage:
    image_path = (config.source.parent / payload["path"]).resolve()
    with PILImage.open(image_path) as image:
        width_px, height_px = image.size

    max_width = A4[0] - (44 * mm)
    draw_width = max_width
    draw_height = draw_width * height_px / width_px

    flowable = PlatypusImage(str(image_path), width=draw_width, height=draw_height)
    flowable.hAlign = "CENTER"
    return flowable


def build_story(config: RenderConfig) -> list[object]:
    styles = paragraph_styles(config)
    text = config.source.read_text(encoding="utf-8")
    blocks = parse_blocks(text)
    story: list[object] = []

    if not blocks or blocks[0][0] != "title":
        raise ValueError(f"Expected first block in {config.source} to be a title")

    add_cover(story, styles, config, str(blocks[0][1]))

    title_seen = False
    for block_index, (kind, payload) in enumerate(blocks):
        if kind == "title":
            story.append(Paragraph(format_inline(str(payload)), styles["title"]))
            if not title_seen:
                story.append(Paragraph(config.language_label, styles["meta"]))
                story.append(
                    Paragraph(
                        "Official distribution-ready whitepaper edition."
                        if config.language_label == "English"
                        else "공식 배포용 백서 판본.",
                        styles["meta"],
                    )
                )
                title_seen = True
            continue

        if kind == "h2":
            if block_index > 1:
                story.append(Spacer(1, 2))
            story.append(Paragraph(format_inline(str(payload)), styles["h2"]))
            continue

        if kind == "h3":
            story.append(Paragraph(format_inline(str(payload)), styles["h3"]))
            continue

        if kind == "paragraph":
            story.append(Paragraph(format_inline(str(payload)), styles["body"]))
            continue

        if kind == "image":
            story.append(build_image_flowable(config, payload))  # type: ignore[arg-type]
            story.append(Spacer(1, 10))
            continue

        if kind == "code":
            story.append(Preformatted(str(payload), styles["code"]))
            continue

        if kind == "bullet_list":
            for item in payload:  # type: ignore[assignment]
                story.append(Paragraph(f"- {format_inline(item)}", styles["bullet"]))
            story.append(Spacer(1, 4))
            continue

        if kind == "ordered_list":
            for number, item in enumerate(payload, start=1):  # type: ignore[assignment]
                story.append(Paragraph(f"{number}. {format_inline(item)}", styles["number"]))
            story.append(Spacer(1, 4))

    return story


def footer(config: RenderConfig):
    def draw(canvas, doc) -> None:
        del doc
        canvas.saveState()
        canvas.setFont(config.footer_font, 8.8)
        canvas.setFillColor(colors.HexColor("#6B7280"))
        canvas.drawString(18 * mm, 11.5 * mm, "Koinara Whitepaper")
        canvas.drawRightString(A4[0] - 18 * mm, 11.5 * mm, f"{config.language_label} | {canvas.getPageNumber()}")
        canvas.restoreState()

    return draw


def render_pdf(config: RenderConfig) -> None:
    config.output.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(config.output),
        pagesize=A4,
        leftMargin=22 * mm,
        rightMargin=22 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title="Koinara Whitepaper",
        author="Koinara",
        subject=f"Koinara whitepaper ({config.language_label})",
    )
    story = build_story(config)
    decorator = footer(config)
    doc.build(story, onFirstPage=decorator, onLaterPages=decorator)


def main() -> None:
    register_optional_fonts()
    generate_figures()

    configs = [
        RenderConfig(
            source=DOCS_DIR / "whitepaper.md",
            output=PDF_DIR / "koinara-whitepaper-en.pdf",
            language_label="English",
            body_font="Times-Roman",
            bold_font="Times-Bold",
            footer_font="Times-Roman",
            cover_note="Reference Whitepaper | March 10, 2026",
            cover_tagline="The open network for collective inference",
            edition_label="KOINARA WHITEPAPER",
            cover_summary="Koinara defines a minimum protocol for collective inference, centered on MAI and minimum reward.",
        ),
        RenderConfig(
            source=DOCS_DIR / "whitepaper.ko.md",
            output=PDF_DIR / "koinara-whitepaper-ko.pdf",
            language_label="Korean",
            body_font="MalgunGothic",
            bold_font="MalgunGothic-Bold",
            footer_font="MalgunGothic",
            cover_note="참조 백서 | 2026년 3월 10일",
            cover_tagline="집단 추론을 위한 개방형 네트워크",
            edition_label="KOINARA 백서",
            cover_summary="Koinara는 MAI와 최소 보상을 중심으로 집단 추론의 최소 프로토콜을 정의한다.",
        ),
    ]

    for config in configs:
        render_pdf(config)
        print(f"Generated {config.output.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
