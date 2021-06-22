import Phaser from 'phaser';

export default class RandomSpriteGenerator<T extends Phaser.GameObjects.Sprite> {

    private scene: Phaser.Scene;

    // decaration from https://stackoverflow.com/questions/17382143/create-a-new-object-from-type-parameter-in-generic-class
    constructor(scene: Phaser.Scene,
        private spriteType: new (scene: Phaser.Scene, x: number, y: number, texture: string, frame: string) => T) {
        this.scene = scene;
    }

    getRandomSprite(texture: string): T {
        let metadata: Phaser.Textures.Texture = this.scene.textures.get(texture);
        // from the clouds.json there is only 1 texture element so the index should be 0
        let frames: Phaser.Textures.Frame[] = metadata.getFramesFromTextureSource(0);
        let frame: Phaser.Textures.Frame = frames[Phaser.Math.Between(0, frames.length - 1)];
        let y = Phaser.Math.Between(0, Number(this.scene.game.config.height));
        let x = Number(this.scene.game.config.width) + frame.width;
        return new this.spriteType(this.scene, x, y, texture, frame.name);
    }
}