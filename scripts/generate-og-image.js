#!/usr/bin/env node
// Generates public/og-image.png (1200x630) — uses Node.js zlib for real compression
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { deflateSync } from 'zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));

const W = 1200;
const H = 630;

// Palette (RGB arrays)
const BG     = [245, 237, 224];
const DARK   = [ 74,  55,  40];
const ACCENT = [196, 149, 106];
const CARD   = [232, 184, 109];
const WHITE  = [255, 255, 255];

// --- PNG encoder (RGBA, real zlib) ---
function crc32(buf) {
  if (!crc32.table) {
    crc32.table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crc32.table[i] = c;
    }
  }
  let c = 0xffffffff;
  for (const byte of buf) c = crc32.table[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function u32be(n) {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}

function chunk(type, data) {
  const tb = [...type].map(c => c.charCodeAt(0));
  const db = Array.isArray(data) ? data : Array.from(data);
  const crcInput = new Uint8Array([...tb, ...db]);
  return [...u32be(db.length), ...tb, ...db, ...u32be(crc32(crcInput))];
}

function encodePNG(w, h, pixels) {
  // Filter row with None (0) filter
  const raw = [];
  for (let y = 0; y < h; y++) {
    raw.push(0);
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      raw.push(pixels[i], pixels[i+1], pixels[i+2], pixels[i+3]);
    }
  }
  const compressed = deflateSync(Buffer.from(raw), { level: 6 });
  return new Uint8Array([
    137, 80, 78, 71, 13, 10, 26, 10, // PNG signature
    ...chunk('IHDR', [...u32be(w), ...u32be(h), 8, 6, 0, 0, 0]), // 8-bit RGBA
    ...chunk('IDAT', compressed),
    ...chunk('IEND', []),
  ]);
}

// --- Canvas ---
const pixels = new Uint8Array(W * H * 4);

function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + x) * 4;
  pixels[i] = r; pixels[i+1] = g; pixels[i+2] = b; pixels[i+3] = a;
}

function fillRect(x, y, w, h, [r, g, b], a = 255) {
  for (let dy = 0; dy < h; dy++)
    for (let dx = 0; dx < w; dx++)
      setPixel(Math.round(x)+dx, Math.round(y)+dy, r, g, b, a);
}

function drawRoundedRect(x, y, w, h, radius, color, alpha = 255) {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      let inside = true;
      if (dx < radius && dy < radius) {
        inside = Math.hypot(dx - radius, dy - radius) <= radius;
      } else if (dx >= w - radius && dy < radius) {
        inside = Math.hypot(dx - (w - radius - 1), dy - radius) <= radius;
      } else if (dx < radius && dy >= h - radius) {
        inside = Math.hypot(dx - radius, dy - (h - radius - 1)) <= radius;
      } else if (dx >= w - radius && dy >= h - radius) {
        inside = Math.hypot(dx - (w - radius - 1), dy - (h - radius - 1)) <= radius;
      }
      if (inside) setPixel(x + dx, y + dy, ...color, alpha);
    }
  }
}

// 5x7 bitmap font (uppercase + common chars)
const GLYPHS = {
  ' ': '0000000000000000000000000000000000000',
  'A': '0111010001100011111110001100011000 1',
  'B': '1111010001100011111010001100011111 0',
  'C': '0111110001100000000010000100010111 0',
  'D': '1111010001100011000110001100011111 0',
  'E': '1111110000100001111010000100001111 1',
  'F': '1111110000100001111010000100001000 0',
  'G': '0111110000100000101110001100010111 1',
  'H': '1000110001100011111110001100011000 1',
  'I': '1111100100001000010000100001001111 1',
  'K': '1000110010101001000010100100101000 1',
  'L': '1000010000100001000010000100001111 1',
  'M': '1000111011101011010110001100011000 1',
  'N': '1000111001101011010110011100011000 1',
  'O': '0111010001100011000110001100010111 0',
  'P': '1111010001100011111010000100001000 0',
  'R': '1111010001100011110010100100011000 1',
  'S': '0111110000100000111000001100010111 0',
  'T': '1111100100001000010000100001000100 0',
  'U': '1000110001100011000110001100010111 0',
  'V': '1000110001100010101001010001000100 0',
  'W': '1000110001101011010110111100011000 1',
  'Y': '1000101010001000010000100001000100 0',
  'Z': '1111100001000010001000100000011111 1',
  '-': '0000000000000001111000000000000000 0',
  '.': '0000000000000000000000000000000011 0',
  '!': '0010000100001000010000000000000100 0',
};

