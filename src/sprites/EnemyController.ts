import Phaser from 'phaser'
import GlobalConstants from '../core/GlobalConstants';
import RandomSpriteGenerator from '../core/RandomSpriteGenerator';
import Enemy from './Enemy';
import { PlayerBullet } from './Player';

export default class EnemyController {

    private scene: Phaser.Scene;
    private pool: Phaser.GameObjects.Group;
    private spriteGenerator: RandomSpriteGenerator<Enemy>;
    private target: Phaser.GameObjects.Components.Transform

    constructor(scene: Phaser.Scene, target: Phaser.GameObjects.Components.Transform) {
        this.scene = scene;
        this.target = target;

        this.spriteGenerator = new RandomSpriteGenerator<Enemy>(this.scene, Enemy);

        this.pool = this.spriteGenerator.getMultiplePool(GlobalConstants.ENEMIES_TEXTURE, /Ship\d\/Ship\d/);

        this.scene.time.addEvent({
            startAt: 0,
            delay: 3000,
            loop: true,
            callback: () => this.addEnemy()
        });
    }

    update(t: number, dt: number) {
    }

    handlePlayerEnemyCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        // console.log('obj1: {}', obj1)
        // console.log('obj2: {}', obj2)
    }

    handlePlayerBulletEnemyCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        let bullet = obj1 as PlayerBullet;
        let enemy = obj2 as Enemy;
        bullet.disableBody(true, true);
        enemy.disableBody(true, true);
    }

    private addEnemy() {

        let enemy = this.spriteGenerator.getRandomDeadSpriteFromPool(this.pool);
        if (enemy) {
            let y = Phaser.Math.Between(0, Number(this.scene.game.config.height));
            let x = Number(this.scene.game.config.width) + enemy.width;
            enemy.enableBody(true, x, y, true, true);
            enemy.setTarget(this.target);
        }
    }

    public getPool() {
        return this.pool;
    }
}

