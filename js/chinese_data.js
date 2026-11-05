/**
 * 乐学萌岛 - 二年级语文成语与诗词精选题库
 * 包含：32个成语 + 32个诗句，全部带标准儿童大纲拼音、白话释义与动画场景参数
 */

// 32个精选二年级寓言与常用成语
const IDIOM_DATABASE = [
  {
    id: 'c1',
    word: '井底之蛙',
    pinyin: ['jǐng', 'dǐ', 'zhī', 'wā'],
    meaning: '比喻见识狭窄、看问题眼光短浅的人。',
    scene: 'well',
    sceneTitle: '🐸 深井底部的青蛙',
    story: '小青蛙常年住在圆圆的深井里，抬头以为天只有井口那么大...',
    animProps: { animal: '🐸', well: '🧱', turtle: '🐢', sky: '☁️' }
  },
  {
    id: 'c2',
    word: '亡羊补牢',
    pinyin: ['wáng', 'yáng', 'bǔ', 'láo'],
    meaning: '羊丢失了赶快修补羊圈。比喻犯了错及时补救还不算晚。',
    scene: 'sheep_pen',
    sceneTitle: '🐑 破了洞的篱笆羊圈',
    story: '昨晚狼叼走了一只小羊，农夫赶紧拿起木板把羊圈的破洞补好！',
    animProps: { sheep: '🐑', fence: '🪵', wolf: '🐺', hammer: '🔨' }
  },
  {
    id: 'c3',
    word: '狐假虎威',
    pinyin: ['hú', 'jiǎ', 'hǔ', 'wēi'],
    meaning: '狐狸假借老虎的威势吓唬别人。比喻依仗别人的威势欺压他人。',
    scene: 'forest_duo',
    sceneTitle: '🦊 大摇大摆的小狐狸与大老虎',
    story: '狡猾的小狐狸昂首走在前面，凶猛的大老虎尾随，吓跑了小动物！',
    animProps: { fox: '🦊', tiger: '🐯', rabbit: '🐰', deer: '🦌' }
  },
  {
    id: 'c4',
    word: '拔苗助长',
    pinyin: ['bá', 'miáo', 'zhù', 'zhǎng'],
    meaning: '比喻急于求成，违反客观事物发展规律，反而把事情弄糟。',
    scene: 'sprout',
    sceneTitle: '🌱 田地里拔高的小树苗',
    story: '宋国农夫嫌禾苗长得太慢，把它们一株株拔高，结果禾苗全枯萎了。',
    animProps: { farmer: '👨‍🌾', plant: '🌱', sun: '☀️', dead: '🥀' }
  },
  {
    id: 'c5',
    word: '守株待兔',
    pinyin: ['shǒu', 'zhū', 'dài', 'tù'],
    meaning: '比喻不靠自己的努力，心存侥幸希望得到意外的收获。',
    scene: 'tree_stump',
    sceneTitle: '🪵 大树桩旁打瞌睡的农夫',
    story: '跑得太快的小兔子撞在树桩上，农夫便放下锄头天天守在树旁等兔子。',
    animProps: { farmer: '😴', stump: '🪵', rabbit: '🐇', tree: '🌳' }
  },
  {
    id: 'c6',
    word: '画龙点睛',
    pinyin: ['huà', 'lóng', 'diǎn', 'jīng'],
    meaning: '比喻在关键处添加精彩的一笔，使内容瞬间生动传神。',
    scene: 'dragon',
    sceneTitle: '🐉 墙壁上威武的神龙',
    story: '画师张僧繇在梁武帝金陵安乐寺墙上画龙，点上眼睛后神龙破壁腾飞！',
    animProps: { dragon: '🐉', brush: '🖌️', eye: '✨', cloud: '☁️' }
  },
  {
    id: 'c7',
    word: '刻舟求剑',
    pinyin: ['kè', 'zhōu', 'qiú', 'jiàn'],
    meaning: '比喻死板拘泥、不知随着时间客观情况的变化来处理事情。',
    scene: 'boat_sword',
    sceneTitle: '⛵ 江中行驶的木船',
    story: '宝剑从船上掉入江中，楚人马上在船舷刻下记号，等靠岸才下水摸找。',
    animProps: { boat: '⛵', sword: '🗡️', river: '🌊', mark: '✏️' }
  },
  {
    id: 'c8',
    word: '盲人摸象',
    pinyin: ['máng', 'rén', 'mō', 'xiàng'],
    meaning: '比喻看问题片面不全面，只了解局部就以为是全部。',
    scene: 'elephant',
    sceneTitle: '🐘 温柔的大象与摸索的人',
    story: '几位盲人摸大象：有的摸到腿以为是柱子，有的摸到尾巴以为是绳子。',
    animProps: { elephant: '🐘', man1: '🦯', ear: '扇子', leg: '柱子' }
  },
  {
    id: 'c9',
    word: '掩耳盗铃',
    pinyin: ['yǎn', 'ěr', 'dào', 'líng'],
    meaning: '捂住自己的耳朵去偷铃铛。比喻自己欺骗自己。',
    scene: 'bell',
    sceneTitle: '🔔 挂在门上的大金铃',
    story: '小偷想偷走大铃铛，怕听到响声便捂住自己耳朵，以为别人也听不见！',
    animProps: { thief: '🦹', bell: '🔔', hands: '🙉', music: '🎵' }
  },
  {
    id: 'c10',
    word: '闻鸡起舞',
    pinyin: ['wén', 'jī', 'qǐ', 'wǔ'],
    meaning: '听到公鸡叫就起床练剑。比喻有志之士发愤图强、勤奋刻苦。',
    scene: 'rooster_sword',
    sceneTitle: '🐓 拂晓晨曦中的大公鸡',
    story: '祖逖听到半夜鸡叫，立刻叫醒刘琨穿好衣服到院中挥剑习武！',
    animProps: { rooster: '🐓', hero: '🤺', sword: '⚔️', dawn: '🌅' }
  },
  {
    id: 'c11',
    word: '坐井观天',
    pinyin: ['zuò', 'jǐng', 'guān', 'tiān'],
    meaning: '坐在井底看天。用来形容眼界狭窄、见识短浅。',
    scene: 'well_sky',
    sceneTitle: '🌌 井口那片小小天空',
    story: '青蛙坐在井底抬头看：“天不过井口那么大，何必飞那么远呢？”',
    animProps: { frog: '🐸', bird: '🐦', well: '🧱', moon: '🌙' }
  },
  {
    id: 'c12',
    word: '塞翁失马',
    pinyin: ['sài', 'wēng', 'shī', 'mǎ'],
    meaning: '比喻坏事在一定条件下可以变成好事，反之亦然。',
    scene: 'horse_farm',
    sceneTitle: '🐎 边塞老汉的骏马',
    story: '边塞老人的马跑了，别人来安慰他，老人却微笑着说：“这未必是坏事呢！”',
    animProps: { oldman: '👴', horse: '🐎', grass: '🌾', lucky: '🍀' }
  },
  {
    id: 'c13',
    word: '惊弓之鸟',
    pinyin: ['jīng', 'gōng', 'zhī', 'niǎo'],
    meaning: '被弓箭吓怕了的鸟。比喻受过惊吓后遇到类似情况就惶恐不安的人。',
    scene: 'scared_bird',
    sceneTitle: '🏹 射雕英雄拉响的空弓弦',
    story: '更羸只拉弓不射箭，啪的一声响，带伤的大雁吓得直接坠落下来。',
    animProps: { archer: '🏹', goose: '🦆', tree: '🌲', heart: '💔' }
  },
  {
    id: 'c14',
    word: '自相矛盾',
    pinyin: ['zì', 'xiāng', 'máo', 'dùn'],
    meaning: '比喻自己的言行前后不一致、互相抵触。',
    scene: 'spear_shield',
    sceneTitle: '🛡️ 最坚固的盾与最锋利的矛',
    story: '楚国商人吹嘘自己的盾最坚硬，又吹嘘自己的矛最锋利，被问傻了眼！',
    animProps: { spear: '🗡️', shield: '🛡️', question: '❓', merchant: '👳' }
  },
  {
    id: 'c15',
    word: '愚公移山',
    pinyin: ['yú', 'gōng', 'yí', 'shān'],
    meaning: '比喻做事有毅力、有恒心，不怕困难，坚持到底就一定能成功。',
    scene: 'mountain_dig',
    sceneTitle: '⛰️ 太行王屋两座大山',
    story: '九十岁的愚公率领子孙挖山不止，神仙被他的恒心感动，搬走了大山！',
    animProps: { yugong: '👴', mountain: '⛰️', shovel: '⛏️', basket: '🧺' }
  },
  {
    id: 'c16',
    word: '熟能生巧',
    pinyin: ['shú', 'néng', 'shēng', 'qiǎo'],
    meaning: '任何技术只要熟练了，就能找到窍门，做得非常出色。',
    scene: 'oil_coin',
    sceneTitle: '🪙 铜钱小孔穿香油',
    story: '卖油翁把铜钱放在葫芦口，舀起一勺油自高处倒下，油穿孔而入钱不湿！',
    animProps: { seller: '🧔', coin: '🪙', bottle: '🏺', oil: '💧' }
  },
  {
    id: 'c17',
    word: '对牛弹琴',
    pinyin: ['duì', 'niú', 'tán', 'qín'],
    meaning: '比喻对不讲道理的人讲道理，或对外行讲内行话，白费心思。',
    scene: 'cow_music',
    sceneTitle: '🐂 绿草地上啃草的老牛',
    story: '公明仪对着老牛抚琴弹奏清雅的古曲，老牛只顾闷头甩尾巴大口吃草！',
    animProps: { musician: '🧑‍🎤', harp: '🪕', cow: '🐂', notes: '🎶' }
  },
  {
    id: 'c18',
    word: '鹤立鸡群',
    pinyin: ['hè', 'lì', 'jī', 'qún'],
    meaning: '像仙鹤立在鸡群中一样。比喻仪表或才能在众人中极为出众。',
    scene: 'crane_chicken',
    sceneTitle: '🦩 农家小院里的仙鹤',
    story: '高大美丽、羽毛洁白的仙鹤悠然独立在一群唧唧喳喳的小芦花鸡中间！',
    animProps: { crane: '🦩', chick: '🐥', hen: '🐔', grass: '🌿' }
  },
  {
    id: 'c19',
    word: '走马观花',
    pinyin: ['zǒu', 'mǎ', 'guān', 'huā'],
    meaning: '骑在奔跑的马上看花。比喻粗略、匆忙地观察事物。',
    scene: 'horse_flower',
    sceneTitle: '🐎 策马飞驰的花海大道',
    story: '诗人孟郊中进士后得意洋洋，骑着快马在长安城一掠而过看尽繁花！',
    animProps: { horse: '🐎', rider: '🤠', flower: '🌸', wind: '💨' }
  },
  {
    id: 'c20',
    word: '鸟语花香',
    pinyin: ['niǎo', 'yǔ', 'huā', 'xiāng'],
    meaning: '鸟叫得好听，花开得芬芳。形容春天风景优美生机勃勃。',
    scene: 'spring_birds',
    sceneTitle: '🌺 百花齐放的花园深处',
    story: '春天的清晨走进小树林，到处是百灵鸟婉转的歌唱和扑鼻的桃花香！',
    animProps: { bird: '🐦', flowers: '💐', bee: '🐝', butterfly: '🦋' }
  },
  {
    id: 'c21',
    word: '草长莺飞',
    pinyin: ['cǎo', 'zhǎng', 'yīng', 'fēi'],
    meaning: '野草嫩绿生长，黄莺欢快飞舞。形容暮春时节生机盎然的美景。',
    scene: 'spring_grass',
    sceneTitle: '🌾 广阔辽远的江南春田',
    story: '江南二月天，小草从泥土里探出嫩绿的小脑袋，黄莺在杨柳枝头飞舞！',
    animProps: { grass: '🌱', oriole: '🐤', willow: '🎋', breeze: '🍃' }
  },
  {
    id: 'c22',
    word: '春华秋实',
    pinyin: ['chūn', 'huá', 'qiū', 'shí'],
    meaning: '春天开花，秋天结果。比喻通过辛勤耕耘而结出丰硕成果。',
    scene: 'seasons',
    sceneTitle: '🍎 从繁花到硕果的大苹果树',
    story: '果园里春天开满了粉白的花朵，到了金秋十月枝头结满了红彤彤的大苹果！',
    animProps: { spring_flower: '🌸', autumn_fruit: '🍎', basket: '🧺', leaf: '🍁' }
  },
  {
    id: 'c23',
    word: '五颜六色',
    pinyin: ['wǔ', 'yán', 'liù', 'sè'],
    meaning: '形容色彩丰富繁多、鲜艳美丽。',
    scene: 'colors',
    sceneTitle: '🎨 彩虹与气球飞舞的广场',
    story: '天空中飞起了一大片五颜六色的彩色气球，像一道亮丽的小彩虹！',
    animProps: { rainbow: '🌈', balloon: '🎈', palette: '🎨', star: '⭐' }
  },
  {
    id: 'c24',
    word: '一心一意',
    pinyin: ['yī', 'xīn', 'yī', 'yì'],
    meaning: '只有一个心眼，形容心思专注、专心致志毫无杂念。',
    scene: 'focus',
    sceneTitle: '📖 聚精会神看书的小朋友',
    story: '小明在书桌前专心看童话书，连旁边飞过的小蝴蝶都顾不上看一眼！',
    animProps: { kid: '👦', book: '📖', lamp: '💡', heart: '❤️' }
  },
  {
    id: 'c25',
    word: '三心二意',
    pinyin: ['sān', 'xīn', 'èr', 'yì'],
    meaning: '形容意志不坚定，做事三心二意、不专心。',
    scene: 'distract',
    sceneTitle: '🎣 小猫钓鱼抓蝴蝶',
    story: '小猫在河边钓鱼，一会儿去追红蜻蜓，一会儿去扑花蝴蝶，一条鱼也没钓到！',
    animProps: { cat: '🐱', rod: '🎣', butterfly: '🦋', fish: '🐟' }
  },
  {
    id: 'c26',
    word: '胆小如鼠',
    pinyin: ['dǎn', 'xiǎo', 'rú', 'shǔ'],
    meaning: '胆子小得像小老鼠一样。形容非常胆怯、害怕。',
    scene: 'mouse',
    sceneTitle: '🐭 墙角探头探脑的小仓鼠',
    story: '小老鼠只要听到一丁点风吹草动，吓得立刻缩回洞里捂住小脸！',
    animProps: { mouse: '🐭', cheese: '🧀', hole: '🕳️', scare: '💦' }
  },
  {
    id: 'c27',
    word: '七手八脚',
    pinyin: ['qī', 'shǒu', 'bā', 'jiǎo'],
    meaning: '形容人多手杂、动作混乱热闹的样子。',
    scene: 'busy_hands',
    sceneTitle: '🧹 热火朝天大扫除的教室',
    story: '下课铃响了，小朋友们七手八脚抬桌子、扫地板，教室一会儿就干净啦！',
    animProps: { broom: '🧹', desk: '🪑', bucket: '🪣', kids: '👫' }
  },
  {
    id: 'c28',
    word: '狼吞虎咽',
    pinyin: ['láng', 'tūn', 'hǔ', 'yàn'],
    meaning: '形容吃东西又猛又急的样子。',
    scene: 'hungry_feast',
    sceneTitle: '🍖 饱餐一顿的小动物',
    story: '小饿狼在山里跑了一整天，面对一整盘香气扑鼻的美食大口大口狂吃！',
    animProps: { wolf: '🐺', meat: '🍖', bowl: '🥣', yummy: '😋' }
  },
  {
    id: 'c29',
    word: '迫不及待',
    pinyin: ['pò', 'bù', 'jí', 'dài'],
    meaning: '急迫得不能再等待。形容心情非常急切。',
    scene: 'cant_wait',
    sceneTitle: '🎁 拆开神秘生日礼盒',
    story: '收到精美的生日大礼盒，弟弟迫不及待地撕开包装纸想看看里面是什么！',
    animProps: { gift: '🎁', ribbon: '🎀', smile: '😃', spark: '✨' }
  },
  {
    id: 'c30',
    word: '欢蹦乱跳',
    pinyin: ['huān', 'bèng', 'luàn', 'tiào'],
    meaning: '高兴得又蹦又跳，形容健康活泼、欢乐喜悦的样子。',
    scene: 'jump_joy',
    sceneTitle: '🐰 绿草坪上蹦跳的小白兔',
    story: '阳光明媚的早晨，几只毛茸茸的小白兔在草坪上欢蹦乱跳地啃萝卜！',
    animProps: { bunny: '🐰', carrot: '🥕', sunshine: '🌞', heart: '💖' }
  },
  {
    id: 'c31',
    word: '冰雪融化',
    pinyin: ['bīng', 'xuě', 'róng', 'huà'],
    meaning: '冰雪在温暖的阳光下融化成水。形容春回大地，气温变暖。',
    scene: 'melt_snow',
    sceneTitle: '❄️ 迎春吐芽的小溪流',
    story: '暖暖的春风吹过山头，覆盖冬天的皑皑白雪融化成了叮咚清澈的小溪！',
    animProps: { snow: '❄️', sun: '☀️', stream: '💧', sprout: '🌱' }
  },
  {
    id: 'c32',
    word: '力大无比',
    pinyin: ['lì', 'dà', 'wú', 'bǐ'],
    meaning: '力量巨大，没有什么可以比拟。形容神勇超凡。',
    scene: 'strong_man',
    sceneTitle: '🏋️ 搬起大巨石的小大力士',
    story: '小蚂蚁虽小却力大无比，居然能搬起比自己身体重上百倍的香甜面包屑！',
    animProps: { ant: '🐜', rock: '🪨', muscle: '💪', bread: '🍞' }
  }
];

