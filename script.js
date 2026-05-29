// Get canvas and context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 400;

// Game objects
const paddle = {
    width: 10,
    height: 60,
    speed: 6,
    x: 10,
    y: canvas.height / 2 - 30
};

const computerPaddle = {
    width: 10,
    height: 60,
    speed: 4,
    x: canvas.width - 20,
    y: canvas.height / 2 - 30
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 5,
    speedX: 5,
    speedY: 5,
    maxSpeed: 8
};

let playerScore = 0;
let computerScore = 0;
const winScore = 10;

// Input handling
const keys = {};
let mouseY = canvas.height / 2;

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Update player paddle
function updatePlayerPaddle() {
    // Use mouse Y or arrow keys
    if (keys['ArrowUp']) {
        paddle.y -= paddle.speed;
    }
    if (keys['ArrowDown']) {
        paddle.y += paddle.speed;
    }

    // Also allow mouse control
    paddle.y = Math.min(mouseY - paddle.height / 2, canvas.height - paddle.height);

    // Keep paddle in bounds
    if (paddle.y < 0) {
        paddle.y = 0;
    }
    if (paddle.y + paddle.height > canvas.height) {
        paddle.y = canvas.height - paddle.height;
    }
}

// Update computer paddle (AI)
function updateComputerPaddle() {
    const computerCenter = computerPaddle.y + computerPaddle.height / 2;
    const ballCenter = ball.y;
    const difference = ballCenter - computerCenter;

    // Simple AI: follow the ball with some smoothing
    if (difference > 15) {
        computerPaddle.y += computerPaddle.speed;
    } else if (difference < -15) {
        computerPaddle.y -= computerPaddle.speed;
    }

    // Keep paddle in bounds
    if (computerPaddle.y < 0) {
        computerPaddle.y = 0;
    }
    if (computerPaddle.y + computerPaddle.height > canvas.height) {
        computerPaddle.y = canvas.height - computerPaddle.height;
    }
}

// Update ball
function updateBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Collision with top and bottom walls
    if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.speedY = -ball.speedY;
    }
    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.speedY = -ball.speedY;
    }

    // Collision with paddles
    // Player paddle
    if (
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.y > paddle.y &&
        ball.y < paddle.y + paddle.height &&
        ball.speedX < 0
    ) {
        ball.speedX = -ball.speedX;
        ball.x = paddle.x + paddle.width + ball.radius;

        // Add spin based on where the ball hits the paddle
        const hitPos = (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
        ball.speedY = hitPos * ball.maxSpeed;
    }

    // Computer paddle
    if (
        ball.x + ball.radius > computerPaddle.x &&
        ball.y > computerPaddle.y &&
        ball.y < computerPaddle.y + computerPaddle.height &&
        ball.speedX > 0
    ) {
        ball.speedX = -ball.speedX;
        ball.x = computerPaddle.x - ball.radius;

        // Add spin based on where the ball hits the paddle
        const hitPos = (ball.y - (computerPaddle.y + computerPaddle.height / 2)) / (computerPaddle.height / 2);
        ball.speedY = hitPos * ball.maxSpeed;
    }

    // Score points
    if (ball.x - ball.radius < 0) {
        computerScore++;
        resetBall();
    }
    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Update scoreboard
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.speedY = (Math.random() - 0.5) * 5;
}

// Draw functions
function drawPaddle(paddleObj) {
    ctx.fillStyle = '#00ff41';
    ctx.fillRect(paddleObj.x, paddleObj.y, paddleObj.width, paddleObj.height);
    ctx.shadowColor = 'rgba(0, 255, 65, 0.8)';
    ctx.shadowBlur = 10;
}

function drawBall() {
    ctx.fillStyle = '#00ff41';
    ctx.shadowColor = 'rgba(0, 255, 65, 0.8)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawCenterLine() {
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    drawCenterLine();

    // Draw paddles and ball
    drawPaddle(paddle);
    drawPaddle(computerPaddle);
    drawBall();

    ctx.shadowBlur = 0;
}

// Game loop
function gameLoop() {
    updatePlayerPaddle();
    updateComputerPaddle();
    updateBall();
    draw();

    if (playerScore < winScore && computerScore < winScore) {
        requestAnimationFrame(gameLoop);
    } else {
        // Game over
        const winner = playerScore >= winScore ? 'Player' : 'Computer';
        setTimeout(() => {
            alert(`Game Over! ${winner} wins! Final Score: ${playerScore} - ${computerScore}`);
            resetGame();
        }, 100);
    }
}

// Reset game
function resetGame() {
    playerScore = 0;
    computerScore = 0;
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
    resetBall();
    gameLoop();
}

// Start the game
gameLoop();