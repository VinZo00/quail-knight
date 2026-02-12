import Phaser from 'phaser';
import { GAME_SETTINGS } from '../Settings.js';
import { GameState } from '../GameState.js';

export default class UIScene extends Phaser.Scene {
  constructor(){ super('UIScene'); }

  create(){
		this.gameScale = GAME_SETTINGS.getScale(this.game);

		this.cameraSettings();
		this.hudPlayer();
		this.gameSettings();
		if (GAME_SETTINGS.isMobile) {
			this.gameHud();
		}
		this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
  }

	// ------------------------------------------------------------
  // CAMERA
  // ------------------------------------------------------------
	cameraSettings() {
    const uiCam = this.cameras.main;
    uiCam.setZoom(1);
    uiCam.setScroll(0, 0);
	}

	// ------------------------------------------------------------
  // PLAYER
  // ------------------------------------------------------------
	hudPlayer() {
		this.previousLives = GameState.lives;
		this.hudLifeContainer = this.add.container(40, 30).setScale(this.gameScale);
		this.faceSprite = this.add.sprite(0, 0, 'faces', 0).setOrigin(0, 0);
    this.heartsContainer = this.add.container(this.faceSprite.width + 8, this.faceSprite.width / 2 - 20);

    this.maxLives = GameState.maxLives;
		/** @type {Phaser.GameObjects.Image[]} */
    this.hearts = [];

    for (let i = 0; i < this.maxLives; i++) {
        const heart = this.add.image(i * 45, 0, 'heart')
            .setOrigin(0, 0)
            .setScale(0.4);

        this.hearts.push(heart);
        this.heartsContainer.add(heart);
    }

    this.updateHearts(GameState.lives);

    this.hudLifeContainer.add([
        this.faceSprite,
        this.heartsContainer
    ]);

		/**
		/** @type {(lives: number) => void} 
		*/
		this.onLivesChanged = (lives) => {
			if (lives < this.previousLives) {
				this.showDamageFace(lives);
			} else {
				this.updateFace(lives);
			}
			this.updateHearts(lives);
			this.previousLives = lives;
		};

		this.game.events.on('livesChanged', this.onLivesChanged);



		this.scoreBox = this.add.image(0, 0, 'quailscore').setOrigin(0, 0);
		const containerWidth = this.scoreBox.displayWidth * this.gameScale;
		this.scoreText = this.add.text(0, 0, `${GameState.score}`, {
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
		this.scoreContainer.add([this.scoreBox, this.scoreText]).setScale(this.gameScale * .9);

		/** @type {(value: number) => void} */
		this.onScoreChanged = (value = 0) => {
			GameState.addScore(value);
			this.scoreText.setText(`${GameState.score}`);
		};

		this.game.events.on('scoreChanged', this.onScoreChanged);

	}

	// ------------------------------------------------------------
  // SETTINGS
  // ------------------------------------------------------------
	gameSettings() {
		this.settings = this.add.image(20, 20, 'settings').setScale(.4 * this.gameScale).setOrigin(0, 0).setInteractive();

		this.settings.on('pointerdown', () => {
				this.scene.pause('GameScene');
				this.scene.pause('UIScene');
				this.scene.launch('SettingsScene');
				this.scene.bringToTop('SettingsScene');
		});
	}

	// ------------------------------------------------------------
  // HUD
  // ------------------------------------------------------------
	gameHud() {
			// @ts-ignore
			this.joystick = this.rexVirtualJoystick.add(this, {
				x: 100, y: this.scale.height - 80,
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
					this.scale.width - 170,
					this.scale.height - 120, 
					'run'         
			)
			.setScale(this.gameScale * 0.6)
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
					this.scale.width - 90,
					this.scale.height - 70, 
					'attack'         
			)
			.setScale(this.gameScale * 0.7)
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

	/**
   * @param {number} lives
  */
	updateHearts(lives) {
		this.hearts.forEach((heart, index) => {
        heart.setTint(index < lives ? 0xffffff : 0x000000);
    });
	}

	/**
   * @param {number} lives
  */
	updateFace(lives) {
		if (lives === GameState.maxLives) this.faceSprite.setFrame(0);
		else if (lives === 2) this.faceSprite.setFrame(1);
		else if (lives === 1) this.faceSprite.setFrame(3);
	}

	/**
   * @param {number} lives
  */
	showDamageFace(lives) {
		this.faceSprite.setFrame(4);

		this.time.delayedCall(500, () => {
			this.updateFace(lives);
		});
	}

	/**
	 * SHUTDOWN
	 */
	shutdown() {
		this.game.events.off('livesChanged', this.onLivesChanged);
		this.game.events.off('scoreChanged', this.onScoreChanged);
	}
}
