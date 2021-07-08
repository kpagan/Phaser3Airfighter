import Phaser from 'phaser';
import CallbackOnSprite from '../core/CallbackOnSprite';
import GlobalConstants from '../core/GlobalConstants';

export default class Enemy extends Phaser.Physics.Matter.Sprite {


    private randomX: number;
    private randomAmplitude: number;
    private randomFrequency: number;
    private speed: number = 1;

    private destroyCallback!: CallbackOnSprite;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string) {
        super(scene.matter.world, x, y, texture, frame);
        let b = this.body as MatterJS.BodyType
        this.setName('Enemy-' + b.id);
        this.setMass(250);
        this.setScale(0.5);
        this.setFlipX(true);
        this.setFixedRotation();
        scene.add.existing(this);
        this.randomX = Math.random();
        this.randomAmplitude = Math.random();
        this.randomFrequency = Math.random();
        this.setCollisionCategory(GlobalConstants.COLLISION_CATEGORY_ENEMY);
        this.setCollidesWith([GlobalConstants.COLLISION_CATEGORY_PLAYER, GlobalConstants.COLLISION_CATEGORY_PLAYER_BULLET]);
        this.setOnCollide(this.handleCollision);
    }

    handleCollision = (data: MatterJS.ICollisionPair) => {
        let bodyA = data.bodyA as MatterJS.BodyType;
        let bodyB = data.bodyB as MatterJS.BodyType;
        if (bodyA.gameObject) {
            console.log('bodyA {}', bodyA.gameObject.name);
        }
        if (bodyB.gameObject) {
            console.log('bodyB {}', bodyB.gameObject.name);
        }
        if (this.destroyCallback) {
            this.destroyCallback(this);
        }
    }

    update(t: number, dt: number) {
        //y = 0.5*sin(10*t)+3*sin(1.1*t)
        // this.y = Math.random() * 0.5 * Math.sin(10 * t) + Math.random() * 3 * Math.sin(1.1 * t);
        // this.y = 200 * Math.sin(0.001 * t)// + 33 * Math.sin(550 * t);
        this.setVelocityY((this.randomAmplitude * this.speed + 1) * Math.sin((this.randomFrequency + 0.01) * this.speed / 1000 * t));
        // this.x += -this.speed * dt;
        this.setVelocityX(-this.speed * (this.randomX * 2 + 0.1));
        // console.log('x: {}, y: {}', this.x, this.y);
    }

    onDestroy(callback: CallbackOnSprite) {
        this.destroyCallback = callback;
    }
}