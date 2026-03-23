const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Taille d'un "bloc" du serpent et de la grille
const tileSize = 20;

// Le serpent est un tableau de coordonnées
let snake = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 }
];

// Vitesse de déplacement initiale (vers la droite)
let dx = tileSize;
let dy = 0;

// Position de la nourriture
let foodX;
let foodY;

let score = 0;
let changingDirection = false;

// Initialisation du jeu
generateFood();
main();

// Écouteur d'événements pour le clavier
document.addEventListener("keydown", changeDirection);

function main() {
    if (hasGameEnded()) {
        alert("Game Over! Votre score final est de : " + score + "\nRechargez la page pour rejouer.");
        document.getElementById('score').innerHTML = score;
        snake = [
            { x: 200, y: 200 },
            { x: 180, y: 200 },
            { x: 160, y: 200 }
        ];
        dx = tileSize;
        dy = 0;
        score = 0;
        document.getElementById('score').innerHTML = score;
        main();
        return;
    }

    changingDirection = false;

    // Boucle de jeu (Vitesse de rafraîchissement)
    setTimeout(function () {
        clearCanvas();
        drawFood(); // C'est cette fonction qui manquait !
        advanceSnake();
        drawSnake();
        main();
    }, 100); // 100 millisecondes = vitesse du jeu
}

function clearCanvas() {
    ctx.fillStyle = "#ecf0f1";
    ctx.strokeStyle = "#bdc3c7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

// --- NOUVELLE FONCTION AJOUTÉE ---
function drawFood() {
    ctx.fillStyle = "#e74c3c"; // Couleur de la pomme (Rouge)
    ctx.strokeStyle = "#c0392b"; // Contour de la pomme
    ctx.fillRect(foodX, foodY, tileSize, tileSize);
    ctx.strokeRect(foodX, foodY, tileSize, tileSize);
}
// ---------------------------------

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = "#a38217"; // Couleur du serpent (Vert)
    ctx.strokeStyle = "#a38217"; // Contour du serpent
    ctx.fillRect(snakePart.x, snakePart.y, tileSize, tileSize);
    ctx.strokeRect(snakePart.x, snakePart.y, tileSize, tileSize);
}

function advanceSnake() {
    // Créer la nouvelle tête
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head); // Ajouter la tête au début du tableau

    const hasEatenFood = snake[0].x === foodX && snake[0].y === foodY;

    if (hasEatenFood) {
        score += 10;
        document.getElementById('score').innerHTML = score;
        generateFood();
    } else {
        snake.pop(); // Retirer la queue si on n'a pas mangé
    }
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    // Empêcher de faire demi-tour sur soi-même
    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -tileSize;
    const goingDown = dy === tileSize;
    const goingRight = dx === tileSize;
    const goingLeft = dx === -tileSize;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -tileSize;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -tileSize;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = tileSize;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = tileSize;
    }
}

function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / tileSize) * tileSize;
}

function generateFood() {
    foodX = randomTen(0, canvas.width - tileSize);
    foodY = randomTen(0, canvas.height - tileSize);

    // Vérifier que la nourriture n'apparaît pas sur le serpent
    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x == foodX && part.y == foodY;
        if (foodIsOnSnake) generateFood();
    });
}

function hasGameEnded() {
    // Collision avec soi-même
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    // Collision avec les murs
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}