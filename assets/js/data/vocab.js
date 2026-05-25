// Vocabulary banks for N5 and N4 plus daily-life topics.
// Each item:
//   id, jp, reading, romaji, en, ur, level (N5|N4), tag, example?
// Urdu is informal transliteration/translation — kept short and practical.

export const VOCAB = [
  // ----- N5 basics -----
  { id: 'v001', jp: '私', reading: 'わたし', romaji: 'watashi', en: 'I, me', ur: 'میں', level: 'N5', tag: 'pronoun',
    example: { jp: '私は学生です。', en: 'I am a student.' } },
  { id: 'v002', jp: 'あなた', reading: 'あなた', romaji: 'anata', en: 'you', ur: 'آپ', level: 'N5', tag: 'pronoun' },
  { id: 'v003', jp: '学生', reading: 'がくせい', romaji: 'gakusei', en: 'student', ur: 'طالب علم', level: 'N5', tag: 'people',
    example: { jp: '私は日本語の学生です。', en: 'I am a Japanese language student.' } },
  { id: 'v004', jp: '先生', reading: 'せんせい', romaji: 'sensei', en: 'teacher', ur: 'استاد', level: 'N5', tag: 'people' },
  { id: 'v005', jp: '友達', reading: 'ともだち', romaji: 'tomodachi', en: 'friend', ur: 'دوست', level: 'N5', tag: 'people' },
  { id: 'v006', jp: '家族', reading: 'かぞく', romaji: 'kazoku', en: 'family', ur: 'خاندان', level: 'N5', tag: 'people' },
  { id: 'v007', jp: '名前', reading: 'なまえ', romaji: 'namae', en: 'name', ur: 'نام', level: 'N5', tag: 'people',
    example: { jp: 'お名前は何ですか。', en: 'What is your name?' } },
  { id: 'v008', jp: '日本', reading: 'にほん', romaji: 'nihon', en: 'Japan', ur: 'جاپان', level: 'N5', tag: 'place' },
  { id: 'v009', jp: '国', reading: 'くに', romaji: 'kuni', en: 'country', ur: 'ملک', level: 'N5', tag: 'place' },
  { id: 'v010', jp: '人', reading: 'ひと', romaji: 'hito', en: 'person', ur: 'انسان / آدمی', level: 'N5', tag: 'people' },

  // numbers / time
  { id: 'v011', jp: '一', reading: 'いち', romaji: 'ichi', en: 'one', ur: 'ایک', level: 'N5', tag: 'number' },
  { id: 'v012', jp: '二', reading: 'に', romaji: 'ni', en: 'two', ur: 'دو', level: 'N5', tag: 'number' },
  { id: 'v013', jp: '三', reading: 'さん', romaji: 'san', en: 'three', ur: 'تین', level: 'N5', tag: 'number' },
  { id: 'v014', jp: '四', reading: 'よん', romaji: 'yon', en: 'four', ur: 'چار', level: 'N5', tag: 'number' },
  { id: 'v015', jp: '五', reading: 'ご', romaji: 'go', en: 'five', ur: 'پانچ', level: 'N5', tag: 'number' },
  { id: 'v016', jp: '今', reading: 'いま', romaji: 'ima', en: 'now', ur: 'اب', level: 'N5', tag: 'time' },
  { id: 'v017', jp: '今日', reading: 'きょう', romaji: 'kyou', en: 'today', ur: 'آج', level: 'N5', tag: 'time' },
  { id: 'v018', jp: '明日', reading: 'あした', romaji: 'ashita', en: 'tomorrow', ur: 'کل (آنے والا)', level: 'N5', tag: 'time' },
  { id: 'v019', jp: '昨日', reading: 'きのう', romaji: 'kinou', en: 'yesterday', ur: 'کل (گزرا)', level: 'N5', tag: 'time' },
  { id: 'v020', jp: '時間', reading: 'じかん', romaji: 'jikan', en: 'time / hour', ur: 'وقت', level: 'N5', tag: 'time' },

  // basic verbs
  { id: 'v021', jp: '行く', reading: 'いく', romaji: 'iku', en: 'to go', ur: 'جانا', level: 'N5', tag: 'verb',
    example: { jp: '明日、病院へ行きます。', en: 'I will go to the hospital tomorrow.' } },
  { id: 'v022', jp: '来る', reading: 'くる', romaji: 'kuru', en: 'to come', ur: 'آنا', level: 'N5', tag: 'verb' },
  { id: 'v023', jp: '食べる', reading: 'たべる', romaji: 'taberu', en: 'to eat', ur: 'کھانا', level: 'N5', tag: 'verb' },
  { id: 'v024', jp: '飲む', reading: 'のむ', romaji: 'nomu', en: 'to drink', ur: 'پینا', level: 'N5', tag: 'verb' },
  { id: 'v025', jp: '見る', reading: 'みる', romaji: 'miru', en: 'to see / watch', ur: 'دیکھنا', level: 'N5', tag: 'verb' },
  { id: 'v026', jp: '聞く', reading: 'きく', romaji: 'kiku', en: 'to listen / ask', ur: 'سننا', level: 'N5', tag: 'verb' },
  { id: 'v027', jp: '話す', reading: 'はなす', romaji: 'hanasu', en: 'to speak', ur: 'بات کرنا', level: 'N5', tag: 'verb' },
  { id: 'v028', jp: '読む', reading: 'よむ', romaji: 'yomu', en: 'to read', ur: 'پڑھنا', level: 'N5', tag: 'verb' },
  { id: 'v029', jp: '書く', reading: 'かく', romaji: 'kaku', en: 'to write', ur: 'لکھنا', level: 'N5', tag: 'verb' },
  { id: 'v030', jp: 'する', reading: 'する', romaji: 'suru', en: 'to do', ur: 'کرنا', level: 'N5', tag: 'verb' },

  // adjectives
  { id: 'v031', jp: '大きい', reading: 'おおきい', romaji: 'ookii', en: 'big', ur: 'بڑا', level: 'N5', tag: 'adj' },
  { id: 'v032', jp: '小さい', reading: 'ちいさい', romaji: 'chiisai', en: 'small', ur: 'چھوٹا', level: 'N5', tag: 'adj' },
  { id: 'v033', jp: '新しい', reading: 'あたらしい', romaji: 'atarashii', en: 'new', ur: 'نیا', level: 'N5', tag: 'adj' },
  { id: 'v034', jp: '古い', reading: 'ふるい', romaji: 'furui', en: 'old (thing)', ur: 'پرانا', level: 'N5', tag: 'adj' },
  { id: 'v035', jp: '高い', reading: 'たかい', romaji: 'takai', en: 'expensive / tall', ur: 'مہنگا / لمبا', level: 'N5', tag: 'adj' },
  { id: 'v036', jp: '安い', reading: 'やすい', romaji: 'yasui', en: 'cheap', ur: 'سستا', level: 'N5', tag: 'adj' },
  { id: 'v037', jp: '美味しい', reading: 'おいしい', romaji: 'oishii', en: 'tasty', ur: 'مزیدار', level: 'N5', tag: 'adj' },
  { id: 'v038', jp: '元気', reading: 'げんき', romaji: 'genki', en: 'energetic / well', ur: 'تندرست', level: 'N5', tag: 'adj' },
  { id: 'v039', jp: '静か', reading: 'しずか', romaji: 'shizuka', en: 'quiet', ur: 'خاموش', level: 'N5', tag: 'adj' },
  { id: 'v040', jp: '便利', reading: 'べんり', romaji: 'benri', en: 'convenient', ur: 'سہولت بخش', level: 'N5', tag: 'adj' },

  // daily life nouns
  { id: 'v041', jp: '水', reading: 'みず', romaji: 'mizu', en: 'water', ur: 'پانی', level: 'N5', tag: 'noun' },
  { id: 'v042', jp: 'お茶', reading: 'おちゃ', romaji: 'ocha', en: 'tea', ur: 'چائے', level: 'N5', tag: 'noun' },
  { id: 'v043', jp: 'ご飯', reading: 'ごはん', romaji: 'gohan', en: 'rice / meal', ur: 'چاول / کھانا', level: 'N5', tag: 'noun' },
  { id: 'v044', jp: 'パン', reading: 'パン', romaji: 'pan', en: 'bread', ur: 'روٹی / بریڈ', level: 'N5', tag: 'katakana' },
  { id: 'v045', jp: '魚', reading: 'さかな', romaji: 'sakana', en: 'fish', ur: 'مچھلی', level: 'N5', tag: 'noun' },
  { id: 'v046', jp: '肉', reading: 'にく', romaji: 'niku', en: 'meat', ur: 'گوشت', level: 'N5', tag: 'noun' },
  { id: 'v047', jp: '本', reading: 'ほん', romaji: 'hon', en: 'book', ur: 'کتاب', level: 'N5', tag: 'noun' },
  { id: 'v048', jp: '車', reading: 'くるま', romaji: 'kuruma', en: 'car', ur: 'گاڑی', level: 'N5', tag: 'noun' },
  { id: 'v049', jp: '電車', reading: 'でんしゃ', romaji: 'densha', en: 'train', ur: 'ٹرین', level: 'N5', tag: 'transport' },
  { id: 'v050', jp: '駅', reading: 'えき', romaji: 'eki', en: 'station', ur: 'اسٹیشن', level: 'N5', tag: 'place' },

  // katakana loanwords
  { id: 'v051', jp: 'ホテル', reading: 'ホテル', romaji: 'hoteru', en: 'hotel', ur: 'ہوٹل', level: 'N5', tag: 'katakana' },
  { id: 'v052', jp: 'コンビニ', reading: 'コンビニ', romaji: 'konbini', en: 'convenience store', ur: 'کنوینینس اسٹور', level: 'N5', tag: 'katakana' },
  { id: 'v053', jp: 'タクシー', reading: 'タクシー', romaji: 'takushii', en: 'taxi', ur: 'ٹیکسی', level: 'N5', tag: 'katakana' },
  { id: 'v054', jp: 'バス', reading: 'バス', romaji: 'basu', en: 'bus', ur: 'بس', level: 'N5', tag: 'katakana' },
  { id: 'v055', jp: 'カメラ', reading: 'カメラ', romaji: 'kamera', en: 'camera', ur: 'کیمرہ', level: 'N5', tag: 'katakana' },
  { id: 'v056', jp: 'テレビ', reading: 'テレビ', romaji: 'terebi', en: 'TV', ur: 'ٹی وی', level: 'N5', tag: 'katakana' },
  { id: 'v057', jp: 'スマホ', reading: 'スマホ', romaji: 'sumaho', en: 'smartphone', ur: 'سمارٹ فون', level: 'N5', tag: 'katakana' },
  { id: 'v058', jp: 'シャワー', reading: 'シャワー', romaji: 'shawaa', en: 'shower', ur: 'شاور', level: 'N5', tag: 'katakana' },
  { id: 'v059', jp: 'エレベーター', reading: 'エレベーター', romaji: 'erebeetaa', en: 'elevator', ur: 'لفٹ', level: 'N5', tag: 'katakana' },
  { id: 'v060', jp: 'レストラン', reading: 'レストラン', romaji: 'resutoran', en: 'restaurant', ur: 'ریسٹورنٹ', level: 'N5', tag: 'katakana' },

  // ----- N4 -----
  { id: 'v061', jp: '会議', reading: 'かいぎ', romaji: 'kaigi', en: 'meeting', ur: 'میٹنگ', level: 'N4', tag: 'work',
    example: { jp: '今日の会議は三時からです。', en: "Today's meeting starts at 3." } },
  { id: 'v062', jp: '仕事', reading: 'しごと', romaji: 'shigoto', en: 'work / job', ur: 'کام', level: 'N4', tag: 'work' },
  { id: 'v063', jp: '会社', reading: 'かいしゃ', romaji: 'kaisha', en: 'company', ur: 'کمپنی', level: 'N4', tag: 'work' },
  { id: 'v064', jp: '社長', reading: 'しゃちょう', romaji: 'shachou', en: 'company president', ur: 'صدر', level: 'N4', tag: 'work' },
  { id: 'v065', jp: '上司', reading: 'じょうし', romaji: 'joushi', en: 'boss / supervisor', ur: 'افسر / باس', level: 'N4', tag: 'work' },
  { id: 'v066', jp: '休む', reading: 'やすむ', romaji: 'yasumu', en: 'to rest / take off', ur: 'آرام کرنا / چھٹی', level: 'N4', tag: 'verb',
    example: { jp: '熱があるので休みます。', en: 'I have a fever so I will take off.' } },
  { id: 'v067', jp: '遅れる', reading: 'おくれる', romaji: 'okureru', en: 'to be late', ur: 'دیر ہو جانا', level: 'N4', tag: 'verb',
    example: { jp: '電車が遅れています。', en: 'The train is delayed.' } },
  { id: 'v068', jp: '間に合う', reading: 'まにあう', romaji: 'maniau', en: 'to be in time', ur: 'وقت پر پہنچنا', level: 'N4', tag: 'verb' },
  { id: 'v069', jp: '連絡', reading: 'れんらく', romaji: 'renraku', en: 'contact / report in', ur: 'رابطہ', level: 'N4', tag: 'work',
    example: { jp: '遅れる時はすぐ連絡してください。', en: 'Please contact us immediately when running late.' } },
  { id: 'v070', jp: '報告', reading: 'ほうこく', romaji: 'houkoku', en: 'report', ur: 'رپورٹ', level: 'N4', tag: 'work' },

  { id: 'v071', jp: '病院', reading: 'びょういん', romaji: 'byouin', en: 'hospital', ur: 'ہسپتال', level: 'N4', tag: 'health',
    example: { jp: '病院へ行きたいです。', en: 'I want to go to the hospital.' } },
  { id: 'v072', jp: '薬', reading: 'くすり', romaji: 'kusuri', en: 'medicine', ur: 'دوا', level: 'N4', tag: 'health' },
  { id: 'v073', jp: '熱', reading: 'ねつ', romaji: 'netsu', en: 'fever', ur: 'بخار', level: 'N4', tag: 'health' },
  { id: 'v074', jp: '痛い', reading: 'いたい', romaji: 'itai', en: 'painful', ur: 'تکلیف دہ', level: 'N4', tag: 'health' },
  { id: 'v075', jp: '怪我', reading: 'けが', romaji: 'kega', en: 'injury', ur: 'چوٹ', level: 'N4', tag: 'health' },

  { id: 'v076', jp: '安全', reading: 'あんぜん', romaji: 'anzen', en: 'safety', ur: 'حفاظت', level: 'N4', tag: 'work' },
  { id: 'v077', jp: '危ない', reading: 'あぶない', romaji: 'abunai', en: 'dangerous', ur: 'خطرناک', level: 'N4', tag: 'safety' },
  { id: 'v078', jp: '注意', reading: 'ちゅうい', romaji: 'chuui', en: 'caution / attention', ur: 'احتیاط', level: 'N4', tag: 'safety' },
  { id: 'v079', jp: '禁止', reading: 'きんし', romaji: 'kinshi', en: 'prohibited', ur: 'ممنوع', level: 'N4', tag: 'safety' },
  { id: 'v080', jp: '非常口', reading: 'ひじょうぐち', romaji: 'hijouguchi', en: 'emergency exit', ur: 'ہنگامی راستہ', level: 'N4', tag: 'safety' },

  { id: 'v081', jp: '使う', reading: 'つかう', romaji: 'tsukau', en: 'to use', ur: 'استعمال کرنا', level: 'N4', tag: 'verb' },
  { id: 'v082', jp: '作る', reading: 'つくる', romaji: 'tsukuru', en: 'to make', ur: 'بنانا', level: 'N4', tag: 'verb' },
  { id: 'v083', jp: '直す', reading: 'なおす', romaji: 'naosu', en: 'to fix', ur: 'ٹھیک کرنا', level: 'N4', tag: 'verb' },
  { id: 'v084', jp: '壊れる', reading: 'こわれる', romaji: 'kowareru', en: 'to be broken', ur: 'ٹوٹ جانا', level: 'N4', tag: 'verb' },
  { id: 'v085', jp: '始まる', reading: 'はじまる', romaji: 'hajimaru', en: 'to begin (intr.)', ur: 'شروع ہونا', level: 'N4', tag: 'verb' },
  { id: 'v086', jp: '終わる', reading: 'おわる', romaji: 'owaru', en: 'to end', ur: 'ختم ہونا', level: 'N4', tag: 'verb' },
  { id: 'v087', jp: '探す', reading: 'さがす', romaji: 'sagasu', en: 'to look for', ur: 'تلاش کرنا', level: 'N4', tag: 'verb' },
  { id: 'v088', jp: '忘れる', reading: 'わすれる', romaji: 'wasureru', en: 'to forget', ur: 'بھولنا', level: 'N4', tag: 'verb' },
  { id: 'v089', jp: '思う', reading: 'おもう', romaji: 'omou', en: 'to think', ur: 'سوچنا', level: 'N4', tag: 'verb' },
  { id: 'v090', jp: '決める', reading: 'きめる', romaji: 'kimeru', en: 'to decide', ur: 'فیصلہ کرنا', level: 'N4', tag: 'verb' },

  { id: 'v091', jp: '簡単', reading: 'かんたん', romaji: 'kantan', en: 'easy / simple', ur: 'آسان', level: 'N4', tag: 'adj' },
  { id: 'v092', jp: '難しい', reading: 'むずかしい', romaji: 'muzukashii', en: 'difficult', ur: 'مشکل', level: 'N4', tag: 'adj' },
  { id: 'v093', jp: '大切', reading: 'たいせつ', romaji: 'taisetsu', en: 'important', ur: 'اہم', level: 'N4', tag: 'adj' },
  { id: 'v094', jp: '丁寧', reading: 'ていねい', romaji: 'teinei', en: 'polite / careful', ur: 'مہذب', level: 'N4', tag: 'adj' },
  { id: 'v095', jp: '正しい', reading: 'ただしい', romaji: 'tadashii', en: 'correct', ur: 'درست', level: 'N4', tag: 'adj' },

  { id: 'v096', jp: '面接', reading: 'めんせつ', romaji: 'mensetsu', en: 'job interview', ur: 'انٹرویو', level: 'N4', tag: 'work' },
  { id: 'v097', jp: '履歴書', reading: 'りれきしょ', romaji: 'rirekisho', en: 'resume', ur: 'ریزیومے', level: 'N4', tag: 'work' },
  { id: 'v098', jp: '給料', reading: 'きゅうりょう', romaji: 'kyuuryou', en: 'salary', ur: 'تنخواہ', level: 'N4', tag: 'work' },
  { id: 'v099', jp: '残業', reading: 'ざんぎょう', romaji: 'zangyou', en: 'overtime', ur: 'اضافی وقت', level: 'N4', tag: 'work' },
  { id: 'v100', jp: '出勤', reading: 'しゅっきん', romaji: 'shukkin', en: 'going to work', ur: 'کام پر آنا', level: 'N4', tag: 'work' },

  { id: 'v101', jp: '銀行', reading: 'ぎんこう', romaji: 'ginkou', en: 'bank', ur: 'بینک', level: 'N4', tag: 'place' },
  { id: 'v102', jp: '郵便局', reading: 'ゆうびんきょく', romaji: 'yuubinkyoku', en: 'post office', ur: 'ڈاک خانہ', level: 'N4', tag: 'place' },
  { id: 'v103', jp: '区役所', reading: 'くやくしょ', romaji: 'kuyakusho', en: 'ward office', ur: 'بلدیہ دفتر', level: 'N4', tag: 'place' },
  { id: 'v104', jp: '住所', reading: 'じゅうしょ', romaji: 'juusho', en: 'address', ur: 'پتہ', level: 'N4', tag: 'noun' },
  { id: 'v105', jp: '電話番号', reading: 'でんわばんごう', romaji: 'denwabangou', en: 'phone number', ur: 'فون نمبر', level: 'N4', tag: 'noun' },

  { id: 'v106', jp: '天気', reading: 'てんき', romaji: 'tenki', en: 'weather', ur: 'موسم', level: 'N4', tag: 'weather' },
  { id: 'v107', jp: '雨', reading: 'あめ', romaji: 'ame', en: 'rain', ur: 'بارش', level: 'N4', tag: 'weather' },
  { id: 'v108', jp: '雪', reading: 'ゆき', romaji: 'yuki', en: 'snow', ur: 'برف', level: 'N4', tag: 'weather' },
  { id: 'v109', jp: '暑い', reading: 'あつい', romaji: 'atsui', en: 'hot', ur: 'گرم', level: 'N4', tag: 'weather' },
  { id: 'v110', jp: '寒い', reading: 'さむい', romaji: 'samui', en: 'cold', ur: 'سرد', level: 'N4', tag: 'weather' },

  { id: 'v111', jp: '部屋', reading: 'へや', romaji: 'heya', en: 'room', ur: 'کمرہ', level: 'N4', tag: 'home' },
  { id: 'v112', jp: '台所', reading: 'だいどころ', romaji: 'daidokoro', en: 'kitchen', ur: 'باورچی خانہ', level: 'N4', tag: 'home' },
  { id: 'v113', jp: '洗濯', reading: 'せんたく', romaji: 'sentaku', en: 'laundry', ur: 'دھلائی', level: 'N4', tag: 'home' },
  { id: 'v114', jp: '掃除', reading: 'そうじ', romaji: 'souji', en: 'cleaning', ur: 'صفائی', level: 'N4', tag: 'home' },
  { id: 'v115', jp: 'ゴミ', reading: 'ゴミ', romaji: 'gomi', en: 'garbage', ur: 'کوڑا', level: 'N4', tag: 'home' },

  { id: 'v116', jp: '受ける', reading: 'うける', romaji: 'ukeru', en: 'to take (an exam, etc.)', ur: 'لینا (امتحان)', level: 'N4', tag: 'verb' },
  { id: 'v117', jp: '合格', reading: 'ごうかく', romaji: 'goukaku', en: 'passing (an exam)', ur: 'کامیابی', level: 'N4', tag: 'work' },
  { id: 'v118', jp: '練習', reading: 'れんしゅう', romaji: 'renshuu', en: 'practice', ur: 'مشق', level: 'N4', tag: 'study' },
  { id: 'v119', jp: '辞書', reading: 'じしょ', romaji: 'jisho', en: 'dictionary', ur: 'لغت', level: 'N4', tag: 'study' },
  { id: 'v120', jp: '宿題', reading: 'しゅくだい', romaji: 'shukudai', en: 'homework', ur: 'ہوم ورک', level: 'N4', tag: 'study' },
];

