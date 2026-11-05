/**
 * 乐学萌岛 - 语文成语与诗词具象化渲染引擎 (Chinese Visual & Animation Engine)
 * 打造寓言小剧场与水墨诗意画卷，支持字字拼音标注与点击语音朗读
 */

class ChineseVisualEngine {
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

  // ==================== 1. 成语小剧场渲染 ====================
  renderIdiom(q) {
    this.clear();
    if (!this.stage || !this.narration) return;

    // 顶部故事与发音按钮
    this.narration.innerHTML = `
      <div class="chinese-header-bar">
        <span class="story-tag">${q.sceneTitle}</span>
        <button id="btn-speech-story" class="btn-voice-pill" title="点击朗读故事">🔊 听故事</button>
      </div>
      <div class="chinese-story-text">${q.story}</div>
    `;

    // 绑定听故事按钮
    const btnSpeech = document.getElementById('btn-speech-story');
    if (btnSpeech) {
      btnSpeech.onclick = (e) => {
        e.stopPropagation();
        window.speechEngine.speakWithButton(btnSpeech, q.story);
      };
    }

    // 渲染成语动态小剧场舞台
    this._renderIdiomTheater(q);
  }

  _renderIdiomTheater(q) {
    const p = q.animProps;
    let sceneContent = '';

    switch (q.scene) {
      case 'well': // 井底之蛙
      case 'well_sky':
        sceneContent = `
          <div class="theater-well">
            <div class="well-sky"><span class="cloud-drift">${p.sky || '☁️'}</span><span class="sun-small">☀️</span></div>
            <div class="well-rim">🧱 井口 🧱</div>
            <div class="well-deep">
              <span class="frog-actor jump-actor">${p.animal || p.frog || '🐸'}</span>
              <span class="turtle-actor">${p.turtle || '🐢'}</span>
            </div>
          </div>
        `;
        break;

      case 'sheep_pen': // 亡羊补牢
        sceneContent = `
          <div class="theater-pen">
            <div class="pen-fence" id="fence-wall">
              <span class="fence-plank">🪵</span>
              <span class="fence-hole" id="fence-hole">🕳️ 破洞</span>
              <span class="fence-plank">🪵</span>
            </div>
            <div class="pen-ground">
              <span class="sheep-actor bounce-actor">${p.sheep}</span>
              <span class="wolf-actor prowl-actor">${p.wolf}</span>
              <span class="hammer-actor" id="hammer-tool">${p.hammer}</span>
            </div>
          </div>
        `;
        break;

      case 'forest_duo': // 狐假虎威
        sceneContent = `
          <div class="theater-forest">
            <div class="forest-trees">🌲 🌳 🌲 🌳</div>
            <div class="parade-row" id="parade-group">
              <span class="fox-actor proud-walk">${p.fox} (得意)</span>
              <span class="tiger-actor march-walk">${p.tiger} (威风)</span>
              <span class="flee-animals">${p.rabbit} ${p.deer} (害怕逃跑)</span>
            </div>
          </div>
        `;
        break;

      case 'sprout': // 拔苗助长
        sceneContent = `
          <div class="theater-field">
            <div class="sun-hot">${p.sun}</div>
            <div class="field-soil">
              <span class="farmer-actor">${p.farmer}</span>
              <span class="sprout-actor pull-actor" id="target-sprout">${p.plant}</span>
            </div>
          </div>
        `;
        break;

      case 'tree_stump': // 守株待兔
        sceneContent = `
          <div class="theater-stump">
            <div class="stump-scene">
              <span class="tree-big">${p.tree}</span>
              <span class="stump-item">${p.stump}</span>
              <span class="lazy-farmer">${p.farmer}</span>
              <span class="rabbit-runner run-crash">${p.rabbit}</span>
            </div>
          </div>
        `;
        break;

      case 'dragon': // 画龙点睛
        sceneContent = `
          <div class="theater-temple">
            <div class="temple-wall">
              <span class="dragon-body" id="dragon-art">${p.dragon}</span>
              <span class="magic-brush" id="magic-brush">${p.brush}</span>
              <span class="eye-spark hidden" id="eye-spark">${p.eye}</span>
            </div>
          </div>
        `;
        break;

      case 'boat_sword': // 刻舟求剑
        sceneContent = `
          <div class="theater-river">
            <div class="river-wave">🌊 🌊 🌊</div>
            <div class="boat-group">
              <span class="river-boat float-actor">${p.boat} <span class="boat-mark" id="boat-mark">✏️</span></span>
              <span class="falling-sword drop-actor">${p.sword}</span>
            </div>
          </div>
        `;
        break;

      default: // 通用生动图文小景
        const propKeys = Object.keys(p);
        const propIcons = propKeys.map(k => `<span class="prop-badge">${p[k]}</span>`).join(' ');
        sceneContent = `
          <div class="theater-generic">
            <div class="generic-icons-row">${propIcons}</div>
          </div>
        `;
    }

    this.stage.innerHTML = `
      <div class="chinese-theater-stage">
        ${sceneContent}
        <div id="idiom-live-bubble" class="enlighten-bubble glow">
          🧐 <strong>看动画猜成语：</strong> 画面描述的是哪个寓言故事呢？选出正确的成语吧！
        </div>
      </div>
    `;
  }

