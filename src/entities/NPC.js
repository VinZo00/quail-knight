import Phaser from 'phaser';

export default class NPC {
	/**
	 * Crea un nuovo NPC.
	 * @param {Phaser.Scene & { player: import('./Player.js').default }} scene
	 * @param {Phaser.Scene} scene - La scena Phaser a cui appartiene l’NPC.
	 * @param {number} x - Posizione X iniziale.
	 * @param {number} y - Posizione Y iniziale.
	 * @param {string} spriteKey - Chiave della texture dello sprite (es. 'antonio').
	 * @param {object} [config] - Configurazione opzionale.
	 * @param {string} [config.name='NPC'] - Nome visualizzato sopra lo sprite.
	 * @param {string|string[]} [config.dialogueText='...'] - Testo o lista di dialoghi mostrati quando il player interagisce.
	 * @param {'x'|'y'|'idle'} [config.movementType='idle'] - Tipo di movimento (orizzontale, verticale o fermo).
	 * @param {number} [config.distance=0] - Distanza massima di movimento in pixel.
	 * @param {number} [config.speed=50] - Velocità di movimento in pixel/s.
	 * @param {'pos'|'neg'} [config.startDir='pos'] - Direzione iniziale del movimento.
	 * @param {'up'|'down'|'left'|'right'} [config.idleDir='down'] - Direzione idle se l’NPC è fermo.
	*/
  constructor(scene, x, y, spriteKey, config = {}) {
    this.scene = scene;

		this.spriteKey = spriteKey;
    this.sprite = scene.physics.add.sprite(x, y, spriteKey);
    this.sprite.setImmovable(true);
    this.sprite.setCollideWorldBounds(true).setScale(0.7);
		this.sprite.body.moves = false;

		this.shadow = scene.add.ellipse(x, y + this.sprite.displayHeight / 2 - 3, 20, 8, 0x000000, 0.4);
  	this.shadow.setDepth(0);

    const { width, height } = this.sprite;
    this.sprite.body.setSize(width * 0.5, height * 0.8);
    this.sprite.body.setOffset(width * 0.25, height * 0.2);

    this.baseX = x;
    this.baseY = y;

		this.name = config.name;

		this.dialogueTexts = config.dialogueText;

		const messageStyle = {
      font: '12px Ari',
      color: '#000',
      backgroundColor: '#ffffff',
      align: 'center',
      padding: { x: 6, y: 4 },
			wordWrap: {
				width: 250,
				useAdvancedWrap: true
			}
    };
    const nameStyle = {
      font: '12px Ari',
      color: '#000',
      align: 'center',
      padding: { x: 6, y: 4 },
    };

    this.npcMessage = scene.add.text(0, 0, '', messageStyle)
      .setOrigin(0.5)
      .setDepth(10)
      .setVisible(false);

    this.npcName = scene.add.text(0, 0, '', nameStyle)
      .setOrigin(0.5)
			.setText(this.name)
      .setDepth(10);

    this.interactionDistance = 60;
    this.isNear = false;
    this.currentText = '';

    this.animIdleKeys = {
      up: this.spriteKey+"-idle-up",
      down: this.spriteKey+"-idle-down",
      left: this.spriteKey+"-idle-left",
      right: this.spriteKey+"-idle-right"
    };

    this.movementTween = null;

    const movementType = config.movementType ?? 'idle';   
    const distance = Number(config.distance ?? 0);           
    const speed = Number(config.speed ?? 0);                
    const startDir = config.startDir ?? 'pos';           
    const idleDir = config.idleDir ?? 'down';               
		
    if (movementType === 'x' && distance > 0 && speed > 0) {
      this.patrolX(distance, speed, startDir);
    } else if (movementType === 'y' && distance > 0 && speed > 0) {
      this.patrolY(distance, speed, startDir);
    } else {
      this.sprite.anims.play(this.animIdleKeys[idleDir] ?? this.spriteKey+'-idle-down', true);
    }

		this.onSceneUpdate = this.onSceneUpdate.bind(this);
		this.scene.events.on('update', this.onSceneUpdate);
  }

  // ---------------------------------------------------------------------------
  // CONTATTO CON PLAYER
  // ---------------------------------------------------------------------------
	/**
	 * @param {{ x: number; y: number; }} player
	 */
	updateProximity(player) {
		const d = Phaser.Math.Distance.Between(player.x, player.y, this.sprite.x, this.sprite.y);
		const wasNear = this.isNear;

		this.isNear = (d <= this.interactionDistance);
		if (this.isNear && !wasNear) {
			this.currentText = this.pickDialogueText();
			this.npcMessage.setText(this.currentText);
			this.npcMessage.setVisible(true);
		} else if (!this.isNear && wasNear) {
			this.npcMessage.setVisible(false);
			this.currentText = null;
		}

		if (this.npcMessage.visible) {
			this.npcMessage.x = this.sprite.x;
			this.npcMessage.y = this.sprite.y - 40;
		}
	}

