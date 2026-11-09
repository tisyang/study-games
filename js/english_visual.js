/**
 * 乐学萌岛 - 英语探索岛：日常互助小帮手具象化渲染引擎 (English Visual & Interaction Engine)
 * 设计哲学：零中文翻译，纯英文语感，依靠清晰视觉物品、纯正原声与生活常识建立直接联结
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

  // 根据选项数据渲染内联 SVG 或 Emoji (保持大物品约 72px / 64px，无小字)
  renderTool(option) {
    if (!option) return '';
    if (typeof option === 'string') {
      return `<span class="tool-emoji">${option}</span>`;
    }

    const { kind, color, count, icon, label } = option;

    switch (kind) {
      case 'umbrella': {
        const colors = {
          red: { canopy: '#ef4444', dark: '#b91c1c' },
          blue: { canopy: '#3b82f6', dark: '#1d4ed8' },
          yellow: { canopy: '#eab308', dark: '#a16207' }
        };
        const c = colors[color] || colors.red;
        return `
          <div class="tool-art tool-umbrella" title="${label || ''}">
            <svg viewBox="0 0 48 48" width="72" height="72" aria-hidden="true">
              <path d="M6 24 C6 14 14 6 24 6 C34 6 42 14 42 24 C36 22 30 22 24 24 C18 22 12 22 6 24 Z" fill="${c.canopy}" stroke="${c.dark}" stroke-width="2" />
              <path d="M24 6 L24 40 C24 43 21 44 19 42 C17 40 18 37 20 37" fill="none" stroke="#64748b" stroke-width="2.5" stroke-linecap="round" />
              <circle cx="24" cy="5" r="2" fill="${c.dark}" />
            </svg>
          </div>
        `;
      }

      case 'banana': {
        const colors = {
          yellow: { body: '#facc15', tip: '#854d0e', stroke: '#ca8a04' },
          green: { body: '#4ade80', tip: '#166534', stroke: '#15803d' },
          red: { body: '#f87171', tip: '#991b1b', stroke: '#b91c1c' }
        };
        const c = colors[color] || colors.yellow;
        return `
          <div class="tool-art tool-banana" title="${label || ''}">
            <svg viewBox="0 0 48 48" width="72" height="72" aria-hidden="true">
              <!-- 明显内凹弯香蕉月牙轮廓 -->
              <path d="M8 12 C5 34 24 47 42 24 L39 20 C27 33 15 25 12 12 Z" fill="${c.body}" stroke="${c.stroke}" stroke-width="2" stroke-linejoin="round" />
              <!-- 香蕉蒂与顶端 -->
              <path d="M8 12 L6 10" stroke="${c.tip}" stroke-width="3" stroke-linecap="round" />
              <circle cx="41" cy="22" r="1.8" fill="${c.tip}" />
            </svg>
          </div>
        `;
      }

      case 'scarf': {
        const colors = {
          red: { main: '#ef4444', dark: '#991b1b', fringe: '#fca5a5' },
          blue: { main: '#3b82f6', dark: '#1e40af', fringe: '#93c5fd' },
          yellow: { main: '#eab308', dark: '#854d0e', fringe: '#fef08a' }
        };
        const c = colors[color] || colors.red;
        return `
          <div class="tool-art tool-scarf" title="${label || ''}">
            <svg viewBox="0 0 48 48" width="72" height="72" aria-hidden="true">
              <ellipse cx="24" cy="18" rx="16" ry="8" fill="${c.main}" stroke="${c.dark}" stroke-width="2" />
              <path d="M28 22 L29 40 L35 39 L33 22 Z" fill="${c.main}" stroke="${c.dark}" stroke-width="2" />
              <line x1="29" y1="40" x2="35" y2="39" stroke="${c.fringe}" stroke-width="3" stroke-dasharray="2 1" />
            </svg>
          </div>
        `;
      }

      case 'kite': {
        const colors = {
          red: { fill: '#ef4444', dark: '#b91c1c' },
          blue: { fill: '#38bdf8', dark: '#0284c7' },
          yellow: { fill: '#facc15', dark: '#ca8a04' }
        };
        const c = colors[color] || colors.blue;
        return `
          <div class="tool-art tool-kite" title="${label || ''}">
            <svg viewBox="0 0 48 48" width="72" height="72" aria-hidden="true">
              <polygon points="24,6 38,22 24,38 10,22" fill="${c.fill}" stroke="${c.dark}" stroke-width="2" />
              <line x1="24" y1="6" x2="24" y2="38" stroke="#ffffff" stroke-width="1.5" />
              <line x1="10" y1="22" x2="38" y2="22" stroke="#ffffff" stroke-width="1.5" />
              <path d="M24 38 Q26 42 22 46" fill="none" stroke="#64748b" stroke-width="1.5" />
            </svg>
          </div>
        `;
      }

      case 'beverage': {
        // 同轮廓杯子，真实填色（清水/牛奶/果汁）
        const drinks = {
          water: { fill: '#60a5fa', dark: '#2563eb' },
          milk: { fill: '#f8fafc', dark: '#cbd5e1' },
          juice: { fill: '#fb923c', dark: '#c2410c' }
        };
        const d = drinks[color] || drinks.water;
        return `
          <div class="tool-art tool-beverage" title="${label || ''}">
            <svg viewBox="0 0 48 48" width="72" height="72" aria-hidden="true">
              <!-- 杯身 -->
              <path d="M12 12 L15 40 C15 42 18 44 24 44 C30 44 33 42 33 40 L36 12 Z" fill="#e2e8f0" stroke="#64748b" stroke-width="2" />
              <!-- 饮料液体 -->
              <path d="M14 18 L16 38 C16 40 19 42 24 42 C29 42 32 40 32 38 L34 18 Z" fill="${d.fill}" stroke="${d.dark}" stroke-width="1" />
              <!-- 吸管 -->
              <line x1="24" y1="24" x2="32" y2="6" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round" />
            </svg>
          </div>
        `;
      }

      case 'lamp': {
        // 台灯（非裸灯泡）
        return `
          <div class="tool-art tool-lamp" title="${label || ''}">
            <svg viewBox="0 0 48 48" width="72" height="72" aria-hidden="true">
              <!-- 灯罩 -->
              <path d="M14 22 L34 22 L29 10 L19 10 Z" fill="#fbbf24" stroke="#d97706" stroke-width="2" />
              <!-- 弯支架 -->
              <path d="M24 22 L24 38" fill="none" stroke="#64748b" stroke-width="3" stroke-linecap="round" />
              <!-- 底座 -->
              <ellipse cx="24" cy="40" rx="10" ry="3" fill="#94a3b8" stroke="#475569" stroke-width="1.5" />
              <!-- 光芒 -->
              <line x1="24" y1="25" x2="24" y2="29" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" />
            </svg>
          </div>
        `;
      }

      case 'towel': {
        // 折叠毛巾（非围巾）
        return `
          <div class="tool-art tool-towel" title="${label || ''}">
            <svg viewBox="0 0 48 48" width="72" height="72" aria-hidden="true">
              <!-- 折叠毛巾主体 -->
              <rect x="10" y="16" width="28" height="12" rx="4" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
              <rect x="12" y="24" width="26" height="12" rx="4" fill="#7dd3fc" stroke="#0284c7" stroke-width="2" />
              <!-- 纹理线 -->
              <line x1="16" y1="30" x2="34" y2="30" stroke="#bae6fd" stroke-width="1.5" stroke-dasharray="3 2" />
            </svg>
          </div>
        `;
      }

      case 'apples': {
        const n = count || 1;
        const applesHtml = Array(n).fill('<span class="item-count-icon">🍎</span>').join('');
        return `
          <div class="tool-art tool-apples" title="${label || ''}">
            <div class="count-emojis count-${n}">${applesHtml}</div>
          </div>
        `;
      }

      case 'balloons': {
        const n = count || 1;
        const balloonsHtml = Array(n).fill('<span class="item-count-icon">🎈</span>').join('');
        return `
          <div class="tool-art tool-balloons" title="${label || ''}">
            <div class="count-emojis count-${n}">${balloonsHtml}</div>
          </div>
        `;
      }

      case 'emoji':
      default:
        return `
          <div class="tool-art tool-generic" title="${label || ''}">
            <span class="tool-emoji">${icon || '✨'}</span>
          </div>
        `;
    }
  }

  // ==================== 1. 日常互助情境场景渲染 ====================
  renderStory(q) {
    this.clear();
    if (!this.stage || !this.narration) return;

    // 顶部角色大字请求与朗读按键 (纯英文，大字自然，无中文翻译)
    this.narration.innerHTML = `
      <div class="english-header-bar">
        <span class="english-request-tag font-question">💬 “${q.crisisSpeech}”</span>
        <div class="header-action-btns">
          <button id="btn-speech-english" class="btn-voice-pill english-voice" title="Listen to request">🔊 Listen</button>
        </div>
      </div>
    `;

    // 绑定朗读按键 (初始朗读请求)
    const btnSpeech = document.getElementById('btn-speech-english');
    if (btnSpeech) {
      btnSpeech.onclick = (e) => {
        e.stopPropagation();
        this.clearTimersOnly();
        window.speechEngine.speakEnglishWithButton(btnSpeech, q.crisisSpeech);
      };
    }

    // 延迟 200ms 自动轻声播放情境英文
    this._registerTimer(() => {
      if (window.speechEngine && btnSpeech) {
        window.speechEngine.speakEnglishWithButton(btnSpeech, q.crisisSpeech);
      }
    }, 200);

    // 渲染舞台：初始 tip 为空且隐藏，角落展示 contextIcon 环境氛围
    this.stage.innerHTML = `
      <div class="english-theater-stage">
        <div class="theater-crisis-box bg-daily-scene" id="theater-box">
          <div class="scene-context-corner" aria-hidden="true">${q.contextIcon || '✨'}</div>
          <div class="scene-actors" id="scene-actors">
            <div class="actor-dialog-box">
              <span class="actor-emoji wait-actor" id="main-actor">${q.actor || '🐾'}</span>
            </div>
          </div>
        </div>
        <div class="english-interactive-tip hidden" id="english-tip"></div>
      </div>
    `;
  }

  clearTimersOnly() {
    this.activeTimers.forEach(t => clearTimeout(t));
    this.activeTimers = [];
  }

  // ==================== 2. 正确答题庆祝反馈 ====================
  celebrateRescue(q) {
    // 立即取消尚未执行的自动请求朗读定时器
    this.clearTimersOnly();

    const box = document.getElementById('theater-box');
    const actors = document.getElementById('scene-actors');
    const tip = document.getElementById('english-tip');
    const headerTag = document.querySelector('.english-request-tag');
    const btnSpeech = document.getElementById('btn-speech-english');

    if (box) box.classList.add('crisis-solved');

    // 气泡换成 reply，角色开心
    if (headerTag) {
      headerTag.innerHTML = `🌟 “${q.thankYouSpeech}”`;
      headerTag.classList.add('thank-you-active');
    }

    // 答对后 Listen 重播 reply
    if (btnSpeech) {
      btnSpeech.onclick = (e) => {
        e.stopPropagation();
        this.clearTimersOnly();
        window.speechEngine.speakEnglishWithButton(btnSpeech, q.thankYouSpeech);
      };
    }

    // 正确后角色身旁或穿戴对应挑选的物品
    if (actors) {
      const correctOpt = (q.options || []).find(o => o.value === q.correctTool) || { kind: 'emoji', icon: '✨' };
      const toolMarkup = this.renderTool(correctOpt);
      const kindClass = `delivered-kind-${correctOpt.kind || 'generic'}`;

      actors.innerHTML = `
        <div class="actor-happy-box bounce-hero ${kindClass}">
          <div class="delivered-tool float-pop">
            ${toolMarkup}
          </div>
          <span class="actor-emoji happy-actor">${q.actor || '🐾'}</span>
          <span class="cheer-sparkles" aria-hidden="true">🎉</span>
        </div>
      `;
    }

    // 正确后不再加第二句 Thank you 说明，隐藏 tip
    if (tip) {
      tip.innerHTML = '';
      tip.classList.add('hidden');
    }

    // 朗读 reply，不自动切题
    if (window.speechEngine) {
      if (btnSpeech) {
        window.speechEngine.speakEnglishWithButton(btnSpeech, q.thankYouSpeech);
      } else {
        window.speechEngine.speakEnglish(q.thankYouSpeech);
      }
    }
  }

  // 答错短提示：只显示 Listen again.
  showHint(q) {
    this.clearTimersOnly();

    const tip = document.getElementById('english-tip');
    if (tip) {
      tip.innerHTML = `👂 Listen again.`;
      tip.classList.remove('hidden', 'tip-success');
      tip.classList.add('tip-retry');
    }
    const btnSpeech = document.getElementById('btn-speech-english');
    if (btnSpeech && window.speechEngine) {
      window.speechEngine.speakEnglishWithButton(btnSpeech, q.crisisSpeech);
    }
  }
}

// 导出全局单例
window.englishVisualEngine = new EnglishVisualEngine('visual-stage', 'story-narration');
