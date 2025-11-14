import Phaser from 'phaser';

export default class Player {
	/**
   * Crea un nuovo player controllabile.
		* @typedef {Object} PlayerKeys
   * @param {Phaser.Scene} scene - La scena in cui istanziare il giocatore.
   * @param {number} x - Coordinata X iniziale del giocatore.
   * @param {number} y - Coordinata Y iniziale del giocatore.
   * @param {string} [textureKey='player'] - Chiave della texture/sprite sheet da usare per il giocatore.
  */
  constructor(scene, x, y, textureKey = 'player') {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, textureKey).setDepth(1);
    this.sprite.setCollideWorldBounds(true).setScale(0.7);

		this.shadow = scene.add.ellipse(x, y + this.sprite.displayHeight / 2 - 3, 20, 8, 0x000000, 0.4);
  	this.shadow.setDepth(0);

    const { width, height } = this.sprite;
    this.sprite.body.setSize(width * 0.5, height * 0.8);
    this.sprite.body.setOffset(width * 0.25, height * 0.2);

    this.speed = 80;
    this.speedRun = 160;
    this.lastDirection = 'down';
    this.isAttacking = false;
		this.hp = 100;
  }

  // ----------------------------------------------------------------------------
  // UPDATE (gestisce movimento e attacco)
  // ----------------------------------------------------------------------------
  /**
   * Aggiorna lo stato del player ad ogni frame.
   * Gestisce movimento e attacco in base all'input.
   *
   * @param {object} keys - Oggetto con i tasti di controllo personalizzati (es. W, A, S, D).
   * @param {Phaser.Types.Input.Keyboard.CursorKeys} [cursorKeys] - Oggetto cursori standard di Phaser (opzionale).
  */
	update(keys, cursorKeys) {
    this.handleMovement(keys, cursorKeys);
    this.handleAttack(keys);
		// SHADOW
		this.shadow.setPosition(this.sprite.x, this.sprite.y + this.sprite.displayHeight / 2 - 3);
  }

	// ----------------------------------------------------------------------------
  // MOVIMENTO
  // ----------------------------------------------------------------------------
  /**
	 * Gestisce il movimento del giocatore in base ai tasti premuti.
	 * Cambia animazione e velocità a seconda della direzione e dello stato di attacco.
	 *
	 * @param {PlayerKeys} keys - Oggetto contenente i tasti personalizzati del giocatore.
	 * @param {Phaser.Types.Input.Keyboard.CursorKeys} [cursorKeys] - Cursori standard opzionali (freccette).
	*/
	handleMovement(keys, cursorKeys) {
    const left = keys.left.isDown || (cursorKeys && cursorKeys.left.isDown);
    const right = keys.right.isDown || (cursorKeys && cursorKeys.right.isDown);
    const up = keys.up.isDown || (cursorKeys && cursorKeys.up.isDown);
    const down = keys.down.isDown || (cursorKeys && cursorKeys.down.isDown);
		const isRunning = keys.shift.isDown && !this.isAttacking;

		let speed = isRunning ? this.speedRun : this.speed;
		let velocityX = 0;
    let velocityY = 0;

		if (this.isAttacking) {
			speed *= 0.5;
		}

    if (left) velocityX = -speed;
    if (right) velocityX = speed;
    if (up) velocityY = -speed;
    if (down) velocityY = speed;

    this.sprite.setVelocity(velocityX, velocityY);

    if (!this.isAttacking) {
      if (velocityX !== 0 || velocityY !== 0) {
        if (velocityX < 0) this.sprite.anims.play(`player-${isRunning ? 'run' : 'walk'}-left`, true), this.lastDirection = 'left';
        else if (velocityX > 0) this.sprite.anims.play(`player-${isRunning ? 'run' : 'walk'}-right`, true), this.lastDirection = 'right';
        else if (velocityY < 0) this.sprite.anims.play(`player-${isRunning ? 'run' : 'walk'}-up`, true), this.lastDirection = 'up';
        else if (velocityY > 0) this.sprite.anims.play(`player-${isRunning ? 'run' : 'walk'}-down`, true), this.lastDirection = 'down';
      } else {
        this.sprite.setVelocity(0, 0);
        this.sprite.anims.play(`player-idle-${this.lastDirection}`, true);
      }
    } 
  }

	// ----------------------------------------------------------------------------
  // ATTACCO
  // ----------------------------------------------------------------------------
  /**
   * Gestisce l'input per l'attacco.
   * Previene attacchi multipli finché l'animazione non è terminata.
   *
   * @param {PlayerKeys} keys - Oggetto con i tasti del giocatore.
   * @param {Phaser.Types.Input.Keyboard.CursorKeys} [cursorKeys] - Cursori opzionali.
  */
	handleAttack(keys, cursorKeys) {
    if (this.isAttacking) return;
    if (Phaser.Input.Keyboard.JustDown(keys.attack)) {
      const moving = this.sprite.body.velocity.x !== 0 || this.sprite.body.velocity.y !== 0;
      this.attack(moving);
    }
  }

  attack(moving = false) {
    this.isAttacking = true;

		// FIXME Qui decido che animazione mettere  
    // const animKey = moving ? `player-attack-walk-${this.lastDirection}` : `player-attack-${this.lastDirection}`;
    const animKey = moving ? `player-attack-${this.lastDirection}` : `player-attack-${this.lastDirection}`;
    this.sprite.anims.play(animKey, false);

		const width = this.sprite.body.width;
		const height = this.sprite.body.height;

		const range = 20;
		const rectX = this.sprite.x - width / 2 - range;
		const rectY = this.sprite.y - height / 2 - range;
		const rectWidth = width + range * 2;
		const rectHeight = height + range * 2;

		// FIXME Decidere se uasare array
		const bodies = this.scene.physics.overlapRect(rectX, rectY, rectWidth, rectHeight);
		for (const body of bodies) {
			// @ts-ignore
			if (this.scene.quailGroup.contains(body.gameObject)) {
				// @ts-ignore
				const quail = body.gameObject.quail;
				quail.destroy();
				// @ts-ignore
        this.scene.quailGroup.remove(quail.sprite, true, true);
				break;
			}
		}

    this.sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
      if (animation.key === animKey) {
        this.isAttacking = false;
      }
    });
  }


	takeDamage(damage = 0) {
		if (this.isInvulnerable) return;

		this.isInvulnerable = true;

		this.sprite.setTint(0xff0000);

		this.scene.time.delayedCall(150, () => {
			this.sprite.clearTint();
		});

		this.scene.time.delayedCall(500, () => {
			this.isInvulnerable = false;
		});
	}
}
