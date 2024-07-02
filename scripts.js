let currentMultiplier = 1.00;
let crashPoint;
let gameInterval;
let countdownInterval;
let timeLeft = 45;
let betPlaced = false;
let betAmount = 0;

// Phantom Wallet SDK integration
const { PhantomWalletAdapter } = window['@solana/wallet-adapter-phantom'];
const wallet = new PhantomWalletAdapter();

async function connectWallet() {
    await wallet.connect();
    console.log('Wallet connected:', wallet.publicKey.toString());
}

async function placeBet() {
    if (!wallet.connected) {
        await connectWallet();
    }
    
    betAmount = parseFloat(document.getElementById('bet-amount').value);
    if (isNaN(betAmount) || betAmount <= 0) {
        alert('Please enter a valid bet amount');
        return;
    }

    betPlaced = true;
    document.getElementById('betButton').disabled = true;
    document.getElementById('cashoutButton').disabled = false;
    document.getElementById('message').innerText = 'Bet placed! Waiting for the right time to cash out...';
}

function cashOut() {
    if (betPlaced && currentMultiplier < crashPoint) {
        const payout = betAmount * currentMultiplier;
        document.getElementById('message').innerText = `Cashed out at ${currentMultiplier.toFixed(2)}x! You win ${payout.toFixed(2)}!`;
        resetGame();
    } else {
        document.getElementById('message').innerText = `Missed the cash out! The game crashed at ${crashPoint}x.`;
    }
}

function startGame() {
    resetGame();
    crashPoint = (Math.random() * 10 + 1).toFixed(2);
    gameInterval = setInterval(updateMultiplier, 100);
}

function updateMultiplier() {
    currentMultiplier += 0.01;
    document.getElementById('multiplier').innerText = `${currentMultiplier.toFixed(2)}x`;

    if (currentMultiplier >= crashPoint) {
        clearInterval(gameInterval);
        document.getElementById('message').innerText = `Crashed at ${crashPoint}x!`;
        resetGame();
    }
}

function resetGame() {
    clearInterval(gameInterval);
    clearInterval(countdownInterval);
    document.getElementById('betButton').disabled = false;
    document.getElementById('cashoutButton').disabled = true;
    betPlaced = false;
    currentMultiplier = 1.00;
    timeLeft = 45;
    startCountdown();
}

function startCountdown() {
    countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    timeLeft -= 1;
    document.getElementById('countdown').innerText = `Next round in: ${timeLeft}s`;

    if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        startGame();
    }
}

// Initial countdown to start the game
startCountdown();
