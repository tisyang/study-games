/**
 * 乐学萌岛 - 数学启蒙具象化渲染与动态演算引擎
 * 专为小学二年级小朋友调试的舒适慢节奏演算，让思考与观察更充分
 */

class VisualEnlightenmentEngine {
  constructor(containerId, narrationId) {
    this.container = document.getElementById(containerId);
    this.narration = document.getElementById(narrationId);
    this.activeTimers = [];
    this.currentCallback = null;
  }

  // 清除旧动画和定时器
  clear() {
    this.activeTimers.forEach(t => clearTimeout(t));
    this.activeTimers = [];
    this.currentCallback = null;
    this.exploreData = null;
    if (this.container) this.container.innerHTML = '';
  }

  _registerTimer(fn, delay) {
    const t = setTimeout(fn, delay);
    this.activeTimers.push(t);
    return t;
  }

  // 快捷跳过当前演算
  skipAnimation() {
    if (this.currentCallback) {
      const cb = this.currentCallback;
      this.clear();
      cb();
    }
  }

  // 根据题目类型与数据渲染初始动画舞台
  render(q, options = {}) {
    this.clear();
    if (!this.container || !this.narration) return;

    if (options.isExplore) {
      if (q.type === 'add') {
        this._renderAdditionExplore(q);
        return;
      }
      if (q.type === 'sub') {
        this._renderSubtractionExplore(q);
        return;
      }
      if (q.type === 'mul') {
        this._renderMultiplicationExplore(q);
        return;
      }
      if (q.type === 'div') {
        this._renderDivisionExplore(q);
        return;
      }
    }

    // 更新故事叙述，将所有数字自动包裹醒目大字号鲜艳药丸胶囊
    const formattedStory = (q.story || '').replace(/(\d+)/g, '<span class="hl-num">$1</span>');

    this.narration.innerHTML = `
      <span class="story-tag">${q.storyTag || '数学启蒙'}</span>
      <span class="story-text">${formattedStory}</span>
    `;

    // 路由至不同运算的初始展示
    switch (q.type) {
      case 'add':
        this._renderAdditionInitial(q);
        break;
      case 'sub':
        this._renderSubtractionInitial(q);
        break;
      case 'mul':
        this._renderMultiplicationInitial(q);
        break;
      case 'div':
        this._renderDivisionInitial(q);
        break;
    }
  }

  // ================= 任务02: ➕ 加法果园独立探索样板 =================
  _renderAdditionExplore(q) {
    this.narration.innerHTML = `<span class="story-text">合起来有多少个苹果？</span>`;

    const tens1 = Math.floor(q.num1 / 10);
    const ones1 = q.num1 % 10;
    const tens2 = Math.floor(q.num2 / 10);
    const ones2 = q.num2 % 10;
    const totalTens = tens1 + tens2;
    const totalOnes = ones1 + ones2;
    const isCarry = totalOnes >= 10;
    const packedTens = totalTens + 1;
    const packedOnes = totalOnes - 10;

    this.exploreData = {
      q,
      tens1, ones1,
      tens2, ones2,
      totalTens, totalOnes,
      isCarry,
      packedTens, packedOnes,
      step: 'initial', // 'initial' | 'merged' | 'packed' | 'completed'
      locked: false
    };

    this.container.innerHTML = `
      <div class="explore-orchard-stage">
        <div class="explore-header-row">
          <div class="squirrel-mascot" id="explore-squirrel" aria-label="小松鼠">🐿️</div>
          <div class="explore-bubble" id="explore-bubble" role="status" aria-live="polite">
            <span>帮我收苹果吧！</span>
          </div>
        </div>

        <div class="explore-display-board" id="explore-display-board"></div>

        <div class="explore-tools-bar">
          <button type="button" class="btn-explore-tool" id="btn-tool-merge" aria-label="合在一起">
            🧺 合在一起
          </button>
          <button type="button" class="btn-explore-tool hidden" id="btn-tool-pack" aria-label="装满一箱">
            📦 装满一箱
          </button>
          <button type="button" class="btn-explore-tool btn-tool-help" id="btn-tool-help" aria-label="帮帮我">
            💡 帮帮我
          </button>
        </div>
      </div>
    `;

    const btnMerge = document.getElementById('btn-tool-merge');
    const btnPack = document.getElementById('btn-tool-pack');
    const btnHelp = document.getElementById('btn-tool-help');

    if (btnMerge) {
      btnMerge.addEventListener('click', () => {
        if (!this.exploreData || this.exploreData.locked || this.exploreData.step !== 'initial') return;
        if (window.soundEngine) window.soundEngine.playClick();
        this.exploreData.step = 'merged';
        this._updateExploreDisplay();
      });
    }

    if (btnPack) {
      btnPack.addEventListener('click', () => {
        if (!this.exploreData || this.exploreData.locked || this.exploreData.step !== 'merged' || !this.exploreData.isCarry) return;
        if (window.soundEngine) window.soundEngine.playPackBox();
        this.exploreData.step = 'packed';
        this._updateExploreDisplay();
      });
    }

    if (btnHelp) {
      btnHelp.addEventListener('click', () => {
        if (!this.exploreData || this.exploreData.locked) return;
        if (window.soundEngine) window.soundEngine.playHint();
        this.showExploreHint();
      });
    }

    this._updateExploreDisplay();
  }

