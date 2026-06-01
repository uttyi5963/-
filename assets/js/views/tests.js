// Tests view: question bank stats + mock test runner + drill modes.
import { el, escape, openModal, closeModal, toast } from '../ui.js';
import { Profile, Storage } from '../storage.js';
import { speakJa, canSpeak, isAutoPlayEnabled } from '../audio.js';
import { QUESTIONS, QTYPE_LABEL, buildMockTest } from '../data/tests.js';

const HISTORY_KEY = 'test-history';
const ACC_KEY = 'test-accuracy';

export function renderTests(root) {
  root.innerHTML = '';

  const history = Storage.get(HISTORY_KEY, []);
  const lastScore = history.length ? history[history.length - 1] : null;
  const bestScore = history.reduce((b, x) => x.acc > (b?.acc ?? -1) ? x : b, null);

  root.appendChild(el('div', { class: 'metrics' }, [
    metric('問題バンク', `${QUESTIONS.length}問`, `${Object.keys(QTYPE_LABEL).length} カテゴリー`),
    metric('受験回数', `${history.length}`, lastScore ? `直近 ${lastScore.acc}%` : '未受験'),
    metric('ベスト', `${bestScore?.acc ?? '—'}${bestScore ? '%' : ''}`, bestScore ? `${bestScore.date}` : '記録なし'),
    metric('合格目標', '60%', 'JLPT N4 合格基準目安'),
  ]));

  // Main test launcher
  const launcher = el('div', { class: 'section' }, [
    el('div', { class: 'section-head' }, [
      el('h2', {}, '模試・テスト'),
      el('span', { class: 'tag' }, 'N4 / JFT-Basic'),
    ]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'mock-grid' }, [
        mockCard('毎日ミニテスト', '5問', 'クイックチェック。約3分。',
          () => runTest(buildMockTest(5), 'daily-mini', { audio: false })),
        mockCard('月例模試', '12問', 'バランス出題。約8分。',
          () => runTest(buildMockTest(12), 'mock-monthly')),
        mockCard('本番形式', '24問', 'できるだけ全タイプ含む。約15分。',
          () => runTest(buildMockTest(Math.min(24, QUESTIONS.length)), 'mock-full')),
      ]),
      el('div', { style: 'margin-top:20px;' }, [
        bankRow('語彙', countByType(['kanji', 'vocab']), 200),
        bankRow('文法', countByType(['grammar']), 100, 'blue'),
        bankRow('聴解', countByType(['listening']), 50, 'yellow'),
        bankRow('読解', countByType(['reading']), 30, 'red'),
      ]),
    ]),
  ]);
  root.appendChild(launcher);

  // Drills
  const drills = el('div', { class: 'section', style: 'margin-top:14px;' }, [
    el('div', { class: 'section-head' }, [
      el('h2', {}, 'タイプ別ドリル'),
      el('span', { class: 'tag' }, '苦手強化'),
    ]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'mock-grid' }, Object.entries(QTYPE_LABEL).slice(0, 3).map(([t, label]) =>
        mockCard(label + 'ドリル', `${countByType([t])}問`, `${label}に絞って練習`,
          () => runTest(QUESTIONS.filter((q) => q.type === t).slice(0, 8), `drill-${t}`)),
      )),
    ]),
  ]);
  root.appendChild(drills);

  if (history.length > 0) {
    const histSec = el('div', { class: 'section', style: 'margin-top:14px;' }, [
      el('div', { class: 'section-head' }, [
        el('h2', {}, '受験履歴'),
        el('span', { class: 'tag' }, `${history.length}件`),
      ]),
      el('div', { class: 'section-body' }, [historyTable(history)]),
    ]);
    root.appendChild(histSec);
  }
}

function metric(label, value, delta) {
  return el('div', { class: 'metric' }, [
    el('div', { class: 'label' }, label),
    el('div', { class: 'value' }, value),
    el('div', { class: 'delta' }, delta),
  ]);
}

function mockCard(title, score, desc, onStart) {
  return el('div', { class: 'mock' }, [
    el('strong', {}, title),
    el('div', { class: 'score' }, score),
    el('p', { class: 'sub' }, desc),
    el('button', { class: 'primary', onclick: onStart }, '開始'),
  ]);
}

function bankRow(label, have, total, color = '') {
  const pctVal = Math.min(100, Math.round((have / total) * 100));
  return el('div', { class: 'progress-row' }, [
    el('div', { class: 'progress-label' }, [
      el('span', {}, `${label}問題バンク`),
      el('span', {}, `${have} / ${total}`),
    ]),
    el('div', { class: `bar ${color}` }, [el('span', { style: `width:${pctVal}%` })]),
  ]);
}

