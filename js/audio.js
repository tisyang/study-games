/**
 * 声音与背景音乐引擎 (Web Audio API 原生合成)
 * 无需任何外部音频文件，零网络延迟，专为小朋友设计的温暖清脆音效与童趣BGM
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.bgmEnabled = true;
    this.sfxEnabled = true;

    // BGM 状态
    this.isPlayingBgm = false;
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.bgmGainNode = null;
    this.sfxGainNode = null;

    // 童趣轻快旋律 (五线谱简谱映射音高：C4 ~ C6)
    // 采用跳跃的大调五声音阶与儿歌节拍 (C调)
    this.melody = [
      { note: 'C5', dur: 0.25 }, { note: 'E5', dur: 0.25 }, { note: 'G5', dur: 0.25 }, { note: 'A5', dur: 0.25 },
      { note: 'G5', dur: 0.5 },  { note: 'E5', dur: 0.5 },
      { note: 'F5', dur: 0.25 }, { note: 'A5', dur: 0.25 }, { note: 'C6', dur: 0.5 },
      { note: 'G5', dur: 0.75 }, { note: 'rest', dur: 0.25 },
      { note: 'E5', dur: 0.25 }, { note: 'D5', dur: 0.25 }, { note: 'C5', dur: 0.25 }, { note: 'D5', dur: 0.25 },
      { note: 'E5', dur: 0.5 },  { note: 'G5', dur: 0.5 },
      { note: 'D5', dur: 0.5 },  { note: 'G4', dur: 0.5 },
      { note: 'C5', dur: 0.75 }, { note: 'rest', dur: 0.25 }
    ];

    // 伴奏低音根音轮换
    this.bassNotes = ['C3', 'G3', 'F3', 'G3', 'C3', 'A2', 'D3', 'G3'];

    // 音符对应频率 (Hz)
    this.freqMap = {
      'rest': 0,
      'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
      'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00,
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
      'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
      'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'G6': 1567.98
    };
  }

  // 延迟初始化 AudioContext 以遵循浏览器自动播放安全策略
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // 创建主混音增益节点
      this.bgmGainNode = this.ctx.createGain();
      this.bgmGainNode.gain.value = 0.12; // 背景音乐保持温和柔顺，不抢主音
      this.bgmGainNode.connect(this.ctx.destination);

      this.sfxGainNode = this.ctx.createGain();
      this.sfxGainNode.gain.value = 0.35; // 音效适中清脆
      this.sfxGainNode.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 播放单音调（可选择波形，如八音盒三角波、暖声正弦波）
  playTone(freq, duration, type = 'sine', startTime = null, targetGain = null) {
    if (!freq || freq <= 0) return;
    this.init();

    const t = startTime || this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);

    // 声音包络 (ADSR) 模仿木琴/八音盒敲击感
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(targetGain || this.sfxGainNode);

    osc.start(t);
    osc.stop(t + duration);
  }

  // 播放按钮点击音效 (清脆小泡泡声)
  playClick() {
    if (!this.sfxEnabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // 快速音调跃迁产生泡泡破裂感
    osc.frequency.setValueAtTime(450, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.06);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(t);
    osc.stop(t + 0.06);
  }

  // 答对音效 (连击时音调上升，强化正反馈)
  playCorrect(combo = 1) {
    if (!this.sfxEnabled) return;
    this.init();

    const now = this.ctx.currentTime;
    // 根据连击数提升基础音阶，增加成就感
    const basePitches = combo >= 5 ? ['E5', 'G5', 'C6', 'E6'] : ['C5', 'E5', 'G5', 'C6'];
    const interval = 0.08;

    basePitches.forEach((n, idx) => {
      const f = this.freqMap[n];
      this.playTone(f, 0.25, 'triangle', now + idx * interval, this.sfxGainNode);
    });
  }

  // 答错音效 (温和柔润的提示音，避免让小朋友产生挫败恐惧)
  playWrong() {
    if (!this.sfxEnabled) return;
    this.init();

    const now = this.ctx.currentTime;
    const notes = [320, 260]; // 微微下行的双音

    notes.forEach((f, idx) => {
      const t = now + idx * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(t);
      osc.stop(t + 0.18);
    });
  }

  // 超时提示音效 (轻柔小闹钟叮铃声)
  playTimeout() {
    if (!this.sfxEnabled) return;
    this.init();

    const now = this.ctx.currentTime;
    const dings = [784, 659];
    dings.forEach((f, idx) => {
      this.playTone(f, 0.3, 'sine', now + idx * 0.15, this.sfxGainNode);
    });
  }

  // 弹出智慧小锦囊音效 (闪烁仙女棒魔法声)
  playHint() {
    if (!this.sfxEnabled) return;
    this.init();

    const now = this.ctx.currentTime;
    const sparkleNotes = ['G5', 'B5', 'D6', 'G6'];
    sparkleNotes.forEach((note, idx) => {
      this.playTone(this.freqMap[note], 0.2, 'sine', now + idx * 0.07, this.sfxGainNode);
    });
  }

  // 关卡胜利/通关欢呼号角
  playVictory() {
    if (!this.sfxEnabled) return;
    this.init();

    const now = this.ctx.currentTime;
    const fanfare = [
      { n: 'C5', d: 0.15, t: 0 },
      { n: 'E5', d: 0.15, t: 0.15 },
      { n: 'G5', d: 0.15, t: 0.3 },
      { n: 'C6', d: 0.45, t: 0.45 }
    ];

    fanfare.forEach(item => {
      this.playTone(this.freqMap[item.n], item.d, 'triangle', now + item.t, this.sfxGainNode);
    });
  }

  // 启动背景音乐循环
  startBgm() {
    if (!this.bgmEnabled || this.isPlayingBgm) return;
    this.init();
    this.isPlayingBgm = true;
    this.bgmStep = 0;
    this._playNextBgmNote();
  }

  // 内部 BGM 步进驱动
  _playNextBgmNote() {
    if (!this.isPlayingBgm || !this.bgmEnabled) return;

    const item = this.melody[this.bgmStep];
    const durSec = item.dur * 0.8; // 节拍速度 (BPM ~ 100)
    const now = this.ctx.currentTime;

    // 播放主旋律音符 (八音盒般的三角波)
    if (item.note !== 'rest') {
      const f = this.freqMap[item.note];
      if (f) {
        this.playTone(f, durSec * 0.9, 'triangle', now, this.bgmGainNode);
      }
    }

    // 伴奏低音：每 4 步附带一次轻柔的低音马林巴音
    if (this.bgmStep % 2 === 0) {
      const bassIndex = Math.floor(this.bgmStep / 2) % this.bassNotes.length;
      const bassFreq = this.freqMap[this.bassNotes[bassIndex]];
      if (bassFreq) {
        this.playTone(bassFreq, 0.4, 'sine', now, this.bgmGainNode);
      }
    }

    // 下一步
    this.bgmStep = (this.bgmStep + 1) % this.melody.length;
    this.bgmTimer = setTimeout(() => {
      this._playNextBgmNote();
    }, durSec * 1000);
  }

  // 停止背景音乐
  stopBgm() {
    this.isPlayingBgm = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  // 切换背景音乐开关
  toggleBgm() {
    this.bgmEnabled = !this.bgmEnabled;
    if (this.bgmEnabled) {
      this.startBgm();
    } else {
      this.stopBgm();
    }
    return this.bgmEnabled;
  }

  // 切换音效开关
  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }
}

// 导出全局单例
window.soundEngine = new SoundEngine();