  _updateExploreDisplay() {
    if (!this.exploreData) return;
    const board = document.getElementById('explore-display-board');
    const btnMerge = document.getElementById('btn-tool-merge');
    const btnPack = document.getElementById('btn-tool-pack');
    const bubble = document.getElementById('explore-bubble');
    if (!board || !btnMerge || !btnPack) return;

    const { q, tens1, ones1, tens2, ones2, totalTens, totalOnes, isCarry, packedTens, packedOnes, step } = this.exploreData;

    if (step === 'initial') {
      board.innerHTML = `
        <div class="explore-piles-wrap">
          <div class="explore-pile pile-left">
            <div class="pile-title"><span class="pile-num">${q.num1}</span></div>
            <div class="item-group">
              <div class="tens-boxes">${this._renderBoxes(tens1)}</div>
              <div class="ones-items">${this._renderItems('🍎', ones1)}</div>
            </div>
          </div>
          <div class="explore-plus-sign">+</div>
          <div class="explore-pile pile-right">
            <div class="pile-title"><span class="pile-num">${q.num2}</span></div>
            <div class="item-group">
              <div class="tens-boxes">${this._renderBoxes(tens2)}</div>
              <div class="ones-items">${this._renderItems('🍎', ones2)}</div>
            </div>
          </div>
        </div>
      `;
      btnMerge.classList.remove('done', 'hidden');
      btnMerge.disabled = false;
      btnMerge.innerHTML = '🧺 合在一起';
      btnPack.classList.add('hidden');
      if (bubble) bubble.innerHTML = `<span>帮我收苹果吧！</span>`;
    } else if (step === 'merged') {
      let onesHtml = '';
      if (isCarry) {
        onesHtml = `
          <div class="ten-pack-zone">
            <span class="pack-zone-tip">10 个 → 1 箱</span>
            <div class="ten-pack-frame">
              ${Array(10).fill('<div class="grid-slot"><span class="unit-item">🍎</span></div>').join('')}
            </div>
            <div class="ones-items frame-remain">
              ${this._renderItems('🍎', totalOnes - 10)}
            </div>
          </div>
        `;
      } else {
        onesHtml = `
          <div class="ones-items">${this._renderItems('🍎', totalOnes)}</div>
        `;
      }

      board.innerHTML = `
        <div class="explore-merged-wrap">
          <div class="merged-content">
            <div class="item-group">
              <div class="tens-boxes">${this._renderBoxes(totalTens)}</div>
              ${onesHtml}
            </div>
          </div>
        </div>
      `;
      btnMerge.classList.add('done', 'hidden');
      btnMerge.disabled = true;
      btnMerge.innerHTML = '🧺 已合在一起';
      if (isCarry) {
        btnPack.classList.remove('hidden', 'done');
        btnPack.disabled = false;
        btnPack.innerHTML = '📦 装满一箱';
        if (bubble) bubble.innerHTML = `<span>十个装一箱</span>`;
      } else {
        btnPack.classList.add('hidden');
        if (bubble) bubble.innerHTML = `<span>数一数苹果吧</span>`;
      }
    } else if (step === 'packed') {
      board.innerHTML = `
        <div class="explore-merged-wrap">
          <div class="merged-content">
            <div class="item-group">
              <div class="tens-boxes">
                ${this._renderBoxes(totalTens)}
                <div class="tens-box new-packed" title="新装满的整箱">📦<span class="box-label">10</span></div>
              </div>
              <div class="ones-items">${this._renderItems('🍎', packedOnes)}</div>
            </div>
          </div>
        </div>
      `;
      btnMerge.classList.add('hidden');
      btnPack.classList.add('done', 'hidden');
      btnPack.disabled = true;
      btnPack.innerHTML = '✅ 已装满一箱';
      if (bubble) bubble.innerHTML = `<span>选个答案吧</span>`;
    } else if (step === 'completed') {
      const finalTens = isCarry ? packedTens : totalTens;
      const finalOnes = isCarry ? packedOnes : totalOnes;
      board.innerHTML = `
        <div class="explore-merged-wrap">
          <div class="merged-content">
            <div class="item-group">
              <div class="tens-boxes">${this._renderBoxes(finalTens)}</div>
              <div class="ones-items">${this._renderItems('🍎', finalOnes)}</div>
            </div>
          </div>
        </div>
      `;
      btnMerge.classList.add('hidden');
      btnMerge.disabled = true;
      btnPack.classList.add('hidden');
      btnPack.disabled = true;
      const toolsBar = document.querySelector('.explore-tools-bar');
      if (toolsBar) toolsBar.classList.add('hidden');
      const btnHelp = document.getElementById('btn-tool-help');
      if (btnHelp) btnHelp.disabled = true;
      const squirrel = document.getElementById('explore-squirrel');
      if (squirrel) {
        squirrel.innerHTML = '🐿️🎉';
        squirrel.classList.add('celebrating');
      }
      if (bubble) bubble.innerHTML = `<span>装好啦！</span>`;
    }
  }

  setExploreHint(text, highlightSelector) {
    const bubble = document.getElementById('explore-bubble');
    if (bubble) {
      bubble.innerHTML = `<span>${text}</span>`;
      bubble.classList.remove('pulse-attention');
      void bubble.offsetWidth;
      bubble.classList.add('pulse-attention');
    }
    if (highlightSelector) {
      const target = document.querySelector(highlightSelector);
      if (target) {
        target.classList.remove('pulse-attention');
        void target.offsetWidth;
        target.classList.add('pulse-attention');
        this._registerTimer(() => target.classList.remove('pulse-attention'), 1500);
      }
    }
  }

  showExploreHint() {
    if (!this.exploreData) return;
    const type = this.exploreData.q ? this.exploreData.q.type : 'add';

    if (type === 'add') {
      const { step, isCarry } = this.exploreData;
      if (step === 'initial') {
        this.setExploreHint('合在一起看看 🧺', '#btn-tool-merge');
      } else if (step === 'merged' && isCarry) {
        this.setExploreHint('十个装一箱 📦', '#btn-tool-pack');
      } else {
        this.setExploreHint('数一数苹果吧');
      }
    } else if (type === 'sub') {
      const { step, isBorrow } = this.exploreData;
      if (step === 'initial' && isBorrow) {
        this.setExploreHint('散装不够，先拆一箱 📦', '#btn-tool-sub-unpack');
      } else if (step === 'initial' || step === 'unpacked') {
        this.setExploreHint('把苹果取走看看 🐿️', '#btn-tool-sub-take');
      } else {
        this.setExploreHint('看一看还剩多少苹果吧！');
      }
    } else if (type === 'mul') {
      const { filledRows, rows } = this.exploreData;
      if (filledRows < rows) {
        this.setExploreHint('摆一排饼干看看 🍪', '#btn-tool-mul-addrow');
      } else {
        this.setExploreHint('数一数烤盘上一共有几块饼干！');
      }
    } else if (type === 'div') {
      const { sharedCount, quotient } = this.exploreData;
      if (sharedCount < quotient) {
        this.setExploreHint('每人分一个水果 🍎', '#btn-tool-div-deal');
      } else {
        this.setExploreHint('数一数每位朋友盘子里有几个水果！');
      }
    }
  }

