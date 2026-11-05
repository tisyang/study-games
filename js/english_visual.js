/**
 * 乐学萌岛 - 英语探索岛：情境救急小剧场具象化渲染引擎 (English Visual & Animation Engine)
 * 设计哲学：零中文翻译，纯英文语感，依靠生动动效、生活常识与纯正地道原声建立直接神经反射
 */

class EnglishVisualEngine {
  constructor(stageContainerId, narrationContainerId) {
    this.stage = document.getElementById(stageContainerId);
    this.narration = document.getElementById(narrationContainerId);
    this.activeTimers = [];
  }

  clear() {
    this.activeTimers.forEach(t => clearTimeout(t));
    this.activeTimers = [];
    if (this.stage) this.stage.innerHTML = '';
  }

  _registerTimer(fn, delay) {
    const t = setTimeout(fn, delay);
    this.activeTimers.push(t);
    return t;
  }

  // ==================== 1. 情境危机场景渲染 ====================
  renderStory(q) {
    this.clear();
    if (!this.stage || !this.narration) return;

    // 顶部纯英文原声栏与语音气泡 (无中文，纯情境原声)
    this.narration.innerHTML = `
      <div class="english-header-bar">
        <span class="story-tag">🆘 ${q.title}</span>
        <button id="btn-speech-english" class="btn-voice-pill english-voice" title="Listen to story">🔊 Listen</button>
      </div>
      <div class="english-speech-balloon">
        <span class="speech-quote">“${q.crisisSpeech}”</span>
      </div>
    `;

    // 绑定朗读按键
    const btnSpeech = document.getElementById('btn-speech-english');
    if (btnSpeech) {
      btnSpeech.onclick = (e) => {
        e.stopPropagation();
        window.speechEngine.speakEnglishWithButton(btnSpeech, q.crisisSpeech);
      };
    }

    // 延迟 300ms 自动轻声播放情境英文，加深沉浸听感
    this._registerTimer(() => {
      if (window.speechEngine && btnSpeech) {
        window.speechEngine.speakEnglishWithButton(btnSpeech, q.crisisSpeech);
      }
    }, 350);

    // 渲染动态危机视觉舞台
    this._renderCrisisTheater(q);
  }

