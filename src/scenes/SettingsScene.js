import Phaser from 'phaser';

export default class SettingsScene extends Phaser.Scene {
    constructor() {
        super('SettingsScene');
    }

    create() {
        // BG trasparente
        const bg = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            this.scale.width,
            this.scale.height,
            0x000000,
            0.6
        );

        // PANEL
        const panel = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            300,
            320,
            0xffffff,
            1
        ).setStrokeStyle(4, 0x1e0800);

        // Title
        this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 - 130,
            'SETTINGS',
            { font: '32px Ari', color: '#000' }
        ).setOrigin(0.5);

        // ===========================
        // TOGGLE MUSIC (testo)
        // ===========================
        this.add.text(
            this.scale.width / 2 - 60, 
            this.scale.height / 2 - 60,
            'Music',
            { font: '24px Ari', color: '#000' }
        ).setOrigin(0, 0.5);

        this.add.text(
            this.scale.width / 2 - 120, 
            this.scale.height / 2,
            'Quiet Mode',
            { font: '24px Ari', color: '#000' }
        ).setOrigin(0, 0.5);


        // ============================
        // TOGGLER ON/OFF grafico
        // ============================
				const createToggle = (x, y) => {
						const container = this.add.container(x, y)
								.setSize(60, 30)
								.setInteractive();

						const bg = this.add.rectangle(0, 0, 60, 30, 0xcccccc, 1)
								.setOrigin(0.5)
								.setStrokeStyle(2, 0x444444);

						const knob = this.add.circle(-15, 0, 12, 0xffffff)
								.setStrokeStyle(2, 0x666666);

						container.add([bg, knob]);

						return { container, bg, knob };
				};

				const toggleMusic = createToggle(
						this.scale.width / 2 + 60,
						this.scale.height / 2 - 60
				);

				const toggleQuiet = createToggle(
						this.scale.width / 2,
						this.scale.height / 2
				);

				const gameScene = this.scene.get('GameScene');
				// @ts-ignore
				this.musicEnabled = gameScene.musicEnabled;
				// @ts-ignore
				this.quietMode = gameScene.quietMode;

				/**
				 * @param {object} toggle
				 * @param {boolean} isEnabled
				*/
				const updateToggleVisual = (toggle, isEnabled) => {
						if (isEnabled) {
								toggle.bg.setFillStyle(0x44cc44);
								toggle.knob.x = 15;
						} else {
								toggle.bg.setFillStyle(0xcc4444);
								toggle.knob.x = -15;
						}
				};

				updateToggleVisual(toggleMusic, this.musicEnabled);
				updateToggleVisual(toggleQuiet, this.quietMode);

        toggleMusic.container.on('pointerdown', () => {
            this.musicEnabled = !this.musicEnabled;
            updateToggleVisual(toggleMusic, this.musicEnabled);
            this.game.events.emit('toggleMusic', this.musicEnabled);
        });

        toggleQuiet.container.on('pointerdown', () => {
            this.quietMode = !this.quietMode;
            updateToggleVisual(toggleQuiet, this.quietMode);
            this.game.events.emit('toggleQuiet', this.quietMode);
        });



        // ============================
        // GO TO MENU
        // ============================

        const goMenu = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 + 80,
            'Go to Menu',
            { font: '24px Ari', color: '#0000aa' }
        ).setOrigin(0.5).setInteractive();

        goMenu.on('pointerdown', () => {					
						this.scene.stop('GameScene');
						this.scene.stop('UIScene');
						this.scene.stop();
						this.scene.start('MenuScene');
				});



        // ============================
        // CLOSE BUTTON
        // ============================
        const closeBtn = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 + 130,
            'CLOSE',
            { font: '24px Ari', color: '#ff0000' }
        ).setOrigin(0.5).setInteractive();

        closeBtn.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('GameScene');
            this.scene.resume('UIScene');
        });
    }
}