  completeExploreQuestion() {
    if (!this.exploreData) return;
    const type = this.exploreData.q ? this.exploreData.q.type : 'add';
    if (type === 'add') {
      this.completeExploreAddition();
    } else if (type === 'sub') {
      this.completeExploreSubtraction();
    } else if (type === 'mul') {
      this.completeExploreMultiplication();
    } else if (type === 'div') {
      this.completeExploreDivision();
    }
  }

  completeExploreAddition() {
    if (!this.exploreData) return;
    this.exploreData.locked = true;
    this.exploreData.step = 'completed';
    this._updateExploreDisplay();
  }

  // ================= 减法：松鼠取苹果 独立探索 =================
  _renderSubtractionExplore(q) {
    this.narration.innerHTML = `<span class="story-text">拿走 <span class="hl-num">${q.num2}</span> 个，还剩多少？</span>`;

    const aTens = Math.floor(q.num1 / 10);
    const aOnes = q.num1 % 10;
    const bTens = Math.floor(q.num2 / 10);
    const bOnes = q.num2 % 10;
    const isBorrow = aOnes < bOnes;

    // aOnes + 10 当拆箱后，然后再减去 bOnes
    const remainTens = Math.floor(q.answer / 10);
    const remainOnes = q.answer % 10;

    this.exploreData = {
      q,
      aTens, aOnes,
      bTens, bOnes,
      isBorrow,
      remainTens, remainOnes,
      step: 'initial', // 'initial' | 'unpacked' | 'taken' | 'completed'
      locked: false
    };

    this.container.innerHTML = `
      <div class="explore-sub-stage math-explore-stage">
        <div class="explore-header-row">
          <div class="squirrel-mascot" id="explore-sub-squirrel" aria-label="小松鼠">🐿️</div>
          <div class="explore-bubble" id="explore-bubble" role="status" aria-live="polite">
            <span>帮我取苹果吧！</span>
          </div>
        </div>

        <div class="explore-display-board" id="explore-sub-board"></div>

        <div class="explore-tools-bar">
          ${isBorrow ? `
            <button type="button" class="btn-explore-tool" id="btn-tool-sub-unpack" aria-label="拆一箱">
              📦 拆一箱
            </button>
          ` : ''}
          <button type="button" class="btn-explore-tool" id="btn-tool-sub-take" aria-label="取走">
            🐿️ 取走 ${q.num2} 个
          </button>
          <button type="button" class="btn-explore-tool btn-tool-help" id="btn-tool-help" aria-label="帮帮我">
            💡 帮帮我
          </button>
        </div>
      </div>
    `;

    const btnUnpack = document.getElementById('btn-tool-sub-unpack');
    const btnTake = document.getElementById('btn-tool-sub-take');
    const btnHelp = document.getElementById('btn-tool-help');

    if (btnUnpack) {
      btnUnpack.addEventListener('click', () => {
        if (!this.exploreData || this.exploreData.locked || this.exploreData.step !== 'initial') return;
        if (window.soundEngine) window.soundEngine.playUnpackBox();
        this.exploreData.step = 'unpacked';
        this._updateExploreSubDisplay();
      });
    }

    if (btnTake) {
      btnTake.addEventListener('click', () => {
        if (!this.exploreData || this.exploreData.locked) return;
        if (this.exploreData.step === 'taken' || this.exploreData.step === 'completed') return;

        if (this.exploreData.isBorrow && this.exploreData.step === 'initial') {
          // 需要拆箱但尚未拆
          if (window.soundEngine) window.soundEngine.playWrong();
          this.setExploreHint('散装不够，先拆一箱 📦', '#btn-tool-sub-unpack');
          return;
        }

        if (window.soundEngine) window.soundEngine.playDealFruit();
        this.exploreData.step = 'taken';
        this._updateExploreSubDisplay();
      });
    }

    if (btnHelp) {
      btnHelp.addEventListener('click', () => {
        if (!this.exploreData || this.exploreData.locked) return;
        if (window.soundEngine) window.soundEngine.playHint();
        this.showExploreHint();
      });
    }

    this._updateExploreSubDisplay();
  }

