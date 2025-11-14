import Phaser from 'phaser'

export default class UIScene extends Phaser.Scene {
  constructor(){ super('UIScene'); }

  create(){
    // Camera UI: nessuno zoom/scroll
    const uiCam = this.cameras.main;
    uiCam.setZoom(1);
    uiCam.setScroll(0, 0);

    // HUD fisso a schermo
    const font = { fontFamily: 'monospace', fontSize: '16px', color: '#fff' };
    this.add.image(16, 16, 'atlas', 'hearts/hearts-1').setOrigin(0,0);
    this.scoreText = this.add.text(80, 16, 'SCORE: 0', font).setOrigin(0,0);
		this.faceSprite = this.add.sprite(16, 64, 'faces', 0).setOrigin(0, 0);
		this.faceSprite.setScale(1.3);

		// Contenitore per tutto l'HUD della vita
		this.healthContainer = this.add.container(16, 160); // posiziona dove vuoi

		// Disegno barra vuota (bordo)
		this.healthBorder = this.add.graphics();
		this.healthBorder.lineStyle(2, 0xffffff);
		this.healthBorder.strokeRect(0, 0, 150, 20); // larghezza = 150px

		// Disegno barra piena
		this.healthFill = this.add.graphics();
		this.healthFill.fillStyle(0x00ff00);
		this.healthFill.fillRect(0, 0, 150, 20);

		// Metto tutto nel container
		this.healthContainer.add([this.healthBorder, this.healthFill]);


    // Ascolta gli eventi dal gioco
    this.game.events.on('scoreChanged', (value) => {
      this.scoreText.setText('SCORE: ' + value);
    });

    // Se il canvas viene ridimensionato:
    this.scale.on('resize', (gs) => {
      uiCam.setSize(gs.width, gs.height);
      // riposiziona elementi se li ancoravi ai bordi
      this.scoreText.setPosition(80, 16);
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
			this.updateFace(hp);      // aggiorna faccia
			this.updateHealthBar(hp); // aggiorna barra vita
		});

  }

	updateFace(hp) {
    if (hp > 75) this.faceSprite.setFrame(0);
    else if (hp > 50) this.faceSprite.setFrame(1);
    else if (hp > 25) this.faceSprite.setFrame(2);
    else this.faceSprite.setFrame(3);
  }

	updateHealthBar(hp) {
		const maxWidth = 150; // la larghezza della barra
		const width = Phaser.Math.Clamp(hp, 0, 100) * (maxWidth / 100);

		this.healthFill.clear();
		
		// Colore dinamico esempio:
		let color = 0x00ff00; // verde
		if (hp <= 50) color = 0xffff00; // giallo
		if (hp <= 25) color = 0xff0000; // rosso

		this.healthFill.fillStyle(color);
		this.healthFill.fillRect(0, 0, width, 20);
	}

}
