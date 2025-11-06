import Phaser from 'phaser';

import BootScene from './scenes/BootScene';
import LoadScene from './scenes/LoadScene';
import MenuScene from './scenes/MenuScene';
import GameScene from './scenes/GameScene';
import UIScene from './scenes/UIScene';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: { debug: true }
    },
		scale: {
			autoCenter: Phaser.Scale.CENTER_BOTH,
		},
    scene: [BootScene,LoadScene,MenuScene,GameScene,UIScene],
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
