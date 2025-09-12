let questions = [];
let currentQuestion = 0;
let answers = [];
let timer;
let timeLeft = 180 * 60;

// Elements
const introCard = document.getElementById("intro-card");
const questionText = document.getElementById("question-text");
const optionsDiv = document.getElementById("options");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const skipBtn = document.getElementById("skip-btn");
const submitBtn = document.getElementById("submit-btn");
const restartBtn = document.getElementById("restart-btn");
const resultDashboard = document.getElementById("result-dashboard");
const resultSummary = document.getElementById("result-summary");
const questionCard = document.getElementById("question-card");
const flexNav = document.getElementById("nav-btns");

// Popup modal
const popupModal = document.getElementById("popup-modal");
const popupMessage = document.getElementById("popup-message");
const closePopup = document.getElementById("close-popup");

// Timer
const timerEl = document.getElementById("timer");

// Test selection buttons
const shortTestBtn = document.getElementById("short-test-btn");
const jeeMainsBtn = document.getElementById("jee-mains-btn");
const jeeAdvanceBtn = document.getElementById("jee-advance-btn");
const chapterWiseBtn = document.getElementById("chapter-wise-btn");

// Utility
function updateTimer() {
  if (timeLeft <= 0) {
    clearInterval(timer);
    showResultDashboard();
    return;
  }
  let min = Math.floor(timeLeft / 60);
  let sec = timeLeft % 60;
  timerEl.textContent = `${min}:${sec.toString().padStart(2, "0")}`;
  timeLeft--;
}

function loadQuestion(index) {
  const q = questions[index];
  questionText.textContent = `Q${index + 1}. ${q.text}`;
  optionsDiv.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option btn";
    btn.textContent = opt;
    if (answers[index] === i) btn.classList.add("selected");
    btn.onclick = () => selectOption(index, i, btn);
    optionsDiv.appendChild(btn);
  });
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === questions.length - 1;
}

function selectOption(qIndex, optIndex, btn) {
  if (answers[qIndex] !== null && answers[qIndex] !== undefined) return;
  answers[qIndex] = optIndex;
  document.querySelectorAll(".option").forEach(b => {
    b.classList.remove("selected", "correct", "wrong");
    b.disabled = true;
  });
  if (optIndex === questions[qIndex].answer) {
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
    const correctBtn = document.querySelectorAll(".option")[questions[qIndex].answer];
    if (correctBtn) correctBtn.classList.add("correct");
  }
}

prevBtn.onclick = () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion(currentQuestion);
  }
};
nextBtn.onclick = () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion(currentQuestion);
  }
};
skipBtn.onclick = () => {
  answers[currentQuestion] = null;
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion(currentQuestion);
  } else {
    showPopup("No more questions to skip!");
  }
};

submitBtn.onclick = () => {
  showResultDashboard();
  clearInterval(timer);
};

function showResultDashboard() {
  let correct = 0, wrong = 0, skipped = 0;
  questions.forEach((q, i) => {
    if (answers[i] === null || answers[i] === undefined) skipped++;
    else if (answers[i] === q.answer) correct++;
    else wrong++;
  });

  questionCard.style.display = "none";
  flexNav.style.display = "none";
  resultDashboard.style.display = "";

  const ctx = document.getElementById('resultChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Correct', 'Wrong', 'Skipped'],
      datasets: [{
        data: [correct, wrong, skipped],
        backgroundColor: [
          '#22c55e',
          '#ef4444',
          '#fbbf24'
        ]
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });

  resultSummary.innerHTML =
    `<p>Correct: <b>${correct}</b> | Wrong: <b>${wrong}</b> | Skipped: <b>${skipped}</b></p>`;
}

restartBtn.onclick = () => {
  currentQuestion = 0;
  answers = new Array(questions.length).fill(null);
  resultDashboard.style.display = "none";
  questionCard.style.display = "";
  flexNav.style.display = "";
  timeLeft = 180 * 60;
  timer = setInterval(updateTimer, 1000);
  loadQuestion(currentQuestion);
};

function showPopup(message) {
  popupMessage.textContent = message;
  popupModal.classList.add("show");
}
closePopup.onclick = () => {
  popupModal.classList.remove("show");
};

// Test selection logic
function startTestWithFile(fileName) {
  fetch(fileName)
    .then(res => res.json())
    .then(data => {
      questions = data;
      answers = new Array(questions.length).fill(null);
      currentQuestion = 0;
      timeLeft = 180 * 60;
      introCard.style.display = "none";
      questionCard.style.display = "";
      flexNav.style.display = "";
      timerEl.style.display = "";
      resultDashboard.style.display = "none";
      timer = setInterval(updateTimer, 1000);
      loadQuestion(currentQuestion);
    })
    .catch(() => {
      questionText.textContent = "Failed to load questions.";
      optionsDiv.innerHTML = "";
    });
}

// Button events
shortTestBtn.onclick = () => startTestWithFile('short-test.json');
jeeMainsBtn.onclick = () => startTestWithFile('jee-mains.json');
jeeAdvanceBtn.onclick = () => startTestWithFile('jee-advance.json');
chapterWiseBtn.onclick = () => startTestWithFile('chapter-wise.json');

// On page load, show intro only
introCard.style.display = "";
questionCard.style.display = "none";
flexNav.style.display = "none";
resultDashboard.style.display = "none";
timerEl.style.display = "none";