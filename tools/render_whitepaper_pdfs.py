from __future__ import annotations

import html
import os
import re
from dataclasses import dataclass
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


ROOT = Path(__file__).resolve().parents[1]
DOCS_DIR = ROOT / "docs"
PDF_DIR = DOCS_DIR / "pdf"


@dataclass(frozen=True)
class RenderConfig:
    source: Path
    output: Path
    language_label: str
    body_font: str
    bold_font: str
    footer_font: str


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
        "title": ParagraphStyle(
            "WhitepaperTitle",
            parent=base["Title"],
            fontName=config.bold_font,
            fontSize=22,
            leading=28,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#111111"),
            spaceAfter=8,
        ),
        "meta": ParagraphStyle(
            "WhitepaperMeta",
            parent=base["BodyText"],
            fontName=config.body_font,
            fontSize=10,
            leading=14,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#666666"),
            spaceAfter=20,
        ),
        "h2": ParagraphStyle(
            "WhitepaperH2",
            parent=base["Heading2"],
            fontName=config.bold_font,
            fontSize=15,
            leading=20,
            alignment=TA_LEFT,
            textColor=colors.HexColor("#111111"),
            spaceBefore=10,
            spaceAfter=8,
        ),
        "h3": ParagraphStyle(
            "WhitepaperH3",
            parent=base["Heading3"],
            fontName=config.bold_font,
            fontSize=12,
            leading=16,
            alignment=TA_LEFT,
            textColor=colors.HexColor("#222222"),
            spaceBefore=8,
            spaceAfter=5,
        ),
        "body": ParagraphStyle(
            "WhitepaperBody",
            parent=base["BodyText"],
            fontName=config.body_font,
            fontSize=10.5,
            leading=16,
            alignment=TA_LEFT,
            textColor=colors.HexColor("#111111"),
            spaceAfter=8,
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
            textColor=colors.HexColor("#111111"),
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
            textColor=colors.HexColor("#111111"),
            spaceAfter=4,
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


def is_special(line: str) -> bool:
    stripped = line.strip()
    return (
        not stripped
        or is_heading(stripped)
        or is_subheading(stripped)
        or is_minor_heading(stripped)
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


def build_story(config: RenderConfig) -> list[object]:
    styles = paragraph_styles(config)
    text = config.source.read_text(encoding="utf-8")
    blocks = parse_blocks(text)
    story: list[object] = []
    title_seen = False

    for kind, payload in blocks:
        if kind == "title":
            story.append(Spacer(1, 18))
            story.append(Paragraph(format_inline(str(payload)), styles["title"]))
            story.append(Paragraph(config.language_label, styles["meta"]))
            title_seen = True
            continue

        if kind == "h2":
            story.append(Paragraph(format_inline(str(payload)), styles["h2"]))
            continue

        if kind == "h3":
            story.append(Paragraph(format_inline(str(payload)), styles["h3"]))
            continue

        if kind == "paragraph":
            if not title_seen:
                story.append(Paragraph(format_inline(str(payload)), styles["meta"]))
            else:
                story.append(Paragraph(format_inline(str(payload)), styles["body"]))
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
        canvas.saveState()
        canvas.setFont(config.footer_font, 9)
        canvas.setFillColor(colors.HexColor("#666666"))
        canvas.drawRightString(A4[0] - 18 * mm, 12 * mm, f"Koinara Whitepaper | {config.language_label} | {canvas.getPageNumber()}")
        canvas.restoreState()

    return draw


def render_pdf(config: RenderConfig) -> None:
    config.output.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(config.output),
        pagesize=A4,
        leftMargin=22 * mm,
        rightMargin=22 * mm,
        topMargin=20 * mm,
        bottomMargin=18 * mm,
        title="Koinara Whitepaper",
        author="Koinara",
    )
    story = build_story(config)
    decorator = footer(config)
    doc.build(story, onFirstPage=decorator, onLaterPages=decorator)


def main() -> None:
    register_optional_fonts()

    configs = [
        RenderConfig(
            source=DOCS_DIR / "whitepaper.md",
            output=PDF_DIR / "koinara-whitepaper-en.pdf",
            language_label="English",
            body_font="Times-Roman",
            bold_font="Times-Bold",
            footer_font="Times-Roman",
        ),
        RenderConfig(
            source=DOCS_DIR / "whitepaper.ko.md",
            output=PDF_DIR / "koinara-whitepaper-ko.pdf",
            language_label="Korean",
            body_font="MalgunGothic",
            bold_font="MalgunGothic-Bold",
            footer_font="MalgunGothic",
        ),
    ]

    for config in configs:
        render_pdf(config)
        print(f"Generated {config.output.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
