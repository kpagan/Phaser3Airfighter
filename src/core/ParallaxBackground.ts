import Phaser from "phaser";

type TileSprite = Phaser.GameObjects.TileSprite;

export default class ParallaxBackground {

    private tileSprites: TileSprite[];
    private backgroundSpeedFactor: number;

    /**
     * 
     * @param backgroundSpeedFactor a factor to controll the parallax speed. The value is interpolated between 0 and 1
     */
    constructor(backgroundSpeedFactor: number) {
        this.backgroundSpeedFactor = Phaser.Math.SmoothStep(backgroundSpeedFactor, 0, 1);
        this.tileSprites = [];
    }

    public addSprite(sprite: TileSprite) {
        // Set its pivot to the bottom left corner
        sprite.setOrigin(0, 1);
        // fixed it so it won't move when the camera moves.
        // Instead we are moving its texture on the update
        sprite.setScrollFactor(0);
        this.tileSprites.push(sprite);
    }

    /**
     * Updates the position of the parallax layers
     * @param dt the time difference
     */
    public update(dt: number) {
        if (this.tileSprites.length > 0) { 
            let factor = this.tileSprites.length;
            for (let i = 0; i < factor; i++) {
                let sprite = this.tileSprites[i];
                // using this calculation the layer in the back will be moving very very slowly
                // while the front layer very fast. The increasing in speed is exponential
                let n = Phaser.Math.Easing.Expo.InOut(this.backgroundSpeedFactor * (i + 1) / factor);
                sprite.tilePositionX += dt * n;
            }
        }
    }

}