document.addEventListener('DOMContentLoaded', () => {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }
    
    const tetris = new Tetris('tetris-canvas');
    let lastTime = 0;
    let animationId = null;
    
    // Game loop
    function gameLoop(timestamp) {
        if (!tetris.isPaused && !tetris.gameOver) {
            if (timestamp - tetris.lastDrop > tetris.dropInterval) {
                tetris.moveDown();
                tetris.lastDrop = timestamp;
            }
        }
        
        if (tetris.gameOver) {
            document.getElementById('final-score').textContent = tetris.score;
            document.getElementById('game-over').style.display = 'block';
            saveScore(tetris.score);
            return;
        }
        
        animationId = requestAnimationFrame(gameLoop);
    }
    
    // Start game
    animationId = requestAnimationFrame(gameLoop);
    
    // Controls with prevention of default behavior
    document.addEventListener('keydown', (e) => {
        if (tetris.gameOver) return;
        
        // Prevent default for all control keys to stop screen shaking
        const controlKeys = [
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'KeyP'
        ];
        
        if (controlKeys.includes(e.code)) {
            e.preventDefault();
        }
        
        switch (e.code) {
            case 'ArrowLeft':
                tetris.moveLeft();
                break;
            case 'ArrowRight':
                tetris.moveRight();
                break;
            case 'ArrowDown':
                tetris.moveDown();
                break;
            case 'ArrowUp':
                tetris.rotate();
                break;
            case 'Space':
                tetris.drop();
                break;
            case 'KeyP':
                tetris.togglePause();
                const btn = document.getElementById('pause-btn');
                btn.textContent = tetris.isPaused ? 'Resume' : 'Pause';
                break;
        }
    });
    
    // Pause button click handler
    document.getElementById('pause-btn').addEventListener('click', () => {
        tetris.togglePause();
        const btn = document.getElementById('pause-btn');
        btn.textContent = tetris.isPaused ? 'Resume' : 'Pause';
    });
    
    // Update score display continuously
    function updateScoreDisplay() {
        document.getElementById('score').textContent = tetris.score;
        document.getElementById('level').textContent = tetris.level;
        document.getElementById('lines').textContent = tetris.lines;
        requestAnimationFrame(updateScoreDisplay);
    }
    
    // Start score display updates
    updateScoreDisplay();
});