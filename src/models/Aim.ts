import * as PIXI from 'pixi.js';
import { GameObject } from './GameObject';
import Control from './Control';
import config from '../assets/config.json';

const AIM_TEXTURES = config.aim.frames;

export class Aim extends GameObject{

    constructor(app: PIXI.Application, atlas: PIXI.ITextureDictionary, posX: number, posY: number) {
        super(new PIXI.Sprite(atlas[AIM_TEXTURES[0]]));
        this.setCoordinates({ x: posX, y: posY });

        this.atlas = atlas;
        this.sprite.anchor.set(0.5);
        this.sprite.zIndex = 999;
        app.stage.addChild(this.sprite);

        Control.addEventListener("mousemove", (e) => {
            this.setCoordinates({ x: e.offsetX, y: e.offsetY });
        })
    }

    atlas: PIXI.ITextureDictionary;
    isEnabled: boolean = true;

    enable() {
        this.isEnabled = true;
        this.sprite.texture = this.atlas[AIM_TEXTURES[0]];
    }

    disable() {
        this.isEnabled = false;
        this.sprite.texture = this.atlas[AIM_TEXTURES[1]];
    };

}
