import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene {
	constructor() {
		super({ key: 'GameScene' });
	}

	create() {
    this.scene.launch('UIScene');              // avvia la scena HUD
    this.scene.bringToTop('UIScene');          // porta sopra

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

		this.antonio = this.physics.add.sprite(180, 250, 'player').setDepth(1);
		this.antonio.setImmovable(false).setPushable(false);
		this.antonio.setSize(20, 30);

		// Movimento npc
		this.npcMovement();

		this.star = this.physics.add.sprite(100, 200, 'star').setScale(2).setImmovable();

		this.player.setCollideWorldBounds(true);
		this.player.setSize(20, 30);
		// this.player.setOffset(12, 14);

		this.bindKeys();

		this.lastDirection = 'down';

		// Testo che apparirà sopra il player
		this.npcMessage = this.add.text(0, 0, "HEY puttanella", {
				font: "16px Arial",
				color: "#ff0000",
				backgroundColor: "#ffffff"
		});
		this.npcMessage.setOrigin(0.5); // centrato
		this.npcMessage.setDepth(10); // sopra tutto
		this.npcMessage.setVisible(false); // nascosto all’inizio


		// --- Collision ---
		this.physics.add.collider(this.player, this.collision);
		this.physics.add.collider(this.player, this.topLayer);
		// this.physics.add.collider(this.player, this.antonio);
		this.physics.add.overlap(this.player, this.topLayer);
		this.physics.add.overlap(this.player, this.collision);
		this.messageShown = false;

		this.physics.add.overlap(this.player, this.antonio, () => {
				if (!this.messageShown) {
						this.npcMessage.setVisible(true);
						this.messageShown = true;

						this.time.addEvent({
								delay: 2000, // millisecondi
								callback: () => {
										this.npcMessage.setVisible(false);
										this.messageShown = false;
								}
						});
				}
		});



		this.createCamera();
		this.createAnims();
	}

	update() {
		if (this.gameOver) return;

		this.physics.world.collide(this.player, this.star, () => {
			console.log('Collisione (controllo manuale)');
		});

		if (this.npcMessage.visible) {
				this.npcMessage.x = this.player.x;
				this.npcMessage.y = this.player.y - 40;
		}



		// const distance = Phaser.Math.Distance.Between(
		// 	this.player.x, this.player.y,
		// 	this.antonio.x, this.antonio.y
		// );

		// if (distance < 40) {
		// 	console.log('Sei vicino ad Antonio!');
		// }


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
				attack: Phaser.Input.Keyboard.KeyCodes.K
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
			{ key: 'down', sheet: 'player', start: 0, end: 7, frameRate: 10, repeat: -1 },
			{ key: 'left', sheet: 'player', start: 8, end: 15, frameRate: 10, repeat: -1 },
			{ key: 'right', sheet: 'player', start: 16, end: 23, frameRate: 10, repeat: -1 },
			{ key: 'up', sheet: 'player', start: 24, end: 31, frameRate: 10, repeat: -1 },

			// Idle
			{ key: 'idle-down', sheet: 'player-idle', start: 0, end: 11, frameRate: 2, repeat: -1 },
			{ key: 'idle-left', sheet: 'player-idle', start: 12, end: 23, frameRate: 2, repeat: -1 },
			{ key: 'idle-right', sheet: 'player-idle', start: 24, end: 35, frameRate: 2, repeat: -1 },
			{ key: 'idle-up', sheet: 'player-idle', start: 36, end: 39, frameRate: 2, repeat: -1 },

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

	// MOVIMENTO NPC
	npcMovement() {
		this.tweens.add({
			targets: this.antonio,
			x: 500,
			duration: 5000,
			yoyo: true,
			repeat: -1,
			onYoyo: () => this.antonio.anims.play('left', true),
			onRepeat: () => this.antonio.anims.play('right', true),
			onStart: () => this.antonio.anims.play('right', true)
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
