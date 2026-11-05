/**
 * 乐学萌岛 - 纯原生童趣中文朗读引擎 (Web Speech API)
 * 完全免去外部音频下载，零网络延迟，专为低年级小朋友调校的标准普通话发音与语速
 */

class SpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.voices = [];
    this.preferredVoice = null;
    this.enabled = true;

    if (this.synth) {
      this._loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this._loadVoices();
      }
    }
  }

  // 寻找最佳中文普通话女声/童音语音包
  _loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();

    // 优先匹配标准普通话女声或清晰声音
    this.preferredVoice = this.voices.find(v =>
      (v.lang === 'zh-CN' || v.lang === 'cmn-Hans-CN') &&
      (v.name.includes('Xiaoxiao') || v.name.includes('Natural') || v.name.includes('Female') || v.name.includes('普通话') || v.name.includes('Chinese'))
    ) || this.voices.find(v => v.lang.startsWith('zh')) || null;
  }

  // 朗读指定中文文本
  speak(text, onEndCallback = null) {
    if (!this.synth || !this.enabled || !text) {
      if (onEndCallback) onEndCallback();
      return;
    }

    try {
      // 停止上一条未念完的声音
      this.synth.cancel();

      // 清理文本中的标点停顿优化
      const cleanText = text.replace(/<[^>]+>/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);

      utterance.lang = 'zh-CN';
      if (this.preferredVoice) {
        utterance.voice = this.preferredVoice;
      }

      // 语速调至 0.85x：字字珠玑，发音清晰，适合二年级小朋友跟读磨耳朵
      utterance.rate = 0.85;
      utterance.pitch = 1.08; // 微微上扬的亲切温暖语调
      utterance.volume = 1.0;

      if (onEndCallback) {
        utterance.onend = () => onEndCallback();
        utterance.onerror = () => onEndCallback();
      }

      this.synth.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
      if (onEndCallback) onEndCallback();
    }
  }

  // 停止朗读
  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // 朗读并在按钮上展示声波震动反馈
  speakWithButton(btnEl, text) {
    if (!btnEl) {
      this.speak(text);
      return;
    }

    btnEl.classList.add('speaking');
    this.speak(text, () => {
      btnEl.classList.remove('speaking');
    });
  }
}

// 导出全局单例
window.speechEngine = new SpeechEngine();
