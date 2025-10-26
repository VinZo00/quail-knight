import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene {
	constructor() {
		super({ key: 'GameScene' });
	}

	create() {
		// this.addAudios();
		this.createMap();
		// this.createGroups();
		// this.createExit();

		// --- Player ---
		this.player = this.physics.add.sprite(this.map.widthInPixels / 2, this.map.heightInPixels / 2, 'player');
		this.star = this.physics.add.sprite(100, 200, 'star').setScale(2).setImmovable();

		this.player.setCollideWorldBounds(true);
		this.player.setSize(20, 30);
		// Nessun salto, nessuna gravità
		this.player.body.setAllowGravity(false);
		// this.player.setOffset(12, 14);

		this.bindKeys();

		// --- Bombe ---
		this.bombs = this.physics.add.group();

		// --- Punteggio ---
		this.score = 0;
		this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', color: '#000' });
		this.gameOver = false;

		// --- Joystick touch ---
		// @ts-ignore
		this.joystick = this.rexVirtualJoystick.add(this, {
			x: 100,
			y: 500,
			radius: 50,
			base: this.add.circle(0, 0, 50, 0x888888, 0.5),
			thumb: this.add.circle(0, 0, 25, 0xffffff, 0.8)
		});

		this.cursorKeys = this.joystick.createCursorKeys();

		this.lastDirection = 'down';

		// --- Collision ---
		this.physics.add.collider(this.player, this.collision);
		this.physics.add.collider(this.player, this.topLayer);
		this.physics.add.overlap(this.player, this.topLayer);
		this.physics.add.overlap(this.player, this.collision);

		this.createCamera();
		this.createAnims();
	}

	update() {
		if (this.gameOver) return;

		this.physics.world.collide(this.player, this.star, () => {
			console.log('Collisione (controllo manuale)');
		});

		// PULSANTI PER MUOVERE IL PERSONAGGIO
		const moving = this.cursors.left.isDown || this.cursors.right.isDown ||
			this.cursors.up.isDown || this.cursors.down.isDown ||
			(this.cursorKeys && (this.cursorKeys.left.isDown || this.cursorKeys.right.isDown ||
				this.cursorKeys.up.isDown || this.cursorKeys.down.isDown));

		// Movimento
		this.handleMovement(moving);

		// Attacco
		this.handleAttack(moving);
	}

	// CREA MAPPA
	createMap() {
    const map = this.make.tilemap({ key: 'map' });
		const tiles = map.addTilesetImage('terrain_atlas', 'terrain');

		const bottomLayer = map.createLayer('bottom', tiles).setDepth(-1);
		const topLayer = map.createLayer('top', tiles);
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
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	// EXIT
	// createExit() {
	// 	this.exit = this.add.sprite(47.5 * 16, 28.5 * 16, 'exit');
  //   this.exit.alpha = 0;
	// }

	// CREA CAMERA
	createCamera() {
		// this.cameras.main.roundPixels = true;
    // this.cameras.main.setZoom(3.5);
		this.cameras.main.startFollow(this.player);
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

	// MUOVI CON PULSANTI
	handleMovement(moving = false) {
		this.speed = 160;
		const speed = this.currentSpeed ?? this.speed;
		let velocityX = 0;
		let velocityY = 0;

		const left = this.cursors.left.isDown || (this.cursorKeys && this.cursorKeys.left.isDown);
		const right = this.cursors.right.isDown || (this.cursorKeys && this.cursorKeys.right.isDown);
		const up = this.cursors.up.isDown || (this.cursorKeys && this.cursorKeys.up.isDown);
		const down = this.cursors.down.isDown || (this.cursorKeys && this.cursorKeys.down.isDown);

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
		if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
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

	collectStar(player, star) {
		star.disableBody(true, true);
		this.score += 40;
		this.scoreText.setText('Score: ' + this.score);
	}

	hitBomb(player, bomb) {
		this.physics.pause();
		player.setTint(0xff0000);
		player.anims.play('turn');
		this.gameOver = true;
	}
}
