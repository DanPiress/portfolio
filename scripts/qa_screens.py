"""Screenshots of the portfolio at desktop, tablet and phone sizes, plus overflow and page-error checks.

Usage (webapp-testing Python):  python scripts/qa_screens.py [base_url] [tag]
Saves to qa/screenshots/<tag>/: <size>-<page>-first.png (first screen) and <size>-<page>-full.png (whole page),
<size>-playtest-entry.png for the new project card, and desktop-spot-<view>.png for each unchanged ARC spotlight view.
"""
import pathlib, sys
from playwright.sync_api import sync_playwright

BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4180").rstrip("/")
TAG = sys.argv[2] if len(sys.argv) > 2 else "latest"
OUT = pathlib.Path(__file__).resolve().parents[1] / "qa" / "screenshots" / TAG
OUT.mkdir(parents=True, exist_ok=True)

SIZES = {
    "desktop": dict(viewport={"width": 1440, "height": 900}),
    "laptop": dict(viewport={"width": 1280, "height": 720}),
    "tablet": dict(viewport={"width": 768, "height": 1024}, device_scale_factor=2, has_touch=True),
    "phone": dict(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True),
    "phone-small": dict(viewport={"width": 360, "height": 740}, device_scale_factor=2, is_mobile=True, has_touch=True),
}
PAGES = {"home": "/", "arc": "/work/arc/", "playtest-desk": "/work/playtest-desk/"}

problems = []
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    for size, opts in SIZES.items():
        ctx = b.new_context(**opts)
        for name, path in PAGES.items():
            page = ctx.new_page()
            errors = []
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.on("console", lambda m: m.type == "error" and errors.append(m.text))
            page.goto(BASE + path, wait_until="networkidle")
            page.evaluate("document.fonts.ready")
            page.wait_for_timeout(400)
            page.screenshot(path=str(OUT / f"{size}-{name}-first.png"))
            # Scroll through so lazy images load, then capture the whole page.
            h = page.evaluate("document.documentElement.scrollHeight")
            for y in range(0, h, 600):
                page.evaluate(f"window.scrollTo(0, {y})")
                page.wait_for_timeout(60)
            page.wait_for_load_state("networkidle")
            page.evaluate("window.scrollTo(0, 0)")
            page.wait_for_timeout(200)
            page.screenshot(path=str(OUT / f"{size}-{name}-full.png"), full_page=True)
            overflow = page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
            broken = page.evaluate("[...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src)")
            print(f"{size:12} {name:13} overflow={overflow}px errors={errors} broken={broken}")
            if overflow or errors or broken:
                problems.append((size, name, overflow, errors, broken))
            if name == "home":
                page.locator("article[aria-labelledby='entry-playtest-desk']").screenshot(
                    path=str(OUT / f"{size}-playtest-entry.png")
                )
            if size == "desktop" and name == "home":
                for i, label in enumerate(["experience", "design", "build"]):
                    page.locator('[role="tab"]').nth(i).click()
                    page.wait_for_timeout(700)
                    page.locator(".spot").screenshot(path=str(OUT / f"desktop-spot-{label}.png"))
            page.close()
        ctx.close()
    b.close()
print("PROBLEMS:" if problems else "No overflow, page errors or broken images.", problems or "")
