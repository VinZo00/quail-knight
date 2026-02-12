import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create(data) {
        const { width, height } = this.scale;
        
        this.add.text(width / 2, height / 2 - 50, 'GAME OVER', {
            fontSize: '64px',
            color: '#ff0000'
        }).setOrigin(0.5);
        
        this.add.text(width / 2, height / 2 + 20, `Score: ${data.score || 0}`, {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        this.add.text(width / 2, height / 2 + 80, 'Premi SPAZIO per ricominciare', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
    }
}