export const VOCAB_DECKS = [
  { id: 'n5-core',    label: 'N5 コア語彙',       desc: 'Basic N5 nouns and pronouns', filter: (w) => w.level === 'N5' && ['pronoun','people','place','noun','number','time'].includes(w.tag) },
  { id: 'n5-verbs',   label: 'N5 動詞',           desc: 'Essential N5 verbs',           filter: (w) => w.level === 'N5' && w.tag === 'verb' },
  { id: 'n5-adj',     label: 'N5 形容詞',         desc: 'Common N5 adjectives',         filter: (w) => w.level === 'N5' && w.tag === 'adj' },
  { id: 'katakana',   label: 'カタカナ語',         desc: 'Loanwords in katakana',        filter: (w) => w.tag === 'katakana' },
  { id: 'n4-work',    label: 'N4 仕事・職場',     desc: 'Workplace vocabulary',         filter: (w) => w.level === 'N4' && w.tag === 'work' },
  { id: 'n4-life',    label: 'N4 生活',           desc: 'Daily life vocabulary',        filter: (w) => w.level === 'N4' && ['health','home','weather','place'].includes(w.tag) },
  { id: 'n4-safety',  label: 'N4 安全・標識',     desc: 'Safety & signage',             filter: (w) => w.tag === 'safety' },
  { id: 'n4-verbs',   label: 'N4 動詞',           desc: 'Practical N4 verbs',           filter: (w) => w.level === 'N4' && w.tag === 'verb' },
];

// Helper to resolve a deck into its actual vocab items.
export function getDeckItems(deckId) {
  const deck = VOCAB_DECKS.find((d) => d.id === deckId);
  if (!deck) return [];
  return VOCAB.filter(deck.filter);
}

export function findVocab(id) {
  return VOCAB.find((w) => w.id === id);
}
