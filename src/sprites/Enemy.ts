import Phaser from 'phaser';
import StateMachine from '../core/StateMachine';
import CallbackOnSprite from '../core/CallbackOnSprite';
import GlobalConstants from '../core/GlobalConstants';


const EnemyStates = {
    PATROLLING: 'PATROLLING',
    ATTACKING: 'ATTACKING',
    EVADING: 'EVADING',
    DEAD: 'DEAD',
    FIRING: 'FIRING'
}
export default class Enemy extends Phaser.Physics.Arcade.Sprite {

    private randomX: number;
    private randomAmplitude: number;
    private randomFrequency: number;
    private speed: number = 0.2;
    private waypoint!: Phaser.Math.Vector2;
    private target!: Phaser.GameObjects.Components.Transform;


    private destroyCallback!: CallbackOnSprite;

    private stateMacine: StateMachine;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string) {
        super(scene, x, y, texture, frame);
        this.setName('Enemy');
        this.setScale(0.5);
        this.setFlipX(true);
        scene.add.existing(this);
        this.randomX = Math.random();
        this.randomAmplitude = Math.random();
        this.randomFrequency = Math.random();
        // TODO set collision
        // this.setCollisionCategory(GlobalConstants.COLLISION_CATEGORY_ENEMY);
        // this.setCollidesWith([GlobalConstants.COLLISION_CATEGORY_PLAYER, GlobalConstants.COLLISION_CATEGORY_PLAYER_BULLET]);
        // this.setOnCollide(this.handleCollision);

        this.stateMacine = new StateMachine(this, 'Enemy');

        this.stateMacine
            .addState(EnemyStates.PATROLLING, {
                onEnter: this.patrollingOnEnter,
                onUpdate: this.patrollingOnUpdate
            })
            .addState(EnemyStates.EVADING, {
                onEnter: this.evadingOnEnter,
                onUpdate: this.evadingOnUpdate
            })
            .setState(EnemyStates.PATROLLING);
    }

    findWaypoint(): Phaser.Math.Vector2 {
        let width = this.scene.game.config.width as number;
        let height = this.scene.game.config.height as number;


        let x = Phaser.Math.Between(0, width);
        let y = Phaser.Math.Between(0, height);

        return new Phaser.Math.Vector2(x, y);
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

    // update(t: number, dt: number) {
    //     this.setVelocityY((this.randomAmplitude * this.speed + 1) * Math.sin((this.randomFrequency + 0.01) * this.speed / 1000 * t));
    //     this.setVelocityX(-this.speed * (this.randomX * 2 + 0.1));
    // }

    update(t: number, dt: number) {
        this.stateMacine.update(t, dt);
    }

    private patrollingOnEnter() {
        this.waypoint = this.findWaypoint();
    }

    private patrollingOnUpdate(t:number, dt: number) {
        let distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
        if (distance < 100) {
            this.stateMacine.setState(EnemyStates.EVADING);
        }

        // Move in the direction of the path
        let xo = this.waypoint.x - this.x;
        let yo = this.waypoint.y - this.y;
        let step = this.speed * dt;
        let xIsClose = Math.abs(xo) <= step;
        let yIsClose = Math.abs(yo) <= step;

        if (!xIsClose) {
            this.x += this.speed * (xo > 0 ? 1 : -1) * dt;
        }
        if (!yIsClose) {
            this.y += this.speed * (yo > 0 ? 1 : -1) * dt;
        }
        if (xIsClose && yIsClose) {
            // New way point
            this.waypoint = this.findWaypoint();
        }

    }

    private evadingOnEnter() {

    }

    private evadingOnUpdate(t: number, dt: number) {
        let angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        let distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
        let xo = -Math.cos(angle) * this.speed * dt;
        let yo = -Math.sin(angle) * this.speed * dt;
        this.x += xo;
        this.y += yo;
        if (distance > 120) {
            if (Phaser.Math.Between(0, 1)) {
                this.stateMacine.setState(EnemyStates.PATROLLING);
            } else {
                this.stateMacine.setState(EnemyStates.ATTACKING);
            }
        }
    }

    setTarget(target: Phaser.GameObjects.Components.Transform) {
        this.target = target;
    }

    onDestroy(callback: CallbackOnSprite) {
        this.destroyCallback = callback;
    }
}