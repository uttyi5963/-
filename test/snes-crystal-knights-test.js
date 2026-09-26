// クリスタルナイツ (SNES風リメイク) 自動プレイテスト
// 実行: NODE_PATH=$(npm root -g) node test/snes-crystal-knights-test.js
// (要: rpg/snes-crystal-knights/ を http://localhost:8960 で配信)
const { chromium } = (() => {
  try { return require("playwright-core"); } catch { return require("playwright"); }
})();

const failures = [];
const check = (ok, name) => {
  console.log(`  ${ok ? "PASS" : "FAIL"}: ${name}`);
  if (!ok) failures.push(name);
};

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", headless: true });
  const page = await browser.newPage({ viewport: { width: 512, height: 448 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto("http://localhost:8960/index.html");
  await page.waitForTimeout(1200);

  console.log("== データ整合性 ==");
  const data = await page.evaluate(() => {
    const D = DATA;
    const r = {};
    function walkable(m, x, y) {
      const row = m.rows[y]; if (!row || x < 0 || x >= row.length) return false;
      const t = m.legend[row[x]]; return t && !t.solid;
    }
    r.widthOk = Object.values(D.maps).every((m) => m.rows.every((row) => row.length === m.rows[0].length));
    r.tileOk = Object.values(D.maps).every((m) =>
      m.rows.every((row) => [...row].every((ch) => !!m.legend[ch])));
    r.spriteOk = Object.values(D.maps).every((m) =>
      m.rows.every((row) => [...row].every((ch) => !!SPR.tiles[m.legend[ch].tile])));
    r.warpOk = Object.values(D.maps).every((m) => (m.events || []).every((e) => e.type !== "warp" || !!D.maps[e.map]));
    r.enemySpriteOk = Object.values(D.enemies).every((e) => !!SPR.mons[e.spr]);
    r.encounterOk = Object.values(D.encounters).every((t) => t.mons.every((id) => !!D.enemies[id]));

    // castle: BFS 到達性 (自己完結した部屋なので 全域が つながっているべき)
    const castle = D.maps.castle;
    const cells = [];
    castle.rows.forEach((row, y) => { [...row].forEach((ch, x) => { if (walkable(castle, x, y)) cells.push([x, y]); }); });
    const seen = new Set([cells[0][0] + "," + cells[0][1]]);
    const q = [cells[0]];
    while (q.length) {
      const [x, y] = q.shift();
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const k = (x + dx) + "," + (y + dy);
        if (!seen.has(k) && walkable(castle, x + dx, y + dy)) { seen.add(k); q.push([x + dx, y + dy]); }
      }
    }
    r.castleConnected = cells.every(([x, y]) => seen.has(x + "," + y));
    return r;
  });
  check(data.widthOk, "全マップの行の幅がそろっている");
  check(data.tileOk, "全マップのタイル文字がlegendに定義済み");
  check(data.spriteOk, "legendが参照するタイル名にスプライトがある");
  check(data.warpOk, "全warpイベントの行き先マップが実在する");
  check(data.enemySpriteOk, "全てきにスプライトがある");
  check(data.encounterOk, "エンカウントテーブルのてきIDが有効");
  check(data.castleConnected, "城内の歩行可能領域が連結している");

  console.log("\n== 起動とタイトル ==");
  const intro = await page.evaluate(async () => {
    const r = {};
    r.titleFirst = G.top() instanceof TitleScene;
    Input.hit.a = true; G.top().update(0.02); Input.hit = {};
    await new Promise((res) => setTimeout(res, 50));
    r.toField = G.top() instanceof FieldScene;
    const fs = G.top();
    r.startPos = fs.mapId === DATA.newGame.map && fs.x === DATA.newGame.x && fs.y === DATA.newGame.y;
    return r;
  });
  check(intro.titleFirst, "起動直後はタイトル画面");
  check(intro.toField, "Zキーでゲーム開始→フィールドへ");
  check(intro.startPos, "ニューゲームの初期位置が正しい");

  console.log("\n== 移動とNPC会話 ==");
  const move = await page.evaluate(async () => {
    const r = {};
    const fs = G.top();
    fs.x = 14; fs.y = 4; fs.dir = "u"; fs.moving = null;
    fs.update(0.02);
    Input.hit.a = true; fs.update(0.02); Input.hit = {};
    r.opened = G.top() instanceof MessageScene;
    r.hasScholar = r.opened && G.top().pages[0].includes("リグル");
    if (r.opened) {
      const ms = G.top();
      ms.chars = 9999;
      Input.hit.a = true; ms.update(0.02); Input.hit = {};
      r.closed = G.top() instanceof FieldScene;
    }
    return r;
  });
  check(move.opened, "NPCの正面でZキー→メッセージが開く");
  check(move.hasScholar, "宮廷学者リグルのセリフが表示される");
  check(move.closed, "メッセージを閉じるとフィールドへ戻る");

  console.log("\n== 城とフィールドのワープおうふく ==");
  const warp = await page.evaluate(async () => {
    const r = {};
    const fs = G.top();
    fs.x = 9; fs.y = 10; fs.dir = "d"; fs.moving = null;
    fs.tryMove("d", 0, 1);
    r.toWorld = fs.mapId === "world" && fs.x === 7 && fs.y === 27;
    fs.warpTo("castle", 9, 10, "u");
    r.backToCastle = fs.mapId === "castle" && fs.x === 9 && fs.y === 10;
    return r;
  });
  check(warp.toWorld, "城の出口→フィールドへワープする(座標も正しい)");
  check(warp.backToCastle, "フィールド→城へワープしなおせる");

  console.log("\n== 戦闘 ==");
  const battle = await page.evaluate(async () => {
    const r = {};
    const fs = G.top();
    fs.warpTo("world", 8, 9, "d");
    STATE.leon.hp = STATE.leon.maxhp;
    const beforeExp = STATE.leon.exp;
    const bs = new BattleScene("goblin");
    G.push(bs);
    r.introMsg = bs.phase === "msg";
    bs.chars = 9999;
    Input.hit.a = true; bs.update(0.02); Input.hit = {};
    r.toCommand = bs.phase === "command";
    for (let i = 0; i < 30 && !(G.top() instanceof FieldScene); i++) {
      const top = G.top();
      if (top instanceof BattleScene) {
        if (top.phase === "command") { top.sel = 0; Input.hit.a = true; top.update(0.02); Input.hit = {}; }
        else if (top.phase === "msg") { top.chars = 9999; Input.hit.a = true; top.update(0.02); Input.hit = {}; }
      }
    }
    r.backToField = G.top() instanceof FieldScene;
    r.resolved = bs.won || bs.lost;
    r.gotExp = bs.won ? STATE.leon.exp > beforeExp : true;
    return r;
  });
  check(battle.introMsg, "戦闘開始時はメッセージ表示から");
  check(battle.toCommand, "メッセージのあとコマンド選択になる");
  check(battle.backToField, "戦闘終了後にフィールドへ戻る");
  check(battle.resolved, "戦闘の勝敗が確定する");
  check(battle.gotExp, "勝利で経験値を獲得する");

  console.log("\n== にげる ==");
  const flee = await page.evaluate(async () => {
    STATE.leon.hp = STATE.leon.maxhp;
    const bs = new BattleScene("bat");
    G.push(bs);
    bs.chars = 9999;
    Input.hit.a = true; bs.update(0.02); Input.hit = {};
    for (let i = 0; i < 30 && !(G.top() instanceof FieldScene); i++) {
      const top = G.top();
      if (top instanceof BattleScene) {
        if (top.phase === "command") { top.sel = 1; Input.hit.a = true; top.update(0.02); Input.hit = {}; }
        else if (top.phase === "msg") { top.chars = 9999; Input.hit.a = true; top.update(0.02); Input.hit = {}; }
      }
    }
    return G.top() instanceof FieldScene;
  });
  check(flee, "にげるコマンドで戦闘を終了できる");

  console.log("\n== コンソールエラー ==");
  check(errors.length === 0, "コンソールエラーなし");
  if (errors.length) errors.forEach((e) => console.log("  " + e));

  console.log("\n" + "=".repeat(40));
  if (failures.length) {
    console.log(`${failures.length} FAILURES:`);
    failures.forEach((f) => console.log(" - " + f));
    process.exitCode = 1;
  } else {
    console.log("ALL SNES-REMAKE CHECKS PASSED");
  }
  await browser.close();
})();
