"""Browser regressions for the static lesson. Uses the environment's Chromium."""

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


class LessonTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory(prefix="school-tests-")
        root = Path(cls.temp.name)
        (root / "School").symlink_to(Path(__file__).resolve().parents[1], target_is_directory=True)
        handler = functools.partial(QuietHandler, directory=str(root))
        cls.server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
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
        self.page.goto(self.base + "chemistry-10-alkanes/", wait_until="networkidle")

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def test_catalogue_and_project_paths(self):
        self.page.goto(self.base)
        self.page.locator(".lesson-card").click()
        expect(self.page).to_have_title("Алканы — химия, 10 класс · По полочкам")
        expect(self.page.locator("h1")).to_contain_text("Знакомься:")
        expect(self.page.locator("h1")).to_contain_text("алканы.")
        expect(self.page.locator("#homologue-list button")).to_have_count(10)
        origins = self.page.evaluate("performance.getEntriesByType('resource').map(r=>new URL(r.name).origin)")
        self.assertTrue(all(origin == self.base.split('/School/')[0] for origin in origins))
        self.page.screenshot(path="/tmp/alkanes-desktop.png")

    def test_formula_lab_all_ten_and_reload(self):
        names = ["Метан", "Этан", "Пропан", "Бутан", "Пентан", "Гексан", "Гептан", "Октан", "Нонан", "Декан"]
        formulas = ["CH4", "C2H6", "C3H8", "C4H10", "C5H12", "C6H14", "C7H16", "C8H18", "C9H20", "C10H22"]
        for i, (name, formula) in enumerate(zip(names, formulas), start=1):
            self.page.locator(f'[data-carbon="{i}"]').click()
            expect(self.page.locator("#alkane-name")).to_have_text(name)
            expect(self.page.locator("#alkane-formula")).to_have_text(formula)
            expect(self.page.locator("#carbon-range")).to_have_value(str(i))
            expect(self.page.locator('[data-carbon][aria-pressed="true"]')).to_have_count(1)
        self.page.locator("#carbon-range").focus()
        self.page.keyboard.press("Home")
        self.page.keyboard.press("ArrowRight")
        expect(self.page.locator("#alkane-formula")).to_have_text("C2H6")
        self.page.reload()
        expect(self.page.locator("#alkane-formula")).to_have_text("C2H6")

    def test_methane_model_rotation_and_edges(self):
        before = self.page.locator("#molecule-drawing").inner_html()
        expect(self.page.locator("#molecule-drawing line")).to_have_count(10)
        self.page.locator("#rotate-model").click()
        expect(self.page.locator("#rotation-output")).to_have_text("60°")
        self.assertNotEqual(before, self.page.locator("#molecule-drawing").inner_html())
        self.page.locator("#show-tetrahedron").uncheck()
        expect(self.page.locator("#molecule-drawing line")).to_have_count(4)
        expect(self.page.locator("#molecule-drawing text").filter(has_text="H").filter(has_not_text="109")).to_have_count(4)
        self.page.locator(".molecule-card").screenshot(path="/tmp/alkanes-model.png")

    def test_practice_retry_help_and_first_attempt(self):
        self.page.locator('[data-tab="practice"]').click()
        self.page.locator('[data-answer="0"]').click()
        expect(self.page.locator("#feedback-title")).to_contain_text("Пока не совпало")
        expect(self.page.locator("#overall-label")).to_have_text("Разобрано 1 из 12")
        self.page.locator('[data-action="retry"]').click()
        self.page.locator('[data-answer="1"]').click()
        expect(self.page.locator("#feedback-title")).to_have_text("Верно. Вот почему.")
        expect(self.page.locator("#first-try-count")).to_have_text("0")
        self.page.locator('[data-action="next"]').click()
        self.page.locator('[data-answer="1"]').click()
        expect(self.page.locator("#first-try-count")).to_have_text("1")
        self.page.reload()
        expect(self.page.locator("#overall-label")).to_have_text("Разобрано 2 из 12")
        expect(self.page.locator("#feedback-title")).to_have_text("Верно. Вот почему.")
        self.page.locator('[data-action="next"]').click()
        self.page.locator('[data-action="help"]').click()
        expect(self.page.locator("#feedback-title")).to_have_text("Разберём вместе.")
        self.page.locator('[data-action="retry"]').click()
        self.page.locator('[data-answer="2"]').click()
        expect(self.page.locator("#first-try-count")).to_have_text("1")

    def test_all_twelve_practice_questions(self):
        self.page.locator('[data-tab="practice"]').click()
        for i, answer in enumerate([1, 1, 2, 1, 1, 2, 2, 0, 2, 1, 2, 0]):
            self.page.locator(f'[data-question="{i}"]').click()
            self.page.locator(f'[data-answer="{answer}"]').click()
            expect(self.page.locator("#feedback-title")).to_have_text("Верно. Вот почему.")
        expect(self.page.locator("#first-try-count")).to_have_text("12")
        expect(self.page.locator("#overall-label")).to_have_text("Разобрано 12 из 12")
        expect(self.page.locator("#practice-complete")).to_be_visible()
        expect(self.page.locator(".question-dot.done")).to_have_count(12)

    def test_exam_missing_answers_score_persistence_and_restart(self):
        self.page.locator('[data-tab="practice"]').click()
        self.page.locator('[data-answer="1"]').click()
        self.page.locator('[data-tab="check"]').click()
        self.page.locator("#exam-submit").click()
        expect(self.page.locator("#exam-error")).to_be_visible()
        expect(self.page.locator("#exam-result")).to_be_hidden()
        expect(self.page.locator(".exam-question.unanswered")).to_have_count(6)
        for qid, answer in zip(["seven", "nine", "inverse", "pair", "geometry", "drawing"], [1, 2, 0, 1, 1, 2]):
            self.page.locator(f"#exam-{qid}-{answer}").check()
        self.page.locator("#exam-submit").click()
        expect(self.page.locator(".exam-score")).to_have_text("6 / из 6")
        expect(self.page.locator(".exam-explanation")).to_have_count(6)
        expect(self.page.locator("#exam-questions input:disabled")).to_have_count(18)
        self.page.reload()
        expect(self.page.locator("#exam-result")).to_be_visible()
        expect(self.page.locator(".exam-score")).to_have_text("6 / из 6")
        self.page.locator("#exam-restart").click()
        expect(self.page.locator("#exam-result")).to_be_hidden()
        expect(self.page.locator("#exam-filled")).to_have_text("Выбрано ответов: 0 из 6")
        expect(self.page.locator("#overall-label")).to_have_text("Разобрано 1 из 12")

    def test_wrong_exam_answers_have_explanations(self):
        self.page.locator('[data-tab="check"]').click()
        for qid, answer in zip(["seven", "nine", "inverse", "pair", "geometry", "drawing"], [0, 0, 1, 0, 0, 0]):
            self.page.locator(f"#exam-{qid}-{answer}").check()
        self.page.locator("#exam-submit").click()
        expect(self.page.locator(".exam-score")).to_have_text("0 / из 6")
        expect(self.page.locator(".exam-option.correct")).to_have_count(6)
        expect(self.page.locator(".exam-option.wrong")).to_have_count(6)
        expect(self.page.locator(".exam-explanation")).to_have_count(6)

    def test_mobile_layout_and_touch(self):
        for width in [320, 390, 768]:
            mobile = self.browser.new_context(viewport={"width": width, "height": 844}, is_mobile=True, has_touch=True, reduced_motion="reduce")
            try:
                page = mobile.new_page()
                page.set_default_timeout(5000)
                page.on("pageerror", lambda error: self.errors.append(str(error)))
                page.goto(self.base)
                self.assertLessEqual(page.evaluate("document.documentElement.scrollWidth"), width)
                page.locator(".lesson-card").tap()
                for tab in ["learn", "practice", "check"]:
                    page.locator(f'[data-tab="{tab}"]').tap()
                    self.assertLessEqual(page.evaluate("document.documentElement.scrollWidth"), width, f"Overflow at {width}px in {tab}")
                page.locator('[data-tab="practice"]').tap()
                page.locator('[data-answer="1"]').tap()
                expect(page.locator("#feedback-title")).to_have_text("Верно. Вот почему.")
                if width == 390:
                    page.screenshot(path="/tmp/alkanes-mobile-practice.png")
                    page.locator('[data-tab="learn"]').tap()
                    page.evaluate("scrollTo(0,0)")
                    page.screenshot(path="/tmp/alkanes-mobile.png")
            finally:
                mobile.close()

    def test_keyboard_tabs_reset_and_blocked_storage(self):
        self.page.locator("#tab-learn").focus()
        self.page.keyboard.press("ArrowRight")
        expect(self.page.locator("#panel-practice")).to_be_visible()
        expect(self.page.locator("#tab-practice")).to_be_focused()
        self.page.keyboard.press("End")
        expect(self.page.locator("#panel-check")).to_be_visible()
        self.page.keyboard.press("Home")
        self.page.locator('[data-tab="practice"]').click()
        self.page.locator('[data-answer="1"]').click()
        self.page.once("dialog", lambda dialog: dialog.dismiss())
        self.page.locator("#reset-progress").click()
        expect(self.page.locator("#overall-label")).to_have_text("Разобрано 1 из 12")
        self.page.once("dialog", lambda dialog: dialog.accept())
        self.page.locator("#reset-progress").click()
        expect(self.page.locator("#overall-label")).to_have_text("Разобрано 0 из 12")
        self.page.add_init_script("Object.defineProperty(window, 'localStorage', {get(){throw new Error('Storage disabled')}})")
        self.page.reload()
        expect(self.page.locator("#storage-notice")).to_be_visible()
        self.page.locator('[data-tab="practice"]').click()
        self.page.locator('[data-answer="1"]').click()
        expect(self.page.locator("#feedback-title")).to_have_text("Верно. Вот почему.")


if __name__ == "__main__":
    unittest.main()
