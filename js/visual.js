/**
 * 乐学萌岛 - 数学启蒙具象化渲染引擎 (Visual Enlightenment Engine)
 * 将加减乘除转化为儿童可见、可感、富有现实意义的生动动画情境
 */

class VisualEnlightenmentEngine {
  constructor(containerId, narrationId) {
    this.container = document.getElementById(containerId);
    this.narration = document.getElementById(narrationId);
    this.currentAnimTimer = null;
  }

  // 清除旧动画和定时器
  clear() {
    if (this.currentAnimTimer) {
      clearTimeout(this.currentAnimTimer);
      this.currentAnimTimer = null;
    }
    if (this.container) this.container.innerHTML = '';
  }

  // 根据题目类型与数据渲染动画舞台
  render(q) {
    this.clear();
    if (!this.container || !this.narration) return;

    // 更新故事叙述
    this.narration.innerHTML = `
      <span class="story-tag">${q.storyTag || '数学启蒙'}</span>
      <span class="story-text">${q.story || ''}</span>
    `;

    // 路由至不同运算的具象化舞台
    switch (q.type) {
      case 'add':
        this._renderAddition(q);
        break;
      case 'sub':
        this._renderSubtraction(q);
        break;
      case 'mul':
        this._renderMultiplication(q);
        break;
      case 'div':
        this._renderDivision(q);
        break;
    }
  }

  // ================= 1. ➕ 加法：果园装箱工场（满十打包） =================
  _renderAddition(q) {
    const tens1 = Math.floor(q.num1 / 10);
    const ones1 = q.num1 % 10;
    const tens2 = Math.floor(q.num2 / 10);
    const ones2 = q.num2 % 10;
    const isCarry = (ones1 + ones2) >= 10;

    const html = `
      <div class="add-stage">
        <!-- 左侧苹果堆 -->
        <div class="pile pile-left">
          <div class="pile-title">树上摘的 (${q.num1}个)</div>
          <div class="item-group">
            <div class="tens-boxes" title="${tens1}个十箱">${this._renderBoxes(tens1)}</div>
            <div class="ones-items" id="add-ones-1">${this._renderItems('🍎', ones1)}</div>
          </div>
        </div>

        <div class="op-symbol-stage">+</div>

        <!-- 右侧苹果堆 -->
        <div class="pile pile-right">
          <div class="pile-title">小鹿运来 (${q.num2}个)</div>
          <div class="item-group">
            <div class="tens-boxes" title="${tens2}个十箱">${this._renderBoxes(tens2)}</div>
            <div class="ones-items" id="add-ones-2">${this._renderItems('🍎', ones2)}</div>
          </div>
        </div>
      </div>
      <div id="add-carry-notice" class="enlighten-bubble ${isCarry ? 'glow' : ''}">
        ${isCarry ? '✨ 哇！散装苹果合起来超过 10 个啦，看小松鼠把它们【满十打包】成整箱！' : '💡 十位箱子加箱子，个位散苹果加散苹果，合起来就是总数！'}
      </div>
    `;

    this.container.innerHTML = html;

    // 进位动画演示：1秒后聚拢并展示“满十打包成新箱”
    if (isCarry) {
      this.currentAnimTimer = setTimeout(() => {
        const notice = document.getElementById('add-carry-notice');
        if (notice) {
          notice.innerHTML = `📦 <strong>满十进一！</strong> 其中 10 个散装苹果自动打包成 1 个新整箱（装有10个），还剩下 ${(ones1 + ones2) - 10} 个散装！`;
          notice.classList.add('pulse');
        }
      }, 1200);
    }
  }

  // ================= 2. ➖ 减法：松鼠储蓄屋（拆箱找零/借十） =================
  _renderSubtraction(q) {
    const tens1 = Math.floor(q.num1 / 10);
    const ones1 = q.num1 % 10;
    const tens2 = Math.floor(q.num2 / 10);
    const ones2 = q.num2 % 10;
    const isBorrow = ones1 < ones2;

    const html = `
      <div class="sub-stage">
        <div class="pile pile-total">
          <div class="pile-title">仓库原有松果 (${q.num1}颗)</div>
          <div class="item-group">
            <div class="tens-boxes" id="sub-boxes">${this._renderBoxes(tens1)}</div>
            <div class="ones-items" id="sub-ones">${this._renderItems('🌰', ones1)}</div>
          </div>
        </div>

        <div class="sub-action-indicator">
          <span>需要拿走 <strong>${q.num2}</strong> 颗（${tens2}箱 + ${ones2}颗散装）</span>
        </div>
      </div>

      <div id="sub-notice" class="enlighten-bubble ${isBorrow ? 'glow' : ''}">
        ${isBorrow ? `🌰 散装只有 ${ones1} 颗，不够拿走 ${ones2} 颗！小松鼠正帮你【拆开 1 个整箱】变 10 颗散装...` : `🌰 散装够拿，十位减十位，个位减个位，非常轻松！`}
      </div>
    `;

    this.container.innerHTML = html;

    // 退位拆箱动画演示
    if (isBorrow) {
      this.currentAnimTimer = setTimeout(() => {
        const notice = document.getElementById('sub-notice');
        const onesBox = document.getElementById('sub-ones');
        const boxes = document.getElementById('sub-boxes');

        if (notice && onesBox && boxes) {
          notice.innerHTML = `💥 <strong>退位借一！</strong> 拆开 1 整箱变成了 10 颗散装，现在散装共有 <strong>${ones1 + 10}</strong> 颗啦！拿走 ${ones2} 颗还剩 <strong>${(ones1 + 10) - ones2}</strong> 颗！`;
          notice.classList.add('pulse');
          // 给被拆开的箱子一个跳动展开标记
          const lastBox = boxes.lastElementChild;
          if (lastBox) {
            lastBox.classList.add('unpacking');
            lastBox.title = '这箱被拆开变成10颗散装啦';
          }
        }
      }, 1200);
    }
  }

