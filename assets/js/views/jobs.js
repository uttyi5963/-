// Jobs view — career strategy + per-industry vocab + AI conversation panel.
import { el, escape, openModal, closeModal, toast } from '../ui.js';
import { speakJa, canSpeak, createRecognizer } from '../audio.js';
import { Profile } from '../storage.js';
import { JOB_CATEGORIES, CHAT_SCENARIOS } from '../data/jobs.js';

let activeChat = null;

export function renderJobs(root, opts = {}) {
  root.innerHTML = '';

  // Phase strategy cards (always shown)
  const phaseCards = [
    { strong: 'Phase 1 検定合格',     desc: '全員共通でN4/JFT-Basicを優先。文字、語彙、文法、聴解、生活会話を固める。', phase: '0〜4か月目' },
    { strong: 'Phase 2 職種選択',     desc: '模試60〜70%を超えた学生から、適性・体力・家族事情・希望収入を見て業界を選ぶ。', phase: '4〜5か月目' },
    { strong: 'Phase 3 職種別日本語', desc: '安全指示、接客、報告、専門語彙、面接練習を追加。企業紹介用レポートにも接続する。', phase: '5〜6か月目以降' },
  ];
  root.appendChild(el('div', { class: 'section', style: 'margin-bottom:14px;' }, [
    el('div', { class: 'section-head' }, [el('h2', {}, '二段階モデル'), el('span', { class: 'tag' }, 'まず検定、次に職種')]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'language-grid' }, phaseCards.map((c) => el('div', { class: 'language-card' }, [
        el('strong', {}, c.strong),
        el('p', {}, c.desc),
        el('div', { class: 'phase' }, c.phase),
      ]))),
    ]),
  ]));

  // Industry tabs
  let selectedJob = JOB_CATEGORIES[0].id;
  const tabsEl = el('div', { class: 'tabs' });
  const detailEl = el('div', { class: 'job-grid' });
  function refreshTabs() {
    tabsEl.innerHTML = '';
    JOB_CATEGORIES.forEach((j) => {
      tabsEl.appendChild(el('button', { class: j.id === selectedJob ? 'active' : '', onclick: () => { selectedJob = j.id; refreshTabs(); refreshDetail(); } }, j.label));
    });
  }
  function refreshDetail() {
    detailEl.innerHTML = '';
    const job = JOB_CATEGORIES.find((j) => j.id === selectedJob);
    detailEl.appendChild(el('div', { class: 'job' }, [
      el('strong', {}, `${job.label}：適性と業務`),
      el('p', {}, `向く人：${job.fit}`),
      el('p', { style: 'margin-top:6px;' }, `主な業務：${job.tasks}`),
      el('div', { class: 'mini' }, `収入：${job.salary} / 継続：${job.stability} / ${job.extra}`),
    ]));
    detailEl.appendChild(el('div', { class: 'job' }, [
      el('strong', {}, `${job.label}：必須フレーズ`),
      el('div', { class: 'vocab-list' }, job.vocab.map((v) => el('div', { class: 'row' }, [
        el('span', { class: 'jp', onclick: () => speakJa(v.jp), style: 'cursor:pointer;' }, v.jp),
        el('span', { class: 'en' }, v.en),
      ]))),
    ]));
    detailEl.appendChild(el('div', { class: 'job' }, [
      el('strong', {}, '面接対策'),
      el('p', {}, '志望理由、自己紹介、日本で働きたい理由、家族説明、給料や残業の質問への答え方。'),
      el('div', { class: 'mini' }, '日本側が評価'),
    ]));
    detailEl.appendChild(el('div', { class: 'job' }, [
      el('strong', {}, '生活日本語'),
      el('p', {}, '役所、病院、銀行、交通、ごみ出し、相談窓口。失踪防止の観点でも重要。'),
      el('div', { class: 'mini' }, '全業種共通'),
    ]));
  }
  refreshTabs();
  refreshDetail();

  root.appendChild(el('div', { class: 'section', style: 'margin-bottom:14px;' }, [
    el('div', { class: 'section-head' }, [el('h2', {}, '業界別 適性と語彙'), el('span', { class: 'tag' }, 'タブで切替')]),
    el('div', { class: 'section-body' }, [tabsEl, detailEl]),
  ]));

  // AI conversation
  root.appendChild(chatSection());

  if (opts.chat) {
    const scenario = CHAT_SCENARIOS.find((s) => s.id === opts.chat);
    if (scenario) setTimeout(() => openChat(scenario), 50);
  }
}

function chatSection() {
  const grid = el('div', { class: 'mock-grid' });
  CHAT_SCENARIOS.forEach((s) => {
    grid.appendChild(el('div', { class: 'mock' }, [
      el('strong', {}, s.title),
      el('p', { class: 'sub', style: 'margin-top:6px;' }, s.description),
      el('button', { class: 'primary', style: 'margin-top:12px;', onclick: () => openChat(s) }, '会話する'),
    ]));
  });
  return el('div', { class: 'section' }, [
    el('div', { class: 'section-head' }, [el('h2', {}, 'AI会話シミュレーション'), el('span', { class: 'tag' }, '音声対応')]),
    el('div', { class: 'section-body' }, [
      el('p', { class: 'sub', style: 'margin-bottom:12px;' }, '相手の発言に対して、日本語で返事を書いて送信します。ヒントから選んでもOK。音声入力もサポート（対応ブラウザ）。'),
      grid,
    ]),
  ]);
}

