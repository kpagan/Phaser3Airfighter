import Phaser from 'phaser'
import GlobalConstants from '../core/GlobalConstants';
import RandomSpriteGenerator from '../core/RandomSpriteGenerator';
import Enemy from './Enemy';

export default class EnemyController {

    private scene: Phaser.Scene;
    private pool: Phaser.GameObjects.Group;
    private spriteGenerator: RandomSpriteGenerator<Enemy>;
    private target: Phaser.GameObjects.Components.Transform

    constructor(scene: Phaser.Scene, target: Phaser.GameObjects.Components.Transform) {
        this.scene = scene;
        this.target = target;
        this.pool = this.scene.add.group({
            classType: Enemy,
            maxSize: 5,
            runChildUpdate: true
        });
        
        this.spriteGenerator = new RandomSpriteGenerator<Enemy>(this.scene, Enemy);

        this.scene.time.addEvent({
            startAt: 0,
            delay: 3000,
            loop: true,
            callback: () => this.addEnemy()
        });
    }

    update(t: number, dt: number) {
    }

    private addEnemy() {
        let enemy = this.spriteGenerator.getRandomSprite(GlobalConstants.ENEMIES_TEXTURE, /Ship\d\/Ship\d/);
        enemy.onDestroy((sprite) => this.pool.remove(sprite, true, true));
        enemy.setTarget(this.target);
        this.pool.add(enemy);
        
    }

}

