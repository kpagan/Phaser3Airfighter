import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Matter.Sprite {

    static KEY: string = 'enemies';

    private speed: number = 0.1;
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string) {
        super(scene.matter.world, x, y, texture, frame);
        this.setMass(250);
        this.setScale(0.5);
        this.setFlipX(true);
        scene.add.existing(this);
    }

    update(t: number, dt: number) {
        //y = 0.5*sin(10*t)+3*sin(1.1*t)
        // this.y = Math.random() * 0.5 * Math.sin(10 * t) + Math.random() * 3 * Math.sin(1.1 * t);
        this.y = 200 * Math.sin(0.001 * t)// + 33 * Math.sin(550 * t);
        this.x += -this.speed * dt;
    }
}