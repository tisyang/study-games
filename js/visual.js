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
  render(q) {
    this.clear();
    if (!this.container || !this.narration) return;

    // 更新故事叙述
    this.narration.innerHTML = `
      <span class="story-tag">${q.storyTag || '数学启蒙'}</span>
      <span class="story-text">${q.story || ''}</span>
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
          <div class="pile-title">树上摘的 (${q.num1}个)</div>
          <div class="item-group">
            <div class="tens-boxes" id="add-boxes-1">${this._renderBoxes(tens1)}</div>
            <div class="ones-items" id="add-ones-1">${this._renderItems('🍎', ones1)}</div>
          </div>
        </div>

        <div class="op-symbol-stage" id="add-op-sym">+</div>

        <div class="pile pile-right" id="add-pile-2">
          <div class="pile-title">小鹿运来 (${q.num2}个)</div>
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
          <div class="pile-title">仓库原有松果 (${q.num1}颗)</div>
          <div class="item-group">
            <div class="tens-boxes" id="sub-boxes">${this._renderBoxes(tens1)}</div>
            <div class="ones-items" id="sub-ones">${this._renderItems('🌰', ones1)}</div>
          </div>
        </div>

        <div class="sub-action-indicator" id="sub-indicator">
          <span>松鼠宝宝要拿走 <strong>${q.num2}</strong> 颗（${tens2}箱 + ${ones2}颗散装）</span>
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
            <span class="badge-accent">一共 ${rows} 排，每排整齐放 ${cols} 块</span>
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
          <div class="table-title">🍓 桌上一共有 <strong>${total}</strong> 颗草莓</div>
          <div class="strawberry-pool" id="strawberry-pool">
            ${this._renderItems('🍓', Math.min(total, 24))}
          </div>
        </div>

        <div class="div-action-divider">平均分给 ${animalCount} 位小动物：</div>

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
