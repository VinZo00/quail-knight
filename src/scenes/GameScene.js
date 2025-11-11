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
