import * as PIXI from "pixi.js";
import config from "../assets/config.json";


const CHIKS_DATA = config.chicks;

export class Chick {

    constructor(app: PIXI.Application, atlas: PIXI.ITextureDictionary, type: number, scale: number) {
        this.atlas = atlas;
        this.type = type - 1;
        this.sprite = new PIXI.Sprite(atlas[CHIKS_DATA[this.type].frames[0]]);
        this.setCoordinates(CHIKS_DATA[this.type].posX * scale, CHIKS_DATA[this.type].posY * scale);
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(scale);
        app.stage.addChild(this.sprite);

        this.startAnimation();
    }

    chance: number = 0.3;
    sprite: PIXI.Sprite;
    atlas: PIXI.ITextureDictionary;
    type: number;
    x: number;
    y: number;
    intervalId: any;
    textureCounter: number;

    openBeak: boolean;

    setCoordinates(posX: number, posY: number) {
        this.x = posX;
        this.y = posY;

        this.updateCoordinates();
    }

    updateCoordinates() {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

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