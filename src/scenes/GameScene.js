import Phaser from 'phaser'
import NPC from '../entities/NPC.js';
import Player from '../entities/Player.js';
import Quail from '../entities/Quail.js';

export default class GameScene extends Phaser.Scene {
	constructor() {
		super({ key: 'GameScene' });
	}

	create() {
    this.scene.launch('UIScene'); 
    this.scene.bringToTop('UIScene'); 

    this.score = 0;
		this.gameOver = false;

    // ogni volta che cambia lo score:
    // this.score += 10;
    this.game.events.emit('scoreChanged', this.score);

		// this.addAudios();
		this.createMap();
		this.createAnims();
		this.createGroup();
		this.bindKeys();
		this.createCamera();
		this.generateCollision();
	}

	update() {
		if (this.gameOver) return;

		this.player.update(this.keys, this.cursorKeys);

		this.physics.world.collide(this.player.sprite, this.star, () => {
			console.log('Collisione (controllo manuale)');
		});

		this.quailGroup.getChildren().forEach(sprite => {
				// @ts-ignore
        sprite.quail.update(this.player);
    });
	}

	// ----------------------------------------------------------------------------
  // COLLISION
  // ----------------------------------------------------------------------------
	generateCollision() {
		this.physics.add.collider(this.player.sprite, this.collision);
		this.physics.add.collider(this.player.sprite, this.topLayer);
		this.physics.add.collider(this.player.sprite, this.npcGroup);
		this.physics.add.collider(this.player.sprite, this.quailGroup);
	}

	// ----------------------------------------------------------------------------
  // ANIMS
  // ----------------------------------------------------------------------------
	createAnims() {
		this.playerAnims();
		this.quailsAnims();
	}

	// @todo ottimizzare qui
	playerAnims() {
		const anims = this.anims;
		const animations = [
      { key: 'up', sheet: 'player', start: 0, end: 7, frameRate: 9, repeat: -1 },
      { key: 'left', sheet: 'player', start: 8, end: 15, frameRate: 9, repeat: -1 },
      { key: 'down', sheet: 'player', start: 16, end: 23, frameRate: 9, repeat: -1 },
      { key: 'right', sheet: 'player', start: 24, end: 31, frameRate: 9, repeat: -1 },

      { key: 'idle-down', sheet: 'vinzo', start: 38, end: 39, frameRate: 2, repeat: -1 },
      { key: 'idle-left', sheet: 'vinzo', start: 45, end: 46, frameRate: 2, repeat: -1 },
      { key: 'idle-right', sheet: 'vinzo', start: 47, end: 48, frameRate: 2, repeat: -1 },
      { key: 'idle-up', sheet: 'vinzo', start: 36, end: 37, frameRate: 2, repeat: -1 },

      { key: 'attack-down', sheet: 'player-attack', start: 14, end: 19, frameRate: 10, repeat: 0 },
      { key: 'attack-left', sheet: 'player-attack', start: 7, end: 12, frameRate: 10, repeat: 0 },
      { key: 'attack-right', sheet: 'player-attack', start: 21, end: 26, frameRate: 10, repeat: 0 },
      { key: 'attack-up', sheet: 'player-attack', start: 0, end: 5, frameRate: 10, repeat: 0 },

      { key: 'attack-walk-down', sheet: 'player-slash', start: 26, end: 38, frameRate: 10, repeat: 0 },
      { key: 'attack-walk-left', sheet: 'player-slash', start: 13, end: 25, frameRate: 10, repeat: 0 },
      { key: 'attack-walk-right', sheet: 'player-slash',start: 39, end: 51, frameRate: 10, repeat: 0 },
      { key: 'attack-walk-up', sheet: 'player-slash', start: 0, end: 12, frameRate: 10, repeat: 0 },
    ];

    animations.forEach(anim => {
      if (!anims.exists(anim.key)) {
        anims.create({
          key: anim.key,
          frames: anims.generateFrameNumbers(anim.sheet, { start: anim.start, end: anim.end }),
          frameRate: anim.frameRate,
          repeat: anim.repeat
        });
      }
    });
	}

