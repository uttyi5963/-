// Foundation view: kana grid + vocab decks (flashcards via SRS).
import { el, escape, openModal, closeModal, toast, pct } from '../ui.js';
import { Deck, SRS_LABELS } from '../srs.js';
import { Profile, Storage } from '../storage.js';
import { speakJa, canSpeak, isAutoPlayEnabled } from '../audio.js';
import { toIPA, moraDisplay } from '../phonetics.js';
import { KANA_DECKS } from '../data/kana.js';
import { VOCAB, VOCAB_DECKS, getDeckItems, findVocab } from '../data/vocab.js';

const VOCAB_DECK = new Deck('vocab');
const KANA_DECK = new Deck('kana');

export function renderFoundation(root) {
  const profile = Profile.load();
  const allIds = VOCAB.map((v) => v.id);
  const overall = VOCAB_DECK.stats(allIds);
  const kanaIds = KANA_DECKS.flatMap((d) => d.rows.map((r) => `kana:${d.id}:${r[0]}`));
  const kanaStats = KANA_DECK.stats(kanaIds);
  const weakIds = allIds.filter((id) => {
    const it = VOCAB_DECK.state[id];
    return it && it.lapses >= 1 && it.interval < 7;
  });

  root.innerHTML = '';
  root.appendChild(metrics(overall, kanaStats, weakIds.length));

  const grid = el('div', { class: 'grid-2' });

  // Left: vocab decks + active flashcards
  const leftSection = el('div', { class: 'section' }, [
    el('div', { class: 'section-head' }, [
      el('h2', {}, '単語デッキ'),
      el('span', { class: 'tag' }, 'Spaced Repetition'),
    ]),
    el('div', { class: 'section-body' }, [vocabDeckList()]),
  ]);

  // Right: kana grids + weak list
  const rightSection = el('div', { class: 'section' }, [
    el('div', { class: 'section-head' }, [
      el('h2', {}, 'かな進度'),
      el('span', { class: 'tag' }, 'ひらがな・カタカナ'),
    ]),
    el('div', { class: 'section-body' }, [kanaPanel()]),
  ]);

  grid.appendChild(leftSection);
  grid.appendChild(rightSection);
  root.appendChild(grid);

  // Weak words section.
  if (weakIds.length > 0) {
    root.appendChild(weakPanel(weakIds));
  }
}

function metrics(overall, kanaStats, weak) {
  const learnedPct = overall.total ? Math.round((overall.learned / overall.total) * 100) : 0;
  const kanaPct = kanaStats.total ? Math.round((kanaStats.learned / kanaStats.total) * 100) : 0;
  return el('div', { class: 'metrics' }, [
    metric('文字マスター', `${kanaPct}%`, `${kanaStats.learned} / ${kanaStats.total} 字`),
    metric('単語進度', `${overall.learned}`, `目標 1,500語 / 現在 ${overall.total}語掲載`),
    metric('要復習', `${overall.due}`, '今日のセッションに自動投入'),
    metric('苦手語', `${weak}`, '間違い2回以上の語'),
  ]);
}

function metric(label, value, delta) {
  return el('div', { class: 'metric' }, [
    el('div', { class: 'label' }, label),
    el('div', { class: 'value' }, value),
    el('div', { class: 'delta' }, delta),
  ]);
}

function vocabDeckList() {
  const wrap = el('div', { class: 'deck-list' });
  VOCAB_DECKS.forEach((deck) => {
    const items = getDeckItems(deck.id);
    const ids = items.map((i) => i.id);
    const s = VOCAB_DECK.stats(ids);
    const card = el('button', { class: 'deck', onclick: () => startVocabSession(deck) }, [
      el('strong', {}, deck.label),
      el('div', { class: 'desc' }, deck.desc),
      el('div', { class: 'stats' }, [
        el('span', { class: 'chip' }, `${s.total} 語`),
        s.due > 0 ? el('span', { class: 'chip due' }, `要復習 ${s.due}`) : null,
        s.learned > 0 ? el('span', { class: 'chip learned' }, `定着 ${s.learned}`) : null,
        s.fresh > 0 && s.due === 0 ? el('span', { class: 'chip new' }, `新規 ${s.fresh}`) : null,
      ].filter(Boolean)),
    ]);
    wrap.appendChild(card);
  });
  return wrap;
}

