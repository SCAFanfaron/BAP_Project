document.addEventListener('DOMContentLoaded', () => {
    // Increase canvas sizes for both players
    const player1Canvas = document.getElementById('player1-canvas');
    const player2Canvas = document.getElementById('player2-canvas');
    
    // Set larger dimensions (adjust these values as needed)
    const canvasWidth = 300;  // Increased from 200
    const canvasHeight = 600; // Increased from 400
    
    player1Canvas.width = canvasWidth;
    player1Canvas.height = canvasHeight;
    player2Canvas.width = canvasWidth;
    player2Canvas.height = canvasHeight;

    const player1 = new Tetris('player1-canvas');
    const player2 = new Tetris('player2-canvas');
    let lastTime = 0;
    let animationId = null;
    
    // Custom controls - Player 1: WASD+E, Player 2: Arrows+Space
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
                updatePlayerInfo(1, player1);
            }
        }
        
        if (!player2.isPaused && !player2.gameOver) {
            if (timestamp - player2.lastDrop > player2.dropInterval) {
                player2.moveDown();
                player2.lastDrop = timestamp;
                updatePlayerInfo(2, player2);
            }
        }
        
        if (player1.gameOver && player2.gameOver) {
            showGameOver(player1, player2);
            return;
        }
        
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function updatePlayerInfo(playerNum, player) {
        document.getElementById(`player${playerNum}-score`).textContent = player.score;
        document.getElementById(`player${playerNum}-level`).textContent = player.level;
    }
    
    function showGameOver(p1, p2) {
        const gameOverDiv = document.getElementById('game-over-multi');
        const winnerMsg = document.getElementById('winner-message');
        
        if (p1.score > p2.score) {
            winnerMsg.textContent = `Player 1 wins with ${p1.score} points!`;
            winnerMsg.style.color = '#00F0FF'; // Neon cyan
        } else if (p2.score > p1.score) {
            winnerMsg.textContent = `Player 2 wins with ${p2.score} points!`;
            winnerMsg.style.color = '#FF00FF'; // Neon pink
        } else {
            winnerMsg.textContent = "Neural link synchronized - It's a tie!";
            winnerMsg.style.color = '#9D00FF'; // Neon purple
        }
        
        gameOverDiv.style.display = 'block';
        gameOverDiv.style.animation = 'neonPulse 1s infinite alternate';
    }
    
    // Start game
    animationId = requestAnimationFrame(gameLoop);
    
    // Keydown event with prevention of default behavior
    document.addEventListener('keydown', (e) => {
        // Prevent default for all game control keys
        const controlKeys = [
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', // Player 2
            'KeyA', 'KeyD', 'KeyW', 'KeyS', 'KeyE' // Player 1
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