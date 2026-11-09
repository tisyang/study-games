/**
 * 乐学萌岛 - 游戏主控制逻辑
 * 协调：大厅/答题舞台流转、点击反馈、连击计算、倒计时与超时/多错提示
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------ 状态管理 ------------------
  const state = {
    totalStars: parseInt(localStorage.getItem('kids_math_stars') || '0', 10),
    currentMode: 'add',
    modeTitles: {
      'add': '收苹果',
      'sub': '松鼠拆箱',
      'mul': '烤饼干',
      'div': '分水果',
      'mix': '算术挑战',
      'idiom': '成语故事',
      'poem': '画中找诗',
      'english_story': '帮帮小动物'
    },
    currentSubject: 'math',
    totalQuestions: 10,
    currentIndex: 0,
    roundCorrect: 0,
    currentCombo: 0,
    maxCombo: 0,
    currentQuestion: null,
    errorsOnCurrent: 0,
    isLocked: false, // 防手抖/动画未结束重复点击

    // 计时器状态
    timeLimit: 18, // 每题 18 秒，适合二年级小朋友思考
    timeRemaining: 18,
    timerId: null
  };

  // ------------------ DOM 元素引用 ------------------
  const el = {
    // 顶部状态
    btnHome: document.getElementById('btn-home'),
    starCount: document.getElementById('star-count'),
    comboBadge: document.getElementById('combo-badge'),
    comboCount: document.getElementById('combo-count'),
    btnToggleSfx: document.getElementById('btn-toggle-sfx'),
    btnToggleBgm: document.getElementById('btn-toggle-bgm'),

    // 视图层级
    viewMainLobby: document.getElementById('view-main-lobby'),
    viewSubjectLobby: document.getElementById('view-subject-lobby'),
    viewQuiz: document.getElementById('view-quiz'),

    // 一级与二级大厅控件
    cardGotoMath: document.getElementById('card-goto-math'),
    cardGotoChinese: document.getElementById('card-goto-chinese'),
    cardGotoEnglish: document.getElementById('card-goto-english'),
    btnBackMain: document.getElementById('btn-back-main'),
    subjectLobbyTitle: document.getElementById('subject-lobby-title'),
    subjectLobbyDesc: document.getElementById('subject-lobby-desc'),
    gridMathModes: document.getElementById('grid-math-modes'),
    gridChineseModes: document.getElementById('grid-chinese-modes'),
    gridEnglishModes: document.getElementById('grid-english-modes'),

    // 答题舞台
    quizTitle: document.getElementById('quiz-title'),
    quizProgress: document.getElementById('quiz-progress'),
    timerBar: document.getElementById('timer-bar'),
    timerBarContainer: document.getElementById('timer-bar-container'),
    questionFormula: document.getElementById('question-formula'),
    streakCheer: document.getElementById('streak-cheer'),
    optionBtns: document.querySelectorAll('.option-btn'),
    quizAdvanceBox: document.getElementById('quiz-advance-box'),
    btnNextQuestion: document.getElementById('btn-next-question'),

    // 锦囊弹窗
    modalHint: document.getElementById('modal-hint'),
    hintText: document.getElementById('hint-text'),
    btnCloseHint: document.getElementById('btn-close-hint'),

    // 结算弹窗
    modalSummary: document.getElementById('modal-summary'),
    summaryStars: document.getElementById('summary-stars'),
    summaryEncourage: document.getElementById('summary-encourage'),
    summaryCorrect: document.getElementById('summary-correct'),
    summaryCombo: document.getElementById('summary-combo'),
    summaryScore: document.getElementById('summary-score'),
    btnReplay: document.getElementById('btn-replay'),
    btnBackLobby: document.getElementById('btn-back-lobby')
  };

  // ------------------ 界面更新辅助 ------------------
  function updateStarDisplay() {
    el.starCount.textContent = state.totalStars;
    localStorage.setItem('kids_math_stars', state.totalStars);
  }

  function updateComboDisplay() {
    if (state.currentCombo >= 2) {
      el.comboBadge.style.display = 'inline-flex';
      el.comboCount.textContent = state.currentCombo;
      el.comboBadge.classList.add('bump');
      setTimeout(() => el.comboBadge.classList.remove('bump'), 200);

      // 显示鼓励标语
      const cheers = ['太棒了！👍', '连续答对！⚡', '数学小达人！✨', '算得真快！🎯'];
      const cheer = cheers[(state.currentCombo - 2) % cheers.length];
      el.streakCheer.textContent = `${cheer} (${state.currentCombo}连击)`;
      el.streakCheer.style.display = 'block';
    } else {
      el.comboBadge.style.display = 'none';
      el.streakCheer.style.display = 'none';
    }
  }

  // ------------------ 倒计时控制器 ------------------
  function startTimer() {
    stopTimer();
    state.timeRemaining = state.timeLimit;
    updateTimerBar();

    state.timerId = setInterval(() => {
      state.timeRemaining -= 0.1;
      if (state.timeRemaining <= 0) {
        state.timeRemaining = 0;
        updateTimerBar();
        stopTimer();
        onTimeout();
      } else {
        updateTimerBar();
      }
    }, 100);
  }

  function stopTimer() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function updateTimerBar() {
    const percent = Math.max(0, (state.timeRemaining / state.timeLimit) * 100);
    el.timerBar.style.width = `${percent}%`;
  }

  // ------------------ 游戏核心流程 ------------------
  function startQuiz(mode) {
    state.currentMode = mode;
    state.currentIndex = 0;
    state.roundCorrect = 0;
    state.currentCombo = 0;
    state.maxCombo = 0;
    state.isLocked = false;

    // 加法独立探索模式 vs 既有模式差异化初始化
    if (mode === 'add') {
      state.totalQuestions = 5;
      if (el.timerBarContainer) el.timerBarContainer.classList.add('hidden');
      el.quizTitle.textContent = '帮松鼠收苹果';
      if (el.viewQuiz) el.viewQuiz.classList.add('addition-explore');
    } else {
      state.totalQuestions = 10;
      if (el.timerBarContainer) el.timerBarContainer.classList.remove('hidden');
      el.quizTitle.textContent = state.modeTitles[mode] || '答题挑战';
      if (el.viewQuiz) el.viewQuiz.classList.remove('addition-explore');
    }
    if (el.quizAdvanceBox) el.quizAdvanceBox.classList.add('hidden');

    // 标记答题专注模式 (隐藏页脚、优化全屏空间)
    document.body.classList.add('in-quiz-mode');

    // 切换至答题舞台视图
    el.viewMainLobby.classList.add('hidden');
    el.viewSubjectLobby.classList.add('hidden');
    el.viewQuiz.classList.remove('hidden');
    el.btnHome.style.display = 'flex';

    updateComboDisplay();

    // 开启背景音乐 (遵循用户已开启习惯)
    window.soundEngine.startBgm();

    loadNextQuestion();
  }

  function loadNextQuestion() {
    if (state.currentIndex >= state.totalQuestions) {
      finishRound();
      return;
    }

    state.isLocked = false;
    state.errorsOnCurrent = 0;
    if (el.quizAdvanceBox) el.quizAdvanceBox.classList.add('hidden');

    state.currentQuestion = window.mathEngine.generateQuestion(state.currentMode);

    document.body.dataset.subject = state.currentQuestion.subject || 'math';
    document.body.dataset.type = state.currentQuestion.type || '';

    // 渲染题目与进度
    if (state.currentMode === 'add') {
      el.quizProgress.textContent = `${state.currentIndex + 1} / ${state.totalQuestions}`;
      el.questionFormula.textContent = `${state.currentQuestion.num1} + ${state.currentQuestion.num2} = ?`;
    } else {
      el.quizProgress.textContent = `第 ${state.currentIndex + 1} / ${state.totalQuestions} 题`;
      if (state.currentQuestion.type === 'poem') {
        el.questionFormula.innerHTML = `<span class="prompt-pill poem-prompt">🌸 点击正确词语，补全画中诗句</span>`;
      } else if (state.currentQuestion.type === 'english_story') {
        el.questionFormula.innerHTML = `<span class="prompt-pill english-prompt">🆘 挑选最神奇的救急工具</span>`;
      } else {
        el.questionFormula.textContent = state.currentQuestion.prompt;
      }
    }

    // 渲染现实生活情境与启蒙动画 / 语文剧场 / 英语救急剧场
    if (state.currentQuestion.subject === 'chinese') {
      if (state.currentQuestion.type === 'idiom') {
        window.chineseVisualEngine.renderIdiom(state.currentQuestion);
      } else {
        window.chineseVisualEngine.renderPoetry(state.currentQuestion);
      }
    } else if (state.currentQuestion.subject === 'english') {
      window.englishVisualEngine.renderStory(state.currentQuestion);
    } else if (window.visualEngine) {
      window.visualEngine.render(state.currentQuestion, {
        isExplore: state.currentMode === 'add'
      });
    }

    const optionsContainer = document.querySelector('.options-grid');
    if (state.currentQuestion.options.length === 3) {
      if (optionsContainer) optionsContainer.classList.add('three-options');
      el.optionBtns[3].style.display = 'none';
    } else {
      if (optionsContainer) optionsContainer.classList.remove('three-options');
      el.optionBtns[3].style.display = '';
    }

    // 渲染选项按键
    state.currentQuestion.options.forEach((optItem, idx) => {
      const btn = el.optionBtns[idx];
      btn.style.display = '';
      const optVal = (typeof optItem === 'object') ? optItem.value : optItem;
      let optHtml = (typeof optItem === 'object') ? (optItem.rubyHtml || optItem.word || optItem.icon) : optItem;
      if (optItem.isEnglishTool) {
        optHtml = `<span class="tool-icon">${optItem.icon}</span>`;
      }
      btn.innerHTML = optHtml;
      btn.dataset.value = optVal;
      btn.className = `option-btn btn-${idx} ${state.currentQuestion.subject === 'chinese' ? 'btn-chinese' : ''} ${state.currentQuestion.subject === 'english' ? 'btn-tool' : ''}`;
    });

    // 启动倒计时 (加法独立探索样板无倒计时)
    if (state.currentMode === 'add') {
      stopTimer();
    } else {
      startTimer();
    }
  }

  // 点击选项作答处理
  function handleOptionClick(btn) {
    if (state.isLocked) return;

    window.soundEngine.playClick();
    const chosen = String(btn.dataset.value);
    const correct = String(state.currentQuestion.answer);

    if (chosen === correct) {
      // ===== 答对 =====
      state.isLocked = true;
      stopTimer();
      btn.classList.add('correct');

      state.roundCorrect++;
      state.currentCombo++;
      state.maxCombo = Math.max(state.maxCombo, state.currentCombo);
      state.totalStars += 1;
      updateStarDisplay();
      updateComboDisplay();

      // 播放清脆上升和弦
      window.soundEngine.playCorrect(state.currentCombo);

      if (state.currentMode === 'add') {
        // 加法探索模式：完成场景，展示正确等式，出现主动推进按钮
        el.questionFormula.textContent = `${state.currentQuestion.num1} + ${state.currentQuestion.num2} = ${state.currentQuestion.answer}`;
        if (window.visualEngine && window.visualEngine.completeExploreAddition) {
          window.visualEngine.completeExploreAddition();
        }
        if (el.quizAdvanceBox && el.btnNextQuestion) {
          el.btnNextQuestion.textContent = (state.currentIndex >= state.totalQuestions - 1) ? '完成啦 ➔' : '下一车 ➔';
          el.quizAdvanceBox.classList.remove('hidden');
        }
      } else {
        // 启动演播：语文剧场或数学演算或英语救援
        if (state.currentQuestion.subject === 'chinese') {
          if (state.currentQuestion.type === 'idiom') {
            window.chineseVisualEngine.celebrateIdiom(state.currentQuestion, () => {
              state.currentIndex++;
              loadNextQuestion();
            });
          } else {
            window.chineseVisualEngine.celebratePoetry(state.currentQuestion, () => {
              state.currentIndex++;
              loadNextQuestion();
            });
          }
        } else if (state.currentQuestion.subject === 'english') {
          window.englishVisualEngine.celebrateRescue(state.currentQuestion, () => {
            state.currentIndex++;
            loadNextQuestion();
          });
        } else if (window.visualEngine) {
          window.visualEngine.playProcessAnimation(state.currentQuestion, () => {
            state.currentIndex++;
            loadNextQuestion();
          });
        } else {
          setTimeout(() => {
            state.currentIndex++;
            loadNextQuestion();
          }, 800);
        }
      }

    } else {
      // ===== 答错 =====
      btn.classList.add('wrong');
      window.soundEngine.playWrong();

      // 断连击
      state.currentCombo = 0;
      updateComboDisplay();
      state.errorsOnCurrent++;

      // 0.4秒后恢复按键状态，允许重选
      setTimeout(() => {
        btn.classList.remove('wrong');
      }, 400);

      if (state.currentMode === 'add') {
        // 加法探索模式：场景内轻微提示与高亮操作
        if (window.visualEngine) {
          if (state.errorsOnCurrent >= 2) {
            window.visualEngine.showExploreHint();
          } else {
            window.visualEngine.setExploreHint('再试试看！🤔');
          }
        }
      } else {
        // 连续答错 2 次，触发智慧小锦囊温和提示
        if (state.errorsOnCurrent >= 2) {
          stopTimer();
          setTimeout(() => {
            showHint('别着急，小猫头鹰给你支招：\n' + state.currentQuestion.hint);
          }, 300);
        }
      }
    }
  }

  // 超时未答
  function onTimeout() {
    window.soundEngine.playTimeout();
    state.currentCombo = 0;
    updateComboDisplay();
    showHint('⏰ 时间到啦，别气馁！看一看解题小锦囊：\n' + state.currentQuestion.hint);
  }

  // 显示智慧锦囊弹窗
  function showHint(msg) {
    stopTimer();
    window.soundEngine.playHint();
    el.hintText.textContent = msg;
    el.modalHint.classList.remove('hidden');
  }

  // 关闭锦囊弹窗，给孩子充裕时间重新思考
  function closeHint() {
    window.soundEngine.playClick();
    el.modalHint.classList.add('hidden');
    // 重新给 10 秒时间继续作答
    state.timeRemaining = 12;
    startTimer();
  }

  // 关卡通关结算
  function finishRound() {
    stopTimer();
    window.soundEngine.playVictory();
    document.body.classList.remove('in-quiz-mode');

    const total = state.totalQuestions;
    const score = state.roundCorrect;
    let starsStr = '⭐';
    let encourage = '多加练习，下次一定更棒！';
    let bonusStars = 2;

    if (score === total) {
      starsStr = '⭐⭐⭐';
      encourage = '太神啦！全部答对，你简直是数学小天才！🎉';
      bonusStars = 10;
    } else if (score >= Math.ceil(total * 0.8)) {
      starsStr = '⭐⭐';
      encourage = '真厉害！表现非常棒，再接再厉！👏';
      bonusStars = 5;
    }

    state.totalStars += bonusStars;
    updateStarDisplay();

    el.summaryStars.textContent = starsStr;
    el.summaryEncourage.textContent = encourage;
    el.summaryCorrect.textContent = `${score} / ${state.totalQuestions}`;
    el.summaryCombo.textContent = state.maxCombo;
    el.summaryScore.textContent = `+${bonusStars}⭐`;

    el.modalSummary.classList.remove('hidden');
  }

  // 打开二级学科专区大厅 (数学岛 / 语文岛 / 英语岛)
  function openSubjectLobby(subject) {
    window.soundEngine.playClick();
    document.body.classList.remove('in-quiz-mode');
    state.currentSubject = subject;
    el.viewMainLobby.classList.add('hidden');
    el.viewSubjectLobby.classList.remove('hidden');
    el.viewQuiz.classList.add('hidden');
    el.btnHome.style.display = 'none';

    if (subject === 'math') {
      el.subjectLobbyTitle.textContent = '数学岛';
      if (el.subjectLobbyDesc) el.subjectLobbyDesc.textContent = '';
      el.gridMathModes.classList.remove('hidden');
      el.gridChineseModes.classList.add('hidden');
      el.gridEnglishModes.classList.add('hidden');
    } else if (subject === 'chinese') {
      el.subjectLobbyTitle.textContent = '语文岛';
      if (el.subjectLobbyDesc) el.subjectLobbyDesc.textContent = '';
      el.gridMathModes.classList.add('hidden');
      el.gridChineseModes.classList.remove('hidden');
      el.gridEnglishModes.classList.add('hidden');
    } else if (subject === 'english') {
      el.subjectLobbyTitle.textContent = '英语岛';
      if (el.subjectLobbyDesc) el.subjectLobbyDesc.textContent = '';
      el.gridMathModes.classList.add('hidden');
      el.gridChineseModes.classList.add('hidden');
      el.gridEnglishModes.classList.remove('hidden');
    }
  }

  // 返回二级学科专区大厅
  function backToSubjectLobby() {
    stopTimer();
    window.soundEngine.playClick();
    document.body.classList.remove('in-quiz-mode');
    delete document.body.dataset.subject;
    delete document.body.dataset.type;

    if (window.chineseVisualEngine) {
      window.chineseVisualEngine.clear();
    }
    if (window.englishVisualEngine) {
      window.englishVisualEngine.clear();
    }
    if (window.speechEngine) {
      window.speechEngine.stop();
    }
    if (window.visualEngine) {
      window.visualEngine.clear();
    }
    el.modalSummary.classList.add('hidden');
    el.modalHint.classList.add('hidden');
    if (el.quizAdvanceBox) el.quizAdvanceBox.classList.add('hidden');
    if (el.timerBarContainer) el.timerBarContainer.classList.remove('hidden');
    if (el.viewQuiz) el.viewQuiz.classList.remove('addition-explore');
    el.viewQuiz.classList.add('hidden');
    el.viewSubjectLobby.classList.remove('hidden');
    el.viewMainLobby.classList.add('hidden');
    el.btnHome.style.display = 'none';
    state.currentCombo = 0;
    updateComboDisplay();
  }

  // 返回一级乐园总大厅 (岛屿分类)
  function backToMainLobby() {
    stopTimer();
    window.soundEngine.playClick();
    document.body.classList.remove('in-quiz-mode');
    delete document.body.dataset.subject;
    delete document.body.dataset.type;
    if (window.chineseVisualEngine) {
      window.chineseVisualEngine.clear();
    }
    if (window.englishVisualEngine) {
      window.englishVisualEngine.clear();
    }
    if (window.speechEngine) {
      window.speechEngine.stop();
    }
    if (window.visualEngine) {
      window.visualEngine.clear();
    }
    el.modalSummary.classList.add('hidden');
    el.modalHint.classList.add('hidden');
    if (el.quizAdvanceBox) el.quizAdvanceBox.classList.add('hidden');
    if (el.timerBarContainer) el.timerBarContainer.classList.remove('hidden');
    if (el.viewQuiz) el.viewQuiz.classList.remove('addition-explore');
    el.viewQuiz.classList.add('hidden');
    el.viewSubjectLobby.classList.add('hidden');
    el.viewMainLobby.classList.remove('hidden');
    el.btnHome.style.display = 'none';
    state.currentCombo = 0;
    updateComboDisplay();
  }

  // ------------------ 事件绑定 ------------------
  // 1. 一级大厅学科卡片点击
  if (el.cardGotoMath) {
    el.cardGotoMath.addEventListener('click', () => openSubjectLobby('math'));
  }
  if (el.cardGotoChinese) {
    el.cardGotoChinese.addEventListener('click', () => openSubjectLobby('chinese'));
  }
  if (el.cardGotoEnglish) {
    el.cardGotoEnglish.addEventListener('click', () => openSubjectLobby('english'));
  }

  // 2. 二级大厅返回一级大厅按钮
  if (el.btnBackMain) {
    el.btnBackMain.addEventListener('click', backToMainLobby);
  }

  // 3. 关卡卡片点击进入答题
  document.querySelectorAll('.portal-card:not(.locked)').forEach(card => {
    card.addEventListener('click', () => {
      window.soundEngine.playClick();
      const mode = card.dataset.mode;
      if (mode) {
        startQuiz(mode);
      }
    });
  });

  // 4. 选项按键点击
  el.optionBtns.forEach(btn => {
    btn.addEventListener('click', () => handleOptionClick(btn));
  });

  // 4.1 探索模式主动推进下一题按键
  if (el.btnNextQuestion) {
    el.btnNextQuestion.addEventListener('click', () => {
      const isQuizVisible = el.viewQuiz && !el.viewQuiz.classList.contains('hidden');
      if (state.currentMode === 'add' && state.isLocked && isQuizVisible && state.currentIndex < state.totalQuestions) {
        state.isLocked = false;
        window.soundEngine.playClick();
        if (el.quizAdvanceBox) el.quizAdvanceBox.classList.add('hidden');
        state.currentIndex++;
        loadNextQuestion();
      }
    });
  }

  // 5. 提示弹窗按钮
  el.btnCloseHint.addEventListener('click', closeHint);

  // 6. 结算弹窗按钮
  el.btnReplay.addEventListener('click', () => {
    el.modalSummary.classList.add('hidden');
    startQuiz(state.currentMode);
  });
  el.btnBackLobby.addEventListener('click', backToSubjectLobby);
  el.btnHome.addEventListener('click', backToSubjectLobby);

  // 7. 顶部音频按钮控制
  el.btnToggleSfx.addEventListener('click', () => {
    const enabled = window.soundEngine.toggleSfx();
    el.btnToggleSfx.textContent = enabled ? '🔔' : '🔕';
    el.btnToggleSfx.title = enabled ? '音效开启' : '音效静音';
    if (enabled) window.soundEngine.playClick();
  });

  el.btnToggleBgm.addEventListener('click', () => {
    const enabled = window.soundEngine.toggleBgm();
    el.btnToggleBgm.textContent = enabled ? '🎵' : '🔇';
    el.btnToggleBgm.title = enabled ? '背景音乐开启' : '背景音乐静音';
  });

  // 页面首次任意触摸/点击激活音频上下文 (满足现代浏览器安全策略)
  const unlockAudio = () => {
    window.soundEngine.init();
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
  };
  document.addEventListener('click', unlockAudio, { once: true });
  document.addEventListener('touchstart', unlockAudio, { once: true });

  // 初始化星数展示
  updateStarDisplay();
});
