import Phaser from 'phaser';

import MenuScene from './scenes/MenuScene';
import GameScene from './scenes/GameScene';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 300 }, debug: false }
    },
    scene: [MenuScene, GameScene],
		render: {
			pixelArt: true
		},
		plugins: {
        scene: [
            { key: 'rexVirtualJoystick', plugin: VirtualJoystickPlugin, mapping: 'rexVirtualJoystick' }
        ]
    }
};

// @ts-ignore
const game = new Phaser.Game(config);
