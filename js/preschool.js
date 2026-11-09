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

Object.assign(PRESCHOOL_AUDIO, PRESCHOOL_EXTRA_AUDIO);

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
  const letters = PRESCHOOL_LETTERS;
  const letterGroups = PRESCHOOL_LETTER_GROUPS;
  const seenKey = 'kids_preschool_letters_seen';
  const seenWords = new Set((localStorage.getItem(seenKey) || '').split(''));
  const progressKey = 'kids_preschool_literacy_v1';
  let learning;
  try { learning = JSON.parse(localStorage.getItem(progressKey) || 'null'); } catch (e) { learning = null; }
  if (!learning || !Number.isInteger(learning.round) || !learning.items || typeof learning.items !== 'object') learning = { round: 0, items: {} };
  // 旧记录只代表接触过，不换算成独立辨认或掌握。
  for (const word of seenWords) {
    if (letters.some(l => l.word === word) && !learning.items[`c:${word}`]) learning.items[`c:${word}`] = { introduced: true, recognitions: 0, uses: 0, due: 0, last: -1 };
  }
  let letterGroup = 'nature';
  const animals = ['🐰', '🐱', '🐶', '🐼', '🐸'];
  let mode = null, index = 0, boarded = 0, correct = false;
  let arrived = [];
  let counted = new Set(), reveal = false, counting = false;
  let lessonSeen = false, quiz = false, letterTasks = [], choices = [];
  let taskDirection = 'new', helped = false, practice = false;
  let numberTasks = [], amount = 0, changed = false, moved = false;
  let left = 0, right = 0, splitTotal = 3, splitWays = new Set();
  const numberDecks = {};
  let splitRound = 0;
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

  function literacy() { return mode === 'letters' || mode === 'phrases'; }
  function poolForMode() { return mode === 'phrases' ? PRESCHOOL_PHRASES : letters; }
  function groupsForMode() { return mode === 'phrases' ? PRESCHOOL_PHRASE_GROUPS : letterGroups; }
  function recordFor(item) {
    const key = `${item.phrase ? 'w' : 'c'}:${item.word}`;
    if (!learning.items[key]) learning.items[key] = { introduced: false, recognitions: 0, uses: 0, due: 0, last: -1 };
    return learning.items[key];
  }
  function saveLearning() { localStorage.setItem(progressKey, JSON.stringify(learning)); }

  function selectLiteracyRound(pool) {
    const known = pool.filter(t => recordFor(t).introduced).sort((a, b) => recordFor(a).due - recordFor(b).due || recordFor(a).last - recordFor(b).last);
    const fresh = pool.filter(t => !recordFor(t).introduced);
    const result = [];
    const due = known.find(t => recordFor(t).due <= learning.round);
    if (due) result.push(due);
    result.push(...fresh.slice(0, 2));
    for (const item of [...known, ...fresh]) if (result.length < 3 && !result.includes(item)) result.push(item);
    return result;
  }

  function noteSuccess() {
    const item = letterTasks[index], record = recordFor(item);
    record.introduced = true;
    if (!helped && taskDirection !== 'new' && record.last !== learning.round && record.introducedRound !== learning.round) record[taskDirection === 'hear' ? 'recognitions' : 'uses']++;
    record.last = learning.round;
    record.due = learning.round + (helped ? 1 : Math.min(3, 1 + record.recognitions + record.uses));
    if (!item.phrase) {
      seenWords.add(item.word);
      localStorage.setItem(seenKey, [...seenWords].join(''));
    }
    saveLearning();
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
    const target = button && !button.disabled ? button : content.querySelector('.ps-next:not(:disabled)') || content.querySelector('.ps-number-choice:not(:disabled)') || content.querySelector('.ps-help:not(:disabled)');
    if (target) target.focus({ preventScroll: true });
  }

  function lobby() {
    window.speechEngine.stop();
    mode = null;
    title.textContent = '小小乐园';
    progress.textContent = '';
    content.innerHTML = `${listen('welcomeStage1')}
      <div class="ps-game-grid">
        <button type="button" class="ps-game-card" data-action="start-math">
          <span aria-hidden="true">🐻 🚌</span><strong>数字小乐园</strong><small>认数字，玩数量</small>
        </button>
        <button type="button" class="ps-game-card" data-action="start-phrases">
          <span class="ps-glyph-preview" aria-hidden="true">开门</span><strong>词语小剧场</strong><small>读词语，用一用</small>
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
    if (literacy()) return showLetterGroups();
    if (mode === 'math') return showMathGroups();
    nextTask();
  }

  function showLetterGroups() {
    window.speechEngine.stop();
    title.textContent = mode === 'phrases' ? '词语小剧场' : '汉字小世界';
    progress.textContent = '';
    content.innerHTML = `<div class="ps-task-line"><h3 tabindex="-1">${mode === 'phrases' ? '词语也能做事情' : '去哪里找汉字？'}</h3>${listen(mode === 'phrases' ? 'wordGroups' : 'letterGroups')}</div>
      <div class="ps-group-grid">${groupsForMode().map(group => `<button type="button" class="ps-game-card" data-action="letter-group" data-group="${group.id}">
        <span aria-hidden="true">${group.icon}</span><strong>${group.title}</strong><small>${group.words.split(' ').slice(0, 3).join(' ')}</small></button>`).join('')}</div>`;
    say(mode === 'phrases' ? 'wordGroups' : 'letterGroups');
    focusHeading();
  }

  function startLetterRound(group) {
    letterGroup = group;
    letterTasks = selectLiteracyRound(poolForMode().filter(l => l.group === group));
    index = 0;
    nextTask();
  }

  function nextTask() {
    window.speechEngine.stop();
    boarded = 0; arrived = []; correct = false; counted = new Set();
    reveal = false; counting = false; lessonSeen = false; quiz = false;
    title.textContent = mode === 'math' ? '小熊接客人' : mode === 'letters' ? '汉字小世界' : mode === 'phrases' ? '词语小剧场' : { number: '数字找朋友', change: '来一位，走一位', split: '苹果分一分' }[mode];
    progress.textContent = `${index + 1} / 3`;
    if (mode === 'math') {
      const sum = mathTasks[index].a + mathTasks[index].b;
      choices = shuffle([sum, ...shuffle([1, 2, 3, 4, 5].filter(n => n !== sum)).slice(0, 2)]);
      renderMath();
      say(mathTasks[index].voice);
    } else if (literacy()) {
      const record = recordFor(letterTasks[index]);
      taskDirection = record.introduced ? record.recognitions <= record.uses ? 'hear' : 'use' : 'new';
      helped = taskDirection === 'new';
      quiz = taskDirection !== 'new';
      choices = shuffle([letterTasks[index], ...shuffle(poolForMode().filter(l => l.group === letterGroup && l !== letterTasks[index])).slice(0, 2)]);
      renderLetters();
      say(taskDirection === 'new' ? `${letterTasks[index].voice}Learn` : taskDirection === 'hear' ? `${letterTasks[index].voice}Name` : 'lookChoose');
    } else {
      amount = 0; changed = false; moved = false; left = 0; right = 0;
      counted.clear();
      const answer = mode === 'split' ? splitTotal : numberTasks[index].answer;
      choices = shuffle([answer, ...shuffle([0, 1, 2, 3, 4, 5].filter(n => n !== answer)).slice(0, 2)]);
      renderNumbers();
      say(numberVoice());
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
      <div class="ps-count-display" aria-live="polite">${boarded ? practice && !correct ? '你数到几啦？' : `接着数：<strong>${total}</strong>` : '点一点，让小伙伴出发'}</div>
      <button type="button" class="ps-help" data-action="practice">${practice ? '跟着学' : '自己试试'}</button>
      <button type="button" class="ps-help" data-action="recount">👆 从头数</button>
      <p class="ps-feedback" role="status">${correct ? `对啦！${t.a} ＋ ${t.b} ＝ ${t.a + t.b}` : counting ? `点点${picnic ? '苹果' : '乘客'}，每个只数一次` : ''}</p>
      ${boarded === t.b ? `<div class="ps-choices" aria-label="选择一共多少">${choices.map(n => `<button type="button" class="ps-number-choice ${correct && n === total ? 'ps-right' : ''}" data-action="number" data-number="${n}" ${correct ? 'disabled' : ''}>${n}</button>`).join('')}</div>` : ''}
      ${correct ? nextButton() : ''}`;
  }

  function nextButton() {
    return `<button type="button" class="ps-next" data-action="next">${index === 2 ? '完成啦 ✓' : '下一站 ➜'}</button>`;
  }

  function takeValue(key, values) {
    if (!numberDecks[key] || !numberDecks[key].length) numberDecks[key] = [...values];
    return numberDecks[key].shift();
  }

  function showMathGroups() {
    window.speechEngine.stop();
    title.textContent = '数字小乐园'; progress.textContent = '';
    content.innerHTML = `<div class="ps-task-line"><h3 tabindex="-1">今天怎么玩数字？</h3>${listen('mathGroups')}</div>
      <div class="ps-group-grid">${[['number', '🍎', '数字找朋友', '数字和数量'], ['change', '🚌', '来一位，走一位', '多一、少一和零'], ['split', '🧺', '苹果分一分', '合起来还是一样多'], ['math', '🐻', '小熊接客人', '记住，接着数']].map(([id, icon, name, text]) => `<button type="button" class="ps-game-card" data-action="number-game" data-game="${id}"><span aria-hidden="true">${icon}</span><strong>${name}</strong><small>${text}</small></button>`).join('')}</div>`;
    say('mathGroups'); focusHeading();
  }

  function startNumberRound(game) {
    mode = game; index = 0;
    if (game === 'number') numberTasks = ['match', 'give', 'same'].map(kind => ({ kind, answer: takeValue(kind, { match: [1, 2, 3, 4, 5, 0], give: [3, 2, 0, 1, 4, 5], same: [4, 3, 2, 5, 1] }[kind]) }));
    if (game === 'change') numberTasks = ['add', 'remove', 'empty'].map(kind => {
      const a = takeValue(kind, kind === 'add' ? [2, 0, 4, 1, 3] : [3, 1, 5, 2, 4]);
      return { kind, a, answer: kind === 'add' ? a + 1 : kind === 'remove' ? a - 1 : 0 };
    });
    if (game === 'split') { splitTotal = [3, 4, 5][splitRound++ % 3]; splitWays = new Set(); }
    nextTask();
  }

  function numberVoice() {
    if (mode === 'split') return 'splitPrompt';
    const t = numberTasks[index];
    if (mode === 'change') return { add: 'changeAdd', remove: 'changeRemove', empty: 'changeEmpty' }[t.kind];
    return t.kind === 'give' ? 'numberGive' : t.kind === 'same' ? 'numberSame' : t.answer === 0 ? 'numberEmpty' : 'numberMatch';
  }

  function tokens(n) {
    return Array.from({ length: n }, (_, i) => `<button type="button" class="ps-token ${counted.has(i) ? 'ps-counted' : ''}" data-action="token-count" data-token="${i}" aria-label="苹果${i + 1}" ${counted.has(i) || correct ? 'disabled' : ''}><span aria-hidden="true">🍎</span>${counted.has(i) ? `<b>${[...counted].indexOf(i) + 1}</b>` : ''}</button>`).join('');
  }

  function numberAnswers() {
    return `<div class="ps-choices" aria-label="选一个数字">${choices.map(n => `<button type="button" class="ps-number-choice ${correct && n === numberTasks[index].answer ? 'ps-right' : ''}" data-action="numeric-answer" data-number="${n}" ${correct ? 'disabled' : ''}>${n}</button>`).join('')}</div>`;
  }

  function renderNumbers() {
    const t = numberTasks[index];
    let body = '', heading = '';
    if (mode === 'split') {
      heading = '给两个盘子分苹果';
      body = `<div class="ps-number-story">一共 <b>${splitTotal}</b> 个</div>
        <div class="ps-number-basket"><span aria-hidden="true">🧺</span><div class="ps-token-row">${tokens(splitTotal - left - right)}</div></div>
        <div class="ps-plates">${[['left', left, '左边'], ['right', right, '右边']].map(([side, n, label]) => `<section class="ps-plate" aria-label="${label}盘子"><div class="ps-plate-fruit" aria-label="${n}个苹果">${'🍎'.repeat(n)}</div><strong>${n}</strong>
        <button type="button" class="ps-help" data-action="split-add" data-side="${side}" ${correct || left + right === splitTotal ? 'disabled' : ''}>放一个</button><button type="button" class="ps-help" data-action="split-remove" data-side="${side}" ${correct || !n ? 'disabled' : ''}>拿回一个</button></section>`).join('')}</div>
        <button type="button" class="ps-next" data-action="numeric-check" ${left + right !== splitTotal || correct ? 'disabled' : ''}>分好了 ✓</button>`;
    } else if (mode === 'change') {
      heading = { add: '再来一位，会有几位？', remove: '走一位，还剩几位？', empty: '都回家，还剩几位？' }[t.kind];
      const n = changed ? t.answer : t.a;
      body = `<div class="ps-number-story">原来 <b>${t.a}</b> 位</div><div class="ps-change-scene"><div class="ps-friends" aria-label="${n}位小伙伴">${animals.slice(0, n).map(a => `<span aria-hidden="true">${a}</span>`).join('') || '<span class="ps-empty">一个也没有</span>'}</div></div>
        <button type="button" class="ps-help ps-center" data-action="change" ${changed || correct ? 'disabled' : ''}>${{ add: '再来一位', remove: '走一位', empty: '都回家' }[t.kind]}</button>${changed ? numberAnswers() : ''}`;
    } else {
      heading = t.kind === 'give' ? '按数字装苹果' : t.kind === 'same' ? '换个位置，还是几个？' : '苹果和哪个数字是朋友？';
      const n = t.kind === 'give' ? amount : t.answer;
      body = `${t.kind === 'give' ? `<div class="ps-number-story">请装 <b>${t.answer}</b> 个</div>` : ''}
        <div class="ps-number-basket"><span aria-hidden="true">🧺</span><div class="ps-token-row ${moved ? 'ps-scattered' : ''}" aria-label="篮子中的苹果">${tokens(n) || '<span class="ps-empty">空篮子</span>'}</div></div>
        ${t.kind === 'give' ? `<div class="ps-number-tools"><button type="button" class="ps-help" data-action="amount-add" ${amount === 5 || correct ? 'disabled' : ''}>放一个</button><button type="button" class="ps-help" data-action="amount-remove" ${!amount || correct ? 'disabled' : ''}>拿回一个</button></div><button type="button" class="ps-next" data-action="numeric-check" ${correct ? 'disabled' : ''}>送出 ✓</button>` : t.kind === 'same' && !moved ? '<button type="button" class="ps-next" data-action="rearrange">换个位置 ↔</button>' : numberAnswers()}`;
    }
    content.innerHTML = `<div class="ps-task-line"><h3 tabindex="-1">${correct ? '做到了！' : heading}</h3>${listen(numberVoice())}</div>${body}
      <p class="ps-feedback" role="status">${correct ? mode === 'split' ? `${left} ＋ ${right} ＝ ${splitTotal}` : mode === 'change' ? t.kind === 'empty' ? '一个也没有，就是 0' : `${t.a} ${t.kind === 'add' ? '＋' : '－'} 1 ＝ ${t.answer}` : '数字和数量对上啦！' : ''}</p>${correct ? nextButton() : ''}`;
  }

  function handleNumbers(button) {
    if (correct) return;
    const action = button.dataset.action, t = numberTasks[index];
    if (action === 'token-count' && !counted.has(Number(button.dataset.token))) {
      counted.add(Number(button.dataset.token)); renderNumbers(); say(`n${counted.size}`); focusControl('.ps-token:not(:disabled)');
    } else if (action === 'amount-add' && amount < 5 || action === 'amount-remove' && amount > 0) {
      amount += action === 'amount-add' ? 1 : -1; counted.clear(); renderNumbers(); say(`n${amount}`); focusControl(`[data-action="${action}"]`);
    } else if (action === 'rearrange' && !moved) {
      moved = true; counted.clear(); renderNumbers(); focusControl('.ps-number-choice');
    } else if (action === 'change' && !changed) {
      changed = true; renderNumbers(); focusControl('.ps-number-choice');
    } else if (action === 'split-add' || action === 'split-remove') {
      const side = button.dataset.side;
      if (side !== 'left' && side !== 'right') return;
      if (action === 'split-add' && left + right < splitTotal) { if (side === 'left') left++; else right++; }
      if (action === 'split-remove') { if (side === 'left' && left) left--; else if (side === 'right' && right) right--; }
      counted.clear(); renderNumbers(); focusControl(`[data-action="${action}"][data-side="${side}"]`);
    } else if (action === 'numeric-check' || action === 'numeric-answer') {
      let ok = false;
      if (mode === 'split') {
        if (left + right !== splitTotal) return;
        const way = `${left},${right}`;
        if (splitWays.has(way)) { content.querySelector('.ps-feedback').textContent = '换个分法再试试'; say('splitAgain'); return; }
        splitWays.add(way); ok = true;
      } else ok = mode === 'number' && t.kind === 'give' ? amount === t.answer : (mode !== 'change' || changed) && Number(button.dataset.number) === t.answer;
      if (ok) { correct = true; renderNumbers(); say(mode === 'split' ? 'splitRight' : 'numberRight'); focusControl('[data-action="next"]'); }
      else { content.querySelector('.ps-feedback').textContent = '再数数看，试一次'; say('numberRetry'); }
    }
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

  function person(x, y, scale = 1, running = false) {
    return `<g transform="translate(${x} ${y}) scale(${scale})"><circle cy="-62" r="19" fill="#edc09a"/><path d="M0 -39 V15" stroke="#78aaba" stroke-width="28" stroke-linecap="round"/><path d="M0 -25 L${running ? -35 : -25} ${running ? -51 : 0} M0 -25 L${running ? 34 : 25} ${running ? -4 : 0}" stroke="#edc09a" stroke-width="10" stroke-linecap="round"/><path d="M-4 15 L${running ? -35 : -17} 57 M4 15 L${running ? 40 : 17} ${running ? 35 : 57}" stroke="#706959" stroke-width="12" stroke-linecap="round"/></g>`;
  }

  function extraScene(t, active, variant, solved = false) {
    const s = t.scene, effect = variant ? solved : active;
    let shape = '';
    const arrow = (x, y) => `<path d="M${x} ${y} v25 m-10 -8 l10 12 10 -12" fill="none" stroke="#a16d48" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
    const apple = '<path d="M290 115 C256 82 205 115 225 174 C242 222 273 214 290 202 C315 226 351 206 361 162 C372 111 327 91 290 115Z" fill="#dd8068"/><path d="M290 112 L300 81" stroke="#86724e" stroke-width="10"/><ellipse cx="316" cy="88" rx="21" ry="10" fill="#7fa46a" transform="rotate(-25 316 88)"/>';
    if (s === 'flower') shape = `<path d="M300 235 V125" stroke="#6e9d68" stroke-width="12"/><ellipse cx="272" cy="194" rx="30" ry="13" fill="#8bb174"/><ellipse cx="330" cy="170" rx="29" ry="12" fill="#8bb174"/><g fill="#e9a4b3">${[[300,78],[267,101],[280,139],[320,139],[333,101]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="27"/>`).join('')}</g><circle cx="300" cy="110" r="22" fill="#f3d779"/>`;
    if (s === 'fruit') shape = `${variant || t.phrase ? '<path d="M173 183 H432 L402 240 H205Z" fill="#cda77a"/><circle cx="369" cy="165" r="36" fill="#e5a25c"/><path d="M199 129 C192 174 220 199 251 167 L245 158 C219 175 208 150 208 128Z" fill="#e8cb70"/>' : '<path d="M180 65 H415" stroke="#bca17d" stroke-width="10"/>'}${apple}`;
    if (s === 'bird') shape = `<path d="M115 203 H470 M190 202 L155 165" stroke="#b39877" stroke-width="12" stroke-linecap="round"/><ellipse cx="300" cy="151" rx="69" ry="45" fill="#7caec3"/><circle cx="351" cy="119" r="33" fill="#7caec3"/><path d="M378 114 L406 127 L379 136Z" fill="#dbab69"/><path d="M240 157 L202 127 L216 171Z" fill="#5d91aa"/><ellipse cx="285" cy="155" rx="32" ry="24" fill="#b0d1db"/><circle cx="361" cy="114" r="5" fill="#3e4a4d"/><path d="M287 191 V201 M315 189 V201" stroke="#a98a60" stroke-width="7"/>`;
    if (s === 'cat' || s === 'dog') shape = `<ellipse cx="282" cy="173" rx="76" ry="49" fill="${s === 'cat' ? '#d8aa76' : '#c99775'}"/><path d="M228 170 Q174 131 190 209" fill="none" stroke="${s === 'cat' ? '#d8aa76' : '#c99775'}" stroke-width="18" stroke-linecap="round"/><path d="M248 204 V235 M310 205 V235" stroke="#b08b67" stroke-width="20" stroke-linecap="round"/>
      ${s === 'cat' ? '<path d="M306 88 L309 45 L342 79 M365 79 L401 45 L403 100" fill="#d8aa76" stroke="#b48d63" stroke-width="3"/>' : '<ellipse cx="308" cy="112" rx="20" ry="49" fill="#946f55"/><ellipse cx="404" cy="112" rx="20" ry="49" fill="#946f55"/>'}
      <circle cx="355" cy="115" r="57" fill="${s === 'cat' ? '#e4bf92' : '#dfb99a'}"/><circle cx="336" cy="110" r="6" fill="#494137"/><circle cx="374" cy="110" r="6" fill="#494137"/><path d="M347 131 L363 131 L355 140Z" fill="#866855"/><path d="M355 140 V151 M355 150 Q340 162 332 150 M355 150 Q370 162 378 150" fill="none" stroke="#866855" stroke-width="3"/>${s === 'cat' ? '<path d="M327 134 L289 126 M326 144 L286 148 M383 134 L420 126 M383 144 L423 148" stroke="#866855" stroke-width="3"/>' : ''}`;
    if (s === 'car') shape = '<path d="M145 148 L208 78 H354 L412 146 L456 163 V216 H130 V167Z" fill="#80aebe"/><path d="M218 91 H279 V140 H173Z M292 91 H346 L389 140 H292Z" fill="#eaf4ef"/><circle cx="210" cy="216" r="31" fill="#657078"/><circle cx="380" cy="216" r="31" fill="#657078"/><circle cx="210" cy="216" r="14" fill="#d5dddd"/><circle cx="380" cy="216" r="14" fill="#d5dddd"/>';
    if (s === 'person') shape = person(300, 159, 1.2);
    if (s === 'big' || s === 'small') shape = `<circle cx="220" cy="165" r="65" fill="#8db8c8"/><circle cx="410" cy="197" r="32" fill="#8db8c8"/>${arrow(s === 'big' ? 220 : 410, s === 'big' ? 48 : 113)}`;
    if (s === 'above' || s === 'below') shape = `<path d="M175 148 H425 M199 152 V238 M402 152 V238" stroke="#b49672" stroke-width="15" stroke-linecap="round"/><circle cx="300" cy="${s === 'above' ? 111 : 207}" r="28" fill="#8db8c8"/>`;
    if (s === 'middle') shape = `<g fill="#dabf8e">${[170,300,430].map(x => `<rect x="${x-45}" y="162" width="90" height="68" rx="12"/>`).join('')}</g><circle cx="300" cy="130" r="41" fill="#aa8061"/><circle cx="271" cy="100" r="16" fill="#aa8061"/><circle cx="329" cy="100" r="16" fill="#aa8061"/><circle cx="286" cy="126" r="4" fill="#443c34"/><circle cx="314" cy="126" r="4" fill="#443c34"/><ellipse cx="300" cy="145" rx="17" ry="12" fill="#dfc49f"/>`;
    if (s === 'open' || s === 'close') {
      const open = s === 'open' ? effect : !effect;
      shape = `<rect x="210" y="45" width="180" height="195" rx="10" fill="#e8d8ad" stroke="#aa865e" stroke-width="12"/>${open ? '<path d="M219 53 L312 87 V229 L219 232Z" fill="#b9956d" stroke="#92714b" stroke-width="4"/>' : '<rect x="220" y="55" width="160" height="175" fill="#b9956d"/>'}<circle cx="${open ? 294 : 355}" cy="143" r="7" fill="#f6e3ad"/>`;
    }
    if (['come','go','walk','run','runHere'].includes(s)) {
      const here = s === 'come' || s === 'runHere';
      const walking = s === 'walk' || s === 'run';
      const x = walking ? 300 : effect ? here ? 200 : 420 : here ? 420 : 220;
      shape = `${walking ? '' : `<circle cx="85" cy="170" r="28" fill="#aa8061"/><circle cx="65" cy="148" r="11" fill="#aa8061"/><circle cx="105" cy="148" r="11" fill="#aa8061"/><circle cx="77" cy="167" r="3" fill="#493e33"/><circle cx="94" cy="167" r="3" fill="#493e33"/>`}
        <path d="M460 206 V126 M503 206 V126 M450 145 H514" stroke="#9baf80" stroke-width="10"/>
        ${person(x, 158, .95, s === 'run' || s === 'runHere')}
        ${walking ? '<ellipse cx="225" cy="236" rx="16" ry="6" fill="#c2b291"/><ellipse cx="370" cy="236" rx="16" ry="6" fill="#c2b291"/>' : `<path d="M${here ? '380 235 H220 M237 224 L220 235 L237 246' : '220 235 H400 M383 224 L400 235 L383 246'}" fill="none" stroke="#b28e68" stroke-width="5"/>`}`;
    }
    if (s === 'board' || s === 'alight') {
      const inside = s === 'board' ? effect : !effect;
      shape = `<rect x="220" y="78" width="300" height="150" rx="24" fill="#e0bd76"/><rect x="243" y="95" width="246" height="78" rx="12" fill="#edf5ed"/><circle cx="275" cy="226" r="27" fill="#657078"/><circle cx="465" cy="226" r="27" fill="#657078"/>${person(inside ? 355 : 130, inside ? 135 : 164, inside ? .6 : .9)}<path d="M${s === 'board' ? '145 218 H205 M191 208 L205 218 L191 228' : '205 218 H145 M159 208 L145 218 L159 228'}" fill="none" stroke="#b28e68" stroke-width="5"/>`;
    }
    if (s === 'bigDoor' || s === 'smallDoor') shape = `<rect x="155" y="70" width="125" height="170" fill="#bd9972" stroke="#96764f" stroke-width="7"/><rect x="385" y="138" width="68" height="102" fill="#bd9972" stroke="#96764f" stroke-width="7"/><circle cx="259" cy="157" r="6" fill="#f4dda4"/><circle cx="438" cy="191" r="5" fill="#f4dda4"/>${arrow(s === 'bigDoor' ? 217 : 419, s === 'bigDoor' ? 15 : 82)}`;
    if (s === 'bigMountain' || s === 'smallMountain') shape = `<path d="M95 240 L245 55 L377 240Z M365 240 L455 155 L540 240Z" fill="#7fa58b"/>${arrow(s === 'bigMountain' ? 245 : 455, s === 'bigMountain' ? 3 : 95)}`;
    if (s === 'climbUp' || s === 'climbDown') {
      const up = s === 'climbUp';
      const high = effect ? up : !up;
      shape = `<path d="M120 242 L380 45 L520 242Z" fill="#89ab8c"/><path d="M165 241 L375 78" stroke="#d6c299" stroke-width="18"/>${person(high ? 365 : 180, high ? 98 : 206, .5)}<path d="M${up ? '220 193 L324 109 M305 111 L324 109 L319 129' : '324 109 L220 193 M223 174 L220 193 L239 189'}" fill="none" stroke="#a07854" stroke-width="6"/>`;
    }
    return `<svg class="ps-landscape ${active ? 'ps-scene-active' : ''}" viewBox="0 0 600 270" role="img" aria-label="${t.label}"><rect width="600" height="270" rx="24" fill="${variant ? '#e6f1ed' : '#f7f0dd'}"/><path d="M0 245 Q180 208 300 242 T600 225 V270 H0Z" fill="#c0d8ac"/>${variant && ['cat','dog'].includes(s) ? '<rect x="70" y="50" width="100" height="90" fill="#bad8df" stroke="#c8ad86" stroke-width="8"/>' : ''}<g class="ps-scene-subject" opacity="${active ? 1 : .15}">${shape}</g></svg>`;
  }

  function sceneFor(t, active, variant, solved = false) {
    if (t.phrase && t.scene === 'hand') return letterScene({ ...t, group: 'life' }, active, variant);
    if (t.phrase || !['sun','moon','water','mountain','fire','tree','cow','sheep','horse','door','mouth','hand'].includes(t.scene)) return extraScene(t, active, variant, solved);
    return letterScene(t, active, variant);
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
    const pictorial = quiz && taskDirection === 'use';
    const hearing = quiz && taskDirection === 'hear';
    const voice = !quiz ? `${t.voice}Learn` : pictorial ? 'lookChoose' : hearing ? `${t.voice}Name` : `${t.voice}Quiz`;
    content.innerHTML = `<div class="ps-task-line"><h3 tabindex="-1">${correct ? '找到了！' : !quiz ? t.heading : hearing ? '听一听，找一找' : pictorial ? '看看字卡，选画面' : t.question}</h3>${listen(voice)}</div>
      ${pictorial ? `<div class="ps-reading-card ${t.phrase ? 'ps-phrase' : ''}">${t.word}</div>` : hearing && !correct ? '<div class="ps-hear-scene" aria-hidden="true">👂</div>' : `<div class="ps-letter-scene">${sceneFor(t, quiz || lessonSeen, quiz, correct)}</div>`}
      ${!quiz ? `<button type="button" class="ps-teach-glyph ${t.phrase ? 'ps-phrase' : ''}" data-action="learn" aria-label="认识${t.word}">${t.word}</button>
        ${lessonSeen ? '<button type="button" class="ps-next" data-action="quiz">换个地方找找 ➜</button>' : '<p class="ps-feedback">点一下这个字</p>'}` : `
        <div class="ps-choices ${pictorial ? 'ps-picture-choices' : 'ps-word-choices'}">${choices.map(l => `<button type="button" class="ps-word-choice ${l.phrase ? 'ps-phrase' : ''} ${correct && l === t ? 'ps-right' : ''}" data-action="word" data-word="${l.word}" aria-label="${pictorial ? l.label : l.word}" ${correct ? 'disabled' : ''}>${pictorial ? sceneFor(l, true, true, true) : l.word}</button>`).join('')}</div>
        <p class="ps-feedback" role="status">${correct ? `${t.word} · ${t.label}` : ''}</p>
        ${correct ? nextButton() : '<button type="button" class="ps-help" data-action="review">👀 再看一次</button>'}`}`;
  }

  function finish() {
    window.speechEngine.stop();
    if (literacy()) { learning.round++; saveLearning(); }
    progress.textContent = '3 / 3';
    content.innerHTML = `<div class="ps-finish"><span aria-hidden="true">🐻 🌼</span><h3 tabindex="-1">三个任务都完成啦！</h3>
      <button type="button" class="ps-next" data-action="replay">${literacy() ? '继续认识 ➜' : '再玩一次 ↻'}</button>
      ${literacy() ? '<button type="button" class="ps-help" data-action="letter-groups">换一组</button>' : '<button type="button" class="ps-help" data-action="math-groups">换个数字游戏</button>'}
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
    if (action === 'start-phrases') return start('phrases');
    if (action === 'letter-groups' && literacy()) return showLetterGroups();
    if (action === 'letter-group' && literacy() && groupsForMode().some(g => g.id === button.dataset.group)) return startLetterRound(button.dataset.group);
    if (action === 'math-groups') return showMathGroups();
    if (action === 'number-game' && ['math', 'number', 'change', 'split'].includes(button.dataset.game)) return startNumberRound(button.dataset.game);
    if (action === 'lobby') return lobby();
    if (action === 'replay') {
      if (literacy()) return startLetterRound(letterGroup);
      return startNumberRound(mode);
    }
    if (action === 'next' && correct && index < 3) {
      index++;
      return index === 3 ? finish() : nextTask();
    }
    if (index >= 3) return;
    if (['number','change','split'].includes(mode)) return handleNumbers(button);
    if (mode === 'math') {
      const t = mathTasks[index];
      const passenger = Number(button.dataset.passenger);
      if (action === 'board' && !correct && passenger >= 0 && passenger < t.b && !arrived.includes(passenger) && boarded < t.b) {
        arrived.push(passenger);
        boarded = arrived.length;
        counted.clear(); counting = false;
        renderMath();
        say(practice ? 'countStep' : `n${t.a + boarded}`);
        const next = content.querySelector('.ps-board:not(:disabled), .ps-number-choice');
        if (next) next.focus({ preventScroll: true });
      } else if (action === 'practice') {
        practice = !practice; renderMath(); say(practice ? 'countPractice' : t.voice); focusControl('[data-action="practice"]');
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
    } else if (literacy()) {
      if (action === 'learn' && !quiz) {
        lessonSeen = true;
        const record = recordFor(letterTasks[index]);
        if (!record.introduced) record.introducedRound = learning.round;
        record.introduced = true; saveLearning();
        renderLetters(); say(`${letterTasks[index].voice}Name`); focusControl('[data-action="quiz"]');
      }
      else if (action === 'quiz' && lessonSeen && !quiz) { quiz = true; renderLetters(); say(`${letterTasks[index].voice}Quiz`); focusHeading(); }
      else if (action === 'review' && quiz && !correct) { helped = true; quiz = false; renderLetters(); say(`${letterTasks[index].voice}Learn`); focusControl('[data-action="learn"]'); }
      else if (action === 'word' && quiz && !correct) {
        if (button.dataset.word === letterTasks[index].word) {
          noteSuccess();
          correct = true; renderLetters(); say('rightLetter'); focusControl('[data-action="next"]');
        }
        else { helped = true; content.querySelector('.ps-feedback').textContent = '再试试，也可以再看一次'; say('retryLetter'); }
      }
    }
  });

  document.getElementById('card-goto-preschool').addEventListener('click', () => {
    main.classList.add('hidden');
    view.classList.remove('hidden');
    document.body.classList.add('preschool-mode', 'in-quiz-mode');
    lobby();
    say('welcomeStage1');
  });
  document.getElementById('preschool-back').addEventListener('click', () => {
    if (mode) { lobby(); return; }
    window.speechEngine.stop();
    view.classList.add('hidden'); main.classList.remove('hidden');
    document.body.classList.remove('preschool-mode', 'in-quiz-mode');
    document.getElementById('card-goto-preschool').focus();
  });
});
