import Phaser from 'phaser';

export default class NPC {
  constructor(scene, x, y, spriteKey, config = {}) {
    this.scene = scene;

    // Sprite e fisica
    this.sprite = scene.physics.add.sprite(x, y, spriteKey);
    this.sprite.setImmovable(true);
    // this.sprite.body.setAllowGravity(false);
    this.sprite.setSize(20, 30);

		this.name = config.name;

		// Message
		this.npcMessage = scene.add.text(0, 0, "", scene.npcMessageStyle);
		this.npcMessage.setOrigin(0.5);
		this.npcMessage.setDepth(10);
		this.npcMessage.setVisible(false);


    // Config personalizzabili
    this.interactionDistance = config.interactionDistance ?? 50;
    this.dialogueText = config.dialogueText ?? "Ciao!";
    this.animIdleKeys = config.animIdleKeys || {
      up: "idle-up",
      down: "idle-down",
      left: "idle-left",
      right: "idle-right"
    };
    this.movementTweenConfig = config.movementTween ?? null; // opzionale

    // Stato
    this.isNear = false;

    // Tween di default (loop orizzontale)
    if (this.movementTweenConfig) {
      this.startMovement();
    }
  }

  // Verifica vicinanza
  updateProximity(player) {
    const d = Phaser.Math.Distance.Between(
      player.x, player.y,
      this.sprite.x, this.sprite.y
    );
    this.isNear = (d <= this.interactionDistance);
  }

  // Ferma il movimento del NPC
  stopMovement() {
    this.scene.tweens.killTweensOf(this.sprite);
  }

  // Avvia il tween di movimento
  startMovement() {
    if (!this.movementTweenConfig) return;

		console.log('startato');
    const cfg = this.movementTweenConfig;

    this.scene.tweens.add({
      targets: this.sprite,
      ...cfg, // spread del tween config
      onStart: cfg.onStart ? () => cfg.onStart(this.sprite) : undefined,
      onRepeat: cfg.onRepeat ? () => cfg.onRepeat(this.sprite) : undefined,
      onYoyo: cfg.onYoyo ? () => cfg.onYoyo(this.sprite) : undefined,
    });
  }

  // Interazione quando il player preme il tasto
  interact(player) {
    if (!this.isNear) return;

    this.stopMovement();

    // Determina la direzione verso il player
    const dx = player.x - this.sprite.x;
    const dy = player.y - this.sprite.y;
    let dir = "down";
    if (Math.abs(dx) > Math.abs(dy)) {
      dir = dx > 0 ? "right" : "left";
    } else {
      dir = dy > 0 ? "down" : "up";
    }

    this.sprite.anims.play(this.animIdleKeys[dir], true);

    // Mostra dialogo
    this.showDialogue();
  }

		showDialogue() {
			this.npcMessage.setText(`${this.name}: ${this.dialogueText}`);
			this.npcMessage.setVisible(true);
			// Nascondi dopo 2 secondi e riprendi movimento
			this.scene.time.addEvent({
					delay: 2000,
					callback: () => {
							this.npcMessage.setVisible(false);
							this.startMovement();
					}
			});
		}

}
