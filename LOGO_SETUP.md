# 🎨 RIO Travels Logo Setup Guide

## Quick Start

Your RIO Travels branding has been wired throughout the frontend! Just copy your logo PNG file to two locations:

### Step 1: Copy Logo Files

```bash
# From the project root:
cp /path/to/rio-travels.png apps/frontend/public/rio-travels.png
cp /path/to/rio-travels.png apps/frontend/src/assets/images/brand/rio-travels.png
```

Or manually:

1. **For Favicon/PWA** → `apps/frontend/public/rio-travels.png`
2. **For Header Logo** → `apps/frontend/src/assets/images/brand/rio-travels.png`

### Step 2: Verify

Start the dev server and check:

```bash
cd apps/frontend
pnpm dev
```

**What to look for:**
- ✅ Browser tab shows RIO logo favicon
- ✅ Header displays full RIO Travels logo
- ✅ PWA manifest uses logo as app icon

---

## What's Been Updated

### 🖼️ Logo Component
**File:** `apps/frontend/src/ui-component/Logo.jsx`
- Replaced SVG with image import
- Displays your PNG logo in header
- Responsive sizing with `height` prop

### 🌐 HTML Head
**File:** `apps/frontend/index.html`
- Title: "RIO Travels CRM - Your Trusted Travel Partner"
- Favicon points to `rio-travels.png`
- Apple touch icon configured
- Meta tags updated for SEO
- Theme color set to `#2B5F8C` (RIO blue)

### 📱 PWA Manifest
**File:** `apps/frontend/public/site.webmanifest`
- App name: "RIO Travels CRM"
- Short name: "RIO Travels"
- Brand colors configured
- Icon sizes: 192, 256, 384, 512px

---

## Brand Colors (from your logo)

- **Primary Blue:** `#2B5F8C` (Used in theme-color, text)
- **Accent Orange:** `#F5A623` (Highlights, CTAs)
- **Text Gray:** `#6B7280` (Tagline, secondary text)

Consider updating your theme config to match:

```typescript
// apps/frontend/src/themes/palette.ts
primary: {
  main: '#2B5F8C',   // RIO Blue
  light: '#4A7BA7',
  dark: '#1A4663'
},
secondary: {
  main: '#F5A623',   // RIO Orange
  light: '#FFBB42',
  dark: '#D68910'
}
```

---

## Troubleshooting

**Logo not showing?**
1. Ensure PNG files exist in both locations
2. Clear browser cache (Cmd+Shift+R / Ctrl+F5)
3. Check browser console for 404 errors
4. Verify file names match exactly: `rio-travels.png`

**Logo too big/small?**
- Edit `Logo.jsx` and adjust the `height` prop (default: 32px)
- For header: `<Logo height={40} />`

**PWA icons not working?**
- PNG should be at least 512x512px for best quality
- Consider generating multiple sizes with:
  ```bash
  # Using ImageMagick or similar
  convert rio-travels.png -resize 192x192 public/icon-192.png
  convert rio-travels.png -resize 512x512 public/icon-512.png
  ```

---

## Next Steps

1. ✅ Copy logo files (see Step 1 above)
2. 🎨 Update theme colors to match brand
3. 🧪 Test on mobile (PWA install)
4. 🚀 Build and deploy

**Optional Enhancements:**
- Add a dark mode variant of the logo
- Create an animated loading spinner with your logo
- Add logo to email templates / PDF exports

---

**Need help?** Check:
- Logo component: `apps/frontend/src/ui-component/Logo.jsx`
- Branding assets: `apps/frontend/src/assets/images/brand/`
- Public assets: `apps/frontend/public/`

