
import Phaser from 'phaser'
import '../sprites/Player';
import Cloud from '../sprites/Cloud'
import Player from '../sprites/Player';
import EnemyController from '../sprites/EnemyController';
import GlobalConstants from '../core/GlobalConstants';
import RandomSpriteGenerator from '../core/RandomSpriteGenerator';

const CLOUD_SPAWN = 3;

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

export default class CloudScene extends Phaser.Scene {
    private cloudGroup!: Phaser.GameObjects.Group;
    private cursors!: CursorKeys;
    private player?: Player;
    private enemies!: EnemyController;
    private randomSpriteGenerator!: RandomSpriteGenerator<Cloud>;

    constructor() {
        super('cloud-scene')
    }

    preload() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        this.randomSpriteGenerator = new RandomSpriteGenerator<Cloud>(this, Cloud);
        this.cloudGroup = this.randomSpriteGenerator.getMultiplePool(GlobalConstants.CLOUDS_TEXTURE, undefined, {
            maxSize: 5
        });
        this.time.addEvent({
            startAt: 0,
            delay: 3000,
            loop: true,
            callback: () => this.addCloud()
        });

        this.player = this.add.player(0, this.scale.height / 2, this.cursors);
        // pass the player reference so enemies can track the player
        this.enemies = new EnemyController(this, this.player);
        this.physics.add.collider(this.player, this.enemies.getPool(), this.enemies.handlePlayerEnemyCollision, undefined, this);
        this.physics.add.collider(this.player.getBullets(), this.enemies.getPool(), this.enemies.handlePlayerBulletEnemyCollision, undefined, this);

    }
  
    update(t: number, dt: number) {
        if (this.player) {
            this.player.update(t, dt);
        }
        if (this.enemies) {
            this.enemies.update(t, dt);
        }
        // console.log(this.game.loop.actualFps);
    }

    private addCloud(): void {
        let cloud = this.randomSpriteGenerator.getRandomDeadSpriteFromPool(this.cloudGroup);
        if (cloud) {
            let y, lower, upper: number;
            let frameName = cloud.frame.name;
            let type = Cloud.getType(frameName);
            // try to allocate the space in clouds based on their size
            // the huge ones will appear on the top, the big in the middle
            // and the small in the lowest area to give a feeling of depth
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
            let x = Number(this.game.config.width) + cloud.width;
            cloud.enableBody(true, x, y, true, true);
        }
    }


}
