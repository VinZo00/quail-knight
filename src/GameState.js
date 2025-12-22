export const GameState = {
    maxLives: 3,
    lives: 3,

    reset() {
        this.lives = this.maxLives;
    },

    addLife() {
        this.lives = Math.min(this.maxLives, this.lives + 1);
    },

    takeDamage() {
        this.lives = Math.max(0, this.lives - 1);
    }
};
