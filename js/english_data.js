/**
 * 乐学萌岛 - 英语探索岛：日常互助小帮手题库
 * 设计哲学：零中文翻译，纯英文语感，靠视觉情境、声音语气与生活常识建立直接联结
 */

const ENGLISH_STORY_DATABASE = [
  {
    id: 'e1',
    scene: 'rain_bunny',
    title: 'Rainy Day',
    crisisSpeech: "The red umbrella, please.",
    thankYouSpeech: "Thank you! I'm dry now.",
    actor: '🐰',
    contextIcon: '🌧️',
    correctTool: 'red-umbrella',
    options: [
      { value: 'red-umbrella', label: 'Red umbrella', kind: 'umbrella', color: 'red' },
      { value: 'blue-umbrella', label: 'Blue umbrella', kind: 'umbrella', color: 'blue' },
      { value: 'yellow-umbrella', label: 'Yellow umbrella', kind: 'umbrella', color: 'yellow' }
    ]
  },
  {
    id: 'e2',
    scene: 'thirsty_lion',
    title: 'Thirsty Lion',
    crisisSpeech: "I'm thirsty. Water, please.",
    thankYouSpeech: "Thank you! That's better.",
    actor: '🦁',
    contextIcon: '☀️',
    correctTool: 'water',
    options: [
      { value: 'water', label: 'Water', kind: 'beverage', color: 'water' },
      { value: 'milk', label: 'Milk', kind: 'beverage', color: 'milk' },
      { value: 'juice', label: 'Juice', kind: 'beverage', color: 'juice' }
    ]
  },
  {
    id: 'e3',
    scene: 'dark_bear',
    title: 'Reading Bear',
    crisisSpeech: "The lamp, please.",
    thankYouSpeech: "Thank you! I can see!",
    actor: '🐻',
    contextIcon: '🌙',
    correctTool: 'lamp',
    options: [
      { value: 'lamp', label: 'Lamp', kind: 'lamp' },
      { value: 'book', label: 'Book', kind: 'emoji', icon: '📖' },
      { value: 'ball', label: 'Ball', kind: 'emoji', icon: '⚽' }
    ]
  },
  {
    id: 'e4',
    scene: 'snack_bunny',
    title: 'Snack Time',
    crisisSpeech: "An apple, please.",
    thankYouSpeech: "Thank you! Yum!",
    actor: '🐰',
    contextIcon: '🧺',
    correctTool: 'apple',
    options: [
      { value: 'apple', label: 'Apple', kind: 'emoji', icon: '🍎' },
      { value: 'banana', label: 'Banana', kind: 'emoji', icon: '🍌' },
      { value: 'bread', label: 'Bread', kind: 'emoji', icon: '🍞' }
    ]
  },
  {
    id: 'e5',
    scene: 'clean_pig',
    title: 'Wash Hands',
    crisisSpeech: "Soap, please.",
    thankYouSpeech: "Thank you! Nice and clean.",
    actor: '🐷',
    contextIcon: '🫧',
    correctTool: 'soap',
    options: [
      { value: 'soap', label: 'Soap', kind: 'emoji', icon: '🧼' },
      { value: 'towel', label: 'Towel', kind: 'towel' },
      { value: 'brush', label: 'Brush', kind: 'emoji', icon: '🪥' }
    ]
  },
  {
    id: 'e6',
    scene: 'monkey_banana',
    title: 'Sweet Fruit',
    crisisSpeech: "The yellow banana, please.",
    thankYouSpeech: "Thank you! A yellow banana.",
    actor: '🐵',
    contextIcon: '🌴',
    correctTool: 'yellow-banana',
    options: [
      { value: 'yellow-banana', label: 'Yellow banana', kind: 'banana', color: 'yellow' },
      { value: 'green-banana', label: 'Green banana', kind: 'banana', color: 'green' },
      { value: 'red-banana', label: 'Red banana', kind: 'banana', color: 'red' }
    ]
  },
  {
    id: 'e7',
    scene: 'cold_penguin',
    title: 'Warm Clothes',
    crisisSpeech: "My red scarf, please.",
    thankYouSpeech: "Thank you! I'm warm now.",
    actor: '🐧',
    contextIcon: '❄️',
    correctTool: 'red-scarf',
    options: [
      { value: 'red-scarf', label: 'Red scarf', kind: 'scarf', color: 'red' },
      { value: 'blue-scarf', label: 'Blue scarf', kind: 'scarf', color: 'blue' },
      { value: 'yellow-scarf', label: 'Yellow scarf', kind: 'scarf', color: 'yellow' }
    ]
  },
  {
    id: 'e8',
    scene: 'duck_snack',
    title: 'Duck Snacks',
    crisisSpeech: "Two apples, please.",
    thankYouSpeech: "Thank you! One, two!",
    actor: '🦆',
    contextIcon: '🌾',
    correctTool: 'two-apples',
    options: [
      { value: 'one-apple', label: 'One apple', kind: 'apples', count: 1 },
      { value: 'two-apples', label: 'Two apples', kind: 'apples', count: 2 },
      { value: 'three-apples', label: 'Three apples', kind: 'apples', count: 3 }
    ]
  },
  {
    id: 'e9',
    scene: 'cat_bedtime',
    title: 'Bedtime Toy',
    crisisSpeech: "My teddy bear, please.",
    thankYouSpeech: "Thank you! My teddy bear.",
    actor: '🐱',
    contextIcon: '🛏️',
    correctTool: 'teddy',
    options: [
      { value: 'teddy', label: 'Teddy bear', kind: 'emoji', icon: '🧸' },
      { value: 'car', label: 'Toy car', kind: 'emoji', icon: '🚗' },
      { value: 'ball', label: 'Ball', kind: 'emoji', icon: '⚽' }
    ]
  },
  {
    id: 'e10',
    scene: 'dog_tidy',
    title: 'Tidy Up',
    crisisSpeech: "The box, please.",
    thankYouSpeech: "Thank you! Let's tidy up.",
    actor: '🐕',
    contextIcon: '🧩',
    correctTool: 'box',
    options: [
      { value: 'box', label: 'Box', kind: 'emoji', icon: '📦' },
      { value: 'basket', label: 'Basket', kind: 'emoji', icon: '🧺' },
      { value: 'bag', label: 'Bag', kind: 'emoji', icon: '🎒' }
    ]
  },
  {
    id: 'e11',
    scene: 'girl_birthday',
    title: 'Party Balloons',
    crisisSpeech: "Three balloons, please.",
    thankYouSpeech: "Thank you! One, two, three!",
    actor: '👧',
    contextIcon: '🎂',
    correctTool: 'three-balloons',
    options: [
      { value: 'one-balloon', label: 'One balloon', kind: 'balloons', count: 1 },
      { value: 'two-balloons', label: 'Two balloons', kind: 'balloons', count: 2 },
      { value: 'three-balloons', label: 'Three balloons', kind: 'balloons', count: 3 }
    ]
  },
  {
    id: 'e12',
    scene: 'girl_kite',
    title: 'Fly a Kite',
    crisisSpeech: "The blue kite, please.",
    thankYouSpeech: "Thank you! My blue kite.",
    actor: '👧',
    contextIcon: '☁️',
    correctTool: 'blue-kite',
    options: [
      { value: 'red-kite', label: 'Red kite', kind: 'kite', color: 'red' },
      { value: 'blue-kite', label: 'Blue kite', kind: 'kite', color: 'blue' },
      { value: 'yellow-kite', label: 'Yellow kite', kind: 'kite', color: 'yellow' }
    ]
  }
];

// 导出题库对象
window.englishData = {
  stories: ENGLISH_STORY_DATABASE
};
