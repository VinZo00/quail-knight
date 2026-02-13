import Phaser from 'phaser';

export default class LoadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LoadScene' });
  }

  preload() {
		this.loadFonts();
		this.loadBar();
    this.loadImages();
    this.loadSprite();
    this.loadMap();
    this.loadAudio();
  }

  create() {
    this.scene.start('GameScene');
		this.scene.stop();
  }

	// ----------------------------------------------------------------------------
	// FONTS
	// ----------------------------------------------------------------------------
	loadFonts() {
    this.load.font([
        { key: 'Ari', url: 'fonts/ari-w9500.ttf', format: 'truetype' },
        { key: 'Ari', url: 'fonts/ari-w9500.woff', format: 'woff' },
        { key: 'Ari', url: 'fonts/ari-w9500.woff2', format: 'woff2' },
    ]);
    this.load.font([
        { key: 'Ari-bold', url: 'fonts/ari-w9500-bold.ttf', format: 'truetype' },
        { key: 'Ari-bold', url: 'fonts/ari-w9500-bold.woff', format: 'woff' },
        { key: 'Ari-bold', url: 'fonts/ari-w9500-bold.woff2', format: 'woff2' },
    ]);
	}
 
	// ----------------------------------------------------------------------------
	// LOADING BAR
	// ----------------------------------------------------------------------------
	loadBar() {
		// --- Testo "Caricamento..." ---
    const loadingText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 40,
      'Caricamento...',
      { fontSize: '20px', color: '#ffffff', fontFamily: 'Ari' }
    ).setOrigin(0.5);

    // --- Barra di caricamento ---
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(this.scale.width / 2 - 160, this.scale.height / 2 - 10, 320, 30);

    // --- Eventi del caricamento ---
		/**
		 * @param {number} value
		*/
    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(this.scale.width / 2 - 150, this.scale.height / 2, 300 * value, 10);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.setText('Pronto!');
    });
	}

	// ----------------------------------------------------------------------------
	// UI IMAGES
	// ----------------------------------------------------------------------------
	loadImages() {
    this.load.image('quailscore', 'ui/quailscore.png');
    this.load.image('settings', 'ui/settings.png');
    this.load.image('attack', 'ui/attack.png');
    this.load.image('run', 'ui/run.png');
    this.load.image('zoom', 'ui/zoom.png');
    this.load.image('heart', 'ui/heart.png');
    this.load.image('wine', 'sprites/wine.png');
		this.load.spritesheet('faces', 'ui/hud-faces.png', {
			frameWidth: 128,
			frameHeight: 128
		});
	}

	// ----------------------------------------------------------------------------
	// SPRITESHEETS
	// ----------------------------------------------------------------------------
  loadSprite() {
		this.load.atlas('player', 'sprites/player.png', 'sprites/player.json');
		this.load.atlas('npc-vincenzo', 'sprites/npc-vincenzo.png', 'sprites/npc-vincenzo.json');
		this.load.atlas('npc-giovanni', 'sprites/npc-giovanni.png', 'sprites/npc-giovanni.json');
		this.load.atlas('quail', 'sprites/quail.png', 'sprites/quail.json');
  }

	// ----------------------------------------------------------------------------
	// MAP
	// ----------------------------------------------------------------------------
	loadMap() {
    this.load.image('general', 'tilesets/general.png');
    this.load.image('houses', 'tilesets/houses.png');
    this.load.tilemapTiledJSON('map', 'maps/mappa.json');
	}

	// ----------------------------------------------------------------------------
	// AUDIO
	// ----------------------------------------------------------------------------
	loadAudio() {
    this.load.audio('player-attack', 'audio/player-attack.mp3');
    this.load.audio('player-hurt', 'audio/player-hurt.mp3');
    this.load.audio('player-run', 'audio/player-run.mp3');
    this.load.audio('background', 'audio/background.mp3');
	}
}