  // 答对成语后的高潮动效与小哲理演播
  celebrateIdiom(q, callback) {
    const bubble = document.getElementById('idiom-live-bubble');

    let transitioned = false;
    const doTransition = () => {
      if (!transitioned) {
        transitioned = true;
        if (callback) callback();
      }
    };

    // 1. 发音朗读成语与拼音：严格等待语音完整播放完毕后，再留出 1.2 秒余韵切题
    window.speechEngine.speak(`${q.word}。${q.meaning}`, () => {
      this._registerTimer(doTransition, 1200);
    });

    // 2. 动效高潮演播
    if (q.scene === 'dragon') {
      const eye = document.getElementById('eye-spark');
      const dragon = document.getElementById('dragon-art');
      if (eye) eye.classList.remove('hidden');
      if (dragon) dragon.classList.add('dragon-soar');
    } else if (q.scene === 'sheep_pen') {
      const hole = document.getElementById('fence-hole');
      if (hole) hole.innerHTML = '🪵 补齐啦！';
    }

    if (bubble) {
      bubble.innerHTML = `
        <div class="idiom-ruby-title">
          ${q.word.split('').map((char, i) => `<ruby>${char}<rt>${q.pinyin[i]}</rt></ruby>`).join('')}
          <button id="btn-skip-idiom" class="btn-skip-anim" style="vertical-align: middle; margin-left: 10px;" title="跳过等待，进入下一题">下一题 ⏩</button>
        </div>
        <div class="idiom-meaning-box">
          💡 <strong>做人的智慧：</strong> ${q.meaning}
        </div>
      `;
      bubble.classList.add('pulse');

      const btnSkip = document.getElementById('btn-skip-idiom');
      if (btnSkip) {
        btnSkip.onclick = (e) => {
          e.stopPropagation();
          doTransition();
        };
      }
    }

    // 异常超时保底保护（最多等待 15 秒）
    this._registerTimer(doTransition, 15000);
  }

  // ==================== 2. 诗情画意集渲染 ====================
  renderPoetry(q) {
    this.clear();
    if (!this.stage || !this.narration) return;

    // 顶部诗名、朝代作者与朗读整句按钮
    this.narration.innerHTML = `
      <div class="chinese-header-bar">
        <span class="story-tag">📜 《${q.title}》· [${q.dynasty}] ${q.author}</span>
        <button id="btn-speech-poem" class="btn-voice-pill" title="点击朗读诗句">🔊 听诗句</button>
      </div>
      <div class="chinese-story-text">
        <span class="poem-meaning-preview">📖 诗意：${q.meaning}</span>
      </div>
    `;

    const btnSpeech = document.getElementById('btn-speech-poem');
    if (btnSpeech) {
      btnSpeech.onclick = (e) => {
        e.stopPropagation();
        window.speechEngine.speakWithButton(btnSpeech, `${q.title}。${q.author}。${q.line}`);
      };
    }

    // 渲染动态诗境画卷
    this._renderPoetryScroll(q);
  }

