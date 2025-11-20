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
		this.healthText = this.add.text(0, -15, `HP ${100}`, {
				fontFamily: 'Arial',
				fontSize: '16px',
				color: '#ffffffff'
		});
		this.healthContainer.add([this.healthBorder, this.healthFill, this.healthText]);

		this.hudLifeContainer.add([
			this.faceSprite,
			this.healthContainer
		]);

		this.scoreBox = this.add.image(0, 0, 'quailscore').setOrigin(0, 0);
		this.scoreText = this.add.text(0, 0, '01', {
				fontFamily: 'Ari',
				fontSize: '35px',
				color: '#1e0800'
		});
		this.scoreText.setOrigin(0, 0);
		this.scoreText.x = this.scoreBox.displayWidth / 2 + 20;
		this.scoreText.y = this.scoreBox.displayHeight / 2 - 40;
		this.scoreContainer = this.add.container(
				this.scale.width - this.scoreBox.displayWidth - 30,
				30
		);
		this.scoreContainer.add([this.scoreBox, this.scoreText]).setScale(.9);

    // Ascolta gli eventi dal gioco
    // this.game.events.on('scoreChanged', (value) => {
    //   this.scoreText.setText('SCORE: ' + value);
    // });

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