// 32首精选二年级课标必背经典诗句与诗意画卷
const POETRY_DATABASE = [
  {
    id: 'p1',
    title: '咏鹅',
    author: '骆宾王',
    dynasty: '唐代',
    line: '白毛浮绿水，红掌拨清波。',
    pinyinArr: [
      ['白', 'bái'], ['毛', 'máo'], ['浮', 'fú'], ['绿', 'lǜ'], ['水', 'shuǐ'], ['，', ''],
      ['红', 'hóng'], ['掌', 'zhǎng'], ['拨', 'bō'], ['清', 'qīng'], ['波', 'bō'], ['。', '']
    ],
    missingWord: '红掌',
    options: ['红掌', '绿草', '白羽', '清风'],
    meaning: '大白鹅洁白的羽毛漂浮在碧绿的水面上，红红的脚掌在水底轻轻划出一圈圈清澈的水波。',
    scene: 'goose_lake',
    animProps: { goose: '🦢', water: '🌊', palm: '🪸', ripple: '💫' }
  },
  {
    id: 'p2',
    title: '咏鹅',
    author: '骆宾王',
    dynasty: '唐代',
    line: '鹅，鹅，鹅，曲项向天歌。',
    pinyinArr: [
      ['鹅', 'é'], ['，', ''], ['鹅', 'é'], ['，', ''], ['鹅', 'é'], ['，', ''],
      ['曲', 'qū'], ['项', 'xiàng'], ['向', 'xiàng'], ['天', 'tiān'], ['歌', 'gē'], ['。', '']
    ],
    missingWord: '曲项',
    options: ['曲项', '大步', '展翅', '点头'],
    meaning: '可爱的大白鹅，弯着长长的脖颈，对着蓝天欢快地歌唱。',
    scene: 'goose_sing',
    animProps: { goose: '🦢', sky: '☁️', note: '🎵', reeds: '🌾' }
  },
  {
    id: 'p3',
    title: '春晓',
    author: '孟浩然',
    dynasty: '唐代',
    line: '春眠不觉晓，处处闻啼鸟。',
    pinyinArr: [
      ['春', 'chūn'], ['眠', 'mián'], ['不', 'bù'], ['觉', 'jué'], ['晓', 'xiǎo'], ['，', ''],
      ['处', 'chù'], ['处', 'chù'], ['闻', 'wén'], ['啼', 'tí'], ['鸟', 'niǎo'], ['。', '']
    ],
    missingWord: '啼鸟',
    options: ['啼鸟', '落叶', '春风', '花开'],
    meaning: '春日里酣睡不知不觉天已破晓，到处都能听到清脆婉转的鸟鸣声。',
    scene: 'spring_birds',
    animProps: { bird: '🐦', sun: '🌅', window: '🪟', branch: '🌿' }
  },
  {
    id: 'p4',
    title: '春晓',
    author: '孟浩然',
    dynasty: '唐代',
    line: '夜来风雨声，花落知多少。',
    pinyinArr: [
      ['夜', 'yè'], ['来', 'lái'], ['风', 'fēng'], ['雨', 'yǔ'], ['声', 'shēng'], ['，', ''],
      ['花', 'huā'], ['落', 'luò'], ['知', 'zhī'], ['多', 'duō'], ['少', 'shǎo'], ['。', '']
    ],
    missingWord: '花落',
    options: ['花落', '鸟飞', '春来', '草绿'],
    meaning: '想起昨天夜里那阵阵的风雨声，不知院子里的小花被打落了多少呢？',
    scene: 'falling_petals',
    animProps: { rain: '🌧️', flower: '🌸', wind: '🍃', puddle: '💧' }
  },
  {
    id: 'p5',
    title: '静夜思',
    author: '李白',
    dynasty: '唐代',
    line: '床前明月光，疑是地上霜。',
    pinyinArr: [
      ['床', 'chuáng'], ['前', 'qián'], ['明', 'míng'], ['月', 'yuè'], ['光', 'guāng'], ['，', ''],
      ['疑', 'yí'], ['是', 'shì'], ['地', 'dì'], ['上', 'shàng'], ['霜', 'shuāng'], ['。', '']
    ],
    missingWord: '明月光',
    options: ['明月光', '清风吹', '烛火照', '星光闪'],
    meaning: '明亮的月光洒在床前地上，清冷洁白，让人怀疑是秋夜里结下的白霜。',
    scene: 'moon_window',
    animProps: { moon: '🌕', bed: '🛏️', window: '🪟', frost: '❄️' }
  },
  {
    id: 'p6',
    title: '静夜思',
    author: '李白',
    dynasty: '唐代',
    line: '举头望明月，低头思故乡。',
    pinyinArr: [
      ['举', 'jǔ'], ['头', 'tóu'], ['望', 'wàng'], ['明', 'míng'], ['月', 'yuè'], ['，', ''],
      ['低', 'dī'], ['头', 'tóu'], ['思', 'sī'], ['故', 'gù'], ['乡', 'xiāng'], ['。', '']
    ],
    missingWord: '思故乡',
    options: ['思故乡', '看星空', '想朋友', '梦里游'],
    meaning: '抬头望着天上皎洁明亮的月亮，不由自主低下头思念远方的家乡。',
    scene: 'poet_moon',
    animProps: { poet: '🧑', moon: '🌕', mountain: '⛰️', star: '⭐' }
  },
  {
    id: 'p7',
    title: '悯农',
    author: '李绅',
    dynasty: '唐代',
    line: '锄禾日当午，汗滴禾下土。',
    pinyinArr: [
      ['锄', 'chú'], ['禾', 'hé'], ['日', 'rì'], ['当', 'dāng'], ['午', 'wǔ'], ['，', ''],
      ['汗', 'hàn'], ['滴', 'dī'], ['禾', 'hé'], ['下', 'xià'], ['土', 'tǔ'], ['。', '']
    ],
    missingWord: '汗滴',
    options: ['汗滴', '雨落', '清泉', '泥土'],
    meaning: '盛夏中午烈日高照，农夫挥动锄头除草，颗颗汗珠滴落在禾苗下的泥土里。',
    scene: 'farmer_sun',
    animProps: { farmer: '👨‍🌾', sun: '☀️', plant: '🌾', sweat: '💦' }
  },
  {
    id: 'p8',
    title: '悯农',
    author: '李绅',
    dynasty: '唐代',
    line: '谁知盘中餐，粒粒皆辛苦。',
    pinyinArr: [
      ['谁', 'shuí'], ['知', 'zhī'], ['盘', 'pán'], ['中', 'zhōng'], ['餐', 'cān'], ['，', ''],
      ['粒', 'lì'], ['粒', 'lì'], ['皆', 'jiē'], ['辛', 'xīn'], ['苦', 'kǔ'], ['。', '']
    ],
    missingWord: '盘中餐',
    options: ['盘中餐', '碗里饭', '田中粮', '口中谷'],
    meaning: '有谁知道碗盘里的每一粒粮食，都是农民伯伯用辛勤汗水换来的呢？',
    scene: 'rice_bowl',
    animProps: { bowl: '🍚', grain: '🌾', heart: '❤️', table: '🥢' }
  },
  {
    id: 'p9',
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐代',
    line: '白日依山尽，黄河入海流。',
    pinyinArr: [
      ['白', 'bái'], ['日', 'rì'], ['依', 'yī'], ['山', 'shān'], ['尽', 'jìn'], ['，', ''],
      ['黄', 'huáng'], ['河', 'hé'], ['入', 'rù'], ['海', 'hǎi'], ['流', 'liú'], ['。', '']
    ],
    missingWord: '黄河',
    options: ['黄河', '长江', '清泉', '白浪'],
    meaning: '红红的太阳缓缓贴着远山落下，壮阔的黄河奔腾咆哮流向大海。',
    scene: 'yellow_river',
    animProps: { sunset: '🌇', river: '🌊', mountain: '🏔️', tower: '🏯' }
  },
  {
    id: 'p10',
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐代',
    line: '欲穷千里目，更上一层楼。',
    pinyinArr: [
      ['欲', 'yù'], ['穷', 'qióng'], ['千', 'qiān'], ['里', 'lǐ'], ['目', 'mù'], ['，', ''],
      ['更', 'gèng'], ['上', 'shàng'], ['一', 'yī'], ['层', 'céng'], ['楼', 'lóu'], ['。', '']
    ],
    missingWord: '更上一层楼',
    options: ['更上一层楼', '极目远方望', '踏步登高峰', '举目看苍穹'],
    meaning: '要想看到千里之外无限美好的风光，就要再登上一层高楼！比喻精益求精。',
    scene: 'climb_tower',
    animProps: { kid: '👦', tower: '🏯', stairs: '🪜', view: '🌄' }
  },
  {
    id: 'p11',
    title: '小池',
    author: '杨万里',
    dynasty: '宋代',
    line: '小荷才露尖尖角，早有蜻蜓立上头。',
    pinyinArr: [
      ['小', 'xiǎo'], ['荷', 'hé'], ['才', 'cái'], ['露', 'lù'], ['尖', 'jiān'], ['尖', 'jiān'], ['角', 'jiǎo'], ['，', ''],
      ['早', 'zǎo'], ['有', 'yǒu'], ['蜻', 'qīng'], ['蜓', 'tíng'], ['立', 'lì'], ['上', 'shàng'], ['头', 'tóu'], ['。', '']
    ],
    missingWord: '蜻蜓',
    options: ['蜻蜓', '蝴蝶', '小鸟', '青蛙'],
    meaning: '嫩绿娇小的小荷花才刚刚露出尖尖的花角，早就有一只可爱的蜻蜓轻盈地立在上面。',
    scene: 'lotus_dragonfly',
    animProps: { lotus: '🪷', dragonfly: '🪰', pond: '🌊', sun: '☀️' }
  },
  {
    id: 'p12',
    title: '小池',
    author: '杨万里',
    dynasty: '宋代',
    line: '泉眼无声惜细流，树阴照水爱晴柔。',
    pinyinArr: [
      ['泉', 'quán'], ['眼', 'yǎn'], ['无', 'wú'], ['声', 'shēng'], ['惜', 'xī'], ['细', 'xì'], ['流', 'liú'], ['，', ''],
      ['树', 'shù'], ['阴', 'yīn'], ['照', 'zhào'], ['水', 'shuǐ'], ['爱', 'ài'], ['晴', 'qíng'], ['柔', 'róu'], ['。', '']
    ],
    missingWord: '树阴',
    options: ['树阴', '绿草', '轻舟', '白鹭'],
    meaning: '清泉从泉眼中无声地缓缓流淌，翠绿的树荫倒映在水面上，喜爱这晴朗柔和的春光。',
    scene: 'spring_stream',
    animProps: { spring: '💧', tree: '🌳', shadow: '🍃', sun: '🌤️' }
  },
  {
    id: 'p13',
    title: '江雪',
    author: '柳宗元',
    dynasty: '唐代',
    line: '千山鸟飞绝，万径人踪灭。',
    pinyinArr: [
      ['千', 'qiān'], ['山', 'shān'], ['鸟', 'niǎo'], ['飞', 'fēi'], ['绝', 'jué'], ['，', ''],
      ['万', 'wàn'], ['径', 'jìng'], ['人', 'rén'], ['踪', 'zōng'], ['灭', 'miè'], ['。', '']
    ],
    missingWord: '鸟飞绝',
    options: ['鸟飞绝', '花落尽', '白雪落', '寒风吹'],
    meaning: '所有的群山之中再也看不到飞鸟的影子，所有的林间小路上也见不到一个行人的足迹。',
    scene: 'snow_mountain',
    animProps: { snow: '❄️', mountain: '🏔️', tree: '🌲', wind: '🌬️' }
  },
  {
    id: 'p14',
    title: '江雪',
    author: '柳宗元',
    dynasty: '唐代',
    line: '孤舟蓑笠翁，独钓寒江雪。',
    pinyinArr: [
      ['孤', 'gū'], ['舟', 'zhōu'], ['蓑', 'suō'], ['笠', 'lì'], ['翁', 'wēng'], ['，', ''],
      ['独', 'dú'], ['钓', 'diào'], ['寒', 'hán'], ['江', 'jiāng'], ['雪', 'xuě'], ['。', '']
    ],
    missingWord: '蓑笠翁',
    options: ['蓑笠翁', '摆渡客', '打鱼郎', '垂钓童'],
    meaning: '茫茫江雪中一叶孤舟，一位身披蓑衣、头戴斗笠的老渔翁，正在独自钓着满江飞雪。',
    scene: 'boat_fishing',
    animProps: { boat: '🛶', fisher: '🎣', snow: '❄️', lake: '🌊' }
  },
  {
    id: 'p15',
    title: '风',
    author: '李峤',
    dynasty: '唐代',
    line: '解落三秋叶，能开二月花。',
    pinyinArr: [
      ['解', 'jiě'], ['落', 'luò'], ['三', 'sān'], ['秋', 'qiū'], ['叶', 'yè'], ['，', ''],
      ['能', 'néng'], ['开', 'kāi'], ['二', 'èr'], ['月', 'yuè'], ['花', 'huā'], ['。', '']
    ],
    missingWord: '二月花',
    options: ['二月花', '千树绿', '四时春', '万重山'],
    meaning: '风儿能吹落深秋金黄的树叶，也能催开早春二月里娇艳的花朵。',
    scene: 'wind_seasons',
    animProps: { wind: '🍃', leaf: '🍁', flower: '🌸', breeze: '💨' }
  },
  {
    id: 'p16',
    title: '风',
    author: '李峤',
    dynasty: '唐代',
    line: '过江千尺浪，入竹万竿斜。',
    pinyinArr: [
      ['过', 'guò'], ['江', 'jiāng'], ['千', 'qiān'], ['尺', 'chǐ'], ['浪', 'làng'], ['，', ''],
      ['入', 'rù'], ['竹', 'zhú'], ['万', 'wàn'], ['竿', 'gān'], ['斜', 'xiá'], ['。', '']
    ],
    missingWord: '千尺浪',
    options: ['千尺浪', '万里舟', '两岸绿', '层层波'],
    meaning: '风吹过江面掀起层层千尺巨浪，穿入竹林把万根挺拔的翠竹吹得倾斜摇摆。',
    scene: 'wind_bamboo',
    animProps: { wave: '🌊', bamboo: '🎋', wind: '💨', river: '⛵' }
  },
  {
    id: 'p17',
    title: '咏柳',
    author: '贺知章',
    dynasty: '唐代',
    line: '碧玉妆成一树高，万条垂下绿丝绦。',
    pinyinArr: [
      ['碧', 'bì'], ['玉', 'yù'], ['妆', 'zhuāng'], ['成', 'chéng'], ['一', 'yī'], ['树', 'shù'], ['高', 'gāo'], ['，', ''],
      ['万', 'wàn'], ['条', 'tiáo'], ['垂', 'chuí'], ['下', 'xià'], ['绿', 'lǜ'], ['丝', 'sī'], ['绦', 'tāo'], ['。', '']
    ],
    missingWord: '绿丝绦',
    options: ['绿丝绦', '黄金条', '青翠叶', '红丝线'],
    meaning: '高高的柳树像碧玉装扮而成，万千条柔软细长的枝条随风飘拂，像绿色的丝带。',
    scene: 'willow_tree',
    animProps: { willow: '🌿', ribbon: '🎋', breeze: '🍃', bird: '🐦' }
  },
  {
    id: 'p18',
    title: '咏柳',
    author: '贺知章',
    dynasty: '唐代',
    line: '不知细叶谁裁出，二月春风似剪刀。',
    pinyinArr: [
      ['不', 'bù'], ['知', 'zhī'], ['细', 'xì'], ['叶', 'yè'], ['谁', 'shuí'], ['裁', 'cái'], ['出', 'chū'], ['，', ''],
      ['二', 'èr'], ['月', 'yuè'], ['春', 'chūn'], ['风', 'fēng'], ['似', 'sì'], ['剪', 'jiǎn'], ['刀', 'dāo'], ['。', '']
    ],
    missingWord: '剪刀',
    options: ['剪刀', '画笔', '细丝', '轻纱'],
    meaning: '不知道这细嫩纤巧的柳叶是谁巧手裁出来的，原来二月的温暖春风就像一把神奇的剪刀！',
    scene: 'spring_scissors',
    animProps: { wind: '🍃', leaf: '🌱', scissor: '✂️', willow: '🎋' }
  },
  {
    id: 'p19',
    title: '赋得古原草送别',
    author: '白居易',
    dynasty: '唐代',
    line: '离离原上草，一岁一枯荣。',
    pinyinArr: [
      ['离', 'lí'], ['离', 'lí'], ['原', 'yuán'], ['上', 'shàng'], ['草', 'cǎo'], ['，', ''],
      ['一', 'yī'], ['岁', 'suì'], ['一', 'yī'], ['枯', 'kū'], ['荣', 'róng'], ['。', '']
    ],
    missingWord: '原上草',
    options: ['原上草', '林中木', '原野花', '水边苇'],
    meaning: '古原上青草茂盛繁密，每年秋冬枯黄、到了春天又欣欣向荣。',
    scene: 'prairie_grass',
    animProps: { grass: '🌾', green: '🌱', sun: '☀️', horse: '🐎' }
  },
  {
    id: 'p20',
    title: '赋得古原草送别',
    author: '白居易',
    dynasty: '唐代',
    line: '野火烧不尽，春风吹又生。',
    pinyinArr: [
      ['野', 'yě'], ['火', 'huǒ'], ['烧', 'shāo'], ['不', 'bù'], ['尽', 'jìn'], ['，', ''],
      ['春', 'chūn'], ['风', 'fēng'], ['吹', 'chuī'], ['又', 'yòu'], ['生', 'shēng'], ['。', '']
    ],
    missingWord: '春风',
    options: ['春风', '秋雨', '夏阳', '晨露'],
    meaning: '野火无法将小草顽强的根系彻底烧尽，等春风一吹，绿意便再次破土重生！',
    scene: 'fire_sprout',
    animProps: { fire: '🔥', sprout: '🌱', breeze: '🍃', prairie: '🌾' }
  },
  {
    id: 'p21',
    title: '画',
    author: '王维',
    dynasty: '唐代',
    line: '远看山有色，近听水无声。',
    pinyinArr: [
      ['远', 'yuǎn'], ['看', 'kàn'], ['山', 'shān'], ['有', 'yǒu'], ['色', 'sè'], ['，', ''],
      ['近', 'jìn'], ['听', 'tīng'], ['水', 'shuǐ'], ['无', 'wú'], ['声', 'shēng'], ['。', '']
    ],
    missingWord: '水无声',
    options: ['水无声', '风有音', '鸟有言', '花有香'],
    meaning: '远远望去山峦青翠秀丽，走近细听流水却听不到一点水声（原来是一幅画呀）。',
    scene: 'painting_scroll',
    animProps: { painting: '🖼️', mountain: '⛰️', river: '🌊', tree: '🌲' }
  },
  {
    id: 'p22',
    title: '画',
    author: '王维',
    dynasty: '唐代',
    line: '春去花还在，人来鸟不惊。',
    pinyinArr: [
      ['春', 'chūn'], ['去', 'qù'], ['花', 'huā'], ['还', 'hái'], ['在', 'zài'], ['，', ''],
      ['人', 'rén'], ['来', 'lái'], ['鸟', 'niǎo'], ['不', 'bù'], ['惊', 'jīng'], ['。', '']
    ],
    missingWord: '鸟不惊',
    options: ['鸟不惊', '蝶双飞', '草木深', '月正明'],
    meaning: '春天过去了枝头的花朵依旧娇艳盛开，有人走过来树上的鸟儿也丝毫不受惊吓。',
    scene: 'bird_branch',
    animProps: { bird: '🐦', flower: '🌸', branch: '🎋', scroll: '📜' }
  },
  {
    id: 'p23',
    title: '池上',
    author: '白居易',
    dynasty: '唐代',
    line: '小娃撑小艇，偷采白莲回。',
    pinyinArr: [
      ['小', 'xiǎo'], ['娃', 'wá'], ['撑', 'chēng'], ['小', 'xiǎo'], ['艇', 'tǐng'], ['，', ''],
      ['偷', 'tōu'], ['采', 'cǎi'], ['白', 'bái'], ['莲', 'lián'], ['回', 'huí'], ['。', '']
    ],
    missingWord: '白莲',
    options: ['白莲', '红菱', '青荇', '绿荷'],
    meaning: '天真可爱的小男孩独自撑着一只小船，悄悄采了几朵清香的大白莲花开开心心划回来。',
    scene: 'boy_boat',
    animProps: { boy: '👦', boat: '🛶', lotus: '🪷', leaf: '🍃' }
  },
  {
    id: 'p24',
    title: '池上',
    author: '白居易',
    dynasty: '唐代',
    line: '不解藏踪迹，浮萍一道开。',
    pinyinArr: [
      ['不', 'bù'], ['解', 'jiě'], ['藏', 'cáng'], ['踪', 'zōng'], ['迹', 'jì'], ['，', ''],
      ['浮', 'fú'], ['萍', 'píng'], ['一', 'yī'], ['道', 'dào'], ['开', 'kāi'], ['。', '']
    ],
    missingWord: '浮萍',
    options: ['浮萍', '芦苇', '绿浪', '白波'],
    meaning: '小顽童还不懂怎么掩藏自己的行踪，水面上的浮萍早被小船划开了一道长长的水痕！',
    scene: 'duckweed_track',
    animProps: { pond: '🌊', boat: '🛶', weed: '🌿', track: '〰️' }
  },
  {
    id: 'p25',
    title: '所见',
    author: '袁枚',
    dynasty: '清代',
    line: '牧童骑黄牛，歌声振林樾。',
    pinyinArr: [
      ['牧', 'mù'], ['童', 'tóng'], ['骑', 'qí'], ['黄', 'huáng'], ['牛', 'niú'], ['，', ''],
      ['歌', 'gē'], ['声', 'shēng'], ['振', 'zhèn'], ['林', 'lín'], ['樾', 'yuè'], ['。', '']
    ],
    missingWord: '黄牛',
    options: ['黄牛', '白马', '小鹿', '青骡'],
    meaning: '牧童骑在宽厚的黄牛背上悠哉赶路，嘹亮清脆的歌声在茂密的树林中久久回荡。',
    scene: 'cowboy_sing',
    animProps: { boy: '👦', cow: '🐂', forest: '🌳', note: '🎵' }
  },
  {
    id: 'p26',
    title: '所见',
    author: '袁枚',
    dynasty: '清代',
    line: '意欲捕鸣蝉，忽然闭口立。',
    pinyinArr: [
      ['意', 'yì'], ['欲', 'yù'], ['捕', 'bǔ'], ['鸣', 'míng'], ['蝉', 'chán'], ['，', ''],
      ['忽', 'hū'], ['然', 'rán'], ['闭', 'bì'], ['口', 'kǒu'], ['立', 'lì'], ['。', '']
    ],
    missingWord: '鸣蝉',
    options: ['鸣蝉', '彩蝶', '蜻蜓', '飞鸟'],
    meaning: '忽然听到树上欢叫的知了，小牧童想要去捉蝉，立刻闭住嘴巴屏住呼吸静静站在树下。',
    scene: 'catch_cicada',
    animProps: { boy: '🤫', cicada: '🪲', tree: '🌳', leaf: '🍃' }
  },
  {
    id: 'p27',
    title: '村居',
    author: '高鼎',
    dynasty: '清代',
    line: '儿童散学归来早，忙趁东风放纸鸢。',
    pinyinArr: [
      ['儿', 'ér'], ['童', 'tóng'], ['散', 'sàn'], ['学', 'xué'], ['归', 'guī'], ['来', 'lái'], ['早', 'zǎo'], ['，', ''],
      ['忙', 'máng'], ['趁', 'chèn'], ['东', 'dōng'], ['风', 'fēng'], ['放', 'fàng'], ['纸', 'zhǐ'], ['鸢', 'yuān'], ['。', '']
    ],
    missingWord: '纸鸢',
    options: ['纸鸢', '飞箭', '陀螺', '纸船'],
    meaning: '村里的小朋友放学回家早，赶紧趁着和煦的早春东风，在田野上欢快地放风筝！',
    scene: 'flying_kite',
    animProps: { kite: '🪁', kids: '👫', field: '🌾', wind: '💨' }
  },
  {
    id: 'p28',
    title: '村居',
    author: '高鼎',
    dynasty: '清代',
    line: '草长莺飞二月天，拂堤杨柳醉春烟。',
    pinyinArr: [
      ['草', 'cǎo'], ['长', 'zhǎng'], ['莺', 'yīng'], ['飞', 'fēi'], ['二', 'èr'], ['月', 'yuè'], ['天', 'tiān'], ['，', ''],
      ['拂', 'fú'], ['堤', 'dī'], ['杨', 'yáng'], ['柳', 'liǔ'], ['醉', 'zuì'], ['春', 'chūn'], ['烟', 'yān'], ['。', '']
    ],
    missingWord: '杨柳',
    options: ['杨柳', '桃花', '翠竹', '绿树'],
    meaning: '早春二月青草青翠黄莺飞舞，岸边轻拂水堤的杨柳在水汽春烟中如痴如醉。',
    scene: 'village_spring',
    animProps: { willow: '🌿', bird: '🐤', smoke: '🌫️', grass: '🌱' }
  },
  {
    id: 'p29',
    title: '望庐山瀑布',
    author: '李白',
    dynasty: '唐代',
    line: '飞流直下三千尺，疑是银河落九天。',
    pinyinArr: [
      ['飞', 'fēi'], ['流', 'liú'], ['直', 'zhí'], ['下', 'xià'], ['三', 'sān'], ['千', 'qiān'], ['尺', 'chǐ'], ['，', ''],
      ['疑', 'yí'], ['是', 'shì'], ['银', 'yín'], ['河', 'hé'], ['落', 'luò'], ['九', 'jiǔ'], ['天', 'tiān'], ['。', '']
    ],
    missingWord: '银河',
    options: ['银河', '白练', '飞雪', '瀑布'],
    meaning: '奔腾的瀑布从高崖上飞泻直下三千尺，让人恍惚以为是九天之上的璀璨银河倾泻人间！',
    scene: 'lushan_waterfall',
    animProps: { waterfall: '🌊', mountain: '🏔️', cloud: '☁️', star: '✨' }
  },
  {
    id: 'p30',
    title: '望庐山瀑布',
    author: '李白',
    dynasty: '唐代',
    line: '日照香炉生紫烟，遥看瀑布挂前川。',
    pinyinArr: [
      ['日', 'rì'], ['照', 'zhào'], ['香', 'xiāng'], ['炉', 'lú'], ['生', 'shēng'], ['紫', 'zǐ'], ['烟', 'yān'], ['，', ''],
      ['遥', 'yáo'], ['看', 'kàn'], ['瀑', 'pù'], ['布', 'bù'], ['挂', 'guà'], ['前', 'qián'], ['川', 'chuān'], ['。', '']
    ],
    missingWord: '紫烟',
    options: ['紫烟', '白浪', '青云', '彩霞'],
    meaning: '阳光照耀下的香炉峰升腾起淡淡紫色的云烟，远远望去奔腾的瀑布像一条白练悬挂在山川前。',
    scene: 'lushan_peak',
    animProps: { peak: '⛰️', sun: '☀️', smoke: '🟣', waterfall: '🌊' }
  },
  {
    id: 'p31',
    title: '暮江吟',
    author: '白居易',
    dynasty: '唐代',
    line: '一道残阳铺水中，半江瑟瑟半江红。',
    pinyinArr: [
      ['一', 'yī'], ['道', 'dào'], ['残', 'cán'], ['阳', 'yáng'], ['铺', 'pū'], ['水', 'shuǐ'], ['中', 'zhōng'], ['，', ''],
      ['半', 'bàn'], ['江', 'jiāng'], ['瑟', 'sè'], ['瑟', 'sè'], ['半', 'bàn'], ['江', 'jiāng'], ['红', 'hóng'], ['。', '']
    ],
    missingWord: '残阳',
    options: ['残阳', '新月', '清波', '春风'],
    meaning: '一道落日的余晖斜铺在江水之上，水面一半呈现出碧玉般的深绿，另一半被夕阳染得通红。',
    scene: 'sunset_river',
    animProps: { sunset: '🌇', river: '🌊', water_red: '🔴', water_green: '🟢' }
  },
  {
    id: 'p32',
    title: '暮江吟',
    author: '白居易',
    dynasty: '唐代',
    line: '可怜九月初三夜，露似真珠月似弓。',
    pinyinArr: [
      ['可', 'kě'], ['怜', 'lián'], ['九', 'jiǔ'], ['月', 'yuè'], ['初', 'chū'], ['三', 'sān'], ['夜', 'yè'], ['，', ''],
      ['露', 'lù'], ['似', 'sì'], ['真', 'zhēn'], ['珠', 'zhū'], ['月', 'yuè'], ['似', 'sì'], ['弓', 'gōng'], ['。', '']
    ],
    missingWord: '真珠',
    options: ['真珠', '白玉', '繁星', '美酒'],
    meaning: '最让人怜爱的是九月初三这清朗可人的秋夜，草叶上的露珠晶莹像颗颗真珠，弯弯的蛾眉新月恰似一把精巧的小弓！',
    scene: 'dew_moon',
    animProps: { moon: '🌙', dew: '💧', grass: '🌿', night: '🌌' }
  }
];

// 辅助工具方法：构建带拼音的 ruby HTML 字符串
function buildRubyHtml(pinyinArr) {
  return pinyinArr.map(([char, py]) => {
    if (!py) return `<span class="punct">${char}</span>`;
    return `<ruby>${char}<rt>${py}</rt></ruby>`;
  }).join('');
}

// 导出题库对象
window.chineseData = {
  idioms: IDIOM_DATABASE,
  poems: POETRY_DATABASE,
  buildRubyHtml
};
