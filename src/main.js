import Phaser from 'phaser';

import BootScene from './scenes/BootScene';
import LoadScene from './scenes/LoadScene';
import MenuScene from './scenes/MenuScene';
import GameScene from './scenes/GameScene';
import UIScene from './scenes/UIScene';
import GameOverScene from './scenes/GameOverScene';
import SettingsScene from './scenes/SettingsScene';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 720;

const config = {
    type: Phaser.AUTO,
    width: Math.min(window.innerWidth, MAX_WIDTH),
    height: Math.min(window.innerHeight, MAX_HEIGHT),
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH,
		},
    scene: [BootScene,LoadScene,MenuScene,GameScene,GameOverScene,UIScene,SettingsScene],
		render: {
			pixelArt: true
		},
		plugins: {
        scene: [
            { key: 'rexVirtualJoystick', plugin: VirtualJoystickPlugin, mapping: 'rexVirtualJoystick' }
        ]
    },
		disableVisibilityChange: false,
		input: {
    activePointers: 3,
    touch: {
        capture: true
    }
	}
};

// @ts-ignore
const game = new Phaser.Game(config);
