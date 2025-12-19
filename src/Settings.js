export const GAME_SETTINGS = {
    BASE_WIDTH: 1000,
    BASE_HEIGHT: 600,
		isMobile: ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 1000,
		/** @param {object} game */
		getScale(game) {
        const scaleX = game.scale.width / this.BASE_WIDTH;
        const scaleY = game.scale.height / this.BASE_HEIGHT;
        return Math.min(scaleX, scaleY);
    }
};
