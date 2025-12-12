import Phaser from 'phaser';
import { GAME_SETTINGS } from '../Settings.js';

export default class UIScene extends Phaser.Scene {
  constructor(){ super('UIScene'); }

  create(){
		const scale = GAME_SETTINGS.getScale(this.game);

    // Camera UI: nessuno zoom/scroll
    const uiCam = this.cameras.main;
    uiCam.setZoom(1);
    uiCam.setScroll(0, 0);

    // HUD
		this.hudLifeContainer = this.add.container(40, 30).setScale(scale);
		this.faceSprite = this.add.sprite(0, 0, 'faces', 0).setOrigin(0, 0);
		this.score = 0;

		this.healthContainer = this.add.container(this.faceSprite.width + 8, this.faceSprite.height / 2 - 10);
		this.healthBorder = this.add.graphics();
		this.healthBorder.lineStyle(2, 0x1e0800).strokeRect(0, 10, 150, 20).setDepth(2);
		this.healthFill = this.add.graphics();
		this.healthFill.fillStyle(0x34a214).fillRect(0, 12, 150, 16);
		this.healthText = this.add.text(0, -25, `HP ${100}`, {
				font: 'bold 20px Ari',
				color: '#ffffffff'
		});
		this.healthContainer.add([this.healthBorder, this.healthFill, this.healthText]);
	
		this.hudLifeContainer.add([
			this.faceSprite,
			this.healthContainer
		]);

		this.scoreBox = this.add.image(0, 0, 'quailscore').setOrigin(0, 0);
		const containerWidth = this.scoreBox.displayWidth * scale;
		this.scoreText = this.add.text(0, 0, `${this.score}`, {
				font: 'bold 40px Ari',
				color: '#1e0800'
		});
		this.scoreText.setText('0');
		this.scoreText.setOrigin(0, 0);
		this.scoreText.x = this.scoreBox.displayWidth / 2 + 10;
		this.scoreText.y = this.scoreBox.displayHeight / 2 - 50;
		this.scoreContainer = this.add.container(
				this.scale.width - containerWidth - 30,
				30
		);
		this.scoreContainer.add([this.scoreBox, this.scoreText]).setScale(scale * .9);

		this.settings = this.add.image(20, 20, 'settings').setScale(.4).setOrigin(0, 0).setInteractive();

		this.settings.on('pointerdown', () => {
				this.scene.pause('GameScene');
				this.scene.pause('UIScene');
				this.scene.launch('SettingsScene');
				this.scene.bringToTop('SettingsScene');
		});


		if (GAME_SETTINGS.isMobile) {
			// ——— JOYSTICK VIRTUALE (rex) ———
			// @ts-ignore
			this.joystick = this.rexVirtualJoystick.add(this, {
				x: 80, y: this.scale.height - 70,
				radius: 60,
				base: this.add.circle(0, 0, 50, 0x888888, 0.4),
				thumb: this.add.circle(0, 0, 25, 0xffffff, 0.8)
			});

			this.cursorKeys = this.joystick.createCursorKeys();

			this.game.events.emit('ui_ready', {
				cursorKeys: this.cursorKeys,
				joystick: this.joystick
			});
			
			this.runButton = this.add.image(
					this.scale.width - 130,
					this.scale.height - 130, 
					'run'         
			)
			.setScale(scale * 0.6)
			.setInteractive()
			.setScrollFactor(0)
			.on('pointerdown', () => {
				this.runButton.setTint(0x888888);
					this.game.events.emit('run_down');
			})
			.on('pointerup', () => {
					this.runButton.clearTint();
					this.game.events.emit('run_up');
			})
			.on('pointerout', () => {
					this.runButton.clearTint();
					this.game.events.emit('run_up');
			})
			.on('pointerupoutside', () => {
					this.runButton.clearTint();
					this.game.events.emit('run_up');
			});

			this.attackButton = this.add.image(
					this.scale.width - 80,
					this.scale.height - 70, 
					'attack'         
			)
			.setScale(scale * 0.7)
			.setInteractive()
			.setScrollFactor(0)
			.on('pointerdown', () => {
				this.attackButton.setTint(0x888888);
				this.game.events.emit('attack_down');
			})
			.on('pointerup', () => {
				this.attackButton.clearTint();
				this.game.events.emit('attack_up');
			})
			.on('pointerout', () => {
					this.attackButton.clearTint();
					this.game.events.emit('attack_up');
			})
			.on('pointerupoutside', () => {
					this.attackButton.clearTint();
					this.game.events.emit('attack_up');
			});
		}

		this.game.events.on('hpChanged', (hp = null) => {
			this.showDamageFace(hp);
			this.updateHP(hp);
			this.updateHealthBar(hp);
		});

		this.game.events.on('hpRegenerate', (hp = null) => {
			this.updateFace(hp);
			this.updateHP(hp);
			this.updateHealthBar(hp);
		});

		this.game.events.on('scoreChanged', (value = null) => {
			this.score = this.score + value;
      this.scoreText.setText(this.score);
    });
  }

	/**
   * @param {number} hp
  */
	updateHP(hp) {
		this.healthText.setText(`HP ${hp}`);
	}

	/**
   * @param {number} hp
  */
	updateFace(hp) {
    if (hp > 75) this.faceSprite.setFrame(0);
    else if (hp > 50) this.faceSprite.setFrame(1);
    else if (hp > 25) this.faceSprite.setFrame(2);
    else this.faceSprite.setFrame(3);
  }

	/**
   * @param {number} hp
  */
	showDamageFace(hp) {

		if (this.isTakingDamage) return;

		this.isTakingDamage = true;

		this.faceSprite.setFrame(4);

		this.time.delayedCall(500, () => {
			this.isTakingDamage = false;
			this.updateFace(hp);
		});
	}

	/**
   * @param {number} hp
  */
	updateHealthBar(hp) {
		const maxWidth = 150;
		const width = Phaser.Math.Clamp(hp, 0, 100) * (maxWidth / 100);

		this.healthFill.clear();
		
		let color = 0x34a214;
		if (hp <= 75) color = 0xffff00;
		if (hp <= 25) color = 0xff0000;

		this.healthFill.fillStyle(color);
		this.healthFill.fillRect(0, 12, width, 16).setDepth(1);
	}

}