  _renderPoetryScroll(q) {
    const p = q.animProps;
    const propIcons = Object.keys(p).map(k => `<span class="scroll-element bounce-slow">${p[k]}</span>`).join(' ');

    // 构造挖空关键诗词的带拼音诗句
    const fullRuby = q.pinyinArr.map(([char, py]) => {
      if (!py) return `<span class="punct">${char}</span>`;
      return `<ruby>${char}<rt>${py}</rt></ruby>`;
    }).join('');

    // 替换挖空部分
    const maskedRuby = fullRuby.replace(
      new RegExp(q.missingWord.split('').map(c => `<ruby>${c}<rt>.*?</rt></ruby>`).join(''), 'g'),
      `<span class="poem-hole-box">❓ 点击下方填词</span>`
    );

    this.stage.innerHTML = `
      <div class="poetry-scroll-stage">
        <!-- 诗画意境画卷 -->
        <div class="poetry-scroll-canvas" id="poetry-canvas">
          <div class="scenery-backdrop">${propIcons}</div>
        </div>

        <!-- 带拼音的诗句展示区 (包含挖空点睛处) -->
        <div class="poem-verse-card" id="poem-verse-display">
          ${maskedRuby}
        </div>

        <div id="poetry-live-bubble" class="enlighten-bubble glow">
          🌸 <strong>画中寻诗：</strong> 哪一组词语填入诗句中，最符合画卷的优美意境呢？
        </div>
      </div>
    `;
  }

  // 答对诗词后的画境点亮与全文朗诵
  celebratePoetry(q, callback) {
    const bubble = document.getElementById('poetry-live-bubble');
    const verseDisplay = document.getElementById('poem-verse-display');
    const canvas = document.getElementById('poetry-canvas');

    // 1. 点亮画卷
    if (canvas) canvas.classList.add('canvas-glowing');

    // 2. 补全完整带拼音的诗句
    const fullRuby = q.pinyinArr.map(([char, py]) => {
      if (!py) return `<span class="punct">${char}</span>`;
      return `<ruby class="verse-char-glowing">${char}<rt>${py}</rt></ruby>`;
    }).join('');
    if (verseDisplay) verseDisplay.innerHTML = fullRuby;

    // 3. 防重复切题状态阀
    let transitioned = false;
    const doTransition = () => {
      if (!transitioned) {
        transitioned = true;
        if (callback) callback();
      }
    };

    // 4. 语音悠扬朗读：严格等待朗诵完整播放完毕，再留出 1.2 秒余韵切题
    window.speechEngine.speak(`${q.line}。${q.meaning}`, () => {
      this._registerTimer(doTransition, 1200);
    });

    if (bubble) {
      bubble.innerHTML = `
        <div class="poem-congrats-title">
          <span>🎉 妙笔点睛！诗画相融</span>
          <button id="btn-skip-poem" class="btn-skip-anim" style="vertical-align: middle; margin-left: 10px;" title="跳过等待，进入下一题">下一题 ⏩</button>
        </div>
        <div class="poem-insight-text">
          🌟 <strong>诗意赏析：</strong> ${q.meaning}
        </div>
      `;
      bubble.classList.add('pulse');

      const btnSkip = document.getElementById('btn-skip-poem');
      if (btnSkip) {
        btnSkip.onclick = (e) => {
          e.stopPropagation();
          doTransition();
        };
      }
    }

    // 异常超时保底保护（长诗词最多等待 25 秒）
    this._registerTimer(doTransition, 25000);
  }
}

// 导出全局单例
window.chineseVisualEngine = new ChineseVisualEngine('visual-stage', 'story-narration');
