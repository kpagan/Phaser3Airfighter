import Phaser from 'phaser'

interface CloudConfig {
    velocity: number;
}

const CLOUD_CONFIG: { [key: string]: CloudConfig } = {
    'small': {
        velocity: 300
    },
    'big': {
        velocity: 100
    },
    'huge': { 
        velocity: 50 
    }
};
export default class Cloud extends Phaser.Physics.Arcade.Sprite {


    private speed: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string) {
        super(scene, x, y, texture, frame);
        let type = frame.split('-')[1];
        if (type !== 'huge') {
            type = type.substring(0, type.length-1); // cut the last digit from the name
        }
        this.speed = CLOUD_CONFIG[type].velocity + 100 * Math.random();
    }

    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt);
        this.setVelocity(-this.speed, 0);
    }

    update(t: number, dt: number) {
        super.update(t, dt);
        if (this.x < -(this.width / 2)) {
            this.destroy();
        }
    }

}