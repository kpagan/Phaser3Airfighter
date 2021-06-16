import Phaser from 'phaser'
import Cloud from '../sprites/Cloud'

export default class CloudScene extends Phaser.Scene {
    private group!: Phaser.Physics.Arcade.Group;

    constructor() {
        super('cloud-scene')
    }

    preload() {
    }

    create() {
        this.group = this.physics.add.group({
            classType: Cloud,
            maxSize: 5,
            createCallback: (item: Phaser.GameObjects.GameObject) => {
                let cloud = item as Cloud;
                cloud.createRandom();
            },
            runChildUpdate: true
        });

        this.time.addEvent({
            delay: 5000,

            loop: true,
            callback: () => this.addCloud()
        });

    }

    update(t: number, dt: number) {
        
    }


    private addCloud(): void {
        // Find first inactive sprite in group or add new sprite
        const cloud = this.group.get();

        // None free or already at maximum amount of sprites in group
        if (!cloud) return;
    }
}
