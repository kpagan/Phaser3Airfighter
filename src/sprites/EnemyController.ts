import Phaser from 'phaser'
import GlobalConstants from '../core/GlobalConstants';
import RandomSpriteGenerator from '../core/RandomSpriteGenerator';
import Enemy from './Enemy';

export default class EnemyController {

    private scene: Phaser.Scene;
    private pool: Phaser.GameObjects.Group;
    private spriteGenerator: RandomSpriteGenerator<Enemy>;
    private collisionGroup: number;
    private collisionCategory: number;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.pool = this.scene.add.group({
            classType: Enemy,
            maxSize: 5,
            runChildUpdate: true
        });
        
        this.collisionGroup = this.scene.matter.world.nextGroup(true);
        this.collisionCategory = this.scene.matter.world.nextCategory();

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
        this.pool.add(enemy);
        
    }

    public getCollisionCategory() {
        return this.collisionCategory;
    }
}