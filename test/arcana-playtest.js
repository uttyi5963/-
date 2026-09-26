// アルカナダンジョン 自動プレイテスト
// 実行: NODE_PATH=$(npm root -g) node test/arcana-playtest.js
// (要: rpg/arcana/ を http://localhost:8933 で配信)
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
  const page = await browser.newPage({ viewport: { width: 480, height: 432 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto("http://localhost:8933/index.html");
  await page.waitForTimeout(1500);

  console.log("== データ整合性 ==");
  const data = await page.evaluate(() => {
    const D = DATA;
    const r = {};
    // マップ: 幅そろい・legend定義・BFS到達性
    function walkable(m, x, y) {
      const row = m.rows[y]; if (!row || x < 0 || x >= row.length) return false;
      const t = m.legend[row[x]]; return t && !t.solid;
    }
    r.widthOk = Object.values(D.maps).every((m) => m.rows.every((row) => row.length === m.rows[0].length));
    r.tileOk = Object.values(D.maps).every((m) =>
      m.rows.every((row) => [...row].every((ch) => !!m.legend[ch])));
    r.bfsOk = Object.entries(D.maps).every(([mid, m]) => {
      const cells = [];
      m.rows.forEach((row, y) => { [...row].forEach((ch, x) => { if (walkable(m, x, y)) cells.push([x, y]); }); });
      if (!cells.length) return true;
      const seen = new Set([cells[0][0] + "," + cells[0][1]]);
      const q = [cells[0]];
      while (q.length) {
        const [x, y] = q.shift();
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const k = (x + dx) + "," + (y + dy);
          if (!seen.has(k) && walkable(m, x + dx, y + dy)) { seen.add(k); q.push([x + dx, y + dy]); }
        }
      }
      return cells.every(([x, y]) => seen.has(x + "," + y));
    });
    r.warpOk = Object.values(D.maps).every((m) => (m.events || []).every((e) => !e.warp || !!D.maps[e.warp.map]));
    // ジョブ/スキル/アイテム/てき/ヒーロー の 相互参照
    r.jobsOk = Object.values(D.jobs).every((j) =>
      Object.values(j.learn).every((sk) => !!D.skills[sk]) && !!D.items[j.weapon] && !!D.items[j.armor] && !!SPR.chars[j.spr]);
    r.heroesOk = Object.values(D.heroes).every((h) => !!D.jobs[h.defaultJob]);
    r.enemiesOk = Object.values(D.enemies).every((e) => !!SPR.mons[e.spr]);
    r.shopsOk = Object.values(D.shops).every((s) => s.stock.every((id) => !!D.items[id]));
    r.chestsOk = Object.values(D.maps).every((m) => (m.chests || []).every((c) => !c.item || !!D.items[c.item]));
    return r;
  });
  check(data.widthOk, "全マップの行の幅がそろっている");
  check(data.tileOk, "全マップのタイル文字がlegendに定義済み");
  check(data.bfsOk, "全マップの歩行可能領域が連結している");
  check(data.warpOk, "全マップのワープ先が実在する");
  check(data.jobsOk, "全ジョブのスキル/初期装備/スプライトが有効");
  check(data.heroesOk, "全キャラのdefaultJobが有効");
  check(data.enemiesOk, "全てきにスプライトがある");
  check(data.shopsOk, "全ショップの在庫アイテムが有効");
  check(data.chestsOk, "全宝箱のアイテムが有効");

  console.log("\n== はじまりの流れ ==");
  const intro = await page.evaluate(async () => {
    const r = {};
    G.newGame();
    G.replace(new FieldScene());
    runScript(JSON.parse(JSON.stringify(DATA.scripts.intro)));
    for (let i = 0; i < 30; i++) {
      const t = G.top();
      if (t && t.constructor.name === "MessageScene") { t.page = t.pages.length; G.pop(); if (t.onDone) t.onDone(); }
      else break;
      await new Promise((res) => setTimeout(res, 20));
    }
    r.booted = G.top() && G.top().constructor.name === "FieldScene" && G.state.map === "town";
    r.party4 = G.state.party.length === 4 && G.flag("party4");
    r.jobs = G.state.party.map((h) => h.cls).join(",") === "warrior,mage,cleric,rogue";
    r.hasStats = G.state.party.every((h) => h.maxhp > 0 && Number.isInteger(h.maxhp) && h.hp === h.maxhp);
    return r;
  });
  check(intro.booted, "ニューゲーム→町に立つ");
  check(intro.party4, "4人のなかまが加入する");
  check(intro.jobs, "各キャラが想定どおりのデフォルトジョブを持つ");
  check(intro.hasStats, "ステータスが整数で初期化されている (HP端数バグの再発防止)");

  console.log("\n== 戦闘とジョブ/スキル ==");
  const battle = await page.evaluate(async () => {
    const r = {};
    const drive = async (b, limit = 800) => {
      for (let i = 0; i < limit; i++) {
        if (b.finished) return;
        if (b.phase === "msg") { if (b.cur && b.cur.text != null) { b.chars = 9999; b.advance(); } }
        else return;
        await new Promise((res) => setTimeout(res, 8));
      }
    };
    G.newGame();
    G.scenes = [new FieldScene()];
    G.state.party = [G.makeHero("rin", 5), G.makeHero("fio", 5), G.makeHero("els", 5), G.makeHero("kai", 5)];
    const beforeGold = G.state.gold;
    const bs = new BattleScene({ wild: [{ id: "goblin", lv: 3 }, { id: "bat", lv: 3 }] });
    G.push(bs);
    await drive(bs);
    let steps = 0;
    while (!bs.finished && steps++ < 300) {
      if (bs.phase === "command") {
        bs.pendingAction = "atk"; bs.phase = "target"; bs.targetSide = "enemy"; bs.sel = 0;
      } else if (bs.phase === "target") {
        const h = bs.party[bs.actorIdx];
        const target = bs.aliveEnemies()[0];
        if (target) bs.doAttack(h, target); else { bs.flush("nextActor"); }
      }
      await drive(bs);
    }
    r.winFlow = bs.finished && G.top().constructor.name === "FieldScene";
    r.gotGold = G.state.gold > beforeGold;
    const rin = G.state.party[0];
    r.gotExpSp = rin.exp > G.expTotalFor(5) && (rin.jobSp.warrior || 0) > 0;

    // スキルポータビリティ: せんしで20SPわざを おぼえ、まほうつかいに かえても サブスキルで つかえる
    G.addSp(rin, 25);
    r.learnedGuardBreak = rin.skillLib.includes("guard_break");
    G.changeJob(rin, "mage");
    G.addSp(rin, 0);
    r.jobChanged = rin.cls === "mage" && rin.hp === rin.maxhp && Number.isInteger(rin.maxhp);
    r.mageOwnSkill = G.usableSkillsOf(rin).includes("fire") && !G.usableSkillsOf(rin).includes("guard_break");
    rin.subskills.push("guard_break");
    r.subskillWorks = G.usableSkillsOf(rin).includes("guard_break") && G.usableSkillsOf(rin).includes("fire");

    // 全滅処理
    G.state.party.forEach((h) => { h.hp = 1; });
    G.state.gold = 1000;
    const bs2 = new BattleScene({ wild: [{ id: "skeleton", lv: 20 }] });
    G.push(bs2);
    for (let i = 0; i < 60; i++) {
      if (bs2.phase === "msg") { if (bs2.cur && bs2.cur.text != null) { bs2.chars = 9999; bs2.advance(); } }
      else if (bs2.phase === "command" && !bs2.resolved) {
        G.state.party.forEach((h) => { h.hp = 0; });
        bs2.checkEnd();
      } else break;
      await new Promise((res) => setTimeout(res, 8));
    }
    // loseBattle() の G.fade() は じっさいの ゲームループ(rAF)が
    // updateFade を すすめて はじめて かんりょうする ひどうきしょり。
    // フェード(out+in、fadeT 1.0ずつ ÷ dt*3.5)が おわるまで じゅうぶん まつ。
    await new Promise((res) => setTimeout(res, 900));
    r.wipeHandled = G.state.gold === 500 && G.state.party.every((h) => h.hp === h.maxhp)
      && G.top().constructor.name !== "BattleScene";
    return r;
  });
  check(battle.winFlow, "戦闘に勝ってフィールドへ戻る");
  check(battle.gotGold, "勝利でギルを獲得");
  check(battle.gotExpSp, "勝利でEXPとジョブSPを獲得");
  check(battle.learnedGuardBreak, "SP蓄積でジョブわざ(よろいくだき)を習得");
  check(battle.jobChanged, "ジョブ変更でステータス再計算+全回復 (HPは整数)");
  check(battle.mageOwnSkill, "ジョブ変更後は新ジョブ本来のわざのみ即使用可");
  check(battle.subskillWorks, "旧ジョブのわざをサブスキル装備で他ジョブでも使用可");
  check(battle.wipeHandled, "全滅で町へ搬送・ギル半減・全回復");

  console.log("\n== ダンジョンとボス ==");
  const dungeon = await page.evaluate(async () => {
    const r = {};
    const drive = async (b, limit = 800) => {
      for (let i = 0; i < limit; i++) {
        if (b.finished) return;
        if (b.phase === "msg") { if (b.cur && b.cur.text != null) { b.chars = 9999; b.advance(); } }
        else return;
        await new Promise((res) => setTimeout(res, 8));
      }
    };
    G.newGame();
    G.scenes = [new FieldScene()];
    G.state.party = [G.makeHero("rin", 15), G.makeHero("fio", 15), G.makeHero("els", 15), G.makeHero("kai", 15)];
    runScript(JSON.parse(JSON.stringify(DATA.scripts.bossFight)));
    for (let i = 0; i < 400; i++) {
      const t = G.top();
      if (!t) break;
      const n = t.constructor.name;
      if (n === "MessageScene") { t.page = t.pages.length; G.pop(); if (t.onDone) t.onDone(); }
      else if (n === "BattleScene") {
        if (t.phase === "msg") await drive(t);
        else if (t.phase === "command") { t.pendingAction = "atk"; t.phase = "target"; t.targetSide = "enemy"; t.sel = 0; }
        else if (t.phase === "target") {
          const h = t.party[t.actorIdx];
          const target = t.aliveEnemies()[0];
          if (target) t.doAttack(h, target); else t.flush("nextActor");
        }
        else break;
      } else break;
      await new Promise((res) => setTimeout(res, 8));
    }
    r.bossDown = G.flag("bossDown") && G.flag("clearedRuins");
    r.chapter = G.currentChapter();
    return r;
  });
  check(dungeon.bossDown, "ボス(ヴォイドス)を撃破してフラグが立つ");
  check(dungeon.chapter === "迷宮バギンの踏破者", "ボス撃破で進行度表示が更新される");

  console.log("\n== ショップとセーブ ==");
  const shopSave = await page.evaluate(async () => {
    const r = {};
    G.newGame();
    G.scenes = [new FieldScene()];
    G.state.party = [G.makeHero("rin", 3)];
    const before = G.state.gold;
    const shop = new ShopScene("town1", () => {});
    G.push(shop);
    shop.state = "buy"; shop.sub = shop.shop.stock.indexOf("potion");
    Input.hit.a = true; shop.update(); Input.hit = {};
    r.bought = G.state.gold < before && (G.state.items.potion || 0) >= 4;
    G.pop();

    const ok1 = G.save(1);
    const rinLvBefore = G.state.party[0].lv;
    G.state.party[0].lv = 99;
    const ok2 = G.load(1);
    r.saveLoad = ok1 && ok2 && G.state.party[0].lv === rinLvBefore;

    const code = G.exportCode(1);
    r.codeRoundTrip = !!code && code.startsWith(G.CODE_PREFIX) && G.importCode(code, 2) && G.load(2);
    return r;
  });
  check(shopSave.bought, "ショップで購入できる");
  check(shopSave.saveLoad, "セーブ→ロードで状態が戻る");
  check(shopSave.codeRoundTrip, "ひきつぎコードの書き出し/読み込み");

  console.log("\n== コンソールエラー ==");
  check(errors.length === 0, "コンソールエラーなし");
  if (errors.length) errors.forEach((e) => console.log("  " + e));

  console.log("\n" + "=".repeat(40));
  if (failures.length) {
    console.log(`${failures.length} FAILURES:`);
    failures.forEach((f) => console.log(" - " + f));
    process.exitCode = 1;
  } else {
    console.log("ALL ARCANA CHECKS PASSED");
  }
  await browser.close();
})();
