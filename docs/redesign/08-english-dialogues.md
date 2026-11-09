# 任务 08：英语短请求、听辨选项与一致反馈

先读05总纲。将 english_story 加入 isExploreMode()，最终除 mix 外全部七个入口为5题无计时、手动下一题；mix继续旧挑战。

## 内容原则

- 角色对孩子说话，不用第三人称长旁白。一次一个语言点，1句短请求，语气自然；反馈短且与当前物品一致。
- 把“所有题都是危险救援”改成日常小帮手：取物、喝水、洗手、收玩具、生日、放风筝。
- 不强制高难度：保留名词入门，同时有颜色/数量听辨。水/牛奶/果汁、红伞/蓝伞/黄伞都是合理物品，不能只靠场景排除离谱物品。
- 场景中不提前展示所需物品的颜色或数量答案；请求决定选哪个。句子可用大字配音呈现，选项主要为图，英文 aria-label 清楚。
- 内容区不放中文翻译，导航可沿用中文。Listen 重播入口保留，音频播放期间不倒计时。

## 精确文本与选项表

以下 request/reply 分别写入原 crisisSpeech/thankYouSpeech 字段，保持 speech.js 的文本索引机制；原24个英语MP3由Codex同步更新，agy不要联网生成音频或保留旧文本。

| id | 日常情境/角色 | request | reply | 正确物品 | 三个选项 |
| --- | --- | --- | --- | --- | --- |
| e1 | 雨天/小兔 | The red umbrella, please. | Thank you! I'm dry now. | red-umbrella | red-umbrella / blue-umbrella / yellow-umbrella |
| e2 | 喝水/小狮子 | I'm thirsty. Water, please. | Thank you! That's better. | water | water / milk / juice |
| e3 | 看书开灯/小熊 | The lamp, please. | Thank you! I can see! | lamp | lamp / book / ball |
| e4 | 点心/小兔 | An apple, please. | Thank you! Yum! | apple | apple / banana / bread |
| e5 | 洗手/小猪 | Soap, please. | Thank you! Nice and clean. | soap | soap / towel / brush |
| e6 | 水果/小猴 | The yellow banana, please. | Thank you! A yellow banana. | yellow-banana | yellow-banana / green-banana / red-banana |
| e7 | 穿衣/小企鹅 | My red scarf, please. | Thank you! I'm warm now. | red-scarf | red-scarf / blue-scarf / yellow-scarf |
| e8 | 准备点心/小鸭 | Two apples, please. | Thank you! One, two! | two-apples | one-apple / two-apples / three-apples |
| e9 | 睡前找玩具/小猫 | My teddy bear, please. | Thank you! My teddy bear. | teddy | teddy / car / ball |
| e10 | 收玩具/小狗 | The box, please. | Thank you! Let's tidy up. | box | box / basket / bag |
| e11 | 生日布置/小女孩 | Three balloons, please. | Thank you! One, two, three! | three-balloons | one-balloon / two-balloons / three-balloons |
| e12 | 放风筝/小女孩 | The blue kite, please. | Thank you! My blue kite. | blue-kite | red-kite / blue-kite / yellow-kite |

## 数据与绘制

- 保留id、crisisSpeech、thankYouSpeech、correctTool；options改为对象列表，每项 `{ value, label, kind, color?, count? }`。value对应上表稳定标识，label为简短英文，如 Red umbrella / Two apples。
- 同一种物品的颜色变式必须用同一形状、不同真实填色，不能对彩色Emoji写color假装换色。用少量内联 SVG 画伞、香蕉、围巾、风筝、饮料；普通名词可复用清楚的Emoji。
- 数量选项画真实1/2/3个苹果或气球，不能只换数字标签而图案数量不变。手机号选项可2列或单列，图不挤小。
- game.js 保留物品数据并洗牌，answer是correctTool。app调用 englishVisualEngine.renderTool(option) 得到图形，设置按钮 aria-label，避免把对象显示成 [object Object]。
- 旧scene可替换为简洁通用的日常场景数据，如 actor、sceneTitle、contextIcon；保留12个有区别的日常情境，不再强行套用旧冰块/火焰/风团效果。

## 交互

- 大角色＋1句大字请求＋Listen＋3个大物品按钮。默认不显示重复的标题/说明/装饰标签。
- 正确后物品真正出现在角色身边，颜色/数量保持一致，角色开心，气泡换reply；本地MP3播放reply，主动下一题立即可用。
- 错误提示为短语“Listen again.”，可以重播request；不要用中文翻译或直接替孩子选择答案。
- renderStory / celebrateRescue / showHint 为app的调用入口。celebrateRescue 不以音频结束驱动切题，不留旧15秒/25秒切题回调。
- clear与返回必须停止当前语音/定时器；旧回调不改新题DOM。speech.js如需修复stop后完成计时仍触发的问题，只做必要修正，不能重写整个音频系统。
- Codex 已用 `/tmp/web-study-speech-stop-check.cjs` 复现：取消旧本地音频后，旧 ended/超时仍通知完成并清空新音频引用。修正 stop 时清除超时并让旧完成回调失效；自然结束仍只通知一次；Web Speech 降级同样处理。连续点击同一 Listen 按钮、取消播放、自然结束后，按钮文字和 speaking 状态都应恢复，不留下“Listening...”假状态。
- 新文本对应的24个MP3仍为 `assets/audio/english/eN_crisis.mp3` 与 `eN_thanks.mp3`。不要生成或下载假的占位音频；由Codex在最终验收前更新并验证解码。

## 文件与交付

主要 js/english_data.js、js/english_visual.js、js/game.js、js/app.js、css/style.css，必要时 js/speech.js。完成后准确更新 README/PROJECT/CHANGELOG 当前行为与本批状态，不声称未经执行的测试通过。

分别对改动JS做语法检查，git diff --check。浏览器与音频由Codex处理，停止等待审核，不提交或部署。