export function startVocabSession(deck, opts = {}) {
  const items = getDeckItems(deck.id);
  if (items.length === 0) {
    toast('このデッキは空です。');
    return;
  }
  const ids = items.map((i) => i.id);
  const sessionIds = VOCAB_DECK.buildSession(ids, opts.cap || 10);
  if (sessionIds.length === 0) {
    toast('今日の復習は完了しています！');
    return;
  }
  runVocabSession(deck, sessionIds);
}

export function startWeakSession() {
  const ids = VOCAB.map((v) => v.id).filter((id) => {
    const it = VOCAB_DECK.state[id];
    return it && it.lapses >= 1;
  });
  if (ids.length === 0) {
    toast('苦手リストは空です。');
    return;
  }
  runVocabSession({ id: 'weak', label: '苦手語' }, ids.slice(0, 12));
}

// Sessions used by the student dashboard "今日の課題".
export function startTodayVocabSession(cap = 10) {
  const ids = VOCAB.map((v) => v.id);
  const sessionIds = VOCAB_DECK.buildSession(ids, cap);
  if (sessionIds.length === 0) {
    toast('今日の単語は完了！明日また出題されます。');
    return;
  }
  runVocabSession({ id: 'today', label: '今日の単語' }, sessionIds);
}

function runVocabSession(deck, ids) {
  const state = { idx: 0, ids, flipped: false, deck, correct: 0, total: ids.length };
  const card = el('div', { class: 'flashcard' });
  const meta = el('div', { class: 'sub', style: 'margin-bottom: 12px; display: flex; justify-content: space-between;' });
  const srsButtons = el('div', { class: 'srs-buttons' });
  const flipBtn = el('button', { class: 'primary', style: 'width:100%;' }, '答えを見る');
  const body = el('div', {}, [meta, card, el('div', { style: 'height:14px;' }), flipBtn, el('div', { style: 'height:6px;' }), srsButtons]);

  function render() {
    if (state.idx >= state.ids.length) return finish();
    const word = findVocab(state.ids[state.idx]);
    state.flipped = false;
    meta.innerHTML = `<span>${state.idx + 1} / ${state.total}</span><span>${escape(deck.label)}</span>`;
    card.classList.remove('flipped');
    card.innerHTML = '';
    card.appendChild(el('div', { class: 'jp-main' }, word.jp));
    if (canSpeak()) {
      card.appendChild(el('button', { class: 'audio-btn', onclick: () => speakJa(word.reading) }, ['🔊 ', '発音を聞く']));
    }
    flipBtn.style.display = '';
    flipBtn.textContent = '答えを見る';
    srsButtons.innerHTML = '';
  }

  function reveal() {
    if (state.idx >= state.ids.length) return;
    const word = findVocab(state.ids[state.idx]);
    state.flipped = true;
    // Pronunciation panel: reading + romaji + IPA + mora
    const mora = moraDisplay(word.reading);
    const ipa = toIPA(word.reading);
    const pron = el('div', { class: 'pron-panel' }, [
      el('div', { class: 'pron-kana' }, word.reading),
      el('div', { class: 'pron-row' }, [
        el('span', { class: 'pron-chip romaji' }, word.romaji),
        el('span', { class: 'pron-chip ipa', title: 'IPA - 国際音声記号' }, `/${ipa}/`),
        el('span', { class: 'pron-chip mora', title: `${mora.count}拍` }, mora.text),
      ]),
    ]);
    card.appendChild(pron);
    card.appendChild(el('div', { class: 'meaning' }, `${word.en}`));
    if (word.ur) card.appendChild(el('div', { class: 'urdu' }, word.ur));
    if (word.example) {
      const exDiv = el('div', { class: 'example' }, [
        el('div', { style: 'display:flex; justify-content:space-between; align-items:center; gap:8px;' }, [
          el('span', {}, word.example.jp),
          canSpeak() ? el('button', { class: 'mini-audio', onclick: () => speakJa(word.example.jp), title: '例文を聞く' }, '🔊') : null,
        ].filter(Boolean)),
        el('small', {}, word.example.en),
      ]);
      card.appendChild(exDiv);
    }
    flipBtn.style.display = 'none';
    srsButtons.innerHTML = '';
    SRS_LABELS.forEach((b) => {
      srsButtons.appendChild(el('button', { class: b.cls, onclick: () => rate(b.q) }, [
        b.label,
        el('small', {}, b.sub),
      ]));
    });
    // Auto-play the word pronunciation on flip if enabled.
    if (isAutoPlayEnabled()) speakJa(word.reading);
  }

  function rate(q) {
    VOCAB_DECK.rate(state.ids[state.idx], q);
    if (q >= 2) {
      state.correct += 1;
      Profile.addXp(5);
    } else if (q === 1) {
      Profile.addXp(2);
    }
    state.idx += 1;
    render();
  }

  function finish() {
    Profile.recordMinutes(Math.max(2, Math.round(state.total * 0.4)));
    Profile.markTaskDone('vocab');
    Profile.updatePassPredict();
    const acc = Math.round((state.correct / state.total) * 100);
    body.innerHTML = '';
    body.appendChild(el('div', { class: 'result-summary' }, [
      el('div', { class: 'label' }, 'セッション完了'),
      el('div', { class: 'big' }, `${state.correct}/${state.total}`),
      el('div', { class: 'sub' }, `理解度 ${acc}% / XP +${state.correct * 5}`),
    ]));
    const close = el('button', { class: 'primary', onclick: () => { closeModal(); window.dispatchEvent(new CustomEvent('profile-changed')); } }, '閉じる');
    document.getElementById('app-modal').querySelector('.modal-foot').innerHTML = '';
    document.getElementById('app-modal').querySelector('.modal-foot').appendChild(close);
  }

  flipBtn.addEventListener('click', reveal);
  openModal({
    title: `${deck.label} を学習中`,
    body,
    footer: el('button', { class: 'ghost', onclick: closeModal }, '中断する'),
    onClose: () => window.dispatchEvent(new CustomEvent('profile-changed')),
  });
  render();
}

