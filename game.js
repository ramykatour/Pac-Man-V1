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
    return score; // Placeholder for actual game score
}

// Pac-Man Game Code
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;
const width = canvas.width;
const height = canvas.height;
let score = 0;
let pacMan = { x: 0, y: 0, dx: gridSize, dy: 0, size: gridSize };
let food = { x: 100, y: 100, size: gridSize };

function initGame() {
    document.addEventListener("keydown", changeDirection);
    setInterval(gameLoop, 100);
}

function gameLoop() {
    movePacMan();
    checkFoodCollision();
    clearCanvas();
    drawPacMan();
    drawFood();
    updateScore();
}

function movePacMan() {
    pacMan.x += pacMan.dx;
    pacMan.y += pacMan.dy;

    if (pacMan.x >= width) pacMan.x = 0;
    if (pacMan.y >= height) pacMan.y = 0;
    if (pacMan.x < 0) pacMan.x = width - gridSize;
    if (pacMan.y < 0) pacMan.y = height - gridSize;
}

function changeDirection(event) {
    switch (event.keyCode) {
        case 37: // left
            pacMan.dx = -gridSize;
            pacMan.dy = 0;
            break;
        case 38: // up
            pacMan.dx = 0;
            pacMan.dy = -gridSize;
            break;
        case 39: // right
            pacMan.dx = gridSize;
            pacMan.dy = 0;
            break;
        case 40: // down
            pacMan.dx = 0;
            pacMan.dy = gridSize;
            break;
    }
}

function checkFoodCollision() {
    if (pacMan.x === food.x && pacMan.y === food.y) {
        score += 10;
        food.x = Math.floor(Math.random() * (width / gridSize)) * gridSize;
        food.y = Math.floor(Math.random() * (height / gridSize)) * gridSize;
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, width, height);
}

function drawPacMan() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(pacMan.x, pacMan.y, pacMan.size, pacMan.size);
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, food.size, food.size);
}

function updateScore() {
    document.getElementById("score").innerText = `Score: ${score}`;
}
