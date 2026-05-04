from PIL import Image, ImageDraw, ImageFont

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

# Fonts: use appropriate font for each script
font_latin_bold = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 52)
font_latin_reg  = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 28)
font_hebrew_bold = ImageFont.truetype('/usr/share/fonts/truetype/noto/NotoSansHebrew-Bold.ttf', 48)
font_hebrew_reg  = ImageFont.truetype('/usr/share/fonts/truetype/noto/NotoSansHebrew-Regular.ttf', 28)

def draw_mixed_text(draw, x, y, text, color, font_hebrew, font_latin):
    """Draw mixed Hebrew/Latin text with appropriate fonts for each script.
    Hebrew: U+0590-U+05FF, Latin: ASCII letters"""
    cx = x
    i = 0
    while i < len(text):
        ch = text[i]
        # Check if Hebrew character (Unicode range)
        if '\u0590' <= ch <= '\u05ff':
            font = font_hebrew
        else:
            font = font_latin
        
        # Draw single character
        bbox = draw.textbbox((0,0), ch, font=font)
        cw = bbox[2] - bbox[0]
        ch_h = bbox[3] - bbox[1]
        draw.text((cx, y), ch, fill=color, font=font)
        cx += cw
        i += 1
    return cx

# Helper to center mixed text
def center_mixed_text(draw, y, text, color, font_hebrew, font_latin):
    # Calculate total width
    total_w = 0
    for ch in text:
        if '\u0590' <= ch <= '\u05ff':
            font = font_hebrew
        else:
            font = font_latin
        bbox = draw.textbbox((0,0), ch, font=font)
        total_w += bbox[2] - bbox[0]
    
    x = (w - total_w) // 2
    draw_mixed_text(draw, x, y, text, color, font_hebrew, font_latin)

# HZ Labs (Latin only)
hz_text = 'HZ Labs'
bbox = draw.textbbox((0,0), hz_text, font=font_latin_bold)
tw = bbox[2] - bbox[0]
draw.text(((w-tw)//2, 140), hz_text, fill='#8abeb7', font=font_latin_bold)

# Hebrew tagline (mixed)
center_mixed_text(draw, 230, 'סטודיו פיתוח Full-Stack ואינטגרציית AI', '#00d7ff', font_hebrew_bold, font_latin_bold)

# Services (mixed)
center_mixed_text(draw, 310, 'פלטפורמות תוכן  ·  סוכני AI  ·  אוטומציות חכמות', '#b0b0b0', font_hebrew_reg, font_latin_reg)

# CTA (Hebrew only)
center_mixed_text(draw, 390, 'מהאפיון ועד הייצור — צרו קשר לייעוץ ראשוני', '#8abeb7', font_hebrew_reg, font_latin_reg)

img.save('/home/shayh/shay/hzlabs/og-image.png')
print('Generated og-image.png with per-character font selection (Hebrew+Latin)')
