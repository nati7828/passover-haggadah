document.addEventListener('DOMContentLoaded', () => {
  const questions = [
    {
      question: 'כמה כוסות יין שותים בליל הסדר?',
      answers: [
        { text: '2', correct: false },
        { text: '4', correct: true },
        { text: '6', correct: false },
      ],
    },
    {
      question: 'מהו המאכל המסורתי של פסח?',
      answers: [
        { text: 'לחם', correct: false },
        { text: 'מצה', correct: true },
        { text: 'פיתה', correct: false },
      ],
    },
    {
      question: 'איזה מאכל מסמל את עבודת הפרך במצרים?',
      answers: [
        { text: 'מרור', correct: false },
        { text: 'חרוסת', correct: true },
        { text: 'כרפס', correct: false },
      ],
    },
    {
      question: 'מי היה המנהיג שהוציא את בני ישראל ממצרים?',
      answers: [
        { text: 'משה', correct: true },
        { text: 'אהרון', correct: false },
        { text: 'יהושע', correct: false },
      ],
    },
    {
      question: 'מה מבין הבאים אינו חמץ?',
      answers: [
        { text: 'לחמניה', correct: false },
        { text: 'עוגת תפוחים', correct: false },
        { text: 'תפוח אדמה', correct: true },
      ],
    },
    {
      question: 'מה המכה הראשונה שהביא משה על מצרים?',
      answers: [
        { text: 'צפרדע', correct: false },
        { text: 'דם', correct: true },
        { text: 'כינים', correct: false },
      ],
    },
    {
      question: 'כמה ימים חוגגים את חג הפסח בארץ ישראל?',
      answers: [
        { text: '7 ימים', correct: true },
        { text: '8 ימים', correct: false },
        { text: '6 ימים', correct: false },
      ],
    },
    {
      question: "מה פירוש המילה 'אפיקומן'?",
      answers: [
        { text: 'מנה ראשונה', correct: false },
        { text: 'מנה אחרונה', correct: true },
        { text: 'מנה עיקרית', correct: false },
      ],
    },
    {
      question: 'מדוע אוכלים מרור בפסח?',
      answers: [
        { text: 'זכר לעבדות במצרים', correct: true },
        { text: 'כי זה טעים', correct: false },
        { text: 'כי זה בריא', correct: false },
      ],
    },
    {
      question: 'מהי הקערה המיוחדת המשמשת בליל הסדר?',
      answers: [
        { text: 'קערת כסף', correct: false },
        { text: 'קערת פסח', correct: true },
        { text: 'קערת זהב', correct: false },
      ],
    },
  ];

  const questionElement = document.getElementById('question');
  const answersContainer = document.getElementById('answers');
  const nextButton = document.getElementById('next-btn');
  const scoreElement = document.getElementById('score');
  const timerElement = document.getElementById('timer');
  const shareButton = document.getElementById('share-btn');
  const refreshButton = document.getElementById('refresh-btn');

  let currentQuestionIndex = 0;
  let score = 0;
  let timer;
  let timeLeft = 10;
  let questionsAnswered = 0;
  let usedQuestions = new Set();

  function showQuestion() {
    if (questionsAnswered >= 10) {
      showVictoryMessage();
      return;
    }

    resetState();
    startTimer();

    let availableQuestions = questions.filter(
      (_, index) => !usedQuestions.has(index)
    );
    if (availableQuestions.length === 0) {
      showVictoryMessage();
      return;
    }

    let randomIndex = Math.floor(Math.random() * availableQuestions.length);
    let questionIndex = questions.indexOf(availableQuestions[randomIndex]);

    usedQuestions.add(questionIndex);
    currentQuestionIndex = questionIndex;

    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;

    currentQuestion.answers.forEach((answer) => {
      const button = document.createElement('button');
      button.textContent = answer.text;
      button.classList.add('answer-btn');
      if (answer.correct) {
        button.dataset.correct = answer.correct;
      }
      button.addEventListener('click', selectAnswer);
      answersContainer.appendChild(button);
    });

    nextButton.style.display = 'none';
  }

  function resetState() {
    nextButton.style.display = 'none';
    shareButton.style.display = 'none';
    clearInterval(timer);
    timeLeft = 10;
    timerElement.textContent = timeLeft;

    while (answersContainer.firstChild) {
      answersContainer.removeChild(answersContainer.firstChild);
    }
  }

  function selectAnswer(e) {
    clearInterval(timer);
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';

    if (correct) {
      selectedButton.classList.add('correct');
      score++;
      scoreElement.textContent = `ניקוד: ${score}`;
    } else {
      selectedButton.classList.add('wrong');
      showCorrectAnswer();
    }

    Array.from(answersContainer.children).forEach((button) => {
      button.disabled = true;
    });

    questionsAnswered++;

    if (questionsAnswered >= 10) {
      setTimeout(showVictoryMessage, 1000);
    } else {
      nextButton.style.display = 'inline-block';
    }
  }

  function showCorrectAnswer() {
    Array.from(answersContainer.children).forEach((button) => {
      if (button.dataset.correct === 'true') {
        button.classList.add('correct');
      }
    });
  }

  function startTimer() {
    clearInterval(timer);
    timeLeft = 10;
    timerElement.textContent = timeLeft;

    timer = setInterval(() => {
      timeLeft--;
      timerElement.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timer);
        Array.from(answersContainer.children).forEach((button) => {
          button.disabled = true;
        });
        showCorrectAnswer();
        questionsAnswered++;

        if (questionsAnswered >= 10) {
          setTimeout(showVictoryMessage, 1000);
        } else {
          nextButton.style.display = 'inline-block';
        }
      }
    }, 1000);
  }

  function showVictoryMessage() {
    resetState();
    questionElement.textContent = 'המשחק הסתיים!';
    const finalMessage = document.createElement('p');
    finalMessage.textContent = `הציון הסופי שלך: ${score} מתוך 10 שאלות`;
    finalMessage.style.fontSize = '1.2rem';
    finalMessage.style.marginTop = '20px';
    finalMessage.style.fontWeight = 'bold';
    answersContainer.appendChild(finalMessage);

    shareButton.style.display = 'inline-block';
    nextButton.style.display = 'none';
    document.getElementById('timer-container').style.display = 'none';
  }

  function resetGame() {
    score = 0;
    questionsAnswered = 0;
    usedQuestions.clear();
    scoreElement.textContent = `ניקוד: ${score}`;
    document.getElementById('timer-container').style.display = 'block';
    showQuestion();
  }

  nextButton.addEventListener('click', () => {
    showQuestion();
  });

  refreshButton.addEventListener('click', resetGame);

  shareButton.addEventListener('click', () => {
    const shareText = `שיחקתי ב"פסח קוויז: האתגר הגדול!" וקיבלתי ציון של ${score} מתוך 10 שאלות. נסו גם אתם!`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}`;
    window.open(shareUrl, '_blank');
  });

  showQuestion();
});