  _updateExploreSubDisplay() {
    if (!this.exploreData) return;
    const board = document.getElementById('explore-sub-board');
    const btnUnpack = document.getElementById('btn-tool-sub-unpack');
    const btnTake = document.getElementById('btn-tool-sub-take');
    const bubble = document.getElementById('explore-bubble');
    if (!board) return;

    const { q, aTens, aOnes, isBorrow, remainTens, remainOnes, step } = this.exploreData;

    if (step === 'initial') {
      board.innerHTML = `
        <div class="explore-pile pile-center">
          <div class="pile-title">仓库里原有 <span class="pile-num">${q.num1}</span> 个苹果</div>
          <div class="item-group">
            <div class="tens-boxes">${this._renderBoxes(aTens)}</div>
            <div class="ones-items">${this._renderItems('🍎', aOnes)}</div>
          </div>
        </div>
      `;
      if (btnUnpack) {
        btnUnpack.classList.remove('hidden', 'done');
        btnUnpack.disabled = false;
        btnUnpack.innerHTML = '📦 拆一箱';
      }
      if (btnTake) {
        btnTake.classList.remove('hidden', 'done');
        btnTake.disabled = false;
        btnTake.innerHTML = `🐿️ 取走 ${q.num2} 个`;
      }
      if (bubble) bubble.innerHTML = `<span>帮我取苹果吧！</span>`;
    } else if (step === 'unpacked') {
      board.innerHTML = `
        <div class="explore-pile pile-center">
          <div class="pile-title">拆开 1 箱后：<span class="pile-num">${aTens - 1}</span> 箱 + <span class="pile-num">${aOnes + 10}</span> 个散装</div>
          <div class="item-group">
            <div class="tens-boxes">${this._renderBoxes(aTens - 1)}</div>
            <div class="ones-items bounce-items">${this._renderItems('🍎', aOnes + 10)}</div>
          </div>
        </div>
      `;
      if (btnUnpack) {
        btnUnpack.classList.add('done', 'hidden');
        btnUnpack.disabled = true;
        btnUnpack.innerHTML = '✅ 已拆一箱';
      }
      if (btnTake) {
        btnTake.classList.remove('hidden', 'done');
        btnTake.disabled = false;
      }
      if (bubble) bubble.innerHTML = `<span>散装够啦，快取走 ${q.num2} 个吧！</span>`;
    } else if (step === 'taken') {
      board.innerHTML = `
        <div class="explore-pile pile-center">
          <div class="pile-title">取走 <span class="hl-num">${q.num2}</span> 个后还剩下：</div>
          <div class="item-group">
            <div class="tens-boxes">${this._renderBoxes(remainTens)}</div>
            <div class="ones-items">${this._renderItems('🍎', remainOnes)}</div>
          </div>
        </div>
      `;
      if (btnUnpack) btnUnpack.classList.add('hidden');
      if (btnTake) {
        btnTake.classList.add('done', 'hidden');
        btnTake.disabled = true;
        btnTake.innerHTML = `✅ 已取走 ${q.num2} 个`;
      }
      if (bubble) bubble.innerHTML = `<span>数一数剩下的苹果，选个答案吧！</span>`;
    } else if (step === 'completed') {
      board.innerHTML = `
        <div class="explore-pile pile-center">
          <div class="pile-title" style="color:#16a34a; font-weight:800;">🎉 算对啦！还剩下：</div>
          <div class="item-group">
            <div class="tens-boxes">${this._renderBoxes(remainTens)}</div>
            <div class="ones-items">${this._renderItems('🍎', remainOnes)}</div>
          </div>
        </div>
      `;
      if (btnUnpack) btnUnpack.classList.add('hidden');
      if (btnTake) btnTake.classList.add('hidden');
      const toolsBar = document.querySelector('.explore-tools-bar');
      if (toolsBar) toolsBar.classList.add('hidden');
      const btnHelp = document.getElementById('btn-tool-help');
      if (btnHelp) btnHelp.disabled = true;
      const squirrel = document.getElementById('explore-sub-squirrel');
      if (squirrel) {
        squirrel.innerHTML = '🐿️🎉';
        squirrel.classList.add('celebrating');
      }
      if (bubble) bubble.innerHTML = `<span>太棒啦！</span>`;
    }
  }

  completeExploreSubtraction() {
    if (!this.exploreData) return;
    this.exploreData.locked = true;
    this.exploreData.step = 'completed';
    this._updateExploreSubDisplay();
  }

  // ================= 乘法：烤饼干 独立探索 =================
  _renderMultiplicationExplore(q) {
    const rows = q.num1;
    const cols = q.num2;

    this.narration.innerHTML = `<span class="story-text">每排 <span class="hl-num">${cols}</span> 块，摆 <span class="hl-num">${rows}</span> 排。一共几块？</span>`;

    this.exploreData = {
      q,
      rows,
      cols,
      filledRows: 0,
      step: 'initial', // 'initial' | 'progress' | 'completed'
      locked: false
    };

    this.container.innerHTML = `
      <div class="explore-mul-stage math-explore-stage">
        <div class="explore-header-row">
          <div class="squirrel-mascot" id="explore-mul-mascot" aria-label="小熊大厨">🐻</div>
          <div class="explore-bubble" id="explore-bubble" role="status" aria-live="polite">
            <span>一起来摆饼干吧！</span>
          </div>
        </div>

        <div class="explore-display-board" id="explore-mul-board"></div>

        <div class="explore-tools-bar">
          <button type="button" class="btn-explore-tool" id="btn-tool-mul-addrow" aria-label="摆一排">
            🍪 摆一排 (第 1 排)
          </button>
          <button type="button" class="btn-explore-tool btn-tool-help" id="btn-tool-help" aria-label="帮帮我">
            💡 帮帮我
          </button>
        </div>
      </div>
    `;

    const btnAddRow = document.getElementById('btn-tool-mul-addrow');
    const btnHelp = document.getElementById('btn-tool-help');

    if (btnAddRow) {
      btnAddRow.addEventListener('click', () => {
        if (!this.exploreData || this.exploreData.locked) return;
        if (this.exploreData.filledRows >= this.exploreData.rows) return;

        this.exploreData.filledRows++;
        if (window.soundEngine) window.soundEngine.playRowScan(this.exploreData.filledRows - 1);
        this._updateExploreMulDisplay();
      });
    }

    if (btnHelp) {
      btnHelp.addEventListener('click', () => {
        if (!this.exploreData || this.exploreData.locked) return;
        if (window.soundEngine) window.soundEngine.playHint();
        this.showExploreHint();
      });
    }

    this._updateExploreMulDisplay();
  }

  _updateExploreMulDisplay() {
    if (!this.exploreData) return;
    const board = document.getElementById('explore-mul-board');
    const btnAddRow = document.getElementById('btn-tool-mul-addrow');
    const bubble = document.getElementById('explore-bubble');
    if (!board) return;

    const { rows, cols, filledRows, step } = this.exploreData;

    let gridHtml = '';
    for (let r = 0; r < rows; r++) {
      const isFilled = r < filledRows || step === 'completed';
      gridHtml += `<div class="cookie-tray-row ${isFilled ? 'scanned-active' : 'unfilled-row'}" id="mul-explore-row-${r}">`;
      gridHtml += `<span class="row-label">第${r + 1}排</span>`;
      gridHtml += `<div class="cookie-slots-group">`;
      for (let c = 0; c < cols; c++) {
        if (isFilled) {
          gridHtml += `<span class="cookie-item ${step === 'completed' ? 'baked' : ''}">🍪</span>`;
        } else {
          gridHtml += `<span class="cookie-slot-empty">⚪</span>`;
        }
      }
      gridHtml += `</div></div>`;
    }

    board.innerHTML = `
      <div class="mul-explore-tray">
        <div class="tray-header">
          <span class="badge-accent">${rows} 排 × 每排 ${cols} 块 (已摆 ${filledRows}/${rows} 排)</span>
        </div>
        <div class="cookie-grid">${gridHtml}</div>
      </div>
    `;

    if (step === 'completed') {
      if (btnAddRow) btnAddRow.classList.add('hidden');
      const toolsBar = document.querySelector('.explore-tools-bar');
      if (toolsBar) toolsBar.classList.add('hidden');
      const btnHelp = document.getElementById('btn-tool-help');
      if (btnHelp) btnHelp.disabled = true;
      const mascot = document.getElementById('explore-mul-mascot');
      if (mascot) {
        mascot.innerHTML = '🐻🎉';
        mascot.classList.add('celebrating');
      }
      if (bubble) bubble.innerHTML = `<span>全烤好啦！真香！</span>`;
    } else if (filledRows >= rows) {
      if (btnAddRow) {
        btnAddRow.classList.add('done', 'hidden');
        btnAddRow.disabled = true;
      }
      if (bubble) bubble.innerHTML = `<span>${rows}排全部摆好啦！选个答案吧！</span>`;
    } else {
      if (btnAddRow) {
        btnAddRow.classList.remove('hidden', 'done');
        btnAddRow.disabled = false;
        btnAddRow.innerHTML = `🍪 摆一排 (第 ${filledRows + 1} 排)`;
      }
      if (bubble) {
        if (filledRows === 0) {
          bubble.innerHTML = `<span>点击“摆一排”，摆出第 1 排饼干吧！</span>`;
        } else {
          bubble.innerHTML = `<span>已摆 ${filledRows} 排，继续摆下一排吧！</span>`;
        }
      }
    }
  }

