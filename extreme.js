var blockSize = 25;
var rows = 21;
var cols = 40;
var board;
var context;

// Snake head
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

// Food
var foodX;
var foodY;

// Kill blocks
var numKillBlocks = 5; 


// Game status
var gameOver = false;

// Score
var score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");

    placeFood();
    placeKillBlocks();
    document.addEventListener("keyup", changeDirection);
    setInterval(update, 1000 / 10);

    // Initialize score display
    updateScore();

   

    // Restart game listener
    document.addEventListener("keydown", function(e) {
        if (e.code === "KeyR" && gameOver) {
            location.reload();
        }
    });
}

function update() {
    if (gameOver) {
        return;
    }

    // Clear the board
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    // Draw food
    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    // Draw kill blocks
    context.fillStyle = "orange";
    killBlocks.forEach(function(kill) {
        context.fillRect(kill[0], kill[1], blockSize, blockSize);
    });

    // Check for food collision
    if (snakeX == foodX && snakeY == foodY) {
        score++;
        snakeBody.push([foodX, foodY]);
        placeFood();
        placeKillBlocks("");
        updateScore();
    }

    // Move snake body
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    // Update snake position
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;

    // Draw snake
    context.fillStyle = "lime";
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    // Check for collisions
    if (snakeX < 0 || snakeX >= cols * blockSize || snakeY < 0 || snakeY >= rows * blockSize) {
        endGame("Player touched the void and died.");
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            endGame("Player died due to him biting himself.");
        }
    }

    killBlocks.forEach(function(kill) {
        if (snakeX == kill[0] && snakeY == kill[1]) {
            endGame("Player went into a pit of Lava.");
        }
    });

    // Display score
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText("Score: " + score, 10, 20);
}

function changeDirection(e) {
    if (e.code === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.code === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.code === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.code === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

function placeFood() {
    do {
        foodX = Math.floor(Math.random() * cols) * blockSize;
        foodY = Math.floor(Math.random() * rows) * blockSize;
    } while (isOnSnake(foodX, foodY));
}

function placeKillBlocks() {
    var numKillBlocks = 20;
    killBlocks = [];
    for (var i = 0; i < numKillBlocks; i++) {
        var killX, killY;
        do {
            killX = Math.floor(Math.random() * cols) * blockSize;
            killY = Math.floor(Math.random() * rows) * blockSize;
        } while (isOnSnake(killX, killY) || (killX === foodX && killY === foodY));
        killBlocks.push([killX, killY]);
    }
}

function isOnSnake(x, y) {
    if (x === snakeX && y === snakeY) return true;
    for (let i = 0; i < snakeBody.length; i++) {
        if (x === snakeBody[i][0] && y === snakeBody[i][1]) return true;
    }
    return false;
}

function endGame(message) {
    gameOver = true;
    alert(message + " Press R to Restart");
    document.removeEventListener("keyup", changeDirection);
}

function updateScore() {
    console.log("Score: " + score);
}
