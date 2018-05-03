import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import keyboard from "./keyboard";
import hitTestRectangle from "./hit_test";

let app = new PIXI.Application({ width: 800, height: 800 });

import guy_image_path from "../images/guy.jpg";
import clink_sound_path from "../audio/glass_clink.mp3";

// console.log(guy_image_path);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

app.renderer.backgroundColor = 0xffffff;

PIXI.loader.add(guy_image_path).load(setup);

// declare the variable for our sprite, so we can use it in both functions below
let guy;

function setup() {
  guy = new PIXI.Sprite(PIXI.loader.resources[guy_image_path].texture);
  app.stage.addChild(guy);
  guy.scale.x = 0.5;
  guy.scale.y = 0.5;

  //Capture the keyboard arrow keys
  let left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);

  left.press = () => {
    console.log("left arrow key pressed");
  };

  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  guy.x += 1;
}

var sound = new Howl({
  src: [clink_sound_path]
});

sound.play();
