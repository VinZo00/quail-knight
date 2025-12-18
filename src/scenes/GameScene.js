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
    this.scene.launch('UIScene'); 
    this.scene.bringToTop('UIScene'); 
    this.score = 0;
		this.gameOver = false;		
		this.addAudios();
		this.createMap();
		this.createGroup();
		this.createAnims();
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
	// AUDIO
	// ----------------------------------------------------------------------------
	addAudios() {
		this.soundBG = this.sound.add('background', { loop: true, volume: 0.1 });
		this.soundBG.play();
		this.musicEnabled = true;

		this.game.events.on('toggleMusic', /** @param {boolean} enabled */ (enabled) => {
				this.musicEnabled = enabled;
        if (enabled) {
            if (this.soundBG.isPaused) {
                this.soundBG.resume();
            } else {
                this.soundBG.play();
            }
        } else {
            this.soundBG.pause();
        }
    });
	}

	// ----------------------------------------------------------------------------
  // COLLISION
  // ----------------------------------------------------------------------------
	generateCollision() {
		this.physics.add.collider(this.player.sprite, this.solidityLayer);
		this.physics.add.collider(this.player.sprite, this.overlapLayer);
		this.physics.add.collider(this.player.sprite, this.elementsLayer);
		// this.physics.add.collider(this.player.sprite, this.collision);
		// this.physics.add.collider(this.player.sprite, this.topLayer);
		// this.physics.add.collider(this.player.sprite, this.npcGroup);
		this.physics.add.collider(this.quailGroup, this.solidityLayer);
		this.physics.add.collider(this.quailGroup, this.overlapLayer);
		this.physics.add.collider(this.quailGroup, this.elementsLayer);
		// this.physics.add.collider(this.quailGroup, this.topLayer);
	}

	// ----------------------------------------------------------------------------
  // ANIMS
  // ----------------------------------------------------------------------------
	createAnims() {
		this.directions = ['up', 'down', 'left', 'right'];
		this.playerAnims();
		this.quailsAnims();
		this.npcsAnims();
	}

	playerAnims() {

		// Animazioni IDLE (0–1)
		this.directions.forEach(dir => {
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
		this.directions.forEach(dir => {
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
		this.directions.forEach(dir => {
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
		this.directions.forEach(dir => {
			this.anims.create({
				key: `player-attack-walk-${dir}`,
				frames: this.anims.generateFrameNames('player', {
					prefix: `player_attack_walk_${dir}_`,
					start: 0,
					end: 11
				}),
				frameRate: 20,
				repeat: -1
			});
		});

		// Animazioni ATTACK (0–5)
		this.directions.forEach(dir => {
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

		this.anims.create({
			key: `quail-death`,
			frames: [{ key: 'quail', frame: `quail-death` }],
			frameRate: 1,
			repeat: 0
		});
			
		this.directions.forEach(dir => {
			this.anims.create({
				key: `quail-walk-${dir}`,
				frames: this.anims.generateFrameNames('quail', {
					prefix: `quail-walk-${dir}-`,
					start: 0,
					end: 3
				}),
				frameRate: 6,
				repeat: -1
			});

			this.anims.create({
					key: `quail-idle-${dir}`,
					frames: [{ key: 'quail', frame: `quail-idle-${dir}` }],
					frameRate: 1,
					repeat: 0
			});
		
		});
	}

	npcsAnims() {
		// @ts-ignore
    this.npcGroup.children.each(npc => {
				// @ts-ignore
        const key = npc.texture.key;
        this.createNPCAnims(key);
    });
	}

	/**
	 * Crea le animazioni per un determinato NPC
	 * @param {string} key - Nome della spritesheet dell’NPC
	*/
	createNPCAnims(key) {

		this.directions.forEach(dir => {

			// WALK
			this.anims.create({
				key: `${key}-walk-${dir}`,
				frames: this.anims.generateFrameNames(key, {
					prefix: `${key}-walk-${dir}-`,
					start: 0,
					end: 8
				}),
				frameRate: 10,
				repeat: -1
			});

			// IDLE
			this.anims.create({
				key: `${key}-idle-${dir}`,
				frames: this.anims.generateFrameNames(key, {
					prefix: `${key}-idle-${dir}-`,
					start: 0,
					end: 1
				}),
				frameRate: 2,
				repeat: -1
			});
			
		});
	}


	// ----------------------------------------------------------------------------
  // GRUPPO (PERSONAGGI - SPRITES)
  // ----------------------------------------------------------------------------
	createGroup() {

		// QUAILS
		this.quailGroup = this.physics.add.group()
		
		for (let i = 0; i < 50; i++) {
		 		let x, y;
		 		let safe = false;

		 		while (!safe) {
		 			x = Phaser.Math.Between(50, this.map.widthInPixels - 50);
		 			y = Phaser.Math.Between(50, this.map.heightInPixels - 50);
					const solidityTile = this.solidityLayer.getTileAtWorldXY(x, y);
					const decorationTile = this.decorationLayer.getTileAtWorldXY(x, y);
		 			
					if ((!solidityTile || !solidityTile.properties.collides) &&
							(!decorationTile || !decorationTile.properties.noSpawn)) {
							safe = true;
					}
		 		}

		 		const quail = new Quail(this, x, y, 'quail');
		 		// @ts-ignore
		 		this.quailGroup.add(quail.sprite);
		 }

		// PLAYER
		const playerSpawn = this.spawnLayer.objects.find(o => o.type === 'player');
		const tileW = this.map.tileWidth;
		const tileH = this.map.tileHeight;
		const spawnX = playerSpawn.x + tileW / 2;
		const spawnY = playerSpawn.y + tileH / 2;
		this.player = new Player(this, spawnX, spawnY, 'player');

		// Objects
		this.star = this.physics.add.sprite(100, 200, 'star').setScale(2).setImmovable();

		// INSERISCO NPCS
		this.npcGroup = this.physics.add.group();

		// VINCENZO
		// const vincenzo = new NPC(this, 180, 250, 'npc-vincenzo', {
		// 	name: 'Vincenzo',
		// 	dialogueText: 'Mi sa che stasera non esco',
		// 	movementType: 'y', // 'x' | 'y' | 'idle'
		// 	distance: 100,     // px
		// 	speed: 50,         // px/s
		// 	startDir: 'pos',   // opzionale: 'pos' (default) o 'neg'
		// 	// idleDir: 'right',   // opzionale: se fermo, quale idle usare
		// });

		// GIOVANNI
		this.spawnNPCFromPoint('spawn-npc-giovanni', 'npc-giovanni', {
				name: 'Giovanni',
				dialogueText: 'Ciao, benvenuto nel mio villaggio! CIao ciacocaspodjaidjsaiodjaisdjaiodjsoidjisao',
				movementType: 'x',
				distance: 500,
				speed: 20,
				startDir: 'pos',
				idleDir: 'down',
		});
	}

  // ----------------------------------------------------------------------------
  // HELPER PER SPAWNS
  // ----------------------------------------------------------------------------
	/**
	 * Spawna un NPC a partire da un Point definito in Tiled.
	 *
	 * @param {string} spawnName - Il nome del Point in Tiled (campo Name).
	 * @param {string} spriteKey - La chiave dello sprite da usare per l'NPC.
	 * @param {Object} [options={}] - Opzioni aggiuntive da passare al costruttore NPC.
	 * @returns {NPC|null} - L'NPC creato, oppure null se il Point non è stato trovato.
	*/
	spawnNPCFromPoint(spawnName, spriteKey, options = {}) {
			const spawnPoint = this.spawnLayer.objects.find(
					o => o.type === 'npc' && o.name === spawnName
			);

			if (!spawnPoint) {
					console.warn(`Spawn point "${spawnName}" non trovato!`);
					return null;
			}

			const x = spawnPoint.x + this.map.tileWidth / 2;
			const y = spawnPoint.y + this.map.tileHeight / 2;

			const npc = new NPC(this, x, y, spriteKey, options);
			this.npcGroup.add(npc.sprite);

			return npc;
	}



  // ----------------------------------------------------------------------------
  // MAPPA
  // ----------------------------------------------------------------------------
	createMap() {
    const map = this.make.tilemap({ key: 'map' });
		const terrain = map.addTilesetImage('general', 'general');
		// const water = map.addTilesetImage('terrain', 'water');
		const houses = map.addTilesetImage('houses', 'houses');
		// const tree = map.addTilesetImage('trees', 'tree');

		const terrainLayer = map.createLayer('terrain', [terrain]).setDepth(-3);
		const decorationLayer = map.createLayer('decorations', [terrain]).setDepth(-2);
		const elementsLayer = map.createLayer('elements', [terrain]).setDepth(-1);
		const overlapLayer = map.createLayer('overlap', [terrain, houses]).setDepth(2);
		const topLayer = map.createLayer('top', [terrain]).setDepth(2);

		const solidityLayer = map.createLayer('solidity', [terrain]);
		const spawnLayer = map.getObjectLayer('spawns');

		solidityLayer.setCollisionByProperty({ collides: true });
		elementsLayer.setCollisionByProperty({ collides: true });
		overlapLayer.setCollisionByProperty({ collides: true });

		solidityLayer.setVisible(false);

		// const topLayer = map.createLayer('top', [terrain]).setDepth(2);
		// const collision = map.createLayer('collision', [terrain]);
		
		// collision.setCollisionByExclusion([-1]);
		// topLayer.setCollisionByProperty({ collision: true });

		// topLayer.setTileLocationCallback(6, 9, 1, 1, () => {
		// 	console.log('Sono sul pomodoro!');
		// 	topLayer.setTileLocationCallback(6, 9, 1, 1, null);
		// })

		this.map = map;
		this.solidityLayer = solidityLayer;
		this.elementsLayer = elementsLayer;
		this.decorationLayer = decorationLayer;
		this.overlapLayer = overlapLayer;
		this.spawnLayer = spawnLayer;
		// this.topLayer = topLayer;
		// this.collision = collision;
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
		this.isRunTouch = false;
		this.game.events.on('run_down', () => {
				this.isRunTouch = true;
		});
		this.game.events.on('run_up', () => {
				this.isRunTouch = false;
		});
		this.game.events.on('attack_down', () => {
				this.isAttackTouch = true;
		});
		this.game.events.on('attack_up', () => {
				this.isAttackTouch = false;
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
