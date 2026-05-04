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

# Use standard Noto Sans Hebrew (not condensed) for better readability
font_title = ImageFont.truetype('/usr/share/fonts/truetype/noto/NotoSansHebrew-Bold.ttf', 68)
font_sub   = ImageFont.truetype('/usr/share/fonts/truetype/noto/NotoSansHebrew-Bold.ttf', 36)
font_small = ImageFont.truetype('/usr/share/fonts/truetype/noto/NotoSansHebrew-Regular.ttf', 28)
font_mono  = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 52)

# HZ Labs in monospace (centered)
hz_text = 'HZ Labs'
bbox = draw.textbbox((0,0), hz_text, font=font_mono)
tw = bbox[2] - bbox[0]
draw.text(((w-tw)//2, 120), hz_text, fill='#8abeb7', font=font_mono)

# Hebrew tagline
tagline = 'סטודיו פיתוח Full-Stack ואינטגרציית AI'
bbox = draw.textbbox((0,0), tagline, font=font_sub)
tw = bbox[2] - bbox[0]
draw.text(((w-tw)//2, 220), tagline, fill='#00d7ff', font=font_sub)

# Services line
services = 'פלטפורמות תוכן  ·  סוכני AI  ·  אוטומציות חכמות'
bbox = draw.textbbox((0,0), services, font=font_small)
tw = bbox[2] - bbox[0]
draw.text(((w-tw)//2, 300), services, fill='#b0b0b0', font=font_small)

# CTA line
cta = 'מהאפיון ועד הייצור — צרו קשר לייעוץ ראשוני'
bbox = draw.textbbox((0,0), cta, font=font_small)
tw = bbox[2] - bbox[0]
draw.text(((w-tw)//2, 380), cta, fill='#8abeb7', font=font_small)

img.save('/home/shayh/shay/hzlabs/og-image.png')
print('Generated Hebrew og-image.png (1200x630) with standard Noto Sans Hebrew')
