// モンスターシーカー スクリーンショット撮影
const { chromium } = (() => {
  try { return require("playwright-core"); } catch { return require("playwright"); }
})();
const OUT = process.argv[2] || ".";
(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", headless: true });
  const page = await browser.newPage({ viewport: { width: 480, height: 432 } });
  await page.goto("http://localhost:8932/index.html");
  await page.waitForTimeout(1500);
  // 1) タイトル
  await page.screenshot({ path: OUT + "/ms-title.png" });
  // 2) スターターせんたく
  await page.evaluate(() => {
    G.newGame();
    G.replace(new FieldScene());
    runScript(JSON.parse(JSON.stringify(DATA.scripts.starterChoice)));
  });
  for (let i = 0; i < 2; i++) { await page.keyboard.press("z"); await page.waitForTimeout(400); }
  await page.waitForTimeout(300);
  await page.screenshot({ path: OUT + "/ms-starter.png" });
  // えらんで むらへ
  await page.evaluate(async () => {
    for (let i = 0; i < 30; i++) {
      const t = G.top();
      if (!t) break;
      if (t.constructor.name === "MessageScene") { t.page = t.pages.length; G.pop(); if (t.onDone) t.onDone(); }
      else if (t.constructor.name === "ChoiceScene") { G.pop(); t.onPick(0); }
      else break;
      await new Promise((r) => setTimeout(r, 25));
    }
  });
  // 3) むらのフィールド
  await page.waitForTimeout(400);
  await page.screenshot({ path: OUT + "/ms-village.png" });
  // 4) 野生バトル (コマンド画面)
  await page.evaluate(async () => {
    const me = G.state.party[0];
    me.lv = 7; me.exp = G.expTotalFor(7); G.monStats(me); me.hp = me.maxhp;
    const bs = new BattleScene({ wild: { id: "togemaru", lv: 5 } });
    G.push(bs);
    for (let i = 0; i < 100; i++) {
      if (bs.phase === "msg" && bs.cur && bs.cur.text != null) { bs.chars = 9999; bs.advance(); }
      else break;
      await new Promise((r) => setTimeout(r, 15));
    }
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: OUT + "/ms-battle.png" });
  // 5) ずかん (GBカラーで)
  await page.evaluate(() => {
    G.scenes = G.scenes.filter((s) => s.constructor.name === "FieldScene");
    G.state.config.gbc = true;
    ["hibachi", "nezumaru", "torippi", "togemaru"].forEach((id) => { G.recordSeen(id); G.recordCaught(id); });
    G.recordSeen("komorin");
    const ms = new MenuScene();
    ms.state = "dex";
    G.push(ms);
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: OUT + "/ms-dex.png" });
  await browser.close();
  console.log("shots saved");
})();
