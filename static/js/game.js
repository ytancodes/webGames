class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.audio = new AudioManager();

        this.ball = {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0,
            size: 10
        };

        this.paddle = {
            width: 80,
            height: 15,
            speed: 8
        };

        this.player = {
            x: 0,
            score: 0
        };

        this.ai = {
            x: 0,
            score: 0
        };

        // Game state
        this.isRunning = false;
        this.lastTime = 0;
        this.touchX = null;
        this.gameStartTime = 0;

        // Bind event handlers
        this.handleResize = this.handleResize.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.gameLoop = this.gameLoop.bind(this);

        // Setup event listeners
        window.addEventListener('resize', this.handleResize);
        this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        this.canvas.addEventListener('touchend', this.handleTouchEnd, { passive: false });

        // Mouse fallback for desktop
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isRunning) {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const canvasX = (x / rect.width) * this.canvas.width;
                this.player.x = Math.max(0, Math.min(this.canvas.width - this.paddle.width, canvasX - this.paddle.width / 2));
            }
        });

        // Setup UI controls
        document.getElementById('startButton').addEventListener('click', () => this.startGame());
        document.getElementById('soundToggle').addEventListener('click', () => {
            const isMuted = this.audio.toggleMute();
            document.getElementById('soundToggle').textContent = `Sound: ${isMuted ? 'OFF' : 'ON'}`;
        });

        this.handleResize();
    }

    handleResize() {
        const containerHeight = window.innerHeight - 200;
        const containerWidth = window.innerWidth - 40;
        const aspectRatio = 3/4;

        let canvasHeight, canvasWidth;

        if (containerWidth * aspectRatio <= containerHeight) {
            canvasWidth = containerWidth;
            canvasHeight = containerWidth * aspectRatio;
        } else {
            canvasHeight = containerHeight;
            canvasWidth = containerHeight / aspectRatio;
        }

        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;

        // Adjust game object sizes based on canvas size
        this.paddle.width = this.canvas.width * 0.3;
        this.paddle.height = this.canvas.height * 0.02;
        this.ball.size = Math.min(this.canvas.width, this.canvas.height) * 0.02;

        // Reset positions
        this.resetPositions();
    }

    resetPositions() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.player.x = (this.canvas.width - this.paddle.width) / 2;
        this.ai.x = (this.canvas.width - this.paddle.width) / 2;

        // Reset ball speed and direction
        const speed = Math.min(this.canvas.width, this.canvas.height) * 0.01;
        this.ball.dx = (Math.random() > 0.5 ? 1 : -1) * speed;
        this.ball.dy = (Math.random() > 0.5 ? 1 : -1) * speed;
    }

    resetGame() {
        this.player.score = 0;
        this.ai.score = 0;
        this.updateScore();
        this.resetPositions();
    }

    startGame() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.resetPositions();
            this.gameStartTime = Date.now();
            requestAnimationFrame(this.gameLoop);
            document.getElementById('startButton').textContent = 'Restart';
        } else {
            this.resetGame();
        }
    }

    handleTouchStart(e) {
        e.preventDefault();
        if (!this.isRunning) return;

        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        this.touchX = touch.clientX - rect.left;

        // Update paddle position immediately
        const canvasX = (this.touchX / rect.width) * this.canvas.width;
        this.player.x = Math.max(0, Math.min(this.canvas.width - this.paddle.width, canvasX - this.paddle.width / 2));
    }

    handleTouchMove(e) {
        e.preventDefault();
        if (!this.isRunning || !this.touchX) return;

        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const currentX = touch.clientX - rect.left;
        const canvasX = (currentX / rect.width) * this.canvas.width;

        this.player.x = Math.max(0, Math.min(this.canvas.width - this.paddle.width, canvasX - this.paddle.width / 2));
        this.touchX = currentX;
    }

    handleTouchEnd(e) {
        e.preventDefault();
        this.touchX = null;
    }

    updateAI() {
        const aiCenter = this.ai.x + this.paddle.width / 2;
        const ballCenter = this.ball.x;
        const maxSpeed = this.paddle.speed * 0.8;

        if (Math.abs(aiCenter - ballCenter) > this.paddle.width * 0.1) {
            const direction = aiCenter < ballCenter ? 1 : -1;
            this.ai.x += direction * maxSpeed;
            this.ai.x = Math.max(0, Math.min(this.canvas.width - this.paddle.width, this.ai.x));
        }
    }

    updateBall() {
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        // Horizontal collision
        if (this.ball.x <= 0 || this.ball.x >= this.canvas.width) {
            this.ball.dx *= -1;
            this.audio.playWallHit();
        }

        // Paddle collision
        const paddleBottom = {x: this.player.x, y: this.canvas.height - this.paddle.height, width: this.paddle.width};
        const paddleTop = {x: this.ai.x, y: 0, width: this.paddle.width};

        [paddleBottom, paddleTop].forEach(paddle => {
            if (this.ball.x >= paddle.x && 
                this.ball.x <= paddle.x + paddle.width &&
                Math.abs(this.ball.y - paddle.y) <= this.ball.size + this.paddle.height) {

                this.ball.dy *= -1.1; // Increase speed slightly
                this.audio.playPaddleHit();
            }
        });

        // Scoring
        if (this.ball.y <= 0) {
            this.player.score++;
            this.audio.playScore();
            this.resetPositions();
            this.updateScore();
        } else if (this.ball.y >= this.canvas.height) {
            this.ai.score++;
            this.audio.playScore();
            this.resetPositions();
            this.updateScore();
        }
    }

    updateScore() {
        document.getElementById('playerScore').textContent = this.player.score;
        document.getElementById('aiScore').textContent = this.ai.score;

        // Save score to database when game ends
        if (this.player.score >= 11 || this.ai.score >= 11) {
            fetch('/scores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    player_score: this.player.score,
                    ai_score: this.ai.score,
                    duration: Math.floor((Date.now() - this.gameStartTime) / 1000)
                })
            });
            this.isRunning = false;
            document.getElementById('startButton').textContent = 'Start New Game';
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw center line
        this.ctx.setLineDash([5, 15]);
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height / 2);
        this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
        this.ctx.strokeStyle = '#ff00ff';
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Draw paddles
        this.ctx.fillStyle = '#00ffff';
        this.ctx.fillRect(this.player.x, this.canvas.height - this.paddle.height, 
            this.paddle.width, this.paddle.height);
        this.ctx.fillRect(this.ai.x, 0, this.paddle.width, this.paddle.height);

        // Draw ball
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.size, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ff00ff';
        this.ctx.fill();
        this.ctx.closePath();
    }

    gameLoop(timestamp) {
        if (!this.isRunning) return;

        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        if (deltaTime > 0) {
            this.updateAI();
            this.updateBall();
            this.draw();
        }

        requestAnimationFrame(this.gameLoop);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
