/**
 * 乐学萌岛 - 离线高保真语音播放引擎
 * 架构：
 * 1. 优先调用本地高品质预生成 MP3 静态音频资源（零网络延迟、零合成器 TTS 兼容性问题、100% 跨平台浏览器兼容）
 * 2. 备选 Web Speech API（若有即兴未收录文本）
 * 3. 伴随按键状态联动与防截断机制
 */

class SpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.enabled = true;
    this.currentAudio = null;
    this.currentUtterance = null;
    this.isSpeakingNow = false;
    this.audioIndex = null;
  }

  // 延迟建立文本到本地 MP3 资源路径的快速映射索引
  _getAudioIndex() {
    if (this.audioIndex) return this.audioIndex;
    this.audioIndex = new Map();

    // 1. 英语故事题库音频映射
    if (window.englishData && Array.isArray(window.englishData.stories)) {
      window.englishData.stories.forEach(s => {
        if (s.crisisSpeech) this.audioIndex.set(this._normalizeText(s.crisisSpeech), `assets/audio/english/${s.id}_crisis.mp3`);
        if (s.thankYouSpeech) this.audioIndex.set(this._normalizeText(s.thankYouSpeech), `assets/audio/english/${s.id}_thanks.mp3`);
      });
    }

    // 2. 语文成语题库音频映射
    if (window.chineseData && Array.isArray(window.chineseData.idioms)) {
      window.chineseData.idioms.forEach(q => {
        if (q.story) this.audioIndex.set(this._normalizeText(q.story), `assets/audio/chinese/${q.id}_story.mp3`);
        if (q.word && q.meaning) this.audioIndex.set(this._normalizeText(`${q.word}。${q.meaning}`), `assets/audio/chinese/${q.id}_meaning.mp3`);
      });
    }

    // 3. 语文古诗题库音频映射
    if (window.chineseData && Array.isArray(window.chineseData.poems)) {
      window.chineseData.poems.forEach(q => {
        if (q.title && q.author && q.line) this.audioIndex.set(this._normalizeText(`${q.title}。${q.author}。${q.line}`), `assets/audio/chinese/${q.id}_poem.mp3`);
        if (q.line && q.meaning) this.audioIndex.set(this._normalizeText(`${q.line}。${q.meaning}`), `assets/audio/chinese/${q.id}_meaning.mp3`);
      });
    }

    return this.audioIndex;
  }

  // 统一去除标点与 HTML 标签进行归一化匹配
  _normalizeText(str) {
    if (!str) return '';
    return str.replace(/<[^>]+>/g, '').replace(/[\s\r\n，。？！；：“”"'.!?,]/g, '').trim().toLowerCase();
  }

  // 核心：直接播放本地静态 MP3 文件
  playAudioFile(filePath, onEndCallback = null) {
    this.stop();
    this.isSpeakingNow = true;

    try {
      const audio = new Audio(filePath);
      this.currentAudio = audio;

      let finished = false;
      let timerId = null;

      const handleDone = () => {
        if (!finished) {
          finished = true;
          if (timerId) {
            clearTimeout(timerId);
            timerId = null;
          }
          this.currentAudio = null;
          this.isSpeakingNow = false;
          if (onEndCallback) onEndCallback();
        }
      };

      audio.onended = handleDone;
      audio.onerror = (e) => {
        console.warn('Audio play failed:', filePath, e);
        handleDone();
      };

      audio.play().catch(e => {
        console.warn('Audio play blocked:', e);
        handleDone();
      });

      // 异常保护保底（25秒长超时，充分保障音频正常完整播放，完成时自动 clearTimeout）
      timerId = setTimeout(handleDone, 25000);

    } catch (e) {
      console.warn('playAudioFile exception:', e);
      this.isSpeakingNow = false;
      if (onEndCallback) onEndCallback();
    }
  }

  // 朗读指定中文文本（优先本地 MP3 资源）
  speak(text, onEndCallback = null) {
    if (!this.enabled || !text) {
      if (onEndCallback) onEndCallback();
      return;
    }

    const index = this._getAudioIndex();
    const normalized = this._normalizeText(text);
    const localFile = index.get(normalized);

    if (localFile) {
      this.playAudioFile(localFile, onEndCallback);
      return;
    }

    // 若无预生成静态资源，使用原生 Web Speech API 备选保底
    this._speakWithWebSpeechFallback(text, 'zh-CN', onEndCallback);
  }

  // 朗读指定英文文本（优先本地 MP3 资源）
  speakEnglish(text, onEndCallback = null) {
    if (!this.enabled || !text) {
      if (onEndCallback) onEndCallback();
      return;
    }

    const index = this._getAudioIndex();
    const normalized = this._normalizeText(text);
    const localFile = index.get(normalized);

    if (localFile) {
      this.playAudioFile(localFile, onEndCallback);
      return;
    }

    // 若无预生成静态资源，使用原生 Web Speech API 备选保底
    this._speakWithWebSpeechFallback(text, 'en-US', onEndCallback);
  }

  // 按钮交互联动（带 🔊 朗读中... 动态状态与声波）
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

  // 备选 Web Speech API
  _speakWithWebSpeechFallback(text, lang, onDone) {
    if (!this.synth) {
      if (onDone) onDone();
      return;
    }

    try {
      this.stop();
      this.isSpeakingNow = true;

      const cleanText = text.replace(/<[^>]+>/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      this.currentUtterance = utterance;
      utterance.lang = lang;
      utterance.rate = 0.85;

      let finished = false;
      const handleDone = () => {
        if (!finished) {
          finished = true;
          this.currentUtterance = null;
          this.isSpeakingNow = false;
          if (onDone) onDone();
        }
      };

      utterance.onend = handleDone;
      utterance.onerror = handleDone;

      this.synth.speak(utterance);
      setTimeout(handleDone, 4000);

    } catch (e) {
      this.isSpeakingNow = false;
      if (onDone) onDone();
    }
  }

  // 停止播放
  stop() {
    this.isSpeakingNow = false;
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio = null;
      } catch (e) {}
    }
    if (this.synth) {
      try { this.synth.cancel(); } catch (e) {}
    }
  }
}

// 导出全局单例
window.speechEngine = new SpeechEngine();
