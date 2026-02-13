import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
	constructor() {
		super({ key: 'GameOverScene' });
	}

	create(data) {
		const { width, height } = this.scale;

		this.add.text(width / 2, height / 2 - 80, 'GAME OVER', {
			fontSize: '64px',
			color: '#ff0000'
		}).setOrigin(0.5);

		this.add.text(width / 2, height / 2 - 10, `Score: ${data.score || 0}`, {
			fontSize: '32px',
			color: '#ffffff'
		}).setOrigin(0.5);


		// -------------------------------------------------
		// BOTTONI
		// -------------------------------------------------

		const makeButton = (y, label, callback) => {
			const btn = this.add.text(width / 2, y, label, {
				fontSize: '28px',
				backgroundColor: '#222',
				color: '#fff',
				padding: { x: 20, y: 10 }
			})
				.setOrigin(0.5)
				.setInteractive({ useHandCursor: true });

			btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#555' }));
			btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#222' }));
			btn.on('pointerdown', callback);
		};

		makeButton(height / 2 + 70, 'Restart', () => {
			this.scene.start('GameScene');
		});

		makeButton(height / 2 + 130, 'Menu', () => {
			this.scene.start('MenuScene');
		});
	}

}