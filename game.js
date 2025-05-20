// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 400;
canvas.height = 400;

// Game settings
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let speed = 5;

// Initialize speed display
document.getElementById('speedValue').textContent = speed;

// Game state
let gameStarted = false;
let gameState = 'resume'; // 'pause' or 'resume'
let gameLoopId = null;

// Snake initial position and velocity
let snake = [
    { x: 10, y: 10 }
];
let velocityX = 0;
let velocityY = 0;

// Food position
let foodX = 5;
let foodY = 5;

// Score
let score = 0;

// Game loop
function gameLoop() {
    if (!gameStarted || gameState === 'pause') return;
    
    updateSnake();
    if (checkGameOver()) {
        alert('Game Over! Score: ' + score);
        resetGame();
        return;
    }
    clearCanvas();
    drawFood();
    drawSnake();
    gameLoopId = setTimeout(gameLoop, 1000 / speed);
}

// Start game
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        gameState = 'resume';
        document.getElementById('startButton').style.display = 'none';
        gameLoop();
    }
}

// Handle pause state
function gamePause() {
    if (!gameStarted) return;
    
    gameState = 'pause';
    clearTimeout(gameLoopId);
    document.getElementById('pauseMessage').style.display = 'block';
}

// Handle resume state
function gameResume() {
    if (!gameStarted) return;
    
    gameState = 'resume';
    document.getElementById('pauseMessage').style.display = 'none';
    gameLoop();
}

// Toggle pause/resume
function togglePause() {
    if (!gameStarted) return;
    
    if (gameState === 'pause') {
        gameResume();
    } else {
        gamePause();
    }
}

// Update snake position
function updateSnake() {
    // Calculate new head position
    const head = { x: snake[0].x + velocityX, y: snake[0].y + velocityY };
    snake.unshift(head);
    
    // Remove tail if no food was eaten
    if (head.x === foodX && head.y === foodY) {
        score += 10;
        document.getElementById('scoreValue').textContent = score;
        generateFood();
        // Increase speed every 50 points
        if (score % 50 === 0) {
            speed += 1;
            document.getElementById('speedValue').textContent = speed;
        }
    } else {
        snake.pop();
    }
}

// Draw snake
function drawSnake() {
    ctx.fillStyle = '#4CAF50';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

// Draw food
function drawFood() {
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize - 2, gridSize - 2);
}

// Generate new food position
function generateFood() {
    foodX = Math.floor(Math.random() * tileCount);
    foodY = Math.floor(Math.random() * tileCount);
    
    // Make sure food doesn't spawn on snake
    snake.forEach(segment => {
        if (segment.x === foodX && segment.y === foodY) {
            generateFood();
        }
    });
}

// Clear canvas
function clearCanvas() {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Check for collisions
function checkGameOver() {
    // Wall collision
    if (snake[0].x < 0 || snake[0].x >= tileCount || 
        snake[0].y < 0 || snake[0].y >= tileCount) {
        return true;
    }
    
    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    
    return false;
}

// Reset game
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    velocityX = 0;
    velocityY = 0;
    score = 0;
    speed = 5;  // Reset speed to initial value
    gameStarted = false;
    gameState = 'resume';
    document.getElementById('scoreValue').textContent = score;
    document.getElementById('speedValue').textContent = speed;  // Update speed display
    document.getElementById('startButton').style.display = 'block';
    document.getElementById('pauseMessage').style.display = 'none';
    generateFood();
    clearCanvas();
    drawFood();
    drawSnake();
}

// Handle keyboard controls
document.addEventListener('keydown', (event) => {
    // Always allow P key for pause/resume
    if (event.key === 'p' || event.key === 'P') {
        togglePause();
        return;
    }
    
    // For other controls, check if game is started and not paused
    if (!gameStarted || gameState === 'pause') return;
    
    switch (event.key) {
        case 'ArrowUp':
            if (velocityY !== 1) {
                velocityX = 0;
                velocityY = -1;
            }
            break;
        case 'ArrowDown':
            if (velocityY !== -1) {
                velocityX = 0;
                velocityY = 1;
            }
            break;
        case 'ArrowLeft':
            if (velocityX !== 1) {
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case 'ArrowRight':
            if (velocityX !== -1) {
                velocityX = 1;
                velocityY = 0;
            }
            break;
    }
});

// Add start button event listener
document.getElementById('startButton').addEventListener('click', startGame);

// Initialize game
generateFood();
clearCanvas();
drawFood();
drawSnake(); 