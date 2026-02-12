import Phaser from 'phaser'
import NPC from '../entities/NPC.js';
import Player from '../entities/Player.js';
import Quail from '../entities/Quail.js';
import { GAME_SETTINGS } from '../Settings.js';
import { GameState } from '../GameState.js';

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
		this.events.on(Phaser.Scenes.Events.PAUSE, this.pause, this);
		this.ui();		
		this.quietModeSet();
		this.addAudios();
		this.createMap();
		this.createGroup();
		if (!this.anims.exists('player-walk-up')) {
			this.createAnims();
		}
		this.bindKeys();
		this.createCamera();
		this.generateCollision();
		this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
	}

	update() {
		if (this.gameOver) return;

		this.player.update(this.keys, this.cursorKeys);

		this.quailGroup.getChildren().forEach(sprite => {
				// @ts-ignore
        sprite.quail.update(this.player);
    });
	}

	pause() {
    this.player.pauseSounds();
	}

	shutdown() {
    this.game.events.off('toggleMusic', this.onToggleMusic);
    this.game.events.off('toggleQuiet', this.onToggleQuiet);
    this.game.events.off('run_down', this.onRunDown);
    this.game.events.off('run_up', this.onRunUp);
    this.game.events.off('attack_down', this.onAttackDown);
    this.game.events.off('attack_up', this.onAttackUp);
		GameState.reset();
		this.sound.stopAll();
	}


	// ----------------------------------------------------------------------------
	// UI
	// ----------------------------------------------------------------------------
	ui() {
    this.scene.launch('UIScene'); 
    this.scene.bringToTop('UIScene'); 
    this.score = 0;
		this.gameOver = false;
		this.quietMode = false;
	}

	// ----------------------------------------------------------------------------
	// QUIET MODE
	// ----------------------------------------------------------------------------
	quietModeSet() {
			this.quietMode = false;

			this.onToggleQuiet = /** @param {boolean} enabled */ (enabled) => {
					this.quietMode = enabled;
			};
			
			this.game.events.on('toggleQuiet', this.onToggleQuiet);
	}
	// ----------------------------------------------------------------------------
	// AUDIO
	// ----------------------------------------------------------------------------
	addAudios() {
			this.soundBG = this.sound.add('background', { loop: true, volume: 0.1 });
			this.soundBG.play();
			this.musicEnabled = true;
			
			this.onToggleMusic = /** @param {boolean} enabled */ (enabled) => {
					this.musicEnabled = enabled;
					if (enabled) {
							if (this.soundBG.isPaused) {
									this.soundBG.resume();
							} else if (!this.soundBG.isPlaying) {
									this.soundBG.play();
							}
					} else {
							this.soundBG.pause();
					}
			};
			
			this.game.events.on('toggleMusic', this.onToggleMusic);
	}

	// ----------------------------------------------------------------------------
  // COLLISION
  // ----------------------------------------------------------------------------
	generateCollision() {
		this.physics.add.collider(this.player.sprite, this.solidityLayer);
		this.physics.add.collider(this.player.sprite, this.overlapLayer);
		this.physics.add.collider(this.player.sprite, this.elementsLayer);

		this.physics.add.overlap(this.player.sprite, this.wineGroup, this.collectLife, null, this);

		this.physics.add.collider(this.quailGroup, this.solidityLayer);
		this.physics.add.collider(this.quailGroup, this.overlapLayer);
		this.physics.add.collider(this.quailGroup, this.elementsLayer);
	}

	/**
	 * Callback di overlap tra player e pickup vita.
	 * Elimina il pickup e aggiorna lo stato globale delle vite.
	 *
	 * @param {Phaser.Types.Physics.Arcade.GameObjectWithBody} player
	 * @param {Phaser.Types.Physics.Arcade.GameObjectWithBody} life
	*/
	collectLife(player, life) {
		if (GameState.lives != GameState.maxLives) {
		  life.destroy();
			GameState.addLife();
			this.game.events.emit('livesChanged', GameState.lives);	
		}
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
					prefix: `player-idle-${dir}-`,
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
					prefix: `player-walk-${dir}-`,
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
					prefix: `player-run-${dir}-`,
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
					prefix: `player-attack-walk-${dir}-`,
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
					prefix: `player-attack-${dir}-`,
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
					const elementsTile = this.elementsLayer.getTileAtWorldXY(x, y);
		 			
					if ((!solidityTile || !solidityTile.properties.collides) &&
							(!elementsTile || !elementsTile.properties.noSpawn) &&
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

		// WINE
		this.wineGroup = this.physics.add.group({
				allowGravity: false,
				immovable: true
		});
		for (let i = 0; i < 50; i++) {
			let x, y;
			let safe = false;

			while (!safe) {
					x = Phaser.Math.Between(50, this.map.widthInPixels - 50);
					y = Phaser.Math.Between(50, this.map.heightInPixels - 50);

					const solidityTile = this.solidityLayer.getTileAtWorldXY(x, y);
					const decorationTile = this.decorationLayer.getTileAtWorldXY(x, y);
					const elementsTile = this.elementsLayer.getTileAtWorldXY(x, y);

					if (
							(!solidityTile || !solidityTile.properties.collides) &&
							(!elementsTile || !elementsTile.properties.noSpawn) &&
							(!decorationTile || !decorationTile.properties.noSpawn)
					) {
							safe = true;
					}
			}

			const wine = this.wineGroup.create(x, y, 'wine');
			wine.setOrigin(0.5, 0.5).setScale(.3);
	}


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
		const houses = map.addTilesetImage('houses', 'houses');

		this.terrainlayer = map.createLayer('terrain', [terrain]).setDepth(-3);
		this.decorationLayer = map.createLayer('decorations', [terrain]).setDepth(-2);
		this.elementsLayer = map.createLayer('elements', [terrain]).setDepth(-1);
		this.overlapLayer = map.createLayer('overlap', [terrain, houses]).setDepth(2);
		this.topLayer = map.createLayer('top', [terrain]).setDepth(2);

		this.solidityLayer = map.createLayer('solidity', [terrain]);
		this.spawnLayer = map.getObjectLayer('spawns');

		this.solidityLayer.setCollisionByProperty({ collides: true });
		this.elementsLayer.setCollisionByProperty({ collides: true });
		this.overlapLayer.setCollisionByProperty({ collides: true });

		this.solidityLayer.setVisible(false);

		this.map = map;
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
			
			// ✅ SALVA I RIFERIMENTI
			this.onUIReady = (payload) => {
					this.cursorKeys = payload.cursorKeys;
			};
			
			this.onRunDown = () => {
					this.isRunTouch = true;
			};
			
			this.onRunUp = () => {
					this.isRunTouch = false;
			};
			
			this.onAttackDown = () => {
					this.isAttackTouch = true;
			};
			
			this.onAttackUp = () => {
					this.isAttackTouch = false;
			};
			
			// ✅ USA I RIFERIMENTI
			this.game.events.once('ui_ready', this.onUIReady);
			this.game.events.on('run_down', this.onRunDown);
			this.game.events.on('run_up', this.onRunUp);
			this.game.events.on('attack_down', this.onAttackDown);
			this.game.events.on('attack_up', this.onAttackUp);
	}

  // ----------------------------------------------------------------------------
  // CAMERA
  // ----------------------------------------------------------------------------
	createCamera() {
		this.cam = this.cameras.main;
		if (GAME_SETTINGS.isMobile) {
    	this.cam.setZoom(1.2);
		} else {
			this.cam.setZoom(1.5);
		}
		this.cam.startFollow(this.player.sprite);
		this.cam.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
	}

}
