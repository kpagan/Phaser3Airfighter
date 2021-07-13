import Phaser from 'phaser'
import CallbackOnSprite from '../core/CallbackOnSprite';
import GlobalConstants from '../core/GlobalConstants';

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

const PlayerAnims = {
    NORMAL: 'player-normal',
    UP: 'player-up',
    DOWN: 'player-down'
}

declare global {
    namespace Phaser.GameObjects {
        export interface GameObjectFactory {
            player(x: number, y: number, cursors: CursorKeys): Player;
        }
    }
}


export default class Player extends Phaser.Physics.Arcade.Sprite {

    private speed: number = 100;
    private acceleration: number = 0.3;
    private bullets: Phaser.GameObjects.Group;
    private lastFired: number = 0;
    private fireDelay: number = 500;
    private fireFlash: Phaser.GameObjects.Image;
    private cursors: CursorKeys;

    constructor(scene: Phaser.Scene, x: number, y: number, cursors: CursorKeys) {
        super(scene, x, y, GlobalConstants.PLAYER_TEXTURE, 'ship-01');
        this.cursors = cursors;
        this.setName('Player');
        this.createAnimations();
        this.setAnim(PlayerAnims.NORMAL);
        this.setDepth(2);
        this.bullets = this.scene.add.group({
            classType: PlayerBullet,
            runChildUpdate: true,
            maxSize: 10,
        });
        this.fireFlash = this.scene.add.image(this.x, this.y, GlobalConstants.PLAYER_BULLET_TEXTURE, GlobalConstants.PLAYER_BULLET_FLASH_FRAME);
        this.fireFlash.setAlpha(0).setDepth(3).setOrigin(0.2, 0.5).setBlendMode(Phaser.BlendModes.ADD);
    }

    update(t: number, dt: number) {

        if (this.cursors.left.isDown) {
            this.setVelocityX(this.accelerate(this.body.velocity.x, dt, false));
        }
        else if (this.cursors.right.isDown) {
            this.setVelocityX(this.accelerate(this.body.velocity.x, dt, true));
        } else {
            // decelerate until velocity X is 0
            this.setVelocityX(this.decelerate(this.body.velocity.x, dt));
        }

        if (this.cursors.up.isDown) {
            this.setVelocityY(this.accelerate(this.body.velocity.y, dt, false));
            this.setAnim(PlayerAnims.UP);
        }
        else if (this.cursors.down.isDown) {
            this.setVelocityY(this.accelerate(this.body.velocity.y, dt, true));
            this.setAnim(PlayerAnims.DOWN);
        } else {
            // decelerate until velocity Y is 0
            this.setVelocityY(this.decelerate(this.body.velocity.y, dt));
            this.setAnim(PlayerAnims.NORMAL);
        }

        

        // console.log('Used: ' + this.bullets.getTotalUsed());
        // console.log('Free: ' + this.bullets.getTotalFree());
    }

    preUpdate(t:number, dt: number) {        
        super.preUpdate(t, dt);
        let { x, y } = this.getRightCenter();
        this.fireFlash.setPosition(x, y);
        if (this.cursors.space.isDown && t > this.lastFired) {
            let bullet = this.bullets.get(x, y) as PlayerBullet;
            if (bullet) {
                this.displayFireFlash();
                bullet.onDestroy((sprite) => this.bullets.remove(sprite, true, true));
                this.lastFired = t + this.fireDelay;
            }
        }
    }

    private displayFireFlash() {
        this.scene.tweens.add({
            targets: this.fireFlash,
            alpha: { value: 1, duration: 100, ease: Phaser.Math.Easing.Sine.InOut },
            yoyo: true
        });
    }

    private decelerate(initialVelocity: number, dt: number): number {
        let accel, minVelocity, maxVelocity;
        if (initialVelocity < 0) {
            accel = -this.acceleration;
            minVelocity = initialVelocity;
            maxVelocity = 0;
        } else {
            accel = this.acceleration;
            minVelocity = 0;
            maxVelocity = initialVelocity;
        }
        return Phaser.Math.Clamp(initialVelocity - accel * dt, minVelocity, maxVelocity);
    }

    private accelerate(initialVelocity: number, dt: number, toRightOrDown: boolean): number {
        let accel, minVelocity, maxVelocity;
        if (toRightOrDown) {
            accel = this.acceleration;
            minVelocity = initialVelocity;
            maxVelocity = this.speed;
        } else {
            accel = -this.acceleration;
            minVelocity = -this.speed;
            maxVelocity = initialVelocity;
        }
        return Phaser.Math.Clamp(initialVelocity + accel * dt, minVelocity, maxVelocity);
    }

    private setAnim(anim: string) {
        this.play(anim);
    }

    private createAnimations() {
        this.anims.create({
            key: PlayerAnims.NORMAL,
            frames: [{
                key: GlobalConstants.PLAYER_TEXTURE,
                frame: 'ship-01'
            }]
        });

        this.anims.create({
            key: PlayerAnims.UP,
            frames: [{
                key: GlobalConstants.PLAYER_TEXTURE,
                frame: 'ship-05'
            }]
        });
        this.anims.create({
            key: PlayerAnims.DOWN,
            frames: [{
                key: GlobalConstants.PLAYER_TEXTURE,
                frame: 'ship-04'
            }]
        });
    }

}

class PlayerBullet extends Phaser.Physics.Arcade.Sprite {

    private speed = 1;

    private destroyCallback!: CallbackOnSprite;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, GlobalConstants.PLAYER_BULLET_TEXTURE, GlobalConstants.PLAYER_BULLET_FRAME);
        this.init();
    }

    init() {
        this.speed = Phaser.Math.GetSpeed(400, 1);
        this.setName('PlayerBullet');
        // TODO set collision
        // this.setCollisionCategory(GlobalConstants.COLLISION_CATEGORY_PLAYER_BULLET);
        // this.setCollidesWith(GlobalConstants.COLLISION_CATEGORY_ENEMY);
        // this.setOnCollide(this.handleCollision);
    }

    handleCollision = (data: MatterJS.ICollisionPair) => {
        if (this.destroyCallback) {
            this.destroyCallback(this);
        }
    }

    update(t: number, dt: number) {
        this.x += this.speed * dt;
        // TODO destroy sprite after getting off-screen
        if (this.x > this.scene.game.config.width) {
            this.setActive(false);
            this.setVisible(false);
            this.destroyCallback(this);
        }
    }

    onDestroy(callback: CallbackOnSprite) {
        this.destroyCallback = callback;
    }

}

Phaser.GameObjects.GameObjectFactory.register('player', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, cursors: CursorKeys) {
    let sprite = new Player(this.scene, x, y, cursors);

    this.displayList.add(sprite);
    this.updateList.add(sprite);
    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
    // this defines the collision area but it will be better defined using specific tool
    sprite.body.setSize(sprite.width * 0.95, sprite.height * 0.8);
    sprite.setOrigin(0.5, 0.5);
    sprite.setCollideWorldBounds();
    return sprite;
})