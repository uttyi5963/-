// app.js — クリニック人事評価システム本体
import {
  ROLES, ROLE_LABEL, CATEGORIES, RATER_WEIGHTS, RATER_LABEL, SCALE,
  DEFAULT_RANK_THRESHOLDS, buildDefaultCriteria, defaultPeriods,
  seedStaff, seedGoals,
} from './data.js';

const STORE_KEY = 'clinic-hr-v1';
const CAT_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label]));

/* ---------------- State ---------------- */
let state = load();

function freshState() {
  return {
    staff: seedStaff(),
    criteria: buildDefaultCriteria(),
    periods: defaultPeriods(),
    evaluations: [],
    goals: seedGoals(),
    settings: { rankThresholds: DEFAULT_RANK_THRESHOLDS, raterWeights: { ...RATER_WEIGHTS } },
    currentPeriodId: 'p-2026h1',
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return freshState();
    const s = JSON.parse(raw);
    // 後方互換: 不足フィールドを補う
    s.criteria = s.criteria || buildDefaultCriteria();
    s.settings = s.settings || { rankThresholds: DEFAULT_RANK_THRESHOLDS, raterWeights: { ...RATER_WEIGHTS } };
    s.settings.raterWeights = s.settings.raterWeights || { ...RATER_WEIGHTS };
    s.evaluations = s.evaluations || [];
    s.goals = s.goals || [];
    s.currentPeriodId = s.currentPeriodId || (s.periods[0] && s.periods[0].id);
    return s;
  } catch (e) {
    console.warn('load failed, using fresh', e);
    return freshState();
  }
}

function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

const uid = (p = 'id') => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

/* ---------------- Lookups & scoring ---------------- */
const staffById = (id) => state.staff.find((s) => s.id === id);
const periodById = (id) => state.periods.find((p) => p.id === id);
const criteriaFor = (roleKey) => state.criteria[roleKey] || [];

function getEval(staffId, periodId) {
  return state.evaluations.find((e) => e.staffId === staffId && e.periodId === periodId);
}

function ensureEval(staffId, periodId) {
  let e = getEval(staffId, periodId);
  if (!e) {
    e = {
      id: uid('ev'), staffId, periodId,
      self: { scores: {}, comment: '', submitted: false },
      primary: { scores: {}, comment: '', submitted: false },
      secondary: { scores: {}, comment: '', submitted: false },
    };
    state.evaluations.push(e);
  }
  return e;
}

// 1人の評価者分の加重平均（5点満点→%）。未入力項目は除外。
function raterScorePct(rater, roleKey) {
  const crit = criteriaFor(roleKey);
  let wsum = 0, acc = 0;
  for (const c of crit) {
    const v = rater.scores[c.id];
    if (v == null || v === '') continue;
    wsum += c.weight;
    acc += (Number(v) / 5) * c.weight;
  }
  if (wsum === 0) return null;
  return (acc / wsum) * 100;
}

// 目標(MBO)の達成% = 重み付き進捗
function goalScorePct(staffId, periodId) {
  const gs = state.goals.filter((g) => g.staffId === staffId && g.periodId === periodId);
  if (!gs.length) return null;
  const wsum = gs.reduce((a, g) => a + Number(g.weight || 0), 0);
  if (wsum === 0) return null;
  const acc = gs.reduce((a, g) => a + Number(g.progress || 0) * Number(g.weight || 0), 0);
  return acc / wsum;
}

// 総合スコア: 評価者合成(自己/1次/2次)を行い、MBOを業績へ反映
function overallScore(staffId, periodId) {
  const st = staffById(staffId);
  if (!st) return null;
  const e = getEval(staffId, periodId);
  if (!e) return null;
  const rw = state.settings.raterWeights;
  const parts = [];
  for (const key of ['self', 'primary', 'secondary']) {
    const pct = raterScorePct(e[key], st.role);
    if (pct != null) parts.push({ w: rw[key], pct });
  }
  if (!parts.length) return null;
  const wsum = parts.reduce((a, p) => a + p.w, 0);
  const evalPct = parts.reduce((a, p) => a + p.pct * p.w, 0) / wsum;

  // MBOを総合の20%として加味（目標未設定なら評価のみ）
  const gpct = goalScorePct(staffId, periodId);
  let total = evalPct;
  if (gpct != null) total = evalPct * 0.8 + gpct * 0.2;
  return total;
}

function rankFor(pct) {
  if (pct == null) return 'NA';
  for (const t of state.settings.rankThresholds) {
    if (pct >= t.min) return t.rank;
  }
  return 'D';
}

// 評価の入力状況
function evalStatus(staffId, periodId) {
  const e = getEval(staffId, periodId);
  if (!e) return 'todo';
  const subs = ['self', 'primary', 'secondary'].filter((k) => e[k].submitted).length;
  if (subs === 3) return 'done';
  if (subs > 0) return 'partial';
  // 一部入力でも未提出なら partial
  const anyScore = ['self', 'primary', 'secondary'].some((k) => Object.keys(e[k].scores).length);
  return anyScore ? 'partial' : 'todo';
}