function openChat(scenario) {
  const state = { history: [...scenario.seed], scenario, turn: 0 };
  const chat = el('div', { class: 'chat' });
  const input = el('input', { type: 'text', placeholder: '日本語で返事を入力…' });
  const sendBtn = el('button', { class: 'primary' }, '送信');
  const micBtn = el('button', { class: 'ghost', type: 'button' }, canSpeak() ? '🎤' : '🔇');
  const hints = el('div', { class: 'sub', style: 'margin-top:10px;' });

  function render() {
    chat.innerHTML = '';
    state.history.forEach((m) => {
      const row = el('div', { class: `chat-row ${m.from}` });
      const bubble = el('div', { class: `bubble ${m.from}` }, m.jp);
      if (m.romaji) bubble.appendChild(el('span', { class: 'romaji' }, m.romaji));
      row.appendChild(bubble);
      if (canSpeak()) {
        row.appendChild(el('button', { class: 'audio', onclick: () => speakJa(m.jp) }, '🔊'));
      }
      chat.appendChild(row);
    });
    chat.scrollTop = chat.scrollHeight;
    // Show hints relevant to this turn
    hints.innerHTML = 'ヒント： ';
    state.scenario.hints.slice(0, 3).forEach((h, i) => {
      const a = el('a', { href: '#', style: 'margin-right:10px;', onclick: (e) => { e.preventDefault(); input.value = h; input.focus(); } }, h);
      hints.appendChild(a);
    });
  }

  function send() {
    const text = input.value.trim();
    if (!text) return;
    state.history.push({ from: 'me', jp: text });
    input.value = '';
    state.turn += 1;
    // Auto reply from bot (heuristic)
    const reply = botReply(state);
    setTimeout(() => {
      state.history.push({ from: 'bot', jp: reply.jp, romaji: reply.romaji });
      if (canSpeak()) speakJa(reply.jp);
      render();
      if (state.turn >= 3) {
        setTimeout(() => {
          Profile.markTaskDone('chat');
          Profile.addXp(35);
          Profile.recordMinutes(6);
          window.dispatchEvent(new CustomEvent('profile-changed'));
          toast('会話セッション完了！ +35 XP');
        }, 400);
      }
    }, 350);
    render();
  }

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });

  // Speech recognition (optional)
  const rec = createRecognizer('ja-JP');
  if (rec) {
    micBtn.addEventListener('click', () => {
      try {
        rec.start();
        toast('話してください…');
      } catch (e) { /* already running */ }
    });
    rec.onresult = (e) => { input.value = e.results[0][0].transcript; };
    rec.onerror = () => toast('音声認識に失敗しました');
  } else {
    micBtn.disabled = true;
    micBtn.title = '音声入力非対応';
  }

  const inputRow = el('div', { class: 'chat-input' }, [
    el('div', { style: 'display:flex; gap:6px;' }, [input, micBtn]),
    sendBtn,
  ]);
  inputRow.style.gridTemplateColumns = '1fr auto';

  const body = el('div', {}, [chat, hints, inputRow]);
  openModal({
    title: `AI会話 — ${scenario.title}`,
    body,
    footer: el('button', { class: 'ghost', onclick: closeModal }, '終了'),
    onClose: () => window.dispatchEvent(new CustomEvent('profile-changed')),
  });
  render();
  input.focus();
}

// Very simple rule-based "AI" response based on scenario + content keywords.
function botReply(state) {
  const last = state.history[state.history.length - 1].jp;
  const lower = last.toLowerCase();
  const id = state.scenario.id;
  if (id === 'late') {
    if (state.turn === 1) return { jp: 'そうですか。何分ぐらい遅れますか？', romaji: 'Sou desu ka. Nanpun gurai okuremasu ka?' };
    if (state.turn === 2) return { jp: '了解しました。気をつけて来てください。', romaji: 'Ryoukai shimashita. Ki o tsukete kite kudasai.' };
    return { jp: 'はい、お疲れさまです。', romaji: 'Hai, otsukaresama desu.' };
  }
  if (id === 'sick') {
    if (state.turn === 1) return { jp: '大丈夫ですか？病院に行きましたか？', romaji: 'Daijoubu desu ka? Byouin ni ikimashita ka?' };
    if (state.turn === 2) return { jp: 'ゆっくり休んでください。お大事に。', romaji: 'Yukkuri yasunde kudasai. Odaijini.' };
    return { jp: 'はい、報告ありがとうございます。', romaji: 'Hai, houkoku arigatou gozaimasu.' };
  }
  if (id === 'order') {
    if (state.turn === 1) return { jp: 'かしこまりました。お飲み物はいかがですか？', romaji: 'Kashikomarimashita. O-nomimono wa ikaga desu ka?' };
    if (state.turn === 2) return { jp: 'はい、少々お待ちください。', romaji: 'Hai, shoushou omachi kudasai.' };
    return { jp: 'ご注文確認します。', romaji: 'Go-chuumon kakunin shimasu.' };
  }
  if (id === 'hospital') {
    if (state.turn === 1) return { jp: '保険証はお持ちですか？', romaji: 'Hokenshou wa o-mochi desu ka?' };
    if (state.turn === 2) return { jp: 'では、こちらの問診票にご記入ください。', romaji: 'Dewa, kochira no monshinhyou ni go-kinyuu kudasai.' };
    return { jp: 'お名前を呼ぶまでお待ちください。', romaji: 'O-namae o yobu made omachi kudasai.' };
  }
  return { jp: 'なるほど、わかりました。', romaji: 'Naruhodo, wakarimashita.' };
}
