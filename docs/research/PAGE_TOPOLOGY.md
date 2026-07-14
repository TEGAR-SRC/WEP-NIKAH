# Page Topology — Javanese Wedding Invitation

## Overview
Mobile-first horizontal swipe wedding invitation on satumomen.com platform.
12 slides, each 100vh x 100vw, swiped horizontally via JS touch/swipe library.
Bottom fixed nav menu + floating action buttons (WhatsApp, QR, Music, Autoplay).

## Interaction Model
- **Entry:** Cover slide with "Buka Undangan" button → click to open invitation
- **Navigation:** Horizontal swipe between slides (touch + drag)
- **Bottom menu:** Fixed nav with 12 items, each scrolls/jumps to corresponding slide
- **Animations:** animate.css classes on most elements (fadeInDown, fadeInUp, zoomIn, etc.)

## Slide Structure
| # | Name | Content | Interaction |
|---|------|---------|-------------|
| 0 | **Cover** | Date, illustration, "The Wedding of Vivy & Fauzan", guest name, "Buka Undangan" button | Click to open |
| 1 | **Opening** | Couple initials "vf", date, character illustration, "Vivy & Fauzan" | Static |
| 2 | **Mempelai (Bride & Groom)** | Nama Pria & Nama Wanita with photos, family names, decorative SVG divider | Static |
| 3 | **Quotes** | "Yang Fana Adalah WAKTU" by Sapardi Djoko Damono | Static |
| 4 | **Quran Verse** | QS. Ar-Rum 21 with Arabic-style ornament | Static |
| 5 | **Akad Nikah** | Date "13 November 2022", time, location, countdown timer | Static |
| 6 | **Resepsi** | Same layout as Akad but different content | Static |
| 7 | **Location** | Google Maps embed, venue name, address, "Petunjuk Ke Lokasi" button | Static |
| 8 | **Doa / RSVP** | Prayer for couple, RSVP button, deadline | Static |
| 9 | **Gift** | Bank account info, "Kirim Kado" address, gift buttons | Static |
| 10 | **Protokol Kesehatan** | 4 health protocol icons (mask, temp, wash, distance) in 2x2 grid | Static |
| 11 | **Closing** | Thank you message, couple names "Vivy & Fauzan" | Static |

## Layout Structure
```
#workspace-container (fixed, 100vw x 100vh, overflow:hidden)
  #panZoom (fixed, full area)
    .canvas (flex center)
      #satuMomen (invitation content)
        .satumomen_track
          ul.satumomen_list
            li.satumomen_slide × 12
              .container-mobile (100vw x 100vh, bg image)
                .frame (decorative frame overlay - 3 images)
                .content (flex center, full height)
      #smMenu.satumomen_menu (fixed bottom nav)
        ul.satumomen_menu_list
          li.satumomen_menu_item × 12 (nav items)
      .floating-action (fixed right side buttons)
        - WhatsApp order button
        - QR modal button
        - Music play/pause button
        - Autoplay toggle button
```

## Common Elements (repeated on every slide)
- Background: `url(/themes/javanese/bg.webp)` — warm beige/cream texture
- Frame overlay: 3 images (frame-tl.webp, frame-tr.webp, frame-bm.webp) with fade-in animations
- Font classes: `.font-base` (Marcellus), `.font-accent` (DM Serif Display), `.font-latin` (Great Vibes)
- Color classes: `.color-accent` (#AE7400), default text (#483E26)
- Editable content: `.editable` class on all text elements

## Z-Index Layers
1. Background image (base)
2. Frame overlay images (above bg)
3. Content text/images (above frame)
4. Floating action buttons (above everything)
5. Bottom menu (above everything)
6. Modals (RSVP, QR, etc.) — above menu

## Responsive
- Mobile-first: `.container-mobile` class, max 100vw width
- Desktop: centered canvas with max-width constraint
- Actually a mobile-only design — no responsive breakpoints for desktop (>mobile)
