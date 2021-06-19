import Phaser from 'phaser'
import CloudScene from './scenes/CloudScene'
import PreLoader from './scenes/PreLoader'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 420,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0},
			debug: true
		}
	},
	transparent: true,
	scene: [PreLoader, CloudScene],
	parent: 'game'
}

export default new Phaser.Game(config)
