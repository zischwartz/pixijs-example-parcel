import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import keyboard from "./keyboard";
import hitTestRectangle from "./hit_test";

let guy_image_path = require("../images/guy.png");
// import guy_image_path from "../images/guy.jpg";
import displace_path from "../images/displace_big.png";
import fran_image_path from "../images/fran.png";
import fran_1_image_path from "../images/fran_1.png";
import fran_2_image_path from "../images/fran_2.png";
import fran_3_image_path from "../images/fran_3.png";
import line_image_path from "../images/line.png";
import carrot_image_path from "../images/carrot.png";
import pole_image_path from "../images/pole.png";

import clink_sound_path from "../audio/glass_clink.mp3";

// console.log(guy_image_path);

let app = new PIXI.Application({ width: 800, height: 700 });

// just for hmr
document.body.innerHTML = "";

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

app.renderer.backgroundColor = 0xffffff;
let container = new PIXI.Container();
app.stage.addChild(container);

// declare the variable for our sprite, so we can use it in both functions below
let guy;
let fran;
let tilingSprite;
let carrot;
let pole;
// cheap hack for hmr
if (!PIXI.loader.resources[guy_image_path]) {
  PIXI.loader
    .add([
      guy_image_path,
      displace_path,
      fran_image_path,
      line_image_path,
      carrot_image_path,
      fran_1_image_path,
      fran_2_image_path,
      fran_3_image_path,
      pole_image_path
    ])
    .load(setup);
} else {
  setup();
  // console.log("!");
}

function setup() {
  tilingSprite = new PIXI.extras.TilingSprite(
    PIXI.loader.resources[line_image_path].texture,
    app.screen.width,
    // app.screen.height
    app.screen.height + 100
  );
  tilingSprite.x = -400;
  tilingSprite.scale.x = 3;
  tilingSprite.anchor.x = 0.5;
  // tilingSprite.y = 300;
  // tilingSprite.scale.y = 1.5;
  // tilingSprite.addChild(pole);
  container.addChild(tilingSprite);

  // console.log(container);
  guy = new PIXI.Sprite(PIXI.loader.resources[guy_image_path].texture);
  carrot = new PIXI.Sprite(PIXI.loader.resources[carrot_image_path].texture);
  pole = new PIXI.Sprite(PIXI.loader.resources[pole_image_path].texture);
  // fran = new PIXI.Sprite(PIXI.loader.resources[fran_image_path].texture);
  let textures = [
    PIXI.loader.resources[fran_1_image_path].texture,
    PIXI.loader.resources[fran_2_image_path].texture,
    PIXI.loader.resources[fran_3_image_path].texture
  ];

  fran = new PIXI.extras.AnimatedSprite(textures);
  container.addChild(carrot);
  container.addChild(pole);
  container.addChild(guy);
  container.addChild(fran);

  fran.y = 600;
  fran.x = 450;
  fran.vx = 0;
  fran.vy = 0;
  fran.anchor.set(0.5);
  fran.scale.set(0.5);
  fran.animationSpeed = 0.15;

  fran.play();

  guy.anchor.set(0.5);
  guy.x = 800;
  guy.scale.set(5);
  guy.rotation = 0.4;

  carrot.anchor.set(0.5);
  carrot.scale.set(0.25);
  carrot.x = 200;
  carrot.y = 150;
  // guy.scale.x = 0.5;
  // guy.scale.y = 0.5;

  pole.anchor.set(0.5);
  pole.scale.x = 0.5;
  pole.scale.y = 0.75;
  pole.x = 750;
  pole.y = -250;
  pole.rotation = 0.1;

  //Capture the keyboard arrow keys
  let left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);

  left.press = () => {
    fran.vx = -3;
    fran.animationSpeed = 0.3;
  };
  right.press = () => {
    fran.vx = 3;
    fran.animationSpeed = 0.3;
  };
  up.press = () => {
    fran.vy = -1;
    fran.animationSpeed = 0.3;
  };
  down.press = () => {
    fran.vy = 1;
    fran.animationSpeed = 0;
  };

  left.release = () => {
    fran.vx = 0;
    fran.animationSpeed = 0.15;
    // console.log("left arrow key pressed");
  };
  right.release = left.release;

  down.release = () => {
    fran.vy = 0;
    fran.animationSpeed = 0.15;
  };
  up.release = down.release;

  var displacementSprite = PIXI.Sprite.fromImage(displace_path);
  var displacementFilter = new PIXI.filters.DisplacementFilter(
    displacementSprite
  );

  // let fake_dp = PIXI.Sprite.fromImage(displace_path);

  // app.stage.addChild(fake_dp);
  app.stage.addChild(displacementSprite);

  let color_filter = new PIXI.filters.ColorMatrixFilter();
  // color_filter.technicolor(true);
  // color_filter.lsd(true);
  // color_filter.night(true);
  container.filters = [displacementFilter, color_filter];

  let warp_scale = 700;
  // let warp_scale = 1;

  // this one sets the intensity of the effect, not the size
  displacementFilter.scale.x = warp_scale;
  displacementFilter.scale.y = warp_scale;

  displacementSprite.anchor.set(0.5);
  displacementSprite.x = 400;
  displacementSprite.y = 600;
  // this one effects the size (but also the intensity, as it's over a larger area)
  displacementSprite.scale.x = 2.5;
  displacementSprite.scale.y = 2.5;
  // displacementSprite.scale.x = 8;
  // displacementSprite.scale.y = 8;

  // fake_dp.scale.x = warp_scale;
  // fake_dp.scale.y = warp_scale;
  // fake_dp.anchor.set(0.5);
  // fake_dp.x = 400;
  // fake_dp.y = 650;

  // displacementSprite.scale.x = 2;
  // displacementSprite.scale.y = 2;
  // displacementSprite.scale.x = 0.5;
  // displacementSprite.scale.y = 0.5;
  // console.log(displacementSprite);

  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  // guy.y += 1;
  let fran_movement = Math.min(0, fran.vy) * 2;
  guy.y += 2 - fran_movement;
  carrot.y += 1 - fran_movement;
  fran.x += fran.vx;
  fran.y += fran.vy;
  tilingSprite.tilePosition.y -= fran_movement;
  tilingSprite.tilePosition.y += 1;

  // container.rotation += fran.vx / 500;

  pole.y += 1 - fran_movement;

  if (pole.y > 1200) {
    pole.y = -150;
    let r = Math.random();
    pole.x = r > 0.5 ? r * 200 : app.screen.width - r * 200;
    pole.rotation = r > 0.5 ? -0.1 : 0.1;
  }
  if (carrot.y > 800) {
    carrot.y = 0;
    carrot.x = Math.random() * app.screen.width;
    carrot.rotation = Math.random() > 0.5 ? 0 : 3.14;
    carrot.visible = true;
  }
  if (guy.y > 2000) {
    guy.y = -200;
    let r = Math.random();
    guy.x = r > 0.5 ? r * 100 : app.screen.width - r * 100;
    guy.rotation = r > 0.5 ? -0.3 : 0.3;
  }

  if (hitTestRectangle(fran, carrot)) {
    if (carrot.visible) {
      carrot.visible = false;
      console.log("hit");
      // clink_sound.play();
    }
    fran.tint = 0xffa500;
  } else {
    // console.log(fran.tint);
    fran.tint = 16777215;
  }

  // fran.x += 1;
}

var clink_sound = new Howl({
  src: [clink_sound_path]
});

// sound.play();