  // ---------------------------------------------------------------------------
  // MOVIMENTO
  // ---------------------------------------------------------------------------
	/**
   * Movimento orizzontale dell'NPC avanti e indietro.
   * @param {number} distance - Distanza in pixel da percorrere (dal punto di partenza).
   * @param {number} speed - Velocità in pixel/secondo.
   * @param {'pos'|'neg'} startDir - Direzione iniziale: 'pos' = verso destra, 'neg' = verso sinistra.
  */
  patrolX(distance, speed, startDir) {
    const to = startDir === 'pos' ? this.baseX + distance : this.baseX - distance;
    const duration = (distance / speed) * 1000;

    let dir = to > this.baseX ? 1 : -1;

    this.movementTween?.stop();
    this.movementTween = this.scene.tweens.add({
      targets: this.sprite,
      x: to,
      duration,
      ease: 'Linear',
      yoyo: true,
      repeat: -1,
      onStart:  () => this.sprite.anims.play(dir > 0 ? `${this.spriteKey}-walk-right` : `${this.spriteKey}-walk-left`, true),
      onYoyo:   () => { dir *= -1; this.sprite.anims.play(dir > 0 ? `${this.spriteKey}-walk-right` : `${this.spriteKey}-walk-left`, true); },
      onRepeat: () => { dir *= -1; this.sprite.anims.play(dir > 0 ? `${this.spriteKey}-walk-right` : `${this.spriteKey}-walk-left`, true); },
    });
  }

	/**
   * Movimento verticale dell'NPC avanti e indietro.
   * @param {number} distance - Distanza in pixel da percorrere (dal punto di partenza).
   * @param {number} speed - Velocità in pixel/secondo.
   * @param {'pos'|'neg'} startDir - Direzione iniziale: 'pos' = verso il basso, 'neg' = verso l'alto.
  */
  patrolY(distance, speed, startDir) {
    const to = startDir === 'pos' ? this.baseY + distance : this.baseY - distance;
    const duration = (distance / speed) * 1000;

    let dir = to > this.baseY ? 1 : -1;

    this.movementTween?.stop();
    this.movementTween = this.scene.tweens.add({
      targets: this.sprite,
      y: to,
      duration,
      ease: 'Linear',
      yoyo: true,
      repeat: -1,
      onStart:  () => this.sprite.anims.play(dir > 0 ? `${this.spriteKey}-walk-down` : `${this.spriteKey}-walk-up`, true),
      onYoyo:   () => { dir *= -1; this.sprite.anims.play(dir > 0 ? `${this.spriteKey}-walk-down` : `${this.spriteKey}-walk-up`, true); },
      onRepeat: () => { dir *= -1; this.sprite.anims.play(dir > 0 ? `${this.spriteKey}-walk-down` : `${this.spriteKey}-walk-up`, true); },
    });
  }

  // ---------------------------------------------------------------------------
  // DIALOGO / PROSSIMITÀ
  // ---------------------------------------------------------------------------
	pickDialogueText() {
		if (Array.isArray(this.dialogueTexts) && this.dialogueTexts.length > 0) {
			return Phaser.Utils.Array.GetRandom(this.dialogueTexts);
		}
		return typeof this.dialogueTexts === 'string' ? this.dialogueTexts : '...';
	}

	// ---------------------------------------------------------------------------
  // DOVE MOSTRARE NOME E MESSAGGIO
  // ---------------------------------------------------------------------------
	/**
   * @param {number} time - Tempo totale trascorso in millisecondi
   * @param {number} delta - Differenza di tempo dall'ultimo frame in millisecondi
   */
	onSceneUpdate(time, delta) {
		this.npcName.x = this.sprite.x;
		this.npcName.y = this.sprite.y - 20;

		this.shadow.setPosition(this.sprite.x, this.sprite.y + this.sprite.displayHeight / 2 - 3);

		const player = this.scene.player.sprite;
		if (player) this.updateProximity(player);

		if (this.npcMessage.visible) {
			this.npcMessage.x = this.sprite.x;
			this.npcMessage.y = this.sprite.y - 50;
		}
	}
}
