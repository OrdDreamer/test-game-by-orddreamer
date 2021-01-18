import * as PIXI from "pixi.js";
import { GameObject } from './GameObject';
import config from "../assets/config.json";


const CHIKS_DATA = config.chicks;

export class Chick extends GameObject{

    constructor(app: PIXI.Application, atlas: PIXI.ITextureDictionary, type: number, scale: number) {
        super(new PIXI.Sprite(atlas[CHIKS_DATA[type-1].frames[0]]));
        this.setCoordinates({ x: CHIKS_DATA[type-1].posX * scale, y: CHIKS_DATA[type-1].posY * scale });
        this.atlas = atlas;
        this.type = type - 1;
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(scale);
        this.sprite.zIndex = 400;
        app.stage.addChild(this.sprite);

        this.startAnimation();
    }

    chance: number = 0.3;
    atlas: PIXI.ITextureDictionary;
    type: number;
    intervalId: any;
    textureCounter: number;

    openBeak: boolean;

    startAnimation() {
        this.intervalId = setInterval(() => {
            if (this.openBeak) {
                this.sprite.texture = this.atlas[config.chicks[this.type].frames[1]];
                this.openBeak = false;
            } else {
                if (Math.random() > this.chance) {
                    this.sprite.texture = this.atlas[config.chicks[this.type].frames[0]];
                    this.openBeak = true;
                } else {
                    this.sprite.texture = this.atlas[config.chicks[this.type].frames[1]];
                }
            };
        }, 500);
    };

    stopAnimation() {
        clearInterval(this.intervalId);
    }

}