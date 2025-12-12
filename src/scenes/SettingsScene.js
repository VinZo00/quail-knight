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
            this.scale.width / 2 - 60,               // sinistra
            this.scale.height / 2 - 60,
            'Music',
            { font: '24px Ari', color: '#000' }
        ).setOrigin(0, 0.5);



        // ============================
        // TOGGLER ON/OFF grafico
        // ============================

        // stato iniziale (puoi leggerlo da game.settings o simile)
        this.musicOn = true;

        // contenitore toggle
        const toggleContainer = this.add.container(
            this.scale.width / 2 + 60,
            this.scale.height / 2 - 60
        ).setSize(60, 30).setInteractive();

        // sfondo del toggle
        const toggleBg = this.add.rectangle(0, 0, 60, 30, 0xcccccc, 1)
            .setOrigin(0.5)
            .setStrokeStyle(2, 0x444444);

        // pallino
        const knob = this.add.circle(-15, 0, 12, 0xffffff)
            .setStrokeStyle(2, 0x666666);

        // aggiunge al container
        toggleContainer.add([toggleBg, knob]);

        // funzione per aggiornare l’aspetto grafico
        const updateToggleVisual = () => {
            if (this.musicOn) {
                toggleBg.setFillStyle(0x44cc44);
                knob.x = 15;
            } else {
                toggleBg.setFillStyle(0xcc4444);
                knob.x = -15;
            }
        };

        updateToggleVisual();

        // quando clicchi il toggle
        toggleContainer.on('pointerdown', () => {
            this.musicOn = !this.musicOn;
            updateToggleVisual();

            // notifica al gioco
            this.game.events.emit('toggleMusic', this.musicOn);
        });



        // ============================
        // GO TO MENU
        // ============================

        const goMenu = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 + 10,
            'Go to Menu',
            { font: '24px Ari', color: '#0000aa' }
        ).setOrigin(0.5).setInteractive();

        goMenu.on('pointerdown', () => {
            this.scene.stop('GameScene');
            this.scene.stop('UIScene');

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
