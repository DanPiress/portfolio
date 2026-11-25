"""Functional checks for the portfolio. Usage (webapp-testing Python):  python scripts/qa_portfolio.py [base_url]

Covers the spotlight (mouse, keyboard, touch tap and swipe, reduced motion), links, the case study (direct load,
reload, deep link, Back), focus visibility, a failed image, the page without JavaScript, page errors and transfer size.
"""
import re, sys, urllib.request
from playwright.sync_api import sync_playwright

BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4180").rstrip("/")
results = []


def check(name, ok, detail=""):
    results.append(ok)
    print(("PASS " if ok else "FAIL ") + name + (f"  [{detail}]" if detail else ""))


def watch(page):
    errs = []
    page.on("pageerror", lambda e: errs.append(str(e)))
    page.on("console", lambda m: m.type in ("error", "warning") and errs.append(m.text))
    return errs


def selected(page):
    return page.evaluate("[...document.querySelectorAll('[role=tab]')].findIndex(t => t.getAttribute('aria-selected') === 'true')")


def caption(page):
    return page.locator(".spot-caption-text").inner_text()


def visible_view(page):
    return page.evaluate("""[...document.querySelectorAll('.spot-view')].map(v => getComputedStyle(v).opacity === '1' && getComputedStyle(v).visibility === 'visible')""")


