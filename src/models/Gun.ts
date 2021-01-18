import * as PIXI from 'pixi.js';
import { GameObject } from './GameObject';
import Control from './Control';
import config from '../assets/config.json';
import { Aim } from './Aim';
import { Game } from './Game';
import { Updatable } from './interfaces';

const GUN_TEXTURES = config.gun.frames;

export class Gun extends GameObject implements Updatable {
    constructor(app: PIXI.Application, atlas: PIXI.ITextureDictionary, game: Game,posX: number, posY: number, scale: number, posCenter: number) {
        super(new PIXI.Sprite(atlas[GUN_TEXTURES[0]]));
        this.setCoordinates({ x: posX, y: posY });
        this.app = app;
        this.game = game;
        this.scale = scale;
        this.atlas = atlas;
        this.sprite.zIndex = 800;
        this.sprite.anchor.set(0, 1);
        this.sprite.scale.set(scale);

        this.aim = new Aim(app, atlas, posCenter, posCenter);

        this.bullet = new PIXI.Sprite(this.atlas["shell.png"])
        this.bullet.anchor.set(0, 1);
        this.bullet.scale.set(this.scale);
        this.bullet.position.set(-20, ((2500 - 100) * this.scale));
        this.bullet.zIndex = 700;
        this.app.stage.addChild(this.bullet, this.sprite);

        Control.addEventListener("click", (e) => this.shooting(e));
    }

    aim: Aim;
    bullet: PIXI.Sprite;
    game: Game;
    atlas: PIXI.ITextureDictionary;
    isEnabled: boolean = true;
    allowShooting: boolean = true;
    reload: boolean;
    scale: number;

    enable() {
        this.isEnabled = true;
        this.sprite.texture = this.atlas[GUN_TEXTURES[0]];
    }

    disable() {
        this.isEnabled = false;
        this.sprite.texture = this.atlas[GUN_TEXTURES[1]];
    };

    updateGame() {
        this.checkAimPosition();
    }

    //Check aim collision
    aimColision() {
        return (this.aim.x > config.aimCollisionArea.x * this.scale &&
            this.aim.x < (config.aimCollisionArea.maxX * this.scale) &&
            this.aim.y > config.aimCollisionArea.y * this.scale &&
            this.aim.y < (config.aimCollisionArea.maxY * this.scale))
    }

    //Check aim validity
    checkAimPosition() {
        if (this.aimColision()) {
            if (this.allowShooting === false && !this.reload) {
                this.allowShooting = true;
                this.aim.enable();
            }
        } else {
            if (this.allowShooting === true)
                this.allowShooting = false;
            this.aim.disable();
        }
    }

    shooting(e: any) {
        if (this.allowShooting) {

            this.game.deleteMartensByPosition({ x: e.offsetX, y: e.offsetY });

            this.disable();
            this.aim.disable();
            this.reload = true;
            this.allowShooting = false;
            this.bullet.visible = false;
            setTimeout(() => {
                this.enable();
                this.aim.enable();
                // this.checkAimPosition();
                this.reload = false;
                this.allowShooting = true;
                this.bullet.visible = true;
            }, 1500);
        }
    };
}