<?php
// backend/main.php
header('Content-Type: application/json');

// Chemin vers le fichier JSON contenant les questions
$questionsFile = '../data/questions.json';

// Vérification de l'existence du fichier
if (!file_exists($questionsFile)) {
    echo json_encode(['error' => 'Questions file not found']);
    exit;
}

// Récupérer le thème choisi par l'utilisateur (par exemple: maths, geographie, histoire)
$category = isset($_GET['category']) ? $_GET['category'] : 'maths';

// Lire le fichier JSON
$questionsData = file_get_contents($questionsFile);
$questions = json_decode($questionsData, true);

// Vérifier si la catégorie existe dans le fichier
if (!isset($questions[$category])) {
    echo json_encode(['error' => 'Catégorie non trouvée']);
    exit;
}

// Mélanger les questions aléatoirement
shuffle($questions[$category]);

// Retourner les questions pour la catégorie choisie
echo json_encode(array_slice($questions[$category], 0, 15));  // Limite à 15 questions
