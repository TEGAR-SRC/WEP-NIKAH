import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';

const URL = 'https://satumomen.com/preview/javanese';
const PUBLIC = join(import.meta.dirname, '..', 'public');

async function main() {
  console.log('Starting browser-based asset download...');
  
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await ctx.newPage();

  // Collect all image responses
  const assets = new Map();

  page.on('response', async (response) => {
    const url = response.url();
    const contentType = response.headers()['content-type'] || '';
    if (contentType.startsWith('image/') || url.match(/\.(webp|png|jpg|jpeg|gif|svg|mp3)$/i)) {
      try {
        const buffer = await response.body();
        assets.set(url, buffer);
        console.log(`Captured: ${url.split('/').pop()} (${buffer.length} bytes)`);
      } catch (e) {
        // ignore
      }
    }
  });

  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);

  // Now also extract images from the page by getting their currentSrc
  const imgData = await page.evaluate(() => {
    return [...document.querySelectorAll('img')].map(img => ({
      src: img.getAttribute('src'),
      currentSrc: img.currentSrc,
      alt: img.alt,
    }));
  });

  // Try to download any missing images directly via fetch
  for (const item of imgData) {
    const src = item.currentSrc || item.src;
    if (!src || assets.has(src)) continue;
    
    try {
      const result = await page.evaluate(async (url) => {
        const resp = await fetch(url);
        const blob = await resp.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      }, src);
      
      if (result) {
        const base64 = result.split(',')[1];
        const buffer = Buffer.from(base64, 'base64');
        assets.set(src, buffer);
        console.log(`Fetched via page: ${src.split('/').pop()} (${buffer.length} bytes)`);
      }
    } catch (e) {
      console.log(`Failed to fetch: ${src.split('/').pop()}`);
    }
  }

  console.log(`\nTotal assets captured: ${assets.size}`);

  // Save all assets
  let saved = 0;
  for (const [url, buffer] of assets) {
    if (buffer.length < 1000 && !url.includes('btn_')) {
      console.log(`Skipping too small: ${url.split('/').pop()} (${buffer.length} bytes)`);
      continue;
    }
    
    const absoluteUrl = url.startsWith('http') ? url : `https://satumomen.com${url}`;
    let pathname;
    try { pathname = new URL(absoluteUrl).pathname; } catch { pathname = '/' + absoluteUrl.split('/').slice(3).join('/'); }
    const filename = pathname.split('/').pop()?.split('?')[0] || 'unknown';
    
    // Determine folder
    let folder = 'images';
    if (pathname.includes('/themes/javanese/') || pathname.includes('/themes/aceh-jawa/')) folder = 'images/satumomen';
    else if (pathname.includes('/musics/')) folder = 'audio';
    else if (pathname.includes('/images/galleries/')) folder = 'images/satumomen';
    else if (pathname.includes('/fonts/')) folder = 'fonts';
    else if (pathname.includes('/images/')) folder = 'images';

    const dest = join(PUBLIC, folder, filename);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, buffer);
    console.log(`Saved: ${filename} -> ${folder}/`);
    saved++;
  }

  console.log(`\nSaved ${saved} assets`);
  await browser.close();
}

main().catch(console.error);
