
import Phaser from 'phaser'
import '../sprites/Player';
import Cloud from '../sprites/Cloud'
import Player from '../sprites/Player';
import EnemyController from '../sprites/EnemyController';
import GlobalConstants from '../core/GlobalConstants';
import RandomSpriteGenerator from '../core/RandomSpriteGenerator';
import ParallaxBackground from '../core/ParallaxBackground';
import Debug from '../core/Debug';

const CLOUD_SPAWN = 3;

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

export default class CloudScene extends Phaser.Scene {
    private cloudGroup!: Phaser.GameObjects.Group;
    private cursors!: CursorKeys;
    private player!: Player;
    private enemies!: EnemyController;
    private randomSpriteGenerator!: RandomSpriteGenerator<Cloud>;
    private backgrounds!: ParallaxBackground;
    private debug!: Debug;

    private width!: number
    private height!: number;

    constructor() {
        super('cloud-scene')
    }

    preload() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        this.width = <number>this.game.config.width;
        this.height = <number>this.game.config.height;

        this.backgrounds = new ParallaxBackground(0.5);
        let frames = [
            GlobalConstants.BACK_DESERT1_FRAME1,
            GlobalConstants.BACK_DESERT1_FRAME2,
            GlobalConstants.BACK_DESERT1_FRAME3,
            GlobalConstants.BACK_DESERT1_FRAME4,
            GlobalConstants.BACK_DESERT1_FRAME5
        ];

        for (let frame of frames) {
            this.backgrounds.addSprite(this.add.tileSprite(0, this.height, 0, 0,
                GlobalConstants.BACK_DESERT1_TEXTURE, frame));
        }
        
        // this.randomSpriteGenerator = new RandomSpriteGenerator<Cloud>(this, Cloud);
        // this.cloudGroup = this.randomSpriteGenerator.getMultiplePool(GlobalConstants.CLOUDS_TEXTURE, undefined, {
        //     maxSize: 5
        // });
        // this.time.addEvent({
        //     startAt: 0,
        //     delay: 3000,
        //     loop: true,
        //     callback: () => this.addCloud()
        // });

        // create the world bounds manually instead of using this.matter.world.setBounds() in order to controll 
        // which sprite collides with it and which not
        let points = [
            {x: this.width / 2, y: 0, w: this.width, h: 1}, // top
            {x: this.width / 2, y: this.height, w: this.width, h: 1}, // bottom
            {x: this.width , y: this.height / 2, w: 1, h: this.height}, // right
            {x: 0, y: this.height / 2, w: 1, h: this.height} // left
        ];

        for (let p of points) {
            this.matter.add.rectangle(p.x, p.y, p.w, p.h, {
                isStatic: true,
                collisionFilter: {
                    category: GlobalConstants.COLLISION_CATEGORY_WORLD,
                    mask: GlobalConstants.COLLISION_CATEGORY_PLAYER | GlobalConstants.COLLISION_CATEGORY_PLAYER_BULLET | GlobalConstants.COLLISION_CATEGORY_ENEMY_BULLET
                }
            });
        }

        this.player = this.add.player(this.width / 2, this.height / 2, this.cursors);
        // pass the player reference so enemies can track the player
        this.enemies = new EnemyController(this, this.player);
        
        // Arcade collision detection
        // this.physics.add.collider(this.player, this.enemies.getPool(), this.enemies.handlePlayerEnemyCollision, undefined, this);
        // this.physics.add.collider(this.player.getBullets(), this.enemies.getPool(), this.enemies.handlePlayerBulletEnemyCollision, undefined, this);

        
        this.debug = new Debug(this);
    }

    update(t: number, dt: number) {
        // this.physics.world.setBounds(this.player.x - this.width / 2, this.player.y - this.height / 2, this.width, this.height);

        if (this.player) {
            this.player.update(t, dt);
        }
        if (this.enemies) {
            this.enemies.update(t, dt);
        }
        this.backgrounds.update(dt);
        this.debug.msg('FPS: ' + Math.floor(this.game.loop.actualFps));
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
                    lower = this.height * 2 / 3;
                    upper = this.height;
                    break;
                case 'big':
                    lower = this.height * 1 / 3;
                    upper = this.height * 2 / 3;
                    break;
                case 'huge':
                    lower = 0;
                    upper = this.height * 1 / 3;
                    break;
                default:
                    lower = 0;
                    upper = this.height
                    break;
            }
            y = Phaser.Math.Between(lower, upper);
            let x = this.width + cloud.width;
            cloud.enableBody(true, x, y, true, true);
        }
    }


}
