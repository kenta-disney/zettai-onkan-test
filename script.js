const titleScreen = document.getElementById('title-screen');
const difficultyScreen = document.getElementById('difficulty-screen');
const playScreen = document.getElementById('play-screen');
const resultScreen = document.getElementById('result-screen');
const startGameButton = document.getElementById('start-game-button');
const easyModeButton = document.getElementById('easy-mode-button');
const normalModeButton = document.getElementById('normal-mode-button');
const retryButton = document.getElementById('retry-button');
const retryButtonResult = document.getElementById('retry-button-result');
const backToTitleButton = document.getElementById('back-to-title-button');
const backToTitleButtonResult = document.getElementById('back-to-title-button-result');
const backToTitleButtonDifficulty = document.getElementById('back-to-title-button-difficulty');
const keys = document.querySelectorAll('.key');
const scoreText = document.getElementById('score');
const stopwatch = document.getElementById('stopwatch');
const questionCountElement = document.getElementById('question-count');

let questions = ['do', 'do-sharp', 're', 're-sharp', 'mi', 'fa', 'fa-sharp', 'so', 'so-sharp', 'ra', 'ra-sharp', 'si'];
let chords = {
  'C': ['do', 'mi', 'so'],
  'C#': ['do-sharp', 'fa', 'so-sharp'],
  'D': ['re', 'fa-sharp', 'ra'],
  'D#': ['re-sharp', 'so', 'ra-sharp'],
  'E': ['mi', 'so-sharp', 'si'],
  'F': ['fa', 'ra', 'do5'],
  'F#': ['fa-sharp', 'ra-sharp', 'do-sharp5'],
  'G': ['so', 'si', 're5'],
  'G#': ['so-sharp', 'do5', 're-sharp5'],
  'A': ['ra', 'do-sharp5', 'mi5'],
  'A#': ['ra-sharp', 're5', 'fa5']
};
let currentQuestion = 0;
let score = 0;
let correctSound = '';
let chord = [];
let mode = 'easy'; // 'easy' or 'normal'
let startTime;
let timerInterval;
let elapsedTime;

// 判定音をロード
const correctSoundPlayer = new Audio('sounds/correct.mp3');
const incorrectSoundPlayer = new Audio('sounds/incorrect.mp3');

