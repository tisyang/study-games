/**
 * 小学二年级数学题目生成器与辅助教学引擎
 * 涵盖：100以内进退位加减法、九九表内乘除法、智能干扰项与错题提示
 */

class MathGameEngine {
  constructor() {
    // 九九乘法口诀字典 (标准人教版口诀)
    this.multiplicationRhymes = {
      '1x1': '一一得一',
      '1x2': '一二得二', '2x2': '二二得四',
      '1x3': '一三得三', '2x3': '二三得六', '3x3': '三三得九',
      '1x4': '一四得四', '2x4': '二四得八', '3x4': '三四十二', '4x4': '四四十六',
      '1x5': '一五得五', '2x5': '二五一十', '3x5': '三五十五', '4x5': '四五二十', '5x5': '五五二十五',
      '1x6': '一六得六', '2x6': '二六十二', '3x6': '三六十八', '4x6': '四六二十四', '5x6': '五六三十', '6x6': '六六三十六',
      '1x7': '一七得七', '2x7': '二七十四', '3x7': '三七二十一', '4x7': '四七二十八', '5x7': '五七三十五', '6x7': '六七四十二', '7x7': '七七四十九',
      '1x8': '一八得八', '2x8': '二八十六', '3x8': '三八二十四', '4x8': '四八三十二', '5x8': '五八四十', '6x8': '六八四十八', '7x8': '七八五十六', '8x8': '八八六十四',
      '1x9': '一九得九', '2x9': '二九十八', '3x9': '三九二十七', '4x9': '四九三十六', '5x9': '五九四十五', '6x9': '六九五十四', '7x9': '七九六十三', '8x9': '八九七十二', '9x9': '九九八十一'
    };
  }

  // 获取口诀（自动将因数小的排在前面）
  getRhyme(a, b) {
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    return this.multiplicationRhymes[`${min}x${max}`] || '';
  }

  // 生成一道符合二年级范围的题目
  generateQuestion(mode = 'mix') {
    let type = mode;
    if (mode === 'mix') {
      const types = ['add', 'sub', 'mul', 'div'];
      type = types[Math.floor(Math.random() * types.length)];
    }

    let q = null;
    switch (type) {
      case 'add':
        q = this._generateAdd();
        break;
      case 'sub':
        q = this._generateSub();
        break;
      case 'mul':
        q = this._generateMul();
        break;
      case 'div':
        q = this._generateDiv();
        break;
      default:
        q = this._generateAdd();
    }

    // 生成4个高仿真选项
    q.options = this._generateOptions(q);
    return q;
  }

  // 100以内加法 (70%概率生成进位加法以针对性练习)
  _generateAdd() {
    const needCarry = Math.random() < 0.7;
    let a, b;

    if (needCarry) {
      // 构造进位：个位数相加 >= 10
      const aOnes = Math.floor(Math.random() * 8) + 2; // 2~9
      const minBOnes = 10 - aOnes;
      const bOnes = minBOnes + Math.floor(Math.random() * (10 - minBOnes));
      const aTens = Math.floor(Math.random() * 6) + 1; // 1~6
      const bTens = Math.floor(Math.random() * (8 - aTens)); // 保证两数和不超过 99
      a = aTens * 10 + aOnes;
      b = bTens * 10 + bOnes;
    } else {
      a = Math.floor(Math.random() * 40) + 10;
      b = Math.floor(Math.random() * (90 - a)) + 5;
    }

    const answer = a + b;
    const isCarry = (a % 10) + (b % 10) >= 10;

    let hint = '';
    if (isCarry) {
      hint = `💡 进位小秘诀：\n个位 ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}（满十进一写 ${answer % 10}）；\n十位 ${Math.floor(a / 10)} + ${Math.floor(b / 10)} 再加上进位的 1，就是 ${Math.floor(answer / 10)} 啦！`;
    } else {
      hint = `💡 拆数法：\n十位相加：${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10} = ${(Math.floor(a / 10) + Math.floor(b / 10)) * 10}\n个位相加：${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}\n合起来就是 ${answer}！`;
    }

    return {
      type: 'add',
      typeName: '加法',
      storyTag: '🍎 果园装箱工场',
      story: `果园大丰收！树上摘了 ${a} 个苹果，小鹿又运来 ${b} 个。两堆苹果合在一起，一共能装多少个苹果呢？`,
      num1: a,
      num2: b,
      op: '+',
      answer,
      hint,
      prompt: `${a} + ${b} = ?`
    };
  }

  // 100以内减法 (70%概率生成退位减法)
  _generateSub() {
    const needBorrow = Math.random() < 0.7;
    let a, b;

    if (needBorrow) {
      // 构造退位：a 的个位严格小于 b 的个位
      const aOnes = Math.floor(Math.random() * 8); // 0~7
      const bOnes = aOnes + 1 + Math.floor(Math.random() * (9 - aOnes)); // aOnes+1 ~ 9
      const aTens = Math.floor(Math.random() * 7) + 2; // 2~8
      const bTens = Math.floor(Math.random() * (aTens - 1)) + 1; // 1 ~ aTens-1
      a = aTens * 10 + aOnes;
      b = bTens * 10 + bOnes;
    } else {
      a = Math.floor(Math.random() * 70) + 25;
      b = Math.floor(Math.random() * (a - 10)) + 5;
    }

    const answer = a - b;
    const isBorrow = (a % 10) < (b % 10);

    let hint = '';
    if (isBorrow) {
      hint = `💡 退位破十法：\n个位 ${a % 10} 减 ${b % 10} 不够减，向十位借 1 当十：\n10 减 ${b % 10} 得 ${10 - (b % 10)}，再加上 ${a % 10} 得 ${answer % 10}；\n十位借走 1 还剩 ${Math.floor(a / 10) - 1}，减去 ${Math.floor(b / 10)} 得 ${Math.floor(answer / 10)}。答案是 ${answer}！`;
    } else {
      hint = `💡 轻松减法：\n十位相减：${Math.floor(a / 10) * 10} - ${Math.floor(b / 10) * 10} = ${(Math.floor(a / 10) - Math.floor(b / 10)) * 10}\n个位相减：${a % 10} - ${b % 10} = ${(a % 10) - (b % 10)}\n合起来就是 ${answer}！`;
    }

    return {
      type: 'sub',
      typeName: '减法',
      storyTag: '🐿️ 松鼠储蓄屋',
      story: `小松鼠仓库里存了 ${a} 颗松果，松鼠宝宝准备拿走 ${b} 颗过冬。拿走之后，仓库里还剩下多少颗松果？`,
      num1: a,
      num2: b,
      op: '-',
      answer,
      hint,
      prompt: `${a} - ${b} = ?`
    };
  }

