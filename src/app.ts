import "./styles/styles.css";
import { Game } from './models/Game';


const canvasWidthHeight: number = Math.min(window.innerHeight, window.innerWidth),
    posCenter: number = canvasWidthHeight / 2,
    coef: number = canvasWidthHeight / 2500;

let game: Game;
game = new Game(canvasWidthHeight, posCenter, coef);