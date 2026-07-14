import { chromium } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const URL = 'https://satumomen.com/preview/javanese';
const OUTPUT = join(import.meta.dirname, '..', 'docs', 'research');
const DESIGNS = join(import.meta.dirname, '..', 'docs', 'design-references');

mkdirSync(OUTPUT, { recursive: true });
mkdirSync(DESIGNS, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function extract() {
  // Desktop context
  const desktopCtx = await browser.newContext({ 
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const desktopPage = await desktopCtx.newPage();
  await desktopPage.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await desktopPage.waitForTimeout(5000);
  try { await desktopPage.screenshot({ path: join(DESIGNS, 'fullpage-desktop.png'), fullPage: true }); } catch(e) { console.log('Desktop ss error:', e.message); }

  // Mobile context (390px - mobile-first)
  const mobileCtx = await browser.newContext({ 
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
  });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await mobilePage.waitForTimeout(5000);

  // Click "Buka Undangan" to open the invitation
  const openBtn = mobilePage.locator('.btn-open-invitation');
  if (await openBtn.isVisible()) {
    await openBtn.click();
    await mobilePage.waitForTimeout(1000);
  }

  await mobilePage.screenshot({ path: join(DESIGNS, 'fullpage-mobile.png'), fullPage: true });

  // Extract global CSS variables
  const cssVars = await mobilePage.evaluate(() => {
    const style = document.querySelector('style');
    const rootMatch = style?.textContent?.match(/:root\s*\{([^}]+)\}/);
    if (!rootMatch) return {};
    const vars = {};
    rootMatch[1].split(';').forEach(line => {
      const [key, val] = line.split(':').map(s => s.trim());
      if (key && val) vars[key] = val;
    });
    return vars;
  });

  // Extract fonts
  const fonts = await mobilePage.evaluate(() => {
    const links = [...document.querySelectorAll('link[rel=stylesheet]')].map(l => l.href);
    const fontLinks = [...document.querySelectorAll('link[href*="fonts.googleapis"]')].map(l => l.href);
    const computed = [...document.querySelectorAll('*')].slice(0, 50).map(el => getComputedStyle(el).fontFamily);
    const unique = [...new Set(computed)];
    return { links, fontLinks, computedFonts: unique };
  });

  // Extract all text content per slide
  const slides = await mobilePage.evaluate(() => {
    const slides = [...document.querySelectorAll('.satumomen_slide')];
    return slides.map((slide, i) => {
      const textElements = [...slide.querySelectorAll('.editable, p, h1, h2, h3, h4, h5, h6, span, div')]
        .filter(el => el.children.length === 0 && el.textContent?.trim())
        .map(el => ({
          tag: el.tagName,
          class: el.className,
          text: el.textContent.trim(),
          fontSize: getComputedStyle(el).fontSize,
          fontFamily: getComputedStyle(el).fontFamily,
          color: getComputedStyle(el).color,
        }));
      return { index: i, textElements };
    });
  });

  // Extract all images
  const allImages = await mobilePage.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')];
    return imgs.map(img => ({
      src: img.src || img.currentSrc,
      alt: img.alt,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      className: img.className,
    }));
  });

  // Extract all SVGs as strings
  const svgs = await mobilePage.evaluate(() => {
    const svgs = [...document.querySelectorAll('svg')];
    return svgs.map((svg, i) => ({
      index: i,
      outerHTML: svg.outerHTML,
      className: svg.className,
      width: svg.getAttribute('width'),
      height: svg.getAttribute('height'),
    }));
  });

  // Extract per-slide detailed CSS
  const slidesCSS = await mobilePage.evaluate(() => {
    const slides = [...document.querySelectorAll('.satumomen_slide')];
    return slides.map((slide, i) => {
      const containers = slide.querySelectorAll('.container-mobile, .d-flex, .text-center, .frame, .editable, button, .countdown, .countdown-item, .editable');
      const styles = {};
      containers.forEach(el => {
        const key = el.className?.split(' ').slice(0, 3).join(' ') || el.tagName;
        if (!styles[key]) {
          const cs = getComputedStyle(el);
          styles[key] = {
            fontSize: cs.fontSize,
            fontFamily: cs.fontFamily,
            fontWeight: cs.fontWeight,
            color: cs.color,
            backgroundColor: cs.backgroundColor,
            padding: cs.padding,
            margin: cs.margin,
            border: cs.border,
            borderRadius: cs.borderRadius,
            boxShadow: cs.boxShadow,
            width: cs.width,
            height: cs.height,
            display: cs.display,
            flexDirection: cs.flexDirection,
            justifyContent: cs.justifyContent,
            alignItems: cs.alignItems,
            gap: cs.gap,
            textAlign: cs.textAlign,
            lineHeight: cs.lineHeight,
            letterSpacing: cs.letterSpacing,
            opacity: cs.opacity,
            transform: cs.transform,
          };
        }
      });
      return { index: i, styles };
    });
  });

  // Extract floating action buttons
  const floatingActions = await mobilePage.evaluate(() => {
    const actions = [...document.querySelectorAll('.floating-action a, .floating-action button')];
    return actions.map(a => ({
      html: a.outerHTML.slice(0, 500),
      className: a.className,
      tag: a.tagName,
    }));
  });

  // Extract bottom menu
  const menuItems = await mobilePage.evaluate(() => {
    const items = [...document.querySelectorAll('.satumomen_menu_item')];
    return items.map(item => ({
      text: item.textContent?.trim(),
      svg: item.querySelector('svg')?.outerHTML?.slice(0, 300),
      className: item.className,
    }));
  });

  // Write all extracted data to file
  const data = {
    cssVars,
    fonts,
    slides,
    allImages,
    svgs,
    slidesCSS,
    floatingActions,
    menuItems,
  };

  writeFileSync(join(OUTPUT, 'extracted-data.json'), JSON.stringify(data, null, 2));

  // Also save per-slide screenshots
  const slideCount = await mobilePage.evaluate(() => document.querySelectorAll('.satumomen_slide').length);
  
  for (let i = 0; i < slideCount; i++) {
    await mobilePage.evaluate((idx) => {
      const track = document.querySelector('.satumomen_track');
      const slides = track?.querySelectorAll('.satumomen_slide');
      if (slides?.[idx]) {
        slides[idx].scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    }, i);
    await mobilePage.waitForTimeout(500);
    await mobilePage.screenshot({ 
      path: join(DESIGNS, `slide-${i}.png`),
      fullPage: false,
    });
  }

  console.log('Extraction complete!');
  console.log(`CSS Vars:`, cssVars);
  console.log(`Found ${allImages.length} images`);
  console.log(`Found ${svgs.length} SVGs`);
  console.log(`Found ${slides.length} slides`);

  await desktopCtx.close();
  await mobileCtx.close();
  await browser.close();
}

extract().catch(console.error);