	quailsAnims() {
		const scene = this;
		scene.anims.create({
			key: 'quail-walk-up',
			frames: scene.anims.generateFrameNumbers('quail', { start: 0, end: 3 }),
			frameRate: 6,
			repeat: -1
		});

		scene.anims.create({
			key: 'quail-walk-down',
			frames: scene.anims.generateFrameNumbers('quail', { start: 4, end: 7 }),
			frameRate: 6,
			repeat: -1
		});

		scene.anims.create({
			key: 'quail-walk-right',
			frames: scene.anims.generateFrameNumbers('quail', { start: 8, end: 11 }),
			frameRate: 6,
			repeat: -1
		});

		scene.anims.create({
			key: 'quail-walk-left',
			frames: scene.anims.generateFrameNumbers('quail', { start: 12, end: 15 }),
			frameRate: 6,
			repeat: -1
		});

		// Idle animations (quinta riga)
		scene.anims.create({
			key: 'quail-idle-up',
			frames: [{ key: 'quail', frame: 16 }],
			frameRate: 1
		});

		scene.anims.create({
			key: 'quail-idle-down',
			frames: [{ key: 'quail', frame: 17 }],
			frameRate: 1
		});

		scene.anims.create({
			key: 'quail-idle-right',
			frames: [{ key: 'quail', frame: 18 }],
			frameRate: 1
		});

		scene.anims.create({
			key: 'quail-idle-left',
			frames: [{ key: 'quail', frame: 19 }],
			frameRate: 1
		});
	}

	// ----------------------------------------------------------------------------
  // GRUPPO (PERSONAGGI - SPRITES)
  // ----------------------------------------------------------------------------
	createGroup() {
		// Player
		this.player = new Player(this, 150, 300, 'vinzo');

		// Objects
		this.star = this.physics.add.sprite(100, 200, 'star').setScale(2).setImmovable();

		// Quails
		this.quailGroup = this.add.group();
    for (let i = 0; i < 40; i++) {
        const x = Phaser.Math.Between(50, this.map.widthInPixels - 50);
        const y = Phaser.Math.Between(50, this.map.heightInPixels - 50);
        const quail = new Quail(this, x, y, 'quail');
				// @ts-ignore
				quail.sprite.quail = quail;
        this.quailGroup.add(quail.sprite);
    }

		// INSERISCO NPCS
		this.npcGroup = this.add.group();

		// const antonio = new NPC(this, 180, 250, 'antonio', {
		// 	name: 'Antonio',
		// 	dialogueText: 'Mi sa che stasera non esco',
		// 	movementType: 'x', // 'x' | 'y' | 'idle'
		// 	distance: 100,     // px
		// 	speed: 50,         // px/s
		// 	startDir: 'pos',   // opzionale: 'pos' (default) o 'neg'
		// 	// idleDir: 'right',   // opzionale: se fermo, quale idle usare
		// });

		const giovanni = new NPC(this, 250, 300, 'player', {
			name: 'Giovanni',
			dialogueText: 'oggi mi sento proprio gay',
			movementType: 'idle', // 'x' | 'y' | 'idle'
			distance: 100,     // px
			speed: 50,         // px/s
			startDir: 'pos',   // opzionale: 'pos' (default) o 'neg'
			idleDir: 'down',   // opzionale: se fermo, quale idle usare
		});

		// @ts-ignore
		console.log(this.scene.scene.anims.anims.entries);
		this.npcGroup.add(giovanni.sprite);
	}

  // ----------------------------------------------------------------------------
  // MAPPA
  // ----------------------------------------------------------------------------
	createMap() {
    const map = this.make.tilemap({ key: 'map' });
		const tiles = map.addTilesetImage('terrain_atlas', 'terrain');

		const bottomLayer = map.createLayer('bottom', tiles).setDepth(-1);
		const topLayer = map.createLayer('top', tiles).setDepth(2);
		const collision = map.createLayer('collision', tiles);
		
		collision.setCollisionByExclusion([-1]);
		topLayer.setCollisionByProperty({ collision: true });

		topLayer.setTileLocationCallback(6, 9, 1, 1, () => {
			console.log('Sono sul pomodoro!');
			topLayer.setTileLocationCallback(6, 9, 1, 1, null);
		})

		this.map = map;
		this.bottomLayer = bottomLayer;
		this.topLayer = topLayer;
		this.collision = collision;
		this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
	}

  // ----------------------------------------------------------------------------
  // PULSANTI
  // ----------------------------------------------------------------------------
	bindKeys() {
		// @ts-ignore
		this.keys = this.input.keyboard.addKeys({
				up: Phaser.Input.Keyboard.KeyCodes.W,
				down: Phaser.Input.Keyboard.KeyCodes.S,
				left: Phaser.Input.Keyboard.KeyCodes.A,
				right: Phaser.Input.Keyboard.KeyCodes.D,
				attack: Phaser.Input.Keyboard.KeyCodes.K,
				talk: Phaser.Input.Keyboard.KeyCodes.T
		});
		this.cursorKeys = null;
		this.game.events.once('ui_ready', (payload) => {
			this.cursorKeys = payload.cursorKeys;
		});
	}

  // ----------------------------------------------------------------------------
  // CAMERA
  // ----------------------------------------------------------------------------
	createCamera() {
		this.cam = this.cameras.main;
    this.cam.setZoom(1.5);
		this.cam.startFollow(this.player.sprite);
		this.cam.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
	}

}
