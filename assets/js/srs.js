// Lightweight SM-2 style spaced repetition.
//   - quality: 0=Again, 1=Hard, 2=Good, 3=Easy
//   - state per item: { id, ef, reps, interval, due, lapses, seen }
import { Storage, TODAY } from './storage.js';

const ONE_DAY = 24 * 60 * 60 * 1000;

export class Deck {
  constructor(deckId) {
    this.deckId = deckId;
    this.key = `srs/${deckId}`;
    this.state = Storage.get(this.key, {});
  }

  ensure(id) {
    if (!this.state[id]) {
      this.state[id] = {
        id,
        ef: 2.5,
        reps: 0,
        interval: 0,
        due: TODAY(),
        lapses: 0,
        seen: 0,
      };
    }
    return this.state[id];
  }

  save() {
    Storage.set(this.key, this.state);
  }

  rate(id, quality) {
    const item = this.ensure(id);
    item.seen += 1;
    if (quality === 0) {
      item.lapses += 1;
      item.reps = 0;
      item.interval = 0;
      item.ef = Math.max(1.3, item.ef - 0.2);
    } else {
      item.reps += 1;
      if (item.reps === 1) item.interval = 1;
      else if (item.reps === 2) item.interval = quality >= 2 ? 3 : 2;
      else item.interval = Math.round(item.interval * item.ef);
      const factor = quality === 1 ? -0.15 : quality === 2 ? 0 : 0.15;
      item.ef = Math.max(1.3, item.ef + factor);
    }
    const d = new Date();
    d.setDate(d.getDate() + item.interval);
    item.due = d.toISOString().slice(0, 10);
    this.save();
    return item;
  }

  // Items whose due date is today or earlier.
  dueItems(ids) {
    const today = TODAY();
    return ids.filter((id) => {
      const it = this.state[id];
      return !it || it.due <= today;
    });
  }

  // Quick summary stats across a given pool of IDs.
  stats(ids) {
    const today = TODAY();
    let learned = 0, due = 0, fresh = 0, weak = 0;
    ids.forEach((id) => {
      const it = this.state[id];
      if (!it) { fresh += 1; return; }
      if (it.reps >= 3 && it.interval >= 7) learned += 1;
      if (it.due <= today) due += 1;
      if (it.lapses >= 2) weak += 1;
    });
    return { learned, due, fresh, weak, total: ids.length };
  }

  // Build a session: due first, then new, capped at `cap`.
  buildSession(ids, cap = 20) {
    const today = TODAY();
    const dueOnly = [];
    const fresh = [];
    ids.forEach((id) => {
      const it = this.state[id];
      if (!it) fresh.push(id);
      else if (it.due <= today) dueOnly.push(id);
    });
    // Sort due ones by oldest due date first.
    dueOnly.sort((a, b) => (this.state[a].due || '').localeCompare(this.state[b].due || ''));
    const session = [...dueOnly, ...fresh].slice(0, cap);
    return session;
  }

  reset() {
    this.state = {};
    this.save();
  }
}

// Friendly preview labels for SRS buttons.
export const SRS_LABELS = [
  { q: 0, label: 'Again', sub: '< 1 day', cls: 'again' },
  { q: 1, label: 'Hard',  sub: '~2 days', cls: 'hard'  },
  { q: 2, label: 'Good',  sub: '~4 days', cls: 'good'  },
  { q: 3, label: 'Easy',  sub: '~7+ days', cls: 'easy' },
];
