import Phaser from 'phaser'

const KEY = 'clouds';
export default class Cloud extends Phaser.Physics.Arcade.Sprite {


    private speed: number = 50;

    constructor(scene: Phaser.Scene, x: number, y: number, key: string, frame?: string | number) {
        super(scene, x, y, KEY, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    createRandom() {
        // get metadata aboud the clouds from the clouds.json file
        if (!this.scene) {
            return
        }
        let cloudMetadata: Phaser.Textures.Texture = this.scene.textures.get(KEY);
        // from the clouds.json there is only 1 texture element so the index should be 0
        let frames: Phaser.Textures.Frame[] = cloudMetadata.getFramesFromTextureSource(0);
        let frame: Phaser.Textures.Frame = frames[Phaser.Math.Between(0, frames.length - 1)];
        let x = Number(this.scene.game.config.width) + frame.width;
        let y = Phaser.Math.Between(0, Number(this.scene.game.config.height));
        this.setX(x);
        this.setY(y);
        this.setFrame(frame.name);
    }

    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt);
        this.setVelocity(-this.speed, 0);
    }

    update(t: number, dt: number) {
        super.update(t, dt);
        if (this.x < -(this.width/2)) {
            this.destroy();
        }
    }

}