  _renderCrisisTheater(q) {
    let theaterHtml = '';

    switch (q.scene) {
      case 'rain_bunny':
        theaterHtml = `
          <div class="theater-crisis-box bg-rainy" id="theater-box">
            <div class="weather-effects rain-layer">
              <span class="rain-drop d1">💧</span>
              <span class="rain-drop d2">💧</span>
              <span class="rain-drop d3">💧</span>
              <span class="rain-drop d4">💧</span>
            </div>
            <div class="scene-actors" id="scene-actors">
              <div class="actor-cold-box">
                <span class="actor-emoji shiver-actor" id="main-actor">🐰</span>
                <span class="puddle-emoji">💦 💦</span>
              </div>
            </div>
          </div>
        `;
        break;

      case 'hot_lion':
        theaterHtml = `
          <div class="theater-crisis-box bg-sunny" id="theater-box">
            <div class="weather-effects">
              <span class="sun-blazing spin-slow">☀️</span>
            </div>
            <div class="scene-actors" id="scene-actors">
              <div class="actor-sweat-box">
                <span class="sweat-drop s1">💦</span>
                <span class="actor-emoji pant-actor" id="main-actor">🦁</span>
                <span class="sweat-drop s2">💦</span>
              </div>
            </div>
          </div>
        `;
        break;

      case 'dark_room':
        theaterHtml = `
          <div class="theater-crisis-box bg-night" id="theater-box">
            <div class="weather-effects">
              <span class="moon-star">🌙 ⭐</span>
            </div>
            <div class="scene-actors" id="scene-actors">
              <div class="actor-scared-box">
                <span class="actor-emoji scared-actor" id="main-actor">🐻</span>
              </div>
            </div>
          </div>
        `;
        break;

      case 'hungry_puppy':
        theaterHtml = `
          <div class="theater-crisis-box bg-kitchen" id="theater-box">
            <div class="weather-effects">
              <span class="thought-bubble-food">💭 ❓</span>
            </div>
            <div class="scene-actors" id="scene-actors">
              <div class="actor-hungry-box">
                <span class="empty-bowl">🥣</span>
                <span class="actor-emoji belly-growl" id="main-actor">🐕</span>
              </div>
            </div>
          </div>
        `;
        break;

      case 'muddy_pig':
        theaterHtml = `
          <div class="theater-crisis-box bg-muddy" id="theater-box">
            <div class="weather-effects">
              <span class="mud-splatters">🐾 💦 🐾</span>
            </div>
            <div class="scene-actors" id="scene-actors">
              <div class="actor-dirty-box">
                <span class="mud-spot">💩</span>
                <span class="actor-emoji wiggle-actor" id="main-actor">🐷</span>
                <span class="mud-spot">💩</span>
              </div>
            </div>
          </div>
        `;
        break;

      case 'high_bananas':
        theaterHtml = `
          <div class="theater-crisis-box bg-jungle" id="theater-box">
            <div class="weather-effects">
              <div class="high-tree-branch">
                <span class="branch-leaf">🌴</span>
                <span class="high-fruit bounce-fruit">🍌 🍌</span>
              </div>
            </div>
            <div class="scene-actors" id="scene-actors">
              <div class="actor-reach-box">
                <span class="actor-emoji jump-reach" id="main-actor">🐵</span>
              </div>
            </div>
          </div>
        `;
        break;

      case 'freezing_penguin':
        theaterHtml = `
          <div class="theater-crisis-box bg-snowy" id="theater-box">
            <div class="weather-effects snow-layer">
              <span class="snow-flake f1">❄️</span>
              <span class="snow-flake f2">❄️</span>
              <span class="snow-flake f3">❄️</span>
            </div>
            <div class="scene-actors" id="scene-actors">
              <div class="actor-freezing-box">
                <span class="actor-emoji shiver-actor" id="main-actor">🐧</span>
                <span class="ice-ground">🧊 🧊</span>
              </div>
            </div>
          </div>
        `;
        break;

      case 'thirsty_duck':
        theaterHtml = `
          <div class="theater-crisis-box bg-dryfield" id="theater-box">
            <div class="weather-effects">
              <span class="sun-blazing spin-slow">☀️</span>
            </div>
            <div class="scene-actors" id="scene-actors">
              <div class="actor-thirsty-box">
                <span class="actor-emoji pant-actor" id="main-actor">🦆</span>
                <span class="dry-ground">🌾 💨</span>
              </div>
            </div>
          </div>
        `;
        break;

      case 'sleepy_cat':
        theaterHtml = `
          <div class="theater-crisis-box bg-cozyroom" id="theater-box">
            <div class="weather-effects">
              <span class="sleep-zzz">💤 💤</span>
            </div>
            <div class="scene-actors" id="scene-actors">
              <div class="actor-sleepy-box">
                <span class="yarn-toy">🧶</span>
                <span class="actor-emoji yawn-actor" id="main-actor">🐱</span>
              </div>
            </div>
          </div>
        `;
        break;

      case 'messy_room':
        theaterHtml = `
          <div class="theater-crisis-box bg-messy" id="theater-box">
            <div class="weather-effects scattered-toys" id="scattered-toys">
              <span class="toy-item t1">🧸</span>
              <span class="toy-item t2">🚗</span>
              <span class="toy-item t3">🧩</span>
            </div>
            <div class="scene-actors" id="scene-actors">
              <div class="actor-mess-box">
                <span class="actor-emoji worried-actor" id="main-actor">🐕</span>
              </div>
            </div>
          </div>
        `;
        break;

      case 'birthday_candles':
        theaterHtml = `
          <div class="theater-crisis-box bg-party" id="theater-box">
            <div class="weather-effects">
              <span class="party-balloons float-gentle">🎈 🎈</span>
            </div>
            <div class="scene-actors" id="scene-actors">
              <div class="actor-party-box">
                <span class="birthday-cake" id="cake-display">🎂</span>
                <span class="actor-emoji wait-actor" id="main-actor">👧</span>
              </div>
            </div>
          </div>
        `;
        break;

      case 'flying_kite':
        theaterHtml = `
          <div class="theater-crisis-box bg-field" id="theater-box">
            <div class="weather-effects">
              <span class="cloud-still">☁️ ☁️</span>
            </div>
            <div class="scene-actors" id="scene-actors">
              <div class="actor-kite-box">
                <span class="kite-item" id="kite-item">🪁</span>
                <span class="actor-emoji wait-actor" id="main-actor">👧</span>
              </div>
            </div>
          </div>
        `;
        break;

      default:
        theaterHtml = `
          <div class="theater-crisis-box bg-plain" id="theater-box">
            <div class="scene-actors" id="scene-actors">
              <span class="actor-emoji" id="main-actor">${q.actor || '🐾'}</span>
            </div>
          </div>
        `;
    }

    this.stage.innerHTML = `
      <div class="english-theater-stage">
        ${theaterHtml}
        <div class="english-interactive-tip">
          🎯 <strong>Hero Rescue:</strong> What can help? Pick a tool below!
        </div>
      </div>
    `;
  }

