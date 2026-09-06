// 改善スクリーンショット: 飛空艇メニュー / 回廊アリーナ(クリスタル) / 迷路の宝箱 / 再開メニュー
const { chromium } = (() => {
  try { return require("playwright-core"); } catch { return require("playwright"); }
})();
const OUT = process.argv[2] || ".";
(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", headless: true });
  const page = await browser.newPage({ viewport: { width: 480, height: 432 } });
  await page.goto("http://localhost:8931/index.html");
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    G.newGame();
    G.state.party.forEach((h) => { h.lv = 60; G.applyStats(h); h.hp = h.maxhp; });
    G.setFlag("airship", 1); G.setFlag("submarine", 1);
    G.scenes.length = 0;
    G.state.map = "world"; G.state.x = 5; G.state.y = 22;
    G.scenes.push(new FieldScene());
  });
  // 1) 飛空艇の いきさきメニュー (11件・スクロール+位置クランプ)
  await page.evaluate(() => { runScript(JSON.parse(JSON.stringify(DATA.scripts.airshipBoard))); });
  await page.waitForTimeout(400);
  await page.keyboard.press("z");
  await page.waitForTimeout(400);
  await page.keyboard.press("z");
  await page.waitForTimeout(500);
  await page.screenshot({ path: OUT + "/shot-airship-menu.png" });
  await page.keyboard.press("x");
  await page.waitForTimeout(300);
  // 2) 回廊10F アリーナ (回復クリスタル+番人+いずみ)
  await page.evaluate(() => {
    G.scenes.length = 0; G.scenes.push(new FieldScene());
    G.state.endless = { seed: 20260720, floor: 0, beaten: {} };
    G.state.endless.floor = 10;
    Endless.build(20260720, 10);
    Endless.warp(6, 5, "u");
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: OUT + "/shot-endless-arena2.png" });
  // 3) 迷路フロア (行き止まりの宝箱が見える階)
  await page.evaluate(() => { G.state.endless.floor = 3; Endless.build(20260720, 3); Endless.warp(1, 15, "u"); });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: OUT + "/shot-endless-chest.png" });
  // 4) 入口の 再開メニュー (チェックポイント一覧)
  await page.evaluate(() => {
    G.state.endless = null;
    G.state.map = "world"; G.state.x = 5; G.state.y = 22;
    G.scenes.length = 0; G.scenes.push(new FieldScene());
    G.setFlag("endlessIntro", 1);
    G.setFlag("endlessCkpt", 50);
    Endless.scriptOp("enter", () => {});
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: OUT + "/shot-endless-resume.png" });
  await browser.close();
  console.log("shots saved");
})();