  completeExploreMultiplication() {
    if (!this.exploreData) return;
    this.exploreData.locked = true;
    this.exploreData.step = 'completed';
    this.exploreData.filledRows = this.exploreData.rows;
    this._updateExploreMulDisplay();
  }

  // ================= 除法：动物野餐 独立探索 =================
  _renderDivisionExplore(q) {
    const total = q.num1;
    const animalCount = q.num2;
    const quotient = q.answer;

    this.narration.innerHTML = `<span class="story-text"><span class="hl-num">${total}</span> 个水果，分给 <span class="hl-num">${animalCount}</span> 位朋友。</span>`;

    this.exploreData = {
      q,
      total,
      animalCount,
      quotient,
      sharedCount: 0, // 每人分得个数
      step: 'initial', // 'initial' | 'progress' | 'completed'
      locked: false
    };

    this.container.innerHTML = `
      <div class="explore-div-stage math-explore-stage">
        <div class="explore-header-row">
          <div class="squirrel-mascot" id="explore-div-mascot" aria-label="野餐大厨">🧺</div>
          <div class="explore-bubble" id="explore-bubble" role="status" aria-live="polite">
            <span>一起来分水果吧！</span>
          </div>
        </div>

        <div class="explore-display-board" id="explore-div-board"></div>

        <div class="explore-tools-bar">
          <button type="button" class="btn-explore-tool" id="btn-tool-div-deal" aria-label="每人分一个">
            🍎 每人分一个
          </button>
          <button type="button" class="btn-explore-tool btn-tool-help" id="btn-tool-help" aria-label="帮帮我">
            💡 帮帮我
          </button>
        </div>
      </div>
    `;

    const btnDeal = document.getElementById('btn-tool-div-deal');
    const btnHelp = document.getElementById('btn-tool-help');

    if (btnDeal) {
      btnDeal.addEventListener('click', () => {
        if (!this.exploreData || this.exploreData.locked) return;
        if (this.exploreData.sharedCount >= this.exploreData.quotient) return;

        this.exploreData.sharedCount++;
        if (window.soundEngine) window.soundEngine.playDealFruit();
        this._updateExploreDivDisplay();
      });
    }

    if (btnHelp) {
      btnHelp.addEventListener('click', () => {
        if (!this.exploreData || this.exploreData.locked) return;
        if (window.soundEngine) window.soundEngine.playHint();
        this.showExploreHint();
      });
    }

    this._updateExploreDivDisplay();
  }

  _updateExploreDivDisplay() {
    if (!this.exploreData) return;
    const board = document.getElementById('explore-div-board');
    const btnDeal = document.getElementById('btn-tool-div-deal');
    const bubble = document.getElementById('explore-bubble');
    if (!board) return;

    const { total, animalCount, quotient, sharedCount, step } = this.exploreData;
    const currentShared = (step === 'completed') ? quotient : sharedCount;
    const poolRemaining = Math.max(0, total - currentShared * animalCount);

    const animals = ['🐰 小兔', '🐻 小熊', '🦊 小狐', '🐼 熊猫', '🐵 小猴', '🐯 小虎', '🐶 小狗', '🐱 小猫', '🐨 考拉'];

    let platesHtml = '';
    for (let i = 0; i < animalCount; i++) {
      let fruitsHtml = '';
      if (currentShared === 0) {
        fruitsHtml = '<span class="plate-empty-dish">🍽️ 空盘</span>';
      } else {
        fruitsHtml = `<span class="plate-fruits">${'🍎'.repeat(currentShared)}</span><span class="plate-badge">${currentShared}个</span>`;
      }

      platesHtml += `
        <div class="div-explore-card ${currentShared > 0 ? 'card-has-fruits' : ''}">
          <div class="animal-avatar">${animals[i % animals.length]}</div>
          <div class="div-plate-dish">${fruitsHtml}</div>
        </div>
      `;
    }

    board.innerHTML = `
      <div class="div-explore-wrap">
        <div class="picnic-basket-pool">
          <span class="basket-title">🧺 水果篮还剩：<strong class="hl-num">${poolRemaining}</strong> 个</span>
          <div class="basket-fruits-sample">
            ${'🍎'.repeat(Math.min(poolRemaining, 8))}
            ${poolRemaining > 8 ? '<span class="pool-more">...</span>' : ''}
          </div>
        </div>

        <div class="div-friends-grid">
          ${platesHtml}
        </div>
      </div>
    `;

    if (step === 'completed') {
      if (btnDeal) btnDeal.classList.add('hidden');
      const toolsBar = document.querySelector('.explore-tools-bar');
      if (toolsBar) toolsBar.classList.add('hidden');
      const btnHelp = document.getElementById('btn-tool-help');
      if (btnHelp) btnHelp.disabled = true;
      const mascot = document.getElementById('explore-div-mascot');
      if (mascot) {
        mascot.innerHTML = '🧺🎉';
        mascot.classList.add('celebrating');
      }
      if (bubble) bubble.innerHTML = `<span>分得公平又开心！</span>`;
    } else if (sharedCount >= quotient) {
      if (btnDeal) {
        btnDeal.classList.add('done', 'hidden');
        btnDeal.disabled = true;
      }
      if (bubble) bubble.innerHTML = `<span>水果刚好分完！每人有几个？选个答案吧！</span>`;
    } else {
      if (btnDeal) {
        btnDeal.classList.remove('hidden', 'done');
        btnDeal.disabled = false;
        btnDeal.innerHTML = `🍎 每人分一个 (各得 ${sharedCount + 1} 个)`;
      }
      if (bubble) {
        if (sharedCount === 0) {
          bubble.innerHTML = `<span>点击“每人分一个”，开始平均分发水果吧！</span>`;
        } else {
          bubble.innerHTML = `<span>盘子里各有 ${sharedCount} 个，继续分一个吧！</span>`;
        }
      }
    }
  }