  // 表内乘法 (1~9)
  _generateMul() {
    const a = Math.floor(Math.random() * 8) + 2; // 2~9
    const b = Math.floor(Math.random() * 8) + 2; // 2~9
    const answer = a * b;
    const rhyme = this.getRhyme(a, b);

    const hint = `💡 口诀小帮手：\n想一想乘法口诀：「${rhyme}」\n所以 ${a} × ${b} = ${answer}！`;

    return {
      type: 'mul',
      typeName: '乘法',
      storyTag: '🍪 魔法曲奇烤盘',
      story: `面包师烤了一盘香喷喷的曲奇，整齐排了 ${a} 排，每一排都刚好有 ${b} 块。烤盘上一共有多少块曲奇呢？`,
      num1: a,
      num2: b,
      op: '×',
      answer,
      hint,
      prompt: `${a} × ${b} = ?`
    };
  }

  // 表内除法 (1~9除法，整除)
  _generateDiv() {
    const divisor = Math.floor(Math.random() * 8) + 2; // 除数 2~9
    const quotient = Math.floor(Math.random() * 8) + 2; // 商 2~9
    const dividend = divisor * quotient; // 被除数
    const rhyme = this.getRhyme(divisor, quotient);

    const hint = `💡 除法想乘法：\n想一想口诀：几乘 ${divisor} 得 ${dividend}？\n乘法口诀说：「${rhyme}」，所以答案是 ${quotient}！`;

    return {
      type: 'div',
      typeName: '除法',
      storyTag: '🍓 动物野餐派对',
      story: `野餐桌上一共有 ${dividend} 颗新鲜草莓，要绝对公平地平均分给 ${divisor} 位小动物好朋友。每只小动物能分到多少颗？`,
      num1: dividend,
      num2: divisor,
      op: '÷',
      answer: quotient,
      hint,
      prompt: `${dividend} ÷ ${divisor} = ?`
    };
  }

  // 智能生成 4 个选项（包含真实答案与常见误区干扰项）
  _generateOptions(q) {
    const ans = q.answer;
    const candidates = new Set();
    candidates.add(ans);

    // 根据题型注入高频混淆项
    if (q.type === 'add') {
      // 忘记进位：如 38+27=65，错算成 55
      if ((q.num1 % 10) + (q.num2 % 10) >= 10 && ans > 10) {
        candidates.add(ans - 10);
      }
      // 多进位或者计算差错
      candidates.add(ans + 10);
      candidates.add(ans + 1);
      candidates.add(ans - 1);
    } else if (q.type === 'sub') {
      // 忘记退位：如 52-27=25，错算成 35
      if ((q.num1 % 10) < (q.num2 % 10)) {
        candidates.add(ans + 10);
      }
      candidates.add(ans - 10);
      candidates.add(ans + 1);
      candidates.add(ans - 1);
    } else if (q.type === 'mul') {
      // 相邻口诀干扰 (例如 6x7=42，干扰项 48, 36, 35)
      candidates.add((q.num1 + 1) * q.num2);
      candidates.add((q.num1 - 1) * q.num2);
      candidates.add(q.num1 * (q.num2 + 1));
      candidates.add(q.num1 + q.num2); // 偶尔有把乘法看成加法
      candidates.add(ans + 2);
      candidates.add(ans - 2);
    } else if (q.type === 'div') {
      candidates.add(ans + 1);
      candidates.add(ans - 1);
      candidates.add(ans + 2);
      candidates.add(ans - 2);
      candidates.add(q.num2); // 把除数当成商
    }

    // 过滤掉小于等于0或与答案相同的候选
    const validDistractors = Array.from(candidates).filter(n => n > 0 && n !== ans);

    // 随机打乱备选干扰项
    this._shuffle(validDistractors);

    const result = [ans];
    for (const d of validDistractors) {
      if (result.length < 4 && !result.includes(d)) {
        result.push(d);
      }
    }

    // 若依然不够4个选项，按随机偏移补足
    let offset = 1;
    while (result.length < 4) {
      const fallbackPlus = ans + offset;
      const fallbackMinus = ans - offset;
      if (fallbackPlus > 0 && !result.includes(fallbackPlus)) result.push(fallbackPlus);
      if (result.length < 4 && fallbackMinus > 0 && !result.includes(fallbackMinus)) result.push(fallbackMinus);
      offset++;
    }

    // 打乱最终4个选项的位置
    this._shuffle(result);
    return result;
  }

  // 洗牌算法
  _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}

// 导出全局单例
window.mathEngine = new MathGameEngine();
