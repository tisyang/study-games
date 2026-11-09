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
    { word: '日', scene: 'sun', voice: 'sun', label: '太阳' },
    { word: '月', scene: 'moon', voice: 'moon', label: '月亮' },
    { word: '水', scene: 'water', voice: 'water', label: '流水' },
    { word: '山', scene: 'mountain', voice: 'mountain', label: '大山' }
  ];
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
    // 首轮固定认识日、月、水；重玩也允许遇到山。
    if (mode === 'letters') letterTasks = letters.slice(0, 3);
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
      choices = shuffle([letterTasks[index], ...shuffle(letters.filter(l => l !== letterTasks[index])).slice(0, 2)]);
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

  function renderLetters() {
    const t = letterTasks[index];
    const headings = { sun: '让太阳升起来', moon: '让月亮出来', water: '让小河流起来', mountain: '让大山出现' };
    const questions = { sun: '哪个字表示太阳？', moon: '哪个字表示月亮？', water: '浇花需要哪个字？', mountain: '爬山用到哪个字？' };
    content.innerHTML = `<div class="ps-task-line"><h3 tabindex="-1">${correct ? '找到了！' : quiz ? questions[t.scene] : headings[t.scene]}</h3>${listen(`${t.voice}${quiz ? 'Quiz' : 'Learn'}`)}</div>
      <div class="ps-letter-scene">${landscape(t.scene, quiz || lessonSeen, quiz)}</div>
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
      <button type="button" class="ps-next" data-action="replay">再玩一次 ↻</button>
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
    if (action === 'lobby') return lobby();
    if (action === 'replay') {
      if (mode === 'letters') { letterTasks = shuffle(letters).slice(0, 3); index = 0; return nextTask(); }
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
        if (button.dataset.word === letterTasks[index].word) { correct = true; renderLetters(); say('rightLetter'); focusControl('[data-action="next"]'); }
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
