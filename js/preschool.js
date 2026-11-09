/** 小小乐园：独立的幼儿样板，不接入学龄答题计时与奖励。 */
const PRESCHOOL_AUDIO = {
  welcome: '欢迎来到小小乐园。想和小熊接客人，还是去汉字小世界？',
  bus0: '车上有两位乘客，再上来一位。一共有几位？点点等车的小动物。',
  bus1: '记住车上有三位，再上来两位。从三接着数，点一位，数一个。',
  picnic: '篮子里有两个苹果，再放两个。记住二，接着数。点点外面的苹果。',
  recountBus: '点点车里的每位乘客，从一开始数。每位只数一次。',
  recountPicnic: '点点篮子里的每个苹果，从一开始数。每个只数一次。',
  retryNumber: '再看看数字。可以点从头数，再试一次。',
  rightNumber: '对啦！最后数到的数，就是现在一共有多少。',
  sunLearn: '日，太阳的日。点一下日字，让太阳升起来。',
  sunName: '日，太阳的日。',
  sunQuiz: '太阳出来了。哪个字表示太阳？',
  moonLearn: '月，月亮的月。点一下月字，让月亮出来。',
  moonName: '月，月亮的月。',
  moonQuiz: '小熊睡觉了，窗外有月亮。找一找表示月亮的字。',
  waterLearn: '水，流水的水。点一下水字，让小河流起来。',
  waterName: '水，流水的水。',
  waterQuiz: '小花渴了，给它浇点水。找一找水字。',
  mountainLearn: '山，大山的山。点一下山字，让大山出现。',
  mountainName: '山，大山的山。',
  mountainQuiz: '小熊去爬山。找一找表示大山的字。',
  fireLearn: '火，火苗的火。点一下火字，看看小火苗。',
  fireName: '火，火苗的火。',
  fireQuiz: '灶台上的火在烧水。哪个字表示火？',
  treeLearn: '木，树木的木。点一下木字，让小树长起来。',
  treeName: '木，树木的木。',
  treeQuiz: '小熊走进树林。哪个字表示树木？',
  cowLearn: '牛，小牛的牛。点一下牛字，请小牛出来。',
  cowName: '牛，小牛的牛。',
  cowQuiz: '农场里有一头牛。找一找牛字。',
  sheepLearn: '羊，小羊的羊。点一下羊字，请小羊出来。',
  sheepName: '羊，小羊的羊。',
  sheepQuiz: '小羊正在吃草。找一找羊字。',
  horseLearn: '马，小马的马。点一下马字，请小马出来。',
  horseName: '马，小马的马。',
  horseQuiz: '小马准备出发了。找一找马字。',
  doorLearn: '门，大门的门。点一下门字，把门打开。',
  doorName: '门，大门的门。',
  doorQuiz: '小熊回家了，要从这里进去。找一找门字。',
  mouthLearn: '口，就是嘴巴。点一下口字，小朋友张开嘴。',
  mouthName: '口，就是嘴巴。',
  mouthQuiz: '吃苹果要张开嘴巴。哪个字表示嘴巴？',
  handLearn: '手，小手的手。点一下手字，挥挥小手。',
  handName: '手，小手的手。',
  handQuiz: '拍皮球要用到小手。找一找手字。',
  letterGroups: '汉字藏在自然里、小动物身上，还有我们身边。选一个地方，认识三个字吧。',
  retryLetter: '再试试。也可以点再看一次，看看这个字。',
  rightLetter: '找到了！这个字在这里也用得上。',
  finish: '三个小任务都完成啦！休息一下，或者再玩一次吧。',
  n1: '一', n2: '二', n3: '三', n4: '四', n5: '五'
};

