#!/usr/bin/env node
/*
 * 音程チェッカー 検証スクリプト(依存なし)
 *
 *   node test/check.mjs
 *
 * 1. ビルド産物(index.html)の3つのscriptブロックを連結して構文チェック
 * 2. $('id') で参照しているIDと id="..."/data-pane の突合
 * 3. データブロックの健全性(サンプル数・内蔵曲の形式)
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
let failed = 0;
const ok = msg => console.log('  ✓ ' + msg);
const ng = msg => { console.error('  ✗ ' + msg); failed++; };

/* ---- 1. 構文 ---- */
console.log('[1] 構文チェック');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (scripts.length !== 3) ng(`scriptブロックが3つではありません: ${scripts.length}`);
try {
  // 'use strict' はFunctionラップ内で意味が変わらないよう除去して連結
  new Function(scripts.join('\n').replace("'use strict';", ''));
  ok('3ブロック連結で構文エラーなし');
} catch (e) {
  ng('構文エラー: ' + e.message);
}

/* ---- 2. ID整合性 ---- */
console.log('[2] ID整合性');
const definedIds = new Set([...html.matchAll(/\bid="([\w-]+)"/g)].map(m => m[1]));
const referenced = new Set([...scripts[2].matchAll(/\$\('([\w-]+)'\)/g)].map(m => m[1]));
const missing = [...referenced].filter(id => !definedIds.has(id));
if (missing.length) ng('参照先IDが存在しません: ' + missing.join(', '));
else ok(`$() 参照 ${referenced.size}件すべてHTMLに存在`);
const panes = new Set([...html.matchAll(/data-pane="([\w-]+)"/g)].map(m => m[1]));
const missingPanes = [...panes].filter(id => !definedIds.has(id));
if (missingPanes.length) ng('data-pane参照先が存在しません: ' + missingPanes.join(', '));
else ok(`data-pane 参照 ${panes.size}件すべて存在`);

/* ---- 3. データブロック ---- */
console.log('[3] データブロック');
try {
  const sandbox = new Function(scripts[0] + '\n' + scripts[1] +
    '\nreturn {samples: VIOLIN_SAMPLE_B64, pieces: BUILTIN_PIECES};')();
  const nSamples = Object.keys(sandbox.samples).length;
  if (nSamples < 20) ng(`サンプル数が少なすぎます: ${nSamples}`);
  else ok(`バイオリンサンプル ${nSamples}個`);
  const badName = Object.keys(sandbox.samples).filter(k => !/^[A-G]\d$/.test(k));
  if (badName.length) ng('サンプル名の形式が不正: ' + badName.join(', '));
  else ok('サンプル名はすべて 音名+オクターブ 形式');
  for (const p of sandbox.pieces) {
    if (!p.id || !p.label || !Array.isArray(p.notesCompact)) { ng(`内蔵曲の形式不正: ${p.id || '(idなし)'}`); continue; }
    const badNote = p.notesCompact.find(t => !/^[A-G]$/.test(t[0]) || t[1] < 0 || t[1] > 8);
    if (badNote) { ng(`${p.id}: 不正な音符 ${JSON.stringify(badNote)}`); continue; }
    // バイオリン音域(G3=55〜F7=101)チェック。3oct音階(ヘ長調)がF7まで使う
    const BASE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
    const outOfRange = p.notesCompact.filter(t => {
      const midi = BASE[t[0]] + (t[2] || 0) + (t[1] + 1) * 12;
      return midi < 55 || midi > 101;
    }).length;
    if (outOfRange) ng(`${p.id}: 音域外(G3〜F7)の音が${outOfRange}個`);
    else ok(`内蔵曲 ${p.id} (${p.notesCompact.length}音) 音域OK`);
  }
} catch (e) {
  ng('データブロックの評価に失敗: ' + e.message);
}

console.log(failed ? `\nNG: ${failed}件の問題` : '\nすべてOK');
process.exit(failed ? 1 : 0);
