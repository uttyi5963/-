#!/usr/bin/env node
/*
 * MusicXML → 内蔵曲コンパクト形式 変換+検証(依存なし)
 *
 *   node tools/xml2compact.mjs <file.musicxml> [--json]
 *
 * アプリ本体(src/app.js)のMusicXMLパーサと同じ規則で音符を抽出する:
 *   - 休符 / 装飾音 / 和音構成音(chord) / タイ後続(tie stop) を除外
 *   - 主声部(最多音数のvoice)のみ採用
 *   - dur: whole=0 half=1 quarter=2 eighth=3 16th=4 32nd=5
 *   - flags: 1=小節頭 2=スラー開始 4=スラー終了 8=付点 16/32/64=連桁begin/continue/end
 *
 * 検証レポート(音域G3–E7 / fifths / 音価分布 / 除外数)と、
 * 「同一グループ内の隣接同音」などスキャンミスの疑いがある箇所を出力する。
 * --json でコンパクト形式のJS配列リテラルだけを出力(pieces.data.jsへの貼り付け用)。
 */
import { readFileSync } from 'node:fs';

const file = process.argv[2];
const jsonOnly = process.argv.includes('--json');
if (!file) { console.error('usage: node tools/xml2compact.mjs <file.musicxml> [--json]'); process.exit(1); }
const xml = readFileSync(file, 'utf8');

const DURMAP = { 'whole': 0, 'half': 1, 'quarter': 2, 'eighth': 3, '16th': 4, '32nd': 5 };
const BASE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

const tag = (src, name) => { const m = src.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`)); return m ? m[1].trim() : null; };

/* 最初の <fifths> を調号として採用し、途中で変わっていないか確認 */
const allFifths = [...xml.matchAll(/<fifths>(-?\d+)<\/fifths>/g)].map(m => parseInt(m[1], 10));
const fifths = allFifths[0] ?? 0;

const raw = [];
const skipped = { rest: 0, grace: 0, chord: 0, tieStop: 0, noPitch: 0 };
const measures = [...xml.matchAll(/<measure[^>]*>([\s\S]*?)<\/measure>/g)];
for (const [, body] of measures) {
  let firstInMeasure = true;
  for (const [noteSrc] of body.matchAll(/<note[^>]*>[\s\S]*?<\/note>/g)) {
    if (/<rest\s*\/?>/.test(noteSrc)) { skipped.rest++; continue; }
    if (/<grace\s*\/?>/.test(noteSrc)) { skipped.grace++; continue; }
    if (/<chord\s*\/?>/.test(noteSrc)) { skipped.chord++; continue; }
    if (/<tie type="stop"/.test(noteSrc)) { skipped.tieStop++; continue; }
    const step = tag(noteSrc, 'step'), octave = parseInt(tag(noteSrc, 'octave'), 10);
    if (!step || isNaN(octave)) { skipped.noPitch++; continue; }
    const alter = parseInt(tag(noteSrc, 'alter') || '0', 10);
    const dur = DURMAP[tag(noteSrc, 'type')] ?? 2;
    let flags = 0;
    if (firstInMeasure) flags |= 1;
    firstInMeasure = false;
    for (const [, type] of noteSrc.matchAll(/<slur[^>]*type="(start|stop)"/g))
      flags |= type === 'start' ? 2 : 4;
    if (/<dot\s*\/?>/.test(noteSrc)) flags |= 8;
    const beam1 = noteSrc.match(/<beam number="1">([^<]+)<\/beam>/);
    if (beam1) {
      const b = beam1[1].trim();
      if (b === 'begin') flags |= 16;
      else if (b === 'continue') flags |= 32;
      else if (b === 'end') flags |= 64;
    }
    raw.push({ step, octave, alter, dur, flags, voice: tag(noteSrc, 'voice') || '' });
  }
}

/* 主声部のみ採用 */
const cnt = {};
raw.forEach(r => cnt[r.voice] = (cnt[r.voice] || 0) + 1);
const main = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0];
const dropped = raw.length - cnt[main];
const notes = raw.filter(r => r.voice === main);

const compact = notes.map(n => {
  const t = [n.step, n.octave];
  if (n.alter || n.dur !== 2 || n.flags) t.push(n.alter);
  if (n.dur !== 2 || n.flags) t.push(n.dur);
  if (n.flags) t.push(n.flags);
  return t;
});

if (jsonOnly) {
  console.log(JSON.stringify(compact));
  process.exit(0);
}

/* ---- 検証レポート ---- */
const midi = n => BASE[n.step] + n.alter + (n.octave + 1) * 12;
const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const nm = m => NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
const midis = notes.map(midi);
const lo = Math.min(...midis), hi = Math.max(...midis);
const below = midis.filter(m => m < 55).length, above = midis.filter(m => m > 100).length;
const durDist = {};
notes.forEach(n => { const k = ['全', '2分', '4分', '8分', '16分', '32分'][n.dur]; durDist[k] = (durDist[k] || 0) + 1; });

console.log(`ファイル: ${file}`);
console.log(`小節数: ${measures.length} / 採用音数: ${notes.length}${dropped ? ` (副声部${dropped}音を除外)` : ''}`);
console.log(`除外: 休符${skipped.rest} 装飾音${skipped.grace} 和音${skipped.chord} タイ後続${skipped.tieStop}`);
console.log(`調号 fifths: ${fifths}${allFifths.every(f => f === fifths) ? '' : ` ⚠️ 途中で変化: ${[...new Set(allFifths)].join(',')}`}`);
console.log(`音域: ${nm(lo)}〜${nm(hi)} ${below || above ? `⚠️ バイオリン音域(G3〜E7)外が ${below + above}音` : '(G3〜E7内 ✓)'}`);
console.log(`音価: ${Object.entries(durDist).map(([k, v]) => k + '=' + v).join(' ')}`);
console.log(`スラー: 開始${notes.filter(n => n.flags & 2).length} 終了${notes.filter(n => n.flags & 4).length}`);

/* ---- スキャンミスの疑い検出 ----
   連桁グループ(16分音符のまとまり)内で同じ音が隣接して繰り返される箇所は、
   アルペジオ練習曲では稀なので要確認として報告する。 */
const suspects = [];
for (let i = 1; i < notes.length; i++) {
  const a = notes[i - 1], b = notes[i];
  const sameBeamRun = (b.flags & (32 | 64)) && a.dur >= 3 && b.dur >= 3; // continue/end かつ8分以下
  if (sameBeamRun && midi(a) === midi(b))
    suspects.push(`音番号${i}〜${i + 1}: ${nm(midi(a))} が連桁グループ内で連続`);
}
if (suspects.length) {
  console.log(`\n⚠️ 要確認(紙の楽譜と照合してください):`);
  suspects.forEach(s => console.log('  - ' + s));
} else {
  console.log(`\n隣接同音の疑い: なし`);
}
