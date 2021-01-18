import * as PIXI from 'pixi.js';
import config from '../assets/config.json';

const GUN_TEXTURES = config.gun.frames;

export class Gun {
    constructor(app: PIXI.Application, atlas: PIXI.ITextureDictionary, posX: number, posY: number, scale: number) {
        this.atlas = atlas;
        this.sprite = new PIXI.Sprite(this.atlas[GUN_TEXTURES[0]]);
        this.sprite.x = posX;
        this.sprite.y = posY;
        this.sprite.anchor.set(0, 1);
        this.sprite.scale.set(scale);
        app.stage.addChild(this.sprite);
    }

    sprite: PIXI.Sprite;
    atlas: PIXI.ITextureDictionary;
    isEnabled: boolean = true;

    enabled() {
        this.isEnabled = true;
        this.sprite.texture = this.atlas[GUN_TEXTURES[0]];
    }

    disabled() {
        this.isEnabled = false;
        this.sprite.texture = this.atlas[GUN_TEXTURES[1]];
    };
}