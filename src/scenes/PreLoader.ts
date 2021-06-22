import Phaser from 'phaser'

export default class PreLoader extends Phaser.Scene {

    constructor() {
        super('preloader');
    }

    preload() {
        this.load.atlas('clouds', './assets/clouds/clouds.png', './assets/clouds/clouds.json');
        this.load.atlas('player', './assets/ships/ship.png', './assets/ships/ship.json');
        this.load.atlas('enemies', './assets/ships/enemies.png', './assets/ships/enemies.json');
    }

    create() {
        this.scene.start('cloud-scene');
    }
}