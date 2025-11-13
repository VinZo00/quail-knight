import Phaser from 'phaser'
import NPC from '../entities/NPC.js';
import Player from '../entities/Player.js';
import Quail from '../entities/Quail.js';

/**
 * @extends Phaser.Scene
 * @property {Phaser.Physics.Arcade.Group} quailGroup
 * @property {Phaser.Physics.Arcade.Group} npcGroup
 * @property {Player} player
 */
export default class GameScene extends Phaser.Scene {
	constructor() {
		super({ key: 'GameScene' });
	}

	create() {
		// @ts-ignore
		// this.textures.setDefaultFilter(Phaser.Textures.FilterMode.NEAREST);
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
		this.physics.add.collider(this.quailGroup, this.collision);
		this.physics.add.collider(this.quailGroup, this.topLayer);
	}

	// ----------------------------------------------------------------------------
  // ANIMS
  // ----------------------------------------------------------------------------
	createAnims() {
		this.playerAnims();
		this.quailsAnims();
		this.npcsAnims();
	}

	playerAnims() {
		const directions = ['up', 'down', 'left', 'right'];

		// Animazioni IDLE (0–1)
		directions.forEach(dir => {
			this.anims.create({
				key: `player-idle-${dir}`,
				frames: this.anims.generateFrameNames('player', {
					prefix: `player_idle_${dir}_`,
					start: 0,
					end: 1
				}),
				frameRate: 2,
				repeat: -1
			});
		});

		// Animazioni WALK (0–8)
		directions.forEach(dir => {
			this.anims.create({
				key: `player-walk-${dir}`,
				frames: this.anims.generateFrameNames('player', {
					prefix: `player_walk_${dir}_`,
					start: 0,
					end: 8
				}),
				frameRate: 8,
				repeat: -1
			});
		});

		// Animazioni RUN (0–7)
		directions.forEach(dir => {
			this.anims.create({
				key: `player-run-${dir}`,
				frames: this.anims.generateFrameNames('player', {
					prefix: `player_run_${dir}_`,
					start: 0,
					end: 7
				}),
				frameRate: 12,
				repeat: -1
			});
		});

		// Animazioni ATTACK WALK (0–7)
		directions.forEach(dir => {
			this.anims.create({
				key: `player-attack-walk-${dir}`,
				frames: this.anims.generateFrameNames('player', {
					prefix: `player_attack_walk_${dir}_`,
					start: 0,
					end: 11
				}),
				frameRate: 20,
				repeat: 0
			});
		});

		// Animazioni ATTACK (0–5)
		directions.forEach(dir => {
			this.anims.create({
				key: `player-attack-${dir}`,
				frames: this.anims.generateFrameNames('player', {
					prefix: `player_attack_${dir}_`,
					start: 0,
					end: 5
				}),
				frameRate: 15,
				repeat: 0
			});
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

	npcsAnims() {
		this.createNPCAnims('npc-giovanni');
		this.createNPCAnims('npc-vincenzo');
	}

	/**
	 * Crea le animazioni per un determinato NPC
	 * @param {string} key - Nome della spritesheet dell’NPC
	*/
	createNPCAnims(key) {
		const anims = this.anims;

		anims.create({
			key: `${key}-walk-up`,
			frames: anims.generateFrameNumbers(key, { start: 0, end: 8 }),
			frameRate: 10,
			repeat: -1
		});

		anims.create({
			key: `${key}-walk-left`,
			frames: anims.generateFrameNumbers(key, { start: 9, end: 17 }),
			frameRate: 10,
			repeat: -1
		});

		anims.create({
			key: `${key}-walk-down`,
			frames: anims.generateFrameNumbers(key, { start: 18, end: 26 }),
			frameRate: 10,
			repeat: -1
		});

		anims.create({
			key: `${key}-walk-right`,
			frames: anims.generateFrameNumbers(key, { start: 27, end: 35 }),
			frameRate: 10,
			repeat: -1
		});

		anims.create({ key: `${key}-idle-up`, frames: [{ key, frame: 16 }] });
		anims.create({ key: `${key}-idle-down`, frames: [{ key, frame: 17 }] });
		anims.create({ key: `${key}-idle-right`, frames: [{ key, frame: 18 }] });
		anims.create({ key: `${key}-idle-left`, frames: [{ key, frame: 19 }] });
	}


	// ----------------------------------------------------------------------------
  // GRUPPO (PERSONAGGI - SPRITES)
  // ----------------------------------------------------------------------------
	createGroup() {

		// Quails
		this.quailGroup = this.physics.add.group();

		for (let i = 0; i < 50; i++) {
				let x, y;
				let safe = false;

				while (!safe) {
					x = Phaser.Math.Between(50, this.map.widthInPixels - 50);
					y = Phaser.Math.Between(50, this.map.heightInPixels - 50);

					const tile = this.collision.getTileAtWorldXY(x, y);
					if (!tile) safe = true;
				}

				const quail = new Quail(this, x, y, 'quail');
				// @ts-ignore
				quail.sprite.quail = quail;
				this.quailGroup.add(quail.sprite);
		}

		// Player
		this.player = new Player(this, 150, 300, 'vinzo');

		// Objects
		this.star = this.physics.add.sprite(100, 200, 'star').setScale(2).setImmovable();

		// INSERISCO NPCS
		this.npcGroup = this.physics.add.group();

		const vincenzo = new NPC(this, 180, 250, 'npc-vincenzo', {
			name: 'Vincenzo',
			dialogueText: 'Mi sa che stasera non esco',
			movementType: 'y', // 'x' | 'y' | 'idle'
			distance: 100,     // px
			speed: 50,         // px/s
			startDir: 'pos',   // opzionale: 'pos' (default) o 'neg'
			// idleDir: 'right',   // opzionale: se fermo, quale idle usare
		});

		const giovanni = new NPC(this, 250, 300, 'npc-giovanni', {
			name: 'Giovanni',
			dialogueText: 'oggi mi sento proprio gay',
			movementType: 'x',
			distance: 500,
			speed: 20,
			startDir: 'pos',
			idleDir: 'down',
		});

		this.npcGroup.add(giovanni.sprite);
		this.npcGroup.add(vincenzo.sprite);
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
				talk: Phaser.Input.Keyboard.KeyCodes.T,
				shift: Phaser.Input.Keyboard.KeyCodes.SHIFT
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
