declare interface IPool extends Phaser.GameObjects.Group {
    spawn(x?: number, y?: number, key?: string, frame?: string);
    despawn(obj: Phaser.Physics.Arcade.Image);
    initializeWithSize(size: number, texture: string);
}

// This doesn't work for me no matter how much I tried. When I do from the scene 'this.add.pool(...)' I get error 'this.add.pool() is not a function'
/*
declare namespace Phaser.GameObjects {
    interface GameObjectFactory {
        pool(config: Phaser.Types.GameObjects.Group.GroupConfig): IPool;
    }
}
*/