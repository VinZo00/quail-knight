import Phaser from 'phaser';

export default class LoadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LoadScene' });
  }

  preload() {
    // --- Testo "Caricamento..." ---
    const loadingText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 40,
      'Caricamento...',
      { fontSize: '20px', color: '#ffffff', fontFamily: 'monospace' }
    ).setOrigin(0.5);

    // --- Barra di caricamento ---
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(this.scale.width / 2 - 160, this.scale.height / 2 - 10, 320, 30);

    // --- Eventi del caricamento ---
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

    // --- Caricamento risorse (tutte le tue) ---
    this.loadAssets();
  }

  create() {
    // Dopo il caricamento → vai alla scena di gioco
    this.scene.start('GameScene');
  }

  // --- Raggruppo tutte le risorse ---
  loadAssets() {
    // Immagini
    this.load.image('ground', 'sprites/platform.png');
    this.load.image('star', 'sprites/star.png');
    this.load.image('bomb', 'sprites/bomb.png');

    // Spritesheet del player
    this.load.spritesheet('player', 'sprites/player.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('player-idle', 'sprites/player-idle.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('player-attack', 'sprites/player-attack.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('player-attack-walk', 'sprites/player-attack-run.png', { frameWidth: 64, frameHeight: 64 });

    // Tilemap
    this.load.image('terrain', 'tilesets/terrain_atlas.png');
    this.load.tilemapTiledJSON('map', 'maps/mappa.json');

    // Suoni (opzionali)
    // this.load.audio('music', 'audio/menu-intro.mp3');
  }
}
