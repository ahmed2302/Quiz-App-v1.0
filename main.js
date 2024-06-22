let spansCount = document.querySelector(".count span");
let BulletsCountainer = document.querySelector(".bullets");
let BulletsSpans = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answer-area");
let submitBtn = document.querySelector(".submit-btn");
let result = document.querySelector(".result");
let countDown = document.querySelector(".count-down");

let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

getQuestions();

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    // this even dose not work till the request send and the response return
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let questionsCount = questionsObject.length;
      createbullets(questionsCount);
      addData(questionsObject[currentIndex], questionsCount);
      timer(30, questionsCount);
      submitBtn.onclick = () => {
        let rightAnswer = questionsObject[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(rightAnswer);
        quizArea.innerHTML = "";
        answerArea.innerHTML = "";
        addData(questionsObject[currentIndex], questionsCount);
        handleBullets();
        clearInterval(countDownInterval);
        timer(30, questionsCount);
        showResult(questionsCount);
      };
    }
  };

  myRequest.open("GET", "./html_questions.json", true);
  myRequest.send();
}

function createbullets(num) {
  spansCount.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let bullet = document.createElement("span");
    if (i === 0) {
      bullet.classList.add("on");
    }
    BulletsSpans.appendChild(bullet);
  }
}

function addData(Object, count) {
  if (currentIndex < count) {
    let question = document.createElement("h2");
    let text = document.createTextNode(Object.title);
    question.appendChild(text);
    quizArea.appendChild(question);
    for (let i = 1; i <= 4; i++) {
      let answerNumber = `answer_${i}`;
      let answerDiv = document.createElement("div");
      answerDiv.classList.add("answer");
      let inputRadio = document.createElement("input");
      inputRadio.type = "radio";
      inputRadio.name = "questions";
      inputRadio.id = answerNumber;
      inputRadio.dataset.answer = Object[answerNumber];
      if (i === 1) inputRadio.checked = true;
      let label = document.createElement("label");
      label.htmlFor = answerNumber;
      label.appendChild(document.createTextNode(Object[answerNumber]));
      answerDiv.appendChild(inputRadio);
      answerDiv.appendChild(label);
      answerArea.appendChild(answerDiv);
    }
  }
}

function checkAnswer(rightAnswer) {
  let answers = document.getElementsByName("questions");
  let choseenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choseenAnswer = answers[i].dataset.answer;
    }
  }
  if (rightAnswer === choseenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletSpans = Array.from(
    document.querySelectorAll(".bullets .spans span")
  );
  bulletSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.classList.add("on");
    }
  });
}

function showResult(count) {
  if (currentIndex === count) {
    let theResult;
    quizArea.remove();
    answerArea.remove();
    submitBtn.remove();
    BulletsCountainer.remove();
    if (rightAnswers < count && rightAnswers > count / 2)
      theResult = `<span class="good">Good</span> You Got ${rightAnswers} of ${count}`;
    else if (rightAnswers == count)
      theResult = `<span class="prefect">Perfect</span> You Got ${rightAnswers} of ${count}`;
    else
      theResult = `<span class="bad">Bad</span> You Got ${rightAnswers} of ${count}`;
    result.innerHTML = theResult;
  }
}

function timer(duration, questionsCount) {
  if (currentIndex < questionsCount) {
    let minutes, seconds;
    countDownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countDown.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        // check the value and decrease it in the same time
        clearInterval(countDownInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}