// Redefine with proper 5x7 = 35 bits per glyph
const FONT = {
  ' ': Array(35).fill(0),
  'A': [0,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 1,1,1,1,1, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1],
  'B': [1,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 1,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 1,1,1,1,0],
  'C': [0,1,1,1,0, 1,0,0,0,1, 1,0,0,0,0, 1,0,0,0,0, 1,0,0,0,0, 1,0,0,0,1, 0,1,1,1,0],
  'D': [1,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 1,1,1,1,0],
  'E': [1,1,1,1,1, 1,0,0,0,0, 1,0,0,0,0, 1,1,1,1,0, 1,0,0,0,0, 1,0,0,0,0, 1,1,1,1,1],
  'F': [1,1,1,1,1, 1,0,0,0,0, 1,0,0,0,0, 1,1,1,1,0, 1,0,0,0,0, 1,0,0,0,0, 1,0,0,0,0],
  'G': [0,1,1,1,0, 1,0,0,0,1, 1,0,0,0,0, 1,0,1,1,1, 1,0,0,0,1, 1,0,0,0,1, 0,1,1,1,0],
  'H': [1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 1,1,1,1,1, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1],
  'I': [1,1,1,1,1, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 1,1,1,1,1],
  'K': [1,0,0,0,1, 1,0,0,1,0, 1,0,1,0,0, 1,1,0,0,0, 1,0,1,0,0, 1,0,0,1,0, 1,0,0,0,1],
  'L': [1,0,0,0,0, 1,0,0,0,0, 1,0,0,0,0, 1,0,0,0,0, 1,0,0,0,0, 1,0,0,0,0, 1,1,1,1,1],
  'M': [1,0,0,0,1, 1,1,0,1,1, 1,0,1,0,1, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1],
  'N': [1,0,0,0,1, 1,1,0,0,1, 1,0,1,0,1, 1,0,0,1,1, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1],
  'O': [0,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 0,1,1,1,0],
  'P': [1,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 1,1,1,1,0, 1,0,0,0,0, 1,0,0,0,0, 1,0,0,0,0],
  'R': [1,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 1,1,1,1,0, 1,0,1,0,0, 1,0,0,1,0, 1,0,0,0,1],
  'S': [0,1,1,1,1, 1,0,0,0,0, 1,0,0,0,0, 0,1,1,1,0, 0,0,0,0,1, 0,0,0,0,1, 1,1,1,1,0],
  'T': [1,1,1,1,1, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0],
  'U': [1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 0,1,1,1,0],
  'V': [1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 0,1,0,1,0, 0,1,0,1,0, 0,0,1,0,0, 0,0,1,0,0],
  'W': [1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 1,0,1,0,1, 1,1,0,1,1, 1,1,0,1,1, 1,0,0,0,1],
  'Y': [1,0,0,0,1, 1,0,0,0,1, 0,1,0,1,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0],
  'Z': [1,1,1,1,1, 0,0,0,0,1, 0,0,0,1,0, 0,0,1,0,0, 0,1,0,0,0, 1,0,0,0,0, 1,1,1,1,1],
  '-': Array(35).fill(0).map((_, i) => i >= 15 && i < 20 ? 1 : 0),
};

function drawText(text, startX, startY, scale, color, alpha = 255) {
  let cx = startX;
  for (const ch of text.toUpperCase()) {
    const glyph = FONT[ch] || FONT[' '];
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if (glyph[row * 5 + col]) {
          fillRect(cx + col * scale, startY + row * scale, scale, scale, color, alpha);
        }
      }
    }
    cx += (5 * scale) + scale; // char width + 1px spacing
  }
}

function textWidth(text, scale) {
  return text.length * (6 * scale);
}

// ========== COMPOSE ==========

// Background gradient (top cream → slightly darker bottom)
for (let y = 0; y < H; y++) {
  const t = y / H;
  const r = Math.round(BG[0] - t * 15);
  const g = Math.round(BG[1] - t * 12);
  const b = Math.round(BG[2] - t * 10);
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    pixels[i] = r; pixels[i+1] = g; pixels[i+2] = b; pixels[i+3] = 255;
  }
}

// Right side: 4x2 decorative card grid
const GRID_X = 660;
const GRID_Y = 80;
const CW = 114;
const CH = 140;
const GAP = 18;

for (let row = 0; row < 2; row++) {
  for (let col = 0; col < 4; col++) {
    const cx = GRID_X + col * (CW + GAP);
    const cy = GRID_Y + row * (CH + GAP);
    // Shadow
    drawRoundedRect(cx + 5, cy + 5, CW, CH, 14, [160, 120, 70], 60);
    // Card back
    const faceColor = (row + col) % 2 === 0 ? CARD : ACCENT;
    drawRoundedRect(cx, cy, CW, CH, 14, faceColor);
    // Inner border
    drawRoundedRect(cx + 8, cy + 8, CW - 16, CH - 16, 8, DARK, 25);
    // Question mark (simplified: two dots)
    const qx = cx + CW/2 - 3, qy = cy + CH/2 - 10;
    fillRect(qx, qy, 8, 8, DARK, 60);
    fillRect(qx + 1, qy + 14, 6, 6, DARK, 60);
  }
}

// Left panel: title text
// "MEMORY" large
drawText('MEMORY', 60, 110, 15, DARK);
// "GAME" large in accent
drawText('GAME', 60, 225, 15, ACCENT);

// Divider line
fillRect(60, 340, 480, 4, ACCENT);

// Tagline
drawText('FREE ONLINE CARD MATCHING GAME', 60, 356, 4, DARK, 200);

// Feature pills
const pills = ['5 THEMES', '3 MODES', 'DAILY', 'PWA'];
let pillX = 60;
for (const pill of pills) {
  const pw = textWidth(pill, 3) + 22;
  drawRoundedRect(pillX, 408, pw, 34, 6, DARK);
  drawText(pill, pillX + 11, 417, 3, WHITE);
  pillX += pw + 12;
}

// Stars ⭐ (simplified as solid accent diamonds)
for (let i = 0; i < 3; i++) {
  const sx = 60 + i * 46;
  const sy = 470;
  const sz = 18;
  // Diamond shape
  for (let dy = -sz; dy <= sz; dy++) {
    const w2 = Math.round((1 - Math.abs(dy) / sz) * sz);
    fillRect(sx + sz - w2, sy + sz + dy, w2 * 2 + 1, 1, ACCENT);
  }
}

// URL
drawText('MEMORY-GAME.THECODEWALKER.DEV', 60, 550, 3, ACCENT, 180);

const png = encodePNG(W, H, pixels);
writeFileSync(join(__dirname, '../public/og-image.png'), png);
console.log(`Generated og-image.png (${(png.length / 1024).toFixed(0)} KB)`);
