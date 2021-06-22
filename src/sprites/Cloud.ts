import Phaser from 'phaser'
import { eventEmitter } from '../core/EventEmmiter';
import Events from '../core/Events';

interface CloudConfig {
    velocity: number;
    mass: number;
    depth: number;
}

const CLOUD_CONFIG: { [key: string]: CloudConfig } = {
    'small': {
        velocity: 3,
        mass: 10,
        depth: 100
    },
    'big': {
        velocity: 2,
        mass: 20,
        depth: 0
    },
    'huge': {
        velocity: 1,
        mass: 30,
        depth: 0
    }
};
export default class Cloud extends Phaser.Physics.Matter.Image {

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string) {
        super(scene.matter.world, x, y, texture, frame);
        let type = Cloud.getType(frame);
        let speed = CLOUD_CONFIG[type].velocity + Math.random();
        this.setVelocity(-speed, 0);
        this.setMass(CLOUD_CONFIG[type].mass);

        this.setCollisionCategory(0);
        this.setDepth(CLOUD_CONFIG[type].depth);
        this.setFrictionAir(0);
    }

    static getType(frame: string): string {
        let type = frame.split('-')[1];
        if (type !== 'huge') {
            type = type.substring(0, type.length - 1); // cut the last digit from the name
        }
        return type;
    }

    update(t: number, dt: number) {
        super.update(t, dt);
        if (this.x < -(this.width / 2)) {
            eventEmitter.emit(Events.DESPAWN_OBJ, this);
        }
    }

}