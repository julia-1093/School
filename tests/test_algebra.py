"""Browser checks of roots, domains, equivalence conditions and answer endpoints."""

import functools
import http.server
import math
from pathlib import Path
import tempfile
import threading
import unittest

from playwright.sync_api import expect, sync_playwright


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


class AlgebraTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory(prefix="school-algebra-tests-")
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
        self.context = self.browser.new_context(viewport={"width":1440,"height":1000},locale="ru-RU",reduced_motion="reduce")
        self.page = self.context.new_page()
        self.page.set_default_timeout(5000)
        self.errors = []
        self.page.on("pageerror", lambda error: self.errors.append(str(error)))
        self.page.on("requestfailed", lambda req: self.errors.append(f"Resource failed: {req.url}"))
        self.page.on("response", lambda res: self.errors.append(f"HTTP {res.status}: {res.url}") if res.status>=400 else None)
        self.page.goto(self.base+"algebra-10-roots-powers/",wait_until="networkidle")

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def test_catalogue_and_math_rendering(self):
        self.page.goto(self.base)
        expect(self.page.locator(".lesson-card")).to_have_count(3)
        self.page.locator('.lesson-card[href="./algebra-10-roots-powers/"]').click()
        expect(self.page).to_have_title("Корни, степени и иррациональные неравенства — алгебра, 10 класс · По полочкам")
        expect(self.page.locator("#lesson-title")).to_contain_text("степени")
        self.assertGreater(self.page.locator("math").count(),3)
        expect(self.page.locator(".progress-track")).to_have_attribute("aria-valuemax","16")
        self.page.screenshot(path="/tmp/algebra-desktop.png")

    def test_root_parity_exact_decimals_and_rounding(self):
        for index, radicand, expected in [(2,"16","4"),(4,"16","2"),(3,"-27","−3"),(5,"-32","−2"),(6,"64","2"),(2,"0","0"),(2,"0.01","0,1"),(2,"0.000001","0,001")]:
            self.page.locator("#root-index").select_option(str(index))
            self.page.locator("#radicand").fill(radicand)
            expect(self.page.locator("#root-result math mn").last).to_have_text(expected)
            expect(self.page.locator("#root-result math mo")).to_have_text("=")
        self.page.locator("#radicand").fill("2")
        expect(self.page.locator("#root-result math mo")).to_have_text("≈")
        expect(self.page.locator("#root-result math mn").last).to_have_text("1,414")
        self.page.locator("#radicand").fill("-1")
        expect(self.page.locator("#root-result")).to_contain_text("не определён")
        self.page.locator("#radicand").fill("")
        expect(self.page.locator("#root-result")).to_contain_text("Введите число")

    def test_graph_domains_and_separate_inverse_branches(self):
        self.page.locator("#graph-x").focus()
        self.page.keyboard.press("End")
        expect(self.page.locator("#graph-point")).to_have_text("f(2) = 4")
        self.page.locator('[data-function="cube"]').click()
        self.page.locator("#graph-x").focus()
        self.page.keyboard.press("Home")
        expect(self.page.locator("#graph-point")).to_have_text("f(−1,5) = −3,375")
        self.page.locator('[data-function="sqrt"]').click()
        self.page.locator("#graph-x").focus()
        self.page.keyboard.press("Home")
        expect(self.page.locator("#graph-point")).to_contain_text("не определена")
        expect(self.page.locator("#graph-dot circle")).to_have_count(0)
        self.page.keyboard.press("End")
        expect(self.page.locator("#graph-point")).to_have_text("f(4) = 2")
        self.page.locator('[data-function="inverse"]').click()
        expect(self.page.locator("#graph-curves path")).to_have_count(2)
        self.page.locator("#graph-x").focus()
        self.page.keyboard.press("Home")
        for _ in range(8): self.page.keyboard.press("ArrowRight")
        expect(self.page.locator("#graph-point")).to_contain_text("не определена")
        self.page.keyboard.press("ArrowRight")
        expect(self.page.locator("#graph-point")).to_have_text("f(0,5) = 2")
        self.assertNotIn("NaN",self.page.locator("#graph-curves").inner_html())

    def test_equation_steps_and_extraneous_root(self):
        expect(self.page.locator("#equation-steps li")).to_have_count(1)
        expect(self.page.locator("#equation-steps")).to_contain_text("x ≥ −2")
        for _ in range(4): self.page.locator("#equation-next").click()
        expect(self.page.locator("#equation-steps li")).to_have_count(5)
        expect(self.page.locator("#equation-next")).to_be_disabled()
        self.page.locator('[data-candidate="-1"]').click()
        expect(self.page.locator("#candidate-result")).to_contain_text("Не подходит")
        expect(self.page.locator("#candidate-result")).to_contain_text("ОДЗ выполнено")
        self.page.locator('[data-candidate="2"]').click()
        expect(self.page.locator("#candidate-result")).to_contain_text("Подходит")
        self.page.locator(".equation-example").screenshot(path="/tmp/algebra-equation.png")

    def test_four_inequalities_sign_conditions_and_endpoints(self):
        answers={"lt":"(2; +∞)","le":"[2; +∞)","gt":"[−2; 2)","ge":"[−2; 2]"}
        predicates={"lt":lambda x:x>2,"le":lambda x:x>=2,"gt":lambda x:-2<=x<2,"ge":lambda x:-2<=x<=2}
        comparisons={"lt":lambda a,b:a<b,"le":lambda a,b:a<=b,"gt":lambda a,b:a>b,"ge":lambda a,b:a>=b}
        for name,answer in answers.items():
            self.page.locator(f'[data-comparison="{name}"]').click()
            expect(self.page.locator("#inequality-answer")).to_have_text("Ответ: "+answer)
            expect(self.page.locator('[data-comparison][aria-pressed="true"]')).to_have_count(1)
            expect(self.page.locator('[data-endpoint="left"]')).to_have_attribute("data-closed","false" if name=="lt" else "true")
            if name in ["gt","ge"]:
                expect(self.page.locator('[data-endpoint="right"]')).to_have_attribute("data-closed","true" if name=="ge" else "false")
            for x in [-3,-2,-1,0,1,2,2.5,10]:
                actual=x>=-2 and comparisons[name](math.sqrt(x+2),x)
                self.assertEqual(actual,predicates[name](x),f"{name} at {x}")
        self.page.locator('[data-comparison="lt"]').click()
        expect(self.page.locator("#inequality-rule")).to_contain_text("g > 0")
        self.page.locator('[data-comparison="ge"]').click()
        expect(self.page.locator("#inequality-rule")).to_contain_text("g ≤ 0")

    def test_advanced_block_and_missing_negative_branch(self):
        self.page.locator("#advanced-block summary").click()
        expect(self.page.locator("#advanced-block")).to_contain_text("[5/3; 2] ∪ [3; +∞)")
        self.page.locator('[data-challenge="0"]').click()
        expect(self.page.locator("#challenge-feedback")).to_contain_text("Потеряна отрицательная ветвь")
        self.page.locator('[data-challenge="2"]').click()
        expect(self.page.locator("#challenge-feedback")).to_contain_text("граничных точек")
        self.page.locator('[data-challenge="1"]').click()
        expect(self.page.locator("#challenge-feedback")).to_contain_text("Верно")
        expect(self.page.locator("#overall-label")).to_have_text("Разобрано 0 из 16")
        for x in [-10,-2,-1,0,2,2.5,3,10]:
            defined=x*x-4>=0
            actual=defined and math.sqrt(x*x-4)>x-1
            self.assertEqual(actual,x<=-2 or x>2.5)

    def test_all_sixteen_practice_questions(self):
        self.page.locator('[data-tab="practice"]').click()
        for i,answer in enumerate([1,0,2,1,1,1,2,0,1,2,2,0,1,1,0,2]):
            self.page.locator(f'[data-question="{i}"]').click()
            self.page.locator(f'[data-answer="{answer}"]').click()
            expect(self.page.locator("#feedback-title")).to_have_text("Верно. Вот почему.")
        expect(self.page.locator("#first-try-count")).to_have_text("16")
        expect(self.page.locator("#overall-label")).to_have_text("Разобрано 16 из 16")
        expect(self.page.locator("#practice-complete")).to_be_visible()

    def test_exam_wrong_correct_incomplete_and_reload(self):
        ids=["modulus","fraction","equation","no-solution","strict","non-strict"]
        self.page.locator('[data-tab="check"]').click()
        self.page.locator("#exam-submit").click()
        expect(self.page.locator("#exam-error")).to_be_visible()
        for qid,answer in zip(ids,[0,0,1,0,0,1]): self.page.locator(f'#exam-{qid}-{answer}').check()
        self.page.locator("#exam-submit").click()
        expect(self.page.locator(".exam-score")).to_have_text("0 / из 6")
        expect(self.page.locator(".exam-explanation")).to_have_count(6)
        self.page.locator("#exam-restart").click()
        for qid,answer in zip(ids,[2,1,0,2,1,0]): self.page.locator(f'#exam-{qid}-{answer}').check()
        self.page.locator("#exam-submit").click()
        expect(self.page.locator(".exam-score")).to_have_text("6 / из 6")
        self.page.reload()
        expect(self.page.locator(".exam-score")).to_have_text("6 / из 6")

    def test_retry_isolation_keyboard_and_print(self):
        self.page.locator("#tab-learn").focus()
        self.page.keyboard.press("ArrowRight")
        expect(self.page.locator("#panel-practice")).to_be_visible()
        self.page.locator('[data-answer="0"]').click()
        self.page.locator('[data-action="retry"]').click()
        self.page.locator('[data-answer="1"]').click()
        expect(self.page.locator("#first-try-count")).to_have_text("0")
        self.page.reload()
        expect(self.page.locator("#overall-label")).to_have_text("Разобрано 1 из 16")
        self.page.goto(self.base+"geometry-10-line-plane/#practice")
        expect(self.page.locator("#overall-label")).to_have_text("Разобрано 0 из 12")
        self.page.goto(self.base+"algebra-10-roots-powers/#learn")
        self.page.emulate_media(media="print")
        expect(self.page.locator(".pocket-card")).to_be_visible()
        expect(self.page.locator(".pocket-card")).to_contain_text("g > 0")
        self.assertEqual(self.page.locator(".pocket-card").evaluate("e=>getComputedStyle(e,'::after').content"),"none")

    def test_mobile_graphs_rules_practice_and_touch(self):
        for width in [320,390,768]:
            context=self.browser.new_context(viewport={"width":width,"height":844},is_mobile=True,has_touch=True,reduced_motion="reduce")
            try:
                page=context.new_page();page.set_default_timeout(5000)
                page.on("pageerror",lambda error:self.errors.append(str(error)))
                page.goto(self.base+"algebra-10-roots-powers/",wait_until="networkidle")
                for radicand in ["1000000", "0.123456789012345", "0.000000000001"]:
                    page.locator("#radicand").fill(radicand)
                    self.assertLessEqual(page.evaluate("document.documentElement.scrollWidth"),width,"Root output overflows")
                page.locator("#radicand").fill("16")
                for name in ["square","cube","sqrt","inverse"]:
                    page.locator(f'[data-function="{name}"]').tap()
                    self.assertLessEqual(page.evaluate("document.documentElement.scrollWidth"),width)
                for name in ["lt","le","gt","ge"]:
                    page.locator(f'[data-comparison="{name}"]').tap()
                    self.assertLessEqual(page.evaluate("document.documentElement.scrollWidth"),width)
                page.locator("#advanced-block summary").tap()
                self.assertLessEqual(page.evaluate("document.documentElement.scrollWidth"),width)
                page.locator('[data-challenge="1"]').tap()
                page.locator('[data-tab="practice"]').tap()
                for question in [3,7,11,15]:
                    page.locator(f'[data-question="{question}"]').tap()
                    self.assertLessEqual(page.evaluate("document.documentElement.scrollWidth"),width)
                page.locator('[data-answer="2"]').tap()
                expect(page.locator("#feedback-title")).to_have_text("Верно. Вот почему.")
                page.locator('[data-tab="check"]').tap()
                self.assertLessEqual(page.evaluate("document.documentElement.scrollWidth"),width)
                if width==390:
                    page.locator('[data-tab="learn"]').tap();page.evaluate("scrollTo(0,0)")
                    page.screenshot(path="/tmp/algebra-mobile.png")
            finally:
                context.close()


if __name__=="__main__":
    unittest.main()
