import Phaser from 'phaser'

export default class UIScene extends Phaser.Scene {
  constructor(){ super('UIScene'); }

  create(){
    // Camera UI: nessuno zoom/scroll
    const uiCam = this.cameras.main;
    uiCam.setZoom(1);
    uiCam.setScroll(0, 0);

    // HUD
		this.hudLifeContainer = this.add.container(30, 30);
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
		this.scoreText = this.add.text(0, 0, `${this.score}`, {
				font: 'bold 40px Ari',
				color: '#1e0800'
		});
		this.scoreText.setText('0');
		this.scoreText.setOrigin(0, 0);
		this.scoreText.x = this.scoreBox.displayWidth / 2 + 10;
		this.scoreText.y = this.scoreBox.displayHeight / 2 - 50;
		this.scoreContainer = this.add.container(
				this.scale.width - this.scoreBox.displayWidth - 30,
				30
		);
		this.scoreContainer.add([this.scoreBox, this.scoreText]).setScale(.9);

    // this.scale.on('resize', (gs) => {
    //   uiCam.setSize(gs.width, gs.height);
    // });

		// ——— JOYSTICK VIRTUALE (rex) ———
		// @ts-ignore
    this.joystick = this.rexVirtualJoystick.add(this, {
      x: 100, y: this.scale.height - 100,
      radius: 60,
      base: this.add.circle(0, 0, 60, 0x888888, 0.4),
      thumb: this.add.circle(0, 0, 30, 0xffffff, 0.8)
    });

    this.cursorKeys = this.joystick.createCursorKeys();

    this.game.events.emit('ui_ready', {
      cursorKeys: this.cursorKeys,
      joystick: this.joystick
    });

    this.scale.on('resize', (gs = null) => {
      this.joystick.setPosition(100, gs.height - 100);
    });

		
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
