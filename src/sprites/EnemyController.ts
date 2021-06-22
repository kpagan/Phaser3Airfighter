import Phaser from 'phaser'
import RandomSpriteGenerator from '../core/RandomSpriteGenerator';
import Enemy from './Enemy';

export default class EnemyController {

    private scene: Phaser.Scene;
    private pool: Phaser.GameObjects.Group;
    private spriteGenerator: RandomSpriteGenerator<Enemy>;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.pool = this.scene.add.group({
            classType: Enemy
        });

        this.spriteGenerator = new RandomSpriteGenerator(this.scene, Enemy);

        this.scene.time.addEvent({
            startAt: 0,
            delay: 3000,
            loop: true,
            callback: () => this.addEnemy()
        });
    }

    update(t: number, dt: number) {
        this.pool.getChildren().forEach((enemy) => {
            enemy.update(t, dt);
        });
    }

    private addEnemy() {
        let enemy = this.spriteGenerator.getRandomSprite(Enemy.KEY);
        this.pool.add(enemy);
    }
}