import Phaser from 'phaser';


export default class Debug {

    private scene: Phaser.Scene;
    private text: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.text = this.scene.add
            .text(16, 16, "", {
                font: "18px monospace",
                color: "#000000",
                padding: { x: 20, y: 10 },
                backgroundColor: "#ffffff"
            })
            .setScrollFactor(0);
    }



    public msg(msg: string) {
        this.text.setText(msg);
    }
}