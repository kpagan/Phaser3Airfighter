import Phaser from 'phaser'
import '../sprites/Cloud'

export default class CloudScene extends Phaser.Scene {
    // private cloudTypes = ['cumulus-huge', 'cumulus-big1', 'cumulus-big2', 'cumulus-big3', 'cumulus-small1', 'cumulus-small2', 'cumulus-small3'];

    private group;

    constructor() {
        super('cloud-scene')
    }

    preload() {
    }

    create() {
        // c: Cloud;
        this.add.cloud();

/*        this.group = this.physics.add.group({
            defaultKey: 'clouds',
            classType: Cloud,
            maxSize: 100,
        });
*/
/*        this.time.addEvent({
            delay: 100,
            loop: true,
            callback: this.addAlien
        });*/
    }


    private addAlien() {
        // Random position above screen
        const x = Phaser.Math.Between(250, 800);
        const y = Phaser.Math.Between(-64, 0);

        // Find first inactive sprite in group or add new sprite, and set position
        const alien = this.group.get(x, y);

        // None free or already at maximum amount of sprites in group
        if (!alien) return;

    }
}