  // ==================== 2. 救援成功庆祝动画 ====================
  celebrateRescue(q, callback) {
    const box = document.getElementById('theater-box');
    const actors = document.getElementById('scene-actors');
    const balloon = document.querySelector('.english-speech-balloon');

    // 1. 舞台施加得救高亮光环
    if (box) box.classList.add('crisis-solved');

    // 2. 根据场景展示救援成功的具体动态画面
    if (actors) {
      switch (q.scene) {
        case 'rain_bunny':
          actors.innerHTML = `
            <div class="actor-happy-box bounce-hero">
              <span class="hero-tool-display float-pop">☂️</span>
              <span class="actor-emoji smile-actor">🐰</span>
              <span class="love-hearts">💖 💖</span>
            </div>
          `;
          break;

        case 'hot_lion':
          actors.innerHTML = `
            <div class="actor-happy-box bounce-hero">
              <span class="hero-tool-display float-pop">🧊</span>
              <span class="actor-emoji smile-actor">🦁</span>
              <span class="cool-stars">✨ ❄️ ✨</span>
            </div>
          `;
          break;

        case 'dark_room':
          if (box) {
            box.classList.remove('bg-night');
            box.classList.add('bg-bright-room');
          }
          actors.innerHTML = `
            <div class="actor-happy-box glow-bright">
              <span class="hero-tool-display glow-lamp">💡</span>
              <span class="actor-emoji smile-actor">🐻</span>
              <span class="room-sparkles">🌟 🌟</span>
            </div>
          `;
          break;

        case 'hungry_puppy':
          actors.innerHTML = `
            <div class="actor-happy-box bounce-hero">
              <span class="hero-tool-display munch-bone">🦴</span>
              <span class="actor-emoji wag-tail">🐕</span>
              <span class="happy-notes">🎵 😋</span>
            </div>
          `;
          break;

        case 'muddy_pig':
          actors.innerHTML = `
            <div class="actor-happy-box bounce-hero">
              <span class="hero-tool-display bubble-wash">🧼 🫧</span>
              <span class="actor-emoji clean-actor">🐷</span>
              <span class="sparkle-clean">✨ 🌸 ✨</span>
            </div>
          `;
          break;

        case 'high_bananas':
          actors.innerHTML = `
            <div class="actor-happy-box climb-up">
              <span class="hero-tool-display">🪜</span>
              <span class="actor-emoji happy-monkey">🐵 🍌</span>
              <span class="celebrate-cheer">🎉 🎉</span>
            </div>
          `;
          break;

        case 'freezing_penguin':
          actors.innerHTML = `
            <div class="actor-happy-box bounce-hero">
              <span class="hero-tool-display warm-scarf">🧣</span>
              <span class="actor-emoji warm-penguin">🐧</span>
              <span class="love-hearts">❤️ ☀️</span>
            </div>
          `;
          break;

        case 'thirsty_duck':
          actors.innerHTML = `
            <div class="actor-happy-box bounce-hero">
              <span class="hero-tool-display fresh-water">💧 🥤</span>
              <span class="actor-emoji swim-duck">🦆</span>
              <span class="water-splash">💦 🌟</span>
            </div>
          `;
          break;

        case 'sleepy_cat':
          actors.innerHTML = `
            <div class="actor-happy-box snuggle-box">
              <span class="hero-tool-display">🛏️</span>
              <span class="actor-emoji sleep-cat">🐱</span>
              <span class="sleep-zzz">💤 💖 💤</span>
            </div>
          `;
          break;

        case 'messy_room':
          const toys = document.getElementById('scattered-toys');
          if (toys) toys.style.display = 'none';
          actors.innerHTML = `
            <div class="actor-happy-box bounce-hero">
              <span class="hero-tool-display tidy-box">📦 ✨</span>
              <span class="actor-emoji proud-dog">🐕</span>
              <span class="sparkle-clean">🌟 🏆</span>
            </div>
          `;
          break;

        case 'birthday_candles':
          actors.innerHTML = `
            <div class="actor-happy-box cheer-party">
              <span class="birthday-cake lit-candles">🎂 🔥</span>
              <span class="actor-emoji cheer-girl">👧 🥳</span>
              <span class="confetti-burst">🎉 🎊</span>
            </div>
          `;
          break;

        case 'flying_kite':
          actors.innerHTML = `
            <div class="actor-happy-box soar-kite">
              <span class="hero-tool-display breeze-wind">💨</span>
              <span class="kite-fly">🪁 ☁️</span>
              <span class="actor-emoji cheer-girl">👧</span>
            </div>
          `;
          break;

        default:
          actors.innerHTML = `
            <div class="actor-happy-box bounce-hero">
              <span class="hero-tool-display">${q.correctTool}</span>
              <span class="actor-emoji">${q.actor || '🐾'}</span>
              <span class="love-hearts">💖</span>
            </div>
          `;
      }
    }

    // 3. 防重复切题状态阀
    let transitioned = false;
    const doTransition = () => {
      if (!transitioned) {
        transitioned = true;
        if (callback) callback();
      }
    };

    // 4. 原声感谢气泡跳动展示（附带“下一题 ⏩”微按键，自由跳过）
    if (balloon) {
      balloon.innerHTML = `
        <span class="speech-quote thank-you-quote">“${q.thankYouSpeech}”</span>
        <button id="btn-skip-english" class="btn-skip-anim" title="跳过等待，进入下一题">下一题 ⏩</button>
      `;
      balloon.classList.add('balloon-cheer');

      const btnSkip = document.getElementById('btn-skip-english');
      if (btnSkip) {
        btnSkip.onclick = (e) => {
          e.stopPropagation();
          doTransition();
        };
      }
    }

    // 5. 纯正美音朗诵感谢语：严格等待音频完整播放完毕后，再留出 1.2 秒给孩子享受成功的画面余韵，然后才切入下一题
    window.speechEngine.speakEnglish(q.thankYouSpeech, () => {
      this._registerTimer(doTransition, 1200);
    });

    // 6. 异常超时保底保护（若浏览器禁音或报错，最多等待 9 秒自动切题，防游戏卡死）
    this._registerTimer(doTransition, 9000);
  }
}

// 导出全局单例
window.englishVisualEngine = new EnglishVisualEngine('visual-stage', 'story-narration');