// Tone.jsのSamplerを設定
const sampler = new Tone.Sampler({
	urls: {
		C4: "C4.mp3",
		"D#4": "Ds4.mp3",
		"F#4": "Fs4.mp3",
		A4: "A4.mp3",
	},
	release: 1,
	baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

// 音源を設定（音程とエンベロープを設定することもできます）
const notes = {
    'do': 'C4',
    'do-sharp': 'C#4',
    're': 'D4',
    're-sharp': 'D#4',
    'mi': 'E4',
    'fa': 'F4',
    'fa-sharp': 'F#4',
    'so': 'G4',
    'so-sharp': 'G#4',
    'ra': 'A4',
    'ra-sharp': 'A#4',
    'si': 'B4',
    'do5': 'C5',
    'do-sharp5': 'C#5',
    're5': 'D5',
    're-sharp5': 'D#5',
    'mi5': 'E5',
    'fa5': 'F5'
  };  

// タイトル画面から難易度選択画面に遷移
startGameButton.addEventListener('click', () => {
  showScreen(difficultyScreen);
});

// 難易度選択画面からEasyモードを選択
easyModeButton.addEventListener('click', () => {
  mode = 'easy';
  showScreen(playScreen);
  startGame();
});

// 難易度選択画面からNormalモードを選択
normalModeButton.addEventListener('click', () => {
  mode = 'normal';
  showScreen(playScreen);
  startGame();
});

// 難易度選択画面からタイトル画面に戻る
backToTitleButtonDifficulty.addEventListener('click', () => {
  showScreen(titleScreen);
});

// プレイ画面からリトライ
retryButton.addEventListener('click', () => {
  showScreen(playScreen);
  startGame();
});

// プレイ画面からタイトル画面に戻る
backToTitleButton.addEventListener('click', () => {
  showScreen(titleScreen);
});

// リザルト画面からリトライ
retryButtonResult.addEventListener('click', () => {
  showScreen(playScreen);
  startGame();
});

// リザルト画面からタイトル画面に戻る
backToTitleButtonResult.addEventListener('click', () => {
  showScreen(titleScreen);
});

// ゲームを開始
function startGame() {
    score = 0;
    currentQuestion = 0;
    startStopwatch();
    showPianoKeys(); // 追加
    nextQuestion();
  }
  
// ストップウォッチ開始
function startStopwatch() {
  startTime = Date.now();
  timerInterval = setInterval(updateStopwatch, 100);
}

// ストップウォッチ更新
function updateStopwatch() {
  const elapsed = Date.now() - startTime;
  const seconds = Math.floor(elapsed / 1000);
  const milliseconds = Math.floor((elapsed % 1000) / 10);
  stopwatch.textContent = `${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
}

// ストップウォッチ停止
function stopStopwatch() {
  clearInterval(timerInterval);
  elapsedTime = Date.now() - startTime;
}

// 次の問題を出題
function nextQuestion() {
    if (mode === 'easy') {
        if (currentQuestion < 3) {
            correctSound = questions[Math.floor(Math.random() * questions.length)];
            playSound(correctSound);
            currentQuestion++;
            updateQuestionCount(); // 問題数の表示を更新
        } else {
            stopStopwatch();
            showResult();
        }
    } else if (mode === 'normal') {
        if (currentQuestion < 3) {
            const chordKeys = Object.keys(chords);
            const randomChord = chordKeys[Math.floor(Math.random() * chordKeys.length)];
            chord = chords[randomChord];
            correctSound = randomChord;
            playChord(chord);
            currentQuestion++;
            updateQuestionCount(); // 問題数の表示を更新
        } else {
            stopStopwatch();
            showResult();
        }
    }
}


// 問題数を更新
function updateQuestionCount() {
    questionCountElement.textContent = `問題 ${currentQuestion} / 3`;
}

// 音を再生
function playSound(sound) {
    const note = notes[sound];
    if (note) {
        sampler.triggerAttackRelease(note, '4n');
    }
}

// 和音を再生
function playChord(chord) {
    const chordNotes = chord.map(note => notes[note]);
    sampler.triggerAttackRelease(chordNotes, '4n');
}

// 鍵盤クリック時の処理
keys.forEach(key => {
    key.addEventListener('mousedown', () => {
      key.classList.add('pressed');
      const sound = key.dataset.sound;
      playSound(sound); // 鍵盤を押したときに音を再生
    });
  
    key.addEventListener('mouseup', () => {
      key.classList.remove('pressed');
    });
  
    key.addEventListener('mouseleave', () => {
      key.classList.remove('pressed'); // マウスが鍵盤から離れたときに押下状態を解除
    });
  
    key.addEventListener('click', () => {
      const selectedSound = key.dataset.sound;
      if (mode === 'easy') {
        if (selectedSound === correctSound) {
          score++;
          correctSoundPlayer.play();  // 正解音を再生
          setTimeout(nextQuestion, 1000); // 1000ミリ秒待機してから次の問題へ
        } else {
          incorrectSoundPlayer.play();  // 不正解音を再生
          setTimeout(nextQuestion, 1000); // 1000ミリ秒待機してから次の問題へ
        }
      } else if (mode === 'normal') {
        if (chord.includes(selectedSound)) {
          chord = chord.filter(note => note !== selectedSound);
          if (chord.length === 0) {
            score++;
            correctSoundPlayer.play();  // 正解音を再生
            setTimeout(nextQuestion, 1000); // 1000ミリ秒待機してから次の問題へ
          }
        } else {
          incorrectSoundPlayer.play();  // 不正解音を再生
          setTimeout(nextQuestion, 1000); // 1000ミリ秒待機してから次の問題へ
        }
      }
    });
});
  
// リザルト画面を表示
function showResult() {
  const seconds = Math.floor(elapsedTime / 1000);
  const milliseconds = Math.floor((elapsedTime % 1000) / 10);
  document.getElementById('play-time').textContent = `プレイ時間: ${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
  scoreText.textContent = `あなたのスコア: ${score} / 3`;
  showScreen(resultScreen);
}

// 鍵盤の表示を切り替える
function showPianoKeys() {
    const pianoElement = document.querySelector('.piano');
    const newKeys = document.querySelectorAll('.key[data-sound*="5"]');

    if (mode === 'easy') {
        newKeys.forEach(key => key.classList.add('hidden'));
        pianoElement.classList.add('easy-mode');
        pianoElement.classList.remove('normal-mode');
    } else if (mode === 'normal') {
        newKeys.forEach(key => key.classList.remove('hidden'));
        pianoElement.classList.add('normal-mode');
        pianoElement.classList.remove('easy-mode');
    }
}


// 画面の切り替え
function showScreen(screen) {
  [titleScreen, difficultyScreen, playScreen, resultScreen].forEach(s => s.classList.add('hidden'));
  screen.classList.remove('hidden');
}