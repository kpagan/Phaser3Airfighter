import Phaser from 'phaser'

export default class PreLoader extends Phaser.Scene {

    constructor() {
        super('preloader');
    }

    preload() {
        this.load.atlas('clouds', './clouds/clouds.png', './clouds/clouds.json');
        this.load.atlas('player', './ships/ship.png', './ships/ship.json');
    }

    create() {
        this.scene.start('cloud-scene');
    }
}