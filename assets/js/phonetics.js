// Mechanical hiragana → IPA conversion + mora splitting.
// Approximations follow standard Tokyo Japanese phonology.
//
// Caveats:
//  - Pitch accent is NOT included here; it requires per-word data.
//  - Allophones simplified (e.g., 「ん」 IPA mapping is approximated as /N/).
//  - This is for learner display, not phonetic research.

const HIRA_TO_IPA = {
  // basic vowels
  'あ':'a',  'い':'i',  'う':'ɯ', 'え':'e', 'お':'o',
  // k-row
  'か':'ka', 'き':'ki', 'く':'kɯ','け':'ke','こ':'ko',
  // g-row
  'が':'ɡa', 'ぎ':'ɡi', 'ぐ':'ɡɯ','げ':'ɡe','ご':'ɡo',
  // s-row
  'さ':'sa', 'し':'ɕi', 'す':'sɯ','せ':'se','そ':'so',
  // z-row
  'ざ':'za', 'じ':'dʑi','ず':'zɯ','ぜ':'ze','ぞ':'zo',
  // t-row
  'た':'ta', 'ち':'tɕi','つ':'tsɯ','て':'te','と':'to',
  // d-row
  'だ':'da', 'ぢ':'dʑi','づ':'zɯ','で':'de','ど':'do',
  // n-row
  'な':'na', 'に':'ɲi', 'ぬ':'nɯ','ね':'ne','の':'no',
  // h-row
  'は':'ha', 'ひ':'çi', 'ふ':'ɸɯ','へ':'he','ほ':'ho',
  // b-row
  'ば':'ba', 'び':'bi', 'ぶ':'bɯ','べ':'be','ぼ':'bo',
  // p-row
  'ぱ':'pa', 'ぴ':'pi', 'ぷ':'pɯ','ぺ':'pe','ぽ':'po',
  // m-row
  'ま':'ma', 'み':'mi', 'む':'mɯ','め':'me','も':'mo',
  // y-row
  'や':'ja', 'ゆ':'jɯ', 'よ':'jo',
  // r-row (tap, not English r/l)
  'ら':'ɾa', 'り':'ɾi', 'る':'ɾɯ','れ':'ɾe','ろ':'ɾo',
  // w-row
  'わ':'ɰa', 'を':'o',
  // n
  'ん':'ɴ',
};

const YOON_TO_IPA = {
  // ki-row
  'きゃ':'kʲa','きゅ':'kʲɯ','きょ':'kʲo',
  'ぎゃ':'ɡʲa','ぎゅ':'ɡʲɯ','ぎょ':'ɡʲo',
  // shi/chi-row
  'しゃ':'ɕa', 'しゅ':'ɕɯ', 'しょ':'ɕo',
  'じゃ':'dʑa','じゅ':'dʑɯ','じょ':'dʑo',
  'ちゃ':'tɕa','ちゅ':'tɕɯ','ちょ':'tɕo',
  'ぢゃ':'dʑa','ぢゅ':'dʑɯ','ぢょ':'dʑo',
  // n-row
  'にゃ':'ɲa', 'にゅ':'ɲɯ', 'にょ':'ɲo',
  // hi-row
  'ひゃ':'ça',  'ひゅ':'çɯ',  'ひょ':'ço',
  'びゃ':'bʲa','びゅ':'bʲɯ','びょ':'bʲo',
  'ぴゃ':'pʲa','ぴゅ':'pʲɯ','ぴょ':'pʲo',
  // mi-row
  'みゃ':'mʲa','みゅ':'mʲɯ','みょ':'mʲo',
  // ri-row
  'りゃ':'ɾʲa','りゅ':'ɾʲɯ','りょ':'ɾʲo',
};

// Katakana → hiragana (simple normalization)
function kataToHira(s) {
  return s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

// Split a kana string into mora (cells) — keeping yoon as single mora.
export function splitMora(kana) {
  if (!kana) return [];
  const hira = kataToHira(kana);
  const out = [];
  let i = 0;
  while (i < hira.length) {
    const two = hira.slice(i, i + 2);
    const small = /[ゃゅょャュョ]/.test(hira[i + 1] || '');
    if (small && (hira[i] in HIRA_TO_IPA || two in YOON_TO_IPA)) {
      out.push(two);
      i += 2;
    } else if (hira[i] === 'ー') {
      // long-vowel mark counts as a mora
      out.push('ー');
      i += 1;
    } else if (hira[i] === 'っ' || hira[i] === 'ッ') {
      out.push('っ');
      i += 1;
    } else {
      out.push(hira[i]);
      i += 1;
    }
  }
  return out;
}

// Convert a hiragana/katakana string into a single IPA transcription.
// Includes a long-vowel marker (ː) and a moraic-N marker (ɴ).
export function toIPA(kana) {
  if (!kana) return '';
  const mora = splitMora(kana);
  let ipa = '';
  let prevVowel = '';
  for (let i = 0; i < mora.length; i++) {
    const m = mora[i];
    if (m === 'ー') {
      ipa += 'ː';
      continue;
    }
    if (m === 'っ') {
      // gemination marker — approximate as ʔ before next consonant
      const next = mora[i + 1];
      const nextIpa = next && (YOON_TO_IPA[next] || HIRA_TO_IPA[next]);
      const firstCons = nextIpa ? nextIpa[0] : 'ʔ';
      ipa += firstCons;
      continue;
    }
    const sound = YOON_TO_IPA[m] || HIRA_TO_IPA[m] || m;
    ipa += sound;
    const lastChar = sound[sound.length - 1];
    if ('aiɯeo'.includes(lastChar)) prevVowel = lastChar;
  }
  return ipa;
}

// Display helper: format mora with separators (e.g., "び・ょ・う・い・ん" — but yoon kept together: "びょ・う・い・ん").
// Returns mora count + display string.
export function moraDisplay(kana) {
  const mora = splitMora(kana);
  return {
    count: mora.length,
    text: mora.join('・'),
  };
}
