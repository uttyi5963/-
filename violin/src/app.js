
'use strict';
/* ================= 音楽ユーティリティ ================= */
const SHARP=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const FLAT =['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
const JP={C:'ド',D:'レ',E:'ミ',F:'ファ',G:'ソ',A:'ラ',B:'シ'};
const LET={C:0,D:1,E:2,F:3,G:4,A:5,B:6};
function midiName(m, flat){
  const arr=flat?FLAT:SHARP;
  const pc=arr[((m%12)+12)%12];
  const oct=Math.floor(m/12)-1;
  const letter=pc[0];
  const acc=pc.length>1?(pc[1]==='#'?'♯':'♭'):'';
  return {en:pc+oct, jp:JP[letter]+acc, letter, acc};
}
function midiFreq(m,a4){return a4*Math.pow(2,(m-69)/12);}

const MAJ=[2,2,1,2,2,2,1];
const MELMIN_ASC=[2,1,2,2,2,2,1];
const NATMIN=[2,1,2,2,1,2,2];
function buildScale(root,oct,type){
  const ascSteps = type==='melmin'?MELMIN_ASC:MAJ;
  const asc=[root];
  for(let o=0;o<oct;o++) for(const s of ascSteps) asc.push(asc[asc.length-1]+s);
  let desc;
  if(type==='melmin'){
    const nat=[root];
    for(let o=0;o<oct;o++) for(const s of NATMIN) nat.push(nat[nat.length-1]+s);
    desc=nat.slice(0,-1).reverse();
  }else{
    desc=asc.slice(0,-1).reverse();
  }
  return asc.concat(desc);
}
const PRESETS=[
  {id:'ph_b3', label:'📖 ロ長調 3oct(音階ページ 1〜3段)', root:59,oct:3,type:'maj',fifths:5},
  {id:'ph_gm3',label:'📖 嬰ト短調(旋律) 3oct(同 4段目〜)', root:56,oct:3,type:'melmin',fifths:5},
  {id:'g2', label:'ト長調 2oct',        root:55,oct:2,type:'maj',fifths:1},
  {id:'d2', label:'ニ長調 2oct',        root:62,oct:2,type:'maj',fifths:2},
  {id:'a2', label:'イ長調 2oct',        root:57,oct:2,type:'maj',fifths:3},
  {id:'e2', label:'ホ長調 2oct',        root:64,oct:2,type:'maj',fifths:4},
  {id:'c2', label:'ハ長調 2oct',        root:60,oct:2,type:'maj',fifths:0},
  {id:'bb2',label:'変ロ長調 2oct',      root:58,oct:2,type:'maj',flat:true,fifths:-2},
  {id:'g3', label:'ト長調 3oct',        root:55,oct:3,type:'maj',fifths:1},
  {id:'a3', label:'イ長調 3oct',        root:57,oct:3,type:'maj',fifths:3},
  {id:'e3', label:'ホ長調 3oct',        root:64,oct:3,type:'maj',fifths:4},
  {id:'am2',label:'イ短調(旋律) 2oct',  root:57,oct:2,type:'melmin',fifths:0},
  {id:'em2',label:'ホ短調(旋律) 2oct',  root:64,oct:2,type:'melmin',fifths:1},
];
function parseCustom(text){
  const toks=text.trim().split(/[\s,、]+/).filter(Boolean);
  const out=[];
  for(const t of toks){
    const m=t.match(/^([A-Ga-g])([#♯b♭]?)(\d)$/);
    if(!m) return {error:t};
    const base={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1].toUpperCase()];
    const acc=(m[2]==='#'||m[2]==='♯')?1:(m[2]==='b'||m[2]==='♭')?-1:0;
    out.push(base+acc+(parseInt(m[3],10)+1)*12);
  }
  return {midis:out};
}

/* ================= 状態 ================= */
const STRICT={easy:{good:15,ok:35},std:{good:10,ok:25},hard:{good:6,ok:15}};
// 音をどれくらい保持したら「合った」と判定するか。
// スマホ用チューナーアプリの一般的な応答速度(数十〜100ms台)よりは長めに取っているが、
// これは誤検出(通過音・弓が乗る瞬間のノイズ)を防ぐための意図的な「確認時間」。
// ゆっくりした音階練習なら0.3〜0.45秒、速いパッセージの確認には0.15秒程度が扱いやすい。
const HOLD_PRESETS={fast:{ms:150,min:3},std:{ms:320,min:6},slow:{ms:450,min:8}};
const S={
  a4:442, strict:'std', holdSpeed:'std',
  presetId:'ph_b3', useCustom:false,
  imported:null, useImported:false,   // MusicXML読み込み
  mode:'practice',       // 'practice' | 'tuner'
  advMode:'pitch',       // 'pitch'=合ったら次へ | 'metro'=メトロノームで進む
  bpm:60,
  exLabel:'', notes:[],  // [{midi,en,jp,target}]
  idx:0, results:[],
  running:false,
  autoPlayNext:true,     // 次の音を自動で聞かせる
  streak:0,              // 連続○のかず
  score:0,               // 今回のスコア
  pmode:'through',       // 'through'=通し | 'master'=丁寧(区間マスター)
  segLen:8,              // 丁寧モード: 区間の音数
  passGrade:'ok',        // 丁寧モード: 合格ライン('ok'=✕なし | 'good'=すべて○)
  reps:2,                // 丁寧モード: 連続クリア回数
};
/* 丁寧モードの進行状態 */
const master={active:false, phase:'seg', segIdx:0, cleared:0, attempts:0,
              segs:[], full:null, fullLabel:''};
let audioCtx=null, analyser=null, timeBuf=null, byteBuf=null, mediaStream=null, wakeLock=null;
let toneCtx=null;   // 基準音再生専用(マイク許可なしで使える)
let previewIdx=-1, previewTimer=null, autoPlayTimer=null;
let noteHit=[];     // 楽譜キャンバス上の各音符のタップ判定位置
let hold=[], ignoreUntil=0, lastValidT=0;
let hist=[];            // ピッチ軌跡 {t, cents|null}
let pitchSmooth=[];
/* メトロノームモード用 */
let metroOn=false, metroAnchor=0, metroBeatMs=1000, metroStarts=[], metroSamples=[], nextClickTime=0, metroCounting=false;

/* ================= DOM ================= */
const $=id=>document.getElementById(id);
const screens={setup:$('setup'),practice:$('practice'),result:$('result')};
function show(name){for(const k in screens)screens[k].classList.toggle('hidden',k!==name);}

/* --- setup UI --- */
/* タブ切替 */
document.querySelectorAll('.tabbtn').forEach(b=>{
  b.onclick=()=>{
    document.querySelectorAll('.tabbtn').forEach(x=>x.classList.remove('sel'));
    b.classList.add('sel');
    document.querySelectorAll('.tabpane').forEach(p=>p.classList.add('hidden'));
    $(b.dataset.pane).classList.remove('hidden');
  };
});
function updateSelStatus(){
  if(S.useImported&&S.imported)return;   // 内蔵曲/ファイルは各ハンドラが✓付きで表示する
  let t;
  if(S.useCustom){t='選択中: ✏️ 自由入力';}
  else{const p=PRESETS.find(x=>x.id===S.presetId);t='選択中: 📖 '+p.label;}
  $('mxInfo').textContent=t;
  $('mxInfo').style.color='var(--amber)';
  $('mxRange').classList.add('hidden');
}
const chipsEl=$('presetChips');
PRESETS.forEach(p=>{
  const b=document.createElement('button');
  b.className='chip'+(p.id===S.presetId?' sel':'');
  b.textContent=p.label;
  b.onclick=()=>{S.presetId=p.id;S.useCustom=false;S.useImported=false;refreshChips();clearBuiltinSel();updateSelStatus();};
  b.dataset.id=p.id;
  chipsEl.appendChild(b);
});
function refreshChips(){
  chipsEl.querySelectorAll('.chip').forEach(c=>c.classList.toggle('sel',
    !S.useCustom&&!S.useImported&&c.dataset.id===S.presetId));
}
function clearBuiltinSel(){
  $('builtinChips').querySelectorAll('.refbtn').forEach(x=>x.classList.remove('playing'));
}
$('customNotes').addEventListener('input',()=>{
  S.useCustom=$('customNotes').value.trim().length>0;
  if(S.useCustom)S.useImported=false;
  refreshChips();
  if(S.useCustom)clearBuiltinSel();
  updateSelStatus();
});

/* ---- MusicXML / MXL 読み込み ---- */
$('mxBtn').onclick=()=>$('mxFile').click();
$('mxFile').addEventListener('change', async e=>{
  const f=e.target.files[0];
  if(!f)return;
  try{
    let xmlText;
    if(/\.mxl$/i.test(f.name)){
      const zip=await JSZip.loadAsync(await f.arrayBuffer());
      let root=null;
      const cont=zip.file('META-INF/container.xml');
      if(cont){
        const cdoc=new DOMParser().parseFromString(await cont.async('string'),'application/xml');
        const rf=cdoc.querySelector('rootfile');
        if(rf)root=rf.getAttribute('full-path');
      }
      if(!root){
        root=Object.keys(zip.files).find(k=>/\.(xml|musicxml)$/i.test(k)&&!k.startsWith('META-INF'));
      }
      if(!root)throw new Error('MXL内に楽譜XMLが見つかりません');
      xmlText=await zip.file(root).async('string');
    }else{
      xmlText=await f.text();
    }
    const doc=new DOMParser().parseFromString(xmlText,'application/xml');
    if(doc.querySelector('parsererror'))throw new Error('XMLの解析に失敗しました');
    const title=(doc.querySelector('work-title')||doc.querySelector('movement-title'))?.textContent.trim();
    const part=doc.querySelector('part');
    if(!part)throw new Error('パートが見つかりません(score-partwise形式のみ対応)');
    const fifths=parseInt(part.querySelector('measure attributes fifths')?.textContent||'0',10)||0;
    const DURMAP={'whole':0,'half':1,'quarter':2,'eighth':3,'16th':4,'32nd':5};
    const raw=[];
    part.querySelectorAll('measure').forEach(measure=>{
      let firstInMeasure=true;
      measure.querySelectorAll('note').forEach(n=>{
        if(n.querySelector('rest')||n.querySelector('grace')||n.querySelector('chord'))return;
        const ties=[...n.querySelectorAll('tie')].map(t=>t.getAttribute('type'));
        if(ties.includes('stop'))return;             // タイの後続は1音にまとめる
        const p=n.querySelector('pitch');
        if(!p)return;
        const step=p.querySelector('step')?.textContent.trim();
        const octave=parseInt(p.querySelector('octave')?.textContent,10);
        const alter=parseInt(p.querySelector('alter')?.textContent||'0',10);
        if(!step||isNaN(octave))return;
        const dur=DURMAP[n.querySelector('type')?.textContent?.trim()]??2;
        let flags=0;
        if(firstInMeasure)flags|=1;
        firstInMeasure=false;
        n.querySelectorAll('notations slur').forEach(sl=>{
          if(sl.getAttribute('type')==='start')flags|=2;
          else if(sl.getAttribute('type')==='stop')flags|=4;
        });
        if(n.querySelector('dot'))flags|=8;
        n.querySelectorAll('beam').forEach(bm=>{
          if(bm.getAttribute('number')==='1'){
            const t=(bm.textContent||'').trim();
            if(t==='begin')flags|=16;
            else if(t==='continue')flags|=32;
            else if(t==='end')flags|=64;
          }
        });
        raw.push({step,alter,octave,dur,flags,voice:n.querySelector('voice')?.textContent.trim()||''});
      });
    });
    if(raw.length===0)throw new Error('音符が見つかりませんでした');
    // スキャンノイズ対策: 一番音数の多い声部だけを採用
    const cnt={};raw.forEach(r=>cnt[r.voice]=(cnt[r.voice]||0)+1);
    const main=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])[0];
    const dropped=raw.length-cnt[main];
    const arr=raw.filter(r=>r.voice===main).map(({step,alter,octave,dur,flags})=>({step,alter,octave,dur,flags}));
    let note=dropped>0?'(副声部'+dropped+'音を除外)':'';
    if(arr.length>600){arr.length=600;note+='(長いため最初の600音まで)';}
    S.imported={label:(title||f.name.replace(/\.[^.]+$/,''))+note, arr, fifths};
    S.useImported=true;S.useCustom=false;refreshChips();clearBuiltinSel();
    $('mxFrom').value=1;$('mxTo').value=arr.length;$('mxTo').max=arr.length;
    $('mxRange').classList.remove('hidden');
    $('mxInfo').textContent='✓ 「'+S.imported.label+'」 '+arr.length+'音を読み込みました。範囲を指定して「練習をはじめる」を押してください。';
    $('mxInfo').style.color='var(--good)';
  }catch(err){
    $('mxInfo').textContent='読み込めませんでした: '+err.message;
    $('mxInfo').style.color='var(--bad)';
  }
  e.target.value='';
});
function importedToNotes(arr){
  const ACCJP={'-2':'𝄫','-1':'♭','0':'','1':'♯','2':'𝄪'};
  const ACCEN={'-2':'bb','-1':'b','0':'','1':'#','2':'x'};
  return arr.map(o=>{
    const base={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[o.step];
    const midi=base+o.alter+(o.octave+1)*12;
    const f=o.flags||0;
    return {midi,
      en:o.step+ACCEN[String(o.alter)]+o.octave,
      jp:JP[o.step]+ACCJP[String(o.alter)],
      acc:ACCJP[String(o.alter)],
      alt:o.alter,
      d:o.octave*7+LET[o.step],
      dur:(o.dur===undefined?2:o.dur),   // 0=全,1=2分,2=4分,3=8分,4=16分,5=32分
      dot:!!(f&8), ms:!!(f&1), ss:!!(f&2), se:!!(f&4),
      bb:!!(f&16), bc:!!(f&32), be:!!(f&64),
      target:0};
  });
}
/* 内蔵曲データ([step,octave,alter,dur,flags])を展開 */
function expandCompact(compact){
  return compact.map(t=>({step:t[0], octave:t[1], alter:t[2]||0, dur:(t[3]===undefined?2:t[3]), flags:t[4]||0}));
}
function segInit(el,key,isInt){
  el.querySelectorAll('button').forEach(b=>{
    b.onclick=()=>{
      el.querySelectorAll('button').forEach(x=>x.classList.remove('sel'));
      b.classList.add('sel');
      S[key]= (isInt||key==='a4')?parseInt(b.dataset.v,10):b.dataset.v;
      if(key==='a4')renderRefRow();
    };
  });
}
segInit($('a4Seg'),'a4');
segInit($('strictSeg'),'strict');
segInit($('holdSeg'),'holdSpeed');
segInit($('segLenSeg'),'segLen',true);
segInit($('repsSeg'),'reps',true);
segInit($('passSeg'),'passGrade');
/* 練習モード(通し/丁寧) */
$('pmodeSeg').querySelectorAll('button').forEach(b=>{
  b.onclick=()=>{
    $('pmodeSeg').querySelectorAll('button').forEach(x=>x.classList.remove('sel'));
    b.classList.add('sel');
    S.pmode=b.dataset.v;
    const on=S.pmode==='master';
    $('masterOpts').classList.toggle('hidden',!on);
    $('masterOpts2').classList.toggle('hidden',!on);
    $('masterHint').classList.toggle('hidden',!on);
  };
});
/* 進み方(合ったら次へ/メトロノーム) */
$('advSeg').querySelectorAll('button').forEach(b=>{
  b.onclick=()=>{
    $('advSeg').querySelectorAll('button').forEach(x=>x.classList.remove('sel'));
    b.classList.add('sel');
    S.advMode=b.dataset.v;
    const isMetro=S.advMode==='metro';
    $('bpmBox').classList.toggle('hidden',!isMetro);
    $('metroHint').classList.toggle('hidden',!isMetro);
  };
});
$('bpmInput').addEventListener('change',()=>{
  let v=parseInt($('bpmInput').value,10)||60;
  v=Math.max(30,Math.min(160,v));
  $('bpmInput').value=v;
  S.bpm=v;
});
$('autoPlaySeg').querySelectorAll('button').forEach(b=>{
  b.onclick=()=>{
    $('autoPlaySeg').querySelectorAll('button').forEach(x=>x.classList.remove('sel'));
    b.classList.add('sel');
    S.autoPlayNext=(b.dataset.v==='on');
  };
});

/* ---- 開放弦の基準音ボタン ---- */
const OPEN_STRINGS=[{jp:'G線',midi:55},{jp:'D線',midi:62},{jp:'A線',midi:69},{jp:'E線',midi:76}];
function renderRefRow(){
  const row=$('refRow');row.innerHTML='';
  OPEN_STRINGS.forEach(s=>{
    const freq=midiFreq(s.midi,S.a4);
    const nm=midiName(s.midi,false);
    const b=document.createElement('button');
    b.className='refbtn';
    b.innerHTML='<span class="ic"></span>'+s.jp+'('+nm.en+') '+freq.toFixed(1)+'Hz';
    b.onclick=()=>{playReferenceTone(freq,1.8);refBtnFeedback(b);};
    row.appendChild(b);
  });
}
renderRefRow();

/* ---- 内蔵の楽曲(Claudeが読み取り・検証済みのMusicXML由来) ---- */
function renderBuiltinChips(){
  const row=$('builtinChips');row.innerHTML='';
  (typeof BUILTIN_PIECES!=='undefined'?BUILTIN_PIECES:[]).forEach(piece=>{
    const b=document.createElement('button');
    b.className='refbtn';
    b.innerHTML='<span class="ic"></span>'+piece.label+' ('+piece.notesCompact.length+'音)';
    b.onclick=()=>{
      const arr=expandCompact(piece.notesCompact);
      S.imported={label:piece.label, arr, fifths:piece.fifths||0};
      S.useImported=true; S.useCustom=false; refreshChips();
      $('mxFrom').value=1; $('mxTo').value=arr.length; $('mxTo').max=arr.length;
      $('mxRange').classList.remove('hidden');
      $('mxInfo').textContent='✓ 内蔵曲「'+piece.label+'」'+arr.length+'音を選択しました。範囲を指定して「練習をはじめる」を押してください。';
      $('mxInfo').style.color='var(--good)';
      row.querySelectorAll('.refbtn').forEach(x=>x.classList.remove('playing'));
      b.classList.add('playing');
    };
    row.appendChild(b);
  });
}
renderBuiltinChips();

/* ---- 練習画面: 現在の目標音を聴くボタン ---- */
$('playTargetBtn').onclick=()=>{
  if(S.mode!=='practice'||!S.notes[S.idx])return;
  playReferenceTone(S.notes[S.idx].target,1.4);
  refBtnFeedback($('playTargetBtn'));
  flashPreview(S.idx);
};

/* ================= 課題の構築 ================= */
function buildExercise(){
  if(S.useImported&&S.imported){
    const N=S.imported.arr.length;
    let from=parseInt($('mxFrom').value,10)||1;
    let to=parseInt($('mxTo').value,10)||N;
    from=Math.max(1,Math.min(from,N));to=Math.max(from,Math.min(to,N));
    const slice=S.imported.arr.slice(from-1,to);
    S.notes=importedToNotes(slice);
    S.notes.forEach(n=>n.target=midiFreq(n.midi,S.a4));
    S.exFifths=S.imported.fifths||0;
    const low=S.notes.filter(n=>n.midi<55).length;
    if(low>0&&!confirm('バイオリンの最低音(G3)より低い音が'+low+'音あります。スキャンの読み取りミスの可能性があります。そのまま続けますか?'))return false;
    S.exLabel=S.imported.label+((from>1||to<N)?' ['+from+'〜'+to+'音]':'');
    S.idx=0;S.results=[];
    computeSlurPairs();
    return true;
  }
  let midis, label, flat=false, fifths=0;
  if(S.useCustom){
    const r=parseCustom($('customNotes').value);
    if(r.error){alert('読み取れない音名があります: '+r.error+'\n例: E4 F#4 Bb3 のように入力してください');return false;}
    if(r.midis.length===0){alert('音名を入力してください');return false;}
    midis=r.midis; label='カスタム ('+midis.length+'音)';
  }else{
    const p=PRESETS.find(x=>x.id===S.presetId);
    midis=buildScale(p.root,p.oct,p.type); label=p.label; flat=!!p.flat; fifths=p.fifths||0;
  }
  const ACC2ALT={'♯':1,'♭':-1,'':0};
  S.notes=midis.map(m=>{
    const n=midiName(m,flat);
    const oct=Math.floor(m/12)-1;
    return {midi:m,en:n.en,jp:n.jp,acc:n.acc,
            alt:ACC2ALT[n.acc]||0,
            d:oct*7+LET[n.letter],       // E4=30 を基準にした五線譜上の段位置
            dur:2, dot:false, ms:false, ss:false, se:false, bb:false, bc:false, be:false,
            target:midiFreq(m,S.a4)};
  });
  S.exFifths=fifths;
  S.exLabel=label; S.idx=0; S.results=[];
  computeSlurPairs();
  return true;
}

/* ================= オーディオ ================= */
async function initAudio(){
  if(audioCtx){await audioCtx.resume();return true;}
  if(!window.isSecureContext||!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){
    $('micErr').innerHTML='この開き方ではマイクを使えません。<br>ブラウザのセキュリティ上、マイクは <b>https:// のURL</b>で開いたページでしか動きません(アプリ内プレビューやファイル直接開きでは不可)。NetlifyなどでこのファイルをWebに公開し、そのURLをSafari/Chromeで開いてください。';
    $('micErr').classList.remove('hidden');
    return false;
  }
  try{
    mediaStream=await navigator.mediaDevices.getUserMedia({audio:{
      echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
  }catch(e){
    $('micErr').innerHTML='マイクの許可が得られませんでした。<br>・ブラウザに出る「マイクを許可」を押す<br>・iPhoneは 設定 → Safari(またはChrome)→ マイク を「確認」か「許可」に<br>・それでも出ない場合は一度ページを再読み込みしてください。';
    $('micErr').classList.remove('hidden');
    return false;
  }
  audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  const src=audioCtx.createMediaStreamSource(mediaStream);
  analyser=audioCtx.createAnalyser();
  analyser.fftSize=2048;
  src.connect(analyser);
  timeBuf=new Float32Array(analyser.fftSize);
  byteBuf=new Uint8Array(analyser.fftSize);
  await audioCtx.resume();
  try{if('wakeLock' in navigator)wakeLock=await navigator.wakeLock.request('screen');}catch(e){}
  return true;
}
function readTimeData(){
  if(analyser.getFloatTimeDomainData){analyser.getFloatTimeDomainData(timeBuf);}
  else{
    analyser.getByteTimeDomainData(byteBuf);
    for(let i=0;i<byteBuf.length;i++)timeBuf[i]=(byteBuf[i]-128)/128;
  }
  return timeBuf;
}

/* ---- 基準音再生(マイク許可なしで使える、独立したAudioContext) ---- */
function ensureToneCtx(){
  if(!toneCtx){
    toneCtx=new (window.AudioContext||window.webkitAudioContext)();
    loadViolinSamples(toneCtx);   // 初回生成時にバックグラウンドで読み込み開始
  }
  if(toneCtx.state==='suspended')toneCtx.resume();
  return toneCtx;
}
/* 再生音の共通出口: ブースト(約+7.5dB)+コンプレッサーで、音割れさせずに大きく鳴らす。
   iPadのスピーカーでは素の音量が小さすぎるという要望への対応。 */
let toneMaster=null;
function toneOut(ctx){
  if(!toneMaster||toneMaster.ctx!==ctx){
    const comp=ctx.createDynamicsCompressor();
    comp.threshold.value=-12;comp.knee.value=8;comp.ratio.value=12;
    comp.attack.value=0.002;comp.release.value=0.15;
    const g=ctx.createGain();g.gain.value=2.4;
    g.connect(comp);comp.connect(ctx.destination);
    toneMaster={ctx,input:g};
  }
  return toneMaster.input;
}

/* ---- 実録音サンプル(バイオリン、FluidR3_GMサウンドフォント由来)によるマルチサンプル再生 ---- */
const VIOLIN_NOTE_LIST=Object.keys(typeof VIOLIN_SAMPLE_B64!=='undefined'?VIOLIN_SAMPLE_B64:{});
let violinBuffers={}, violinLoadPromise=null;
function noteNameToMidi(nm){
  const m=nm.match(/^([A-G])(\d)$/);
  const base={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]];
  return base+(parseInt(m[2],10)+1)*12;
}
function loadViolinSamples(ctx){
  if(violinLoadPromise)return violinLoadPromise;
  if(typeof VIOLIN_SAMPLE_B64==='undefined'){violinLoadPromise=Promise.resolve();return violinLoadPromise;}
  violinLoadPromise=(async()=>{
    for(const nm of VIOLIN_NOTE_LIST){
      try{
        const bin=atob(VIOLIN_SAMPLE_B64[nm]);
        const bytes=new Uint8Array(bin.length);
        for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
        violinBuffers[nm]=await ctx.decodeAudioData(bytes.buffer.slice(0));
      }catch(e){ /* この音だけ諦めて続行 */ }
    }
  })();
  return violinLoadPromise;
}
function nearestSampleNote(freq){
  let best=null,bd=Infinity;
  for(const nm of VIOLIN_NOTE_LIST){
    if(!violinBuffers[nm])continue;
    const f=440*Math.pow(2,(noteNameToMidi(nm)-69)/12);
    const d=Math.abs(Math.log2(f/freq));
    if(d<bd){bd=d;best=nm;}
  }
  return best;
}
function playSampledTone(ctx,buffer,sampleMidi,targetFreq,dur){
  const sampleFreq=440*Math.pow(2,(sampleMidi-69)/12);
  const rate=targetFreq/sampleFreq;
  const t0=ctx.currentTime+0.02;
  const src=ctx.createBufferSource();
  src.buffer=buffer;src.playbackRate.value=rate;
  const g=ctx.createGain();g.gain.value=0;
  src.connect(g);g.connect(toneOut(ctx));
  const peak=0.62,sustain=0.48;
  g.gain.setValueAtTime(0,t0);
  g.gain.linearRampToValueAtTime(peak,t0+0.05);
  g.gain.linearRampToValueAtTime(sustain,t0+Math.min(dur*0.6,1.1));
  g.gain.linearRampToValueAtTime(0,t0+dur);
  src.start(t0);
  src.stop(t0+dur+0.08);
}
async function playReferenceTone(freq,dur=1.6){
  let ctx;
  try{ctx=ensureToneCtx();}catch(e){return;}
  if(S.running)ignoreUntil=Math.max(ignoreUntil,performance.now()+dur*1000+250);
  try{
    await violinLoadPromise;
    const nm=nearestSampleNote(freq);
    if(nm){playSampledTone(ctx,violinBuffers[nm],noteNameToMidi(nm),freq,dur);return;}
  }catch(e){ /* フォールバックへ */ }
  playSynthTone(ctx,freq,dur);  // サンプルが使えない場合だけ合成音
}
/* ---- 合成音(フォールバック用。バイオリンの胴の共鳴を模したフィルタつき) ---- */
function playSynthTone(ctx,freq,dur){
  const t0=ctx.currentTime+0.02;
  const master=ctx.createGain();
  master.gain.value=0;
  master.connect(toneOut(ctx));
  const body1=ctx.createBiquadFilter();
  body1.type='peaking';body1.frequency.value=300;body1.Q.value=1.1;body1.gain.value=7;
  const body2=ctx.createBiquadFilter();
  body2.type='peaking';body2.frequency.value=2400;body2.Q.value=1.3;body2.gain.value=6;
  const lpf=ctx.createBiquadFilter();
  lpf.type='lowpass';lpf.frequency.value=7200;lpf.Q.value=0.5;
  const post=ctx.createGain();post.gain.value=0.5;
  lpf.connect(body1);body1.connect(body2);body2.connect(post);post.connect(master);
  [[0,0.55],[3,0.14],[-3,0.14]].forEach(([det,amp])=>{
    const o=ctx.createOscillator();
    o.type='sawtooth';o.frequency.value=freq;o.detune.value=det;
    const g=ctx.createGain();g.gain.value=amp;
    o.connect(g);g.connect(lpf);
    o.start(t0);o.stop(t0+dur+0.05);
  });
  const noiseBuf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*0.07),ctx.sampleRate);
  const nd=noiseBuf.getChannelData(0);
  for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
  const noise=ctx.createBufferSource();noise.buffer=noiseBuf;
  const noiseFilt=ctx.createBiquadFilter();
  noiseFilt.type='bandpass';noiseFilt.frequency.value=3200;noiseFilt.Q.value=0.8;
  const noiseGain=ctx.createGain();
  noiseGain.gain.setValueAtTime(0,t0);
  noiseGain.gain.linearRampToValueAtTime(0.12,t0+0.008);
  noiseGain.gain.linearRampToValueAtTime(0,t0+0.07);
  noise.connect(noiseFilt);noiseFilt.connect(noiseGain);noiseGain.connect(master);
  noise.start(t0);
  master.gain.setValueAtTime(0,t0);
  master.gain.linearRampToValueAtTime(0.5,t0+0.1);
  master.gain.linearRampToValueAtTime(0.38,t0+dur*0.6);
  master.gain.linearRampToValueAtTime(0,t0+dur);
}
/* ---- 正解チャイム(ゲームらしい達成音。✕のときは鳴らさない) ---- */
function playSuccessChime(tier){
  let ctx;
  try{ctx=ensureToneCtx();}catch(e){return;}
  const t0=ctx.currentTime+0.01;
  const freqs=tier==='good'?[880,1318.5]:[660];
  freqs.forEach((f,i)=>{
    const o=ctx.createOscillator();o.type='sine';o.frequency.value=f;
    const g=ctx.createGain();g.gain.value=0;
    o.connect(g);g.connect(toneOut(ctx));
    const start=t0+i*0.045;
    g.gain.setValueAtTime(0,start);
    g.gain.linearRampToValueAtTime(tier==='good'?0.16:0.10,start+0.012);
    g.gain.exponentialRampToValueAtTime(0.0001,start+0.32);
    o.start(start);o.stop(start+0.34);
  });
}
/* ================= メトロノームモード =================
   仕組み: テンポと各音の音価から「音ごとの時間枠」を先に計算しておき、
   枠の中で拾えたピッチを集め、枠が終わった瞬間に採点して自動で次へ進む。
   音の頭(弓の返し)はピッチが乱れるので、枠の最初の25%(最大80ms)は採点から除外。 */
function durBeats(n){
  const base=[4,2,1,0.5,0.25,0.125][(n.dur??2)]||1;
  return base*(n.dot?1.5:1);
}
function playClickAt(when,isCountIn){
  if(!toneCtx)return;
  const o=toneCtx.createOscillator();
  o.type='sine';o.frequency.value=isCountIn?1560:1040;
  const g=toneCtx.createGain();g.gain.value=0;
  o.connect(g);g.connect(toneOut(toneCtx));
  g.gain.setValueAtTime(0,when);
  g.gain.linearRampToValueAtTime(isCountIn?0.34:0.26,when+0.003);
  g.gain.exponentialRampToValueAtTime(0.0001,when+0.05);
  o.start(when);o.stop(when+0.06);
}
function startMetro(){
  metroBeatMs=60000/S.bpm;
  metroStarts=[0];
  S.notes.forEach(n=>metroStarts.push(metroStarts[metroStarts.length-1]+durBeats(n)*metroBeatMs));
  const countBeats=4;
  const now=performance.now();
  metroAnchor=now+countBeats*metroBeatMs+150;
  nextClickTime=now+150;
  metroSamples=[];
  metroOn=true;
}
function stopMetro(){metroOn=false;}
function finalizeMetroNote(strict){
  const valid=metroSamples.filter(c=>Math.abs(c)<=90);
  if(valid.length>=2){
    settle(median(valid),strict);          // 通常の採点フロー(スコア・コンボ・進行)を再利用
  }else if(metroSamples.length>=2){
    // 音は出ていたが目標から大きく外れていた
    const m=median(metroSamples);
    settle(Math.max(-99,Math.min(99,m)),strict);
  }else{
    // ほぼ無音: とばした扱い(✕にはしない)
    const n=S.notes[S.idx];
    S.results.push({en:n.en,jp:n.jp,cents:0,grade:'skip'});
    S.streak=0;updateGameBar();
    S.idx++;
    if(S.idx>=S.notes.length){stopMetro();noteFlowEnd();return;}
    renderTarget();
  }
  metroSamples=[];
}

function refBtnFeedback(btn){
  btn.classList.add('playing');
  clearTimeout(btn._t);
  btn._t=setTimeout(()=>btn.classList.remove('playing'),900);
}

/* ---- 楽譜上の音符プレビュー(タップ/自動再生の共通ハイライト) ---- */
function flashPreview(i){
  previewIdx=i;
  renderScore();
  clearTimeout(previewTimer);
  previewTimer=setTimeout(()=>{previewIdx=-1;renderScore();},700);
}
function showTapLabel(cx,cy,text){
  const el=document.createElement('div');
  el.className='tapLabel';
  el.textContent=text;
  el.style.left=cx+'px';
  el.style.top=cy+'px';
  document.body.appendChild(el);
  requestAnimationFrame(()=>el.classList.add('show'));
  setTimeout(()=>el.remove(),900);
}
/* ---- 楽譜の音符をタップしたら、その音を鳴らす ---- */
$('score').addEventListener('click', e=>{
  if(S.mode!=='practice'||!noteHit.length)return;
  const rect=e.currentTarget.getBoundingClientRect();
  const Z=zoomFactor();
  const x=(e.clientX-rect.left)/Z, y=(e.clientY-rect.top)/Z;
  let best=null,bd=32;
  for(const hpt of noteHit){
    const d=Math.hypot(hpt.x-x,hpt.y-y);
    if(d<bd){bd=d;best=hpt;}
  }
  if(!best)return;
  const n=S.notes[best.i];
  playReferenceTone(n.target,1.1);
  flashPreview(best.i);
  showTapLabel(e.clientX,e.clientY,n.jp);
});

function detectPitch(buf,sr){
  const SIZE=buf.length;
  let rms=0;
  for(let i=0;i<SIZE;i++)rms+=buf[i]*buf[i];
  rms=Math.sqrt(rms/SIZE);
  if(rms<0.008)return -1;

  const minLag=Math.max(8,Math.floor(sr/3000));   // ~F7まで(ヘ長調3oct音階の最高音F7≈2807Hz@A442に対応)
  const maxLag=Math.min(SIZE-2,Math.floor(sr/150)); // G3より下に少し余裕
  const c=new Float32Array(maxLag+2);
  for(let lag=0;lag<=maxLag+1;lag++){
    let sum=0;
    for(let i=0;i<SIZE-lag;i++)sum+=buf[i]*buf[i+lag];
    c[lag]=sum;
  }
  let d=1;
  while(d<maxLag&&c[d]>c[d+1])d++;
  let maxval=-1,maxpos=-1;
  for(let i=Math.max(d,minLag);i<=maxLag;i++){
    if(c[i]>maxval){maxval=c[i];maxpos=i;}
  }
  if(maxpos<=0||maxval<0.3*c[0])return -1;
  // オクターブ下に誤検出していないか(半分の周期にほぼ同等のピークがあれば採用)
  const half=Math.round(maxpos/2);
  if(half>=minLag&&c[half]>0.92*maxval){maxpos=half;}
  // 放物線補間
  const x1=c[maxpos-1],x2=c[maxpos],x3=c[maxpos+1];
  const a=(x1+x3-2*x2)/2,b=(x3-x1)/2;
  let T=maxpos;
  if(a!==0)T=maxpos-b/(2*a);
  const f=sr/T;
  if(f<150||f>3000)return -1;
  return f;
}
function median(arr){const s=[...arr].sort((a,b)=>a-b);const m=s.length>>1;return s.length%2?s[m]:(s[m-1]+s[m])/2;}

/* ================= 丁寧モード(区間マスター練習) =================
   課題を短い区間に分け、「合格ライン(✕なし/すべて○)を連続N回」達成するまで
   同じ区間を繰り返す。全区間クリア後に通しで仕上げ、その結果を採点する。 */
function buildSegs(){
  master.segs=[];
  for(let i=0;i<master.full.length;i+=S.segLen)
    master.segs.push([i,Math.min(i+S.segLen,master.full.length)]);
  // 端数が短すぎる最終区間は前の区間に併合
  if(master.segs.length>1){
    const last=master.segs[master.segs.length-1];
    if(last[1]-last[0]<Math.max(2,Math.floor(S.segLen/2))){
      master.segs[master.segs.length-2][1]=last[1];
      master.segs.pop();
    }
  }
}
function stageNotes(){
  if(master.phase==='final')return master.full;
  const [a,b]=master.segs[master.segIdx];
  return master.full.slice(a,b);
}
function updateExName(){
  let extra='';
  if(master.active){
    extra=master.phase==='final'
      ?' ・ 仕上げ通し'
      :' ・ 区間'+(master.segIdx+1)+'/'+master.segs.length+(S.reps>1?'(連続'+S.reps+'回)':'');
  }
  const isMetro=(S.mode==='practice'&&S.advMode==='metro');
  $('exName').textContent=S.exLabel+' ・ A='+S.a4+(isMetro?' ・ ♩='+S.bpm:'')+extra;
}
function showSegBanner(msg){
  const el=$('segBanner');
  el.textContent=msg;
  el.classList.remove('hidden');
  clearTimeout(el._t);
  el._t=setTimeout(()=>el.classList.add('hidden'),1400);
}
function loadStage(){
  S.notes=stageNotes();
  S.idx=0;S.results=[];
  computeSlurPairs();
  hold=[];pitchSmooth=[];
  ignoreUntil=performance.now()+600;
  updateExName();
  scoreCtx=null;sizeScore();
  renderTarget();
  if(S.advMode==='metro'){stopMetro();startMetro();}
}
function stageComplete(){
  master.attempts++;
  const passSet=S.passGrade==='good'?['good']:['good','ok'];
  const pass=S.results.length>0&&S.results.every(r=>passSet.includes(r.grade));
  if(S.advMode==='metro')stopMetro();
  let msg;
  if(pass){
    master.cleared++;
    if(master.cleared>=S.reps){
      master.segIdx++;master.cleared=0;
      if(master.segIdx>=master.segs.length){
        master.phase='final';
        msg='🎉 全区間クリア!仕上げに通しで弾きます';
      }else{
        msg='✅ 区間'+master.segIdx+' 合格!次の区間へ';
      }
    }else{
      msg='○ 合格!あと'+(S.reps-master.cleared)+'回連続でクリア';
    }
  }else{
    master.cleared=0;
    const miss=S.results.filter(r=>!passSet.includes(r.grade)).length;
    msg='🔁 '+miss+'音が基準に届かず。もう一度この区間';
  }
  showSegBanner(msg);
  setTimeout(()=>{if(S.running)loadStage();},1500);
}
/* 音列を最後まで弾き終えたときの分岐(通し/丁寧共通の出口) */
function noteFlowEnd(){
  if(master.active&&master.phase!=='final'){stageComplete();return;}
  finish();
}

/* ================= ドローン(開放弦の持続音) =================
   絶対音感に頼らず、鳴り続ける開放弦に「重ねて」響きで音程を合わせる定番練習。 */
const DRONES=[null,{jp:'G',midi:55},{jp:'D',midi:62},{jp:'A',midi:69},{jp:'E',midi:76}];
let droneNodes=null, droneIdx=0;
function stopDrone(){
  if(!droneNodes)return;
  const t=toneCtx.currentTime;
  droneNodes.g.gain.setTargetAtTime(0,t,0.06);
  droneNodes.oscs.forEach(o=>{try{o.stop(t+0.4);}catch(e){}});
  droneNodes=null;
}
function resetDrone(){
  stopDrone();droneIdx=0;
  $('droneBtn').textContent='🎧 ドローン: オフ';
  $('droneBtn').classList.remove('droneOn');
}
function startDrone(midi){
  const ctx=ensureToneCtx();
  stopDrone();
  const freq=midiFreq(midi,S.a4);
  const g=ctx.createGain();g.gain.value=0;
  const lpf=ctx.createBiquadFilter();
  lpf.type='lowpass';lpf.frequency.value=Math.min(freq*8,4200);lpf.Q.value=0.4;
  lpf.connect(g);g.connect(toneOut(ctx));
  const oscs=[[0,0.6],[4,0.22],[-4,0.22]].map(([det,amp])=>{
    const o=ctx.createOscillator();
    o.type='sawtooth';o.frequency.value=freq;o.detune.value=det;
    const og=ctx.createGain();og.gain.value=amp;
    o.connect(og);og.connect(lpf);o.start();
    return o;
  });
  g.gain.setTargetAtTime(0.10,ctx.currentTime,0.2);
  droneNodes={g,oscs};
}
$('droneBtn').onclick=()=>{
  droneIdx=(droneIdx+1)%DRONES.length;
  const d=DRONES[droneIdx];
  if(!d){resetDrone();return;}
  startDrone(d.midi);
  $('droneBtn').textContent='🎧 ドローン: '+d.jp+'線('+midiName(d.midi,false).en+')';
  $('droneBtn').classList.add('droneOn');
};

/* ================= 練習ループ ================= */
function startLoop(){
  S.running=true;
  hist=[];hold=[];pitchSmooth=[];ignoreUntil=performance.now()+400;
  requestAnimationFrame(frame);
}
function frame(){
  if(!S.running)return;
  const now=performance.now();
  const buf=readTimeData();
  const raw=detectPitch(buf,audioCtx.sampleRate);

  let freq=-1;
  if(raw>0){
    pitchSmooth.push(raw);
    if(pitchSmooth.length>5)pitchSmooth.shift();
    freq=median(pitchSmooth);
    lastValidT=now;
  }else{
    if(now-lastValidT>180)pitchSmooth=[];
  }

  const strict=STRICT[S.strict];
  let centsForTrace=null, detTxt='音を待っています…', centsBigTxt='—', needleCents=null;

  if(freq>0){
    const midiFloat=69+12*Math.log2(freq/S.a4);
    const nearest=Math.round(midiFloat);
    const nName=midiName(nearest,false);
    detTxt='検出: '+nName.en+' '+freq.toFixed(1)+'Hz';

    if(S.mode==='tuner'){
      const cents=(midiFloat-nearest)*100;
      centsForTrace=cents;needleCents=cents;
      centsBigTxt=(cents>=0?'▲':'▼')+Math.abs(cents).toFixed(0);
      $('jpName').textContent=nName.jp;
      $('enName').textContent=nName.en;
      colorCents(cents,strict);
    }else if(S.notes[S.idx]){   // 区間切替バナー表示中はS.idxが範囲外になるので判定を止める
      const tgt=S.notes[S.idx];
      const cents=1200*Math.log2(freq/tgt.target);
      centsForTrace=Math.max(-70,Math.min(70,cents));
      needleCents=cents;
      centsBigTxt=(cents>=0?'▲':'▼')+Math.abs(cents).toFixed(0);
      colorCents(cents,strict);

      if(S.advMode==='metro'){
        // メトロノームモード: 音の時間枠内でサンプル収集(頭の25%は除外)
        if(metroOn&&now>=metroAnchor&&S.idx<S.notes.length){
          const t0=metroStarts[S.idx];
          const t1=metroStarts[S.idx+1];
          const el=now-metroAnchor;
          const skip=Math.min(80,(t1-t0)*0.25);
          if(el-t0>=skip)metroSamples.push(cents);
        }
      }else if(now>=ignoreUntil){
        if(Math.abs(cents)<=90){
          if(hold.length&&now-hold[hold.length-1].t>250)hold=[];
          hold.push({t:now,c:cents});
          while(hold.length&&now-hold[0].t>900)hold.shift();
          const hp=HOLD_PRESETS[S.holdSpeed];
          if(hold.length>=hp.min&&now-hold[0].t>=hp.ms){
            const settled=median(hold.map(h=>h.c));
            settle(settled,strict);
          }
        }else if(Math.abs(cents)>140){
          hold=[];
        }
      }
    }
  }
  /* ---- メトロノームの進行・クリック(音の有無に関係なく毎フレーム) ---- */
  if(S.mode==='practice'&&S.advMode==='metro'&&metroOn){
    // カウントイン中の表示
    if(now<metroAnchor){
      const remain=Math.ceil((metroAnchor-now)/metroBeatMs);
      $('jpName').textContent=remain;
      $('enName').textContent='カウント';
      metroCounting=true;
    }else if(metroCounting){
      metroCounting=false;
      renderTarget();   // カウントが終わったら音名表示に戻す
    }
    // 枠の終わりを越えたら採点して次へ(処理落ち時は複数音まとめて)
    let guard=0;
    while(metroOn&&S.idx<S.notes.length&&now-metroAnchor>=metroStarts[S.idx+1]&&guard<8){
      finalizeMetroNote(strict);guard++;
    }
    // クリック音のスケジュール(120ms先読み)
    if(toneCtx&&metroOn){
      while(nextClickTime<now+120){
        const when=toneCtx.currentTime+Math.max(0,(nextClickTime-now)/1000);
        playClickAt(when,nextClickTime<metroAnchor-1);
        nextClickTime+=metroBeatMs;
      }
    }
  }
  hist.push({t:now,c:centsForTrace});
  while(hist.length&&now-hist[0].t>4000)hist.shift();

  $('detected').textContent=detTxt;
  $('centsBig').textContent=centsBigTxt==='—'?'—':centsBigTxt+'¢';
  if(needleCents!==null){
    const cl=Math.max(-50,Math.min(50,needleCents));
    $('needle').style.left=(50+cl)+'%';
  }
  if(S.mode==='tuner')drawTrace();
  requestAnimationFrame(frame);
}
function colorCents(cents,strict){
  const el=$('centsBig');
  el.style.color=Math.abs(cents)<=strict.good?'var(--good)':
                 Math.abs(cents)<=strict.ok ?'var(--warn)':'var(--bad)';
}
function comboMultiplier(streak){
  if(streak>=15)return 2.0;
  if(streak>=7)return 1.5;
  if(streak>=3)return 1.2;
  return 1.0;
}
function comboEmoji(streak){
  if(streak>=15)return '🔥🔥🔥';
  if(streak>=7)return '🔥🔥';
  if(streak>=1)return '🔥';
  return '';
}
function settle(cents,strict){
  const g=Math.abs(cents)<=strict.good?'good':Math.abs(cents)<=strict.ok?'ok':'bad';
  const n=S.notes[S.idx];
  S.results.push({en:n.en,jp:n.jp,cents,grade:g});
  if(g==='good')S.streak++;
  else if(g==='bad')S.streak=0;
  const mult=comboMultiplier(S.streak);
  const base={good:100,ok:40,bad:0}[g];
  const earned=Math.round(base*mult);
  S.score+=earned;
  flashGrade(g,cents,earned,mult);
  if(g==='good'||g==='ok')playSuccessChime(g);
  updateGameBar();
  hold=[];pitchSmooth=[];
  ignoreUntil=performance.now()+380;
  S.idx++;
  if(S.idx>=S.notes.length){noteFlowEnd();return;}
  renderTarget();
}
function updateGameBar(){
  $('scoreNum').textContent=S.score;
  const b=$('streakBadge');
  if(S.streak>0){
    $('comboEmoji').textContent=comboEmoji(S.streak);
    $('streakNum').textContent=S.streak;
    b.classList.remove('hidden');
  }else{
    b.classList.add('hidden');
  }
}
function flashGrade(g,cents,earned,mult){
  const sym={good:'○',ok:'△',bad:'✕'}[g];
  const f=$('miniFlash');
  let txt=sym+' '+(cents>=0?'▲':'▼')+Math.abs(cents).toFixed(0)+'¢';
  if(g!=='good')txt+=cents>=0?' 高め':' 低め';
  if(earned>0){
    txt+='  +'+earned+'点'+(mult>1?'(x'+mult+')':'');
  }
  f.textContent=txt;
  f.style.color={good:'var(--good)',ok:'var(--warn)',bad:'var(--bad)'}[g];
  f.classList.add('show');
  clearTimeout(f._t);f._t=setTimeout(()=>f.classList.remove('show'),800);
}

/* ================= 描画 ================= */
function renderTarget(){
  if(S.mode==='tuner'){
    $('prog').textContent='';
    $('jpName').textContent='—';$('enName').textContent='';
    return;
  }
  const n=S.notes[S.idx];
  $('jpName').textContent=n.jp;
  $('enName').textContent=n.en;
  $('prog').textContent=(S.idx+1)+' / '+S.notes.length;
  renderScore();
  clearTimeout(autoPlayTimer);
  if(S.autoPlayNext&&S.advMode!=='metro'){
    const idxAtSchedule=S.idx;
    autoPlayTimer=setTimeout(()=>{
      if(S.mode!=='practice'||S.idx!==idxAtSchedule)return;
      playReferenceTone(n.target,1.1);
      flashPreview(idxAtSchedule);
    },260);
  }else if(S.autoPlayNext&&S.advMode==='metro'&&metroOn){
    // メトロノームモードでもお手本音を鳴らす(音の時間枠に収まる長さで)。
    // スピーカー再生だとお手本の音もマイクが拾い判定が甘くなるため、イヤホン推奨。
    const winSec=durBeats(n)*metroBeatMs/1000;
    playReferenceTone(n.target,Math.max(0.22,Math.min(1.2,winSec*0.85)));
    flashPreview(S.idx);
  }
}
/* ---- 五線譜表示 ---- */
/* 音符サイズ(表示密度): 小にすると1画面に約1.5倍の音符が入る。描画全体をスケールする */
const ZOOMS=[['標準',1],['小',0.78],['大',1.25]];
let zoomIdx=(()=>{try{const v=parseInt(localStorage.getItem('onteiZoom'),10);return isNaN(v)?0:Math.max(0,Math.min(ZOOMS.length-1,v));}catch(e){return 0;}})();
function zoomFactor(){return ZOOMS[zoomIdx][1];}
function updateZoomBtn(){$('zoomBtn').textContent='🔍'+ZOOMS[zoomIdx][0];}
$('zoomBtn').onclick=()=>{
  zoomIdx=(zoomIdx+1)%ZOOMS.length;
  try{localStorage.setItem('onteiZoom',String(zoomIdx));}catch(e){}
  updateZoomBtn();
  renderScore();
};
updateZoomBtn();
let scoreCtx=null;
function sizeScore(){
  const cv=$('score');if(!cv||cv.classList.contains('hidden'))return;
  const dpr=window.devicePixelRatio||1;
  cv.width=cv.clientWidth*dpr;cv.height=cv.clientHeight*dpr;
  scoreCtx=cv.getContext('2d');scoreCtx.setTransform(dpr,0,0,dpr,0,0);
}
function keyAlterFor(letter,fifths){
  if(fifths>0){const o=['F','C','G','D','A','E','B'];return o.indexOf(letter)<fifths?1:0;}
  if(fifths<0){const o=['B','E','A','D','G','C','F'];return o.indexOf(letter)< -fifths?-1:0;}
  return 0;
}
const KEY_SHARP_OFFS=[8,5,9,6,3,7,4];  // F5 C5 G5 D5 A4 E5 B4 (E4=0基準)
const KEY_FLAT_OFFS =[4,7,3,6,2,5,1];  // B4 E5 A4 D5 G4 C5 F4
function renderScore(){
  if(S.mode==='tuner'||!S.notes.length)return;
  if(!scoreCtx)sizeScore();
  if(!scoreCtx)return;
  const Z=zoomFactor(),dpr=window.devicePixelRatio||1;
  const cv=$('score'),w=cv.clientWidth/Z,h=cv.clientHeight/Z,ctx=scoreCtx;
  ctx.setTransform(dpr*Z,0,0,dpr*Z,0,0);   // 論理座標系ごと拡大縮小(noteHitは論理座標のまま)
  ctx.clearRect(0,0,w,h);
  noteHit=[];
  const gap=7;
  const fifths=S.exFifths||0;
  const nks=Math.abs(fifths);
  const INK='#3a2f20', LINEC='#8a7c63';
  let maxOff=8,minOff=-2;
  S.notes.forEach(n=>{const o=n.d-30;if(o>maxOff)maxOff=o;if(o<minOff)minOff=o;});
  const above=Math.max(0,maxOff-8)*gap/2+18;
  const below=Math.max(0,-minOff)*gap/2+16;
  const rowH=4*gap+above+below;
  const rows=Math.max(1,Math.floor(h/rowH));
  const x0=44+nks*11;                     // 音符開始位置(音部記号+調号のぶん)
  const spacing=Math.max(30,Math.min(56,(w-x0-8)/8));
  const perRow=Math.max(4,Math.floor((w-x0-8)/spacing));
  const perPage=rows*perRow;
  const page=Math.floor(S.idx/perPage);
  const start=page*perPage;
  const yPad=Math.max(0,(h-rows*rowH)/2);
  const stemLen=gap*3.1;
  const pos={};   // 表示中の音のidx→{x,y,row,bottomY}

  // ---- 行ごとの描画 ----
  for(let r=0;r<rows;r++){
    const i0=start+r*perRow;
    if(i0>=S.notes.length)break;
    const bottomY=yPad+r*rowH+above+4*gap;
    ctx.strokeStyle=LINEC;ctx.lineWidth=1;
    for(let j=0;j<5;j++){const y=bottomY-j*gap;
      ctx.beginPath();ctx.moveTo(6,y);ctx.lineTo(w-6,y);ctx.stroke();}
    ctx.fillStyle=INK;ctx.font=(gap*4.6)+'px serif';
    ctx.textAlign='left';ctx.textBaseline='alphabetic';
    ctx.fillText('\u{1D11E}',8,bottomY+gap*0.9);
    // 調号
    ctx.font='14px serif';ctx.textAlign='center';
    for(let ki=0;ki<nks;ki++){
      const offk=(fifths>0?KEY_SHARP_OFFS:KEY_FLAT_OFFS)[ki];
      const yk=bottomY-offk*(gap/2);
      ctx.fillText(fifths>0?'♯':'♭', 40+ki*11, yk+4);
    }
    const rowNotes=[];
    for(let k=0;k<perRow;k++){
      const i=i0+k;
      if(i>=S.notes.length)break;
      const n=S.notes[i];
      const x=x0+k*spacing+spacing/2;
      const off=n.d-30;
      const y=bottomY-off*(gap/2);
      pos[i]={x,y,row:r,bottomY};
      noteHit.push({i,x,y});
      rowNotes.push({i,n,x,y,off});
    }
    // ---- 小節線(行頭を除く小節の頭に描く) ----
    ctx.strokeStyle=LINEC;ctx.lineWidth=1;
    rowNotes.forEach(({n,x},k)=>{
      if(n.ms && k>0){
        const bx=x-spacing*0.52;
        ctx.beginPath();ctx.moveTo(bx,bottomY-4*gap);ctx.lineTo(bx,bottomY);ctx.stroke();
      }
    });
    // ---- スラー(この行に見えている範囲) ----
    ctx.strokeStyle='rgba(58,47,32,0.65)';ctx.lineWidth=1.4;
    slurPairs.forEach(([a,b])=>{
      const pa=pos[a],pb=pos[b];
      const inRowA=pa&&pa.row===r, inRowB=pb&&pb.row===r;
      let xa=null,xb=null,ya=null,yb=null;
      if(inRowA&&inRowB){xa=pa.x;ya=pa.y;xb=pb.x;yb=pb.y;}
      else if(inRowA&&!inRowB&&b>=i0+perRow){xa=pa.x;ya=pa.y;xb=w-10;yb=pa.y;}
      else if(!inRowA&&inRowB&&a<i0){xa=x0;ya=pb.y;xb=pb.x;yb=pb.y;}
      else return;
      const ytop=Math.min(ya,yb)-14;
      ctx.beginPath();ctx.moveTo(xa,ya-9);
      ctx.quadraticCurveTo((xa+xb)/2,ytop-10,xb,yb-9);
      ctx.stroke();
    });
    // ---- 音符本体 ----
    rowNotes.forEach(({i,n,x,y,off})=>{
      let col=INK,ring=false;
      if(i<S.idx){
        const g=S.results[i]?S.results[i].grade:null;
        col=g==='good'?'#4f8f3d':g==='ok'?'#b3872a':g==='bad'?'#c04a35':'#9a8d76';
      }else if(i===S.idx){col='#b3792a';ring=true;}
      if(i===previewIdx){
        ctx.beginPath();ctx.arc(x,y,14,0,Math.PI*2);
        ctx.fillStyle='rgba(217,154,61,0.32)';ctx.fill();
      }
      ctx.strokeStyle=LINEC;ctx.lineWidth=1;
      if(off<=-2)for(let o=-2;o>=off;o-=2){const ly=bottomY-o*(gap/2);
        ctx.beginPath();ctx.moveTo(x-9,ly);ctx.lineTo(x+9,ly);ctx.stroke();}
      if(off>=10)for(let o=10;o<=off;o+=2){const ly=bottomY-o*(gap/2);
        ctx.beginPath();ctx.moveTo(x-9,ly);ctx.lineTo(x+9,ly);ctx.stroke();}
      // 臨時記号: 調号と異なる変化だけ表示(調号通りなら非表示、調号を打ち消すときは♮)
      const letter=['C','D','E','F','G','A','B'][((n.d%7)+7)%7];
      const ka=keyAlterFor(letter,fifths);
      const alt=n.alt||0;
      if(alt!==ka){
        const sym=({'-2':'𝄫','-1':'♭','0':'♮','1':'♯','2':'𝄪'})[String(alt)];
        ctx.fillStyle=col;ctx.font='13px serif';ctx.textAlign='center';
        ctx.fillText(sym,x-12,y+4);
      }
      // 符頭(全音符・2分音符は白玉)
      ctx.save();ctx.translate(x,y);ctx.rotate(-0.25);
      ctx.beginPath();ctx.ellipse(0,0,5.5,4,0,0,Math.PI*2);
      if((n.dur??2)<=1){ctx.strokeStyle=col;ctx.lineWidth=1.8;ctx.stroke();}
      else{ctx.fillStyle=col;ctx.fill();}
      ctx.restore();
      // 付点
      if(n.dot){
        ctx.beginPath();ctx.arc(x+9,(off%2===0)?y-3:y,1.8,0,Math.PI*2);
        ctx.fillStyle=col;ctx.fill();
      }
      if(ring){ctx.beginPath();ctx.arc(x,y,10,0,Math.PI*2);
        ctx.strokeStyle='#b3792a';ctx.lineWidth=1.6;ctx.stroke();}
      // 高い/低いの矢印(△✕だった音だけ。符幹と反対側に、ズレの向きを▲▼で表示)
      if(i<S.idx&&S.results[i]&&(S.results[i].grade==='ok'||S.results[i].grade==='bad')){
        const r=S.results[i];
        const sharp=r.cents>0;
        const ay=(off<4)?y+16:y-16;
        ctx.beginPath();
        if(sharp){ctx.moveTo(x-5,ay+4);ctx.lineTo(x+5,ay+4);ctx.lineTo(x,ay-5);}
        else{ctx.moveTo(x-5,ay-4);ctx.lineTo(x+5,ay-4);ctx.lineTo(x,ay+5);}
        ctx.closePath();
        ctx.fillStyle=r.grade==='bad'?'#c04a35':'#b3872a';
        ctx.fill();
      }
    });
    // ---- 符幹・連桁・旗 ----
    // 連桁グループを組み立てる(行内で完結させる)
    const groups=[];let cur=null;
    rowNotes.forEach(info=>{
      const n=info.n;
      const inBeam=n.bb||n.bc||n.be;
      if(inBeam){
        if(!cur)cur=[];
        cur.push(info);
        if(n.be){groups.push(cur);cur=null;}
      }else{
        if(cur){groups.push(cur);cur=null;}
      }
    });
    if(cur)groups.push(cur);
    const inGroup=new Set();
    groups.filter(g=>g.length>=2).forEach(g=>g.forEach(info=>inGroup.add(info.i)));
    ctx.lineWidth=1.4;
    // 単独音の符幹と旗
    rowNotes.forEach(({i,n,x,y,off})=>{
      const dur=n.dur??2;
      if(dur===0||inGroup.has(i))return;
      const up=off<4;
      const sx=up?x+4.8:x-4.8;
      const ey=up?y-stemLen:y+stemLen;
      ctx.strokeStyle=INK;ctx.lineWidth=1.4;
      ctx.beginPath();ctx.moveTo(sx,y);ctx.lineTo(sx,ey);ctx.stroke();
      const nf=Math.max(0,dur-2);
      for(let f=0;f<nf;f++){
        const fy=ey+(up?1:-1)*(f*5);
        ctx.beginPath();ctx.moveTo(sx,fy);
        ctx.quadraticCurveTo(sx+8,fy+(up?5:-5),sx+5,fy+(up?12:-12));
        ctx.stroke();
      }
    });
    // 連桁グループ
    groups.filter(g=>g.length>=2).forEach(g=>{
      const ups=g.filter(t=>t.off<4).length;
      const up=ups>=g.length/2;
      const beamY=up?Math.min(...g.map(t=>t.y))-stemLen:Math.max(...g.map(t=>t.y))+stemLen;
      ctx.strokeStyle=INK;
      g.forEach(({x,y})=>{
        const sx=up?x+4.8:x-4.8;
        ctx.lineWidth=1.4;
        ctx.beginPath();ctx.moveTo(sx,y);ctx.lineTo(sx,beamY);ctx.stroke();
      });
      const sx0=(up?g[0].x+4.8:g[0].x-4.8), sx1=(up?g[g.length-1].x+4.8:g[g.length-1].x-4.8);
      ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(sx0,beamY);ctx.lineTo(sx1,beamY);ctx.stroke();
      // 16分音符以下の副連桁(連続する16分の区間にだけ引く)
      const y2=beamY+(up?5:-5);
      let runStart=null;
      for(let t=0;t<=g.length;t++){
        const is16=t<g.length&&(g[t].n.dur??2)>=4;
        if(is16&&runStart===null)runStart=t;
        if((!is16||t===g.length)&&runStart!==null){
          const a=g[runStart],b=g[Math.max(runStart,t-1)];
          const ax=(up?a.x+4.8:a.x-4.8), bx=(up?b.x+4.8:b.x-4.8);
          ctx.lineWidth=3;
          ctx.beginPath();
          if(runStart===t-1){ // 1音だけの16分: 短い切れ桁
            ctx.moveTo(ax,y2);ctx.lineTo(ax+(up?-7:7)* (runStart===0?-1:1),y2);
          }else{
            ctx.moveTo(ax,y2);ctx.lineTo(bx,y2);
          }
          ctx.stroke();
          runStart=null;
        }
      }
    });
  }
  const pages=Math.ceil(S.notes.length/perPage);
  if(pages>1){
    ctx.fillStyle=LINEC;ctx.font='12px sans-serif';ctx.textAlign='right';
    ctx.fillText((page+1)+' / '+pages+' ページ', w-8, h-6);
  }
}
/* スラーの開始・終了ペア(課題構築時に計算) */
let slurPairs=[];
function computeSlurPairs(){
  slurPairs=[];
  const st=[];
  S.notes.forEach((n,i)=>{
    if(n.ss)st.push(i);
    if(n.se&&st.length)slurPairs.push([st.pop(),i]);
  });
}
function setupMeterZones(){
  const st=STRICT[S.strict];
  const ok=$('zoneOk'),good=$('zoneGood');
  ok.style.left=(50-st.ok)+'%';ok.style.width=(st.ok*2)+'%';
  ok.style.background='rgba(227,182,76,.14)';
  good.style.left=(50-st.good)+'%';good.style.width=(st.good*2)+'%';
  good.style.background='rgba(143,192,122,.22)';
}
let traceCtx=null;
function sizeCanvas(){
  const cv=$('trace');const dpr=window.devicePixelRatio||1;
  cv.width=cv.clientWidth*dpr;cv.height=cv.clientHeight*dpr;
  traceCtx=cv.getContext('2d');traceCtx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener('resize',()=>{
  if(screens.practice.classList.contains('hidden'))return;
  if(S.mode==='tuner'){sizeCanvas();}
  else{scoreCtx=null;sizeScore();renderScore();}
});
function drawTrace(){
  if(!traceCtx)return;
  const cv=$('trace');const w=cv.clientWidth,h=cv.clientHeight;
  const ctx=traceCtx;
  ctx.clearRect(0,0,w,h);
  // 五線風のガイド(中央=目標音)
  const lines=[-50,-25,0,25,50];
  for(const c of lines){
    const y=h/2-(c/60)*(h/2-8);
    ctx.strokeStyle=c===0?'rgba(217,154,61,.8)':'rgba(61,50,38,.9)';
    ctx.lineWidth=c===0?1.6:1;
    ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();
  }
  const now=performance.now();
  ctx.lineWidth=2.4;ctx.strokeStyle='#f0e7d5';
  ctx.beginPath();
  let pen=false;
  for(const p of hist){
    if(p.c===null){pen=false;continue;}
    const x=w-((now-p.t)/4000)*w;
    const y=h/2-(p.c/60)*(h/2-8);
    if(!pen){ctx.moveTo(x,y);pen=true;}else ctx.lineTo(x,y);
  }
  ctx.stroke();
}

/* ================= 結果 ================= */
/* ---- 自己ベストの保存(この端末内だけ。読み込めない場合は0扱いで安全に続行) ---- */
function exerciseKey(){
  let src;
  if(S.useImported&&S.imported)src='mx:'+S.imported.label;
  else if(S.useCustom)src='custom:'+$('customNotes').value.trim().slice(0,40);
  else src='preset:'+S.presetId;
  return 'onteiBest::'+src+'::n'+S.notes.length+'::'+S.strict+'::a'+S.a4;
}
function loadBest(key){
  try{const v=localStorage.getItem(key);return v?parseInt(v,10):0;}catch(e){return 0;}
}
function saveBest(key,score){
  try{localStorage.setItem(key,String(score));}catch(e){/* 保存できない環境では次回また0からでOK */}
}
let lastRun=null;   // 直前の演奏(苦手音の集中練習に使う)
function finish(){
  S.running=false;
  stopMetro();
  resetDrone();
  if(audioCtx)audioCtx.suspend();
  lastRun={notes:[...S.notes],results:[...S.results],fifths:S.exFifths,label:S.exLabel};
  $('weakBtn').classList.toggle('hidden',!S.results.some(r=>r.grade!=='good'));
  const valid=S.results.filter(r=>r.grade!=='skip');
  const cG=valid.filter(r=>r.grade==='good').length;
  const cO=valid.filter(r=>r.grade==='ok').length;
  const cB=valid.filter(r=>r.grade==='bad').length;
  const cS=S.results.length-valid.length;
  $('cGood').textContent=cG;$('cOk').textContent=cO;$('cBad').textContent=cB;$('cSkip').textContent=cS;
  $('resTitle').textContent=S.exLabel+(master.active&&master.phase==='final'?' (丁寧モード仕上げ)':'');
  if(valid.length){
    const rate=cG/valid.length;
    let msg;
    if(rate>=0.85)msg='🌟 すごい!ほとんど○だったね!';
    else if(rate>=0.6)msg='👏 いい感じ!この調子で練習しよう';
    else if(rate>=0.35)msg='🙂 だんだん合ってきてるよ。もう一回やってみよう';
    else msg='💪 ゆっくりでいいよ。まずはテンポを落として挑戦してみよう';
    $('kidMsg').textContent=msg;

    const starN=rate>=0.95?5:rate>=0.8?4:rate>=0.6?3:rate>=0.4?2:1;
    $('starsRow').innerHTML='★★★★★'.slice(0,starN)+
      '<span class="off">'+'★★★★★'.slice(starN)+'</span>';

    $('finalScore').textContent=S.score;
    const key=exerciseKey();
    const prevBest=loadBest(key);
    if(S.score>prevBest){
      saveBest(key,S.score);
      $('bestBox').innerHTML=(prevBest>0?'これまでの自己ベスト '+prevBest+'点<br>':'')+
        '<span class="new">🎉 自己ベスト更新!</span>';
    }else{
      $('bestBox').innerHTML='自己ベスト<br>'+prevBest+'点';
    }
  }else{
    $('kidMsg').textContent='';
    $('starsRow').innerHTML='';
    $('finalScore').textContent=S.score;
    $('bestBox').innerHTML='';
  }

  if(valid.length){
    const mean=valid.reduce((a,r)=>a+r.cents,0)/valid.length;
    const hi=valid.filter(r=>r.cents>STRICT[S.strict].good).length;
    const lo=valid.filter(r=>r.cents<-STRICT[S.strict].good).length;
    let main;
    if(mean>=8)main='全体的に高めです';
    else if(mean>=4)main='やや高めの傾向';
    else if(mean<=-8)main='全体的に低めです';
    else if(mean<=-4)main='やや低めの傾向';
    else main='平均はほぼ中央です';
    $('tendMain').textContent=main+'(平均 '+(mean>=0?'+':'')+mean.toFixed(1)+'¢)';
    const worst=[...valid].sort((a,b)=>Math.abs(b.cents)-Math.abs(a.cents)).slice(0,3)
      .filter(r=>Math.abs(r.cents)>STRICT[S.strict].good)
      .map(r=>r.jp+'('+(r.cents>=0?'+':'')+r.cents.toFixed(0)+'¢)');
    $('tendSub').textContent=(hi||lo?('高すぎ '+hi+'音 / 低すぎ '+lo+'音。'):'')+
      (worst.length?'特にずれた音: '+worst.join('、'):'');
  }else{
    $('tendMain').textContent='判定できた音がありませんでした';
    $('tendSub').textContent='';
  }

  const rows=$('resRows');rows.innerHTML='';
  S.results.forEach(r=>{
    const div=document.createElement('div');div.className='rrow';
    const sym=r.grade==='skip'?'−':{good:'○',ok:'△',bad:'✕'}[r.grade];
    const cls={good:'g-good',ok:'g-ok',bad:'g-bad',skip:'g-skip'}[r.grade];
    let barHtml='';
    if(r.grade!=='skip'){
      const cl=Math.max(-50,Math.min(50,r.cents));
      const wPct=Math.abs(cl);
      const left=cl>=0?50:50-wPct;
      const col=r.grade==='good'?'var(--good)':r.grade==='ok'?'var(--warn)':'var(--bad)';
      barHtml='<div class="bar" style="left:'+left+'%;width:'+wPct+'%;background:'+col+'"></div>';
    }
    div.innerHTML='<div class="nm">'+r.jp+'<small>'+r.en+'</small></div>'+
      '<div class="barwrap"><div class="zero"></div>'+barHtml+'</div>'+
      '<div class="ct">'+(r.grade==='skip'?'—':(r.cents>=0?'▲':'▼')+Math.abs(r.cents).toFixed(0)+'¢')+'</div>'+
      '<div class="sym '+cls+'">'+sym+'</div>';
    rows.appendChild(div);
  });
  show('result');
}

/* ================= 画面遷移 ================= */
async function begin(mode){
  S.mode=mode;
  if(mode==='practice'&&!buildExercise())return;
  if(mode==='tuner'){S.exLabel='チューナー';S.notes=[];S.idx=0;S.results=[];}
  /* 丁寧モードの初期化(短い課題はそのまま通し) */
  master.active=false;
  if(mode==='practice'&&S.pmode==='master'){
    master.full=S.notes;master.fullLabel=S.exLabel;
    buildSegs();
    if(master.segs.length>1){
      master.active=true;master.phase='seg';
      master.segIdx=0;master.cleared=0;master.attempts=0;
      S.notes=stageNotes();
      computeSlurPairs();
    }
  }
  const isMetro=(mode==='practice'&&S.advMode==='metro');
  if(isMetro){
    // このテンポでの最短の音の長さをチェック
    const beatMs=60000/S.bpm;
    const minMs=Math.min(...S.notes.map(n=>durBeats(n)*beatMs));
    if(minMs<180&&!confirm('このテンポだと最短の音が'+Math.round(minMs)+'ミリ秒になり、判定が不安定になります。\nテンポを下げるのがおすすめですが、このまま続けますか?'))return;
  }
  S.streak=0;S.score=0;updateGameBar();
  const ok=await initAudio();
  if(!ok)return;
  updateExName();
  $('pbtns').style.display=mode==='tuner'?'none':'flex';
  $('skipBtn').classList.toggle('hidden',isMetro);   // メトロノーム時は自動進行なのでスキップ不要
  $('score').classList.toggle('hidden',mode==='tuner');
  $('trace').classList.toggle('hidden',mode!=='tuner');
  $('playTargetBtn').classList.toggle('hidden',mode==='tuner');
  $('practice').classList.toggle('tunermode',mode==='tuner');
  show('practice');
  if(mode==='tuner')sizeCanvas();
  scoreCtx=null;sizeScore();
  setupMeterZones();
  renderTarget();
  startLoop();
  if(isMetro){ensureToneCtx();startMetro();}
  else{stopMetro();}
}
$('startBtn').onclick=()=>begin('practice');
$('tunerBtn').onclick=()=>begin('tuner');
$('skipBtn').onclick=()=>{
  const n=S.notes[S.idx];
  if(!n)return;
  S.results.push({en:n.en,jp:n.jp,cents:0,grade:'skip'});
  S.idx++;hold=[];ignoreUntil=performance.now()+380;
  if(S.idx>=S.notes.length){noteFlowEnd();return;}
  renderTarget();
};
$('restartBtn').onclick=()=>{
  S.idx=0;S.results=[];hold=[];S.streak=0;S.score=0;updateGameBar();renderTarget();
  if(S.advMode==='metro'&&S.mode==='practice'){stopMetro();startMetro();}
};
$('exitBtn').onclick=()=>{
  S.running=false;
  stopMetro();
  resetDrone();
  if(S.mode==='practice'&&S.results.length){finish();}
  else{if(audioCtx)audioCtx.suspend();show('setup');}
};
$('againBtn').onclick=async()=>{
  if(master.active){
    // 丁寧モード: 最初の区間からやり直す
    master.phase='seg';master.segIdx=0;master.cleared=0;master.attempts=0;
    master.full.forEach(n=>n.target=midiFreq(n.midi,S.a4));
    S.notes=stageNotes();computeSlurPairs();
  }else if(S.mode==='practice'){
    S.notes.forEach(n=>n.target=midiFreq(n.midi,S.a4));
  }
  S.idx=0;S.results=[];S.streak=0;S.score=0;updateGameBar();
  await initAudio();
  show('practice');
  if(S.mode==='tuner')sizeCanvas();
  scoreCtx=null;sizeScore();setupMeterZones();updateExName();renderTarget();startLoop();
  if(S.advMode==='metro'&&S.mode==='practice'){ensureToneCtx();stopMetro();startMetro();}
};
/* 苦手音の集中練習: 直前の演奏で○にならなかった音だけを各3回並べて練習 */
$('weakBtn').onclick=async()=>{
  if(!lastRun)return;
  const sel=lastRun.results.map((r,i)=>r.grade!=='good'?i:-1).filter(i=>i>=0);
  if(!sel.length)return;
  const notes=[];
  sel.forEach(i=>{
    const src=lastRun.notes[i];
    for(let k=0;k<3;k++)
      notes.push({...src,dur:2,dot:false,ms:k===0,ss:false,se:false,bb:false,bc:false,be:false});
  });
  S.mode='practice';
  master.active=false;
  S.notes=notes;S.exFifths=lastRun.fifths;
  S.exLabel='苦手音の集中練習(各3回)';
  S.idx=0;S.results=[];computeSlurPairs();
  S.streak=0;S.score=0;updateGameBar();
  const ok=await initAudio();
  if(!ok)return;
  updateExName();
  const isMetro=S.advMode==='metro';
  $('pbtns').style.display='flex';
  $('skipBtn').classList.toggle('hidden',isMetro);
  $('score').classList.remove('hidden');
  $('trace').classList.add('hidden');
  $('playTargetBtn').classList.remove('hidden');
  $('practice').classList.remove('tunermode');
  show('practice');
  scoreCtx=null;sizeScore();setupMeterZones();renderTarget();startLoop();
  if(isMetro){ensureToneCtx();stopMetro();startMetro();}
};
$('backBtn').onclick=()=>{show('setup');};

/* ---- 判定の仕組みモーダル ---- */
function openInfoModal(){
  $('infoModal').classList.remove('hidden');
}
function closeInfoModal(){
  $('infoModal').classList.add('hidden');
}
$('infoBtnSetup').onclick=openInfoModal;
$('infoBtnPractice').onclick=openInfoModal;
$('disclaimerLink').onclick=openInfoModal;
$('disclaimerLinkResult').onclick=openInfoModal;
$('infoModalClose').onclick=closeInfoModal;
$('infoModal').addEventListener('click',e=>{if(e.target.id==='infoModal')closeInfoModal();});

/* 単体HTML版のためService Workerは省略(オフライン対応はzip版を使用) */
