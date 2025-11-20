import Phaser from 'phaser';
import WebFont from 'webfontloader';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this.load.image('logo', './assets/sprites/logo.png');
		WebFont.load({
      custom: {
        families: ['Ari'],
        urls: ['fonts/fonts.css']
      },
      active: () => {
				this.scene.start('MenuScene');
      }
    });
  }

  create() {
  }
}