import Phaser from 'phaser'

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
				// BACKGROUND
        this.load.image('bg', 'ui/background.jpg');
        this.load.image('logo', 'ui/logo.png');

				// AUDIO
        this.load.image('audio', 'ui/audio.png');
        this.load.image('mute', 'ui/mute.png');

				// AUDIO
				this.load.audio('intro', 'audio/menu-intro.mp3');
    }

    create() {

			  // BACKGROUND
        this.bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'bg');
				this.dir = 1;
				this.vel = 0.075;

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
				const introMusic = this.sound.add('intro', { loop: true });

				// @todo mettere play
				// introMusic.play();

				const audioBtn = this.add.image(50, 50, 'audio').setScale(.3).setInteractive();
				let isMuted = false;
				
				audioBtn.on('pointerdown', () => {
					isMuted = !isMuted;
					this.sound.setMute(isMuted);

					audioBtn.setTexture(isMuted ? 'mute' : 'audio');
				});

				// TEXT
				this.logo = this.add.image(this.scale.width / 2, 150, 'logo').setOrigin(0.5).setScale(.8);
        // this.add.text(this.scale.width / 2, 200, 'Created by VinZo', { fontSize: '48px', color: '#fff' }).setOrigin(0.5);
        const playButton = this.add.text(this.scale.width / 2, 400, 'PLAY', { fontSize: '32px', color: '#0f0' }).setOrigin(0.5).setInteractive();

        playButton.on('pointerdown', () => {
						introMusic.stop();
            this.scene.start('LoadScene');
        });

				this.cursors = this.input.keyboard.createCursorKeys();
    }


		update() {
			if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
				this.scene.start('LoadScene');
			}
			this.moveBg();
		}

		// Move the background in menu
		moveBg() {
			this.bg.x += this.dir * this.vel;
			const centerX = this.scale.width / 2;
			if ((this.bg.x > centerX + 20 || this.bg.x < centerX - 20) && !this.waiting) {
				this.waiting = true;
				this.dir = 0;

				setTimeout(() => {
					this.dir = (this.bg.x > centerX) ? -1 : 1;
					this.waiting = false;
				}, 500);
			}
		}
}
