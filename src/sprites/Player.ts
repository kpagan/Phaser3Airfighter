import Phaser from 'phaser'

const TEXTURE: string = 'player';
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

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene.matter.world, x, y, TEXTURE, 'ship-01');
        this.setMass(200);
        this.createAnimations();
        this.play(PLAYER_NORMAL);
        this.setDepth(2);
        this.setFrictionAir(0.05);
    }

    update(cursors: CursorKeys, dt: number) {
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