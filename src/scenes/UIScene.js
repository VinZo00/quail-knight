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
  }
}
