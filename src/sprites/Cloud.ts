import Phaser from 'phaser'

declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            cloud(): Cloud;
        }
    }
}

export default class Cloud extends Phaser.Physics.Arcade.Sprite {



    private speed: number = 50;
    // constructor(scene: Phaser.Scene, x: number, y: number, key: string, frame: string | number) {

    //     super(scene, x, y, key, frame);
    // }
    constructor(scene: Phaser.Scene, x: number, y: number, key: string, frame: string | number) {

        super(scene, x, y, key, frame);
    }

    createRandom() {

    }

    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt);
        this.setVelocity(-this.speed, 0);
    }

}

const cloudTypes = ['cumulus-huge', 'cumulus-big1', 'cumulus-big2', 'cumulus-big3', 'cumulus-small1', 'cumulus-small2', 'cumulus-small3'];
const KEY = 'clouds';

Phaser.GameObjects.GameObjectFactory.register('cloud', function (this: Phaser.GameObjects.GameObjectFactory) {
    // let randCoeff1 = Math.random() * 2;
    // let randCoeff2 = Math.random() * 0.3; // separate random in order to limit huge clouds
    // let randomType = Math.floor(randCoeff1 + randCoeff2);

    // get metadata aboud the clouds from the clouds.json file
    if (!this.scene) {
        return 
    }
    let cloudMetadata: Phaser.Textures.Texture = this.scene.textures.get(KEY);
    // from the clouds.json there is only 1 texture element so the index should be 0
    let frames: Phaser.Textures.Frame[] = cloudMetadata.getFramesFromTextureSource(0);
    let frame: Phaser.Textures.Frame = frames[Phaser.Math.Between(0, frames.length)];
    let x = Number(this.scene.game.config.width) + frame.width;
    let y = Phaser.Math.Between(0, Number(this.scene.game.config.height));
    let cloud = new Cloud(this.scene, x, y, KEY, frame.name);

    this.displayList.add(cloud);
    this.updateList.add(cloud);
    this.scene.physics.world.enableBody(cloud, Phaser.Physics.Arcade.DYNAMIC_BODY);

    return cloud;
})