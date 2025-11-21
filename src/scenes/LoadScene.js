import Phaser from 'phaser';

export default class LoadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LoadScene' });
  }

  preload() {
		// --- Load bar ---
		this.loadFonts();
		this.loadBar();

    // --- Caricamento risorse (tutte le tue) ---
    this.loadImages();
    this.loadSprite();
    this.loadMap();
    this.loadAudio();
  }

  create() {
    this.scene.start('GameScene');
  }

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

	// UI
	loadImages() {
    this.load.image('quailscore', 'ui/quailscore.png');
    this.load.image('star', 'sprites/star.png');
    this.load.image('bomb', 'sprites/bomb.png');
	}

  loadSprite() {
		this.load.spritesheet('faces', 'ui/hud-faces.png', {
			frameWidth: 128,
			frameHeight: 128
		});
		
		// Spritesheet del player
		this.load.atlas('player', 'sprites/player.png', 'sprites/player.json');
		this.load.atlas('npc-vincenzo', 'sprites/npc-vincenzo.png', 'sprites/npc-vincenzo.json');
    this.load.spritesheet('quail', 'sprites/quail.png', { frameWidth: 64, frameHeight: 64	 });
  }

	// Tilemap
	loadMap() {
    this.load.image('terrain', 'tilesets/terrain_atlas.png');
    this.load.tilemapTiledJSON('map', 'maps/mappa.json');
	}

	loadAudio() {
    this.load.audio('player-attack', 'audio/player-attack.mp3');
    this.load.audio('background', 'audio/background.mp3');
	}
}
