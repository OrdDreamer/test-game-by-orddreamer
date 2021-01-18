import * as PIXI from 'pixi.js';

export class BackgroundParalax {
    constructor(app: PIXI.Application, texture: PIXI.Texture, posCenter: number, scale: number, canvasWidthHeight: number) {
        this.canvasWidthHeight = canvasWidthHeight;
        this.posCenter = posCenter;
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.x = this.posCenter;
        this.sprite.y = this.posCenter;
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(scale);
        app.stage.addChild(this.sprite);
    };

    setShift(posX: number) {
        this.sprite.x = this.posCenter + (Math.round((posX * 100) / this.canvasWidthHeight));
    };

    sprite: PIXI.Sprite;
    canvasWidthHeight: number;
    posCenter: number;
};