const STATUS_LABEL = { done: '完了', partial: '進行中', todo: '未着手' };

/* ---------------- View routing ---------------- */
const VIEWS = [
  { id: 'dashboard', icon: '📊', label: 'ダッシュボード' },
  { id: 'staff', icon: '👥', label: '職員' },
  { id: 'evaluate', icon: '📝', label: '評価入力' },
  { id: 'goals', icon: '🎯', label: '目標管理' },
  { id: 'criteria', icon: '⚙️', label: '評価項目設定' },
  { id: 'report', icon: '📈', label: 'レポート' },
  { id: 'settings', icon: '🛠️', label: '設定' },
];

let activeView = 'dashboard';

function buildNav() {
  const nav = document.getElementById('navList');
  nav.innerHTML = '';
  for (const v of VIEWS) {
    const b = document.createElement('button');
    b.innerHTML = `<span class="ico">${v.icon}</span><span>${v.label}</span>`;
    b.onclick = () => go(v.id);
    b.dataset.view = v.id;
    nav.appendChild(b);
  }
}

function go(id) {
  activeView = id;
  document.querySelectorAll('#navList button').forEach((b) => b.classList.toggle('active', b.dataset.view === id));
  render();
}

const PAGE_META = {
  dashboard: ['ダッシュボード', '評価の進捗・スコア分布・職種別の状況を俯瞰します'],
  staff: ['職員管理', '職員の登録・編集と職種の管理'],
  evaluate: ['評価入力', '自己評価・1次評価・2次評価を入力します'],
  goals: ['目標管理（MBO）', '目標設定と達成度の管理。総合評価の20%に反映されます'],
  criteria: ['評価項目設定', '職種別の評価項目とウェイトを設定します'],
  report: ['レポート', '期の評価結果を集計・出力します'],
  settings: ['設定', '評価期間・評価者ウェイト・ランク閾値の管理'],
};

function render() {
  const [title, sub] = PAGE_META[activeView];
  document.getElementById('pageTitle').textContent = title;
  document.getElementById('pageSubtitle').textContent = sub;
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  const el = document.getElementById('view-' + activeView);
  el.classList.add('active');
  ({
    dashboard: renderDashboard, staff: renderStaff, evaluate: renderEvaluate,
    goals: renderGoals, criteria: renderCriteria, report: renderReport, settings: renderSettings,
  })[activeView](el);
  renderPeriodPill();
}

function renderPeriodPill() {
  const p = periodById(state.currentPeriodId);
  const sel = document.getElementById('periodSelect');
  sel.innerHTML = state.periods.map((pp) =>
    `<option value="${pp.id}" ${pp.id === state.currentPeriodId ? 'selected' : ''}>${esc(pp.name)}${pp.status === 'closed' ? '（締）' : ''}</option>`).join('');
}

/* ---------------- Helpers ---------------- */
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const fmtPct = (n) => (n == null ? '—' : `${n.toFixed(1)}%`);

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 1800);
}

