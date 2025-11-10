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

    const { width, height } = this.sprite;
    this.sprite.body.setSize(width * 0.5, height * 0.7);
    this.sprite.body.setOffset(width * 0.25, height * 0.3);

    this.speed = 160;
    this.lastDirection = 'down';
    this.isAttacking = false;
    this.currentSpeed = this.speed;

		this.createAnims();
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
    const speed = this.currentSpeed;
    let velocityX = 0;
    let velocityY = 0;

    const left = keys.left.isDown || (cursorKeys && cursorKeys.left.isDown);
    const right = keys.right.isDown || (cursorKeys && cursorKeys.right.isDown);
    const up = keys.up.isDown || (cursorKeys && cursorKeys.up.isDown);
    const down = keys.down.isDown || (cursorKeys && cursorKeys.down.isDown);

    if (left) velocityX = -speed;
    if (right) velocityX = speed;
    if (up) velocityY = -speed;
    if (down) velocityY = speed;

    this.sprite.setVelocity(velocityX, velocityY);

    if (!this.isAttacking) {
      if (velocityX !== 0 || velocityY !== 0) {
        if (velocityX < 0) this.sprite.anims.play('left', true), this.lastDirection = 'left';
        else if (velocityX > 0) this.sprite.anims.play('right', true), this.lastDirection = 'right';
        else if (velocityY < 0) this.sprite.anims.play('up', true), this.lastDirection = 'up';
        else if (velocityY > 0) this.sprite.anims.play('down', true), this.lastDirection = 'down';
      } else {
        this.sprite.setVelocity(0, 0);
        this.sprite.anims.play(`idle-${this.lastDirection}`, true);
      }
    } else {
			if (this.currentSpeed !== this.speed * 0.5) {
				this.currentSpeed = this.speed * 0.5;
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

    const animKey = moving ? `attack-walk-${this.lastDirection}` : `attack-${this.lastDirection}`;
    this.sprite.anims.play(animKey, false);

    this.sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
      if (animation.key === animKey) {
        this.isAttacking = false;
        this.currentSpeed = this.speed;
      }
    });
  }

	// ----------------------------------------------------------------------------
  // CREA ANIMAZIONI (solo per il player)
  // ----------------------------------------------------------------------------
  createAnims() {
    const anims = this.scene.anims;
    const animations = [
      // Movimento
      { key: 'up', sheet: 'player', start: 0, end: 7, frameRate: 9, repeat: -1 },
      { key: 'left', sheet: 'player', start: 8, end: 15, frameRate: 9, repeat: -1 },
      { key: 'down', sheet: 'player', start: 16, end: 23, frameRate: 9, repeat: -1 },
      { key: 'right', sheet: 'player', start: 24, end: 31, frameRate: 9, repeat: -1 },

      // Idle
      { key: 'idle-down', sheet: 'vinzo', start: 38, end: 39, frameRate: 2, repeat: -1 },
      { key: 'idle-left', sheet: 'vinzo', start: 45, end: 46, frameRate: 2, repeat: -1 },
      { key: 'idle-right', sheet: 'vinzo', start: 47, end: 48, frameRate: 2, repeat: -1 },
      { key: 'idle-up', sheet: 'vinzo', start: 36, end: 37, frameRate: 2, repeat: -1 },

      // Attacco fermo
      { key: 'attack-down', sheet: 'player-attack', start: 14, end: 19, frameRate: 10, repeat: 0 },
      { key: 'attack-left', sheet: 'player-attack', start: 7, end: 12, frameRate: 10, repeat: 0 },
      { key: 'attack-right', sheet: 'player-attack', start: 21, end: 26, frameRate: 10, repeat: 0 },
      { key: 'attack-up', sheet: 'player-attack', start: 0, end: 5, frameRate: 10, repeat: 0 },

      // Attacco camminando
      { key: 'attack-walk-down', sheet: 'player-slash', start: 26, end: 38, frameRate: 10, repeat: 0 },
      { key: 'attack-walk-left', sheet: 'player-slash', start: 13, end: 25, frameRate: 10, repeat: 0 },
      { key: 'attack-walk-right', sheet: 'player-slash',start: 39, end: 51, frameRate: 10, repeat: 0 },
      { key: 'attack-walk-up', sheet: 'player-slash', start: 0, end: 12, frameRate: 10, repeat: 0 },
    ];

    animations.forEach(anim => {
      if (!anims.exists(anim.key)) {
        anims.create({
          key: anim.key,
          frames: anims.generateFrameNumbers(anim.sheet, { start: anim.start, end: anim.end }),
          frameRate: anim.frameRate,
          repeat: anim.repeat
        });
      }
    });
  }
}