with sync_playwright() as p:
    b = p.chromium.launch(headless=True)

    # ---------- Desktop: mouse and keyboard ----------
    ctx = b.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()
    errs = watch(page)
    cdp = ctx.new_cdp_session(page)
    cdp.send("Network.enable")
    sizes = {}
    cdp.on("Network.loadingFinished", lambda e: sizes.__setitem__(e["requestId"], e["encodedDataLength"]))
    page.goto(BASE + "/", wait_until="load")
    at_load = sum(sizes.values())
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1200)
    after_idle = sum(sizes.values())
    check("Initial transfer up to the load event is under 1 MB", at_load < 1_000_000, f"{at_load/1024:.0f} KB")
    print(f"     transfer after the other spotlight views warm up: {after_idle/1024:.0f} KB")

    check("Home title and h1", page.title().startswith("Daniel Pires") and "Websites" in page.locator("h1").inner_text())
    check("ARC spotlight image visible on the first screen",
          page.locator(".spot-view[data-pos=on] img").first.bounding_box()["y"] < 900)
    check("Spotlight starts on Experience", selected(page) == 0)
    first_caption = caption(page)
    page.get_by_role("tab", name="Design").click()
    page.wait_for_timeout(700)
    check("Click Design selects it and changes the caption", selected(page) == 1 and caption(page) != first_caption)
    check("Only the selected view is visible", visible_view(page) == [False, True, False], str(visible_view(page)))
    check("Tab panel is labelled by the selected tab",
          page.evaluate("document.getElementById(document.querySelector('[role=tabpanel]').getAttribute('aria-labelledby')).textContent") == "Design")
    page.get_by_role("tab", name="Build story").click()
    page.wait_for_timeout(700)
    check("Build story shows a before and an after image",
          page.locator(".spot-view[data-pos=on] .pair img").count() == 2)

    page.get_by_role("tab", name="Build story").focus()
    page.keyboard.press("ArrowRight")
    check("ArrowRight wraps from the last view to the first and moves focus",
          selected(page) == 0 and page.evaluate("document.activeElement.textContent") == "Experience")
    page.keyboard.press("End")
    check("End selects the last view", selected(page) == 2)
    page.keyboard.press("Home")
    check("Home selects the first view", selected(page) == 0)
    page.keyboard.press("ArrowLeft")
    check("ArrowLeft wraps to the last view", selected(page) == 2)
    page.keyboard.press("ArrowLeft")
    check("ArrowLeft moves back one view", selected(page) == 1)
    tabindexes = page.evaluate("[...document.querySelectorAll('[role=tab]')].map(t => t.tabIndex)")
    check("Only the selected tab is in the Tab order", tabindexes == [-1, 0, -1], str(tabindexes))

    # Focus visibility: Tab from the top of the page and inspect the outlines.
    page.goto(BASE + "/", wait_until="networkidle")
    outlines = []
    for _ in range(9):
        page.keyboard.press("Tab")
        outlines.append(page.evaluate("""(() => { const e = document.activeElement; const s = getComputedStyle(e);
          return [e.textContent.trim().slice(0, 18), s.outlineStyle, s.outlineWidth]; })()"""))
    check("Keyboard focus is visible on the first nine stops", all(o[1] != "none" and o[2] != "0px" for o in outlines),
          "; ".join(o[0] for o in outlines))
    check("First Tab reaches the skip link", outlines[0][0] == "Skip to content")

    # Pointer tilt never moves the card for keyboard-only use and resets on leave.
    card = page.locator(".spot-card")
    box = card.bounding_box()
    page.mouse.move(box["x"] + box["width"] * 0.9, box["y"] + 40)
    page.wait_for_timeout(100)
    tilted = page.evaluate("getComputedStyle(document.querySelector('.spot-card')).getPropertyValue('--ry')")
    page.mouse.move(10, 500)
    page.wait_for_timeout(100)
    reset = page.evaluate("getComputedStyle(document.querySelector('.spot-card')).getPropertyValue('--ry')")
    check("Pointer tilt applies on hover and resets on leave", tilted not in ("", "0deg") and reset.strip() == "0deg", f"{tilted} -> {reset}")

    # Anchors and internal links.
    for href in ["#work", "#about", "#contact"]:
        page.locator(f".nav a[href='{href}']").click()
        page.wait_for_timeout(900)
        top = page.evaluate(f"document.querySelector('{href}').getBoundingClientRect().top")
        at_end = page.evaluate("Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight - 2")
        check(f"Nav {href} scrolls its section below the sticky header (or to the page end)",
              40 < top < 140 or (at_end and 40 < top < 900), f"top={top:.0f} end={at_end}")
    check("No page errors or warnings on the homepage", not errs, str(errs))

    # Case study: open from the homepage, Back, direct load, reload, deep link.
    page.goto(BASE + "/", wait_until="networkidle")
    page.evaluate("window.scrollTo(0, 1200)")
    page.wait_for_timeout(300)
    page.locator(".entry a", has_text="case study").click()
    page.wait_for_load_state("networkidle")
    check("Case study link opens /work/arc/", page.url.endswith("/work/arc/") and page.locator("h1").inner_text() == "ARC")
    page.go_back()
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(300)
    y = page.evaluate("scrollY")
    check("Back returns to the homepage at the same position", page.url.rstrip("/") == BASE and abs(y - 1200) < 120, f"y={y}")

    page2 = ctx.new_page()
    errs2 = watch(page2)
    r = page2.goto(BASE + "/work/arc/", wait_until="networkidle")
    check("Direct load of /work/arc/ returns 200 with its own title", r.status == 200 and page2.title().startswith("ARC case study"))
    page2.reload(wait_until="networkidle")
    check("Reload keeps the case study", page2.locator("h1").inner_text() == "ARC")
    page2.goto(BASE + "/work/arc/#decisions", wait_until="networkidle")
    page2.wait_for_timeout(600)
    top = page2.evaluate("document.querySelector('#decisions').getBoundingClientRect().top")
    check("Deep link /work/arc/#decisions lands on that section", -5 < top < 140, f"top={top:.0f}")
    page2.locator(".deep summary").first.click()
    check("How it works details open", page2.locator(".deep").first.evaluate("d => d.open"))
    page2.locator(".site-header a.wordmark").click()
    page2.wait_for_load_state("networkidle")
    check("Wordmark returns home", page2.url.rstrip("/") == BASE)
    page2.goto(BASE + "/work/arc/", wait_until="networkidle")
    page2.locator(".nav a", has_text="About").click()
    page2.wait_for_load_state("networkidle")
    page2.wait_for_timeout(800)
    check("About in the case-study header goes to the homepage section", page2.url.endswith("/#about"))
    check("No page errors or warnings on the case study", not errs2, str(errs2))

    # Every link on both pages: internal targets exist, external ones answer.
    hrefs = set()
    for path in ["/", "/work/arc/"]:
        page.goto(BASE + path, wait_until="networkidle")
        for h in page.evaluate("[...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'))"):
            hrefs.add((path + h) if h.startswith("#") else h)
    for h in sorted(hrefs):
        if "#" in h and not h.startswith("http"):
            path, target = h.split("#", 1)
            page.goto(BASE + (path or "/"), wait_until="domcontentloaded")
            check(f"Anchor target exists: {h}", page.locator(f"#{target}").count() == 1)
            continue
        if h.startswith("mailto:"):
            check(f"Email link has a valid address: {h}", re.fullmatch(r"mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}", h) is not None)
            continue
        if h.startswith("http"):
            try:
                req = urllib.request.Request(h, headers={"User-Agent": "Mozilla/5.0 link-check"}, method="GET")
                code = urllib.request.urlopen(req, timeout=20).status
            except Exception as e:  # noqa: BLE001
                code = getattr(e, "code", str(e))
            if "linkedin.com/" in h and code == 999:
                # LinkedIn answers automated requests with 999; the profile is opened in a real browser instead.
                print(f"NOTE  LinkedIn refused the automated request (999), check by hand: {h}")
                continue
            check(f"External link answers: {h}", code == 200, str(code))
        elif h.startswith("#") or h.startswith("/#"):
            target = h.split("#")[1]
            page.goto(BASE + ("/" if h.startswith("/#") else "/"), wait_until="domcontentloaded")
            check(f"Anchor target exists: {h}", page.locator(f"#{target}").count() == 1)
        else:
            code = ctx.request.get(BASE + h).status
            check(f"Internal link answers: {h}", code == 200, str(code))

    # A failed project image shows a labelled fallback without breaking the layout.
    page3 = ctx.new_page()
    page3.route("**/media/arc/experience-*.webp", lambda route: route.abort())
    page3.goto(BASE + "/", wait_until="networkidle")
    page3.wait_for_timeout(300)
    fb = page3.locator(".spot-view[data-pos=on] .img-fallback")
    stage_h = page3.locator(".spot-stage").bounding_box()["height"]
    check("Blocked spotlight image shows the fallback and keeps the stage size",
          fb.count() >= 1 and fb.first.get_attribute("aria-label") is not None and stage_h > 300, f"stage {stage_h:.0f}px")
    ctx.close()

    # ---------- Phone: touch tap and swipe ----------
    ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
    page = ctx.new_page()
    errs = watch(page)
    page.goto(BASE + "/", wait_until="networkidle")
    img_top = page.locator(".spot-stage").bounding_box()["y"]
    check("Phone: ARC image begins within the first screen", img_top < 844 - 120, f"stage top {img_top:.0f}px")
    page.get_by_role("tab", name="Design").tap()
    page.wait_for_timeout(600)
    check("Phone: tapping a tab selects it", selected(page) == 1)
    stage = page.locator(".spot-stage")
    stage.scroll_into_view_if_needed()
    bb = stage.bounding_box()
    cdp = ctx.new_cdp_session(page)

    def swipe(x0, x1, y):
        cdp.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": x0, "y": y}]})
        for i in range(1, 9):
            cdp.send("Input.dispatchTouchEvent", {"type": "touchMove", "touchPoints": [{"x": x0 + (x1 - x0) * i / 8, "y": y}]})
        cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
        page.wait_for_timeout(600)

    y = bb["y"] + bb["height"] / 2
    swipe(bb["x"] + bb["width"] * 0.8, bb["x"] + bb["width"] * 0.2, y)
    check("Phone: swiping left shows the next view", selected(page) == 2)
    swipe(bb["x"] + bb["width"] * 0.2, bb["x"] + bb["width"] * 0.8, y)
    check("Phone: swiping right shows the previous view", selected(page) == 1)
    tabs_h = page.evaluate("[...document.querySelectorAll('[role=tab]')].map(t => t.getBoundingClientRect().height)")
    check("Phone: tab targets are at least 44 px tall", min(tabs_h) >= 44, str(tabs_h))
    small = page.evaluate("""[...document.querySelectorAll('a, button, summary')].filter(e => { const r = e.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.height < 44 && !e.closest('.chip'); }).map(e => e.textContent.trim().slice(0, 24))""")
    check("Phone: every link and button is at least 44 px tall", not small, str(small))
    check("Phone: no page errors", not errs, str(errs))
    ctx.close()

    # ---------- Reduced motion ----------
    ctx = b.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
    page = ctx.new_page()
    page.goto(BASE + "/", wait_until="networkidle")
    page.get_by_role("tab", name="Design").click()
    vis = visible_view(page)  # read straight away, no waiting
    dur = page.evaluate("getComputedStyle(document.querySelector('.spot-view')).transitionDuration")
    check("Reduced motion: the view changes immediately", vis == [False, True, False] and set(dur.replace('s', '').split(', ')) <= {"0"}, f"{vis} {dur}")
    box = page.locator(".spot-card").bounding_box()
    page.mouse.move(box["x"] + box["width"] * 0.9, box["y"] + 40)
    page.wait_for_timeout(100)
    tf = page.evaluate("getComputedStyle(document.querySelector('.spot-card')).transform")
    check("Reduced motion: no pointer tilt", tf == "none", tf)
    ctx.close()

    # ---------- Without JavaScript ----------
    ctx = b.new_context(viewport={"width": 1440, "height": 900}, java_script_enabled=False)
    page = ctx.new_page()
    page.goto(BASE + "/work/arc/", wait_until="load")
    check("Without JavaScript the case study is readable (prerendered)",
          page.locator("h1").inner_text() == "ARC" and page.locator(".decision").count() == 3)
    page.goto(BASE + "/", wait_until="load")
    check("Without JavaScript the homepage shows the spotlight image and links",
          page.locator(".spot-view[data-pos=on] img").count() >= 1 and page.locator(".spot-links a").count() == 3)
    ctx.close()
    b.close()

print(f"\n{sum(results)}/{len(results)} checks passed")
sys.exit(0 if all(results) else 1)
