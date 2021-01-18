import * as PIXI from "pixi.js";
import config from "../assets/config.json";

const MARTENS_TEXTURES = config.martens.frames;

export class Marten {
    constructor(app: PIXI.Application, atlas: PIXI.ITextureDictionary, type: number, scale: number, canvasWidthHeight: number) {
        this.atlas = atlas;
        this.sprite = new PIXI.Sprite(atlas[MARTENS_TEXTURES[0]]);
        this.sprite.scale.set(scale);
        this.sprite.anchor.set(0.5, 0);
        this.setCoordinates(canvasWidthHeight, config.chicks[type - 1].posX * scale);
        app.stage.addChild(this.sprite);

        this.startAnimation();
    }

    sprite: PIXI.Sprite;
    atlas: PIXI.ITextureDictionary;
    x: number;
    y: number;
    intervalId: any;
    movementIntervalId: any;
    textureCounter: number = 0;

    setCoordinates(posY: number, posX?: number) {
        this.y = posY;
        if (posX !== undefined) {
            this.x = posX;
        };

        this.updateCoordinates();
    }

    updateCoordinates() {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

    startAnimation() {
        this.intervalId = setInterval(() => {
            this.sprite.texture = this.atlas[MARTENS_TEXTURES[this.textureCounter]];
            this.textureCounter++;
            if (this.textureCounter === MARTENS_TEXTURES.length) this.textureCounter = 0;
        }, 500);
    };

    stopAnimation() {
        clearInterval(this.intervalId);
    }
}