/* ---------------- Dashboard ---------------- */
function renderDashboard(el) {
  const pid = state.currentPeriodId;
  const active = state.staff.filter((s) => s.active);
  const rows = active.map((s) => ({ s, pct: overallScore(s.id, pid), status: evalStatus(s.id, pid) }));
  const done = rows.filter((r) => r.status === 'done').length;
  const scored = rows.filter((r) => r.pct != null);
  const avg = scored.length ? scored.reduce((a, r) => a + r.pct, 0) / scored.length : null;

  // ランク分布
  const ranks = ['S', 'A', 'B', 'C', 'D'];
  const dist = Object.fromEntries(ranks.map((r) => [r, 0]));
  for (const r of rows) { const k = rankFor(r.pct); if (dist[k] != null) dist[k]++; }
  const maxD = Math.max(1, ...Object.values(dist));
  const rankColor = { S: '#7c3aed', A: '#2563eb', B: '#16a34a', C: '#d97706', D: '#dc2626' };

  // 職種別平均
  const byRole = {};
  for (const r of rows) {
    if (r.pct == null) continue;
    (byRole[r.s.role] ||= []).push(r.pct);
  }

  el.innerHTML = `
    <div class="grid kpis">
      <div class="card kpi"><div class="lbl">対象職員</div><div class="num">${active.length}</div><div class="sub muted">全 ${state.staff.length} 名</div></div>
      <div class="card kpi"><div class="lbl">評価完了</div><div class="num">${done}<span class="muted" style="font-size:16px">/${active.length}</span></div>
        <div class="sub"><div class="bar"><i style="width:${active.length ? (done / active.length * 100) : 0}%"></i></div></div></div>
      <div class="card kpi"><div class="lbl">平均総合スコア</div><div class="num">${avg == null ? '—' : avg.toFixed(1)}<span class="muted" style="font-size:16px">%</span></div>
        <div class="sub muted">確定 ${scored.length} 名の平均</div></div>
      <div class="card kpi"><div class="lbl">要フォロー (C/D)</div><div class="num">${dist.C + dist.D}</div><div class="sub muted">面談・育成対象</div></div>
    </div>

    <div class="grid" style="grid-template-columns: 1.2fr 1fr; margin-top:16px;">
      <div class="card">
        <h3>ランク分布</h3>
        <div class="dist">
          ${ranks.map((r) => `
            <div class="col">
              <div class="val">${dist[r]}</div>
              <div class="bar2" style="height:${dist[r] / maxD * 100}%; background:${rankColor[r]}"></div>
              <div class="cap"><span class="rank ${r}">${r}</span></div>
            </div>`).join('')}
        </div>
      </div>
      <div class="card">
        <h3>職種別 平均スコア</h3>
        ${Object.keys(byRole).length ? ROLES.filter((r) => byRole[r.key]).map((r) => {
          const arr = byRole[r.key]; const a = arr.reduce((x, y) => x + y, 0) / arr.length;
          return `<div style="margin-bottom:10px">
            <div class="barlabel"><span>${esc(r.label)} <span class="muted">(${arr.length})</span></span><span>${a.toFixed(1)}%</span></div>
            <div class="bar"><i style="width:${a}%"></i></div></div>`;
        }).join('') : '<div class="empty">確定したスコアがありません</div>'}
      </div>
    </div>

    <div class="section-title">職員別サマリー</div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>氏名</th><th>職種</th><th>部署</th><th class="num">総合</th><th>ランク</th><th>状況</th><th></th></tr></thead>
        <tbody>
          ${rows.map((r) => `
            <tr>
              <td>${esc(r.s.name)}</td>
              <td><span class="tag">${esc(ROLE_LABEL[r.s.role])}</span></td>
              <td class="muted">${esc(r.s.dept || '')}</td>
              <td class="num">${fmtPct(r.pct)}</td>
              <td><span class="rank ${rankFor(r.pct)}">${rankFor(r.pct)}</span></td>
              <td><span class="status ${r.status}">${STATUS_LABEL[r.status]}</span></td>
              <td class="right"><button class="btn sm" data-eval="${r.s.id}">評価する</button></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;

  el.querySelectorAll('[data-eval]').forEach((b) => b.onclick = () => openEvaluate(b.dataset.eval));
}

/* ---------------- Staff ---------------- */
function renderStaff(el) {
  el.innerHTML = `
    <div class="flex" style="margin-bottom:12px">
      <div class="muted small">登録職員 ${state.staff.length} 名</div>
      <div class="spacer"></div>
      <button class="primary" id="addStaff">＋ 職員を追加</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>氏名</th><th>職種</th><th>部署</th><th>入職日</th><th>勤続</th><th>状態</th><th></th></tr></thead>
        <tbody>
          ${state.staff.map((s) => `
            <tr>
              <td>${esc(s.name)}</td>
              <td><span class="tag">${esc(ROLE_LABEL[s.role] || s.role)}</span></td>
              <td class="muted">${esc(s.dept || '')}</td>
              <td class="muted">${esc(s.joinedAt || '')}</td>
              <td class="muted">${tenure(s.joinedAt)}</td>
              <td>${s.active ? '<span class="status done">在籍</span>' : '<span class="status todo">退職</span>'}</td>
              <td class="right">
                <button class="btn sm" data-edit="${s.id}">編集</button>
                <button class="btn sm danger" data-del="${s.id}">削除</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  el.querySelector('#addStaff').onclick = () => staffModal();
  el.querySelectorAll('[data-edit]').forEach((b) => b.onclick = () => staffModal(b.dataset.edit));
  el.querySelectorAll('[data-del]').forEach((b) => b.onclick = () => {
    const s = staffById(b.dataset.del);
    if (confirm(`${s.name} を削除しますか？（評価データも削除されます）`)) {
      state.staff = state.staff.filter((x) => x.id !== s.id);
      state.evaluations = state.evaluations.filter((e) => e.staffId !== s.id);
      state.goals = state.goals.filter((g) => g.staffId !== s.id);
      save(); render(); toast('削除しました');
    }
  });
}

function tenure(joined) {
  if (!joined) return '—';
  const d = new Date(joined); if (isNaN(d)) return '—';
  const now = new Date('2026-06-14');
  let m = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
  if (m < 0) return '—';
  return `${Math.floor(m / 12)}年${m % 12}か月`;
}