  completeExploreDivision() {
    if (!this.exploreData) return;
    this.exploreData.locked = true;
    this.exploreData.step = 'completed';
    this.exploreData.sharedCount = this.exploreData.quotient;
    this._updateExploreDivDisplay();
  }

  // ================= 答对后触发慢速全流程动态演算 =================
  playProcessAnimation(q, callback) {
    this.currentCallback = callback;

    // 在舞台角隅增加贴心的“下一题 ⏩”微按钮，防止已经完全看懂的小朋友觉得等待时间长
    this._attachSkipButton();

    switch (q.type) {
      case 'add':
        this._animateAdditionProcess(q, callback);
        break;
      case 'sub':
        this._animateSubtractionProcess(q, callback);
        break;
      case 'mul':
        this._animateMultiplicationProcess(q, callback);
        break;
      case 'div':
        this._animateDivisionProcess(q, callback);
        break;
      default:
        if (callback) callback();
    }
  }

  _attachSkipButton() {
    const notice = document.getElementById('enlighten-notice');
    if (!notice) return;
    const skipBtn = document.createElement('button');
    skipBtn.className = 'btn-skip-anim';
    skipBtn.innerHTML = '下一题 ⏩';
    skipBtn.title = '我已经看懂啦，直接进入下一题';
    skipBtn.onclick = (e) => {
      e.stopPropagation();
      this.skipAnimation();
    };
    notice.appendChild(skipBtn);
  }

  // ================= 1. ➕ 加法舞台与慢速演算 =================
  _renderAdditionInitial(q) {
    const tens1 = Math.floor(q.num1 / 10);
    const ones1 = q.num1 % 10;
    const tens2 = Math.floor(q.num2 / 10);
    const ones2 = q.num2 % 10;
    const isCarry = (ones1 + ones2) >= 10;

    this.container.innerHTML = `
      <div class="add-stage" id="add-stage-box">
        <div class="pile pile-left" id="add-pile-1">
          <div class="pile-title">树上摘的 (<span class="hl-num">${q.num1}</span>个)</div>
          <div class="item-group">
            <div class="tens-boxes" id="add-boxes-1">${this._renderBoxes(tens1)}</div>
            <div class="ones-items" id="add-ones-1">${this._renderItems('🍎', ones1)}</div>
          </div>
        </div>

        <div class="op-symbol-stage" id="add-op-sym">+</div>

        <div class="pile pile-right" id="add-pile-2">
          <div class="pile-title">小鹿运来 (<span class="hl-num">${q.num2}</span>个)</div>
          <div class="item-group">
            <div class="tens-boxes" id="add-boxes-2">${this._renderBoxes(tens2)}</div>
            <div class="ones-items" id="add-ones-2">${this._renderItems('🍎', ones2)}</div>
          </div>
        </div>
      </div>

      <div id="enlighten-notice" class="enlighten-bubble ${isCarry ? 'glow' : ''}">
        ${isCarry ? '✨ 仔细观察：散装苹果加起来超过 10 个啦！答对后看小松鼠怎么【慢速满十打包】！' : '💡 十位加十位，个位加个位，合并在一起！'}
      </div>
    `;
  }

  _animateAdditionProcess(q, callback) {
    const notice = document.getElementById('enlighten-notice');
    const stage = document.getElementById('add-stage-box');
    const ones1 = q.num1 % 10;
    const ones2 = q.num2 % 10;
    const totalOnes = ones1 + ones2;
    const isCarry = totalOnes >= 10;
    const finalTens = Math.floor(q.answer / 10);
    const finalOnes = q.answer % 10;

    // 步骤 1 (0ms): 两堆苹果温和向中间靠拢汇聚
    if (stage) stage.classList.add('merging');
    if (notice) notice.innerHTML = `✨ <strong>两堆汇聚！</strong> 苹果慢慢滚到了一起...`;

    // 步骤 2 (1100ms): 聚拢散装苹果
    this._registerTimer(() => {
      if (isCarry) {
        if (notice) {
          notice.innerHTML = `📦 <strong>散装满十！</strong> 散装苹果一共有 ${totalOnes} 个，数出 10 个准备封箱...`;
          notice.classList.add('pulse');
        }
      }
    }, 1100);

    // 步骤 3 (2200ms): 正式打包封箱并出箱
    this._registerTimer(() => {
      if (isCarry) {
        if (notice) {
          notice.innerHTML = `✨ <strong>满十进一打包成功！</strong> 10个散装封成 1 个新整箱，多出 ${finalOnes} 个散装！`;
          notice.classList.add('pulse');
        }
        if (window.soundEngine) window.soundEngine.playPackBox();

        stage.innerHTML = `
          <div class="merged-pile">
            <div class="pile-title" style="color:#16a34a; font-weight:800;">🎉 仓库装箱大合并 (${q.answer}个)</div>
            <div class="item-group">
              <div class="tens-boxes">
                ${this._renderBoxes(finalTens - 1)}
                <div class="tens-box new-packed" title="新打包的整箱">📦<span class="box-label">新10</span></div>
              </div>
              <div class="ones-items" style="margin-top:10px;">
                ${this._renderItems('🍎', finalOnes)}
              </div>
            </div>
          </div>
        `;
      } else {
        stage.innerHTML = `
          <div class="merged-pile">
            <div class="pile-title" style="color:#16a34a; font-weight:800;">🎉 苹果合聚在一起 (${q.answer}个)</div>
            <div class="item-group">
              <div class="tens-boxes">${this._renderBoxes(finalTens)}</div>
              <div class="ones-items" style="margin-top:10px;">${this._renderItems('🍎', finalOnes)}</div>
            </div>
          </div>
        `;
      }
      this._attachSkipButton();
    }, 2200);

    // 步骤 4 (3500ms): 总结清晰呈现
    this._registerTimer(() => {
      if (notice) {
        notice.innerHTML = `🌟 <strong>打包完毕！</strong> 共有 <strong>${finalTens}</strong> 个整箱 + <strong>${finalOnes}</strong> 个散装 = <strong>${q.answer}</strong> 个苹果！`;
        notice.classList.add('glow');
        this._attachSkipButton();
      }
    }, 3500);

    // 步骤 5 (4800ms): 留出充裕时间让孩子消化理解，然后进入下一题
    this._registerTimer(() => {
      if (callback) callback();
    }, 4800);
  }

