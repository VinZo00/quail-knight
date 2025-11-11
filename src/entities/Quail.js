import Phaser from 'phaser';

export default class Quail {
		/**
		 * Crea una quaglia nemica.
		 * @param {Phaser.Scene} scene - La scena in cui istanziare la quaglia.
		 * @param {number} x - Coordinata X iniziale della quaglia.
		 * @param {number} y - Coordinata Y iniziale della quaglia.
		 * @param {string} [texture='quail'] - Chiave della texture/sprite sheet da usare per la quaglia.
		*/
    constructor(scene, x, y, texture = 'quail') {
        this.scene = scene;
        this.sprite = this.scene.physics.add.sprite(x, y, texture).setScale(0.8);
        this.sprite.setImmovable(false);
        this.sprite.setCollideWorldBounds(true);

        this.speed = 40;               // velocità normale
        this.chaseSpeed = 80;          // velocità se insegue il player
        this.chaseDistance = 150;      // distanza massima per inseguire il player
        this.isChasing = false;				 // sta inseguendo

        // Movimento random iniziale
        this.moveTimer = this.scene.time.addEvent({
            delay: Phaser.Math.Between(1000, 3000),
            callback: this.randomMove,
            callbackScope: this,
            loop: true
        });
    }


	randomMove() {
		if (this.isChasing) return;

		const directions = [
			{ x: 1, y: 0 },
			{ x: -1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 0, y: -1 },
			{ x: 0, y: 0 } // fermo
		];
		const dir = Phaser.Math.RND.pick(directions);
		this.sprite.setVelocity(dir.x * this.speed, dir.y * this.speed);

		// Animazioni
		if (dir.x > 0) { this.sprite.anims.play('quail-walk-right', true); }
		else if (dir.x < 0) this.sprite.anims.play('quail-walk-left', true);
		else if (dir.y > 0) this.sprite.anims.play('quail-walk-down', true);
		else if (dir.y < 0) this.sprite.anims.play('quail-walk-up', true);
		else this.sprite.anims.play(this.lastIdle || 'quail-idle-down', true);

		// Aggiorna ultima direzione idle
		if (dir.x !== 0 || dir.y !== 0) {
			if (dir.x > 0) this.lastIdle = 'quail-idle-right';
			else if (dir.x < 0) this.lastIdle = 'quail-idle-left';
			else if (dir.y > 0) this.lastIdle = 'quail-idle-down';
			else if (dir.y < 0) this.lastIdle = 'quail-idle-up';
		}
	}

		/**
		 * Aggiorna lo stato della quaglia (movimento e inseguimento del player).
		 * @param {{ sprite: Phaser.Physics.Arcade.Sprite }} player - Istanza del player da inseguire.
		*/
    update(player) {
        const distance = Phaser.Math.Distance.Between(
            this.sprite.x, this.sprite.y,
            player.sprite.x, player.sprite.y
        );

        if (distance < this.chaseDistance && Phaser.Math.Between(0, 100) < 50) {
            this.isChasing = true;

            const angle = Phaser.Math.Angle.Between(
                this.sprite.x, this.sprite.y,
                player.sprite.x, player.sprite.y
            );

            this.scene.physics.velocityFromRotation(angle, this.chaseSpeed, this.sprite.body.velocity);

            const vx = this.sprite.body.velocity.x;
            const vy = this.sprite.body.velocity.y;

            if (Math.abs(vx) > Math.abs(vy)) {
                if (vx > 0) this.sprite.anims.play('quail-walk-right', true);
                else this.sprite.anims.play('quail-walk-left', true);
            } else {
                if (vy > 0) this.sprite.anims.play('quail-walk-down', true);
                else this.sprite.anims.play('quail-walk-up', true);
            }

        } else {
            this.isChasing = false;
        }
    }
}
