# PWA Icon Generation Guide

MediaToolKit için gerekli tüm icon boyutları:

## Gerekli Icon Dosyaları:

public/icons/ klasöründe şu dosyalar olmalı:

1. icon-72x72.png
2. icon-96x96.png
3. icon-128x128.png
4. icon-144x144.png
5. icon-152x152.png
6. icon-192x192.png
7. icon-384x384.png
8. icon-512x512.png

## Splash Screen Dosyaları:

public/splash/ klasöründe:

1. splash-640x1136.png (iPhone SE)
2. splash-750x1334.png (iPhone 6/7/8)
3. splash-1242x2208.png (iPhone 6/7/8 Plus)
4. splash-1125x2436.png (iPhone X/XS)
5. splash-1284x2778.png (iPhone 12/13/14 Pro Max)

## Icon Oluşturma Yöntemleri:

### Yöntem 1: Online Tool (Kolay)
1. https://realfavicongenerator.net/ adresine git
2. icon.svg dosyasını yükle
3. Tüm boyutları otomatik oluştur ve indir

### Yöntem 2: Figma/Canva (Manuel)
1. 512x512 boyutunda tasarım yap
2. Her boyut için export et

### Yöntem 3: Node.js Script (Otomatik)
```bash
npm install sharp
node generate-icons.js
```

## generate-icons.js içeriği:

```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = './public/icons/icon.svg';
const outputDir = './public/icons';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate icons
sizes.forEach(size => {
  sharp(inputFile)
    .resize(size, size)
    .png()
    .toFile(path.join(outputDir, `icon-${size}x${size}.png`))
    .then(() => console.log(`Generated icon-${size}x${size}.png`))
    .catch(err => console.error(`Error generating ${size}:`, err));
});
```

## Splash Screen Tasarım Kuralları:

- Arka plan: #0a0a0f (koyu mor-siyah)
- Logo: Ortada, ekranın %30'u kadar
- "MediaToolKit" yazısı: Logo altında
- Gradient: purple-pink

## Örnek Splash Screen SVG:

```svg
<svg viewBox="0 0 750 1334">
  <rect width="750" height="1334" fill="#0a0a0f"/>
  <circle cx="375" cy="550" r="100" fill="url(#grad)"/>
  <text x="375" y="720" font-size="40" fill="white" text-anchor="middle">MediaToolKit</text>
</svg>
```

## Test Etme:

1. Chrome DevTools → Application → Manifest
2. Lighthouse → PWA audit
3. Gerçek cihazda test (iPhone Safari, Android Chrome)

## Dikkat Edilmesi Gerekenler:

- Tüm icon'lar PNG formatında olmalı
- Maskable icon'lar için safe zone bırakın (%80 merkez)
- Şeffaf arka plan KULLANMAYIN (solid renk)
- iOS için apple-touch-icon 180x180 olmalı
