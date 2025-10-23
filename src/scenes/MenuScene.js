import Phaser from 'phaser'

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
				// BACKGROUND
        this.load.image('sky', 'ui/background.jpg');

				// AUDIO
				this.load.audio('intro', 'audio/menu-intro.mp3');
    }

    create() {

			  // BACKGROUND
        this.bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'sky').setScale(0.5);
				this.dir = 1;
				this.vel = 0.05;

				// PATH
				this.overlay = this.add.rectangle(
					this.scale.width / 2,
					this.scale.height / 2,
					this.scale.width,
					this.scale.height,
					0x000000,
					0.5
				).setOrigin(0.5);

				// AUDIO
				this.sound.play('intro');

				// TEXT
        this.add.text(400, 200, 'Il mio Gioco Phaser', { fontSize: '48px', color: '#fff' }).setOrigin(0.5);
        const playButton = this.add.text(400, 400, 'PLAY', { fontSize: '32px', color: '#0f0' }).setOrigin(0.5).setInteractive();

        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
		update() {
			this.bg.x += this.dir * this.vel;
			const centerX = this.scale.width / 2;
			if (this.bg.x > centerX + 20 || this.bg.x < centerX - 20) {
				this.dir *= -1;
			}
		}
}
