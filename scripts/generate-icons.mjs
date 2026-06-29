import { createWriteStream } from 'fs';
import { deflateSync } from 'zlib';
import { mkdir } from 'fs/promises';

// Draws the Task Poker icon: two overlapping cards + diamond
function drawIcon(size) {
  const pixels = new Uint8Array(size * size * 4); // RGBA

  // Background: transparent
  // Scale factors relative to the 30×30 viewBox
  const scale = size / 30;

  function fillRect(x, y, w, h, r, g, b, a) {
    const x1 = Math.round(x * scale);
    const y1 = Math.round(y * scale);
    const x2 = Math.round((x + w) * scale);
    const y2 = Math.round((y + h) * scale);
    for (let py = y1; py < y2; py++) {
      for (let px = x1; px < x2; px++) {
        if (px >= 0 && px < size && py >= 0 && py < size) {
          const i = (py * size + px) * 4;
          // Alpha blend over existing pixel
          const srcA = a / 255;
          const dstA = pixels[i + 3] / 255;
          const outA = srcA + dstA * (1 - srcA);
          if (outA > 0) {
            pixels[i]     = Math.round((r * srcA + pixels[i]     * dstA * (1 - srcA)) / outA);
            pixels[i + 1] = Math.round((g * srcA + pixels[i + 1] * dstA * (1 - srcA)) / outA);
            pixels[i + 2] = Math.round((b * srcA + pixels[i + 2] * dstA * (1 - srcA)) / outA);
            pixels[i + 3] = Math.round(outA * 255);
          }
        }
      }
    }
  }

  function fillPolygon(points, r, g, b, a) {
    // Scale points
    const scaled = points.map(([px, py]) => [px * scale, py * scale]);
    const minY = Math.max(0, Math.floor(Math.min(...scaled.map(p => p[1]))));
    const maxY = Math.min(size - 1, Math.ceil(Math.max(...scaled.map(p => p[1]))));
    const srcA = a / 255;

    for (let py = minY; py <= maxY; py++) {
      const intersections = [];
      for (let i = 0; i < scaled.length; i++) {
        const [x1, y1] = scaled[i];
        const [x2, y2] = scaled[(i + 1) % scaled.length];
        if ((y1 <= py && y2 > py) || (y2 <= py && y1 > py)) {
          intersections.push(x1 + (py - y1) * (x2 - x1) / (y2 - y1));
        }
      }
      intersections.sort((a, b) => a - b);
      for (let k = 0; k < intersections.length - 1; k += 2) {
        const x1 = Math.max(0, Math.round(intersections[k]));
        const x2 = Math.min(size - 1, Math.round(intersections[k + 1]));
        for (let px = x1; px <= x2; px++) {
          const i = (py * size + px) * 4;
          const dstA = pixels[i + 3] / 255;
          const outA = srcA + dstA * (1 - srcA);
          if (outA > 0) {
            pixels[i]     = Math.round((r * srcA + pixels[i]     * dstA * (1 - srcA)) / outA);
            pixels[i + 1] = Math.round((g * srcA + pixels[i + 1] * dstA * (1 - srcA)) / outA);
            pixels[i + 2] = Math.round((b * srcA + pixels[i + 2] * dstA * (1 - srcA)) / outA);
            pixels[i + 3] = Math.round(outA * 255);
          }
        }
      }
    }
  }

  // Card behind: rect(7,5,16,21) — indigo 35% opacity
  fillRect(7, 5, 16, 21, 0x4f, 0x46, 0xe5, Math.round(255 * 0.35));
  // Card front: rect(4,3,16,21) — solid indigo
  fillRect(4, 3, 16, 21, 0x4f, 0x46, 0xe5, 255);
  // Diamond: M12 15 L15 10 L18 15 L15 20 Z — white 90%
  fillPolygon([[12, 15], [15, 10], [18, 15], [15, 20]], 255, 255, 255, Math.round(255 * 0.9));

  return pixels;
}

function encodePNG(size, pixels) {
  const chunks = [];

  function writeUint32BE(n) {
    const b = Buffer.allocUnsafe(4);
    b.writeUInt32BE(n, 0);
    return b;
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    for (const byte of buf) {
      crc ^= byte;
      for (let k = 0; k < 8; k++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const typeBytes = Buffer.from(type, 'ascii');
    const combined = Buffer.concat([typeBytes, data]);
    return Buffer.concat([writeUint32BE(data.length), combined, writeUint32BE(crc32(combined))]);
  }

  // PNG signature
  chunks.push(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));

  // IHDR
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  chunks.push(chunk('IHDR', ihdr));

  // IDAT: filter byte (0) + row data
  const raw = [];
  for (let y = 0; y < size; y++) {
    raw.push(0); // filter type None
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      raw.push(pixels[i], pixels[i+1], pixels[i+2], pixels[i+3]);
    }
  }
  chunks.push(chunk('IDAT', deflateSync(Buffer.from(raw))));
  chunks.push(chunk('IEND', Buffer.alloc(0)));

  return Buffer.concat(chunks);
}

async function generate(size, filename) {
  const pixels = drawIcon(size);
  const png = encodePNG(size, pixels);
  const stream = createWriteStream(filename);
  await new Promise((res, rej) => {
    stream.write(png, (err) => { if (err) rej(err); else { stream.end(); res(); } });
  });
  console.log(`Generated ${filename} (${size}×${size})`);
}

await mkdir('public', { recursive: true });
await generate(192, 'public/icon-192.png');
await generate(512, 'public/icon-512.png');
await generate(180, 'public/apple-touch-icon.png');
