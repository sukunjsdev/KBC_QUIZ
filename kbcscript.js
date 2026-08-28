// theme color change
const theme = document.querySelector(".layout1_btn_theme");
theme.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
});

// layout1 to layout2
const layout1 = document.querySelector(".layout1");
const start_btn = document.querySelector(".layout1_btn_start");
const layout2 = document.querySelector(".layout2");
let quizStarted = false;

start_btn.addEventListener("click", function () {
  if (quizStarted) {
    return;
  }
  quizStarted = true;
  layout1.style.display = "none";
  layout2.style.display = "flex";
  startquiz();
});

// layout 2:
function startquiz() {
  // variables

  const question = document.querySelector(".question");
  const que_out_5 = document.querySelector(".que_out_5 span");
  const option_menu = document.querySelectorAll(".Option_menu button");
  const diff_line = document.querySelector(".diff_line span");
  const submit = document.querySelector(".btn_submit_ans");
  const rounddata = document.querySelector(".Round");
  const Score = document.querySelector(".Score span");
  const restart_round = document.querySelector(".restart");
  const time_clock = document.querySelector(".time_clock span");
  const celebration = document.querySelector(".EachRound");
  const quizend = document.querySelector(".finallayout");
  const progressBar = document.querySelector(".progress-bar");

  let questions = [];
  let remainingquestions = [];
  let currentquestion;
  let round1Questions = [];
  let round2Questions = [];
  let round3Questions = [];
  let answered = false;
  let round = 1;
  let score = 0;
  let roundstartscore = 0;
  let sec;
  let secleft = 30;
  let completedQuestions = 0;
  let questionN = 1;
  let difficulty_fetch;
  let difficulty_fetch_points;
  let correctanswer;
  let selectedbutton = null; // FIX

  Score.innerText = score;
  rounddata.innerText = `Round ${round}/3`;
  que_out_5.innerText = questionN;

  // Fetch API
  const requestUrl = "https://dummyjson.com/c/ed50-cf21-4afe-a48c";

  fetch(requestUrl)
    .then((response) => response.json())
    .then((data) => {
      questions = data.quiz.questions;
      round1Questions = [...questions.splice(0, 5)];
      round2Questions = [...questions.splice(0, 5)];
      round3Questions = [...questions.splice(0, 5)];
      remainingquestions = [...round1Questions];
      randomquestion();
    });

  function startnextround() {
    round++;
    roundstartscore = score;
    rounddata.innerText = `Round ${round}/3`;
    questionN = 1;
    if (round == 2) {
      remainingquestions = [...round2Questions];
      console.log(remainingquestions);
    } else if (round == 3) {
      remainingquestions = [...round3Questions];
      console.log(remainingquestions);
    } else {
      finalimg();
      return;
    }
    randomquestion();
  }

  // Reset option colors
  function resetOptions() {
    option_menu.forEach((button) => {
      button.style.backgroundColor = "";
      button.style.color = "";
    });
  }

  // Random question
  function randomquestion() {
    selectedbutton = null;
    answered = false;
    resetOptions();
    if (remainingquestions.length === 0) {
      if (round < 3) {
        wellDone();
      } else {
        finalimg();
      }
      return;
    }

    const index = Math.floor(Math.random() * remainingquestions.length);
    currentquestion = remainingquestions[index];
    remainingquestions.splice(index, 1);

    question.innerText = currentquestion.question;
    que_out_5.innerText = questionN;

    option_menu.forEach((button, index) => {
      button.innerText = currentquestion.options[index];
    });

    correctanswer = currentquestion.correctAnswer;
    difficulty_fetch = currentquestion.difficulty;
    difficulty_fetch_points = currentquestion.points;
    diff_line.innerText = `${difficulty_fetch} (${difficulty_fetch_points})`;

    clock();
  }

  function goToNextQuestion() {
    completedQuestions++;
    updateProgress();
    questionN++;
    randomquestion();
  }

  option_menu.forEach((button) => {
    button.addEventListener("click", function () {
      selectedbutton = button;
    });
  });

  submit.addEventListener("click", function () {
    if (answered == true) {
      return;
    }

    // Nothing selected
    if (selectedbutton === null) {
      return;
    }

    answered = true;
    clearInterval(sec);

    if (selectedbutton.innerText === correctanswer) {
      selectedbutton.style.backgroundColor = "#EEFDF5";
      selectedbutton.style.color = "green";
      score += difficulty_fetch_points;

      Score.innerText = score;
    } else {
      selectedbutton.style.backgroundColor = "#FDF2F2";
      selectedbutton.style.color = "red";
    }

    setTimeout(() => {
      goToNextQuestion();
    }, 1000);
  });

  restart_round.addEventListener("click", function () {
    restart_btn();
  });

  function restart_btn() {
    score = roundstartscore;
    Score.innerText = score;
    if (round === 1) {
      remainingquestions = [...round1Questions];
      completedQuestions = 0;
    } else if (round === 2) {
      remainingquestions = [...round2Questions];
      completedQuestions = 5;
    } else if (round === 3) {
      remainingquestions = [...round3Questions];
      completedQuestions = 10;
    }

    questionN = 1;
    answered = false;
    selectedbutton = null;

    resetOptions();
    updateProgress();
    randomquestion();
  }

  function wellDone() {
    layout2.style.display = "none";
    celebration.style.display = "block";
    setTimeout(() => {
      celebration.style.display = "none";
      layout2.style.display = "block";
      startnextround();
    }, 2000);
  }

  function clock() {
    clearInterval(sec);
    secleft = 30;
    time_clock.innerText = `00:${String(secleft).padStart(2, "0")}`;
    sec = setInterval(() => {
      secleft--;
      time_clock.innerText = `00:${String(secleft).padStart(2, "0")}`;
      if (secleft === 0) {
        clearInterval(sec);
        if (!answered) {
          answered = true;
          goToNextQuestion();
        }
      }
    }, 1000);
  }

  function finalimg() {
    quizend.style.display = "block";
    layout2.style.display = "none";
    celebration.style.display = "none";
  }
  function updateProgress() {
    const progress = (completedQuestions / 15) * 100;

    progressBar.style.width = `${progress}%`;
  }
}
