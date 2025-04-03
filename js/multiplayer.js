document.addEventListener('DOMContentLoaded', () => {
    const player1 = new Tetris('player1-canvas');
    const player2 = new Tetris('player2-canvas');
    let lastTime = 0;
    let animationId = null;
    
    // Custom controls - Player 1: Arrows, Player 2: IJKL
    const controls = {
        player1: {
            left: 'KeyA',
            right: 'KeyD',
            rotate: 'KeyW',
            down: 'KeyS',
            drop: 'KeyE'
        },
        player2: {
            left: 'ArrowLeft',
            right: 'ArrowRight',
            rotate: 'ArrowUp',
            down: 'ArrowDown',
            drop: 'Space'
        }
    };
    
    // Game loop
    function gameLoop(timestamp) {
        if (!player1.isPaused && !player1.gameOver) {
            if (timestamp - player1.lastDrop > player1.dropInterval) {
                player1.moveDown();
                player1.lastDrop = timestamp;
                document.getElementById('player1-score').textContent = player1.score;
                document.getElementById('player1-level').textContent = player1.level;
            }
        }
        
        if (!player2.isPaused && !player2.gameOver) {
            if (timestamp - player2.lastDrop > player2.dropInterval) {
                player2.moveDown();
                player2.lastDrop = timestamp;
                document.getElementById('player2-score').textContent = player2.score;
                document.getElementById('player2-level').textContent = player2.level;
            }
        }
        
        if (player1.gameOver || player2.gameOver) {
            const gameOverDiv = document.getElementById('game-over-multi');
            const winnerMsg = document.getElementById('winner-message');
            
            if (player1.gameOver && player2.gameOver) {
                if (player1.score > player2.score) {
                    winnerMsg.textContent = `Player 1 wins with ${player1.score} points!`;
                } else if (player2.score > player1.score) {
                    winnerMsg.textContent = `Player 2 wins with ${player2.score} points!`;
                } else {
                    winnerMsg.textContent = "It's a tie!";
                }
            } else if (player1.gameOver) {
                winnerMsg.textContent = `Player 2 wins with ${player2.score} points!`;
            } else {
                winnerMsg.textContent = `Player 1 wins with ${player1.score} points!`;
            }
            
            gameOverDiv.style.display = 'block';
            return;
        }
        
        animationId = requestAnimationFrame(gameLoop);
    }
    
    // Start game
    animationId = requestAnimationFrame(gameLoop);
    
    // Keydown event with prevention of default behavior
    document.addEventListener('keydown', (e) => {
        // Prevent default for all game control keys
        const controlKeys = [
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', // Player 1
            'KeyJ', 'KeyL', 'KeyI', 'KeyK', 'KeyF' // Player 2
        ];
        
        if (controlKeys.includes(e.code)) {
            e.preventDefault();
        }
        
        // Player 1 controls
        if (!player1.gameOver) {
            switch (e.code) {
                case controls.player1.left:
                    player1.moveLeft();
                    break;
                case controls.player1.right:
                    player1.moveRight();
                    break;
                case controls.player1.down:
                    player1.moveDown();
                    break;
                case controls.player1.rotate:
                    player1.rotate();
                    break;
                case controls.player1.drop:
                    player1.drop();
                    break;
            }
        }
        
        // Player 2 controls
        if (!player2.gameOver) {
            switch (e.code) {
                case controls.player2.left:
                    player2.moveLeft();
                    break;
                case controls.player2.right:
                    player2.moveRight();
                    break;
                case controls.player2.down:
                    player2.moveDown();
                    break;
                case controls.player2.rotate:
                    player2.rotate();
                    break;
                case controls.player2.drop:
                    player2.drop();
                    break;
            }
        }
    });
});