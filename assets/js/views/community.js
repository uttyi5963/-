// Community view: level track + leaderboard.
import { el } from '../ui.js';
import { Profile, levelInfo } from '../storage.js';

const LEVELS = [
  { rank: 1, name: 'Kana Starter',     desc: '文字・発音・あいさつ' },
  { rank: 2, name: 'N5 Builder',       desc: '基本文法と日常語彙' },
  { rank: 3, name: 'N4 Challenger',    desc: 'N4文法・読解・聴解' },
  { rank: 4, name: 'Test Ready',       desc: '模試80%以上' },
  { rank: 5, name: 'Japan Work Ready', desc: '職種別会話・面接' },
];

const PEERS = [
  { name: 'Ayesha K.',  xp: 1840 },
  { name: 'Bilal A.',   xp: 1620 },
  { name: 'Hamza R.',   xp: 1210 },
  { name: 'Maryam N.',  xp: 1040 },
  { name: 'Imran T.',   xp: 880 },
];

export function renderCommunity(root) {
  const p = Profile.load();
  const myLvl = levelInfo(p.xp);
  root.innerHTML = '';

  const grid = el('div', { class: 'grid-2' });
  // Level track
  const levelSection = el('div', { class: 'section' }, [
    el('div', { class: 'section-head' }, [el('h2', {}, 'ゲーム型レベル進行'), el('span', { class: 'tag' }, '学習継続')]),
    el('div', { class: 'section-body' }, [levelTrack(myLvl.level)]),
  ]);
  grid.appendChild(levelSection);

  // Leaderboard
  const board = el('div', { class: 'leader' });
  const me = { name: 'You', xp: p.xp };
  const all = [...PEERS, me].sort((a, b) => b.xp - a.xp);
  all.forEach((u) => {
    const isMe = u.name === 'You';
    board.appendChild(el('div', { class: 'leader-row' + (isMe ? ' me' : '') }, [
      el('span', { class: 'avatar' }, u.name.charAt(0)),
      el('strong', {}, u.name),
      el('span', {}, `${u.xp} XP`),
    ]));
  });
  const friendSection = el('div', { class: 'section' }, [
    el('div', { class: 'section-head' }, [el('h2', {}, 'コホート ランキング'), el('span', { class: 'tag' }, 'クラス内競争')]),
    el('div', { class: 'section-body friend-grid' }, [
      board,
      el('div', { class: 'ai-list' }, [
        el('div', { class: 'ai-item' }, [
          el('strong', {}, '友達機能は軽量実装'),
          el('span', {}, '最初はチャットなし。フォロー、順位、応援ボタンだけにして運用コストを抑える。'),
        ]),
        el('div', { class: 'ai-item warn' }, [
          el('strong', {}, '質問スレッドは第2段階'),
          el('span', {}, '教師対応コストが増えるため、有料プランまたはクラス単位で開始。'),
        ]),
      ]),
    ]),
  ]);
  grid.appendChild(friendSection);
  root.appendChild(grid);
}

function levelTrack(myRank) {
  const wrap = el('div', { class: 'level-track' });
  LEVELS.forEach((l) => {
    const cls = l.rank <= myRank ? 'level active' : 'level';
    wrap.appendChild(el('div', { class: cls }, [
      el('div', { class: 'rank' }, String(l.rank)),
      el('strong', {}, l.name),
      el('span', {}, l.desc),
    ]));
  });
  return wrap;
}
