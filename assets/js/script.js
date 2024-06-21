document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-btn');
    const quizContainer = document.getElementById('quiz-container');
    const questionContainer = document.getElementById('question-container');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const endContainer = document.getElementById('end-container');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('time');
    const saveScoreForm = document.getElementById('save-score-form');
    const initialsInput = document.getElementById('initials');
    const highScoresList = document.getElementById('high-scores-list');
    
    let shuffledQuestions, currentQuestionIndex;
    let timeLeft, timerInterval;

    startButton.addEventListener('click', startQuiz);
    saveScoreForm.addEventListener('submit', saveScore);

    function startQuiz() {
        console.log('Start Quiz button clicked'); // Add this line
        startButton.classList.add('hide');
        quizContainer.classList.remove('hide');
        shuffledQuestions = questions.sort(() => Math.random() - 0.5);
        currentQuestionIndex = 0;
        timeLeft = 60;
        timerElement.textContent = timeLeft;
        timerInterval = setInterval(updateTimer, 1000);
        setNextQuestion();
    }

    function setNextQuestion() {
        resetState();
        showQuestion(shuffledQuestions[currentQuestionIndex]);
    }

    function showQuestion(question) {
        const questionElement = document.getElementById('question');
        questionElement.innerText = question.question;
        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('btn');
            if (answer.correct) {
                button.dataset.correct = answer.correct;
            }
            button.addEventListener('click', selectAnswer);
            answerButtonsElement.appendChild(button);
        });
    }

    function resetState() {
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
    }

    function selectAnswer(e) {
        const selectedButton = e.target;
        const correct = selectedButton.dataset.correct;
        if (!correct) {
            timeLeft -= 10;
            if (timeLeft < 0) {
                timeLeft = 0;
            }
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < shuffledQuestions.length && timeLeft > 0) {
            setNextQuestion();
        } else {
            endQuiz();
        }
    }

    function updateTimer() {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            endQuiz();
        }
    }

    function endQuiz() {
        clearInterval(timerInterval);
        quizContainer.classList.add('hide');
        endContainer.classList.remove('hide');
        scoreElement.textContent = timeLeft;
        displayHighScores();
    }

    function saveScore(e) {
        e.preventDefault();
        const initials = initialsInput.value;
        if (!initials) return;
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        const newScore = {
            score: timeLeft,
            initials: initials
        };
        highScores.push(newScore);
        highScores.sort((a, b) => b.score - a.score);
        localStorage.setItem('highScores', JSON.stringify(highScores));
        displayHighScores();
    }

    function displayHighScores() {
        highScoresList.innerHTML = '';
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScores.forEach(score => {
            const li = document.createElement('li');
            li.textContent = `${score.initials} - ${score.score}`;
            highScoresList.appendChild(li);
        });
    }

    const questions = [
        {
            question: 'What is the correct syntax for referring to an external script called "xxx.js"?',
            answers: [
                { text: '<script name="xxx.js">', correct: false },
                { text: '<script src="xxx.js">', correct: true },
                { text: '<script href="xxx.js">', correct: false },
                { text: '<script file="xxx.js">', correct: false }
            ]
        },
        {
            question: 'How do you write "Hello World" in an alert box?',
            answers: [
                { text: 'msg("Hello World");', correct: false },
                { text: 'alertBox("Hello World");', correct: false },
                { text: 'alert("Hello World");', correct: true },
                { text: 'msgBox("Hello World");', correct: false }
            ]
        },
        {
            question: 'How do you create a function in JavaScript?',
            answers: [
                { text: 'function = myFunction()', correct: false },
                { text: 'function myFunction()', correct: true },
                { text: 'function:myFunction()', correct: false },
                { text: 'function => myFunction()', correct: false }
            ]
        },
        {
            question: 'How to write an IF statement in JavaScript?',
            answers: [
                { text: 'if i == 5 then', correct: false },
                { text: 'if i = 5 then', correct: false },
                { text: 'if (i == 5)', correct: true },
                { text: 'if (i = 5)', correct: false }
            ]
        }
    ];
});