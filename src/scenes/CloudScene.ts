
import Phaser from 'phaser'
import '../sprites/Player';
import Cloud from '../sprites/Cloud'
import Player from '../sprites/Player';
import '../core/GameObjectPool';

const KEY = 'clouds';
const CLOUD_SPAWN = 3;

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

export default class CloudScene extends Phaser.Scene {
    private cloudGroup!: IPool;
    private cursors!: CursorKeys;
    private player?: Player;

    constructor() {
        super('cloud-scene')
    }

    preload() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        this.cloudGroup = this.add.pool({
            classType: Cloud,
            maxSize: 5,
            runChildUpdate: true
        });

        this.time.addEvent({
            startAt:0,
            delay: 1000,
            loop: true,
            callback: () => this.addCloud()
        });

        this.player = this.add.player(0, this.scale.height / 2);
        this.matter.world.setBounds(0, 0, this.scale.width, this.scale.height);
    }

    update(t: number, dt: number) {
        if (this.player) {
            this.player.update(this.cursors, dt);
        }
    }

    private addCloud(): void {
         // get metadata aboud the clouds from the clouds.json file
         let cloudMetadata: Phaser.Textures.Texture = this.textures.get(KEY);
         // from the clouds.json there is only 1 texture element so the index should be 0
         let frames: Phaser.Textures.Frame[] = cloudMetadata.getFramesFromTextureSource(0);
         let frame: Phaser.Textures.Frame = frames[Phaser.Math.Between(0, frames.length - 1)];
         let x = Number(this.game.config.width) + frame.width;
         let y = Phaser.Math.Between(0, Number(this.game.config.height));
        // Find first inactive sprite in group or add new sprite
        this.cloudGroup.spawn(x, y, KEY, frame.name);
    }

    
}
