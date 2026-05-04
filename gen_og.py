from PIL import Image, ImageDraw, ImageFont
import re

w, h = 1200, 630
img = Image.new('RGB', (w, h), '#18181e')
draw = ImageDraw.Draw(img)

# Subtle grid background
for i in range(0, w, 40):
    draw.line([(i, 0), (i, h)], fill='#1e1e24', width=1)
for i in range(0, h, 40):
    draw.line([(0, i), (w, i)], fill='#1e1e24', width=1)

# Cyan accent line at bottom
draw.rectangle([(0, h-4), (w, h)], fill='#8abeb7')

# Fonts
font_latin_bold = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 52)
font_latin_reg  = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 28)
font_hebrew_bold = ImageFont.truetype('/usr/share/fonts/truetype/noto/NotoSansHebrew-Bold.ttf', 48)
font_hebrew_reg  = ImageFont.truetype('/usr/share/fonts/truetype/noto/NotoSansHebrew-Regular.ttf', 28)

def is_hebrew_char(ch):
    """Check if character is Hebrew (U+0590–U+05FF)"""
    return '\u0590' <= ch <= '\u05ff'

def split_to_runs(text):
    """Split text into runs of same direction (Hebrew RTL vs Latin LTR).
    Returns list of (text, is_hebrew) tuples in visual order (L-to-R)."""
    if not text:
        return []
    
    # First, split into direction runs in logical order
    logical_runs = []
    current_run = ""
    current_is_hebrew = None
    
    for ch in text:
        if ch.isspace() or ch in '·•-—':
            # Neutral chars - attach to current run or start new
            if current_run:
                current_run += ch
            else:
                current_run = ch
                current_is_hebrew = False  # default for leading neutrals
        else:
            ch_is_hebrew = is_hebrew_char(ch)
            if current_is_hebrew is None:
                current_run = ch
                current_is_hebrew = ch_is_hebrew
            elif current_is_hebrew == ch_is_hebrew:
                current_run += ch
            else:
                logical_runs.append((current_run, current_is_hebrew))
                current_run = ch
                current_is_hebrew = ch_is_hebrew
    
    if current_run:
        logical_runs.append((current_run, current_is_hebrew))
    
    # For RTL Hebrew text, reverse the runs for visual display
    # Hebrew runs should appear right-to-left
    has_hebrew = any(is_h for _, is_h in logical_runs)
    
    if has_hebrew:
        # Reverse runs for RTL visual order
        visual_runs = list(reversed(logical_runs))
    else:
        visual_runs = logical_runs
    
    return visual_runs

def measure_run(text, is_hebrew, font_hebrew, font_latin):
    """Measure width of a text run"""
    total = 0
    for ch in text:
        font = font_hebrew if is_hebrew_char(ch) else font_latin
        bbox = draw.textbbox((0, 0), ch, font=font)
        total += bbox[2] - bbox[0]
    return total

def draw_runs(draw, x, y, runs, color, font_hebrew, font_latin):
    """Draw runs left-to-right at given x position"""
    cx = x
    for text, is_hebrew in runs:
        for ch in text:
            font = font_hebrew if is_hebrew_char(ch) else font_latin
            bbox = draw.textbbox((0, 0), ch, font=font)
            cw = bbox[2] - bbox[0]
            draw.text((cx, y), ch, fill=color, font=font)
            cx += cw
    return cx

def center_mixed_rtl(draw, y, text, color, font_hebrew, font_latin):
    """Center mixed Hebrew/Latin text with proper RTL visual ordering"""
    runs = split_to_runs(text)
    
    # Calculate total width
    total_w = 0
    for run_text, is_hebrew in runs:
        total_w += measure_run(run_text, is_hebrew, font_hebrew, font_latin)
    
    x = (w - total_w) // 2
    draw_runs(draw, x, y, runs, color, font_hebrew, font_latin)

# HZ Labs (Latin only, LTR)
hz_text = 'HZ Labs'
bbox = draw.textbbox((0, 0), hz_text, font=font_latin_bold)
tw = bbox[2] - bbox[0]
draw.text(((w - tw) // 2, 140), hz_text, fill='#8abeb7', font=font_latin_bold)

# Hebrew tagline (mixed RTL)
center_mixed_rtl(draw, 230, 'סטודיו פיתוח Full-Stack ואינטגרציית AI', '#00d7ff', font_hebrew_bold, font_latin_bold)

# Services (mixed RTL)
center_mixed_rtl(draw, 310, 'פלטפורמות תוכן  ·  סוכני AI  ·  אוטומציות חכמות', '#b0b0b0', font_hebrew_reg, font_latin_reg)

# CTA (Hebrew only, RTL)
center_mixed_rtl(draw, 390, 'מהאפיון ועד הייצור — צרו קשר לייעוץ ראשוני', '#8abeb7', font_hebrew_reg, font_latin_reg)

img.save('/home/shayh/shay/hzlabs/og-image.png')
print('Generated og-image.png with proper Hebrew RTL visual ordering')
