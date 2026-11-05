# 乐学萌岛 (Kids Learn Island) - 趣味语数大冒险

面向小学二年级小朋友的趣味互动学习网页游戏。涵盖**趣味数学大冒险**（100以内加减法与表内乘除法具象化动画）与全新**语文智慧岛**（32个经典成语小剧场、32首课标必背古诗画卷、标准拼音标注与点击语音朗读）。

---

## 🌟 核心特色

1. **大纲贴合**：
   - **数学**：100以内的进位/退位加减法、九九表内乘除法。
   - **语文**：部编版课标二年级 32 个经典寓言成语 + 32 首必背诗词，字字标注标准声调拼音（`<ruby>`）。
2. **具象化启蒙动画**：
   - 数学：满十打包新箱、松鼠撬箱借十、曲奇矩阵扫描、动物公平分果。
   - 语文：井底观天、亡羊补牢、画龙点睛等成语动画小剧场；咏鹅、春晓、小池等水墨诗意画卷。
3. **点击普通话语音朗读（Web Speech API）**：
   - 免外部音频文件，零网络延迟，专为低年级小朋友调校的 0.85x 舒缓温和女声，点击小喇叭 🔊 即刻朗读故事与诗句。
4. **儿童友好交互**：
   - 4 选 1 糖果大按键，触屏/鼠标点击极其友好。
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
├── css/
│   └── style.css           # 卡通糖果风样式、拼音标注与动画
├── js/
│   ├── audio.js            # Web Audio API 声音与童趣背景音乐引擎
│   ├── speech.js           # Web Speech API 中文普通话语音朗读引擎
│   ├── chinese_data.js     # 32个成语与32首诗词标准拼音题库
│   ├── chinese_visual.js   # 语文成语剧场与诗情画卷动画渲染引擎
│   ├── game.js             # 数学与语文题目生成、智能干扰项算法
│   ├── visual.js           # 数学具象化动态演算引擎
│   └── app.js              # 游戏主流程控制、连击与星星系统
├── Caddyfile.example       # Caddy 部署参考示例
├── README.md               # 部署与项目说明
├── PROJECT.md              # 架构选型与技术说明
└── CHANGELOG.md            # 变更记录
```
