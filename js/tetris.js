// Tetris pieces
const SHAPES = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]], // J
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]]  // Z
];

const COLORS = [
    '#00F0FF', // I - Neon Cyan
    '#FF00FF', // O - Neon Pink
    '#9D00FF', // T - Neon Purple
    '#FF7F00', // L - Neon Orange
    '#00FF9D', // J - Neon Teal
    '#F0FF00', // S - Neon Yellow
    '#FF0066'  // Z - Neon Magenta
];

class Tetris {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas element not found!');
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.rows = 20;
        this.cols = 10;
        this.grid = this.createGrid();
        this.piece = null;
        this.nextPiece = null;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.isPaused = false;
        this.dropInterval = 1000;
        this.lastDrop = 0;
        
        this.blockSize = this.canvas.width / this.cols;
        this.init();
    }
    
    init() {
        this.createNewPiece();
        this.draw();
    }
    
    createGrid() {
        return Array.from({length: this.rows}, () => Array(this.cols).fill(0));
    }
    
    createNewPiece() {
        if (!this.nextPiece) {
            const randomIdx = Math.floor(Math.random() * SHAPES.length);
            this.nextPiece = {
                shape: SHAPES[randomIdx],
                color: COLORS[randomIdx],
                x: Math.floor(this.cols / 2) - Math.floor(SHAPES[randomIdx][0].length / 2),
                y: 0
            };
        }
        
        this.piece = this.nextPiece;
        
        const randomIdx = Math.floor(Math.random() * SHAPES.length);
        this.nextPiece = {
            shape: SHAPES[randomIdx],
            color: COLORS[randomIdx],
            x: Math.floor(this.cols / 2) - Math.floor(SHAPES[randomIdx][0].length / 2),
            y: 0
        };
        
        // Check if game over
        if (this.checkCollision()) {
            this.gameOver = true;
            console.log('Game Over!');
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid background
        this.ctx.fillStyle = 'rgba(10, 10, 30, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid lines
        this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i <= this.cols; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.blockSize, 0);
            this.ctx.lineTo(i * this.blockSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 0; i <= this.rows; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.blockSize);
            this.ctx.lineTo(this.canvas.width, i * this.blockSize);
            this.ctx.stroke();
        }
        
        // Draw locked pieces
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.grid[row][col]) {
                    this.drawBlock(col, row, this.grid[row][col]);
                }
            }
        }
        
        // Draw current piece
        if (this.piece) {
            for (let row = 0; row < this.piece.shape.length; row++) {
                for (let col = 0; col < this.piece.shape[row].length; col++) {
                    if (this.piece.shape[row][col]) {
                        this.drawBlock(this.piece.x + col, this.piece.y + row, this.piece.color);
                    }
                }
            }
        }
        
        // Draw game over effect
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    drawBlock(x, y, color) {
        const padding = 2;
        const size = this.blockSize - padding * 2;
        
        // Outer glow
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            x * this.blockSize + padding,
            y * this.blockSize + padding,
            size,
            size
        );
        
        // Inner glow
        this.ctx.shadowBlur = 5;
        this.ctx.fillStyle = `rgba(255, 255, 255, 0.3)`;
        this.ctx.fillRect(
            x * this.blockSize + padding * 2,
            y * this.blockSize + padding * 2,
            size - padding * 2,
            size - padding * 2
        );
        
        // Reset shadow
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
    }
    
    moveDown() {
        if (this.gameOver || this.isPaused) return;
        
        this.piece.y++;
        if (this.checkCollision()) {
            this.piece.y--;
            this.lockPiece();
            this.clearLines();
            this.createNewPiece();
        }
        this.draw();
    }
    
    moveLeft() {
        if (this.gameOver || this.isPaused) return;
        
        this.piece.x--;
        if (this.checkCollision()) {
            this.piece.x++;
        }
        this.draw();
    }
    
    moveRight() {
        if (this.gameOver || this.isPaused) return;
        
        this.piece.x++;
        if (this.checkCollision()) {
            this.piece.x--;
        }
        this.draw();
    }
    
    rotate() {
        if (this.gameOver || this.isPaused) return;
        
        const originalShape = this.piece.shape;
        // Transpose matrix
        const rows = this.piece.shape.length;
        const cols = this.piece.shape[0].length;
        const newShape = Array.from({length: cols}, (_, i) => 
            Array.from({length: rows}, (_, j) => this.piece.shape[rows - 1 - j][i])
        );
        
        this.piece.shape = newShape;
        
        // If rotation causes collision, try wall kicks
        if (this.checkCollision()) {
            // Try moving left
            this.piece.x--;
            if (this.checkCollision()) {
                this.piece.x += 2; // Try moving right
                if (this.checkCollision()) {
                    this.piece.x--; // Revert
                    this.piece.shape = originalShape;
                }
            }
        }
        this.draw();
    }
    
    checkCollision() {
        for (let row = 0; row < this.piece.shape.length; row++) {
            for (let col = 0; col < this.piece.shape[row].length; col++) {
                if (this.piece.shape[row][col]) {
                    const newX = this.piece.x + col;
                    const newY = this.piece.y + row;
                    
                    if (
                        newX < 0 || 
                        newX >= this.cols || 
                        newY >= this.rows ||
                        (newY >= 0 && this.grid[newY][newX])
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    lockPiece() {
        for (let row = 0; row < this.piece.shape.length; row++) {
            for (let col = 0; col < this.piece.shape[row].length; col++) {
                if (this.piece.shape[row][col]) {
                    const y = this.piece.y + row;
                    const x = this.piece.x + col;
                    if (y >= 0) {
                        this.grid[y][x] = this.piece.color;
                    }
                }
            }
        }
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.grid[row].every(cell => cell !== 0)) {
                // Remove the line
                this.grid.splice(row, 1);
                // Add new empty line at top
                this.grid.unshift(Array(this.cols).fill(0));
                linesCleared++;
                row++; // Check the same row again
            }
        }
        
        if (linesCleared > 0) {
            // Update score
            const points = [0, 40, 100, 300, 1200][linesCleared] * this.level;
            this.score += points;
            this.lines += linesCleared;
            
            // Update level every 10 lines
            this.level = Math.floor(this.lines / 10) + 1;
            
            // Increase speed
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 50);
        }
    }
    
    drop() {
        if (this.gameOver || this.isPaused) return;
        
        while (!this.checkCollision()) {
            this.piece.y++;
        }
        this.piece.y--;
        this.lockPiece();
        this.clearLines();
        this.createNewPiece();
        this.draw();
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
    }
}