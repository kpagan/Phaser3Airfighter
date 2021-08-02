import Phaser from 'phaser';
import GlobalConstants from './GlobalConstants';

export default class RandomSpriteGenerator<T extends Phaser.GameObjects.GameObject> {

    private scene: Phaser.Scene;

    // decaration from https://stackoverflow.com/questions/17382143/create-a-new-object-from-type-parameter-in-generic-class
    constructor(scene: Phaser.Scene,
        private spriteType: new (scene: Phaser.Scene, x: number, y: number, texture: string, frame: string) => T) {
        this.scene = scene;
    }

    /**
     * 
     * @param texture the texture key as it is defined in the atlas loading function
     * @param filter an optional regular expression to include only the frames that match the filter
     *               in case the atlas contains elements that should not be generated as sprites
     *               e.g. if the atlas contains both the initial sprite along with animations, explosions, bullets etc
     * @returns A sprite of type <T> as it is declared in the constructor of this generator
     */
    getRandomSprite(texture: string, filter?: RegExp): T {
        let metadata: Phaser.Textures.Texture = this.scene.textures.get(texture);
        // from the json file there is only 1 texture element so the index should be 0
        let frames: Phaser.Textures.Frame[] = metadata.getFramesFromTextureSource(0);
        if (filter) {
            frames = frames.filter((frame) => (frame.name.match(filter)));
        }
        let frame: Phaser.Textures.Frame = frames[Phaser.Math.Between(0, frames.length - 1)];
        let y = Phaser.Math.Between(0, Number(this.scene.game.config.height));
        let x = Number(this.scene.game.config.width) + frame.width;
        let T = new this.spriteType(this.scene, x, y, texture, frame.name);
        this.scene.physics.world.enableBody(T, Phaser.Physics.Arcade.DYNAMIC_BODY);
        return T;
    }

    getMultiplePool(texture: string, filter: RegExp = /.*/, groupConfig?: Phaser.Types.Physics.Arcade.PhysicsGroupConfig): Phaser.Physics.Arcade.Group {
        let metadata: Phaser.Textures.Texture = this.scene.textures.get(texture);
        let frames: Phaser.Textures.Frame[] = metadata.getFramesFromTextureSource(0);
        let frameNames: string[] = frames.filter((frame) => (frame.name.match(filter))).map(frame => frame.name);

        let defaultConfig: Phaser.Types.Physics.Arcade.PhysicsGroupConfig = {};


        defaultConfig = {
            classType: this.spriteType,
            runChildUpdate: true,            
        }

        let pool = this.scene.physics.add.group({
            ...defaultConfig,
            ...groupConfig,
        });

        pool.createMultiple({
            key: texture,
            ...(frameNames.length !== 0 && { frame: frameNames }),            
            active: false,
            visible: false,
        });

        return pool;
    }

    getMultipleMatterPool(texture: string, filter: RegExp = /.*/, groupConfig?: Phaser.Types.GameObjects.Group.GroupConfig): Phaser.GameObjects.Group {
        let metadata: Phaser.Textures.Texture = this.scene.textures.get(texture);
        let frames: Phaser.Textures.Frame[] = metadata.getFramesFromTextureSource(0);
        let frameNames: string[] = frames.filter((frame) => (frame.name.match(filter))).map(frame => frame.name);

        let defaultConfig: Phaser.Types.GameObjects.Group.GroupConfig = {};


        defaultConfig = {
            classType: this.spriteType,
            runChildUpdate: true,
        }

        let pool = this.scene.add.group({
            ...defaultConfig,
            ...groupConfig,
        });

        pool.createMultiple({
            key: texture,
            ...(frameNames.length !== 0 && { frame: frameNames }),            
            active: false,
            visible: false,
        });

        return pool;
    }

    getRandomDeadSpriteFromPool(pool: Phaser.GameObjects.Group): T | undefined {
        let dead = pool.getMatching('active', false);
        if (dead && dead.length > 0) {
            return dead[Phaser.Math.Between(0, dead.length - 1)];
        }
        return undefined;
    }
}