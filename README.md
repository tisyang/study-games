# 乐学萌岛 (Kids Learn Island) - 趣味语数英大冒险

[![GitHub repo](https://img.shields.io/badge/GitHub-tisyang%2Fstudy--games-181717?logo=github)](https://github.com/tisyang/study-games)
[![Author](https://img.shields.io/badge/Author-tisyang-blue)](https://github.com/tisyang)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

面向小学二年级小朋友的趣味互动学习网页游戏。涵盖**趣味数学大冒险**（100以内加减法与表内乘除法具象化动画）、**语文智慧岛**（32个经典成语小剧场、16首必背古诗画卷共32组诗句、标准拼音标注与点击语音朗读）与**英语探索岛**（零翻译纯语感浸润、12组日常互助小帮手对话与真实选项道具）。

本轮改版的设计、资源与验证结果见 [改版文档](docs/redesign/README.md) 和 [第二批验收记录](docs/redesign/11-subject-acceptance.md)。

另有面向4—5岁孩子的“小小乐园”：小熊接客人以5以内实物加法练习接着数，汉字小世界包含自然（日月水山火木）、动物（牛羊马）、生活（门口手）共12个字，通过场景互动认识和运用。每轮三个任务、语音引导、无计时；汉字优先安排未玩过的字，并在当前浏览器记住答对记录。详见 [幼儿玩法说明](docs/redesign/12-preschool-prototypes.md)。

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
   - **语文**：32 个成语故事 + 16 首经典古诗（共 32 组诗句），成语揭晓与诗句使用拼音标注（`<ruby>`）。
   - **英语**：12 组日常生活互助对话，通过图形、颜色、数量和语音理解简短请求。
2. **具象化启蒙与独立探索交互（全七大探索模式 5 题免计时，mix 维持 10 题计时挑战）**：
   - **加法（收苹果）**：果园装箱探索，支持【合在一起】与散装满十【装满一箱】；
   - **减法（松鼠拆箱）**：松鼠撬箱借十破十，个位散装扣除；
   - **乘法（烤饼干）**：烘焙烤盘按行扫描，390px 窄屏精致排布不越界；
   - **除法（分水果）**：多只盘子公平分果，动态分发；
   - **成语故事**：32 个成语生动情境，根据情节挑选行为抉择，答对后揭晓成语释义与生活哲理；
   - **画中找诗**：16 首必背古诗（32 组诗句），大字配图填空，两行优美断句；
   - **日常互助（英语）**：12 组儿童生活真实需求（取物、喝水、洗手、收玩具、生日、放风筝），真实颜色与数量道具匹配；
   - **主动推进**：探索模式答对后由孩子主动点击【下一题 ➔】（最后一题为【完成啦 ➔】）推进，不以语音播放结束被动切题；mix 模式保持 10 题计时挑战。
3. **高保真音频与配图资源状态**：
   - **音频**：涵盖英语 12 组日常对话（24 条 request/reply）、语文成语与古诗朗读。24 个新英语 MP3 现已完成文本核对、解码与安装（`assets/audio/english/`）；播放引擎全面支持即时取消、防重入与按键状态自动复位；
   - **配图**：32 张古诗 WebP 高清绘本图已全量生成完毕（`assets/images/poems/v2/pN.webp`），界面具备优雅渐进加载与安全降级。
4. **儿童友好交互与直观大厅**：
   - 首页主入口“今天想玩什么？”，配以松鼠果园、故事绘本、生活互助三大场景按键；二级大厅大图标无冗余说教；
   - 超大糖果按键、选项图形清晰（SVG 真实填色与真实数量道具，杜绝 Emoji 伪染色），移动端 390px 紧凑排布无溢出；
   - 小屏答题模式自动隐藏品牌文字，避免 3 位数星星挤压导致顶栏折行；
   - 弹性果冻点击动效、连击鼓励（Combo!）、场景内温和提示。
5. **纯 Web Audio 声音合成**：
   - 0 延迟合成欢快的八音盒背景音乐与清脆音效，右上角可一键静音。
6. **极简免构建与 Caddy 即刻部署**：
   - 原生 HTML5 + CSS3 + 经典 JavaScript 脚本，无需 Node.js/Vite 构建流程。

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
│   ├── images/poems/v2/    # 32 张新版无字绘本 WebP 配图
│   └── audio/              # 152 个本地 MP3 静态语音资源
│       ├── english/        # 24 个英语危机与救援感谢原声
│       └── chinese/        # 128 个成语故事、哲理、古诗与诗意
├── css/
│   └── style.css           # 卡通糖果风样式、拼音标注与动画
├── js/
│   ├── audio.js            # Web Audio API 声音与童趣背景音乐引擎
│   ├── speech.js           # 离线高保真语音播放引擎（直调本地静态 MP3）
│   ├── chinese_data.js     # 32个成语与16首古诗（32组诗句）题库
│   ├── chinese_visual.js   # 语文成语剧场与诗情画卷动画渲染引擎
│   ├── english_data.js     # 12组英语日常请求与感谢、结构化物品选项
│   ├── english_visual.js   # 英语日常互助场景与物品反馈
│   ├── game.js             # 数学、语文与英语题目生成、智能选项算法
│   ├── visual.js           # 数学具象化动态演算引擎
│   └── app.js              # 游戏大厅与答题流程控制、连击与星星系统
├── Caddyfile.example       # Caddy 部署参考示例
├── LICENSE                 # MIT 开源授权协议
├── README.md               # 部署与项目说明
├── PROJECT.md              # 架构选型与技术说明
└── CHANGELOG.md            # 变更记录
```
