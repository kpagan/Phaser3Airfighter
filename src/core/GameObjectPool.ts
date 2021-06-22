import Phaser from 'phaser';
import { eventEmitter } from '../core/EventEmmiter';
import Events from '../core/Events';

declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            pool(config: Phaser.Types.GameObjects.Group.GroupConfig): IPool;
        }
    }
}

export default class GameObjectPool extends Phaser.GameObjects.Group implements IPool {
    constructor(scene: Phaser.Scene, config: Phaser.Types.GameObjects.Group.GroupConfig = {}) {
        super(scene, config);
        eventEmitter.on(Events.DESPAWN_OBJ, (obj) => this.despawn(obj), this);

        eventEmitter.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            eventEmitter.off(Events.DESPAWN_OBJ, (obj) => this.despawn(obj), this);
        });
    }

    spawn(x = 0, y = 0, key: string, frame: string) {
        const spawnExisting = this.countActive(false) > 0

        const obj = super.get(x, y, key, frame);

        if (!obj) {
            return;
        }

        if (spawnExisting) {
            obj.setActive(true);
            obj.setVisible(true);
            obj.setFrame(frame);
            obj.world.add(obj.body);
        }
        return obj;
    }

    despawn(obj: any) {
        obj.setActive(false)
        obj.setVisible(false)
        obj.removeInteractive()
        obj.world.remove(obj.body)
    }

    initializeWithSize(size: number, texture: string) {
        if (this.getLength() > 0 || size <= 0) {
            return;
        }

        this.createMultiple({
            key: texture,
            quantity: size,
            visible: false,
            active: false
        });
    }
}
Phaser.GameObjects.GameObjectFactory.register('pool', function (config: Phaser.Types.GameObjects.Group.GroupConfig) {
    // @ts-ignore
    return this.updateList.add(new GameObjectPool(this.scene, config));
});