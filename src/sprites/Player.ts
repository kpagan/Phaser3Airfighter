import Phaser from 'phaser'

const TEXTURE: string = 'player';
const PLAYER_NORMAL: string = 'player-normal';
const PLAYER_UP = 'player-up';
const PLAYER_DOWN = 'player-down';
declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            player(x: number, y: number): Player;
        }
    }
}

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

export default class Player extends Phaser.Physics.Arcade.Sprite {

    private speed: number = 100;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, TEXTURE, PLAYER_NORMAL);
        this.createAnimations();
        this.play(PLAYER_NORMAL);
    }

    update(cursors: CursorKeys) {
        if (cursors.left.isDown) {
            this.setVelocityX(-this.speed);
        }
        else if (cursors.right.isDown) {
            this.setVelocityX(this.speed);
        } else {
            this.setVelocityX(0);
        }

        if (cursors.up.isDown) {
            this.setVelocityY(-this.speed);
            this.play(PLAYER_UP);
        }
        else if (cursors.down.isDown) {
            this.setVelocityY(this.speed);
            this.play(PLAYER_DOWN);
        } else {
            this.setVelocityY(0);
            this.play(PLAYER_NORMAL);
        }
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
    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
    sprite.body.setSize(sprite.width * 0.95, sprite.height * 0.8);
    sprite.setOrigin(0.5, 0.5);
    // sprite.setOffset(0.5, 0.1);
    sprite.setCollideWorldBounds();
    return sprite;
})