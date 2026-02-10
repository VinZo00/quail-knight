import Phaser from 'phaser';

export default class SettingsScene extends Phaser.Scene {
    constructor() {
        super('SettingsScene');
    }

    create() {
        // ============================
        // CONFIGURAZIONE SETTINGS
        // ============================
        const settingsConfig = [
            { label: 'Music', key: 'music', stateKey: 'musicEnabled' },
            { label: 'Quiet Mode', key: 'quiet', stateKey: 'quietMode' }
        ];

        // Dimensioni dinamiche
        const itemHeight = 60;
        const padding = 40;
        const titleHeight = 60;
        const buttonAreaHeight = 120;
        const panelWidth = 400;
        const panelHeight = settingsConfig.length * itemHeight + padding * 2 + titleHeight + buttonAreaHeight;

        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // BG trasparente
        const bg = this.add.rectangle(
            centerX,
            centerY,
            this.scale.width,
            this.scale.height,
            0x000000,
            0.6
        );

        // PANEL
        const panel = this.add.rectangle(
            centerX,
            centerY,
            panelWidth,
            panelHeight,
            0xffffff,
            1
        ).setStrokeStyle(2, 0x1e0800);

        // TITLE 
        this.add.text(
            centerX,
            centerY - panelHeight/2 + 35,
            'SETTINGS',
            { font: '32px Ari', color: '#000' }
        ).setOrigin(0.5);

        // ============================
        // RECUPERA STATO DA GAMESCENE
        // ============================
        const gameScene = this.scene.get('GameScene');
        // @ts-ignore
        this.musicEnabled = gameScene.musicEnabled;
        // @ts-ignore
        this.quietMode = gameScene.quietMode;

        // ============================
        // FUNZIONE CREA TOGGLE
        // ============================
        const createToggle = (x, y, label, isEnabled) => {
            // Label testo
            this.add.text(
                x - 140,
                y,
                label,
                { font: '24px Ari', color: '#000' }
            ).setOrigin(0, 0.5);

            // Container toggle
            const container = this.add.container(x + 80, y)
                .setSize(60, 30)
								.setInteractive({ useHandCursor: true });

            const toggleBg = this.add.rectangle(0, 0, 60, 30, 0xcccccc, 1)
                .setOrigin(0.5)
                .setStrokeStyle(2, 0x444444);

            const knob = this.add.circle(
                isEnabled ? 15 : -15,
                0,
                12,
                0xffffff
            ).setStrokeStyle(2, 0x666666);

            container.add([toggleBg, knob]);

            // Imposta colore iniziale
            toggleBg.setFillStyle(isEnabled ? 0x44cc44 : 0xcc4444);

            return { container, bg: toggleBg, knob };
        };

        // ============================
        // FUNZIONE AGGIORNA VISUAL
        // ============================
        const updateToggleVisual = (toggle, isEnabled) => {
            // Anima knob
            this.tweens.add({
                targets: toggle.knob,
                x: isEnabled ? 15 : -15,
                duration: 200,
                ease: 'Cubic.easeOut'
            });

            // Anima colore background
            this.tweens.add({
                targets: toggle.bg,
                fillColor: isEnabled ? 0x44cc44 : 0xcc4444,
                duration: 0
            });
        };

        // ============================
        // CREA TUTTI I TOGGLE
        // ============================
        this.toggles = {};
        const startY = centerY - panelHeight/2 + titleHeight + padding;

        settingsConfig.forEach((setting, index) => {
            const y = startY + index * itemHeight;
            const currentState = this[setting.stateKey];
            
            const toggle = createToggle(
                centerX,
                y,
                setting.label,
                currentState
            );

            // Click handler
            toggle.container.on('pointerdown', () => {
                this[setting.stateKey] = !this[setting.stateKey];
                updateToggleVisual(toggle, this[setting.stateKey]);
								// console.log(`toggle${setting.key.charAt(0).toUpperCase() + setting.key.slice(1)}`);
								// console.log(this[setting.stateKey]);
                this.game.events.emit(`toggle${setting.key.charAt(0).toUpperCase() + setting.key.slice(1)}`, this[setting.stateKey]);
            });

            this.toggles[setting.key] = toggle;
        });

        // ============================
        // GO TO MENU
        // ============================
        const goMenu = this.add.text(
            centerX,
            centerY + panelHeight/2 - 80,
            'Go to Menu',
            { font: '24px Ari', color: '#0000aa' }
        ).setOrigin(0.5).setInteractive({ useHandCursor: true });

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
            centerX,
            centerY + panelHeight/2 - 30,
            'CLOSE',
            { font: '24px Ari', color: '#ff0000' }
        ).setOrigin(0.5).setInteractive({ useHandCursor: true });

        closeBtn.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('GameScene');
            this.scene.resume('UIScene');
        });
    }
}