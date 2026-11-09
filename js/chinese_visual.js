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

    // 顶部短问题、听故事与展开全文按钮 (答前不剧透成语名称与哲理)
    const shortQuestion = q.actionQuestion || '请根据故事选择：';

    this.narration.innerHTML = `
      <div class="chinese-header-bar">
        <span class="story-tag font-question">🤔 ${shortQuestion}</span>
        <div class="header-action-btns">
          <button id="btn-speech-story" class="btn-voice-pill" title="点击朗读故事">🔊 听故事</button>
          <button id="btn-toggle-story" class="btn-voice-pill" title="展开阅读故事">📖 看故事</button>
        </div>
      </div>
      <div class="chinese-story-text hidden" id="chinese-story-detail">${q.story}</div>
    `;

    // 绑定听故事按钮
    const btnSpeech = document.getElementById('btn-speech-story');
    if (btnSpeech) {
      btnSpeech.onclick = (e) => {
        e.stopPropagation();
        window.speechEngine.speakWithButton(btnSpeech, q.story);
      };
    }

    // 绑定展开阅读故事按钮
    const btnToggle = document.getElementById('btn-toggle-story');
    const storyDetail = document.getElementById('chinese-story-detail');
    if (btnToggle && storyDetail) {
      btnToggle.onclick = (e) => {
        e.stopPropagation();
        const isHidden = storyDetail.classList.contains('hidden');
        if (isHidden) {
          storyDetail.classList.remove('hidden');
          btnToggle.textContent = '收起故事';
        } else {
          storyDetail.classList.add('hidden');
          btnToggle.textContent = '📖 看故事';
        }
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
          听故事，想一想
        </div>
      </div>
    `;
  }

  // 答对成语后的高潮动效与小哲理演播
  celebrateIdiom(q) {
    const bubble = document.getElementById('idiom-live-bubble');

    // 1. 发音朗读成语与寓意 (使用本地 MP3 完整匹配索引 `${word}。${meaning}`)
    window.speechEngine.speak(`${q.word}。${q.meaning}`);

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
        </div>
        <div class="idiom-meaning-box">
          💡 <strong>${q.insight || q.meaning}</strong>
        </div>
      `;
      bubble.classList.add('pulse');
    }
  }

  // ==================== 2. 诗情画意集渲染 ====================
  renderPoetry(q) {
    this.clear();
    if (!this.stage || !this.narration) return;

    // 顶部诗名、朝代作者与朗读整句按钮
    this.narration.innerHTML = `
      <div class="chinese-header-bar">
        <span class="story-tag">📜 《${q.title}》· [${q.dynasty}] ${q.author}</span>
        <button id="btn-speech-poem" class="btn-voice-pill" title="点击朗读诗句">🔊 听朗读</button>
      </div>
    `;

    const btnSpeech = document.getElementById('btn-speech-poem');
    if (btnSpeech) {
      btnSpeech.onclick = (e) => {
        e.stopPropagation();
        window.speechEngine.speakWithButton(btnSpeech, `${q.title}。${q.author}。${q.line}`);
      };
    }

    // 渲染动态水墨诗意画卷与点睛填句
    this._renderPoetryScroll(q);
  }

  _formatPoemLines(pinyinArr, missingWord = null) {
    // 找出句中最后一个标点符号，通常逗号在前半句末尾
    // 例如：'鹅，鹅，鹅，曲项向天歌。' -> 最后一个逗号在第3个'鹅，'后面
    let lastCommaIdx = -1;
    for (let i = 0; i < pinyinArr.length; i++) {
      if (pinyinArr[i][0] === '，' || pinyinArr[i][0] === ',') {
        lastCommaIdx = i;
      }
    }

    const renderSegment = (start, end) => {
      return pinyinArr.slice(start, end).map(([char, py]) => {
        if (!py) return `<span class="punct">${char}</span>`;
        return `<ruby>${char}<rt>${py}</rt></ruby>`;
      }).join('');
    };

    let line1 = '';
    let line2 = '';
    if (lastCommaIdx !== -1 && lastCommaIdx < pinyinArr.length - 1) {
      line1 = renderSegment(0, lastCommaIdx + 1);
      line2 = renderSegment(lastCommaIdx + 1, pinyinArr.length);
    } else {
      const half = Math.floor(pinyinArr.length / 2);
      line1 = renderSegment(0, half);
      line2 = renderSegment(half, pinyinArr.length);
    }

    if (missingWord) {
      const missingRubyPattern = missingWord.split('').map(c => `<ruby>${c}<rt>.*?</rt></ruby>`).join('');
      const holeHtml = `<span class="poem-hole-box">？</span>`;
      const reg = new RegExp(missingRubyPattern, 'g');
      if (reg.test(line1)) {
        line1 = line1.replace(new RegExp(missingRubyPattern, 'g'), holeHtml);
      } else {
        line2 = line2.replace(new RegExp(missingRubyPattern, 'g'), holeHtml);
      }
    }

    return `
      <div class="poem-verse-line poem-line-1">${line1}</div>
      <div class="poem-verse-line poem-line-2">${line2}</div>
    `;
  }

  _renderPoetryScroll(q) {
    const maskedLines = this._formatPoemLines(q.pinyinArr, q.missingWord);
    const imagePath = `assets/images/poems/v2/${q.id}.webp`;

    this.stage.innerHTML = `
      <div class="poetry-scroll-stage">
        <!-- 专属古典国风绘本画面 (3:2 比例，大画面，无文字) -->
        <div class="poetry-scroll-canvas" id="poetry-canvas">
          <div class="poem-art-image-wrapper">
            <img src="${imagePath}" alt="${q.title}绘本图" class="poem-art-img" id="poem-art-img" onerror="this.style.display='none'; const fb = document.getElementById('poem-art-fallback'); if (fb) fb.style.display='flex';">
            <div id="poem-art-fallback" style="display: none; width: 100%;" class="poem-fallback-box">
              <span class="poem-fallback-text">🎨 画面准备中</span>
            </div>
          </div>
        </div>

        <!-- 带拼音的两行诗句展示区 (包含单字/小词？挖空点睛处) -->
        <div class="poem-verse-card" id="poem-verse-display">
          ${maskedLines}
        </div>

        <div id="poetry-live-bubble" class="enlighten-bubble hidden"></div>
      </div>
    `;
  }

  // 答对诗词后的画境点亮与补齐诗句
  celebratePoetry(q) {
    const bubble = document.getElementById('poetry-live-bubble');
    const verseDisplay = document.getElementById('poem-verse-display');
    const canvas = document.getElementById('poetry-canvas');

    // 1. 点亮画卷与大图
    if (canvas) canvas.classList.add('canvas-glowing');
    const artImg = document.getElementById('poem-art-img');
    if (artImg) artImg.classList.add('img-glowing');

    // 2. 补全完整带拼音的两行诗句 (无挖空)
    if (verseDisplay) {
      verseDisplay.innerHTML = this._formatPoemLines(q.pinyinArr, null);
    }

    // 3. 语音朗读：使用本地已存在的 MP3 索引 `${title}。${author}。${line}`，默认只朗读诗句
    window.speechEngine.speak(`${q.title}。${q.author}。${q.line}`);

    if (bubble) {
      bubble.classList.remove('hidden');
      bubble.innerHTML = `
        <div class="poem-congrats-title">
          <span>🎉 读一读这两句吧</span>
          <button id="btn-toggle-meaning" class="btn-voice-pill" style="margin-left: 10px;">📜 看看诗意</button>
        </div>
        <div id="poem-meaning-detail" class="poem-insight-text hidden">
          🌟 <strong>诗意赏析：</strong> ${q.meaning}
        </div>
      `;
      bubble.classList.add('pulse');

      const btnToggle = document.getElementById('btn-toggle-meaning');
      const meaningDetail = document.getElementById('poem-meaning-detail');
      if (btnToggle && meaningDetail) {
        btnToggle.onclick = (e) => {
          e.stopPropagation();
          const isHidden = meaningDetail.classList.contains('hidden');
          if (isHidden) {
            meaningDetail.classList.remove('hidden');
            btnToggle.textContent = '收起诗意';
          } else {
            meaningDetail.classList.add('hidden');
            btnToggle.textContent = '📜 看看诗意';
          }
        };
      }
    }
  }

  // 场景内提示方法 (供 app.js 答错分支调用)
  showHint(q, errorsCount) {
    if (q.type === 'idiom') {
      const bubble = document.getElementById('idiom-live-bubble');
      if (bubble) {
        bubble.innerHTML = errorsCount >= 2 ? `<span>💡 提示：再听一遍故事吧！</span>` : `<span>再想想看！🤔</span>`;
        bubble.classList.remove('pulse-attention');
        void bubble.offsetWidth;
        bubble.classList.add('pulse-attention');
      }
    } else if (q.type === 'poem') {
      const bubble = document.getElementById('poetry-live-bubble');
      if (bubble) {
        bubble.classList.remove('hidden');
        bubble.innerHTML = errorsCount >= 2 ? `<span>💡 仔细看画面上的景物和细节哦！</span>` : `<span>再选一次试试看！🌸</span>`;
        bubble.classList.remove('pulse-attention');
        void bubble.offsetWidth;
        bubble.classList.add('pulse-attention');
      }
    }
  }
}

// 导出全局单例
window.chineseVisualEngine = new ChineseVisualEngine('visual-stage', 'story-narration');