function countByType(types) {
  return QUESTIONS.filter((q) => types.includes(q.type)).length;
}

function historyTable(history) {
  const tbl = el('table');
  tbl.innerHTML = '<thead><tr><th>日付</th><th>セット</th><th>得点</th><th>判定</th></tr></thead>';
  const tb = el('tbody');
  history.slice().reverse().forEach((h) => {
    const tr = el('tr');
    tr.innerHTML = `<td>${escape(h.date)}</td><td>${escape(h.setLabel || h.set)}</td><td>${h.score}/${h.total} (${h.acc}%)</td><td><span class="status ${h.acc >= 60 ? 'good' : h.acc >= 40 ? 'warn' : 'risk'}">${h.acc >= 60 ? '合格圏' : h.acc >= 40 ? '要強化' : '基礎戻り'}</span></td>`;
    tb.appendChild(tr);
  });
  tbl.appendChild(tb);
  return tbl;
}

// ============== Test runner =================

export function runTest(questions, setLabel, opts = {}) {
  if (!questions || questions.length === 0) {
    toast('問題がありません');
    return;
  }
  const state = {
    questions,
    idx: 0,
    answers: [],
    setLabel,
    correctTotal: 0,
  };

  const body = el('div', { class: 'test-runner' });
  const progress = el('div', { class: 'test-progress' }, [
    el('span', {}, ''),
    el('div', { class: 'bar' }, [el('span', { style: 'width:0%' })]),
    el('span', {}, ''),
  ]);
  const qContainer = el('div', {});
  body.appendChild(progress);
  body.appendChild(qContainer);

  function renderQ() {
    const q = state.questions[state.idx];
    const total = state.questions.length;
    progress.children[0].textContent = `Q ${state.idx + 1} / ${total}`;
    progress.children[2].textContent = `${state.correctTotal}正解`;
    progress.children[1].children[0].style.width = `${Math.round((state.idx / total) * 100)}%`;
    qContainer.innerHTML = '';
    const card = el('div', { class: 'q-card' });
    card.appendChild(el('span', { class: 'qtype' }, QTYPE_LABEL[q.type] || q.type));
    if (q.passage) {
      card.appendChild(el('div', { style: 'background:#f8fafc; padding:12px; border-radius:8px; white-space:pre-wrap; font-size:14px; line-height:1.7; margin-bottom:12px;' }, q.passage));
    }
    const stem = el('div', { class: 'qstem' });
    if (q.type === 'listening') {
      const playBtn = el('button', { class: 'audio-btn', onclick: () => speakJa(q.stem) }, '🔊 音声を再生');
      stem.appendChild(playBtn);
      stem.appendChild(document.createTextNode(canSpeak() ? ' （何度でも再生できます）' : ' （この端末では音声非対応：テキストを表示）'));
      if (!canSpeak()) {
        stem.appendChild(el('div', { style: 'margin-top:8px;' }, q.stem));
      }
      // Auto-play once on render if supported and user has auto-play on.
      if (canSpeak() && opts.audio !== false && isAutoPlayEnabled()) speakJa(q.stem);
    } else if (q.type === 'grammar') {
      stem.innerHTML = escape(q.stem).replace('___', '<span class="blank"></span>');
    } else if (q.type === 'kanji' && q.target) {
      const idx = q.stem.indexOf(q.target);
      if (idx >= 0) {
        stem.appendChild(document.createTextNode(q.stem.slice(0, idx)));
        stem.appendChild(el('strong', { style: 'color:var(--brand-dark); border-bottom:2px solid var(--brand);' }, q.target));
        stem.appendChild(document.createTextNode(q.stem.slice(idx + q.target.length)));
      } else {
        stem.textContent = q.stem;
      }
    } else {
      stem.textContent = q.stem;
    }
    card.appendChild(stem);

    const optsEl = el('div', { class: 'options' });
    q.options.forEach((opt, i) => {
      const optBtn = el('button', { class: 'opt', onclick: () => pickAnswer(i, optBtn, optsEl, q, card) }, [
        el('span', { class: 'marker' }, String.fromCharCode(65 + i)),
        el('span', {}, opt),
      ]);
      optsEl.appendChild(optBtn);
    });
    card.appendChild(optsEl);
    qContainer.appendChild(card);
  }

  function pickAnswer(i, btn, optsEl, q, card) {
    if (state.answers[state.idx] !== undefined) return;
    state.answers[state.idx] = i;
    const correct = i === q.answer;
    if (correct) {
      state.correctTotal += 1;
      btn.classList.add('correct');
    } else {
      btn.classList.add('wrong');
      optsEl.children[q.answer].classList.add('correct');
    }
    optsEl.querySelectorAll('.opt').forEach((b) => b.disabled = true);
    if (q.explain) {
      card.appendChild(el('div', { class: 'explanation' }, [
        el('strong', {}, correct ? '正解！' : '解説'),
        document.createTextNode(q.explain),
      ]));
    }
    const next = el('button', { class: 'primary', style: 'margin-top:14px;', onclick: () => {
      state.idx += 1;
      if (state.idx >= state.questions.length) finish();
      else renderQ();
    } }, state.idx + 1 >= state.questions.length ? '結果を見る' : '次の問題 →');
    card.appendChild(next);
  }

  function finish() {
    const total = state.questions.length;
    const score = state.correctTotal;
    const acc = Math.round((score / total) * 100);
    const date = new Date().toISOString().slice(0, 10);
    const history = Storage.get(HISTORY_KEY, []);
    const setName = labelFor(setLabel);
    history.push({ date, set: setLabel, setLabel: setName, score, total, acc });
    Storage.set(HISTORY_KEY, history);
    // Track running accuracy used by pass-prediction heuristic.
    const accRun = Storage.get(ACC_KEY, 0.5);
    Storage.set(ACC_KEY, +(accRun * 0.6 + (score / total) * 0.4).toFixed(3));
    Profile.recordMinutes(Math.max(3, total));
    if (setLabel.startsWith('drill-listen')) Profile.markTaskDone('listening');
    if (setLabel.startsWith('drill-grammar')) Profile.markTaskDone('grammar');
    if (setLabel.startsWith('drill-reading')) Profile.markTaskDone('reading');
    Profile.addXp(score * 10);
    Profile.updatePassPredict();

    // Wrong-answer review.
    const wrongs = state.questions
      .map((q, i) => ({ q, i, picked: state.answers[i] }))
      .filter((x) => x.picked !== x.q.answer);

    const summary = el('div', {});
    summary.appendChild(el('div', { class: 'result-summary' }, [
      el('div', { class: 'label' }, '結果'),
      el('div', { class: 'big' }, `${score}/${total}`),
      el('div', { class: 'sub' }, `正答率 ${acc}% / XP +${score * 10}`),
      el('div', { class: 'sub' }, acc >= 60 ? '合格圏に到達！' : acc >= 40 ? '基礎は OK、間違いの復習を' : '弱点が多いので基礎へ戻りましょう'),
    ]));
    if (wrongs.length > 0) {
      summary.appendChild(el('h3', { style: 'margin: 14px 0 8px; font-size:15px;' }, '間違えた問題'));
      const list = el('div', { class: 'ai-list' });
      wrongs.forEach((w) => {
        list.appendChild(el('div', { class: 'ai-item warn' }, [
          el('strong', {}, `${QTYPE_LABEL[w.q.type]}：${w.q.stem.length > 60 ? w.q.stem.slice(0, 60) + '…' : w.q.stem}`),
          el('span', {}, `正解：${w.q.options[w.q.answer]} / ${w.q.explain || ''}`),
        ]));
      });
      summary.appendChild(list);
    }

    qContainer.innerHTML = '';
    qContainer.appendChild(summary);
    progress.style.display = 'none';
    const foot = document.getElementById('app-modal').querySelector('.modal-foot');
    foot.innerHTML = '';
    foot.appendChild(el('button', { class: 'ghost', onclick: () => { closeModal(); } }, '閉じる'));
    foot.appendChild(el('button', { class: 'primary', onclick: () => { closeModal(); runTest(buildMockTest(questions.length), setLabel, opts); } }, 'もう一度'));
  }

  openModal({
    title: labelFor(setLabel),
    body,
    footer: el('button', { class: 'ghost', onclick: closeModal }, '中断'),
    onClose: () => window.dispatchEvent(new CustomEvent('profile-changed')),
  });
  renderQ();
}

function labelFor(set) {
  switch (set) {
    case 'daily-mini': return '毎日ミニテスト';
    case 'mock-monthly': return '月例模試';
    case 'mock-full': return '本番形式模試';
    case 'drill-kanji': return '漢字読みドリル';
    case 'drill-vocab': return '語彙ドリル';
    case 'drill-grammar': return '文法ドリル';
    case 'drill-listening': return '聴解ドリル';
    case 'drill-reading': return '読解ドリル';
    default: return set;
  }
}
