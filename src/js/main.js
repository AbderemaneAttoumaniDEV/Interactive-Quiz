document.addEventListener('DOMContentLoaded', () => {
    // Déclaration des éléments HTML utilisés dans le script
    const startBtn = document.getElementById('start-btn');             // Bouton pour démarrer le quiz
    const categorySelect = document.getElementById('category-select'); // Sélecteur de catégorie
    const answersContainer = document.getElementById('answers');       // Conteneur des réponses
    const questionElement = document.getElementById('question');       // Élément pour afficher la question
    const quizContainer = document.getElementById('quiz-container');   // Conteneur du quiz
    const resultContainer = document.getElementById('result-container'); // Conteneur des résultats
    const finalScoreElement = document.getElementById('final-score');  // Élément pour afficher le score final
    const resultList = document.getElementById('result-list');         // Liste des résultats individuels

    let currentQuestionIndex = 0;  // Index de la question en cours
    let score = 0;                 // Score initial de l'utilisateur
    let questions = [];           // Tableau pour stocker les questions récupérées
    let userAnswers = [];         // Tableau pour stocker les réponses de l'utilisateur

    // Événement déclenché lorsque l'utilisateur clique sur le bouton "Démarrer le Quiz"
    startBtn.addEventListener('click', () => {
        const category = categorySelect.value; // Récupérer la catégorie sélectionnée
        fetchQuestions(category); // Récupérer les questions en fonction de la catégorie
        quizContainer.classList.remove('hidden'); // Afficher le quiz
        document.querySelector('body').scrollIntoView(); // Scroller vers le début du quiz
        resultContainer.classList.add('hidden'); // Masquer les résultats au début
    });

    // Fonction pour récupérer les questions de l'API (backend)
    function fetchQuestions(category) {
        fetch(`backend/main.php?category=${category}`)  // Envoi de la requête pour récupérer les questions
            .then(response => response.json())  // Conversion de la réponse en JSON
            .then(data => {
                if (data.error) {
                    alert(data.error); // Afficher un message d'erreur si les questions ne sont pas récupérées
                    return;
                }
                questions = data;  // Stocker les questions récupérées
                currentQuestionIndex = 0;  // Réinitialiser l'index de la question
                score = 0;  // Réinitialiser le score
                userAnswers = [];  // Réinitialiser les réponses de l'utilisateur
                shuffleQuestions();  // Mélanger les questions pour que l'ordre soit aléatoire
                displayQuestion();  // Afficher la première question
            });
    }

    // Fonction pour mélanger les questions aléatoirement
    function shuffleQuestions() {
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Générer un index aléatoire
            [questions[i], questions[j]] = [questions[j], questions[i]]; // Échanger les questions
        }
    }

    // Fonction pour afficher une question à la fois
    function displayQuestion() {
        if (questions.length === 0) return; // Vérifier si les questions sont vides
        const question = questions[currentQuestionIndex];  // Récupérer la question en cours
        questionElement.innerText = question.question; // Afficher la question

        answersContainer.innerHTML = ''; // Vider les réponses précédentes
        // Créer des boutons pour chaque réponse possible
        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.innerText = answer;
            button.classList.add('w-full', 'py-3', 'bg-gray-200', 'rounded-lg', 'transition-transform', 'hover:bg-blue-100', 'focus:outline-none', 'text-lg');
            button.onclick = () => handleAnswerClick(index, question.correctAnswer); // Attacher un événement à chaque bouton
            answersContainer.appendChild(button); // Ajouter le bouton dans le conteneur des réponses
        });
    }

    // Fonction appelée lorsqu'une réponse est sélectionnée
    function handleAnswerClick(index, correctAnswer) {
        // Sauvegarder la réponse de l'utilisateur
        userAnswers.push({ question: questions[currentQuestionIndex], userAnswer: index, correctAnswer });
        if (index === correctAnswer) {
            score++; // Augmenter le score si la réponse est correcte
        }
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++; // Passer à la question suivante
            displayQuestion();  // Afficher la nouvelle question
        } else {
            showScore();  // Si toutes les questions sont répondues, afficher le score
        }
    }

    // Fonction pour afficher le score final et les résultats détaillés
    function showScore() {
        quizContainer.classList.add('hidden'); // Masquer le quiz
        resultContainer.classList.remove('hidden'); // Afficher les résultats
        finalScoreElement.innerText = `Ton score : ${score} / ${questions.length}`; // Afficher le score

        resultList.innerHTML = ''; // Vider la liste des résultats
        // Afficher les détails de chaque réponse
        userAnswers.forEach(answerData => {
            const question = answerData.question; // Récupérer la question
            const userAnswer = question.answers[answerData.userAnswer]; // Récupérer la réponse de l'utilisateur
            const correctAnswer = question.answers[answerData.correctAnswer]; // Récupérer la bonne réponse
            const resultClass = answerData.userAnswer === answerData.correctAnswer ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'; // Définir la classe de résultat (vert ou rouge)

            resultList.innerHTML += `
                <li class="py-3 px-4 rounded-lg ${resultClass}">
                    <div class="result-questions font-semibold">${question.question}</div> <!-- Afficher la question -->
                    <div class="result-answers mt-2">Vous avez répondu : <span class="font-bold">${userAnswer}</span></div> <!-- Afficher la réponse donnée -->
                    ${answerData.userAnswer !== answerData.correctAnswer ? `<div class="result-answers text-green-600">Bonne réponse : ${correctAnswer}</div>` : ''} <!-- Afficher la bonne réponse si nécessaire -->
                </li>
            `;
        });
    }
});
