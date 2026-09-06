// クリスタルナイツ 自動プレイテスト
// 実行: NODE_PATH=$(npm root -g) node test/playtest.js  (要: rpg/ を http://localhost:8931 で配信)
// 旧スイートは一時領域に置いていて消失したため、リポジトリ内に再構築。
// データ整合性・戦闘勝利フロー・かくれ商人・無限回廊・UI改善を検証する。
const { chromium } = (() => {
  try { return require("playwright-core"); } catch { return require("playwright"); }
})();

const failures = [];
function mkCheck(log) {
  return (ok, name) => {
    log(`  ${ok ? "PASS" : "FAIL"}: ${name}`);
    if (!ok) failures.push(name);
  };
}

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", headless: true });
  const page = await browser.newPage({ viewport: { width: 480, height: 432 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto("http://localhost:8931/index.html");
  await page.waitForTimeout(1500);
  const check = mkCheck(console.log);

  console.log("== データ整合性 ==");
  const data = await page.evaluate(() => {
    const D = DATA;
    const monsters = Object.keys(D.monsters).length;
    const items = Object.keys(D.items).length;
    const maps = Object.keys(D.maps).length;
    const accs = Object.values(D.items).filter((d) => d.kind === "acc").length;
    const badShop = Object.entries(D.shops).flatMap(([sid, s]) =>
      s.stock.filter((id) => !D.items[id]).map((id) => sid + ":" + id));
    const badEnc = Object.entries(D.encounters).flatMap(([eid, e]) =>
      (e.groups || []).flat().filter((id) => !D.monsters[id]).map((id) => eid + ":" + id));
    const badChest = Object.entries(D.maps).flatMap(([mid, m]) =>
      (m.chests || []).filter((c) => c.item && !D.items[c.item]).map((c) => mid + ":" + c.item));
    const badSpell = Object.values(D.monsters).flatMap((mon) =>
      (mon.acts || []).filter((a) => a.spell && !D.spells[a.spell]).map((a) => a.spell));
    return { monsters, items, maps, accs, badShop, badEnc, badChest, badSpell };
  });
  check(data.monsters === 165, `モンスター165種 (${data.monsters})`);
  check(data.items === 201, `アイテム201種 (${data.items})`);
  check(data.accs === 47, `アクセサリ47種 (${data.accs})`);
  check(data.maps >= 115, `マップ115以上 (${data.maps})`);
  check(data.badShop.length === 0, "全ショップの在庫IDが有効 " + data.badShop.join(","));
  check(data.badEnc.length === 0, "全エンカウントの魔物IDが有効 " + data.badEnc.join(","));
  check(data.badChest.length === 0, "全宝箱のアイテムIDが有効 " + data.badChest.join(","));
  check(data.badSpell.length === 0, "全魔物の行動呪文IDが有効 " + data.badSpell.join(","));

  console.log("\n== 戦闘の勝利フロー ==");
  const battle = await page.evaluate(async () => {
    G.newGame();
    G.state.party.forEach((h) => { h.lv = 30; G.applyStats(h); h.hp = h.maxhp; });
    G.scenes.length = 0;
    G.scenes.push(new FieldScene());
    const bs = new BattleScene(["woodgoblin", "sewerbat"]);
    G.push(bs);
    bs.enemies.forEach((e) => { e.hp = 0; e.dead = true; });
    bs.phase = "atb";
    bs.checkEnd();
    for (let i = 0; i < 60; i++) {
      const t = G.top();
      if (!t) break;
      if (t.constructor.name === "MessageScene") { t.page = t.pages.length; G.pop(); if (t.onDone) t.onDone(); }
      else if (t.constructor.name === "FieldScene") break;
      await new Promise((r) => setTimeout(r, 25));
    }
    return { backToField: G.top() && G.top().constructor.name === "FieldScene" };
  });
  check(battle.backToField, "勝利後にフィールドへ復帰");

  console.log("\n== かくれ商人と果実 ==");
  const secret = await page.evaluate(() => {
    const D = DATA;
    const r = {};
    const shop = D.shops.secret10;
    r.shopDef = !!shop && shop.flatPrice === 10
      && shop.stock.every((id) => D.items[id] && D.items[id].kind !== "key")
      && shop.stock.length === Object.values(D.items).filter((d) => d.kind !== "key").length;
    r.throneEvents = [9, 10].every((x) =>
      D.maps.castle.events.some((e) => e.x === x && e.y === 0
        && e.script && e.script.some((op) => op.shop === "secret10")));
    const sc = new ShopScene("secret10");
    r.priceTen = sc.priceOf("elixir") === 10 && sc.priceOf("fruit_life") === 10;
    r.normalPrice = new ShopScene("selene").priceOf("elixir") === D.items.elixir.price;
    const h = G.makeHero("leon", 50);
    const s0 = h.str, hp0 = h.maxhp;
    const ok1 = applyFieldItem(D.items.fruit_power, h) && h.str === s0 + 3;
    const ok2 = applyFieldItem(D.items.fruit_life, h) && h.maxhp === hp0 + 20;
    h.lv = 60; G.applyStats(h);
    const ref = G.makeHero("leon", 60);
    r.fruits = ok1 && ok2 && h.str === ref.str + 3 && h.maxhp === ref.maxhp + 20;
    return r;
  });
  check(secret.shopDef, "かくれ商人: 全品10ギル・キー以外の全アイテム");
  check(secret.throneEvents, "玉座のうしろにかくれ商人イベント");
  check(secret.priceTen && secret.normalPrice, "10ギル購入・通常店は定価");
  check(secret.fruits, "果実の永続アップがレベルアップ後も残る");

  console.log("\n== 無限回廊 (生成・改善点) ==");
  const endless = await page.evaluate(() => {
    const D = DATA;
    const r = {};
    r.defs = !!D.maps.endless && !!D.monsters.mazewarden && !!D.monsters.mazelord
      && D.monsters.mazelord.hp > D.monsters.nullorigin.hp;
    const rewardIds = Object.values(Endless.rewards);
    r.rewards = rewardIds.length === 10 && rewardIds.every((id) => D.items[id] && D.items[id].kind === "acc");
    r.entrance = D.maps.world.rows[21][5] === "E"
      && D.maps.world.events.some((e) => e.x === 5 && e.y === 21 && e.script && e.script[0].endless === "enter");
    // 全99階: 入口→階段の道 / 宝箱は行き止まり / ふしめの階の構造+クリスタル
    let genOk = true, arenaOk = true, chestOk = true, crystalOk = true;
    for (let f = 1; f <= 99; f++) {
      Endless.build(4242, f);
      const m = D.maps.endless;
      const rows = m.rows;
      const isBoss = f % 10 === 0 || f === 99;
      if (isBoss) {
        if (rows.length !== 8 || rows[0].length !== 13) arenaOk = false;
        if (f < 99 && rows[1][6] !== "s") arenaOk = false;
        if (f === 99 && rows[1].includes("s")) arenaOk = false;
        if (!m.npcs.some((n) => n.spr === "crystal"
          && n.script.some((op) => op.menu && op.menu.options.some((o) =>
            (o.ops || []).some((p) => p.healParty))))) crystalOk = false;
        continue;
      }
      if (rows.length !== 17 || rows[0].length !== 27) { genOk = false; break; }
      let sp = null, ss = null;
      rows.forEach((row, y) => { for (let x = 0; x < row.length; x++) {
        if (row[x] === "P") sp = [x, y]; if (row[x] === "s") ss = [x, y]; } });
      if (!sp || !ss) { genOk = false; break; }
      const seen = new Set([sp.join(",")]);
      const q = [sp];
      let found = false;
      while (q.length) {
        const [x, y] = q.shift();
        if (x === ss[0] && y === ss[1]) { found = true; break; }
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx, ny = y + dy, k = nx + "," + ny;
          if (nx < 0 || ny < 0 || ny >= rows.length || nx >= rows[0].length) continue;
          if (rows[ny][nx] === "#" || seen.has(k)) continue;
          seen.add(k); q.push([nx, ny]);
        }
      }
      if (!found) { genOk = false; break; }
      // 宝箱: 2つまで・中身が有効・行き止まり (まわりの通路が1方向)
      if (m.chests.length > 2) chestOk = false;
      for (const c of m.chests) {
        if (c.item && !D.items[c.item]) chestOk = false;
        let open = 0;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          if (rows[c.y + dy] && rows[c.y + dy][c.x + dx] !== "#") open++;
        }
        if (open !== 1) chestOk = false;
        if (rows[c.y][c.x] !== ".") chestOk = false;
      }
    }
    r.genOk = genOk; r.arenaOk = arenaOk; r.chestOk = chestOk; r.crystalOk = crystalOk;
    // 決定論 (宝箱の中身ふくむ) + 取得記録が組み立てごとにリセット
    Endless.build(777, 5);
    const rowsA = D.maps.endless.rows.join("|"), chestsA = JSON.stringify(D.maps.endless.chests);
    if (D.maps.endless.chests[0]) G.setFlag("chest_" + D.maps.endless.chests[0].id, 1);
    Endless.build(777, 5);
    const rowsB = D.maps.endless.rows.join("|"), chestsB = JSON.stringify(D.maps.endless.chests);
    r.deterministic = rowsA === rowsB && chestsA === chestsB;
    r.chestReset = !Object.keys(G.state.flags).some((k) => /^chest_ec\d/.test(k));
    // チェックポイント: ふしめの階に「ついた時点」で記録される
    delete G.state.flags.endlessCkpt;
    Endless.build(999, 10);
    r.ckptOnArrive = (G.state.flags.endlessCkpt || 0) === 10;
    Endless.build(999, 50);
    r.ckptMax = (G.state.flags.endlessCkpt || 0) === 50;
    const floors = [1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 99]
      .filter((f) => f === 1 || (G.state.flags.endlessCkpt || 0) >= f);
    r.resumeList = JSON.stringify(floors) === JSON.stringify([1, 10, 20, 30, 40, 50]);
    // 敵スケーリング
    const base = D.monsters.woodgoblin;
    const s50 = Endless.scaleMon(base, 50);
    r.scaling = s50.hp > base.hp * 3 && s50.exp > base.exp * 4
      && Endless.scaleMon(D.monsters.mazelord, 50) === D.monsters.mazelord;
    return r;
  });
  check(endless.defs && endless.rewards && endless.entrance, "回廊の定義・報酬10種・入口");
  check(endless.genOk, "全99階で入口→階段の道を生成 (BFS検証)");
  check(endless.arenaOk, "番人アリーナの構造が正しい");
  check(endless.crystalOk, "ふしめの階すべてに回復クリスタル");
  check(endless.chestOk, "迷路の行き止まりに宝箱 (通路をふさがない)");
  check(endless.deterministic, "同シード同階で迷路と宝箱が一致 (セーブ復元)");
  check(endless.chestReset, "回廊の宝箱記録は組み立てごとにリセット");
  check(endless.ckptOnArrive && endless.ckptMax, "ふしめ到達でチェックポイント記録");
  check(endless.resumeList, "再開できる階の一覧が正しい (1,10,…,50)");
  check(endless.scaling, "階数で敵が強化される");

  console.log("\n== 無限回廊 (実戦フロー) ==");
  const flow = await page.evaluate(async () => {
    const r = {};
    const driveBoss = async () => {
      for (let i = 0; i < 300; i++) {
        const t = G.top();
        if (!t) break;
        const n = t.constructor.name;
        if (n === "BattleScene") {
          t.enemies.forEach((e2) => { if (!e2.dead) { e2.hp = 0; e2.dead = true; } });
          t.phase = "atb"; t.checkEnd();
        } else if (n === "MessageScene") {
          t.page = t.pages.length; G.pop(); if (t.onDone) t.onDone();
        } else if (n === "FieldScene") break;
        await new Promise((res) => setTimeout(res, 30));
      }
    };
    G.scenes.length = 0; G.scenes.push(new FieldScene());
    for (const h of G.state.party) { h.hp = h.maxhp = 9999; h.silence = false; h.toad = false; }
    G.state.endless = { seed: 12345, floor: 0, beaten: {} };
    Endless.goto(1);
    await new Promise((res) => setTimeout(res, 900));
    r.entered = G.state.map === "endless" && G.state.endless.floor === 1;
    Endless.scriptOp("down", () => {});
    await new Promise((res) => setTimeout(res, 900));
    r.descended = G.state.endless.floor === 2;
    // 10Fの番人 → 報酬
    G.state.endless.floor = 10;
    Endless.build(12345, 10);
    G.state.x = 6; G.state.y = 6;
    let done10 = false;
    Endless.scriptOp("boss", () => { done10 = true; });
    await driveBoss();
    r.boss10 = done10 && (G.state.items.acc_steelcharm || 0) >= 1 && !!G.flag("endlessReward10");
    let skip = false;
    Endless.scriptOp("boss", () => { skip = true; });
    r.bossSkip = skip && G.top().constructor.name === "FieldScene";
    // 99F → むげんのしるし
    G.state.endless.floor = 99;
    Endless.build(12345, 99);
    let done99 = false;
    Endless.scriptOp("boss", () => { done99 = true; });
    await driveBoss();
    r.boss99 = done99 && (G.state.items.acc_mugen || 0) >= 1 && !!G.flag("endlessClear");
    // 回廊内セーブ→ロードで同じ階を復元
    G.state.map = "endless"; G.state.endless.floor = 7;
    Endless.build(12345, 7);
    const rowsSave = DATA.maps.endless.rows.join("|");
    G.save(1);
    DATA.maps.endless.rows = ["###", "#P#", "###"];
    r.loadOk = G.load(1) && G.state.map === "endless"
      && DATA.maps.endless.rows.join("|") === rowsSave;
    // チートアクセの効果
    G.state.map = "world";
    const bs = new BattleScene(["woodgoblin"]);
    const hero = G.state.party[0];
    hero.acc = "acc_sagesoul";
    r.mpzero = bs.mpCost(hero, { mp: 40 }) === 0;
    hero.acc = "acc_mugen";
    r.guard = bs.guardMul(hero) === 0.5;
    hero.acc = "acc_phoenixsoul";
    const pq = bs.party[0];
    pq.h.hp = 0;
    r.autolife2 = bs.tryAutolife(pq) && (pq.h.hp = 0, bs.tryAutolife(pq)) && pq.h.hp > 0;
    hero.acc = null;
    G.state.endless = null; G.state.map = "world"; G.state.x = 5; G.state.y = 22;
    G.scenes.length = 0; G.scenes.push(new FieldScene());
    return r;
  });
  check(flow.entered && flow.descended, "回廊に入って階段で降りられる");
  check(flow.boss10, "10Fの番人撃破で報酬アクセ入手");
  check(flow.bossSkip, "撃破ずみの番人は再戦しない");
  check(flow.boss99, "99Fらせんおう撃破で完全制覇");
  check(flow.loadOk, "回廊内セーブ→ロードで同じ階を復元");
  check(flow.mpzero && flow.guard && flow.autolife2, "チートアクセ効果 (MP0/被ダメ半減/何度でも復活)");

  console.log("\n== UI改善 (画面切れの解消) ==");
  const ui = await page.evaluate(() => {
    const r = {};
    const H = 288;
    // 飛空艇とおなじ 11この選択肢が 既定位置でも 画面におさまる
    const c11 = new ChoiceScene(Array.from({ length: 11 }, (_, i) => `いきさき${i}`), () => {}, { y: 120 });
    r.clamp11 = c11.y + c11.view * 17 + 16 <= H;
    // 16こでもスクロールしておさまり、カーソル追随で下まで見える
    const c16 = new ChoiceScene(Array.from({ length: 16 }, (_, i) => `せんたく${i}`), () => {}, { y: 150 });
    const fits = c16.y + c16.view * 17 + 16 <= H && c16.view <= 13;
    c16.sel = 15;
    c16.update();
    r.scroll16 = fits && c16.scroll === 16 - c16.view && c16.sel < c16.scroll + c16.view;
    // 回廊の再開メニュー (最大12こ) もおさまる
    const cEnd = new ChoiceScene(Array.from({ length: 12 }, (_, i) => `${i * 10}かいから いどむ`), () => {}, { x: 140, y: 60 });
    r.endlessMenu = cEnd.y + cEnd.view * 17 + 16 <= H && cEnd.x + cEnd.w <= 320;
    // フィールドの呪文リスト: 呪文が多くても描画が例外なく完了する
    let spellOk = true;
    try {
      const h = G.state.party[0];
      const many = Object.entries(DATA.spells).filter(([, d]) => d.field).map(([id]) => id);
      h.spells = many.concat(many).slice(0, 14);
      const ms = new MenuScene();
      ms.picked = h;
      ms.sel2 = 13;
      ms.drawSpellList();
    } catch (e) { spellOk = false; }
    G.scenes.length = 0; G.scenes.push(new FieldScene());
    return r.clamp11 !== undefined ? { ...r, spellOk } : { spellOk };
  });
  check(ui.clamp11, "11件の選択肢 (飛空艇) が画面内におさまる");
  check(ui.scroll16, "16件でもスクロールで全選択肢に届く");
  check(ui.endlessMenu, "回廊の再開メニューが画面内におさまる");
  check(ui.spellOk, "フィールド呪文リストが多数でも描画できる (スクロール)");

  console.log("\n== コンソールエラー ==");
  if (errors.length) errors.forEach((e) => console.log("  ", e));
  check(errors.length === 0, "コンソールエラーなし");

  await browser.close();
  console.log("\n========================================");
  console.log(failures.length === 0 ? "ALL PLAYTEST CHECKS PASSED" : `${failures.length} FAILURES:\n - ` + failures.join("\n - "));
  process.exit(failures.length ? 1 : 0);
})().catch((e) => { console.error("FATAL:", e); process.exit(2); });
