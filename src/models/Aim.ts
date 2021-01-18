import * as PIXI from 'pixi.js';
import config from '../assets/config.json';

const AIM_TEXTURES = config.aim.frames;

export class Aim {
    constructor(app: PIXI.Application, atlas: PIXI.ITextureDictionary, posX: number, posY: number) {
        this.atlas = atlas;
        this.sprite = new PIXI.Sprite(this.atlas[AIM_TEXTURES[0]]);
        this.setCoordinates(posX, posY);
        this.sprite.anchor.set(0.5);
        this.sprite.zIndex = 999;
        app.stage.addChild(this.sprite);
    }

    sprite: PIXI.Sprite;
    atlas: PIXI.ITextureDictionary;
    isEnabled: boolean = true;
    x: number;
    y: number;

    setCoordinates(x: number, y: number) {
        this.x = x;
        this.y = y;

        this.updateCoordinates();
    }

    updateCoordinates() {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

    enabled() {
        this.isEnabled = true;
        this.sprite.texture = this.atlas[AIM_TEXTURES[0]];
    }

    disabled() {
        this.isEnabled = false;
        this.sprite.texture = this.atlas[AIM_TEXTURES[1]];
    };

}