function staffModal(id) {
  const s = id ? staffById(id) : { name: '', role: 'nurse', dept: '', joinedAt: '', active: true };
  openModal(id ? '職員を編集' : '職員を追加', `
    <div><label class="field">氏名</label><input type="text" id="f-name" value="${esc(s.name)}" style="width:100%"></div>
    <div><label class="field">職種</label><select id="f-role" style="width:100%">
      ${ROLES.map((r) => `<option value="${r.key}" ${r.key === s.role ? 'selected' : ''}>${r.label}</option>`).join('')}
    </select></div>
    <div><label class="field">部署</label><input type="text" id="f-dept" value="${esc(s.dept || '')}" style="width:100%"></div>
    <div><label class="field">入職日</label><input type="date" id="f-joined" value="${esc(s.joinedAt || '')}"></div>
    <div><label class="field"><input type="checkbox" id="f-active" ${s.active ? 'checked' : ''}> 在籍中</label></div>
  `, () => {
    const name = document.getElementById('f-name').value.trim();
    if (!name) { toast('氏名を入力してください'); return false; }
    const data = {
      name, role: document.getElementById('f-role').value,
      dept: document.getElementById('f-dept').value.trim(),
      joinedAt: document.getElementById('f-joined').value,
      active: document.getElementById('f-active').checked,
    };
    if (id) Object.assign(s, data);
    else state.staff.push({ id: uid('s'), ...data });
    save(); render(); toast('保存しました');
    return true;
  });
}

/* ---------------- Evaluate ---------------- */
let evalTarget = { staffId: null, rater: 'primary' };

function openEvaluate(staffId) {
  evalTarget.staffId = staffId;
  go('evaluate');
}

