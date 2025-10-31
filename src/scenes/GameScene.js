import Phaser from 'phaser'
import NPC from '../entities/NPC.js';  // ricordati il .js

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
		// this.createGroups();
		
		// --- Player ---
		// this.player = this.physics.add.sprite(this.map.widthInPixels / 2, this.map.heightInPixels / 2, 'player').setDepth(1);
		this.player = this.physics.add.sprite(150, 300, 'player').setDepth(1);
		this.player.setCollideWorldBounds(true).setSize(20, 30).setScale(0.7);

		// @todo creare un array di npcs 
		// this.npcs = [];

		this.star = this.physics.add.sprite(100, 200, 'star').setScale(2).setImmovable();

		this.bindKeys();

		this.lastDirection = 'down';

		// --- Collision ---
		this.physics.add.collider(this.player, this.collision);
		this.physics.add.collider(this.player, this.topLayer);
		this.physics.add.overlap(this.player, this.topLayer);
		this.physics.add.overlap(this.player, this.collision);


		this.createCamera();
		this.createAnims();

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

		const giovanni = new NPC(this, 250, 300, 'antonio', {
			name: 'Giovanni',
			dialogueText: 'oggi mi sento proprio gay',
			movementType: 'idle', // 'x' | 'y' | 'idle'
			distance: 100,     // px
			speed: 50,         // px/s
			startDir: 'pos',   // opzionale: 'pos' (default) o 'neg'
			idleDir: 'down',   // opzionale: se fermo, quale idle usare
		});

		console.log(this.scene.scene.anims.anims.entries);
		// this.npcGroup.add(antonio.sprite);
		this.npcGroup.add(giovanni.sprite);
		this.physics.add.collider(this.player, this.npcGroup);

	}

	update() {
		if (this.gameOver) return;

		this.physics.world.collide(this.player, this.star, () => {
			console.log('Collisione (controllo manuale)');
		});

		// PULSANTI PER MUOVERE IL PERSONAGGIO
		// @ts-ignore
		const moving = this.keys.left.isDown || this.keys.right.isDown ||
		// @ts-ignore
			this.keys.up.isDown || this.keys.down.isDown ||
			(this.cursorKeys && (this.cursorKeys.left.isDown || this.cursorKeys.right.isDown ||
				this.cursorKeys.up.isDown || this.cursorKeys.down.isDown));

		// Movimento
		this.handleMovement();

		// Attacco
		this.handleAttack(moving);
	}

	// CREA MAPPA
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

	// PULSANTI
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

	// CREA CAMERA
	createCamera() {
		this.cam = this.cameras.main;
    this.cam.setZoom(1.5);
		this.cam.startFollow(this.player);
		this.cam.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
	}

	// ANIMAZIONI
	createAnims() {
		const animations = [
			// Movimento
			{ key: 'up', sheet: 'vinzo', start: 0, end: 8, frameRate: 9, repeat: -1 },
			{ key: 'left', sheet: 'vinzo', start: 9, end: 17, frameRate: 9, repeat: -1 },
			{ key: 'down', sheet: 'vinzo', start: 18, end: 26, frameRate: 9, repeat: -1 },
			{ key: 'right', sheet: 'vinzo', start: 27, end: 35, frameRate: 9, repeat: -1 },

			// Idle
			{ key: 'idle-down', sheet: 'vinzo', start: 38, end: 39, frameRate: 2, repeat: -1 },
			{ key: 'idle-left', sheet: 'vinzo', start: 45, end: 46, frameRate: 2, repeat: -1 },
			{ key: 'idle-right', sheet: 'vinzo', start: 47, end: 48, frameRate: 2, repeat: -1 },
			{ key: 'idle-up', sheet: 'vinzo', start: 36, end: 37, frameRate: 2, repeat: -1 },

			// Attacco fermo
			{ key: 'attack-down', sheet: 'player-attack', start: 0, end: 7, frameRate: 10, repeat: 0 },
			{ key: 'attack-left', sheet: 'player-attack', start: 8, end: 15, frameRate: 10, repeat: 0 },
			{ key: 'attack-right', sheet: 'player-attack', start: 16, end: 23, frameRate: 10, repeat: 0 },
			{ key: 'attack-up', sheet: 'player-attack', start: 24, end: 31, frameRate: 10, repeat: 0 },

			// Attacco camminando
			{ key: 'attack-walk-down', sheet: 'player-attack-walk', start: 0, end: 7, frameRate: 10, repeat: 0 },
			{ key: 'attack-walk-left', sheet: 'player-attack-walk', start: 8, end: 15, frameRate: 10, repeat: 0 },
			{ key: 'attack-walk-right', sheet: 'player-attack-walk', start: 16, end: 23, frameRate: 10, repeat: 0 },
			{ key: 'attack-walk-up', sheet: 'player-attack-walk', start: 24, end: 31, frameRate: 10, repeat: 0 },
		];

		animations.forEach(anim => {
			this.anims.create({
				key: anim.key,
				frames: this.anims.generateFrameNumbers(anim.sheet, { start: anim.start, end: anim.end }),
				frameRate: anim.frameRate,
				repeat: anim.repeat
			});
		});
	}

	// MUOVI CON PULSANTI
	handleMovement() {
		this.speed = 160;
		const speed = this.currentSpeed ?? this.speed;
		let velocityX = 0;
		let velocityY = 0;

		// @ts-ignore
		const left = this.keys.left.isDown || (this.cursorKeys && this.cursorKeys.left.isDown);
		// @ts-ignore
		const right = this.keys.right.isDown || (this.cursorKeys && this.cursorKeys.right.isDown);
		// @ts-ignore
		const up = this.keys.up.isDown || (this.cursorKeys && this.cursorKeys.up.isDown);
		// @ts-ignore
		const down = this.keys.down.isDown || (this.cursorKeys && this.cursorKeys.down.isDown);

		if (left) velocityX = -speed;
		if (right) velocityX = speed;
		if (up) velocityY = -speed;
		if (down) velocityY = speed;

		this.player.setVelocity(velocityX, velocityY);

		// Animazioni solo se NON sta attaccando
		if (!this.isAttacking) {
			if (velocityX !== 0 || velocityY !== 0) {
				if (velocityX < 0) this.player.anims.play('left', true), this.lastDirection = 'left';
				else if (velocityX > 0) this.player.anims.play('right', true), this.lastDirection = 'right';
				else if (velocityY < 0) this.player.anims.play('up', true), this.lastDirection = 'up';
				else if (velocityY > 0) this.player.anims.play('down', true), this.lastDirection = 'down';
			} else {
				this.player.setVelocity(0, 0);
				this.player.anims.play(`idle-${this.lastDirection}`, true);
				console.log(this.player.anims);
			}
		}
	}

	// ATTACCA CON SPACE
	handleAttack(moving = false) {
		if (this.isAttacking) return;
		// @ts-ignore
		if (Phaser.Input.Keyboard.JustDown(this.keys.attack)) {
			this.attack(moving);
		}
	}

	// ATTACCO
	attack(moving = false) {
		this.isAttacking = true;

		if (moving) {
			this.currentSpeed = this.speed * 0.5;
		} else {
			this.player.setVelocity(0, 0);
		}

		const animKey = moving ? `attack-walk-${this.lastDirection}` : `attack-${this.lastDirection}`;
		this.player.anims.play(animKey, false);

		this.player.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
			if (animation.key === animKey) {
				this.isAttacking = false;
				this.currentSpeed = this.speed;
			}
		});
	}
}
