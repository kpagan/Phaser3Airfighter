import Phaser from 'phaser'
import CloudScene from './scenes/CloudScene'
import PreLoader from './scenes/PreLoader'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 450,
	physics: {
		/*default: 'matter',
        matter: {
            gravity: {
                x: 0,
                y: 0
            },
			debug: true
        }*/
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
