let web3;
let gameToken;
const contractAddress = '0x52AB3fBa85e3B16Fd7660D6959960A0280d9C5aF';
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_spender","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_player","type":"address"},{"internalType":"uint256","name":"_score","type":"uint256"}],"name":"rewardPlayer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];

window.onload = async function() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
    } else {
        alert('Please install MetaMask!');
    }
    gameToken = new web3.eth.Contract(contractABI, contractAddress);
    initGame();
};

async function connectWallet() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
}

async function submitScore() {
    const accounts = await web3.eth.getAccounts();
    const score = getScoreFromGame();
    await gameToken.methods.rewardPlayer(accounts[0], score).send({ from: accounts[0] });
    alert('Score submitted and reward received!');
}

function getScoreFromGame() {
    return score;
}

// Snake Game Code
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;
const width = canvas.width;
const height = canvas.height;
let score = 0;
let snake = [{ x: 100, y: 100 }];
let dx = gridSize;
let dy = 0;
let food = { x: 200, y: 200, size: gridSize };

function initGame() {
    document.addEventListener("keydown", changeDirection);
    setInterval(gameLoop, 100);
}

function gameLoop() {
    moveSnake();
    checkFoodCollision();
    clearCanvas();
    drawSnake();
    drawFood();
    updateScore();
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        food.x = Math.floor(Math.random() * (width / gridSize)) * gridSize;
        food.y = Math.floor(Math.random() * (height / gridSize)) * gridSize;
    } else {
        snake.pop();
    }

    if (head.x >= width) head.x = 0;
    if (head.y >= height) head.y = 0;
    if (head.x < 0) head.x = width - gridSize;
    if (head.y < 0) head.y = height - gridSize;

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function changeDirection(event) {
    switch (event.keyCode) {
        case 37: // left
            if (dx === 0) {
                dx = -gridSize;
                dy = 0;
            }
            break;
        case 38: // up
            if (dy === 0) {
                dx = 0;
                dy = -gridSize;
            }
            break;
        case 39: // right
            if (dx === 0) {
                dx = gridSize;
                dy = 0;
            }
            break;
        case 40: // down
            if (dy === 0) {
                dx = 0;
                dy = gridSize;
            }
            break;
    }
}

function checkFoodCollision() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score += 10;
        food.x = Math.floor(Math.random() * (width / gridSize)) * gridSize;
        food.y = Math.floor(Math.random() * (height / gridSize)) * gridSize;
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, width, height);
}

function drawSnake() {
    ctx.fillStyle = "yellow";
    snake.forEach(part => ctx.fillRect(part.x, part.y, gridSize, gridSize));
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, food.size, food.size);
}

function updateScore() {
    document.getElementById("score").innerText = `Score: ${score}`;
}

function resetGame() {
    score = 0;
    snake = [{ x: 100, y: 100 }];
    dx = gridSize;
    dy = 0;
}
