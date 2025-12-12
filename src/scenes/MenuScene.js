import Phaser from 'phaser'
import { GAME_SETTINGS } from '../Settings.js';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
				// BACKGROUND
        this.load.image('bg', 'ui/background.jpg');
        this.load.image('logo', 'ui/logo.png');
				this.load.image('play', 'ui/play.png');

				// AUDIO
        this.load.image('audio', 'ui/audio.png');
        this.load.image('mute', 'ui/mute.png');

				// AUDIO
				this.load.audio('intro', 'audio/menu-intro.mp3');
    }

    create() {
				const scale = GAME_SETTINGS.getScale(this.game);

			  // BACKGROUND
        this.bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'bg');
				this.dir = 1;
				this.vel = 0.2;

				// PATH
				this.overlay = this.add.rectangle(
					this.scale.width / 2,
					this.scale.height / 2,
					this.scale.width,
					this.scale.height,
					0x000000,
					0.2
				).setOrigin(0.5);

				// AUDIO
				const introMusic = this.sound.add('intro', { loop: true });
				introMusic.play();

				const audioBtn = this.add.image(30, 30, 'audio').setScale(.3).setInteractive();
				let isMuted = false;
				
				audioBtn.on('pointerdown', () => {
					isMuted = !isMuted;
					this.sound.setMute(isMuted);

					audioBtn.setTexture(isMuted ? 'mute' : 'audio');
				});

				// TEXT
				const playButton = this.add.image(this.scale.width / 2, this.scale.height - 80, 'play').setOrigin(0.5).setScale(scale).setInteractive();
				this.logo = this.add.image(this.scale.width / 2, scale * 150, 'logo').setOrigin(0.5).setScale(scale * .8);

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
