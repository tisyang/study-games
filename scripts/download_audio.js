/**
 * 乐学萌岛 - 离线静态语音资源生成器
 * 将题库全部英语情境与语文成语/诗词的语音提前生成为高品质 MP3 静态文件，
 * 彻底告别浏览器端 TTS / Web Speech API 在 Linux/移动端等环境的兼容性缺陷。
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 导入题库数据
global.window = {};
require('../js/english_data.js');
require('../js/chinese_data.js');

const englishStories = window.englishData.stories;
const chineseIdioms = window.chineseData.idioms;
const chinesePoems = window.chineseData.poems;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadTts(text, lang, destPath) {
  return new Promise((resolve, reject) => {
    const url = 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=' + lang + '&q=' + encodeURIComponent(text);
    const file = fs.createWriteStream(destPath);
    
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        return reject(new Error(`HTTP ${res.statusCode} for: ${text}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    });

    req.on('error', err => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

async function main() {
  const enDir = path.join(__dirname, '..', 'assets', 'audio', 'english');
  const zhDir = path.join(__dirname, '..', 'assets', 'audio', 'chinese');
  fs.mkdirSync(enDir, { recursive: true });
  fs.mkdirSync(zhDir, { recursive: true });

  console.log('=== 1. 开始生成 24 个英语情境音频 ===');
  for (const s of englishStories) {
    const crisisFile = path.join(enDir, `${s.id}_crisis.mp3`);
    const thanksFile = path.join(enDir, `${s.id}_thanks.mp3`);

    console.log(`[EN] ${s.id} crisis: "${s.crisisSpeech}"`);
    await downloadTts(s.crisisSpeech, 'en', crisisFile);
    await sleep(200);

    console.log(`[EN] ${s.id} thanks: "${s.thankYouSpeech}"`);
    await downloadTts(s.thankYouSpeech, 'en', thanksFile);
    await sleep(200);
  }

  console.log('=== 2. 开始生成 64 个成语故事与寓意音频 ===');
  for (const idm of chineseIdioms) {
    const storyFile = path.join(zhDir, `${idm.id}_story.mp3`);
    const meaningFile = path.join(zhDir, `${idm.id}_meaning.mp3`);

    console.log(`[ZH-成语] ${idm.id} ${idm.word} 故事`);
    await downloadTts(idm.story, 'zh-CN', storyFile);
    await sleep(200);

    console.log(`[ZH-成语] ${idm.id} ${idm.word} 释义`);
    await downloadTts(`${idm.word}。${idm.meaning}`, 'zh-CN', meaningFile);
    await sleep(200);
  }

  console.log('=== 3. 开始生成 64 个古诗朗读与诗意音频 ===');
  for (const p of chinesePoems) {
    const poemFile = path.join(zhDir, `${p.id}_poem.mp3`);
    const meaningFile = path.join(zhDir, `${p.id}_meaning.mp3`);

    console.log(`[ZH-古诗] ${p.id} 《${p.title}》 诗句`);
    await downloadTts(`${p.title}。${p.author}。${p.line}`, 'zh-CN', poemFile);
    await sleep(200);

    console.log(`[ZH-古诗] ${p.id} 《${p.title}》 诗意`);
    await downloadTts(`${p.line}。${p.meaning}`, 'zh-CN', meaningFile);
    await sleep(200);
  }

  console.log('🎉 所有音频资源下载并校验完成！');
}

main().catch(err => {
  console.error('生成失败:', err);
  process.exit(1);
});
