import * as PIXI from "pixi.js";
import { GameObject } from './GameObject';
import config from "../assets/config.json";
import { Updatable } from "./interfaces";

const MARTENS_TEXTURES = config.martens.frames;

export class Marten extends GameObject implements Updatable{

    constructor(app: PIXI.Application, atlas: PIXI.ITextureDictionary, type: number, scale: number, canvasWidthHeight: number) {
        super(new PIXI.Sprite(atlas[MARTENS_TEXTURES[0]]));
        this.setCoordinates({ x: config.chicks[type - 1].posX * scale, y: canvasWidthHeight});
        this.scale = scale;
        this.atlas = atlas;
        this.sprite.scale.set(scale);
        this.sprite.anchor.set(0.5, 0);
        this.sprite.zIndex = 500;
        app.stage.addChild(this.sprite);
        this.startAnimation();
    }

    scale: number;
    atlas: PIXI.ITextureDictionary;
    intervalId: any;
    textureCounter: number = 0;


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

    updateGame() {
        this.setCoordinates({ y: this.y - 4 * this.scale });
    }
}