// Mock questions (expand as needed)
const questions = [
  {
    text: "What is the value of sin²θ + cos²θ?",
    options: ["0", "1", "2", "θ"],
    answer: 1
  },
  {
    text: "The derivative of x² is?",
    options: ["x", "2x", "x²", "None of these"],
    answer: 1
  },
  {
    text: "Which of the following is NOT a prime number?",
    options: ["2", "3", "4", "5"],
    answer: 2
  }
];

let currentQuestion = 0;
let answers = new Array(questions.length).fill(null);

// Elements
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
const flexNav = document.querySelector(".flex");

// Popup modal
const popupModal = document.getElementById("popup-modal");
const popupMessage = document.getElementById("popup-message");
const closePopup = document.getElementById("close-popup");

// Timer (3 hours)
let timeLeft = 180 * 60;
const timerEl = document.getElementById("timer");
let timer = setInterval(updateTimer, 1000);

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

// Load a question
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

// Select option
function selectOption(qIndex, optIndex, btn) {
  answers[qIndex] = optIndex;
  document.querySelectorAll(".option").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
}

// Navigation
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
  answers[currentQuestion] = null; // Mark as skipped
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion(currentQuestion);
  } else {
    showPopup("No more questions to skip!");
  }
};

// Submit
submitBtn.onclick = () => {
  showResultDashboard();
  clearInterval(timer);
};

// Show result dashboard
function showResultDashboard() {
  let correct = 0, wrong = 0, skipped = 0;
  questions.forEach((q, i) => {
    if (answers[i] === null) skipped++;
    else if (answers[i] === q.answer) correct++;
    else wrong++;
  });

  questionCard.style.display = "none";
  flexNav.style.display = "none";
  resultDashboard.style.display = "";

  // Chart.js Pie Chart
  const ctx = document.getElementById('resultChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Correct', 'Wrong', 'Skipped'],
      datasets: [{
        data: [correct, wrong, skipped],
        backgroundColor: [
          '#22c55e', // green
          '#ef4444', // red
          '#fbbf24'  // yellow
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

// Restart button logic
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

// Popup logic
function showPopup(message) {
  popupMessage.textContent = message;
  popupModal.classList.add("show");
}
closePopup.onclick = () => {
  popupModal.classList.remove("show");
};

// Initial load
loadQuestion(currentQuestion);