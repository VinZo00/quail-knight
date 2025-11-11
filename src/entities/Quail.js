import Phaser from 'phaser';

export default class Quail {
    /**
     * Crea una quaglia nemica.
     * @param {Phaser.Scene} scene - La scena in cui istanziare la quaglia
     * @param {number} x - Coordinata X iniziale
     * @param {number} y - Coordinata Y iniziale
     * @param {string} [texture='quail'] - Chiave della texture da usare
     */
    constructor(scene, x, y, texture = 'quail') {
        this.scene = scene;

        this.sprite = this.scene.physics.add.sprite(x, y, texture).setScale(0.8);
        this.sprite.setImmovable(false);
        this.sprite.setCollideWorldBounds(true);

        this.speed = 40;
        this.chaseSpeed = 80;
        this.chaseDistance = 150;
        this.isChasing = false;

        this.attackCooldown = 2000;
        this.lastAttackTime = 0;
        this.minDistance = 20;
        this.lastIdle = 'quail-idle-down';

				// BUG   
        this.moveTimer = this.scene.time.addEvent({
            delay: Phaser.Math.Between(1000, 3000),
            callback: this.randomMove,
            callbackScope: this,
            loop: true
        });
    }

    /**
     * Movimento random della quaglia (solo se non sta inseguendo)
     */
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

        // Aggiorna animazione e lastIdle
        if (dir.x > 0) this.setAnimation('quail-walk-right', 'quail-idle-right');
        else if (dir.x < 0) this.setAnimation('quail-walk-left', 'quail-idle-left');
        else if (dir.y > 0) this.setAnimation('quail-walk-down', 'quail-idle-down');
        else if (dir.y < 0) this.setAnimation('quail-walk-up', 'quail-idle-up');
        else this.sprite.anims.play(this.lastIdle, true);
    }

    /**
     * Imposta animazione di movimento e aggiorna l'idle corrispondente
     * @param {string} walkAnim - Animazione di cammino
     * @param {string} idleAnim - Animazione da usare quando ferma
     */
    setAnimation(walkAnim, idleAnim) {
        this.sprite.anims.play(walkAnim, true);
        this.lastIdle = idleAnim;
    }

    /**
     * Aggiorna lo stato della quaglia: movimento, inseguimento e attacco
     * @param {{ sprite: Phaser.Physics.Arcade.Sprite }} player - Istanza del player
     */
    update(player) {
        const distance = Phaser.Math.Distance.Between(
            this.sprite.x, this.sprite.y,
            player.sprite.x, player.sprite.y
        );

        if (distance < this.chaseDistance && Phaser.Math.Between(0, 100) < 50) {
            this.isChasing = true;
            if (this.moveTimer) this.moveTimer.paused = true;

            const angle = Phaser.Math.Angle.Between(
                this.sprite.x, this.sprite.y,
                player.sprite.x, player.sprite.y
            );

            if (distance < this.minDistance) {
                this.sprite.setVelocity(0, 0);
                this.tryAttack(player, distance);
            } else {
                this.scene.physics.velocityFromRotation(angle, this.chaseSpeed, this.sprite.body.velocity);
            }
        } else if (this.isChasing) {
            this.isChasing = false;
            if (this.moveTimer) this.moveTimer.paused = false;
        }

        // Aggiorna animazioni
        this.updateAnimation();
    }

    /**
     * Aggiorna animazioni e salva lastIdle
     */
    updateAnimation() {
        const vx = this.sprite.body.velocity.x;
        const vy = this.sprite.body.velocity.y;

        if (vx === 0 && vy === 0) {
            this.sprite.anims.play(this.lastIdle, true);
        } else if (Math.abs(vx) > Math.abs(vy)) {
            this.sprite.anims.play(vx > 0 ? 'quail-walk-right' : 'quail-walk-left', true);
            this.lastIdle = vx > 0 ? 'quail-idle-right' : 'quail-idle-left';
        } else {
            this.sprite.anims.play(vy > 0 ? 'quail-walk-down' : 'quail-walk-up', true);
            this.lastIdle = vy > 0 ? 'quail-idle-down' : 'quail-idle-up';
        }
    }

    /**
     * Prova ad attaccare il player se la quaglia è abbastanza vicina e il cooldown è scaduto
     * @param {{ sprite: Phaser.Physics.Arcade.Sprite }} player - Istanza del player
     * @param {number} distance - Distanza attuale dalla quaglia al player
     */
    tryAttack(player, distance) {
        const now = this.scene.time.now;
        if (distance < 50 && now - this.lastAttackTime > this.attackCooldown) {
            console.log('attaccato');
            this.lastAttackTime = now;
        }
    }
}
