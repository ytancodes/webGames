class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = {
            paddleHit: this.createPaddleHitSound(),
            wallHit: this.createWallHitSound(),
            score: this.createScoreSound()
        };
        this.isMuted = false;
    }

    createPaddleHitSound() {
        return {
            play: () => {
                if (this.isMuted) return;
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.1);
            }
        };
    }

    createWallHitSound() {
        return {
            play: () => {
                if (this.isMuted) return;
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.1);
            }
        };
    }

    createScoreSound() {
        return {
            play: () => {
                if (this.isMuted) return;
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(587.33, this.audioContext.currentTime); // D5
                oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime + 0.1); // A5
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.2);
            }
        };
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    playPaddleHit() {
        this.sounds.paddleHit.play();
    }

    playWallHit() {
        this.sounds.wallHit.play();
    }

    playScore() {
        this.sounds.score.play();
    }
}
