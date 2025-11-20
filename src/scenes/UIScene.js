import Phaser from 'phaser'

export default class UIScene extends Phaser.Scene {
  constructor(){ super('UIScene'); }

  create(){
    // Camera UI: nessuno zoom/scroll
    const uiCam = this.cameras.main;
    uiCam.setZoom(1);
    uiCam.setScroll(0, 0);

    // 	 fisso a schermo
		this.hudLifeContainer = this.add.container(30, 30);
		this.faceSprite = this.add.sprite(0, 0, 'faces', 0).setOrigin(0, 0);
		this.score = 0;

		// FIXME update health bar
		this.healthContainer = this.add.container(0, 0);
		this.healthContainer.x = this.faceSprite.width + 8;
		this.healthContainer.y =  this.faceSprite.height / 2 - 10;
		this.healthBorder = this.add.graphics();
		this.healthBorder.lineStyle(2, 0x1e0800);
		this.healthBorder.strokeRect(0, 10, 150, 20).setDepth(2);
		this.healthFill = this.add.graphics();
		this.healthFill.fillStyle(0x34a214);
		this.healthFill.fillRect(0, 10, 150, 20);
		this.healthText = this.add.text(0, -45, `HP ${100}`, {
				font: 'bold 40px Ari',
				color: '#ffffffff'
		});
		this.healthContainer.add([this.healthBorder, this.healthFill, this.healthText]);

		this.hudLifeContainer.add([
			this.faceSprite,
			this.healthContainer
		]);

		this.scoreBox = this.add.image(0, 0, 'quailscore').setOrigin(0, 0);
		this.scoreText = this.add.text(0, 0, '0', {
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

    // Se il canvas viene ridimensionato:
    this.scale.on('resize', (gs) => {
      uiCam.setSize(gs.width, gs.height);
      // riposiziona elementi se li ancoravi ai bordi
      // this.scoreText.setPosition(80, 16);
    });

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

    this.scale.on('resize', (gs) => {
      this.joystick.setPosition(100, gs.height - 100);
    });

		
		this.game.events.on('hpChanged', (hp) => {
			this.showDamageFace(hp);
			this.updateHealthBar(hp);
		});

		this.game.events.on('hpRegenerate', (hp) => {
			this.updateFace(hp);
			this.updateHealthBar(hp);
		});

		this.game.events.on('scoreChanged', (value) => {
			this.score = this.score + value;
      this.scoreText.setText(this.score);
    });
  }

	updateFace(hp) {
    if (hp > 75) this.faceSprite.setFrame(0);
    else if (hp > 50) this.faceSprite.setFrame(1);
    else if (hp > 25) this.faceSprite.setFrame(2);
    else this.faceSprite.setFrame(3);
  }

	showDamageFace(hp) {

		if (this.isTakingDamage) return;

		this.isTakingDamage = true;

		this.faceSprite.setFrame(4);

		this.time.delayedCall(500, () => {
			this.isTakingDamage = false;
			this.updateFace(hp);
		});
	}

	updateHealthBar(hp) {
		const maxWidth = 150;
		const width = Phaser.Math.Clamp(hp, 0, 100) * (maxWidth / 100);

		this.healthFill.clear();
		
		let color = 0x00ff00;
		if (hp <= 50) color = 0xffff00;
		if (hp <= 25) color = 0xff0000;

		this.healthFill.fillStyle(color);
		this.healthFill.fillRect(0, 0, width, 20);
	}

}
