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
// click the stat button
start_btn.addEventListener("click", function () {
  if (quizStarted) {
    return;
  }
  quizStarted = true;
  layout1.style.display = "none";
  layout2.style.display = "flex";
  startquiz();
});
// after clicking the start button
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
  const tap_btn = document.querySelector(".for_next_rount_btn");
  const scorefinal = document.querySelector(".scorefinal");
  let rightanswerfinal = document.querySelector(".rightanswer");
  let incorrectanswerfinal = document.querySelector(".incorrectanswer");
  let unansweredfinal = document.querySelector(".unanswered");

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
  let rightanswer = 0;
  let incorrectanswer = 0;
  let unanswered = 0;

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
  // start the rounds
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
        rightanswerfinal.innerText = `Correct Answers: ${rightanswer}`;
        scorefinal.innerText = `Your total score: ${score} out of 4000`;
        incorrectanswerfinal.innerText = `Incorrect Answers: ${incorrectanswer}`;
        unansweredfinal.innerText = `Unanswered : ${unanswered}`;
        finalimg();
      }
      return;
    }

    const index = Math.floor(Math.random() * remainingquestions.length);
    currentquestion = remainingquestions[index];
    remainingquestions.splice(index, 1);

    question.innerText = currentquestion.question;
    que_out_5.innerText = questionN;

    const shuffledOptions = shuffleOptions(currentquestion.options);
    option_menu.forEach((button, index) => {
      button.innerText = shuffledOptions[index];
    });

    correctanswer = currentquestion.correctAnswer;
    difficulty_fetch = currentquestion.difficulty;
    difficulty_fetch_points = currentquestion.points;
    diff_line.innerText = `${difficulty_fetch} (${difficulty_fetch_points})`;

    clock();
  }
  // suffleOptions
  function shuffleOptions(options) {
    const shuffled = [...options];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  // gotonextquestion
  function goToNextQuestion() {
    completedQuestions++;
    updateProgress();
    questionN++;
    randomquestion();
  }
  // option menu btn clicklistener
  option_menu.forEach((button) => {
    button.addEventListener("click", function () {
      selectedbutton = button;
    });
  });
  // click one button of options
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
      rightanswer++;

      Score.innerText = score;
    } else {
      selectedbutton.style.backgroundColor = "#FDF2F2";
      selectedbutton.style.color = "red";
      incorrectanswer++;
    }

    setTimeout(() => {
      goToNextQuestion();
    }, 1000);
  });
  // restart btn
  restart_round.addEventListener("click", function () {
    restart_btn();
  });
  // restart the round when click on restart btn
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
  // well done stage after every round
  function wellDone() {
    layout2.style.display = "none";
    celebration.style.display = "block";
  }
  tap_btn.addEventListener("click", function () {
    celebration.style.display = "none";
    layout2.style.display = "flex";
    startnextround();
  });
  // clock
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
          unanswered++;
          goToNextQuestion();
        }
      }
    }, 1000);
  }
  // finalimg
  function finalimg() {
    quizend.style.display = "block";
    layout2.style.display = "none";
    celebration.style.display = "none";
  }
  // progress updates
  function updateProgress() {
    const progress = (completedQuestions / 15) * 100;

    progressBar.style.width = `${progress}%`;
  }
}