  // ================= 3. ✖️ 乘法：曲奇烘焙盘（几排几列方阵） =================
  _renderMultiplication(q) {
    const rows = q.num1;
    const cols = q.num2;

    let gridHtml = '';
    for (let r = 0; r < rows; r++) {
      gridHtml += `<div class="cookie-row" style="animation-delay: ${r * 0.1}s">`;
      gridHtml += `<span class="row-label">第${r + 1}排</span>`;
      for (let c = 0; c < cols; c++) {
        gridHtml += `<span class="cookie-item" title="第${r+1}排第${c+1}块">🍪</span>`;
      }
      gridHtml += `</div>`;
    }

    const html = `
      <div class="mul-stage">
        <div class="baking-tray">
          <div class="tray-header">
            <span class="badge-accent">每排整齐放了 ${cols} 块曲奇</span>
          </div>
          <div class="cookie-grid">
            ${gridHtml}
          </div>
        </div>
      </div>
      <div class="enlighten-bubble glow">
        ⚡ <strong>为什么用乘法？</strong> 如果一块块数要数 ${q.answer} 次；但看成 <strong>${rows} 排，每排 ${cols} 块</strong>，一句口诀秒算出来！
      </div>
    `;

    this.container.innerHTML = html;
  }

  // ================= 4. ➗ 除法：动物森林野餐（公平平均分） =================
  _renderDivision(q) {
    const total = q.num1;      // 被除数 (草莓总数)
    const animalCount = q.num2; // 除数 (小动物个数)
    const animals = ['🐰 小兔', '🐻 小熊', '🦊 小狐', '🐼 熊猫', '🐵 小猴', '🐯 小虎', '🐶 小狗', '🐱 小猫', '🐹 仓鼠'];

    let platesHtml = '';
    for (let i = 0; i < animalCount; i++) {
      platesHtml += `
        <div class="animal-plate-card">
          <div class="animal-avatar">${animals[i % animals.length]}</div>
          <div class="plate-dish" id="plate-${i}">
            <span class="plate-placeholder">🍽️ 等待分草莓</span>
          </div>
        </div>
      `;
    }

    const html = `
      <div class="div-stage">
        <div class="picnic-table">
          <div class="table-title">🍓 野餐桌上一共有 <strong>${total}</strong> 颗草莓</div>
          <div class="strawberry-pool">
            ${this._renderItems('🍓', Math.min(total, 24))}
            ${total > 24 ? `<span style="font-size:0.8rem;color:#888;">...共${total}颗</span>` : ''}
          </div>
        </div>

        <div class="div-action-divider">平均分给 ${animalCount} 位好朋友：</div>

        <div class="animal-plates-row">
          ${platesHtml}
        </div>
      </div>
      <div class="enlighten-bubble glow">
        ⚖️ <strong>除法就是绝对公平：</strong> 把 ${total} 颗草莓平均分给 ${animalCount} 只小动物，每只不多也不少，正好能分几个呢？
      </div>
    `;

    this.container.innerHTML = html;
  }

  // 答对时的庆祝动画反馈
  celebrateCorrect(q) {
    // 根据运算类型让画面元素开心地欢呼/闪烁
    if (q.type === 'mul') {
      const cookies = this.container.querySelectorAll('.cookie-item');
      cookies.forEach((c, idx) => {
        setTimeout(() => c.classList.add('baked'), idx * 25);
      });
    } else if (q.type === 'div') {
      const plates = this.container.querySelectorAll('.plate-dish');
      const share = q.answer;
      plates.forEach(p => {
        p.innerHTML = `<span class="shared-fruits">${'🍓'.repeat(Math.min(share, 9))}</span><span class="count-tag">${share}颗</span>`;
        p.classList.add('happy');
      });
    } else if (q.type === 'add') {
      const boxes = this.container.querySelectorAll('.tens-box');
      boxes.forEach(b => b.classList.add('celebrate'));
    }
  }

  // 工具方法：渲染整箱 (10个/箱)
  _renderBoxes(count) {
    if (count <= 0) return '<span class="empty-hint">0箱</span>';
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `<div class="tens-box" title="整箱(装有10个)">📦<span class="box-label">10</span></div>`;
    }
    return html;
  }

  // 工具方法：渲染零散物品
  _renderItems(emoji, count) {
    if (count <= 0) return '<span class="empty-hint">0个</span>';
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `<span class="unit-item">${emoji}</span>`;
    }
    return html;
  }
}

// 导出全局单例
window.visualEngine = new VisualEnlightenmentEngine('visual-stage', 'story-narration');
