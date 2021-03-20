import Phaser from 'phaser'

export default class PreLoader extends Phaser.Scene {

    constructor() {
        super('preloader');
    }

    preload() {
        this.load.atlas('clouds', './clouds/clouds.png', './clouds/clouds.json');
    }

    create() {
        this.scene.start('cloud-scene');
    }
}