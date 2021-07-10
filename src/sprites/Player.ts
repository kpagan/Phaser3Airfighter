import Phaser from 'phaser'
import CallbackOnSprite from '../core/CallbackOnSprite';
import GlobalConstants from '../core/GlobalConstants';

const PLAYER_NORMAL: string = 'player-normal';
const PLAYER_UP = 'player-up';
const PLAYER_DOWN = 'player-down';

declare global {
    namespace Phaser.GameObjects {
        export interface GameObjectFactory {
            player(x: number, y: number): Player;
        }
    }
}

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

export default class Player extends Phaser.Physics.Matter.Sprite {

    private speed: number = 0.1;
    private acceleration: number = 0.01;
    private bullets: Phaser.GameObjects.Group;
    private lastFired: number = 0;
    private fireDelay: number = 10000;


    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene.matter.world, x, y, GlobalConstants.PLAYER_TEXTURE, 'ship-01');
        this.setName('Player');
        this.setMass(200);
        this.createAnimations();
        this.play(PLAYER_NORMAL);
        this.setDepth(2);
        this.setFrictionAir(0.05);
        this.setCollisionCategory(GlobalConstants.COLLISION_CATEGORY_PLAYER);
        this.bullets = this.scene.add.pool({
            classType: PlayerBullet,
            runChildUpdate: true,
            maxSize: 10,
            // createCallback: (item: Phaser.GameObjects.GameObject) => {
                // let bullet = item as PlayerBullet;
                // bullet.init();
            // }
        });
    }

    update(cursors: CursorKeys, t: number, dt: number) {
        if (cursors.left.isDown) {
            this.thrustBack(this.speed);
        }
        else if (cursors.right.isDown) {
            this.thrust(this.speed);
        } else {
            // decelerate until velocity X is 0
            // this.setVelocityX(this.calculateNewVelocity(this.body.velocity.x, dt));
        }

        if (cursors.up.isDown) {
            this.thrustLeft(this.speed);
            this.play(PLAYER_UP);
        }
        else if (cursors.down.isDown) {
            this.thrustRight(this.speed);
            this.play(PLAYER_DOWN);
        } else {
            // decelerate until velocity Y is 0
            // this.setVelocityY(this.calculateNewVelocity(this.body.velocity.y, dt));
            this.play(PLAYER_NORMAL);
        }

        if (cursors.space.isDown && t > this.lastFired) {
            let bullet = this.bullets.get(this.x, this.y) as PlayerBullet;
            if (bullet) {
                bullet.onDestroy((sprite) => this.bullets.remove(sprite, true, true));
            }
            this.lastFired = t + this.fireDelay;
        }

        // console.log('Used: ' + this.bullets.getTotalUsed());
        // console.log('Free: ' + this.bullets.getTotalFree());
    
    }

    private calculateNewVelocity(initialVelocity: number, dt: number): number {
        let accel = this.acceleration;
        let minVelocity = 0;
        let maxVelocity = initialVelocity;
        if (initialVelocity < 0) {
            accel = -accel;
            minVelocity = initialVelocity;
            maxVelocity = 0;
        }
        return Phaser.Math.Clamp(initialVelocity - accel * dt, minVelocity, maxVelocity);
    }

    private createAnimations() {
        this.anims.create({
            key: PLAYER_NORMAL,
            frames: [{
                key: 'player',
                frame: 'ship-01'
            }]
        });

        this.anims.create({
            key: PLAYER_UP,
            frames: [{
                key: 'player',
                frame: 'ship-05'
            }]
        });
        this.anims.create({
            key: PLAYER_DOWN,
            frames: [{
                key: 'player',
                frame: 'ship-04'
            }]
        });
    }

}

class PlayerBullet extends Phaser.Physics.Matter.Sprite {

    private speed = 1;

    private destroyCallback!: CallbackOnSprite;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene.matter.world, x, y, GlobalConstants.PLAYER_BULLET_TEXTURE, GlobalConstants.PLAYER_BULLET_FRAME);
        this.init();
    }

    init() {
        this.setName('PlayerBullet');
        this.setMass(1);
        this.setFixedRotation();
        this.setAngle(90);
        this.setScale(0.1);
        this.setVelocityY(0);
        this.setCollisionCategory(GlobalConstants.COLLISION_CATEGORY_PLAYER_BULLET);
        this.setCollidesWith(GlobalConstants.COLLISION_CATEGORY_ENEMY);
        this.setOnCollide(this.handleCollision);
    }

    handleCollision = (data: MatterJS.ICollisionPair) => {
        if (this.destroyCallback) {
            this.destroyCallback(this);
        }
    }

    update(t: number, dt: number) {
        this.x += this.speed * dt;
        if (this.x > this.world.scene.game.config.width) {
            this.setActive(false);
            this.setVisible(false);
        }
    }

    onDestroy(callback: CallbackOnSprite) {
        this.destroyCallback = callback;
    }

}

Phaser.GameObjects.GameObjectFactory.register('player', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number) {
    let sprite = new Player(this.scene, x, y);

    this.displayList.add(sprite);
    this.updateList.add(sprite);
    // sprite.world.add(sprite.body);
    sprite.setFixedRotation();
    // this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
    // sprite.body.setSize(sprite.width * 0.95, sprite.height * 0.8);
    sprite.setOrigin(0.5, 0.5);
    // sprite.setOffset(0.5, 0.1);
    // sprite.setCollideWorldBounds();
    return sprite;
})