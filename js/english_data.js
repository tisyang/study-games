/**
 * 乐学萌岛 - 英语探索岛：情境救急小剧场题库
 * 设计哲学：零中文翻译，纯英文语感，靠视觉情境、声音语气与生活常识建立直接联结
 */

const ENGLISH_STORY_DATABASE = [
  {
    id: 'e1',
    scene: 'rain_bunny',
    title: 'Rainy Day',
    // 纯正地道原声（带情绪起伏）
    crisisSpeech: "Oh no! It is raining heavily! The little bunny is so wet and cold. What can help her?",
    thankYouSpeech: "Wow, thank you! The umbrella keeps me warm and dry!",
    // 危机视觉场景
    sceneDesc: '🌧️ 狂风大雨倾盆而下，小兔子抱臂发抖',
    actor: '🐰',
    environment: '🌧️ 🌧️ 🌧️',
    correctTool: '☂️',
    options: ['☂️', '🍦', '🥾'], // 雨伞 / 冰淇淋 / 靴子
    toolLabels: ['Umbrella', 'Ice cream', 'Boots'],
    solvedAnim: 'umbrella_open'
  },
  {
    id: 'e2',
    scene: 'hot_lion',
    title: 'Hot Summer',
    crisisSpeech: "Phew! The sun is burning hot! The poor lion is sweating so much. What does he need?",
    thankYouSpeech: "Slurp! Cold water is so sweet! Now I feel so cool and happy!",
    sceneDesc: '☀️ 烈日炎炎，小狮子大口喘气满头大汗',
    actor: '🦁',
    environment: '☀️ ☀️ ☀️',
    correctTool: '🧊',
    options: ['🧊', '🧣', '🪨'], // 冰水 / 围巾 / 石头
    toolLabels: ['Cold water', 'Scarf', 'Rock'],
    solvedAnim: 'drink_cool'
  },
  {
    id: 'e3',
    scene: 'dark_room',
    title: 'Dark Night',
    crisisSpeech: "It is night time! The bedroom is pitch dark! Little Bear is scared of the dark. Let's make it bright!",
    thankYouSpeech: "Click! The lamp is on! The room is cozy and bright now!",
    sceneDesc: '🌙 漆黑的夜晚，小熊揉着眼睛害怕黑暗',
    actor: '🐻',
    environment: '🌌 🌙 ⭐',
    correctTool: '💡',
    options: ['💡', '🥄', '🧦'], // 台灯 / 勺子 / 袜子
    toolLabels: ['Lamp', 'Spoon', 'Socks'],
    solvedAnim: 'light_on'
  },
  {
    id: 'e4',
    scene: 'hungry_puppy',
    title: 'Hungry Puppy',
    crisisSpeech: "Listen! The puppy's tummy is growling! He is so hungry. What can he eat?",
    thankYouSpeech: "Yum, yum, yum! A delicious bone! You are my best friend!",
    sceneDesc: '🐕 肚子饿得咕噜叫的小狗，眼巴巴望着前方',
    actor: '🐕',
    environment: '🥣 🐾 💭',
    correctTool: '🦴',
    options: ['🦴', '🧼', '✏️'], // 骨头 / 肥皂 / 铅笔
    toolLabels: ['Bone', 'Soap', 'Pencil'],
    solvedAnim: 'eat_bone'
  },
  {
    id: 'e5',
    scene: 'muddy_pig',
    title: 'Muddy Piggy',
    crisisSpeech: "Look at the little piggy! He played in the mud, and he is so dirty! How can we clean him up?",
    thankYouSpeech: "Splish splash! The bubbly soap makes me clean and smell so fresh!",
    sceneDesc: '🐷 身上沾满泥巴斑点的小粉猪',
    actor: '🐷',
    environment: '💩 💦 🐾',
    correctTool: '🧼',
    options: ['🧼', '🍰', '🎈'], // 肥皂 / 蛋糕 / 气球
    toolLabels: ['Soap', 'Cake', 'Balloon'],
    solvedAnim: 'bubble_wash'
  },
  {
    id: 'e6',
    scene: 'high_bananas',
    title: 'High Bananas',
    crisisSpeech: "The monkey loves sweet bananas! But look, they are way too high on the tree! He cannot reach them!",
    thankYouSpeech: "Aha! I climbed up the ladder and got all the bananas! Yummy!",
    sceneDesc: '🐵 树下蹦蹦跳跳却够不着香蕉的小猴子',
    actor: '🐵',
    environment: '🌴 🍌 🍌',
    correctTool: '🪜',
    options: ['🪜', '🪥', '✂️'], // 梯子 / 牙刷 / 剪刀
    toolLabels: ['Ladder', 'Toothbrush', 'Scissors'],
    solvedAnim: 'climb_ladder'
  },
  {
    id: 'e7',
    scene: 'freezing_penguin',
    title: 'Freezing Penguin',
    crisisSpeech: "Brrr! The winter wind is freezing cold! The poor penguin is shivering. Keep him warm, please!",
    thankYouSpeech: "A warm red scarf! It feels so soft and warm around my neck!",
    sceneDesc: '❄️ 狂风大雪中直打哆嗦的小企鹅',
    actor: '🐧',
    environment: '❄️ 🌬️ ❄️',
    correctTool: '🧣',
    options: ['🧣', '🕶️', '🍉'], // 红围巾 / 墨镜 / 西瓜
    toolLabels: ['Warm scarf', 'Sunglasses', 'Watermelon'],
    solvedAnim: 'wear_scarf'
  },
  {
    id: 'e8',
    scene: 'thirsty_duck',
    title: 'Thirsty Duck',
    crisisSpeech: "Quack, quack! The little duck walked all day in the sun. His throat is so dry! Give him something to drink!",
    thankYouSpeech: "Gulp, gulp! Fresh clean water! Now I can swim and sing happily!",
    sceneDesc: '🦆 喉咙干渴、伸长脖子的小黄鸭',
    actor: '🦆',
    environment: '🌾 ☀️ 💨',
    correctTool: '💧',
    options: ['💧', '⚽', '🪨'], // 清水 / 足球 / 石子
    toolLabels: ['Water', 'Football', 'Stones'],
    solvedAnim: 'drink_water'
  },
  {
    id: 'e9',
    scene: 'sleepy_cat',
    title: 'Sleepy Cat',
    crisisSpeech: "Yawn! The little kitten played with yarn all afternoon. Her eyes are closing! Where should she sleep?",
    thankYouSpeech: "Purr, purr... Such a soft cozy bed! Sweet dreams!",
    sceneDesc: '🐱 困得直打哈欠、趴在地上的小猫咪',
    actor: '🐱',
    environment: '🧶 🥱 💤',
    correctTool: '🛏️',
    options: ['🛏️', '🔨', '🚗'], // 软小床 / 铁锤 / 小汽车
    toolLabels: ['Cozy bed', 'Hammer', 'Toy car'],
    solvedAnim: 'sleep_bed'
  },
  {
    id: 'e10',
    scene: 'messy_room',
    title: 'Messy Toys',
    crisisSpeech: "Oh dear! Toys and blocks are all over the floor! Someone might trip and fall! Where do toys belong?",
    thankYouSpeech: "Everything is back into the toy box! Look how tidy and neat the room is!",
    sceneDesc: '🧸 地上散落着积木与娃娃，乱糟糟的房间',
    actor: '🐕',
    environment: '🧸 🚗 🧩',
    correctTool: '📦',
    options: ['📦', '🪴', '🫖'], // 收纳箱 / 花盆 / 茶壶
    toolLabels: ['Toy box', 'Plant pot', 'Teapot'],
    solvedAnim: 'pack_box'
  },
  {
    id: 'e11',
    scene: 'birthday_candles',
    title: 'Birthday Party',
    crisisSpeech: "Hooray! It is a happy birthday party! But wait, the cake candles have no fire yet! Let's light them up!",
    thankYouSpeech: "One, two, three, blow! Happy birthday to me! Hip hip hooray!",
    sceneDesc: '🎂 生日蛋糕上的彩色蜡烛还没有被点燃',
    actor: '👧',
    environment: '🎂 🎈 🥳',
    correctTool: '🔥',
    options: ['🔥', '🥄', '🧦'], // 火柴火苗 / 勺子 / 袜子
    toolLabels: ['Fire', 'Spoon', 'Socks'],
    solvedAnim: 'light_candle'
  },
  {
    id: 'e12',
    scene: 'flying_kite',
    title: 'Fly a Kite',
    crisisSpeech: "The sky is clear and blue! The girl has a colorful kite, but it won't fly without something in the air!",
    thankYouSpeech: "Whoosh! The gentle spring breeze carried my kite high into the clouds!",
    sceneDesc: '🪁 草地上拿着风筝等待起飞的小女孩',
    actor: '👧',
    environment: '🪁 🌱 ☁️',
    correctTool: '💨',
    options: ['💨', '🪨', '📦'], // 阵阵春风 / 大石头 / 纸箱
    toolLabels: ['Gentle wind', 'Heavy rock', 'Cardboard box'],
    solvedAnim: 'kite_soar'
  }
];

// 导出题库对象
window.englishData = {
  stories: ENGLISH_STORY_DATABASE
};
