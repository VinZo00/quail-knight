import Phaser from 'phaser'

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('sky', 'images/sky.png');
    }

    create() {
        this.add.image(400, 300, 'sky');
        this.add.text(400, 200, 'Il mio Gioco Phaser', { fontSize: '48px', color: '#fff' }).setOrigin(0.5);
        const playButton = this.add.text(400, 400, 'PLAY', { fontSize: '32px', color: '#0f0' }).setOrigin(0.5).setInteractive();

        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
