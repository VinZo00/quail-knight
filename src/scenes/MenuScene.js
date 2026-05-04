import Phaser from 'phaser'
import { GAME_SETTINGS } from '../Settings.js';

export default class MenuScene extends Phaser.Scene {
	constructor() {
		super({ key: 'MenuScene' });
	}

	preload() {
		this.load.image('bg', 'ui/background.jpg');
		this.load.image('logo', 'ui/logo.png');
		this.load.image('play', 'ui/play.png');
		this.load.image('audio', 'ui/audio.png');
		this.load.image('mute', 'ui/mute.png');
		this.load.audio('intro', 'audio/menu-intro.mp3');
	}

	create() {
		this.scaleGame = GAME_SETTINGS.getScale(this.game);
		if (!this.registry.has('firstLaunch')) {
			this.registry.set('firstLaunch', true);
		}
		this.overlayBG();
		this.audioButton();
		this.playButton();
	}

	update() {
		this.moveBg();
	}

	// ----------------------------------------------------------------------------
	// BG OVERLAY
	// ----------------------------------------------------------------------------
	overlayBG() {
		this.bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'bg');
		this.dir = 1;
		this.vel = 0.2;
		this.waiting = false;

		this.overlay = this.add.rectangle(
			this.scale.width / 2,
			this.scale.height / 2,
			this.scale.width,
			this.scale.height,
			0x000000,
			0.2
		).setOrigin(0.5);
	}

	// ----------------------------------------------------------------------------
	// AUDIO BUTTON
	// ----------------------------------------------------------------------------
	audioButton() {
		const introMusic = this.sound.add('intro', { loop: true, volume: .5 });
		introMusic.play();

		const audioBtn = this.add.image(30, 30, 'audio').setScale(.3).setInteractive({ useHandCursor: true });
		let isMuted = false;

		audioBtn.on('pointerdown', () => {
			if (!isMuted) {
				introMusic.pause();
				audioBtn.setTexture('mute');
				isMuted = true;
			} else {
				introMusic.resume();
				audioBtn.setTexture('audio');
				isMuted = false;
			}
		});
	}

	// ----------------------------------------------------------------------------
	// PLAY BUTTON
	// ----------------------------------------------------------------------------
	playButton() {
		const playButton = this.add.image(this.scale.width / 2, this.scale.height - 80, 'play').setOrigin(0.5).setScale(this.scaleGame).setInteractive({ useHandCursor: true });
		this.logo = this.add.image(this.scale.width / 2, this.scaleGame * 150, 'logo').setOrigin(0.5).setScale(this.scaleGame * .8);

		playButton.on('pointerdown', () => {
			this.startGame();
		});
	}

	// ----------------------------------------------------------------------------
	// GAME START
	// ----------------------------------------------------------------------------
	startGame() {
		this.sound.stopAll();
		if (this.registry.get('firstLaunch')) {
			this.registry.set('firstLaunch', false);
			this.scene.start('LoadScene');
		} else {
			this.scene.start('GameScene');
		}
	}

	// ----------------------------------------------------------------------------
	// BG MOVE EFFECT
	// ----------------------------------------------------------------------------
	moveBg() {
		this.bg.x += this.dir * this.vel;
		const centerX = this.scale.width / 2;
		if ((this.bg.x > centerX + 20 || this.bg.x < centerX - 20) && !this.waiting) {
			this.waiting = true;
			this.dir = 0;

			this.time.delayedCall(500, () => {
				this.dir = (this.bg.x > centerX) ? -1 : 1;
				this.waiting = false;
			});
		}
	}
}