  // ================= 2. ➖ 减法舞台与慢速演算 =================
  _renderSubtractionInitial(q) {
    const tens1 = Math.floor(q.num1 / 10);
    const ones1 = q.num1 % 10;
    const tens2 = Math.floor(q.num2 / 10);
    const ones2 = q.num2 % 10;
    const isBorrow = ones1 < ones2;

    this.container.innerHTML = `
      <div class="sub-stage" id="sub-stage-box">
        <div class="pile pile-total" id="sub-pile-total">
          <div class="pile-title">仓库原有松果 (<span class="hl-num">${q.num1}</span>颗)</div>
          <div class="item-group">
            <div class="tens-boxes" id="sub-boxes">${this._renderBoxes(tens1)}</div>
            <div class="ones-items" id="sub-ones">${this._renderItems('🌰', ones1)}</div>
          </div>
        </div>

        <div class="sub-action-indicator" id="sub-indicator">
          <span>松鼠宝宝要拿走 <span class="hl-num">${q.num2}</span> 颗（${tens2}箱 + ${ones2}颗散装）</span>
        </div>
      </div>

      <div id="enlighten-notice" class="enlighten-bubble ${isBorrow ? 'glow' : ''}">
        ${isBorrow ? `🌰 散装只有 ${ones1} 颗不够拿！看小松鼠怎么【慢速撬开整箱借一当十】！` : `🌰 散装够拿，轻松减掉！`}
      </div>
    `;
  }

  _animateSubtractionProcess(q, callback) {
    const notice = document.getElementById('enlighten-notice');
    const ones1 = q.num1 % 10;
    const ones2 = q.num2 % 10;
    const tens1 = Math.floor(q.num1 / 10);
    const isBorrow = ones1 < ones2;
    const finalTens = Math.floor(q.answer / 10);
    const finalOnes = q.answer % 10;
    const subBoxes = document.getElementById('sub-boxes');
    const subOnes = document.getElementById('sub-ones');

    // 步骤 1 (0ms): 撬开整箱前摇晃预备
    if (isBorrow) {
      if (notice) {
        notice.innerHTML = `💥 <strong>准备拆箱！</strong> 撬棍就位，准备把 1 个整箱拆开...`;
        notice.classList.add('pulse');
      }
      if (subBoxes && subBoxes.lastElementChild) {
        subBoxes.lastElementChild.classList.add('unpacking');
      }

      // 步骤 2 (1100ms): 箱子爆开，10颗散装缓缓滚出
      this._registerTimer(() => {
        if (window.soundEngine) window.soundEngine.playUnpackBox();
        if (subBoxes) subBoxes.innerHTML = this._renderBoxes(tens1 - 1);
        if (subOnes) {
          subOnes.innerHTML = this._renderItems('🌰', ones1 + 10);
          subOnes.classList.add('bounce-items');
        }
        if (notice) {
          notice.innerHTML = `🌰 <strong>借一当十成功！</strong> 散装变成了 <strong>${ones1 + 10}</strong> 颗！现在足够拿走 ${ones2} 颗啦！`;
        }
      }, 1100);
    }

    // 步骤 3 (2300ms): 移走拿掉的松果与箱子
    this._registerTimer(() => {
      if (notice) {
        notice.innerHTML = `💨 <strong>正在移走：</strong> 成功搬走 ${q.num2} 颗松果！`;
      }
      if (window.soundEngine) window.soundEngine.playDealFruit();

      const stage = document.getElementById('sub-stage-box');
      if (stage) {
        stage.innerHTML = `
          <div class="pile pile-total" style="border-color:#22c55e;">
            <div class="pile-title" style="color:#15803d; font-weight:800;">🎉 仓库还剩下 (${q.answer}颗)</div>
            <div class="item-group">
              <div class="tens-boxes">${this._renderBoxes(finalTens)}</div>
              <div class="ones-items" style="margin-top:10px;">${this._renderItems('🌰', finalOnes)}</div>
            </div>
          </div>
        `;
      }
      this._attachSkipButton();
    }, isBorrow ? 2300 : 1100);

    // 步骤 4 (3600ms): 结果总结揭晓
    this._registerTimer(() => {
      if (notice) {
        notice.innerHTML = `🌟 <strong>计算完成：</strong> 仓库还剩下 <strong>${finalTens}</strong> 箱 + <strong>${finalOnes}</strong> 颗 = <strong>${q.answer}</strong> 颗！`;
        notice.classList.add('glow');
        this._attachSkipButton();
      }
    }, isBorrow ? 3600 : 2300);

    // 步骤 5 (4900ms): 结束转场
    this._registerTimer(() => {
      if (callback) callback();
    }, isBorrow ? 4900 : 3600);
  }

