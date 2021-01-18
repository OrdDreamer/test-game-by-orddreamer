import * as PIXI from 'pixi.js';
import config from '../assets/config.json';

import { BackgroundParalax } from './BackgrounParalax';
import { Gun } from './Gun';
import { Aim } from './Aim';
import { Chick } from './Chick';
import { Marten } from './Marten';

const LOADER = PIXI.Loader.shared;
const RESOURCES = PIXI.Loader.shared.resources;


export class Game {
    constructor(canvasWidthHeight: number,
        posCenter: number,
        scale: number
    ) {
        this.canvasWidthHeight = canvasWidthHeight;
        this.posCenter = posCenter;
        this.scale = scale;

        this.initializationGame();
    }

    //Game constants
    app: PIXI.Application;
    atlasTextures: PIXI.ITextureDictionary;
    canvasWidthHeight: number;
    posCenter: number;
    scale: number;
    background: BackgroundParalax;

    //Game variables
    allowShooting: boolean = true;
    reload: boolean;
    state: any;

    //Game objects
    shell: PIXI.Sprite;
    gun: Gun;
    aim: Aim;
    chicks: Chick[] = new Array();
    martens: Marten[] = new Array();


    initializationGame() {
        this.app = new PIXI.Application({
            width: this.canvasWidthHeight,
            height: this.canvasWidthHeight,
            antialias: true,
            backgroundColor: 0xFFE773,
        });
        this.app.renderer.view.style.display = "block";
        this.app.renderer.view.style.margin = "0 auto";
        document.querySelector(".container").appendChild(this.app.view);

        // LOADER.reset();
        // PIXI.Loader.shared

        LOADER
            // this.loader
            .add([
                {
                    name: 'background',
                    url: '../img/background.jpg'
                },
                {
                    name: 'tree',
                    url: '../img/tree.png'
                },
                {
                    name: 'textures',
                    url: '../img/textures.json'
                }
            ])
            .load(() => this.setup())


        // .onComplete.add(() => {
        //     console.log("vse okay");
        //     this.setup();
        // });
    }

    setup() {
        this.atlasTextures = RESOURCES['textures'].textures;


        // Background
        this.background = new BackgroundParalax(this.app,
            RESOURCES["background"].texture,
            this.posCenter,
            this.scale,
            this.canvasWidthHeight);

        //Tree
        {
            let treeSprite = new PIXI.Sprite(RESOURCES["tree"].texture);
            treeSprite.anchor.set(0.5);
            treeSprite.x = this.posCenter;
            treeSprite.y = this.posCenter;
            treeSprite.scale.set(this.scale);
            this.app.stage.addChild(treeSprite);
        }


        // this.app.ticker.add();
        // state = play;
        this.startGame();
    };

    gameLoop() {
        this.state();
    }

    //Starting game
    startGame() {
        //Create chicks
        config.chicks.forEach((element) => {
            this.chicks.push(new Chick(this.app,
                this.atlasTextures,
                element.type,
                this.scale));
        });


        //Create shell
        this.shell = new PIXI.Sprite(this.atlasTextures["shell.png"])
        this.shell.anchor.set(0, 1);
        this.shell.scale.set(this.scale);
        this.shell.position.set(-20, ((2500 - 100) * this.scale));
        this.app.stage.addChild(this.shell);

        //Create gun
        this.gun = new Gun(this.app, this.atlasTextures, 0, this.canvasWidthHeight, this.scale);
        //Create aim
        this.aim = new Aim(this.app, this.atlasTextures, this.posCenter, this.posCenter);


        //Added listeners
        this.app.view.addEventListener('mousemove', e => {
            this.background.setShift(e.offsetX);
            this.aim.setCoordinates(e.offsetX, e.offsetY);
        });
        var bindShooting = this.shooting.bind(this);
        this.app.view.addEventListener('click', bindShooting);

        var bindGameLoop = this.gameLoop.bind(this);
        this.state = this.updateGame;

        this.app.ticker.add(bindGameLoop);
    };

    //Stoping game
    stopGame() {
    };

    //Updating game
    updateGame() {
        this.checkAimPosition();
        this.createMarten();
        this.martens.forEach(element => {
            element.setCoordinates(element.sprite.y - 4 * this.scale);
            if (element.y < config.deathLine * this.scale) {
                this.death();
            };
        });
    };

    death() {
        this.martens.forEach(element => element.stopAnimation());
        this.chicks.forEach(element => element.stopAnimation());
        this.state = () => { };

        let deadthScreen = new PIXI.Graphics();
        deadthScreen.beginFill(0);
        deadthScreen.drawRect(0, 0, this.canvasWidthHeight, this.canvasWidthHeight);
        deadthScreen.endFill();
        let deadthText = new PIXI.Text('You died...', { font: '20px Arial', fill: 0xFFFFFF });
        deadthText.anchor.set(0.5)
        deadthText.x = this.posCenter;
        deadthText.y = this.posCenter;
        this.app.stage.addChild(deadthScreen, deadthText);
    }

    fire(e: any) {
        this.martens.forEach(element => {
            if (e.offsetX < (element.x + (element.sprite.width / 2)) &&
                e.offsetX > (element.x - (element.sprite.width / 2)) &&
                e.offsetY > element.y &&
                e.offsetY < (element.y + element.sprite.height)) {
                element.sprite.visible = false;
                this.martens.splice(this.martens.indexOf(element), 1)
            }
        }
        )
    };

    shooting(e: any) {
        if (this.allowShooting) {

            this.fire(e);

            this.gun.disabled();
            this.aim.disabled();
            this.reload = true;
            this.allowShooting = false;
            this.shell.visible = false;
            setTimeout(() => {
                this.gun.enabled();
                this.aim.enabled();
                this.checkAimPosition();
                this.reload = false;
                this.allowShooting = true;
                this.shell.visible = true;
            }, 1500);
        }
    };

    createMarten() {
        if (this.martens.length === 0) {
            this.martens.push(new Marten(this.app, this.atlasTextures, this.random(1, 3), this.scale, this.canvasWidthHeight));
        } else if ((this.martens[this.martens.length - 1].sprite.y + this.martens[this.martens.length - 1].sprite.height) < (2450 * this.scale)) {
            this.martens.push(new Marten(this.app, this.atlasTextures, this.random(1, 3), this.scale, this.canvasWidthHeight));
        };
    }

    //Check aim validity
    checkAimPosition() {
        if (this.aimColision()) {
            if (this.allowShooting === false && !this.reload) {
                this.allowShooting = true;
                this.aim.enabled();
            }
        } else {
            if (this.allowShooting === true)
                this.allowShooting = false;
            this.aim.disabled();
        }
    }

    //Check aim collision
    aimColision() {
        return (this.aim.x > config.aimCollisionArea.x * this.scale &&
            this.aim.x < (config.aimCollisionArea.maxX * this.scale) &&
            this.aim.y > config.aimCollisionArea.y * this.scale &&
            this.aim.y < (config.aimCollisionArea.maxY * this.scale))
    }

    //Random function
    random(min: number, max: number) {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }
}