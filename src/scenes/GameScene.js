import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
			  // this.load.setBaseURL('https://cdn.phaserfiles.com/v385');
        this.load.image('sky', 'images/sky.png');
        this.load.image('ground', 'images/platform.png');
        this.load.image('star', 'images/star.png');
        this.load.image('bomb', 'images/bomb.png');
        this.load.spritesheet('dude', 'images/swordsman.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('idle', 'images/swordsman-idle.png', { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        // --- Background ---
        this.add.image(400, 300, 'sky');

        // --- Disattivare gravità globale ---
        this.physics.world.gravity.y = 0;

        // --- "Muri" o limiti (opzionali) ---
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody(); // pavimento
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(750, 220, 'ground');

        // --- Player ---
        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setCollideWorldBounds(true);

        // Nessun salto, nessuna gravità
        this.player.body.setAllowGravity(false);

        // --- Animazioni ---
       // Verso giù
				this.anims.create({
						key: 'down',
						frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 7 }),
						frameRate: 10,
						repeat: -1
				});

				// Verso sinistra
				this.anims.create({
						key: 'left',
						frames: this.anims.generateFrameNumbers('dude', { start: 8, end: 15 }),
						frameRate: 10,
						repeat: -1
				});

				// Verso destra
				this.anims.create({
						key: 'right',
						frames: this.anims.generateFrameNumbers('dude', { start: 16, end: 23 }),
						frameRate: 10,
						repeat: -1
				});

				// Verso su
				this.anims.create({
						key: 'up',
						frames: this.anims.generateFrameNumbers('dude', { start: 24, end: 31 }),
						frameRate: 10,
						repeat: -1
				});

				// Idle verso giù
			this.anims.create({
					key: 'idle-down',
					frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 11 }),
					frameRate: 2,
					repeat: -1
			});

			// Idle verso sinistra
			this.anims.create({
					key: 'idle-left',
					frames: this.anims.generateFrameNumbers('idle', { start: 12, end: 23 }),
					frameRate: 2,
					repeat: -1
			});

			// Idle verso destra
			this.anims.create({
					key: 'idle-right',
					frames: this.anims.generateFrameNumbers('idle', { start: 24, end: 35 }),
					frameRate: 2,
					repeat: -1
			});

			// Idle verso su
			this.anims.create({
					key: 'idle-up',
					frames: this.anims.generateFrameNumbers('idle', { start: 36, end: 39 }),
					frameRate: 2,
					repeat: -1
			});


        // --- Input ---
        this.cursors = this.input.keyboard.createCursorKeys();

        // --- Stelle ---
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 2,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        // this.stars.children.iterate(child => child.setBounce(0)); // no rimbalzo

        // --- Bombe ---
        this.bombs = this.physics.add.group();

        // --- Collider ---
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

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
    }

		update() {
				if (this.gameOver) return;

				const speed = 160;
				let velocityX = 0;
				let velocityY = 0;

				const left = this.cursors.left.isDown || this.cursorKeys.left.isDown;
				const right = this.cursors.right.isDown || this.cursorKeys.right.isDown;
				const up = this.cursors.up.isDown || this.cursorKeys.up.isDown;
				const down = this.cursors.down.isDown || this.cursorKeys.down.isDown;

				if (left) velocityX = -speed;
				if (right) velocityX = speed;
				if (up) velocityY = -speed;
				if (down) velocityY = speed;

				this.player.setVelocity(velocityX, velocityY);

				// Animazione
				if (velocityX !== 0 || velocityY !== 0) {
						if (velocityX < 0) this.player.anims.play('left', true), this.lastDirection = 'left';
						else if (velocityX > 0) this.player.anims.play('right', true), this.lastDirection = 'right';
						else if (velocityY < 0) this.player.anims.play('up', true), this.lastDirection = 'up';
						else if (velocityY > 0) this.player.anims.play('down', true), this.lastDirection = 'down';
				} else {
						// Idle
						this.player.setVelocity(0,0);
						this.player.anims.play(`idle-${this.lastDirection}`, true);
				}
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
