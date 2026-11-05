/**
 * 乐学萌岛 - 健壮型儿童中文语音朗读引擎
 * 支持：
 * 1. 原生 Web Speech API（针对 Chrome/Safari/Edge/iPad 深度调优）
 * 2. 纯前端高保真音频流无缝降级回退（解决部分 Linux 桌面系统缺失本地普通话语音包的问题）
 * 3. 伴随按键声波反馈与防截断机制
 */

class SpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.voices = [];
    this.preferredVoice = null;
    this.preferredEnglishVoice = null;
    this.enabled = true;
    this.currentUtterance = null;
    this.fallbackAudio = null;
    this.isSpeakingNow = false;

    if (this.synth) {
      this._loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this._loadVoices();
      }
    }
  }

  // 寻找系统内最佳普通话与英文语音包
  _loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices() || [];

    // 优先匹配标准普通话女声或清晰声音
    this.preferredVoice = this.voices.find(v =>
      (v.lang === 'zh-CN' || v.lang === 'cmn-Hans-CN') &&
      (v.name.includes('Xiaoxiao') || v.name.includes('Natural') || v.name.includes('Female') || v.name.includes('普通话') || v.name.includes('Chinese'))
    ) || this.voices.find(v => v.lang.startsWith('zh')) || null;

    // 优先匹配标准美式/英式清晰英语女声/童声
    this.preferredEnglishVoice = this.voices.find(v =>
      (v.lang === 'en-US' || v.lang === 'en_US') &&
      (v.name.includes('Jenny') || v.name.includes('Natural') || v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google US English'))
    ) || this.voices.find(v => v.lang === 'en-US' || v.lang === 'en_US')
      || this.voices.find(v => v.lang.startsWith('en')) || null;
  }

  // 朗读指定中文文本
  speak(text, onEndCallback = null) {
    if (!this.enabled || !text) {
      if (onEndCallback) onEndCallback();
      return;
    }

    // 播放一声清脆提示音，确保点击有即时听觉反馈
    if (window.soundEngine && typeof window.soundEngine.playClick === 'function') {
      window.soundEngine.playClick();
    }

    // 清理文本中的 HTML 标签，提纯文字
    const cleanText = text.replace(/<[^>]+>/g, '').replace(/[，。？！；：]/g, '，').trim();

    // 停止正在播放的语音或回退音频
    this.stop();
    this.isSpeakingNow = true;

    // 重新检测可用声音
    if (this.voices.length === 0) {
      this._loadVoices();
    }

    // 检查 Web Speech API 是否有可用的中文语音包
    const hasChineseVoice = this.voices.some(v => v.lang.startsWith('zh'));

    if (this.synth && (hasChineseVoice || this.voices.length > 0)) {
      this._speakWithWebSpeech(cleanText, () => {
        this.isSpeakingNow = false;
        if (onEndCallback) onEndCallback();
      });
    } else {
      // 若系统（如部分 Linux 桌面）没有预装中文本地语音包，无缝启用高保真普通话发音音频流
      this._speakWithAudioFallback(cleanText, () => {
        this.isSpeakingNow = false;
        if (onEndCallback) onEndCallback();
      });
    }
  }

  // 方案 A: 浏览器原生 Web Speech API
  _speakWithWebSpeech(cleanText, onDone) {
    try {
      // 唤醒可能处于 paused 挂起状态的 Chrome synth
      if (this.synth.paused) {
        this.synth.resume();
      }
      this.synth.cancel();

      // 延迟 50ms 规避 Chrome 立即 cancel 导致丢包的 bug
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        this.currentUtterance = utterance; // 防止 Chrome GC 垃圾回收导致截断

        utterance.lang = 'zh-CN';
        if (this.preferredVoice) {
          utterance.voice = this.preferredVoice;
        }

        utterance.rate = 0.85; // 稍慢语速，适合儿童
        utterance.pitch = 1.05;
        utterance.volume = 1.0;

        let finished = false;
        const handleDone = () => {
          if (!finished) {
            finished = true;
            this.currentUtterance = null;
            if (onDone) onDone();
          }
        };

        utterance.onend = handleDone;
        utterance.onerror = (err) => {
          console.warn('WebSpeech error, fallback to audio stream:', err);
          // 遇到错误立刻降级到音频流方案
          this._speakWithAudioFallback(cleanText, onDone);
        };

        this.synth.speak(utterance);

        // 超时保底（防止个别浏览器既不触发 onend 也不触发 onerror）
        const maxWaitMs = Math.max(3000, cleanText.length * 400);
        setTimeout(handleDone, maxWaitMs);
      }, 50);

    } catch (e) {
      console.warn('WebSpeech exception, fallback:', e);
      this._speakWithAudioFallback(cleanText, onDone);
    }
  }

  // 方案 B: 高保真中文语音流回退（解决系统无 TTS 语音包问题）
  _speakWithAudioFallback(cleanText, onDone) {
    try {
      // 使用有道标准普通话发音流（儿童古诗成语极度清晰标准）
      const encoded = encodeURIComponent(cleanText.substring(0, 80));
      const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encoded}&le=zh`;

      if (this.fallbackAudio) {
        this.fallbackAudio.pause();
        this.fallbackAudio = null;
      }

      const audio = new Audio(audioUrl);
      this.fallbackAudio = audio;

      let finished = false;
      const handleDone = () => {
        if (!finished) {
          finished = true;
          this.fallbackAudio = null;
          if (onDone) onDone();
        }
      };

      audio.onended = handleDone;
      audio.onerror = () => {
        console.warn('Audio stream failed, play hint tone');
        if (window.soundEngine && typeof window.soundEngine.playHint === 'function') {
          window.soundEngine.playHint();
        }
        handleDone();
      };

      audio.play().catch(e => {
        console.warn('Audio play blocked:', e);
        if (window.soundEngine && typeof window.soundEngine.playHint === 'function') {
          window.soundEngine.playHint();
        }
        handleDone();
      });

      // 5秒超时保底
      setTimeout(handleDone, 5000);

    } catch (e) {
      console.warn('Fallback error:', e);
      if (onDone) onDone();
    }
  }

  // 停止朗读
  stop() {
    this.isSpeakingNow = false;
    if (this.synth) {
      try { this.synth.cancel(); } catch (e) {}
    }
    if (this.fallbackAudio) {
      try {
        this.fallbackAudio.pause();
        this.fallbackAudio = null;
      } catch (e) {}
    }
  }

  // 朗读并在按钮上展示文字与声波状态
  speakWithButton(btnEl, text) {
    if (!btnEl) {
      this.speak(text);
      return;
    }

    const origText = btnEl.innerHTML;
    btnEl.classList.add('speaking');
    btnEl.innerHTML = '🔊 朗读中...';

    this.speak(text, () => {
      btnEl.classList.remove('speaking');
      btnEl.innerHTML = origText;
    });
  }

  // 朗读指定英文文本 (纯正原声浸润)
  speakEnglish(text, onEndCallback = null) {
    if (!this.enabled || !text) {
      if (onEndCallback) onEndCallback();
      return;
    }

    if (window.soundEngine && typeof window.soundEngine.playClick === 'function') {
      window.soundEngine.playClick();
    }

    const cleanText = text.replace(/<[^>]+>/g, '').trim();

    this.stop();
    this.isSpeakingNow = true;

    if (this.voices.length === 0) {
      this._loadVoices();
    }

    const hasEnglishVoice = this.voices.some(v => v.lang.startsWith('en'));

    if (this.synth && (hasEnglishVoice || (this.preferredEnglishVoice !== null))) {
      this._speakEnglishWithWebSpeech(cleanText, () => {
        this.isSpeakingNow = false;
        if (onEndCallback) onEndCallback();
      });
    } else {
      this._speakEnglishWithAudioFallback(cleanText, () => {
        this.isSpeakingNow = false;
        if (onEndCallback) onEndCallback();
      });
    }
  }

  // 方案 A: 浏览器原生 Web Speech API (英文美音)
  _speakEnglishWithWebSpeech(cleanText, onDone) {
    try {
      if (this.synth.paused) {
        this.synth.resume();
      }
      this.synth.cancel();

      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        this.currentUtterance = utterance;

        utterance.lang = 'en-US';
        if (this.preferredEnglishVoice) {
          utterance.voice = this.preferredEnglishVoice;
        }

        utterance.rate = 0.85; // 稍慢语速，清晰自然适合二年级
        utterance.pitch = 1.05;
        utterance.volume = 1.0;

        let finished = false;
        const handleDone = () => {
          if (!finished) {
            finished = true;
            this.currentUtterance = null;
            if (onDone) onDone();
          }
        };

        utterance.onend = handleDone;
        utterance.onerror = (err) => {
          console.warn('English WebSpeech error, fallback to audio stream:', err);
          this._speakEnglishWithAudioFallback(cleanText, onDone);
        };

        this.synth.speak(utterance);

        const maxWaitMs = Math.max(3500, cleanText.length * 300);
        setTimeout(handleDone, maxWaitMs);
      }, 50);

    } catch (e) {
      console.warn('English WebSpeech exception, fallback:', e);
      this._speakEnglishWithAudioFallback(cleanText, onDone);
    }
  }

  // 方案 B: 高保真美式英语流回退 (有道标准美音 type=2)
  _speakEnglishWithAudioFallback(cleanText, onDone) {
    try {
      const encoded = encodeURIComponent(cleanText.substring(0, 120));
      const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encoded}&type=2`;

      if (this.fallbackAudio) {
        this.fallbackAudio.pause();
        this.fallbackAudio = null;
      }

      const audio = new Audio(audioUrl);
      this.fallbackAudio = audio;

      let finished = false;
      const handleDone = () => {
        if (!finished) {
          finished = true;
          this.fallbackAudio = null;
          if (onDone) onDone();
        }
      };

      audio.onended = handleDone;
      audio.onerror = () => {
        console.warn('English audio stream failed');
        if (window.soundEngine && typeof window.soundEngine.playHint === 'function') {
          window.soundEngine.playHint();
        }
        handleDone();
      };

      audio.play().catch(e => {
        console.warn('English audio play blocked:', e);
        if (window.soundEngine && typeof window.soundEngine.playHint === 'function') {
          window.soundEngine.playHint();
        }
        handleDone();
      });

      setTimeout(handleDone, 6000);

    } catch (e) {
      console.warn('English fallback error:', e);
      if (onDone) onDone();
    }
  }

  // 英文朗读并在按钮上展示文字与声波状态
  speakEnglishWithButton(btnEl, text) {
    if (!btnEl) {
      this.speakEnglish(text);
      return;
    }

    const origText = btnEl.innerHTML;
    btnEl.classList.add('speaking');
    btnEl.innerHTML = '🔊 Listening...';

    this.speakEnglish(text, () => {
      btnEl.classList.remove('speaking');
      btnEl.innerHTML = origText;
    });
  }
}

// 导出全局单例
window.speechEngine = new SpeechEngine();