  // ================= 3. ✖️ 乘法舞台与慢速演算 =================
  _renderMultiplicationInitial(q) {
    const rows = q.num1;
    const cols = q.num2;

    let gridHtml = '';
    for (let r = 0; r < rows; r++) {
      gridHtml += `<div class="cookie-row" id="mul-row-${r}">`;
      gridHtml += `<span class="row-label">第${r + 1}排</span>`;
      for (let c = 0; c < cols; c++) {
        gridHtml += `<span class="cookie-item">🍪</span>`;
      }
      gridHtml += `</div>`;
    }

    this.container.innerHTML = `
      <div class="mul-stage">
        <div class="baking-tray" id="mul-tray">
          <div class="tray-header">
            <span class="badge-accent">一共 <span class="hl-num">${rows}</span> 排，每排整齐放 <span class="hl-num">${cols}</span> 块</span>
          </div>
          <div class="cookie-grid">${gridHtml}</div>
        </div>
      </div>
      <div id="enlighten-notice" class="enlighten-bubble glow">
        ⚡ <strong>乘法思维：</strong> 不用一个个去数！排队方阵一行一行算，一句口诀秒出！
      </div>
    `;
  }

  _animateMultiplicationProcess(q, callback) {
    const rows = q.num1;
    const cols = q.num2;
    const notice = document.getElementById('enlighten-notice');
    const rhyme = q.hint ? (q.hint.match(/「(.*?)」/)?.[1] || '') : '';
    const intervalMs = 650; // 较原先 300ms 延长一倍以上，逐行亮起非常从容舒适

    for (let r = 0; r < rows; r++) {
      this._registerTimer(() => {
        const rowEl = document.getElementById(`mul-row-${r}`);
        if (rowEl) rowEl.classList.add('scanned-active');
        if (window.soundEngine) window.soundEngine.playRowScan(r);

        const currentTotal = (r + 1) * cols;
        if (notice) {
          notice.innerHTML = `🍪 扫描第 <strong>${r + 1}</strong> 排（+${cols}块）... 已经数到 <strong>${currentTotal}</strong> 块！`;
          this._attachSkipButton();
        }
      }, r * intervalMs);
    }

    // 所有排扫描完毕，全体金光出炉
    const completeTime = rows * intervalMs + 300;
    this._registerTimer(() => {
      const tray = document.getElementById('mul-tray');
      if (tray) tray.classList.add('tray-baked');

      const cookies = this.container.querySelectorAll('.cookie-item');
      cookies.forEach((c, idx) => {
        setTimeout(() => c.classList.add('baked'), idx * 25);
      });

      if (window.soundEngine) window.soundEngine.playPackBox();
      if (notice) {
        notice.innerHTML = `✨ <strong>乘法口诀：「${rhyme}」</strong>！整盘共有 <strong>${q.answer}</strong> 块香喷喷的曲奇出炉！`;
        notice.classList.add('pulse');
        this._attachSkipButton();
      }
    }, completeTime);

    // 留出 1800ms 阅读理解时间
    this._registerTimer(() => {
      if (callback) callback();
    }, completeTime + 1800);
  }

  // ================= 4. ➗ 除法舞台与慢速演算 =================
  _renderDivisionInitial(q) {
    const total = q.num1;
    const animalCount = q.num2;
    const animals = ['🐰 小兔', '🐻 小熊', '🦊 小狐', '🐼 熊猫', '🐵 小猴', '🐯 小虎', '🐶 小狗', '🐱 小猫'];

    let platesHtml = '';
    for (let i = 0; i < animalCount; i++) {
      platesHtml += `
        <div class="animal-plate-card" id="anim-card-${i}">
          <div class="animal-avatar">${animals[i % animals.length]}</div>
          <div class="plate-dish" id="plate-${i}">
            <span class="plate-placeholder">🍽️ 等待分草莓</span>
          </div>
        </div>
      `;
    }

    this.container.innerHTML = `
      <div class="div-stage">
        <div class="picnic-table" id="div-table">
          <div class="table-title">🍓 桌上一共有 <span class="hl-num">${total}</span> 颗草莓</div>
          <div class="strawberry-pool" id="strawberry-pool">
            ${this._renderItems('🍓', Math.min(total, 24))}
          </div>
        </div>

        <div class="div-action-divider">平均分给 <span class="hl-num">${animalCount}</span> 位小动物：</div>

        <div class="animal-plates-row">${platesHtml}</div>
      </div>
      <div id="enlighten-notice" class="enlighten-bubble glow">
        ⚖️ <strong>除法就是公平分发：</strong> 答对后看草莓怎么从容飞入每个人的盘子！
      </div>
    `;
  }

  _animateDivisionProcess(q, callback) {
    const animalCount = q.num2;
    const share = q.answer;
    const notice = document.getElementById('enlighten-notice');
    const animals = ['🐰 小兔', '🐻 小熊', '🦊 小狐', '🐼 熊猫', '🐵 小猴', '🐯 小虎', '🐶 小狗', '🐱 小猫'];
    const intervalMs = 680; // 从 320ms 调至 680ms，每一只小动物收草莓的细节都看得真真切切

    for (let i = 0; i < animalCount; i++) {
      this._registerTimer(() => {
        const plate = document.getElementById(`plate-${i}`);
        const card = document.getElementById(`anim-card-${i}`);
        if (plate) {
          plate.innerHTML = `<span class="shared-fruits">${'🍓'.repeat(Math.min(share, 8))}</span><span class="count-tag">${share}颗</span>`;
          plate.classList.add('happy');
        }
        if (card) card.classList.add('dancing');
        if (window.soundEngine) window.soundEngine.playDealFruit();

        if (notice) {
          notice.innerHTML = `🍓 分给 <strong>${animals[i % animals.length]}</strong> <strong>${share}</strong> 颗草莓...`;
          this._attachSkipButton();
        }
      }, i * intervalMs);
    }

    // 全部发完后
    const completeTime = animalCount * intervalMs + 300;
    this._registerTimer(() => {
      const table = document.getElementById('div-table');
      if (table) {
        table.innerHTML = `<div class="table-title" style="color:#16a34a; font-weight:800;">🎉 桌上草莓全部平均分完啦！</div>`;
      }
      if (notice) {
        notice.innerHTML = `❤️ <strong>人人平等！</strong> 每只小动物都分到了相等的 <strong>${share}</strong> 颗草莓！不多也不少！`;
        notice.classList.add('pulse');
        this._attachSkipButton();
      }
      if (window.soundEngine) window.soundEngine.playVictory();
    }, completeTime);

    // 留出 1900ms 观察时间
    this._registerTimer(() => {
      if (callback) callback();
    }, completeTime + 1900);
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
