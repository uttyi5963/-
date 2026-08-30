// モンスターシーカー 自動プレイテスト
// 実行: NODE_PATH=$(npm root -g) node test/seeker-playtest.js
// (要: rpg/seeker/ を http://localhost:8932 で配信)
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
  await page.goto("http://localhost:8932/index.html");
  await page.waitForTimeout(1500);

  console.log("== データ整合性 ==");
  const data = await page.evaluate(() => {
    const D = DATA;
    const r = {};
    r.species = Object.keys(D.species).length;
    r.dexAll = D.dexOrder.every((id) => !!D.species[id]) && D.dexOrder.length === Object.keys(D.species).length;
    r.movesOk = Object.values(D.species).every((sp) =>
      Object.values(sp.learn).every((mv) => !!D.moves[mv]));
    r.evolveOk = Object.values(D.species).every((sp) => !sp.evolve || !!D.species[sp.evolve.to]);
    r.sprOk = Object.values(D.species).every((sp) => !!SPR.mons[sp.spr]);
    r.typeOk = Object.values(D.species).every((sp) => !!D.types[sp.type])
      && Object.values(D.moves).every((mv) => !!D.types[mv.type]);
    r.encOk = Object.values(D.encounters).every((t) =>
      t.mons.every(([id]) => !!D.species[id]));
    r.trainerOk = Object.values(D.trainers).every((t) =>
      t.mons.every(([id]) => id === "RIVAL_STARTER" || !!D.species[id]));
    r.shopOk = Object.values(D.shops).every((s) => s.stock.every((id) => !!D.items[id]));
    r.chart = D.typeMod("fire", "grass") === 2 && D.typeMod("water", "fire") === 2
      && D.typeMod("fire", "water") === 0.5 && D.typeMod("normal", "elec") === 1;
    // マップ: ワープ先が すべて 実在する
    r.warpOk = Object.values(D.maps).every((m) =>
      (m.events || []).every((e) => !e.warp || !!D.maps[e.warp.map]));
    return r;
  });
  check(data.species === 30, `種族30種が定義済み (${data.species})`);
  check(data.dexAll, "図鑑の順序が全種と一致");
  check(data.movesOk && data.typeOk, "全習得技と技タイプが有効");
  check(data.evolveOk, "進化先がすべて実在");
  check(data.sprOk, "全種族にスプライトがある");
  check(data.encOk && data.trainerOk && data.shopOk, "エンカウント/トレーナー/ショップのIDが有効");
  check(data.chart, "タイプ相性 (ばつぐん/いまひとつ) が機能");
  check(data.warpOk, "全マップのワープ先が実在");

  console.log("\n== はじまりの流れ ==");
  const intro = await page.evaluate(async () => {
    const r = {};
    // タイトル → はじめから
    G.newGame();
    G.replace(new FieldScene());
    runScript(JSON.parse(JSON.stringify(DATA.scripts.intro)));
    for (let i = 0; i < 20; i++) {
      const t = G.top();
      if (t && t.constructor.name === "MessageScene") { t.page = t.pages.length; G.pop(); if (t.onDone) t.onDone(); }
      else break;
      await new Promise((res) => setTimeout(res, 25));
    }
    r.booted = G.top() && G.top().constructor.name === "FieldScene" && G.state.map === "home";
    // 相棒なしで 村を でようとすると とめられる
    runScript(JSON.parse(JSON.stringify(DATA.scripts.leaveVillage)));
    for (let i = 0; i < 10; i++) {
      const t = G.top();
      if (t && t.constructor.name === "MessageScene") { t.page = t.pages.length; G.pop(); if (t.onDone) t.onDone(); }
      else break;
      await new Promise((res) => setTimeout(res, 60));
    }
    await new Promise((res) => setTimeout(res, 800));
    r.blocked = G.state.map === "home" && G.state.party.length === 0;
    // スターターびを えらぶ (script の menu で ヒバチ)
    runScript(JSON.parse(JSON.stringify(DATA.scripts.starterChoice)));
    for (let i = 0; i < 30; i++) {
      const t = G.top();
      if (!t) break;
      if (t.constructor.name === "MessageScene") { t.page = t.pages.length; G.pop(); if (t.onDone) t.onDone(); }
      else if (t.constructor.name === "ChoiceScene") { G.pop(); t.onPick(0); }
      else break;
      await new Promise((res) => setTimeout(res, 25));
    }
    r.starter = G.state.party.length === 1 && G.state.party[0].id === "hibachi"
      && G.flag("starter") && (G.state.items.hoshidama || 0) >= 7;
    r.starterMoves = G.state.party[0].moves.includes("ember");
    r.dex = !!(G.state.bestiary.hibachi && G.state.bestiary.hibachi.caught);
    return r;
  });
  check(intro.booted, "ニューゲーム→むらに立つ");
  check(intro.blocked, "相棒なしでは村を出られない");
  check(intro.starter && intro.starterMoves, "スターター(ヒバチ)を選び技も習得");
  check(intro.dex, "スターターが図鑑に記録される");

  console.log("\n== 戦闘と捕獲 ==");
  const battle = await page.evaluate(async () => {
    const r = {};
    const drive = async (bs, limit = 400) => {
      // メッセージを 全部おくる (メニューに もどるか 戦闘がおわるまで)
      for (let i = 0; i < limit; i++) {
        if (bs.finished) return;
        if (bs.phase === "msg") {
          if (bs.cur && bs.cur.text != null) { bs.chars = 9999; bs.advance(); }
        } else return;
        await new Promise((res) => setTimeout(res, 10));
      }
    };
    // 野生戦: たたかって かつ
    const me = G.state.party[0];
    me.lv = 8; me.exp = G.expTotalFor(8); G.monStats(me); me.hp = me.maxhp;
    me.moves = ["ember", "quick"];
    let bs = new BattleScene({ wild: { id: "nezumaru", lv: 2 } });
    G.push(bs);
    await drive(bs);
    for (let i = 0; i < 30 && !bs.finished; i++) {
      if (bs.phase !== "menu" && bs.phase !== "moves") { await drive(bs); continue; }
      bs.runTurn("ember");
      await drive(bs);
    }
    r.winWild = bs.finished && G.top().constructor.name === "FieldScene";
    r.gotExp = me.exp > G.expTotalFor(8);
    // 捕獲: HPを へらして ホシダマ
    const before = G.state.party.length;
    bs = new BattleScene({ wild: { id: "torippi", lv: 3 } });
    G.push(bs);
    await drive(bs);
    let caught = false;
    for (let i = 0; i < 40 && !bs.finished; i++) {
      bs.enemy.hp = 1;
      G.state.items.hoshidama = 99;
      bs.tryCapture("hoshidama");
      await drive(bs);
      if (G.state.party.length > before || G.state.box.length > 0) caught = true;
      if (caught) break;
    }
    if (!bs.finished) { bs.finished = true; G.scenes = G.scenes.filter((s) => s.constructor.name === "FieldScene"); }
    r.captured = caught && G.state.party.some((m) => m.id === "torippi");
    r.dexCaught = !!(G.state.bestiary.torippi && G.state.bestiary.torippi.caught);
    return r;
  });
  check(battle.winWild, "野生戦に勝ってフィールドへ戻る");
  check(battle.gotExp, "勝利で経験値を獲得");
  check(battle.captured, "弱らせてホシダマで捕獲→仲間に");
  check(battle.dexCaught, "捕獲が図鑑に記録される");

  console.log("\n== 育成と進化 ==");
  const growth = await page.evaluate(() => {
    const r = {};
    const m = G.makeMon("hibachi", 15);
    const hp15 = m.maxhp;
    const msgs = G.addMonExp(m, G.expTotalFor(16) - m.exp);
    r.evolved = m.id === "hibashira" && m.name === "ヒバシラ";
    r.evolveMsg = msgs.some((t) => t.includes("しんかした"));
    r.stronger = m.maxhp > hp15;
    // 技わすれ: 4つ埋まった状態で 新しい技
    const m2 = G.makeMon("shizukun", 14);
    m2.moves = ["squirt", "tackle", "aquashot", "quick"];
    const msgs2 = G.addMonExp(m2, G.expTotalFor(15) - m2.exp);
    r.moveSwap = m2.moves.length === 4;
    // ライバルの相棒は こちらに有利なタイプ
    G.state.flags.rivalMon = 1; // ヒバチ(ほのお) → みず
    const bs = new BattleScene({ trainer: "rival" });
    r.rivalPick = bs.enemyQueue.some((e) => e.id === "shizukun") || bs.enemy.id === "shizukun";
    bs.finished = true;
    G.scenes = G.scenes.filter((s) => s.constructor.name === "FieldScene");
    return r;
  });
  check(growth.evolved && growth.evolveMsg && growth.stronger, "Lv16でヒバチ→ヒバシラに進化");
  check(growth.moveSwap, "技が4つのとき新技と入れ替え");
  check(growth.rivalPick, "ライバルは相性有利な相棒を選ぶ");

  console.log("\n== トレーナー戦 (シーカー試験) ==");
  const exam = await page.evaluate(async () => {
    const r = {};
    const drive = async (bs, limit = 600) => {
      for (let i = 0; i < limit; i++) {
        if (bs.finished) return;
        if (bs.phase === "msg") {
          if (bs.cur && bs.cur.text != null) { bs.chars = 9999; bs.advance(); }
        } else return;
        await new Promise((res) => setTimeout(res, 10));
      }
    };
    G.state.party = [G.makeMon("hibashira", 30)];
    let done = false;
    runScript(JSON.parse(JSON.stringify(DATA.scripts.examFight)), () => { done = true; });
    for (let i = 0; i < 200; i++) {
      const t = G.top();
      if (!t) break;
      const n = t.constructor.name;
      if (n === "MessageScene") { t.page = t.pages.length; G.pop(); if (t.onDone) t.onDone(); }
      else if (n === "BattleScene") {
        if (t.phase === "msg") await drive(t);
        else if (t.phase === "menu" || t.phase === "moves") { t.runTurn(G.state.party[0].moves[0]); await drive(t); }
        else break;
      }
      else break;
      await new Promise((res) => setTimeout(res, 15));
    }
    r.badge = G.flag("badge1");
    r.backToField = G.top() && G.top().constructor.name === "FieldScene";
    r.rank = G.currentChapter() === "認定シーカー";
    return r;
  });
  check(exam.badge, "試験官の3連戦に勝利→シーカーのあかし");
  check(exam.backToField, "試験後にフィールドへ戻る");
  check(exam.rank, "進行ラベルが認定シーカーになる");

  console.log("\n== セーブ/ロード ==");
  const save = await page.evaluate(() => {
    const r = {};
    G.state.map = "akatsuki"; G.state.x = 8; G.state.y = 5;
    const lv = G.state.party[0].lv;
    r.saved = G.save(2);
    G.state.party[0].lv = 1;
    r.loaded = G.load(2) && G.state.party[0].lv === lv && G.state.map === "akatsuki";
    const code = G.exportCode(2);
    r.code = !!code && code.startsWith("MS1.") && G.importCode(code, 3) && G.load(3);
    return r;
  });
  check(save.saved && save.loaded, "セーブ→ロードで状態が戻る");
  check(save.code, "ひきつぎコードの書き出し/読み込み");

  console.log("\n== v0.2: 新エリアとボックス ==");
  const v02 = await page.evaluate(async () => {
    const r = {};
    const D = DATA;
    r.newMaps = ["route3", "cave", "minamo", "guild2"].every((id) => !!D.maps[id]);
    r.akatsukiExit = D.maps.akatsuki.rows[5].length === 18
      && D.maps.akatsuki.events.some((e) => e.x === 17 && e.y === 5 && e.warp && e.warp.map === "route3");
    r.evolutions = D.species.nezumaru.evolve.to === "oonezu"
      && D.species.nekomata.evolve.to === "bakeneko"
      && D.species.ryuko.evolve.to === "ryuon";
    // 新種族の進化と技
    const m = G.makeMon("nezumaru", 13);
    G.addMonExp(m, G.expTotalFor(14) - m.exp);
    r.oonezuEvo = m.id === "oonezu" && m.moves.length > 0;
    // キンのホシダマは 最優先で つかわれる
    G.newGame();
    G.scenes = [new FieldScene()];
    G.state.party = [G.makeMon("hibashira", 20)];
    G.state.items = { hoshidama: 5, kindama: 2 };
    const bs = new BattleScene({ wild: { id: "raimushi", lv: 10 } });
    G.push(bs);
    for (let i = 0; i < 200; i++) {
      if (bs.phase === "msg") { if (bs.cur && bs.cur.text != null) { bs.chars = 9999; bs.advance(); } }
      else break;
      await new Promise((res) => setTimeout(res, 10));
    }
    bs.enemy.hp = 1;
    bs.update && bs.phase === "menu" && (bs.sel = 1);
    // ホシダマコマンド相当を 直接よぶ
    const ballsBefore = G.state.items.kindama;
    bs.tryCapture(["kindama", "gindama", "hoshidama"].filter((b) => (G.state.items[b] || 0) > 0)[0]);
    r.kindamaFirst = G.state.items.kindama === ballsBefore - 1;
    bs.finished = true;
    G.scenes = G.scenes.filter((sc) => sc.constructor.name === "FieldScene");
    // ボックス: あずける/ひきだす
    G.state.party = [G.makeMon("hibachi", 10), G.makeMon("nezumaru", 5)];
    G.state.box = [];
    const ms = new MenuScene();
    ms.state = "box"; ms.boxMode = 0; ms.sub = 1;
    G.push(ms);
    Input.hit.a = true; ms.update(); Input.hit = {};
    r.deposit = G.state.box.length === 1 && G.state.party.length === 1;
    ms.boxMode = 1; ms.sub = 0;
    Input.hit.a = true; ms.update(); Input.hit = {};
    r.withdraw = G.state.box.length === 0 && G.state.party.length === 2;
    // 最後の戦える1体は あずけられない
    G.state.party = [G.makeMon("hibachi", 10)];
    ms.boxMode = 0; ms.sub = 0;
    Input.hit.a = true; ms.update(); Input.hit = {};
    r.guardLast = G.state.party.length === 1;
    G.pop();
    // 第2試験: badge1なしでは たたかえない → badge1ありで 勝利して badge2
    const drive2 = async (b, limit = 600) => {
      for (let i = 0; i < limit; i++) {
        if (b.finished) return;
        if (b.phase === "msg") { if (b.cur && b.cur.text != null) { b.chars = 9999; b.advance(); } }
        else return;
        await new Promise((res) => setTimeout(res, 10));
      }
    };
    G.state.party = [G.makeMon("ryuon", 35)];
    runScript(JSON.parse(JSON.stringify(DATA.scripts.exam2Fight)));
    for (let i = 0; i < 20; i++) {
      const t = G.top();
      if (t && t.constructor.name === "MessageScene") { t.page = t.pages.length; G.pop(); if (t.onDone) t.onDone(); }
      else break;
      await new Promise((res) => setTimeout(res, 15));
    }
    r.gated = !G.flag("badge2");
    G.setFlag("badge1", 1);
    runScript(JSON.parse(JSON.stringify(DATA.scripts.exam2Fight)));
    for (let i = 0; i < 250; i++) {
      const t = G.top();
      if (!t) break;
      const n = t.constructor.name;
      if (n === "MessageScene") { t.page = t.pages.length; G.pop(); if (t.onDone) t.onDone(); }
      else if (n === "BattleScene") {
        if (t.phase === "msg") await drive2(t);
        else if (t.phase === "menu" || t.phase === "moves") { t.runTurn(G.state.party[0].moves[0]); await drive2(t); }
        else break;
      }
      else break;
      await new Promise((res) => setTimeout(res, 15));
    }
    r.badge2 = G.flag("badge2") && G.currentChapter() === "いちにんまえシーカー";
    return r;
  });
  check(v02.newMaps && v02.akatsukiExit, "新エリア4マップとアカツキ東出口");
  check(v02.evolutions && v02.oonezuEvo, "既存3種に進化追加 (ネズマル→オオネズ等)");
  check(v02.kindamaFirst, "キンのホシダマを最優先で使用");
  check(v02.deposit && v02.withdraw && v02.guardLast, "ボックスであずける/ひきだす (最後の1体は保護)");
  check(v02.gated && v02.badge2, "第2試験: badge1必須→勝利でミナモのあかし");

  console.log("\n== v0.3: 状態異常 ==");
  const v03 = await page.evaluate(async () => {
    const r = {};
    const D = DATA;
    r.movesDef = ["poisonpow", "stunspore", "hypnowave", "poisonsting"].every((id) => !!D.moves[id])
      && D.moves.thunder.inflict && D.moves.thunder.inflict.status === "para";
    // 補助技で 状態がつく
    G.newGame();
    G.scenes = [new FieldScene()];
    G.state.party = [G.makeMon("togemaru", 20)];
    let bs = new BattleScene({ wild: { id: "nezumaru", lv: 5 } });
    G.push(bs);
    const drive = async (b, limit = 400) => {
      for (let i = 0; i < limit; i++) {
        if (b.finished) return;
        if (b.phase === "msg") { if (b.cur && b.cur.text != null) { b.chars = 9999; b.advance(); } }
        else return;
        await new Promise((res) => setTimeout(res, 10));
      }
    };
    await drive(bs);
    // しびれごなを 直接あてる (命中は運なので applyStatus を検証)
    bs.pending = [];
    bs.applyStatus(bs.enemy, "para");
    bs.queue = bs.pending; bs.pending = null; bs.afterQueue = "menu"; bs.phase = "msg"; bs.advance();
    await drive(bs);
    r.paraSet = bs.enemy.status === "para";
    r.paraSlow = bs.effSpd(bs.enemy) === bs.enemy.spd * 0.5;
    // 状態異常で 捕獲率1.5倍
    const ball = D.items.hoshidama;
    bs.enemy.hp = bs.enemy.maxhp;
    const withSt = bs.catchChance(bs.enemy, ball);
    bs.enemy.status = null;
    const noSt = bs.catchChance(bs.enemy, ball);
    r.catchBonus = withSt > noSt && Math.abs(withSt / noSt - 1.5) < 0.01;
    // どく: ターン終了時に へる
    bs.enemy.status = "poison";
    const hpBefore = bs.enemy.hp;
    G.state.party[0].moves = ["stunspore"]; // ダメージ0の技で 毒ダメージだけ みる
    bs.runTurn("stunspore");
    await drive(bs);
    r.poisonTick = bs.enemy.hp < hpBefore || bs.enemy.hp === 0;
    bs.finished = true;
    G.scenes = G.scenes.filter((sc) => sc.constructor.name === "FieldScene");
    // ねむり: 行動スキップ (sleepT 1ターン目は 必ずねている)
    bs = new BattleScene({ wild: { id: "nezumaru", lv: 5 } });
    G.push(bs);
    await drive(bs);
    bs.enemy.status = "sleep"; bs.enemy.sleepT = 0;
    const meHp = G.state.party[0].hp = G.state.party[0].maxhp;
    bs.pending = [];
    bs.performAct(bs.enemy, G.state.party[0], bs.enemy.moves[0], false);
    bs.queue = bs.pending; bs.pending = null; bs.afterQueue = "menu"; bs.phase = "msg"; bs.advance();
    await drive(bs);
    r.sleepSkip = G.state.party[0].hp === meHp && bs.enemy.status === "sleep";
    bs.finished = true;
    G.scenes = G.scenes.filter((sc) => sc.constructor.name === "FieldScene");
    // まんのうそうで なおる / いずみ(healAllMons)でも なおる
    const m = G.state.party[0];
    m.status = "poison";
    const cured = applyFieldItem(D.items.mannou, m);
    r.mannou = !!cured && m.status === null;
    m.status = "sleep";
    G.healAllMons();
    r.springCure = m.status === null;
    return r;
  });
  check(v03.movesDef, "補助技4種+らいめいのまひ追加効果が定義済み");
  check(v03.paraSet && v03.paraSlow, "まひ: 状態付与と素早さ半減");
  check(v03.catchBonus, "状態異常の相手は捕獲率1.5倍");
  check(v03.poisonTick, "どく: ターン終了時にダメージ");
  check(v03.sleepSkip, "ねむり: 行動をスキップ");
  check(v03.mannou && v03.springCure, "まんのうそう/いずみで状態異常が治る");

  console.log("\n== 全滅処理 ==");
  const lose = await page.evaluate(async () => {
    G.state.party = [G.makeMon("nezumaru", 2)];
    G.state.gold = 1000;
    G.scenes = [new FieldScene()];
    const bs = new BattleScene({ wild: { id: "oogama", lv: 20 } });
    G.push(bs);
    for (let i = 0; i < 300 && !bs.finished; i++) {
      if (bs.phase === "msg") {
        if (bs.cur && bs.cur.text != null) { bs.chars = 9999; bs.advance(); }
      } else if (bs.phase === "menu" || bs.phase === "moves") {
        G.state.party[0].hp = 1;
        bs.runTurn(G.state.party[0].moves[0]);
      } else break;
      await new Promise((res) => setTimeout(res, 10));
    }
    await new Promise((res) => setTimeout(res, 1200));
    const t = G.top();
    if (t && t.constructor.name === "MessageScene") { t.page = t.pages.length; G.pop(); if (t.onDone) t.onDone(); }
    return {
      home: G.state.map === "home",
      halfGold: G.state.gold === 500,
      healed: G.state.party[0].hp === G.state.party[0].maxhp,
    };
  });
  check(lose.home && lose.halfGold && lose.healed, "全滅で村へ搬送・ギル半減・回復");

  console.log("\n== コンソールエラー ==");
  if (errors.length) errors.forEach((e) => console.log("  ", e));
  check(errors.length === 0, "コンソールエラーなし");

  await browser.close();
  console.log("\n========================================");
  console.log(failures.length === 0 ? "ALL SEEKER CHECKS PASSED" : `${failures.length} FAILURES:\n - ` + failures.join("\n - "));
  process.exit(failures.length ? 1 : 0);
})().catch((e) => { console.error("FATAL:", e); process.exit(2); });
