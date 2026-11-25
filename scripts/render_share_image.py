"""Renders scripts/share-image.html to public/og/share.png (1200x630); scripts/prerender.mjs does not need it, but
the og:image tag points to /og/share.jpg, so convert afterwards:  node scripts/share-to-jpg.mjs"""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
out = ROOT / "public" / "og"
out.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={"width": 1200, "height": 630})
    page.goto((ROOT / "scripts" / "share-image.html").as_uri(), wait_until="networkidle")
    page.evaluate("document.fonts.ready")
    page.wait_for_timeout(300)
    page.screenshot(path=str(out / "share.png"))
    b.close()
print(out / "share.png")