function renderEvaluate(el) {
  const pid = state.currentPeriodId;
  const active = state.staff.filter((s) => s.active);
  if (!evalTarget.staffId || !staffById(evalTarget.staffId)) evalTarget.staffId = active[0] && active[0].id;
  const st = staffById(evalTarget.staffId);

  if (!st) { el.innerHTML = '<div class="empty">職員を登録してください</div>'; return; }
  if (periodById(pid)?.status === 'closed') {
    // 締め済みでも閲覧は可。入力欄は readonly にする。
  }

  const crit = criteriaFor(st.role);
  const e = ensureEval(st.id, pid);
  const rater = evalTarget.rater;
  const block = e[rater];
  const closed = periodById(pid)?.status === 'closed';

  const byCat = {};
  for (const c of crit) (byCat[c.category] ||= []).push(c);

  el.innerHTML = `
    <div class="card" style="margin-bottom:16px">
      <div class="flex wrap">
        <div>
          <label class="field">評価対象者</label>
          <select id="ev-staff">
            ${active.map((s) => `<option value="${s.id}" ${s.id === st.id ? 'selected' : ''}>${esc(s.name)}（${esc(ROLE_LABEL[s.role])}）</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="field">評価区分</label>
          <select id="ev-rater">
            ${['self', 'primary', 'secondary'].map((k) => `<option value="${k}" ${k === rater ? 'selected' : ''}>${RATER_LABEL[k]}（重み${Math.round(state.settings.raterWeights[k] * 100)}%）</option>`).join('')}
          </select>
        </div>
        <div class="spacer"></div>
        <div class="right">
          <label class="field">この区分の現スコア</label>
          <div style="font-size:22px;font-weight:700">${fmtPct(raterScorePct(block, st.role))}</div>
        </div>
      </div>
      ${closed ? '<div class="small" style="color:var(--warn);margin-top:8px">※ この期は締め済みのため閲覧のみです（設定で再オープン可）</div>' : ''}
    </div>

    <div class="card">
      ${CATEGORIES.map((cat) => {
        const list = byCat[cat.key] || [];
        if (!list.length) return '';
        const cw = list.reduce((a, c) => a + c.weight, 0);
        return `<div class="cat-block">
          <div class="cat-head"><span class="name">${cat.label}</span><span class="desc">${cat.desc}・ウェイト計 ${cw}</span></div>
          <table>
            <thead><tr><th>評価項目</th><th class="num">重み</th><th class="score-cell">評点</th></tr></thead>
            <tbody>
              ${list.map((c) => `
                <tr class="crit-row">
                  <td>${esc(c.name)}</td>
                  <td class="num muted">${c.weight}</td>
                  <td class="score-cell">
                    <select data-crit="${c.id}" ${closed ? 'disabled' : ''}>
                      <option value="">—</option>
                      ${SCALE.map((sc) => `<option value="${sc.v}" ${String(block.scores[c.id]) === String(sc.v) ? 'selected' : ''}>${sc.v}</option>`).join('')}
                    </select>
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>`;
      }).join('')}

      <div style="margin-top:8px">
        <label class="field">コメント・所見</label>
        <textarea id="ev-comment" ${closed ? 'disabled' : ''} placeholder="良かった点・改善点・次期への期待など">${esc(block.comment || '')}</textarea>
      </div>

      <div class="flex" style="margin-top:14px">
        <div class="small muted">提出状況：
          ${['self', 'primary', 'secondary'].map((k) => `${RATER_LABEL[k]}<b>${e[k].submitted ? '✓' : '—'}</b>`).join('　')}
        </div>
        <div class="spacer"></div>
        <button class="ghost" id="ev-save" ${closed ? 'disabled' : ''}>下書き保存</button>
        <button class="primary" id="ev-submit" ${closed ? 'disabled' : ''}>${block.submitted ? '再提出' : '提出'}</button>
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <h3>合成結果（自己/1次/2次 + MBO）</h3>
      ${evalSummaryHtml(st.id, pid)}
    </div>`;

  el.querySelector('#ev-staff').onchange = (ev) => { evalTarget.staffId = ev.target.value; render(); };
  el.querySelector('#ev-rater').onchange = (ev) => { evalTarget.rater = ev.target.value; render(); };

  const collect = () => {
    el.querySelectorAll('[data-crit]').forEach((sel) => {
      const v = sel.value;
      if (v === '') delete block.scores[sel.dataset.crit];
      else block.scores[sel.dataset.crit] = Number(v);
    });
    block.comment = el.querySelector('#ev-comment').value;
  };
  if (!closed) {
    el.querySelector('#ev-save').onclick = () => { collect(); save(); render(); toast('下書きを保存しました'); };
    el.querySelector('#ev-submit').onclick = () => { collect(); block.submitted = true; save(); render(); toast('提出しました'); };
  }
}

function evalSummaryHtml(staffId, pid) {
  const st = staffById(staffId);
  const e = getEval(staffId, pid);
  const rows = ['self', 'primary', 'secondary'].map((k) => {
    const pct = raterScorePct(e[k], st.role);
    return `<div class="barlabel"><span>${RATER_LABEL[k]} <span class="muted">×${Math.round(state.settings.raterWeights[k] * 100)}%</span> ${e[k].submitted ? '<span class="status done" style="margin-left:6px">提出</span>' : ''}</span><span>${fmtPct(pct)}</span></div>
      <div class="bar" style="margin-bottom:10px"><i style="width:${pct || 0}%"></i></div>`;
  }).join('');
  const gp = goalScorePct(staffId, pid);
  const ov = overallScore(staffId, pid);
  return `${rows}
    <div class="barlabel"><span>目標達成度（MBO）<span class="muted">総合の20%</span></span><span>${gp == null ? '未設定' : gp.toFixed(1) + '%'}</span></div>
    <div class="bar" style="margin-bottom:14px"><i style="width:${gp || 0}%"></i></div>
    <div class="flex" style="border-top:1px solid var(--line);padding-top:12px">
      <strong>総合スコア</strong><div class="spacer"></div>
      <span style="font-size:22px;font-weight:700">${fmtPct(ov)}</span>
      <span class="rank ${rankFor(ov)}" style="margin-left:10px">${rankFor(ov)}</span>
    </div>`;
}

/* ---------------- Goals (MBO) ---------------- */
function renderGoals(el) {
  const pid = state.currentPeriodId;
  const active = state.staff.filter((s) => s.active);
  el.innerHTML = `
    <div class="flex" style="margin-bottom:12px">
      <div class="muted small">期：${esc(periodById(pid)?.name || '')}</div>
      <div class="spacer"></div>
      <button class="primary" id="addGoal">＋ 目標を追加</button>
    </div>
    ${active.map((s) => {
      const gs = state.goals.filter((g) => g.staffId === s.id && g.periodId === pid);
      const gp = goalScorePct(s.id, pid);
      const wsum = gs.reduce((a, g) => a + Number(g.weight || 0), 0);
      return `<div class="card" style="margin-bottom:12px">
        <div class="flex">
          <strong>${esc(s.name)}</strong><span class="tag">${esc(ROLE_LABEL[s.role])}</span>
          <div class="spacer"></div>
          <span class="small ${wsum === 100 ? 'muted' : ''}" style="${wsum !== 100 ? 'color:var(--warn)' : ''}">重み合計 ${wsum}%</span>
          <span class="small">達成度 <b>${gp == null ? '—' : gp.toFixed(0) + '%'}</b></span>
        </div>
        ${gs.length ? `<table style="margin-top:8px"><thead><tr><th>目標</th><th class="num">重み</th><th style="width:160px">進捗</th><th></th></tr></thead><tbody>
          ${gs.map((g) => `<tr>
            <td>${esc(g.title)}</td>
            <td class="num">${g.weight}%</td>
            <td><div class="barlabel"><span></span><span>${g.progress}%</span></div><div class="bar"><i style="width:${g.progress}%"></i></div></td>
            <td class="right"><button class="btn sm" data-gedit="${g.id}">編集</button> <button class="btn sm danger" data-gdel="${g.id}">削除</button></td>
          </tr>`).join('')}
        </tbody></table>` : '<div class="muted small" style="margin-top:8px">この期の目標は未設定です</div>'}
      </div>`;
    }).join('')}`;
  el.querySelector('#addGoal').onclick = () => goalModal();
  el.querySelectorAll('[data-gedit]').forEach((b) => b.onclick = () => goalModal(b.dataset.gedit));
  el.querySelectorAll('[data-gdel]').forEach((b) => b.onclick = () => {
    state.goals = state.goals.filter((g) => g.id !== b.dataset.gdel); save(); render(); toast('削除しました');
  });
}

function goalModal(id) {
  const pid = state.currentPeriodId;
  const active = state.staff.filter((s) => s.active);
  const g = id ? state.goals.find((x) => x.id === id) : { staffId: active[0]?.id, periodId: pid, title: '', weight: 50, progress: 0 };
  openModal(id ? '目標を編集' : '目標を追加', `
    <div><label class="field">対象者</label><select id="g-staff" style="width:100%">
      ${active.map((s) => `<option value="${s.id}" ${s.id === g.staffId ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}</select></div>
    <div><label class="field">目標</label><textarea id="g-title">${esc(g.title)}</textarea></div>
    <div class="flex">
      <div style="flex:1"><label class="field">重み（%）</label><input type="number" id="g-weight" min="0" max="100" value="${g.weight}" style="width:100%"></div>
      <div style="flex:1"><label class="field">進捗（%）</label><input type="number" id="g-progress" min="0" max="100" value="${g.progress}" style="width:100%"></div>
    </div>
  `, () => {
    const title = document.getElementById('g-title').value.trim();
    if (!title) { toast('目標を入力してください'); return false; }
    const data = {
      staffId: document.getElementById('g-staff').value,
      periodId: pid, title,
      weight: clamp(+document.getElementById('g-weight').value, 0, 100),
      progress: clamp(+document.getElementById('g-progress').value, 0, 100),
    };
    if (id) Object.assign(g, data);
    else state.goals.push({ id: uid('g'), result: '', ...data });
    save(); render(); toast('保存しました');
    return true;
  });
}
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, Number(n) || 0));

/* ---------------- Criteria ---------------- */
let critRole = 'nurse';
function renderCriteria(el) {
  const crit = criteriaFor(critRole);
  const byCat = {};
  for (const c of crit) (byCat[c.category] ||= []).push(c);
  el.innerHTML = `
    <div class="flex wrap" style="margin-bottom:12px">
      <div><label class="field">職種</label>
        <select id="cr-role">${ROLES.map((r) => `<option value="${r.key}" ${r.key === critRole ? 'selected' : ''}>${r.label}</option>`).join('')}</select></div>
      <div class="spacer"></div>
      <button class="ghost" id="cr-reset">既定に戻す</button>
      <button class="primary" id="cr-add">＋ 項目を追加</button>
    </div>
    ${CATEGORIES.map((cat) => {
      const list = byCat[cat.key] || [];
      return `<div class="card" style="margin-bottom:12px">
        <h3>${cat.label}（${cat.desc}）</h3>
        ${list.length ? `<table><thead><tr><th>項目</th><th class="num">重み</th><th></th></tr></thead><tbody>
          ${list.map((c) => `<tr>
            <td>${esc(c.name)}</td>
            <td class="num">${c.weight}</td>
            <td class="right"><button class="btn sm" data-cedit="${c.id}">編集</button> <button class="btn sm danger" data-cdel="${c.id}">削除</button></td>
          </tr>`).join('')}
        </tbody></table>` : '<div class="muted small">項目なし</div>'}
      </div>`;
    }).join('')}`;
  el.querySelector('#cr-role').onchange = (e) => { critRole = e.target.value; render(); };
  el.querySelector('#cr-add').onclick = () => critModal();
  el.querySelector('#cr-reset').onclick = () => {
    if (confirm(`${ROLE_LABEL[critRole]} の評価項目を既定に戻しますか？`)) {
      import('./data.js').then((m) => { state.criteria[critRole] = m.defaultCriteriaForRole(critRole); save(); render(); toast('既定に戻しました'); });
    }
  };
  el.querySelectorAll('[data-cedit]').forEach((b) => b.onclick = () => critModal(b.dataset.cedit));
  el.querySelectorAll('[data-cdel]').forEach((b) => b.onclick = () => {
    state.criteria[critRole] = crit.filter((c) => c.id !== b.dataset.cdel); save(); render(); toast('削除しました');
  });
}

function critModal(id) {
  const list = criteriaFor(critRole);
  const c = id ? list.find((x) => x.id === id) : { name: '', category: 'competency', weight: 1 };
  openModal(id ? '評価項目を編集' : '評価項目を追加', `
    <div><label class="field">項目名</label><input type="text" id="c-name" value="${esc(c.name)}" style="width:100%"></div>
    <div><label class="field">カテゴリ</label><select id="c-cat" style="width:100%">
      ${CATEGORIES.map((x) => `<option value="${x.key}" ${x.key === c.category ? 'selected' : ''}>${x.label}</option>`).join('')}</select></div>
    <div><label class="field">重み（1〜5）</label><input type="number" id="c-weight" min="1" max="5" value="${c.weight}"></div>
  `, () => {
    const name = document.getElementById('c-name').value.trim();
    if (!name) { toast('項目名を入力してください'); return false; }
    const data = { name, category: document.getElementById('c-cat').value, weight: clamp(+document.getElementById('c-weight').value, 1, 5) };
    if (id) Object.assign(c, data);
    else list.push({ id: uid(critRole + '-c'), ...data });
    save(); render(); toast('保存しました');
    return true;
  });
}

/* ---------------- Report ---------------- */
function renderReport(el) {
  const pid = state.currentPeriodId;
  const rows = state.staff.filter((s) => s.active).map((s) => {
    const e = getEval(s.id, pid);
    return {
      s,
      self: e ? raterScorePct(e.self, s.role) : null,
      primary: e ? raterScorePct(e.primary, s.role) : null,
      secondary: e ? raterScorePct(e.secondary, s.role) : null,
      mbo: goalScorePct(s.id, pid),
      total: overallScore(s.id, pid),
      status: evalStatus(s.id, pid),
    };
  }).sort((a, b) => (b.total ?? -1) - (a.total ?? -1));

  el.innerHTML = `
    <div class="flex" style="margin-bottom:12px">
      <div class="muted small">期：${esc(periodById(pid)?.name || '')}・スコア降順</div>
      <div class="spacer"></div>
      <button class="ghost" id="rp-csv">CSVダウンロード</button>
      <button class="ghost" id="rp-print">印刷 / PDF</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>順位</th><th>氏名</th><th>職種</th>
          <th class="num">自己</th><th class="num">1次</th><th class="num">2次</th><th class="num">MBO</th>
          <th class="num">総合</th><th>ランク</th><th>状況</th></tr></thead>
        <tbody>
          ${rows.map((r, i) => `<tr>
            <td class="muted">${r.total == null ? '—' : i + 1}</td>
            <td>${esc(r.s.name)}</td>
            <td><span class="tag">${esc(ROLE_LABEL[r.s.role])}</span></td>
            <td class="num">${fmtPct(r.self)}</td>
            <td class="num">${fmtPct(r.primary)}</td>
            <td class="num">${fmtPct(r.secondary)}</td>
            <td class="num">${r.mbo == null ? '—' : r.mbo.toFixed(1) + '%'}</td>
            <td class="num"><b>${fmtPct(r.total)}</b></td>
            <td><span class="rank ${rankFor(r.total)}">${rankFor(r.total)}</span></td>
            <td><span class="status ${r.status}">${STATUS_LABEL[r.status]}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;

  el.querySelector('#rp-print').onclick = () => window.print();
  el.querySelector('#rp-csv').onclick = () => {
    const head = ['氏名', '職種', '部署', '自己評価', '1次評価', '2次評価', 'MBO', '総合', 'ランク', '状況'];
    const lines = [head.join(',')];
    for (const r of rows) {
      lines.push([
        r.s.name, ROLE_LABEL[r.s.role], r.s.dept || '',
        fmtN(r.self), fmtN(r.primary), fmtN(r.secondary), fmtN(r.mbo),
        fmtN(r.total), rankFor(r.total), STATUS_LABEL[r.status],
      ].map(csvCell).join(','));
    }
    downloadCSV(`評価レポート_${periodById(pid)?.name || pid}.csv`, lines.join('\r\n'));
    toast('CSVを書き出しました');
  };
}
const fmtN = (n) => (n == null ? '' : n.toFixed(1));
const csvCell = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
function downloadCSV(name, text) {
  const blob = new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/* ---------------- Settings ---------------- */
function renderSettings(el) {
  const rw = state.settings.raterWeights;
  el.innerHTML = `
    <div class="grid" style="grid-template-columns:1fr 1fr">
      <div class="card">
        <h3>評価期間</h3>
        <div class="table-wrap" style="box-shadow:none;border:0">
          <table><thead><tr><th>期</th><th>期間</th><th>状態</th><th></th></tr></thead><tbody>
            ${state.periods.map((p) => `<tr>
              <td>${esc(p.name)}</td>
              <td class="muted small">${esc(p.start)}〜${esc(p.end)}</td>
              <td><span class="status ${p.status === 'open' ? 'done' : 'todo'}">${p.status === 'open' ? '進行中' : '締め'}</span></td>
              <td class="right"><button class="btn sm" data-ptoggle="${p.id}">${p.status === 'open' ? '締める' : '再開'}</button>
              <button class="btn sm danger" data-pdel="${p.id}">削除</button></td>
            </tr>`).join('')}
          </tbody></table>
        </div>
        <button class="primary" id="addPeriod" style="margin-top:10px">＋ 期間を追加</button>
      </div>

      <div class="card">
        <h3>評価者ウェイト（合計100%）</h3>
        ${['self', 'primary', 'secondary'].map((k) => `
          <div style="margin-bottom:10px"><label class="field">${RATER_LABEL[k]}</label>
            <input type="number" min="0" max="100" id="rw-${k}" value="${Math.round(rw[k] * 100)}" style="width:120px"> %</div>`).join('')}
        <button class="ghost" id="rw-save">ウェイトを保存</button>

        <h3 style="margin-top:20px">ランク閾値（総合スコア%以上）</h3>
        ${state.settings.rankThresholds.filter((t) => t.rank !== 'D').map((t) => `
          <div style="margin-bottom:8px"><label class="field">ランク ${t.rank}</label>
            <input type="number" min="0" max="100" id="rk-${t.rank}" value="${t.min}" style="width:120px"> 以上</div>`).join('')}
        <div class="small muted" style="margin-bottom:8px">上記未満はランク D</div>
        <button class="ghost" id="rk-save">閾値を保存</button>
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <h3>データ管理</h3>
      <div class="flex wrap">
        <button class="ghost" id="exp-json">全データをエクスポート(JSON)</button>
        <button class="ghost" id="imp-json">インポート(JSON)</button>
        <input type="file" id="imp-file" accept="application/json" hidden>
        <button class="btn danger" id="reset-all">初期化（デモデータに戻す）</button>
      </div>
      <div class="small muted" style="margin-top:8px">データはこのブラウザの localStorage にのみ保存されます。</div>
    </div>`;

  el.querySelectorAll('[data-ptoggle]').forEach((b) => b.onclick = () => {
    const p = periodById(b.dataset.ptoggle); p.status = p.status === 'open' ? 'closed' : 'open'; save(); render();
  });
  el.querySelectorAll('[data-pdel]').forEach((b) => b.onclick = () => {
    if (state.periods.length <= 1) { toast('最低1つの期が必要です'); return; }
    if (confirm('この期を削除しますか？関連評価も削除されます')) {
      const id = b.dataset.pdel;
      state.periods = state.periods.filter((p) => p.id !== id);
      state.evaluations = state.evaluations.filter((e) => e.periodId !== id);
      state.goals = state.goals.filter((g) => g.periodId !== id);
      if (state.currentPeriodId === id) state.currentPeriodId = state.periods[0].id;
      save(); render();
    }
  });
  el.querySelector('#addPeriod').onclick = () => periodModal();
  el.querySelector('#rw-save').onclick = () => {
    const vals = ['self', 'primary', 'secondary'].map((k) => +document.getElementById('rw-' + k).value);
    const sum = vals.reduce((a, b) => a + b, 0);
    if (sum !== 100) { toast('合計が100%になるようにしてください（現在 ' + sum + '%）'); return; }
    state.settings.raterWeights = { self: vals[0] / 100, primary: vals[1] / 100, secondary: vals[2] / 100 };
    save(); render(); toast('保存しました');
  };
  el.querySelector('#rk-save').onclick = () => {
    for (const t of state.settings.rankThresholds) {
      if (t.rank === 'D') continue;
      t.min = clamp(+document.getElementById('rk-' + t.rank).value, 0, 100);
    }
    state.settings.rankThresholds.sort((a, b) => b.min - a.min);
    save(); render(); toast('保存しました');
  };
  el.querySelector('#exp-json').onclick = () => {
    downloadCSV('clinic-hr-data.json', JSON.stringify(state, null, 2));
  };
  el.querySelector('#imp-json').onclick = () => el.querySelector('#imp-file').click();
  el.querySelector('#imp-file').onchange = (ev) => {
    const f = ev.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { try { state = JSON.parse(r.result); save(); render(); toast('インポートしました'); } catch { toast('読み込みに失敗しました'); } };
    r.readAsText(f);
  };
  el.querySelector('#reset-all').onclick = () => {
    if (confirm('すべてのデータを初期化しますか？この操作は取り消せません。')) {
      state = freshState(); save(); render(); toast('初期化しました');
    }
  };
}

function periodModal() {
  openModal('評価期間を追加', `
    <div><label class="field">期の名称</label><input type="text" id="p-name" placeholder="例：2026年度 下期" style="width:100%"></div>
    <div class="flex">
      <div style="flex:1"><label class="field">開始日</label><input type="date" id="p-start" style="width:100%"></div>
      <div style="flex:1"><label class="field">終了日</label><input type="date" id="p-end" style="width:100%"></div>
    </div>
  `, () => {
    const name = document.getElementById('p-name').value.trim();
    if (!name) { toast('名称を入力してください'); return false; }
    state.periods.unshift({ id: uid('p'), name, start: document.getElementById('p-start').value, end: document.getElementById('p-end').value, status: 'open' });
    save(); render(); toast('追加しました');
    return true;
  });
}

/* ---------------- Modal ---------------- */
let modalSubmit = null;
function openModal(title, bodyHtml, onSubmit) {
  document.getElementById('modalTitle').textContent = title;
  document.querySelector('.modal-body').innerHTML = bodyHtml;
  modalSubmit = onSubmit;
  document.getElementById('app-modal').classList.add('show');
  const first = document.querySelector('.modal-body input, .modal-body textarea, .modal-body select');
  if (first) first.focus();
}
function closeModal() { document.getElementById('app-modal').classList.remove('show'); modalSubmit = null; }

/* ---------------- Boot ---------------- */
function boot() {
  buildNav();
  document.getElementById('periodSelect').onchange = (e) => { state.currentPeriodId = e.target.value; save(); render(); };
  document.querySelector('#app-modal .close').onclick = closeModal;
  document.getElementById('app-modal').addEventListener('click', (e) => { if (e.target.id === 'app-modal') closeModal(); });
  document.getElementById('modalSave').onclick = () => { if (modalSubmit && modalSubmit() !== false) closeModal(); };
  document.getElementById('modalCancel').onclick = closeModal;
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  go('dashboard');
}
boot();
