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

    // 顶部诗名、朝代作者与朗读整句按钮 (去除提前剧透诗意长文，保持画面纯净)
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

  _renderPoetryScroll(q) {
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
        <!-- 专属诗意画卷 (32首古诗1:1定制意境图) -->
        <div class="poetry-scroll-canvas" id="poetry-canvas">
          ${this._renderPoemArtScene(q)}
        </div>

        <!-- 带拼音的诗句展示区 (包含挖空点睛处) -->
        <div class="poem-verse-card" id="poem-verse-display">
          ${maskedRuby}
        </div>

        <div id="poetry-live-bubble" class="enlighten-bubble glow">
          🌸 <strong>画中寻诗：</strong> 请观察上方画卷意境，选出最贴合的诗句词语！
        </div>
      </div>
    `;
  }

  // 32 首课标古诗针对性意境渲染引擎 (消除符号拼凑感，呈现生动水墨诗境)
  _renderPoemArtScene(q) {
    const s = q.scene;
    switch (s) {
      case 'goose_lake': // p1: 白毛浮绿水，红掌拨清波。
        return `
          <div class="poem-scene bg-lake">
            <div class="art-layer-sky"><span class="cloud-drift">☁️</span></div>
            <div class="art-layer-scenery">
              <span class="lake-reeds">🌿</span>
              <span class="lake-lotus">🪷 碧绿水波</span>
            </div>
            <div class="art-layer-water">
              <span class="water-ripple r1">〰️</span>
              <span class="water-ripple r2">〰️</span>
            </div>
            <div class="art-layer-actors">
              <span class="actor-goose float-actor">🦢</span>
              <span class="red-palm-badge">🪸 红掌拨波</span>
            </div>
          </div>
        `;

      case 'goose_sing': // p2: 鹅，鹅，鹅，曲项向天歌。
        return `
          <div class="poem-scene bg-blue-sky">
            <div class="art-layer-sky">
              <span class="sun-small">☀️</span>
              <span class="cloud-drift">☁️</span>
              <span class="music-note n1">🎵</span>
              <span class="music-note n2">🎶</span>
            </div>
            <div class="art-layer-scenery"><span class="lake-reeds">🌾 🌿 湖畔芦苇</span></div>
            <div class="art-layer-actors">
              <span class="actor-goose goose-neck-sing">🦢 (引吭向天高歌)</span>
            </div>
          </div>
        `;

      case 'spring_birds': // p3: 春眠不觉晓，处处闻啼鸟。
        return `
          <div class="poem-scene bg-morning">
            <div class="art-layer-sky">
              <span class="sun-morning">🌅 晨光破晓</span>
              <span class="chirp-notes">🎶 处处啼鸟</span>
            </div>
            <div class="art-layer-scenery">
              <span class="window-frame">🪟</span>
              <span class="spring-branch">🌸 🌿 春意盎然</span>
            </div>
            <div class="art-layer-actors">
              <span class="actor-bird jump-actor b1">🐦</span>
              <span class="actor-bird jump-actor b2">🐤</span>
            </div>
          </div>
        `;

      case 'falling_petals': // p4: 夜来风雨声，花落知多少。
        return `
          <div class="poem-scene bg-misty-rain">
            <div class="art-layer-sky">
              <span class="rain-cloud">🌧️ 细雨潇潇</span>
              <span class="wind-drift">🍃</span>
            </div>
            <div class="art-layer-scenery"><span class="spring-branch">🌸 🌺</span></div>
            <div class="art-layer-petals">
              <span class="falling-petal p1">🌸</span>
              <span class="falling-petal p2">🌸</span>
              <span class="falling-petal p3">🌸 花落知多少</span>
              <span class="rain-puddle">💧 💧</span>
            </div>
          </div>
        `;

      case 'moon_window': // p5: 床前明月光，疑是地上霜。
        return `
          <div class="poem-scene bg-night-sky">
            <div class="art-layer-sky">
              <span class="full-moon-glow">🌕 皎洁明月</span>
              <span class="stars-twinkle">✨ ✨</span>
            </div>
            <div class="art-layer-scenery"><span class="window-frame">🪟 月光入轩</span></div>
            <div class="art-layer-actors">
              <span class="bed-item">🛏️ 床前</span>
              <span class="frost-floor">❄️ 疑是地上白霜 ❄️</span>
            </div>
          </div>
        `;

      case 'poet_moon': // p6: 举头望明月，低头思故乡。
        return `
          <div class="poem-scene bg-deep-night">
            <div class="art-layer-sky">
              <span class="full-moon-glow">🌕 举头望明月</span>
              <span class="stars-twinkle">✨</span>
            </div>
            <div class="art-layer-scenery"><span class="pavilion-fence">⛩️ 凭栏远眺</span></div>
            <div class="art-layer-actors">
              <span class="poet-actor">🧑‍🦰 👘 (低头思故乡)</span>
              <span class="hometown-tag">🏡 远方故园</span>
            </div>
          </div>
        `;

      case 'farmer_sun': // p7: 锄禾日当午，汗滴禾下土。
        return `
          <div class="poem-scene bg-hot-field">
            <div class="art-layer-sky">
              <span class="blazing-sun spin-slow">☀️ 正午烈日</span>
            </div>
            <div class="art-layer-scenery">
              <span class="crop-row">🌱 🌱 禾苗田垄 🌱 🌱</span>
            </div>
            <div class="art-layer-actors">
              <span class="farmer-hoe">👨‍🌾 🌾 (辛勤锄禾)</span>
              <span class="sweat-drop s1">💦 汗滴禾下土</span>
            </div>
          </div>
        `;

      case 'rice_bowl': // p8: 谁知盘中餐，粒粒皆辛苦。
        return `
          <div class="poem-scene bg-warm-meal">
            <div class="art-layer-sky">
              <span class="meal-steam">♨️ 粒粒皆辛苦 ♨️</span>
            </div>
            <div class="art-layer-scenery">
              <span class="grain-stalks">🌾 🌾 金黄稻穗</span>
            </div>
            <div class="art-layer-actors">
              <span class="rice-bowl-big">🍚 盘中餐</span>
              <span class="pearl-rice">✨ 粒粒晶莹 ✨</span>
            </div>
          </div>
        `;

      case 'yellow_river': // p9: 白日依山尽，黄河入海流。
        return `
          <div class="poem-scene bg-yellow-river">
            <div class="art-layer-sky">
              <span class="setting-sun sun-sink">☀️ 白日依山尽</span>
              <span class="mountain-ridges">⛰️ 🏔️ 群山苍茫</span>
            </div>
            <div class="art-layer-water">
              <span class="river-wave w1">🌊 🌊</span>
              <span class="river-wave w2">🌊 黄河入海流 🌊</span>
            </div>
          </div>
        `;

      case 'climb_tower': // p10: 欲穷千里目，更上一层楼。
        return `
          <div class="poem-scene bg-climb-tower">
            <div class="art-layer-sky">
              <span class="cloud-drift">☁️ 云海漫卷</span>
              <span class="soar-eagle">🦅</span>
            </div>
            <div class="art-layer-scenery">
              <span class="tower-grand">🏯 鹳雀高楼</span>
              <span class="tower-stairs">🪜 更上一层楼</span>
            </div>
            <div class="art-layer-actors">
              <span class="vista-tag">🌄 欲穷千里目</span>
            </div>
          </div>
        `;

      case 'lotus_dragonfly': // p11: 小荷才露尖尖角，早有蜻蜓立上头。
        return `
          <div class="poem-scene bg-lotus-pond">
            <div class="art-layer-scenery">
              <span class="pond-leaf">🪷 🍀 清水池塘</span>
            </div>
            <div class="art-layer-actors">
              <div class="sharp-lotus-box">
                <span class="sharp-lotus">🪷 尖尖小荷</span>
                <span class="actor-dragonfly flutter">🚁 蜻蜓立上头</span>
              </div>
            </div>
          </div>
        `;

      case 'spring_stream': // p12: 泉眼无声惜细流，树阴照水爱晴柔。
        return `
          <div class="poem-scene bg-stream-shadow">
            <div class="art-layer-sky"><span class="gentle-sun">☀️ 晴柔和光</span></div>
            <div class="art-layer-scenery">
              <span class="shady-trees">🌳 树阴照水</span>
              <span class="spring-rocks">🪨 泉眼细流 💧</span>
            </div>
            <div class="art-layer-water">
              <span class="stream-ripple">〰️ 〰️ 清溪幽幽</span>
            </div>
          </div>
        `;

      case 'snow_mountain': // p13: 千山鸟飞绝，万径人踪灭。
        return `
          <div class="poem-scene bg-snow-mountain">
            <div class="art-layer-sky">
              <span class="snow-clouds">☁️ 漫天寒雪</span>
              <span class="falling-snow sn1">❄️</span>
              <span class="falling-snow sn2">❄️</span>
            </div>
            <div class="art-layer-scenery">
              <span class="snow-peaks">🏔️ 🏔️ 千山素白</span>
            </div>
            <div class="art-layer-actors">
              <span class="silent-paths">〰️ 万径人踪灭 · 鸟飞绝 〰️</span>
            </div>
          </div>
        `;

      case 'boat_fishing': // p14: 孤舟蓑笠翁，独钓寒江雪。
        return `
          <div class="poem-scene bg-cold-river">
            <div class="art-layer-sky"><span class="falling-snow">❄️ 寒江飞雪 ❄️</span></div>
            <div class="art-layer-water"><span class="ice-water">🌊 🌫️ 茫茫寒江</span></div>
            <div class="art-layer-actors">
              <span class="lonely-boat float-actor">🚣 孤舟</span>
              <span class="old-fisherman">👴 🎣 (蓑笠翁独钓)</span>
            </div>
          </div>
        `;

      case 'wind_seasons': // p15: 解落三秋叶，能开二月花。
        return `
          <div class="poem-scene bg-wind-seasons">
            <div class="art-layer-scenery season-split">
              <div class="autumn-side">
                <span class="season-tag">🍁 解落三秋叶</span>
                <span class="falling-leaf">🍂 🍁 🍃</span>
              </div>
              <span class="magic-wind">💨 神奇之风</span>
              <div class="spring-side">
                <span class="season-tag">🌸 能开二月花</span>
                <span class="bloom-flower">🌺 🌸 🌼</span>
              </div>
            </div>
          </div>
        `;

      case 'wind_bamboo': // p16: 过江千尺浪，入竹万竿斜。
        return `
          <div class="poem-scene bg-wind-bamboo">
            <div class="art-layer-sky"><span class="storm-wind">💨 狂风呼啸 💨</span></div>
            <div class="art-layer-water">
              <span class="huge-waves">🌊 🌊 过江千尺浪 🌊</span>
            </div>
            <div class="art-layer-scenery">
              <span class="bending-bamboo tilt-anim">🎋 🎋 入竹万竿斜 🎋</span>
            </div>
          </div>
        `;

      case 'willow_tree': // p17: 碧玉妆成一树高，万条垂下绿丝绦。
        return `
          <div class="poem-scene bg-willow-spring">
            <div class="art-layer-sky"><span class="spring-breeze">🍃 和煦春光</span></div>
            <div class="art-layer-scenery">
              <span class="willow-trunk">🌳 碧玉一树高</span>
            </div>
            <div class="art-layer-actors">
              <span class="willow-ribbons sway-anim">🌿 🌿 万条绿丝绦 🌿 🌿</span>
            </div>
          </div>
        `;

      case 'spring_scissors': // p18: 不知细叶谁裁出，二月春风似剪刀。
        return `
          <div class="poem-scene bg-spring-scissors">
            <div class="art-layer-sky"><span class="spring-breeze">🍃 二月春风</span></div>
            <div class="art-layer-scenery">
              <span class="willow-branches">🌿 碧绿细叶</span>
            </div>
            <div class="art-layer-actors">
              <span class="spring-scissors-actor bounce-actor">✂️ 春风似剪刀 ✨</span>
            </div>
          </div>
        `;

      case 'prairie_grass': // p19: 离离原上草，一岁一枯荣。
        return `
          <div class="poem-scene bg-prairie">
            <div class="art-layer-sky">
              <span class="wide-sky">⛅ 辽阔苍穹</span>
              <span class="flying-bird">🦅</span>
            </div>
            <div class="art-layer-scenery">
              <span class="rolling-grass sway-anim">🌾 🌿 离离原上草 🌿 🌾</span>
            </div>
            <div class="art-layer-actors">
              <span class="seasons-cycle">🌱 春生 ➔ 🍂 秋枯 (一岁一枯荣)</span>
            </div>
          </div>
        `;

      case 'fire_sprout': // p20: 野火烧不尽，春风吹又生。
        return `
          <div class="poem-scene bg-fire-rebirth">
            <div class="art-layer-sky"><span class="spring-wind">🍃 春风吹拂</span></div>
            <div class="art-layer-scenery">
              <span class="burnt-soil">🔥 野火烧不尽</span>
            </div>
            <div class="art-layer-actors">
              <span class="green-sprouts bounce-actor">🌱 🌱 春风吹又生 🌱 🌱</span>
            </div>
          </div>
        `;

      case 'painting_scroll': // p21: 远看山有色，近听水无声。
        return `
          <div class="poem-scene bg-art-scroll">
            <div class="art-layer-sky"><span class="scroll-stamp">📜 古韵画卷</span></div>
            <div class="art-layer-scenery">
              <span class="distant-mountains">⛰️ 远看山有色</span>
            </div>
            <div class="art-layer-water">
              <span class="silent-water">🌊 💧 近听水无声 (画中美景)</span>
            </div>
          </div>
        `;

      case 'bird_branch': // p22: 春去花还在，人来鸟不惊。
        return `
          <div class="poem-scene bg-bird-art">
            <div class="art-layer-scenery">
              <span class="eternal-blossom">🌸 🌺 春去花还在</span>
            </div>
            <div class="art-layer-actors">
              <span class="approaching-person">🚶 人来近前</span>
              <span class="peace-bird">🐦 枝头鸟不惊 ✨</span>
            </div>
          </div>
        `;

      case 'boy_boat': // p23: 小娃撑小艇，偷采白莲回。
        return `
          <div class="poem-scene bg-lotus-boat">
            <div class="art-layer-scenery">
              <span class="lotus-leaves">🪷 🌿 绿荷连天</span>
            </div>
            <div class="art-layer-actors">
              <span class="boy-in-boat float-actor">👦 🚣 (小娃撑小艇)</span>
              <span class="white-lotus">🪷 偷采白莲回</span>
            </div>
          </div>
        `;

      case 'duckweed_track': // p24: 不解藏踪迹，浮萍一道开。
        return `
          <div class="poem-scene bg-duckweed-pond">
            <div class="art-layer-scenery">
              <span class="duckweed-green">🟢 🟢 满池浮萍 🟢 🟢</span>
            </div>
            <div class="art-layer-actors">
              <span class="boat-path">🚣 〰️ 〰️ 浮萍一道开 〰️ 〰️</span>
            </div>
          </div>
        `;

      case 'cowboy_sing': // p25: 牧童骑黄牛，歌声振林樾。
        return `
          <div class="poem-scene bg-cowboy-forest">
            <div class="art-layer-sky">
              <span class="loud-notes">🎵 🎶 歌声振林樾 🎶 🎵</span>
            </div>
            <div class="art-layer-scenery"><span class="forest-trees">🌲 🌳 绿树成荫</span></div>
            <div class="art-layer-actors">
              <span class="cowboy-on-cow bounce-actor">👦 🐂 牧童骑黄牛</span>
            </div>
          </div>
        `;

      case 'catch_cicada': // p26: 意欲捕鸣蝉，忽然闭口立。
        return `
          <div class="poem-scene bg-cicada-tree">
            <div class="art-layer-scenery">
              <span class="tall-tree">🌳 浓郁树荫</span>
              <span class="loud-cicada flutter">🪲 (高树鸣蝉)</span>
            </div>
            <div class="art-layer-actors">
              <span class="quiet-cowboy">👦 🤫 (意欲捕鸣蝉 · 忽然闭口立)</span>
            </div>
          </div>
        `;

      case 'flying_kite': // p27: 儿童散学归来早，忙趁东风放纸鸢。
        return `
          <div class="poem-scene bg-kite-field">
            <div class="art-layer-sky">
              <span class="east-wind">🍃 忙趁东风</span>
              <span class="flying-kite-actor bounce-slow">🪁 扶摇纸鸢 〰️</span>
            </div>
            <div class="art-layer-scenery"><span class="spring-grass">🌾 🌿 春草如茵</span></div>
            <div class="art-layer-actors">
              <span class="happy-kids">🏃 🎒 散学儿童欢跑</span>
            </div>
          </div>
        `;

      case 'village_spring': // p28: 草长莺飞二月天，拂堤杨柳醉春烟。
        return `
          <div class="poem-scene bg-village-spring">
            <div class="art-layer-sky">
              <span class="oriole-birds flutter">🐤 🐦 草长莺飞</span>
              <span class="spring-mist">🌫️ 醉人春烟</span>
            </div>
            <div class="art-layer-scenery">
              <span class="embankment-willow">🌿 拂堤杨柳 🌿</span>
            </div>
          </div>
        `;

      case 'lushan_waterfall': // p29: 飞流直下三千尺，疑是银河落九天。
        return `
          <div class="poem-scene bg-lushan-falls">
            <div class="art-layer-sky"><span class="milky-way">✨ 🌌 疑是银河落九天</span></div>
            <div class="art-layer-scenery"><span class="steep-cliff">🏔️ 庐山绝壁</span></div>
            <div class="art-layer-waterfall">
              <span class="huge-waterfall waterfall-anim">🌊 🌊 飞流直下三千尺 🌊 🌊</span>
            </div>
          </div>
        `;

      case 'lushan_peak': // p30: 日照香炉生紫烟，遥看瀑布挂前川。
        return `
          <div class="poem-scene bg-incense-peak">
            <div class="art-layer-sky">
              <span class="morning-sun">🌅 日照香炉</span>
              <span class="purple-mist pulse">💜 🌫️ 生紫烟 🌫️ 💜</span>
            </div>
            <div class="art-layer-scenery"><span class="incense-peak">⛰️ 秀丽山峰</span></div>
            <div class="art-layer-waterfall">
              <span class="distant-falls">〰️ 遥看瀑布挂前川 〰️</span>
            </div>
          </div>
        `;

      case 'sunset_river': // p31: 一道残阳铺水中，半江瑟瑟半江红。
        return `
          <div class="poem-scene bg-sunset-river">
            <div class="art-layer-sky"><span class="crimson-sun">🌅 一道残阳铺水中</span></div>
            <div class="art-layer-water river-split">
              <div class="river-red">🔴 半江通红 (晚霞波光)</div>
              <div class="river-green">🟢 半江瑟瑟 (幽碧江流)</div>
            </div>
          </div>
        `;

      case 'dew_moon': // p32: 可怜九月初三夜，露似真珠月似弓。
        return `
          <div class="poem-scene bg-dew-moon">
            <div class="art-layer-sky">
              <span class="bow-moon-actor">🌙 月似弯弓</span>
              <span class="night-stars">✨ 幽静秋夜</span>
            </div>
            <div class="art-layer-scenery">
              <span class="dew-grass">🌿 💎 露似真珠 💎 🌿</span>
            </div>
          </div>
        `;

      default:
        return `
          <div class="poem-scene bg-default-poem">
            <span class="scroll-element">📜 诗情画意</span>
          </div>
        `;
    }
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
