import Phaser from 'phaser'
import GlobalConstants from '../core/GlobalConstants';
import { eventEmitter } from '../core/EventEmmiter';
import Events from '../core/Events';

interface CloudConfig {
    velocity: number;
    mass: number;
    depth: number;
}

const CLOUD_CONFIG: { [key: string]: CloudConfig } = {
    'small': {
        velocity: 300,
        mass: 10,
        depth: 100
    },
    'big': {
        velocity: 200,
        mass: 20,
        depth: 0
    },
    'huge': {
        velocity: 100,
        mass: 30,
        depth: 0
    }
};
export default class Cloud extends Phaser.Physics.Arcade.Image {

    private speed: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string) {
        super(scene, x, y, texture, frame);
        this.setName('Cloud_' + this.frame.name);
        let type = Cloud.getType(this.frame.name);
        this.setDepth(CLOUD_CONFIG[type].depth);
        let velocity = CLOUD_CONFIG[type].velocity;
        this.speed = velocity + Math.random() * velocity;
    }

    static getType(frame: string): string {
        let type = frame.split('-')[1];
        if (type !== 'huge') {
            type = type.substring(0, type.length - 1); // cut the last digit from the name
        }
        return type;
    }

    update(t: number, dt: number) {
        this.setVelocityX(-this.speed);
        console.log(this.name, " -> x: ", this.x, ", width: ", this.width)
        super.update(t, dt);
        if (this.x < -(this.width / 2)) {
            this.disableBody(true, true);
        }
    }

}