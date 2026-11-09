# 英语首轮验收修正

日期：2026-11-09。24个新英语MP3现已安装，全部解码通过且逐字匹配新数据；32张古诗WebP已生成。保留已通过的数学和语文行为，不改request/reply文本或音频文件。

## 1. Listen状态实际失败

扩展后的 `/tmp/web-study-speech-stop-check.cjs` 复现失败：`active Listen button must show speaking state`。原因：speakWithButton先_bindActiveButton，然后speak→playAudioFile→stop立即把刚绑定的按钮复原。

调整执行顺序：先取消旧播放并开始新播放，再给当前按钮绑定播放状态（仅确实处于播放中时）；保证重复点击、停止、自然结束、禁用语音时状态一致。不要让stop把刚建立的当前按钮状态马上清掉。必须重新跑该测试通过。

## 2. 延迟请求打断感谢语

浏览器已复现：e1进入后立刻答对，350ms后最后播放路径是 `e1_crisis.mp3`，期望 `e1_thanks.mp3`。renderStory的200ms自动请求还在等待，celebrateRescue没有清除它。

庆祝、手动重播、错误提示时，先取消尚未执行的自动朗读定时器；切题和clear同样清理。不要通过延迟答题或锁按钮绕过。答对后的Listen应重播reply，与屏幕当前句子一致。

## 3. 图与词一致

- e3的Lamp不能画成裸灯泡，改为简单台灯SVG。
- e5的Towel不能用围巾Emoji，改为折叠毛巾SVG；围巾仍只用于e7。
- e2饮料按原规范画三个相同轮廓的杯子，分别清水、牛奶、果汁的真实填色；不要继续用水滴当完整饮料物品。删除没有用途的饮料图标/字段。
- 香蕉应有可辨的弯曲月牙轮廓，不能像一片叶子。颜色变式仍用相同轮廓。
- 1/2/3苹果、气球必须保留真实数量；当前数据值与音频已正确，不改。

## 4. 回到少文字、大物品

- 英语模式隐藏重复 question-stage 大指令；初始 english-tip 为空且隐藏，错误时只显示“Listen again.”，正确后不再加第二句Thank you说明。
- 选项不再显示小号 tool-label-text，label继续用于aria-label/title。画面保留一个大请求、Listen、角色和3个大物品。
- SVG物品约72px，普通Emoji约64px，数量图标每个至少32px。手机用两列可换行并居中第三项，或者同样清楚的单列，保证三件数量物品不撑宽。桌面保持三项并列。
- 正确后物品颜色/数量与所选项一致；至少伞在兔子上方呈撑伞效果、围巾在企鹅身上呈穿戴效果，避免把所有物品都仅画成旁边的一张道具卡。可用少量kind class与CSS定位，不创建复杂场景框架。
- “Help friend: Listen and pick the right one!”这类重复长句全部移除。

## 验证与范围

仅 js/speech.js、js/english_data.js、js/english_visual.js、css/style.css 和必要的 app.js；准确更新本批README/PROJECT/CHANGELOG资源状态即可，不清理无关旧代码、不改语文数学，不调用其他agent/浏览器、不生成新音频图片、不提交部署。

执行语音停止与按钮测试，逐个改动JS语法检查、git diff --check。完成简短报告并停止，浏览器由Codex继续验收。
