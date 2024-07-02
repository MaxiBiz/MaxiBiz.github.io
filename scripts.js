document.addEventListener('DOMContentLoaded', function() {
            const placeBetButton = document.getElementById('place-bet');
            const startGameButton = document.getElementById('start-game');
            const stopGameButton = document.getElementById('stop-game');
            const betAmountInput = document.getElementById('bet-amount');
            const graphArea = document.getElementById('graph');
            let gameInterval = null;
            let isGameRunning = false;
            let hasUserStopped = false;

            placeBetButton.addEventListener('click', function() {
                const betAmount = parseFloat(betAmountInput.value);
                if (isNaN(betAmount) || betAmount <= 0) {
                    alert('Please enter a valid bet amount.');
                    return;
                }
                betAmountInput.disabled = true;
                placeBetButton.disabled = true;
                startGameButton.disabled = false;
            });

            startGameButton.addEventListener('click', function() {
                startGame();
                startGameButton.disabled = true;
                stopGameButton.disabled = false;
                isGameRunning = true;
                hasUserStopped = false;
            });

            stopGameButton.addEventListener('click', function() {
                isGameRunning = false;
                hasUserStopped = true;
                clearInterval(gameInterval);
                graphArea.style.color = 'green';
                stopGameButton.disabled = true;
            });

            function startGame() {
                let multiplier = 1.00;
                graphArea.textContent = '1.00x';
                graphArea.style.color = '#fff';
                const crashPoint = Math.pow(Math.random(), 2) * 15 + 1;
                console.log('Crash Point:', crashPoint.toFixed(2) + 'x');

                gameInterval = setInterval(function() {
                    if (!isGameRunning) return;
                    multiplier += Math.random() * 0.05 + 0.01;
                    graphArea.textContent = multiplier.toFixed(2) + 'x';
                    if (multiplier >= crashPoint) {
                        endGame(multiplier);
                    }
                }, 100);
            }

            function endGame(multiplier) {
                clearInterval(gameInterval);
                isGameRunning = false;
                if (!hasUserStopped) {
                    graphArea.textContent = "Crashed at " + multiplier.toFixed(2) + 'x';
                    graphArea.style.color = 'red';
                }
                resetGame();
            }

            function resetGame() {
                betAmountInput.disabled = false;
                placeBetButton.disabled = false;
                startGameButton.disabled = true;
                stopGameButton.disabled = true;
            }

            // Function to handle authorization callback
            function handleAuthorizationCallback() {
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get('code');

                if (code) {
                    // Exchange authorization code for access token using server-side code
                    // This step requires server-side implementation
                    // Upon successful exchange, proceed with betting logic using the access token
                    // For now, let's just log the code
                    console.log('Authorization code:', code);
                } else {
                    console.error('Authorization code not found.');
                }
            }

            // Call the function to handle authorization callback when the page loads
            handleAuthorizationCallback();

            document.getElementById('connect-coinbase').addEventListener('click', function() {
                // Redirect the user to Coinbase OAuth2 authorization page
                window.location.href = 'https://www.coinbase.com/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=YOUR_REDIRECT_URI&scope=wallet:accounts:read';
            });
        });
