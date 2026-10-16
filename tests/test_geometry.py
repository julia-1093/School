"""Functional checks for the line/plane lesson and its shared quiz controller."""

import functools
import http.server
from pathlib import Path
import tempfile
import threading
import unittest

from playwright.sync_api import expect, sync_playwright


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


class GeometryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory(prefix="school-geometry-tests-")
        root = Path(cls.temp.name)
        (root / "School").symlink_to(Path(__file__).resolve().parents[1], target_is_directory=True)
        cls.server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(QuietHandler, directory=str(root)))
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.base = f"http://127.0.0.1:{cls.server.server_port}/School/"
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(executable_path="/usr/bin/chromium", headless=True, args=["--no-sandbox"])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()
        cls.temp.cleanup()

    def setUp(self):
        self.context = self.browser.new_context(viewport={"width": 1440, "height": 1000}, locale="ru-RU", reduced_motion="reduce")
        self.page = self.context.new_page()
        self.page.set_default_timeout(5000)
        self.errors = []
        self.page.on("pageerror", lambda error: self.errors.append(str(error)))
        self.page.on("requestfailed", lambda req: self.errors.append(f"Resource failed: {req.url}"))
        self.page.on("response", lambda res: self.errors.append(f"HTTP {res.status}: {res.url}") if res.status >= 400 else None)
        self.page.goto(self.base + "geometry-10-line-plane/", wait_until="networkidle")

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def test_catalogue_both_lessons_and_assets(self):
        self.page.goto(self.base)
        expect(self.page.locator(".lesson-card")).to_have_count(3)
        self.page.locator('.lesson-card[href="./geometry-10-line-plane/"]').click()
        expect(self.page).to_have_title("Параллельность прямой и плоскости — геометрия, 10 класс · По полочкам")
        expect(self.page.locator("#lesson-title")).to_contain_text("плоскость")
        self.page.screenshot(path="/tmp/geometry-desktop.png")

    def test_three_cases_and_proof_plane(self):
        for case, notation, count in [("inside", "a ⊂ α", "Бесконечно много"), ("crossing", "a ∩ α = {M}", "1 общая"), ("parallel", "a ∥ α", "0 общих")]:
            self.page.locator(f'[data-case="{case}"]').click()
            expect(self.page.locator("#case-result h4")).to_have_text(notation)
            expect(self.page.locator("#case-count")).to_contain_text(count)
            expect(self.page.locator('[data-case][aria-pressed="true"]')).to_have_count(1)
        expect(self.page.locator("#criterion-drawing text").filter(has_text="β")).to_have_count(0)
        self.page.locator("#show-proof-plane").check()
        expect(self.page.locator("#criterion-drawing text").filter(has_text="β")).to_have_count(1)
        self.page.locator("details summary").click()
        expect(self.page.locator("details .explanation-steps")).to_be_visible()
        expect(self.page.locator("#property-drawing text").filter(has_text="β")).to_have_count(1)

    def test_section_construction_all_steps(self):
        expect(self.page.locator("#cut-prev")).to_be_disabled()
        expect(self.page.locator("#cut-drawing text").filter(has_text="N")).to_have_count(0)
        for step in range(1, 4):
            self.page.locator("#cut-next").click()
            expect(self.page.locator("#cut-counter")).to_have_text(f"Шаг {step+1} / 4")
            expect(self.page.locator(f'[data-cut="{step}"]')).to_have_attribute("aria-current", "step")
        expect(self.page.locator("#cut-next")).to_be_disabled()
        expect(self.page.locator("#cut-step-copy")).to_contain_text("ABNM")
        expect(self.page.locator("#cut-drawing text").filter(has_text="N")).to_have_count(1)
        expect(self.page.locator('#cut-drawing path[fill="#67997c"]')).to_have_count(1)
        self.page.locator(".cut-layout").screenshot(path="/tmp/geometry-section.png")
        self.page.locator('[data-cut="0"]').click()
        expect(self.page.locator("#cut-drawing text").filter(has_text="N")).to_have_count(0)

    def test_all_twelve_practice_answers(self):
        self.page.locator('[data-tab="practice"]').click()
        for i, answer in enumerate([2, 0, 1, 2, 0, 1, 2, 1, 0, 2, 1, 0]):
            self.page.locator(f'[data-question="{i}"]').click()
            self.page.locator(f'[data-answer="{answer}"]').click()
            expect(self.page.locator("#feedback-title")).to_have_text("Верно. Вот почему.")
            self.assertTrue(self.page.locator("#practice-feedback p").inner_text().strip())
            if i >= 8:
                expect(self.page.locator("#practice-card .question-figure")).to_be_visible()
        expect(self.page.locator("#first-try-count")).to_have_text("12")
        expect(self.page.locator("#overall-label")).to_have_text("Разобрано 12 из 12")
        expect(self.page.locator("#practice-complete")).to_be_visible()

    def test_retry_help_and_reload(self):
        self.page.locator('[data-tab="practice"]').click()
        self.page.locator('[data-answer="0"]').click()
        expect(self.page.locator("#feedback-title")).to_contain_text("Пока не совпало")
        self.page.locator('[data-action="retry"]').click()
        self.page.locator('[data-answer="2"]').click()
        expect(self.page.locator("#first-try-count")).to_have_text("0")
        self.page.reload()
        expect(self.page.locator("#overall-label")).to_have_text("Разобрано 1 из 12")
        expect(self.page.locator("#feedback-title")).to_have_text("Верно. Вот почему.")
        self.page.locator('[data-action="next"]').click()
        self.page.locator('[data-action="help"]').click()
        expect(self.page.locator("#feedback-title")).to_have_text("Разберём вместе.")
        self.page.locator('[data-action="retry"]').click()
        self.page.locator('[data-answer="0"]').click()
        expect(self.page.locator("#first-try-count")).to_have_text("0")

    def test_exam_incomplete_wrong_correct_and_saved(self):
        ids=["common", "criterion", "all-lines", "cube-edge", "intersection", "midpoint"]
        self.page.locator('[data-tab="check"]').click()
        self.page.locator("#exam-submit").click()
        expect(self.page.locator("#exam-error")).to_be_visible()
        expect(self.page.locator("#exam-result")).to_be_hidden()
        for qid, answer in zip(ids, [0, 0, 1, 0, 0, 1]):
            self.page.locator(f"#exam-{qid}-{answer}").check()
        self.page.locator("#exam-submit").click()
        expect(self.page.locator(".exam-score")).to_have_text("0 / из 6")
        expect(self.page.locator(".exam-option.wrong")).to_have_count(6)
        expect(self.page.locator(".exam-explanation")).to_have_count(6)
        self.page.locator("#exam-restart").click()
        for qid, answer in zip(ids, [1, 2, 0, 1, 2, 0]):
            self.page.locator(f"#exam-{qid}-{answer}").check()
        self.page.locator("#exam-submit").click()
        expect(self.page.locator(".exam-score")).to_have_text("6 / из 6")
        expect(self.page.locator("#exam-result")).to_contain_text("свойство, которое помогает строить сечения")
        self.page.reload()
        expect(self.page.locator(".exam-score")).to_have_text("6 / из 6")

    def test_storage_isolation_and_reset(self):
        self.page.goto(self.base+"chemistry-10-alkanes/#practice")
        self.page.locator('[data-answer="1"]').click()
        self.page.goto(self.base+"geometry-10-line-plane/#practice")
        expect(self.page.locator("#overall-label")).to_have_text("Разобрано 0 из 12")
        self.page.locator('[data-answer="2"]').click()
        self.page.once("dialog", lambda dialog: dialog.accept())
        self.page.locator("#reset-progress").click()
        expect(self.page.locator("#overall-label")).to_have_text("Разобрано 0 из 12")
        self.page.goto(self.base+"chemistry-10-alkanes/#practice")
        expect(self.page.locator("#overall-label")).to_have_text("Разобрано 1 из 12")
        self.page.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new Error('Blocked')}})")
        self.page.goto(self.base+"geometry-10-line-plane/#practice")
        expect(self.page.locator("#storage-notice")).to_be_visible()
        self.page.locator('[data-answer="2"]').click()
        expect(self.page.locator("#feedback-title")).to_have_text("Верно. Вот почему.")

    def test_keyboard_tabs_and_geometry_print_summary(self):
        self.page.locator("#tab-learn").focus()
        self.page.keyboard.press("ArrowRight")
        expect(self.page.locator("#panel-practice")).to_be_visible()
        self.page.keyboard.press("End")
        expect(self.page.locator("#panel-check")).to_be_visible()
        self.page.keyboard.press("Home")
        expect(self.page.locator("#panel-learn")).to_be_visible()
        self.page.emulate_media(media="print")
        expect(self.page.locator(".pocket-card")).to_be_visible()
        expect(self.page.locator(".pocket-card")).to_contain_text("a ⊄ α")
        self.assertEqual(self.page.locator(".pocket-card").evaluate("e=>getComputedStyle(e,'::after').content"), "none")

    def test_mobile_touch_and_long_questions(self):
        for width in [320, 390, 768]:
            context=self.browser.new_context(viewport={"width":width,"height":844},is_mobile=True,has_touch=True,reduced_motion="reduce")
            try:
                page=context.new_page()
                page.set_default_timeout(5000)
                page.on("pageerror", lambda error: self.errors.append(str(error)))
                page.goto(self.base+"geometry-10-line-plane/",wait_until="networkidle")
                for case in ["inside", "crossing", "parallel"]:
                    page.locator(f'[data-case="{case}"]').tap()
                    self.assertLessEqual(page.evaluate("document.documentElement.scrollWidth"),width,f"Overflow in {case} at {width}px")
                for tab in ["learn", "practice", "check"]:
                    page.locator(f'[data-tab="{tab}"]').tap()
                    self.assertLessEqual(page.evaluate("document.documentElement.scrollWidth"),width,f"Overflow at {width}px in {tab}")
                page.locator('[data-tab="practice"]').tap()
                for question in [3, 7, 8, 11]:
                    page.locator(f'[data-question="{question}"]').tap()
                    self.assertLessEqual(page.evaluate("document.documentElement.scrollWidth"),width)
                page.locator('[data-answer="0"]').tap()
                expect(page.locator("#feedback-title")).to_have_text("Верно. Вот почему.")
                if width==390:
                    page.screenshot(path="/tmp/geometry-mobile-practice.png")
                    page.locator('[data-tab="learn"]').tap()
                    page.evaluate("scrollTo(0,0)")
                    page.screenshot(path="/tmp/geometry-mobile.png")
            finally:
                context.close()


if __name__ == "__main__":
    unittest.main()