function kanaPanel() {
  const wrap = el('div', {});
  KANA_DECKS.forEach((deck) => {
    const ids = deck.rows.map((r) => `kana:${deck.id}:${r[0]}`);
    const s = KANA_DECK.stats(ids);
    wrap.appendChild(el('div', { style: 'display:flex; justify-content:space-between; align-items:center; margin: 14px 0 8px;' }, [
      el('strong', {}, deck.label),
      el('button', { class: 'ghost', style: 'padding:6px 10px; font-size:12px;', onclick: () => startKanaSession(deck) }, `練習 (${s.due || s.fresh})`),
    ]));
    const grid = el('div', { class: 'kana-grid' });
    deck.rows.forEach(([ch, ro]) => {
      const id = `kana:${deck.id}:${ch}`;
      const it = KANA_DECK.state[id];
      const cls = it && it.reps >= 3 ? 'kana-cell learned'
                : it && it.lapses >= 2 ? 'kana-cell weak'
                : 'kana-cell';
      grid.appendChild(el('button', {
        class: cls,
        title: ro,
        onclick: () => speakJa(ch),
      }, [
        el('div', { class: 'ch' }, ch),
        el('div', { class: 'ro' }, ro),
      ]));
    });
    wrap.appendChild(grid);
  });
  return wrap;
}

export function startKanaSession(deck) {
  const ids = deck.rows.map((r) => `kana:${deck.id}:${r[0]}`);
  const sessionIds = KANA_DECK.buildSession(ids, 12);
  if (sessionIds.length === 0) {
    toast('かなの復習は完了！');
    return;
  }
  const map = new Map(ids.map((id, i) => [id, deck.rows[i]]));
  runKanaSession(deck, sessionIds, map);
}

