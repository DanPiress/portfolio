// Converts public/og/share.png (from render_share_image.py) to public/og/share.jpg and removes the PNG.
import sharp from "sharp";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public/og");
const info = await sharp(path.join(OG, "share.png")).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(OG, "share.jpg"));
await unlink(path.join(OG, "share.png"));
console.log(`share.jpg ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
