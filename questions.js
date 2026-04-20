let quizQuestions = [];
let currentIndex = 0;
let selectedAnswers = [];

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const reviewBtn = document.getElementById("reviewBtn");

const quizArea = document.getElementById("quizArea");
const resultArea = document.getElementById("resultArea");
const reviewArea = document.getElementById("reviewArea");

const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("scoreText");
const finalScore = document.getElementById("finalScore");
const finalPercent = document.getElementById("finalPercent");

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildQuiz() {
  const shuffleQuestions = document.getElementById("shuffleQuestions").checked;
  const shuffleChoices = document.getElementById("shuffleChoices").checked;

  quizQuestions = questions.map(q => ({
    prompt: q.q,
    originalOptions: [...q.options],
    answerText: q.options[q.answer],
    options: [...q.options]
  }));

  if (shuffleChoices) {
    quizQuestions = quizQuestions.map(q => {
      const shuffledOptions = shuffleArray(q.options);
      return { ...q, options: shuffledOptions };
    });
  }

  if (shuffleQuestions) {
    quizQuestions = shuffleArray(quizQuestions);
  }

  selectedAnswers = new Array(quizQuestions.length).fill(null);
  currentIndex = 0;
}

function renderQuestion() {
  const q = quizQuestions[currentIndex];
  progressText.textContent = `Question ${currentIndex + 1} / ${quizQuestions.length}`;
  scoreText.textContent = `Answered: ${selectedAnswers.filter(v => v !== null).length}`;
  questionText.textContent = q.prompt;
  optionsContainer.innerHTML = "";

  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    if (selectedAnswers[currentIndex] === index) btn.classList.add("selected");
    btn.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
    btn.addEventListener("click", () => {
      selectedAnswers[currentIndex] = index;
      renderQuestion();
    });
    optionsContainer.appendChild(btn);
  });

  prevBtn.disabled = currentIndex === 0;
  nextBtn.classList.toggle("hidden", currentIndex === quizQuestions.length - 1);
  submitBtn.classList.toggle("hidden", currentIndex !== quizQuestions.length - 1);
}

function startQuiz() {
  buildQuiz();
  quizArea.classList.remove("hidden");
  resultArea.classList.add("hidden");
  reviewArea.classList.add("hidden");
  reviewArea.innerHTML = "";
  renderQuestion();
}

function calculateResults() {
  let correct = 0;
  quizQuestions.forEach((q, i) => {
    const selectedIndex = selectedAnswers[i];
    if (selectedIndex !== null && q.options[selectedIndex] === q.answerText) {
      correct++;
    }
  });
  return correct;
}

function submitQuiz() {
  const correct = calculateResults();
  const total = quizQuestions.length;
  const percent = ((correct / total) * 100).toFixed(1);

  finalScore.textContent = `Score: ${correct} / ${total}`;
  finalPercent.textContent = `Percent: ${percent}%`;
  resultArea.classList.remove("hidden");
  reviewArea.classList.add("hidden");
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

function reviewWrongAnswers() {
  reviewArea.innerHTML = "";
  let wrongCount = 0;

  quizQuestions.forEach((q, i) => {
    const selectedIndex = selectedAnswers[i];
    const selectedText = selectedIndex === null ? "No answer selected" : q.options[selectedIndex];
    const isCorrect = selectedIndex !== null && q.options[selectedIndex] === q.answerText;

    if (!isCorrect) {
      wrongCount++;
      const div = document.createElement("div");
      div.className = "review-item";
      div.innerHTML = `
        <h3>Question ${i + 1}</h3>
        <p><strong>${q.prompt}</strong></p>
        <p class="incorrect">Your answer: ${selectedText}</p>
        <p class="correct">Correct answer: ${q.answerText}</p>
      `;
      reviewArea.appendChild(div);
    }
  });

  if (wrongCount === 0) {
    reviewArea.innerHTML = `<div class="review-item"><p class="correct">Perfect score. No wrong answers to review.</p></div>`;
  }

  reviewArea.classList.remove("hidden");
}

startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", startQuiz);
prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
});
nextBtn.addEventListener("click", () => {
  if (currentIndex < quizQuestions.length - 1) {
    currentIndex++;
    renderQuestion();
  }
});
submitBtn.addEventListener("click", submitQuiz);
reviewBtn.addEventListener("click", reviewWrongAnswers);
