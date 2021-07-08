
import Phaser from 'phaser'
import '../sprites/Player';
import Cloud from '../sprites/Cloud'
import Player from '../sprites/Player';
import '../core/GameObjectPool';
import EnemyController from '../sprites/EnemyController';
import GlobalConstants from '../core/GlobalConstants';

const CLOUD_SPAWN = 3;

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

export default class CloudScene extends Phaser.Scene {
    private cloudGroup!: IPool;
    private cursors!: CursorKeys;
    private player?: Player;
    private enemies!: EnemyController;

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
            startAt: 0,
            delay: 3000,
            loop: true,
            callback: () => this.addCloud()
        });

        this.player = this.add.player(0, this.scale.height / 2);
        this.enemies = new EnemyController(this);
        // this.matter.world.setBounds(0, 0, this.scale.width, this.scale.height, 64, false, false);
    }

    update(t: number, dt: number) {
        if (this.player) {
            this.player.update(this.cursors, t, dt);
        }
        if (this.enemies) {
            this.enemies.update(t, dt);
        }
        // console.log(this.game.loop.actualFps);
    }

    private addCloud(): void {
        // get metadata aboud the clouds from the clouds.json file
        let cloudMetadata: Phaser.Textures.Texture = this.textures.get(GlobalConstants.CLOUDS_TEXTURE);
        // from the clouds.json there is only 1 texture element so the index should be 0
        let frames: Phaser.Textures.Frame[] = cloudMetadata.getFramesFromTextureSource(0);
        let frame: Phaser.Textures.Frame = frames[Phaser.Math.Between(0, frames.length - 1)];
        let y, lower, upper: number;
        // try to allocate the space in clouds based on their size
        // the huge ones will appear on the top, the big in the middle
        // and the small in the lowest area to give a feeling of depth
        let type = Cloud.getType(frame.name);
        switch (type) {
            case 'small':
                lower = Number(this.game.config.height) * 2 / 3;
                upper = Number(this.game.config.height);
                break;
            case 'big':
                lower = Number(this.game.config.height) * 1 / 3;
                upper = Number(this.game.config.height) * 2 / 3;
                break;
            case 'huge':
                lower = 0;
                upper = Number(this.game.config.height) * 1 / 3;
                break;
            default:
                lower = 0;
                upper = Number(this.game.config.height)
                break;
        }
        y = Phaser.Math.Between(lower, upper);
        let x = Number(this.game.config.width) + frame.width;

        // Find first inactive sprite in group or add new sprite
        // this.cloudGroup.spawn(x, y, KEY, frame.name);
        this.add.existing(new Cloud(this, x, y, GlobalConstants.CLOUDS_TEXTURE, frame.name));
    }


}
