import Phaser from 'phaser'
import GlobalConstants from '../core/GlobalConstants';

export default class PreLoader extends Phaser.Scene {

    constructor() {
        super('preloader');
    }

    preload() {
        this.load.atlas(GlobalConstants.CLOUDS_TEXTURE, './assets/clouds/clouds.png', './assets/clouds/clouds.json');
        this.load.atlas(GlobalConstants.PLAYER_TEXTURE, './assets/ships/ship.png', './assets/ships/ship.json');
        // this.load.atlas('enemies', './assets/ships/enemies.png', './assets/ships/enemies.json');
        this.load.atlas(GlobalConstants.ENEMIES_TEXTURE, './assets/ships/craftships.png', './assets/ships/craftships.json');
        this.load.atlas(GlobalConstants.PLAYER_BULLET_TEXTURE, './assets/ships/bullet.png', './assets/ships/bullet.json');
        this.load.atlas(GlobalConstants.BACK_DESERT1_TEXTURE, './assets/backgrounds/desert1.png', './assets/backgrounds/desert1.json');

    }

    create() {
        this.scene.start('cloud-scene');
    }
}