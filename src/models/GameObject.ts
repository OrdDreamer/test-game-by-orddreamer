import * as PIXI from 'pixi.js';

export class GameObject {

    constructor (sprite: PIXI.Sprite) {
        this.sprite = sprite;
    }

    app: PIXI.Application;
    sprite: PIXI.Sprite;
    x: number = 0;
    y: number = 0;

    setCoordinates(coordinates: { x?: number, y?: number}) {
        if (coordinates.x) this.x = coordinates.x;
        if (coordinates.y) this.y = coordinates.y;

        this.updateCoordinates();
    }

    private updateCoordinates() {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

}