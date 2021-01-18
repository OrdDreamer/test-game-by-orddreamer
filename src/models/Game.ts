import * as PIXI from 'pixi.js';
import Control from './Control';
import config from '../assets/config.json';

import { BackgroundParalax } from './BackgroundParalax';
import { Gun } from './Gun';
import { Chick } from './Chick';
import { Marten } from './Marten';
import { GameObject } from './GameObject';
import { Updatable } from './interfaces';

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
    state: "play" | "stop";

    //Game objects
    gun: Gun;
    chicks: Chick[] = new Array();
    martens: Marten[] = new Array();

    updatableObjects: Updatable[] = new Array();

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

        Control.initialize(this.app.view);

        LOADER
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
            treeSprite.zIndex = 100;
            this.app.stage.addChild(treeSprite);
        }

        this.startGame();
    };

    startGame() {
        //Create chicks
        config.chicks.forEach((element) => {
            this.chicks.push(new Chick(this.app,
                this.atlasTextures,
                element.type,
                this.scale));
        });

        //Create gun
        this.gun = new Gun(this.app, this.atlasTextures, this, 0, this.canvasWidthHeight, this.scale, this.posCenter);
        this.updatableObjects.push(this.gun);

        this.state = "play";
        this.app.ticker.add(() => {
            this.gameLoop();
        });
    }

    gameLoop() {
        if (this.state === "play") {
            this.updateGame();
        }
    }

    updateGame() {
        this.updatableObjects.forEach(element => element.updateGame());
        this.createMarten();
        this.checkDeathline();
        this.updateLayersOrder();
    };

    updateLayersOrder() {
        this.app.stage.children.sort((a, b) => a.zIndex - b.zIndex);
    }

    checkDeathline() {
        this.martens.forEach(element => {
            if (element.y < config.deathLine * this.scale) {
                this.gameOver();
            };
        });
    }

    gameOver() {
        this.martens.forEach(element => element.stopAnimation());
        this.chicks.forEach(element => element.stopAnimation());
        this.state = "stop";

        let deadthScreen = new PIXI.Graphics();
        deadthScreen.beginFill(0);
        deadthScreen.drawRect(0, 0, this.canvasWidthHeight, this.canvasWidthHeight);
        deadthScreen.endFill();
        deadthScreen.zIndex = 1100;
        let deadthText = new PIXI.Text('You died...', { font: '20px Arial', fill: 0xFFFFFF });
        deadthText.anchor.set(0.5)
        deadthText.x = this.posCenter;
        deadthText.y = this.posCenter;
        deadthText.zIndex = 1200;
        this.app.stage.addChild(deadthScreen, deadthText);
    }


    createMarten() {
        if (this.martens.length === 0 ||
            (this.martens[this.martens.length - 1].sprite.y + this.martens[this.martens.length - 1].sprite.height) < (2450 * this.scale)) {

            let newMarten: Marten = new Marten(this.app, this.atlasTextures, this.random(1, 3), this.scale, this.canvasWidthHeight)
            this.martens.push(newMarten);
            this.updatableObjects.push(newMarten);
        };
    }

    deleteMartensByPosition(coordinates: { x: number, y: number }) {
        this.martens.forEach(element => {
            if (coordinates.x < (element.x + (element.sprite.width / 2)) &&
                coordinates.x > (element.x - (element.sprite.width / 2)) &&
                coordinates.y > element.y &&
                coordinates.y < (element.y + element.sprite.height)) {
                element.sprite.visible = false;
                this.martens.splice(this.martens.indexOf(element), 1)
            }
        }
        );
    }

    //Random function
    random(min: number, max: number) {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }
}