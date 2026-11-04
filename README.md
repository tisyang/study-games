# 乐学萌岛 (Kids Learn Island) - 趣味数学大冒险

面向小学二年级小朋友的趣味互动学习网页游戏。首发核心模块为**二年级算术大冒险**（100以内加减法与表内乘除法），注重即时点击正反馈、温和错题/超时提示与童趣音效体验。

---

## 🌟 核心特色

1. **大纲贴合**：专为小学二年级定制（100以内的进位/退位加减法、九九表内乘除法）。
2. **儿童友好交互**：
   - 4 选 1 糖果大按键，触屏/鼠标点击极其友好。
   - 弹性果冻点击动效、连击鼓励（Combo!）。
3. **温和智能提示**：
   - 连续答错或超时不施加挫败感，触发“智慧小锦囊”（乘法口诀提示、凑十破十提示）。
4. **纯 Web Audio 声音合成**：
   - 无需下载外部 MP3 资源，0 延迟合成欢快的八音盒背景音乐与清脆音效，右上角可一键静音。
5. **极简免构建与 Caddy 即刻部署**：
   - 原生 HTML5 + CSS3 + ES6 原生模块，无需 Node.js/Vite 构建流程。

---

## 🚀 部署到 Caddy

本系统为纯静态项目，将代码克隆或复制到服务器指定目录后，配置 Caddy 即可开箱即用：

```caddyfile
# /etc/caddy/Caddyfile 示例
kids.yourdomain.com {
    root * /mnt/Priv/web-study
    file_server
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
├── index.html          # 主页面与游戏大厅
├── css/
│   └── style.css       # 卡通糖果风样式、响应式布局与动画
├── js/
│   ├── audio.js        # Web Audio API 声音与童趣背景音乐引擎
│   ├── game.js         # 题库生成算法、智能干扰项与错题提示字典
│   └── app.js          # 页面交互流转与答题逻辑
├── README.md           # 部署与项目说明
├── PROJECT.md          # 架构选型与技术说明
└── CHANGELOG.md        # 变更记录
```