document.addEventListener('DOMContentLoaded', () => {
  const view = document.getElementById('view-preschool');
  const content = document.getElementById('preschool-content');
  const main = document.getElementById('view-main-lobby');
  const title = document.getElementById('preschool-title');
  const progress = document.getElementById('preschool-progress');
  const mathTasks = [
    { a: 2, b: 1, scene: 'bus', voice: 'bus0', remember: false },
    { a: 3, b: 2, scene: 'bus', voice: 'bus1', remember: true },
    { a: 2, b: 2, scene: 'picnic', voice: 'picnic', remember: true }
  ];
  const letters = [
    { word: '日', group: 'nature', scene: 'sun', voice: 'sun', label: '太阳', heading: '让太阳升起来', question: '哪个字表示太阳？' },
    { word: '月', group: 'nature', scene: 'moon', voice: 'moon', label: '月亮', heading: '让月亮出来', question: '晚上，天上有什么？' },
    { word: '水', group: 'nature', scene: 'water', voice: 'water', label: '流水', heading: '让小河流起来', question: '浇花需要哪个字？' },
    { word: '山', group: 'nature', scene: 'mountain', voice: 'mountain', label: '大山', heading: '让大山出现', question: '小熊走到哪里？' },
    { word: '火', group: 'nature', scene: 'fire', voice: 'fire', label: '火苗', heading: '看看小火苗', question: '烧水用到哪个字？' },
    { word: '木', group: 'nature', scene: 'tree', voice: 'tree', label: '树木', heading: '让小树长起来', question: '树林里藏着哪个字？' },
    { word: '牛', group: 'animals', scene: 'cow', voice: 'cow', label: '小牛', heading: '请小牛出来', question: '谁在农场里？' },
    { word: '羊', group: 'animals', scene: 'sheep', voice: 'sheep', label: '小羊', heading: '请小羊出来', question: '谁在吃青草？' },
    { word: '马', group: 'animals', scene: 'horse', voice: 'horse', label: '小马', heading: '请小马出来', question: '谁要出发啦？' },
    { word: '门', group: 'life', scene: 'door', voice: 'door', label: '大门', heading: '把门打开', question: '小熊从哪里进家？' },
    { word: '口', group: 'life', scene: 'mouth', voice: 'mouth', label: '嘴巴', heading: '张开小嘴巴', question: '哪个字表示嘴巴？' },
    { word: '手', group: 'life', scene: 'hand', voice: 'hand', label: '小手', heading: '挥挥小手', question: '拍球用到哪个字？' }
  ];
  const letterGroups = [
    { id: 'nature', title: '看自然', icon: '🌳', words: '日 月 水 山 火 木' },
    { id: 'animals', title: '小动物', icon: '🐮', words: '牛 羊 马' },
    { id: 'life', title: '我身边', icon: '👋', words: '门 口 手' }
  ];
  const seenKey = 'kids_preschool_letters_seen';
  const seenWords = new Set((localStorage.getItem(seenKey) || '').split(''));
  let letterGroup = 'nature';
  const animals = ['🐰', '🐱', '🐶', '🐼', '🐸'];
  let mode = null, index = 0, boarded = 0, correct = false;
  let arrived = [];
  let counted = new Set(), reveal = false, counting = false;
  let lessonSeen = false, quiz = false, letterTasks = [], choices = [];
  let currentVoice = 'welcome';

  function shuffle(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function say(key) {
    if (window.speechEngine.enabled) {
      window.speechEngine.playAudioFile(`assets/audio/preschool/${key}.mp3`);
    }
  }

  function listen(key) {
    currentVoice = key;
    return '<button type="button" class="ps-listen" data-action="listen">🔊 再听任务</button>';
  }

  function focusHeading() {
    const heading = content.querySelector('h3');
    if (heading) heading.focus({ preventScroll: true });
  }

  function focusControl(selector) {
    const button = content.querySelector(selector);
    if (button) button.focus({ preventScroll: true });
  }

  function lobby() {
    window.speechEngine.stop();
    mode = null;
    title.textContent = '小小乐园';
    progress.textContent = '';
    content.innerHTML = `${listen('welcome')}
      <div class="ps-game-grid">
        <button type="button" class="ps-game-card" data-action="start-math">
          <span aria-hidden="true">🐻 🚌</span><strong>小熊接客人</strong><small>数一数，接着数</small>
        </button>
        <button type="button" class="ps-game-card" data-action="start-letters">
          <span class="ps-glyph-preview" aria-hidden="true">日 月 水</span><strong>汉字小世界</strong><small>认识字，用一用</small>
        </button>
      </div>`;
    focusControl('[data-action="start-math"]');
  }

  function start(nextMode) {
    mode = nextMode;
    index = 0;
    if (mode === 'letters') return showLetterGroups();
    nextTask();
  }

  function showLetterGroups() {
    window.speechEngine.stop();
    title.textContent = '汉字小世界';
    progress.textContent = '';
    content.innerHTML = `<div class="ps-task-line"><h3 tabindex="-1">去哪里找汉字？</h3>${listen('letterGroups')}</div>
      <div class="ps-group-grid">${letterGroups.map(group => `<button type="button" class="ps-game-card" data-action="letter-group" data-group="${group.id}">
        <span aria-hidden="true">${group.icon}</span><strong>${group.title}</strong><small>${group.words}</small></button>`).join('')}</div>`;
    say('letterGroups');
    focusHeading();
  }

  function startLetterRound(group) {
    letterGroup = group;
    const pool = letters.filter(l => l.group === group);
    // 只有答对才记为已玩过；优先新字，剩余位置才安排复习。
    letterTasks = [...pool.filter(l => !seenWords.has(l.word)), ...shuffle(pool.filter(l => seenWords.has(l.word)))].slice(0, 3);
    index = 0;
    nextTask();
  }

  function nextTask() {
    window.speechEngine.stop();
    boarded = 0; arrived = []; correct = false; counted = new Set();
    reveal = false; counting = false; lessonSeen = false; quiz = false;
    title.textContent = mode === 'math' ? '小熊接客人' : '汉字小世界';
    progress.textContent = `${index + 1} / 3`;
    if (mode === 'math') {
      const sum = mathTasks[index].a + mathTasks[index].b;
      choices = shuffle([sum, ...shuffle([1, 2, 3, 4, 5].filter(n => n !== sum)).slice(0, 2)]);
      renderMath();
      say(mathTasks[index].voice);
    } else {
      choices = shuffle([letterTasks[index], ...shuffle(letters.filter(l => l.group === letterGroup && l !== letterTasks[index])).slice(0, 2)]);
      renderLetters();
      say(`${letterTasks[index].voice}Learn`);
    }
    focusHeading();
  }

  function renderMath() {
    const t = mathTasks[index], total = t.a + boarded, picnic = t.scene === 'picnic';
    const covered = t.remember && !reveal;
    const noun = picnic ? '个' : '位';
    const seated = Array.from({ length: total }, (_, i) => {
      const hidden = covered && i < t.a;
      return `<button type="button" class="ps-seat ${counted.has(i) ? 'ps-counted' : ''} ${hidden ? 'ps-covered' : ''}"
        data-action="count" data-seat="${i}" aria-label="${picnic ? '苹果' : '乘客'}${i + 1}" ${!counting || counted.has(i) || hidden ? 'disabled' : ''}>
        <span aria-hidden="true">${picnic ? '🍎' : animals[i < t.a ? i : t.a + arrived[i - t.a]]}</span>${counted.has(i) ? `<b>${[...counted].indexOf(i) + 1}</b>` : ''}</button>`;
    }).join('');
    content.innerHTML = `
      <div class="ps-task-line"><h3 tabindex="-1">${correct ? '接好啦！' : picnic ? '再放 2 个，一共几个？' : `再来 ${t.b} 位，一共几位？`}</h3>${listen(t.voice)}</div>
      <div class="ps-number-story"><span>记住 <b>${t.a}</b></span><span aria-hidden="true">＋</span><span>再来 <b>${t.b}</b></span></div>
      <div class="ps-math-scene ${picnic ? 'ps-picnic' : 'ps-bus'}">
        <div class="ps-driver" aria-hidden="true">🐻${picnic ? '🧺' : '🚌'}</div>
        <div class="ps-seats" aria-label="${picnic ? '篮子里的苹果' : '车里的乘客'}">${seated}</div>
        ${covered ? `<div class="ps-memory">原来有 <b>${t.a}</b> ${noun}</div>` : ''}
      </div>
      <div class="ps-waiting" aria-label="${picnic ? '等待放入的苹果' : '等车的乘客'}">${Array.from({ length: t.b }, (_, i) => `
        <button type="button" class="ps-board" data-action="board" data-passenger="${i}" aria-label="${picnic ? '放入苹果' : '请乘客上车'}${i + 1}" ${arrived.includes(i) || correct ? 'disabled' : ''}>
          <span aria-hidden="true">${arrived.includes(i) ? '✓' : picnic ? '🍎' : animals[t.a + i]}</span>
          <small>${arrived.includes(i) ? '到啦' : picnic ? '放进去' : '上车'}</small></button>`).join('')}</div>
      <div class="ps-count-display" aria-live="polite">${boarded ? `接着数：<strong>${total}</strong>` : '点一点，让小伙伴出发'}</div>
      <button type="button" class="ps-help" data-action="recount">👆 从头数</button>
      <p class="ps-feedback" role="status">${correct ? `对啦！${t.a} ＋ ${t.b} ＝ ${t.a + t.b}` : counting ? `点点${picnic ? '苹果' : '乘客'}，每个只数一次` : ''}</p>
      ${boarded === t.b ? `<div class="ps-choices" aria-label="选择一共多少">${choices.map(n => `<button type="button" class="ps-number-choice ${correct && n === total ? 'ps-right' : ''}" data-action="number" data-number="${n}" ${correct ? 'disabled' : ''}>${n}</button>`).join('')}</div>` : ''}
      ${correct ? nextButton() : ''}`;
  }

  function nextButton() {
    return `<button type="button" class="ps-next" data-action="next">${index === 2 ? '完成啦 ✓' : '下一站 ➜'}</button>`;
  }

  // 同一个字在两种场景中出现；图中不嵌字，字牌保持规范字形。
  function landscape(scene, active, variant) {
    const night = scene === 'moon';
    const sun = scene === 'sun';
    const water = scene === 'water';
    return `<svg class="ps-landscape ${active ? 'ps-scene-active' : ''}" viewBox="0 0 600 270" role="img" aria-label="${night ? '月夜' : water ? variant ? '给小花浇水' : '小河' : sun ? '阳光下的草地' : '山间小路'}">
      <rect width="600" height="270" rx="24" fill="${night ? '#28365f' : '#dff4fc'}"/>
      ${night ? '<circle cx="140" cy="42" r="3" fill="#fff"/><circle cx="320" cy="65" r="4" fill="#fff"/><circle cx="470" cy="38" r="3" fill="#fff"/>' : '<ellipse cx="130" cy="55" rx="55" ry="18" fill="#fff"/><ellipse cx="460" cy="80" rx="65" ry="18" fill="#fff"/>'}
      <path d="M0 215 Q150 140 300 210 T600 180 V270 H0Z" fill="${night ? '#4b6778' : '#b0dba2'}"/>
      <g class="ps-scene-subject" opacity="${active ? 1 : 0.15}">
      ${sun ? `<circle cx="${variant ? 420 : 310}" cy="85" r="48" fill="#f8bd42"/><circle cx="${variant ? 420 : 310}" cy="85" r="59" fill="none" stroke="#f8bd42" stroke-width="7" stroke-dasharray="5 14"/>` : ''}
      ${night ? '<path d="M330 30 A65 65 0 1 0 390 130 A56 56 0 0 1 330 30Z" fill="#ffe8a3"/>' : ''}
      ${scene === 'mountain' ? `<path d="M80 230 L230 40 L370 230Z" fill="#5c9c86"/><path d="M260 230 L420 65 L560 230Z" fill="#80b298"/><path d="M195 85 L230 40 L267 90 L230 77Z" fill="#f8faf1"/>` : ''}
      ${water && !variant ? '<path d="M370 145 Q200 185 330 215 Q420 245 250 280" fill="none" stroke="#4db7da" stroke-width="65"/>' : ''}
      ${water && variant ? '<path d="M330 80 Q400 110 370 150" fill="none" stroke="#57b7df" stroke-width="9" stroke-dasharray="12 12"/><path d="M235 60 L315 60 L315 110 L235 110Z" fill="#eea260"/><path d="M315 78 L345 59 L354 77 L315 100Z" fill="#eea260"/><path d="M236 69 C192 54 194 106 236 98" fill="none" stroke="#eea260" stroke-width="10"/>' : ''}
      </g>
      ${water && variant ? '<path d="M370 235 V173" stroke="#488f57" stroke-width="9"/><ellipse cx="347" cy="212" rx="23" ry="10" fill="#65ac6d"/><circle cx="370" cy="169" r="25" fill="#ef9ab5"/><circle cx="370" cy="169" r="11" fill="#ffe59a"/>' : ''}
      ${variant && night ? '<rect x="65" y="110" width="150" height="105" rx="12" fill="#c69b83"/><rect x="77" y="122" width="126" height="81" rx="5" fill="#536189"/><path d="M140 122 V203 M77 163 H203" stroke="#c69b83" stroke-width="8"/>' : ''}
      ${variant && !water ? '<path d="M100 270 Q230 205 280 230" fill="none" stroke="#edce9e" stroke-width="24"/>' : ''}
    </svg>`;
  }

  function letterScene(t, active, variant) {
    if (['sun', 'moon', 'water', 'mountain'].includes(t.scene)) return landscape(t.scene, active, variant);
    const animal = t.group === 'animals';
    const tree = '<rect x="270" y="140" width="25" height="100" rx="8" fill="#9a6845"/><path d="M282 180 L245 145 M285 165 L325 130" stroke="#9a6845" stroke-width="15" stroke-linecap="round"/><circle cx="280" cy="95" r="55" fill="#6fa97b"/><circle cx="240" cy="125" r="35" fill="#86bd80"/><circle cx="325" cy="120" r="40" fill="#5e9e71"/>';
    const flame = '<path d="M300 38 C305 105 366 105 359 173 C355 222 245 232 239 173 C234 131 273 110 267 77 C289 95 293 109 290 125 C321 111 315 78 300 38Z" fill="#f49b46"/><path d="M300 122 C299 150 335 166 321 193 C302 221 268 199 274 177 C279 158 292 149 300 122Z" fill="#ffe178"/>';
    let subject = '';
    if (t.scene === 'tree') subject = variant ? `<g transform="translate(-120 35) scale(.8)">${tree}</g>${tree}<g transform="translate(200 30) scale(.8)">${tree}</g>` : tree;
    if (t.scene === 'fire') subject = variant ? `<rect x="180" y="209" width="240" height="28" rx="8" fill="#ab8871"/><g transform="translate(100 140) scale(.65 .35)">${flame}</g><rect x="235" y="110" width="140" height="68" rx="18" fill="#8da5ae"/><path d="M228 112 H383 M245 110 Q305 80 367 110" fill="none" stroke="#627e87" stroke-width="9"/>` : flame;
    if (animal && t.scene !== 'horse') {
      const wool = t.scene === 'sheep';
      const cow = t.scene === 'cow';
      const bodyColor = '#fffaf0';
      subject = `<path d="M205 180 V235 M250 185 V238 M325 185 V238 M365 180 V235" stroke="${cow ? '#685c52' : '#8b684d'}" stroke-width="17" stroke-linecap="round"/>
        <path d="M182 150 Q148 145 158 182" fill="none" stroke="${bodyColor}" stroke-width="12" stroke-linecap="round"/>
        <ellipse cx="275" cy="155" rx="100" ry="55" fill="${bodyColor}" stroke="#9d856b" stroke-width="3"/>
        ${cow ? '<ellipse cx="240" cy="137" rx="27" ry="30" fill="#586062"/><ellipse cx="300" cy="175" rx="22" ry="28" fill="#586062"/><path d="M363 73 L355 49 M403 72 L416 48" stroke="#bc9a6c" stroke-width="12" stroke-linecap="round"/>' : ''}
        ${wool ? '<g fill="#fffaf0" stroke="#d4c8b4" stroke-width="2"><circle cx="200" cy="130" r="28"/><circle cx="235" cy="108" r="30"/><circle cx="280" cy="105" r="31"/><circle cx="325" cy="115" r="30"/><circle cx="325" cy="182" r="29"/><circle cx="275" cy="197" r="27"/><circle cx="227" cy="188" r="28"/></g>' : ''}
        <ellipse cx="383" cy="112" rx="${wool ? 35 : 43}" ry="${wool ? 43 : 49}" fill="${wool ? '#8c7c69' : bodyColor}" stroke="#9d856b" stroke-width="3"/>
        <ellipse cx="344" cy="96" rx="20" ry="10" fill="${bodyColor}"/><ellipse cx="425" cy="96" rx="20" ry="10" fill="${bodyColor}"/>
        <circle cx="370" cy="104" r="5" fill="#403a32"/><circle cx="397" cy="104" r="5" fill="#403a32"/>
        <ellipse cx="384" cy="137" rx="29" ry="17" fill="${cow ? '#e9b0a1' : '#d3b292'}"/><circle cx="374" cy="135" r="3" fill="#685443"/><circle cx="394" cy="135" r="3" fill="#685443"/>`;
    }
    if (t.scene === 'horse') subject = `<path d="M212 180 L203 236 M248 184 L252 236 M317 181 L310 236 M352 177 L366 233" stroke="#a77550" stroke-width="16" stroke-linecap="round"/>
      <path d="M183 146 Q146 135 148 188 L139 209" fill="none" stroke="#72513b" stroke-width="16" stroke-linecap="round"/>
      <ellipse cx="275" cy="155" rx="98" ry="52" fill="#be8a5d"/>
      <path d="M316 164 L337 78 Q348 54 373 66 L391 146Z" fill="#be8a5d"/>
      <path d="M340 73 Q354 57 371 66 L360 78 L354 98 L348 117 L335 147 L326 141Z" fill="#72513b"/>
      <path d="M364 69 L361 36 L380 60 M384 63 L392 30 L402 72" fill="#be8a5d" stroke="#936243" stroke-width="3"/>
      <path d="M360 77 Q366 48 391 62 L430 111 Q444 128 425 141 L382 123 L361 101Z" fill="#be8a5d"/>
      <ellipse cx="421" cy="123" rx="22" ry="16" fill="#dabb94" transform="rotate(20 421 123)"/>
      <circle cx="388" cy="82" r="5" fill="#41382e"/><circle cx="430" cy="120" r="3" fill="#685443"/>
      <path d="M415 135 L426 138" stroke="#936243" stroke-width="3" stroke-linecap="round"/>`;
    if (t.scene === 'door') subject = `${variant ? '<path d="M155 105 L300 28 L445 105" fill="#d48e77"/>' : ''}<rect x="215" y="65" width="170" height="175" rx="8" fill="#f3ddaf" stroke="#a97950" stroke-width="12"/>
      ${active ? '<path d="M222 71 L313 100 V231 L222 234Z" fill="#be905d" stroke="#92643e" stroke-width="4"/>' : '<rect x="224" y="74" width="152" height="158" fill="#be905d"/>'}<circle cx="${active ? 292 : 352}" cy="157" r="7" fill="#ffe299"/>`;
    if (t.scene === 'mouth') subject = `<circle cx="300" cy="132" r="92" fill="#f6c99f"/><path d="M215 107 Q202 23 301 26 Q398 24 389 102 Q355 65 321 73 Q278 47 215 107Z" fill="#705643"/><circle cx="269" cy="123" r="7" fill="#44382c"/><circle cx="332" cy="123" r="7" fill="#44382c"/>
      ${active ? '<ellipse cx="300" cy="173" rx="27" ry="23" fill="#9b4d4f"/><path d="M281 185 Q300 170 319 185" fill="#ed9190"/>' : '<path d="M279 168 Q300 183 321 168" fill="none" stroke="#9b4d4f" stroke-width="6" stroke-linecap="round"/>'}
      ${variant ? '<path d="M380 169 C359 144 332 170 346 195 C356 222 378 214 383 209 C398 224 419 208 424 188 C432 157 403 149 380 169Z" fill="#df7862"/><path d="M383 165 L387 148" stroke="#7d6d43" stroke-width="6"/>' : ''}`;
    if (t.scene === 'hand') subject = `<path d="M250 227 L230 174 C220 153 235 143 247 156 L260 175 L260 80 C260 60 282 60 282 80 V135 L286 57 C287 38 308 38 308 58 V135 L313 70 C314 51 335 52 335 72 V140 L341 100 C345 81 365 86 363 105 L355 198 Q351 226 327 240 H266Z" fill="#f0be91" stroke="#c99169" stroke-width="4"/>
      ${variant ? '<circle cx="410" cy="204" r="36" fill="#79afc8"/><path d="M374 204 H446 M410 168 Q386 204 410 240" fill="none" stroke="#d8eff6" stroke-width="5"/>' : ''}`;
    return `<svg class="ps-landscape ${active ? 'ps-scene-active' : ''}" viewBox="0 0 600 270" role="img" aria-label="${variant ? '新场景中的' : ''}${t.label}">
      <rect width="600" height="270" rx="24" fill="${variant ? '#e5f3f4' : '#f5f0df'}"/>
      <path d="M0 232 Q170 186 310 224 T600 214 V270 H0Z" fill="#bad7ab"/>
      ${animal && variant ? '<path d="M70 145 V225 M140 145 V225 M470 145 V225 M540 145 V225 M60 170 H175 M435 170 H550 M60 199 H175 M435 199 H550" stroke="#c39e76" stroke-width="10" stroke-linecap="round"/>' : ''}
      <g class="ps-scene-subject" opacity="${active ? 1 : 0.15}">${subject}</g>
      </svg>`;
  }

  function renderLetters() {
    const t = letterTasks[index];
    content.innerHTML = `<div class="ps-task-line"><h3 tabindex="-1">${correct ? '找到了！' : quiz ? t.question : t.heading}</h3>${listen(`${t.voice}${quiz ? 'Quiz' : 'Learn'}`)}</div>
      <div class="ps-letter-scene">${letterScene(t, quiz || lessonSeen, quiz)}</div>
      ${!quiz ? `<button type="button" class="ps-teach-glyph" data-action="learn" aria-label="认识${t.word}">${t.word}</button>
        ${lessonSeen ? '<button type="button" class="ps-next" data-action="quiz">换个地方找找 ➜</button>' : '<p class="ps-feedback">点一下这个字</p>'}` : `
        <div class="ps-choices ps-word-choices">${choices.map(l => `<button type="button" class="ps-word-choice ${correct && l === t ? 'ps-right' : ''}" data-action="word" data-word="${l.word}" ${correct ? 'disabled' : ''}>${l.word}</button>`).join('')}</div>
        <p class="ps-feedback" role="status">${correct ? `${t.word} · ${t.label}` : ''}</p>
        ${correct ? nextButton() : '<button type="button" class="ps-help" data-action="review">👀 再看一次</button>'}`}`;
  }

  function finish() {
    window.speechEngine.stop();
    progress.textContent = '3 / 3';
    content.innerHTML = `<div class="ps-finish"><span aria-hidden="true">🐻 🌼</span><h3 tabindex="-1">三个任务都完成啦！</h3>
      <button type="button" class="ps-next" data-action="replay">${mode === 'letters' ? '继续认识 ➜' : '再玩一次 ↻'}</button>
      ${mode === 'letters' ? '<button type="button" class="ps-help" data-action="letter-groups">换一组汉字</button>' : ''}
      <button type="button" class="ps-help" data-action="lobby">休息一下</button></div>`;
    say('finish');
    focusHeading();
  }

  content.addEventListener('click', e => {
    const button = e.target.closest('button[data-action]');
    if (!button || button.disabled) return;
    const action = button.dataset.action;
    if (action === 'listen') return say(currentVoice);
    if (action === 'start-math') return start('math');
    if (action === 'start-letters') return start('letters');
    if (action === 'letter-groups' && mode === 'letters') return showLetterGroups();
    if (action === 'letter-group' && mode === 'letters' && letterGroups.some(g => g.id === button.dataset.group)) return startLetterRound(button.dataset.group);
    if (action === 'lobby') return lobby();
    if (action === 'replay') {
      if (mode === 'letters') return startLetterRound(letterGroup);
      return start(mode);
    }
    if (action === 'next' && correct && index < 3) {
      index++;
      return index === 3 ? finish() : nextTask();
    }
    if (index >= 3) return;
    if (mode === 'math') {
      const t = mathTasks[index];
      const passenger = Number(button.dataset.passenger);
      if (action === 'board' && !correct && passenger >= 0 && passenger < t.b && !arrived.includes(passenger) && boarded < t.b) {
        arrived.push(passenger);
        boarded = arrived.length;
        counted.clear(); counting = false;
        renderMath();
        say(`n${t.a + boarded}`);
        const next = content.querySelector('.ps-board:not(:disabled), .ps-number-choice');
        if (next) next.focus({ preventScroll: true });
      } else if (action === 'recount') {
        reveal = true; counting = true; counted.clear();
        renderMath();
        say(t.scene === 'bus' ? 'recountBus' : 'recountPicnic');
        focusControl('.ps-seat:not(:disabled)');
      } else if (action === 'count' && counting && !counted.has(Number(button.dataset.seat))) {
        counted.add(Number(button.dataset.seat));
        renderMath();
        say(`n${counted.size}`);
        focusControl('.ps-seat:not(:disabled), .ps-number-choice:not(:disabled)');
      } else if (action === 'number' && boarded === t.b && !correct) {
        if (Number(button.dataset.number) === t.a + t.b) {
          correct = true; renderMath(); say('rightNumber'); focusControl('[data-action="next"]');
        } else {
          content.querySelector('.ps-feedback').textContent = '可以从头数，再试试';
          say('retryNumber');
        }
      }
    } else if (mode === 'letters') {
      if (action === 'learn' && !quiz) { lessonSeen = true; renderLetters(); say(`${letterTasks[index].voice}Name`); focusControl('[data-action="quiz"]'); }
      else if (action === 'quiz' && lessonSeen && !quiz) { quiz = true; renderLetters(); say(`${letterTasks[index].voice}Quiz`); focusHeading(); }
      else if (action === 'review' && quiz && !correct) { quiz = false; renderLetters(); say(`${letterTasks[index].voice}Learn`); focusControl('[data-action="learn"]'); }
      else if (action === 'word' && quiz && !correct) {
        if (button.dataset.word === letterTasks[index].word) {
          seenWords.add(letterTasks[index].word);
          localStorage.setItem(seenKey, [...seenWords].join(''));
          correct = true; renderLetters(); say('rightLetter'); focusControl('[data-action="next"]');
        }
        else { content.querySelector('.ps-feedback').textContent = '再试试，也可以再看一次'; say('retryLetter'); }
      }
    }
  });

  document.getElementById('card-goto-preschool').addEventListener('click', () => {
    main.classList.add('hidden');
    view.classList.remove('hidden');
    document.body.classList.add('preschool-mode', 'in-quiz-mode');
    lobby();
    say('welcome');
  });
  document.getElementById('preschool-back').addEventListener('click', () => {
    if (mode) { lobby(); return; }
    window.speechEngine.stop();
    view.classList.add('hidden'); main.classList.remove('hidden');
    document.body.classList.remove('preschool-mode', 'in-quiz-mode');
    document.getElementById('card-goto-preschool').focus();
  });
});