function runKanaSession(deck, ids, map) {
  const state = { idx: 0, ids, correct: 0, total: ids.length, choice: null };
  const card = el('div', { class: 'flashcard' });
  const opts = el('div', { class: 'options', style: 'margin-top:14px;' });
  const meta = el('div', { class: 'sub', style: 'margin-bottom: 12px; display: flex; justify-content: space-between;' });
  const body = el('div', {}, [meta, card, opts]);
  let nextBtn;

  function buildOptions(correct) {
    // 4-choice romaji quiz built from current deck.
    const pool = deck.rows.filter((r) => r[1] !== correct[1]).map((r) => r[1]);
    const distractors = [];
    while (distractors.length < 3 && pool.length > 0) {
      const idx = Math.floor(Math.random() * pool.length);
      distractors.push(pool.splice(idx, 1)[0]);
    }
    const all = [correct[1], ...distractors];
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all;
  }

  function render() {
    if (state.idx >= state.ids.length) return finish();
    const row = map.get(state.ids[state.idx]);
    state.choice = null;
    meta.innerHTML = `<span>${state.idx + 1} / ${state.total}</span><span>${escape(deck.label)}</span>`;
    card.innerHTML = '';
    card.appendChild(el('div', { class: 'jp-main' }, row[0]));
    if (canSpeak()) card.appendChild(el('button', { class: 'audio-btn', onclick: () => speakJa(row[0]) }, '🔊 音声'));
    opts.innerHTML = '';
    const choices = buildOptions(row);
    choices.forEach((ro) => {
      const btn = el('button', { class: 'opt', onclick: () => pick(btn, ro, row) }, [
        el('span', { class: 'marker' }, ''),
        el('span', {}, ro),
      ]);
      opts.appendChild(btn);
    });
  }

  function pick(btn, ro, row) {
    if (state.choice !== null) return;
    state.choice = ro;
    const correct = row[1];
    opts.querySelectorAll('.opt').forEach((b) => b.classList.add('disabled'));
    if (ro === correct) {
      btn.classList.add('correct');
      state.correct += 1;
      Profile.addXp(2);
      KANA_DECK.rate(state.ids[state.idx], 3);
    } else {
      btn.classList.add('wrong');
      KANA_DECK.rate(state.ids[state.idx], 0);
      opts.querySelectorAll('.opt').forEach((b) => {
        if (b.textContent.trim() === correct) b.classList.add('correct');
      });
    }
    setTimeout(() => { state.idx += 1; render(); }, 750);
  }

  function finish() {
    Profile.recordMinutes(4);
    Profile.markTaskDone('kana');
    const acc = Math.round((state.correct / state.total) * 100);
    body.innerHTML = '';
    body.appendChild(el('div', { class: 'result-summary' }, [
      el('div', { class: 'label' }, 'かな練習 完了'),
      el('div', { class: 'big' }, `${state.correct}/${state.total}`),
      el('div', { class: 'sub' }, `正答率 ${acc}% / XP +${state.correct * 2}`),
    ]));
    const close = el('button', { class: 'primary', onclick: () => { closeModal(); window.dispatchEvent(new CustomEvent('profile-changed')); } }, '閉じる');
    const foot = document.getElementById('app-modal').querySelector('.modal-foot');
    foot.innerHTML = '';
    foot.appendChild(close);
  }

  openModal({
    title: `${deck.label} クイック練習`,
    body,
    footer: el('button', { class: 'ghost', onclick: closeModal }, '中断'),
    onClose: () => window.dispatchEvent(new CustomEvent('profile-changed')),
  });
  render();
}

function weakPanel(weakIds) {
  const list = el('div', { class: 'ai-list' });
  weakIds.slice(0, 6).forEach((id) => {
    const w = findVocab(id);
    if (!w) return;
    list.appendChild(el('div', { class: 'ai-item warn' }, [
      el('strong', {}, `${w.jp} (${w.reading})`),
      el('span', {}, `${w.en}${w.ur ? ' / ' + w.ur : ''}`),
    ]));
  });
  return el('div', { class: 'section', style: 'margin-top:16px;' }, [
    el('div', { class: 'section-head' }, [
      el('h2', {}, '苦手リスト'),
      el('button', { class: 'primary', style: 'padding:6px 12px; font-size:12px;', onclick: () => startWeakSession() }, '苦手だけ復習'),
    ]),
    el('div', { class: 'section-body' }, [list]),
  ]);
}
