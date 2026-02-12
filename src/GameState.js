export const GameState = {
		score: 0,
    maxLives: 3,
    lives: 3,

    resetLives() {
        this.lives = this.maxLives;
    },

    addLife() {
        this.lives = Math.min(this.maxLives, this.lives + 1);
    },

		/**
		/** @type {(value: number) => void} 
		*/
    addScore(value) {
      this.score += value;
    },

    takeDamage() {
        this.lives = Math.max(0, this.lives - 1);
    }
};
