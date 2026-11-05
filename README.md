# 乐学萌岛 (Kids Learn Island) - 趣味语数英大冒险

[![GitHub repo](https://img.shields.io/badge/GitHub-tisyang%2Fstudy--games-181717?logo=github)](https://github.com/tisyang/study-games)
[![Author](https://img.shields.io/badge/Author-tisyang-blue)](https://github.com/tisyang)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

面向小学二年级小朋友的趣味互动学习网页游戏。涵盖**趣味数学大冒险**（100以内加减法与表内乘除法具象化动画）、**语文智慧岛**（32个经典成语小剧场、32首课标必背古诗画卷、标准拼音标注与点击语音朗读）与全新**英语探索岛**（零翻译纯语感浸润、纯正美式原声、情境救急小英雄小剧场）。

---

## 🔗 开源仓库与作者

- **GitHub 开源仓库**: [https://github.com/tisyang/study-games](https://github.com/tisyang/study-games)
- **作者 (Author)**: [@tisyang](https://github.com/tisyang)
- **开源协议**: [MIT License](LICENSE)
- 欢迎 Star ⭐️、Fork、提交 Issue 或分享给身边的家长与老师！

---

## 🌟 核心特色

1. **三大核心学科贴合**：
   - **数学**：100以内的进位/退位加减法、九九表内乘除法。
   - **语文**：部编版课标二年级 32 个经典寓言成语 + 32 首必背诗词，字字标注标准声调拼音（`<ruby>`）。
   - **英语**：零中文翻译干扰，12 组趣味情境救急英雄大冒险，通过视觉困境与纯正美音直接培养地道语感。
2. **具象化启蒙动画与小剧场**：
   - 数学：满十打包新箱、松鼠撬箱借十、曲奇矩阵扫描、动物公平分果。
   - 语文：井底观天、亡羊补牢、画龙点睛等成语动画小剧场；咏鹅、春晓、小池等水墨诗意画卷。
   - 英语：暴雨撑伞、酷暑送冰、黑夜点灯、小狗啃骨、小猪洗泡等情境危机与救援庆祝动效。
3. **高保真本地静态音频资源（零依赖 · 100% 跨平台）**：
   - 彻底告别浏览器端合成器（TTS）在 Linux 缺少 `speech-dispatcher`、各平台音色不一及网络流延迟卡顿的缺陷。
   - 全部 152 组中英双语语音（24个英语危机与救援原声、64个成语故事与哲理、64个古诗名篇与诗意赏析）均预先打包为高品质本地 MP3 资源文件（`assets/audio/`），离线免流量、秒点秒播，在任何系统与 Firefox / Chrome 下 100% 稳定出声。
4. **儿童友好交互**：
   - 超大糖果大按键（支持 4 选 1 与 3 选 1 道具翻牌），触屏/鼠标点击极其友好。
   - 弹性果冻点击动效、连击鼓励（Combo!）、温和智慧小锦囊。
5. **纯 Web Audio 声音合成**：
   - 0 延迟合成欢快的八音盒背景音乐与清脆音效，右上角可一键静音。
6. **极简免构建与 Caddy 即刻部署**：
   - 原生 HTML5 + CSS3 + ES6 原生模块，无需 Node.js/Vite 构建流程。

---

## 🚀 部署到 Caddy

本系统为纯静态项目，将代码克隆或复制到服务器指定目录后，配置 Caddy 即可开箱即用：

```caddyfile
# /etc/caddy/Caddyfile 示例
kids.yourdomain.com {
    root * /mnt/Priv/web-study

    # 拦截所有以点开头的隐藏文件和目录（保护 .git 安全）
    @hidden path */.*
    error @hidden 404

    file_server {
        hide .git .gitignore .env
    }

    encode gzip zstd
}
```

重新加载 Caddy：
```bash
sudo systemctl reload caddy
```

---

## 📁 目录结构

```text
.
├── index.html              # 主页面与游戏大厅
├── assets/
│   └── audio/              # 152 个本地高保真 MP3 静态语音资源（中英全覆盖）
│       ├── english/        # 24 个英语危机与救援感谢原声
│       └── chinese/        # 128 个成语故事、哲理、古诗与诗意
├── css/
│   └── style.css           # 卡通糖果风样式、拼音标注与动画
├── js/
│   ├── audio.js            # Web Audio API 声音与童趣背景音乐引擎
│   ├── speech.js           # 离线高保真语音播放引擎（直调本地静态 MP3）
│   ├── chinese_data.js     # 32个成语与32首诗词标准拼音题库
│   ├── chinese_visual.js   # 语文成语剧场与诗情画卷动画渲染引擎
│   ├── english_data.js     # 12个零翻译纯英语救急小剧场情境库
│   ├── english_visual.js   # 英语情境危机与救援庆祝动效渲染引擎
│   ├── game.js             # 数学、语文与英语题目生成、智能选项算法
│   ├── visual.js           # 数学具象化动态演算引擎
│   └── app.js              # 游戏大厅与答题流程控制、连击与星星系统
├── Caddyfile.example       # Caddy 部署参考示例
├── LICENSE                 # MIT 开源授权协议
├── README.md               # 部署与项目说明
├── PROJECT.md              # 架构选型与技术说明
└── CHANGELOG.md            # 变更记录
```
