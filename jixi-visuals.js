"use strict";

/*
============================================================
 鸡西探索录
 JIXI WINTER VISUALS Ver.1

 武林夜市 Visual Enhancement Ver.4 を壊さず、
 その上から「黒竜江・鶏西の冬」を描画する。

 ・昼間
 ・積雪
 ・除雪された道路
 ・雪だまり
 ・轍
 ・屋根雪
 ・つらら
 ・降雪
 ・暖房の煙
 ・凍結した湖
 ・冬の空気感

 IMPORTANT

 index.html:

 map.js
 jixi.js
 vocabulary.js
 dialogue.js
 game.js
 visuals.js
 motion.js
 jixi-visuals.js
 learning.js
 dialect.js

 の順番で読み込む。
============================================================
*/


// ============================================================
// ORIGINAL FUNCTIONS
// ============================================================

const JX_originalDrawMap =
  drawMap;

const JX_originalDraw =
  draw;

const JX_originalDrawBuildings =
  drawBuildings;

const JX_originalDrawStalls =
  drawStalls;


// ============================================================
// BASIC HELPERS
// ============================================================

function jxRect(
  x,
  y,
  w,
  h,
  color
){

  ctx.fillStyle =
    color;

  ctx.fillRect(
    Math.floor(x),
    Math.floor(y),
    Math.ceil(w),
    Math.ceil(h)
  );

}


function jxLine(
  x1,
  y1,
  x2,
  y2,
  color,
  width=1
){

  ctx.save();

  ctx.strokeStyle =
    color;

  ctx.lineWidth =
    width;

  ctx.beginPath();

  ctx.moveTo(
    Math.floor(x1)+0.5,
    Math.floor(y1)+0.5
  );

  ctx.lineTo(
    Math.floor(x2)+0.5,
    Math.floor(y2)+0.5
  );

  ctx.stroke();

  ctx.restore();

}


function jxHash(
  x,
  y,
  salt=0
){

  let n =
    Math.imul(
      x + salt*31,
      374761393
    ) +

    Math.imul(
      y + salt*17,
      668265263
    );

  n =
    (n ^ (n >>> 13)) >>> 0;

  return (
    n % 1000
  ) / 1000;

}


function jxMap(){

  return getCurrentMap();

}


function jxIsOutdoor(){

  const map =
    jxMap();

  return !!(
    map &&
    map.jixiWinter &&
    !map.jixiWinter.indoor
  );

}


function jxIsIndoor(){

  const map =
    jxMap();

  return !!(
    map &&
    map.jixiWinter &&
    map.jixiWinter.indoor
  );

}


// ============================================================
// SNOW PARTICLES
// ============================================================

const JX_SNOW_COUNT = 190;

const jxSnowflakes = [];


for(
  let i=0;
  i<JX_SNOW_COUNT;
  i++
){

  jxSnowflakes.push({

    x:
      Math.random()*canvas.width,

    y:
      Math.random()*canvas.height,

    size:
      1+
      Math.floor(
        Math.random()*3
      ),

    speed:
      18+
      Math.random()*42,

    drift:
      5+
      Math.random()*18,

    phase:
      Math.random()*Math.PI*2,

    layer:
      Math.random()

  });

}


// ============================================================
// DAYLIGHT
// ============================================================

function jxDaylight(){

  if(
    !jxIsOutdoor()
  ){
    return;
  }


  /*
  夜景の上に単純な白ベタを乗せるのではなく、
  screen 合成で暗部を持ち上げる。

  元の描き込みを残しつつ昼へ近づける。
  */

  ctx.save();

  ctx.globalCompositeOperation =
    "screen";


  const gradient =
    ctx.createLinearGradient(
      0,
      0,
      0,
      canvas.height
    );


  gradient.addColorStop(
    0,
    "rgba(165,190,210,.36)"
  );


  gradient.addColorStop(
    .45,
    "rgba(155,177,194,.27)"
  );


  gradient.addColorStop(
    1,
    "rgba(116,137,151,.18)"
  );


  ctx.fillStyle =
    gradient;


  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  ctx.restore();


  /*
  冬の青灰色の空気。
  */

  ctx.save();

  ctx.fillStyle =
    "rgba(178,199,211,.055)";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.restore();

}


// ============================================================
// GROUND WRAPPER
// ============================================================

drawMap = function(time){

  JX_originalDrawMap(time);


  if(
    !jxIsOutdoor()
  ){
    return;
  }


  jxDrawSnowGround(time);

};


// ============================================================
// SNOW GROUND
// ============================================================

function jxDrawSnowGround(time){

  const map =
    jxMap();


  if(
    !map ||
    !map.grid
  ){
    return;
  }


  const rows =
    map.grid.length;

  const cols =
    map.grid[0].length;


  const sx0 =
    Math.max(
      0,
      Math.floor(
        camera.x/TILE
      )-1
    );


  const sx1 =
    Math.min(
      cols,
      Math.ceil(
        (
          camera.x+
          canvas.width
        )/TILE
      )+1
    );


  const sy0 =
    Math.max(
      0,
      Math.floor(
        camera.y/TILE
      )-1
    );


  const sy1 =
    Math.min(
      rows,
      Math.ceil(
        (
          camera.y+
          canvas.height
        )/TILE
      )+1
    );


  for(
    let ty=sy0;
    ty<sy1;
    ty++
  ){

    for(
      let tx=sx0;
      tx<sx1;
      tx++
    ){

      const tile =
        map.grid[ty][tx];


      const x =
        tx*TILE-
        camera.x;


      const y =
        ty*TILE-
        camera.y;


      if(
        tile===T.FLOOR
      ){

        jxSnowFloor(
          x,
          y,
          tx,
          ty
        );

      }


      else if(
        tile===T.ROAD
      ){

        jxWinterRoad(
          x,
          y,
          tx,
          ty
        );

      }


      else if(
        tile===T.PLAZA
      ){

        jxSnowPlaza(
          x,
          y,
          tx,
          ty
        );

      }


      else if(
        tile===T.GRASS
      ){

        jxSnowGrass(
          x,
          y,
          tx,
          ty
        );

      }


      else if(
        tile===T.WATER
      ){

        if(
          map.jixiWinter?.frozenLake
        ){

          jxFrozenWater(
            x,
            y,
            tx,
            ty,
            time
          );

        }

      }

    }

  }


  jxRoadTracks();

}


// ============================================================
// SNOW FLOOR
// ============================================================

function jxSnowFloor(
  x,
  y,
  tx,
  ty
){

  const seed =
    jxHash(
      tx,
      ty,
      2
    );


  jxRect(
    x,
    y,
    TILE,
    TILE,
    seed>.5
      ? "rgba(221,229,233,.72)"
      : "rgba(206,217,223,.69)"
  );


  /*
  青い影
  */

  jxRect(
    x,
    y+TILE-4,
    TILE,
    4,
    "rgba(113,139,155,.12)"
  );


  /*
  雪面の不規則な凹凸
  */

  if(
    seed>.72
  ){

    jxRect(
      x+5,
      y+8,
      13,
      2,
      "rgba(246,250,251,.44)"
    );

  }


  if(
    seed<.22
  ){

    jxRect(
      x+19,
      y+20,
      8,
      2,
      "rgba(144,165,177,.16)"
    );

  }

}


// ============================================================
// WINTER ROAD
// ============================================================

function jxWinterRoad(
  x,
  y,
  tx,
  ty
){

  const seed =
    jxHash(
      tx,
      ty,
      5
    );


  /*
  除雪されたアスファルト。
  */

  jxRect(
    x,
    y,
    TILE,
    TILE,
    seed>.55
      ? "rgba(86,101,111,.58)"
      : "rgba(75,91,102,.56)"
  );


  /*
  薄い圧雪。
  */

  if(
    seed>.62
  ){

    jxRect(
      x+3,
      y+5,
      17,
      4,
      "rgba(199,210,215,.20)"
    );

  }


  if(
    seed<.28
  ){

    jxRect(
      x+16,
      y+23,
      13,
      3,
      "rgba(213,221,225,.18)"
    );

  }


  /*
  凍結した反射。
  */

  if(
    seed>.82
  ){

    jxRect(
      x+5,
      y+15,
      19,
      2,
      "rgba(189,220,232,.18)"
    );

  }

}


// ============================================================
// SNOW PLAZA
// ============================================================

function jxSnowPlaza(
  x,
  y,
  tx,
  ty
){

  const seed =
    jxHash(
      tx,
      ty,
      8
    );


  jxRect(
    x,
    y,
    TILE,
    TILE,
    "rgba(204,216,222,.58)"
  );


  ctx.strokeStyle =
    "rgba(118,139,150,.15)";


  ctx.strokeRect(
    Math.floor(x)+.5,
    Math.floor(y)+.5,
    TILE-1,
    TILE-1
  );


  if(
    seed>.7
  ){

    jxRect(
      x+5,
      y+6,
      20,
      2,
      "rgba(241,246,248,.32)"
    );

  }

}


// ============================================================
// SNOW GRASS
// ============================================================

function jxSnowGrass(
  x,
  y,
  tx,
  ty
){

  jxRect(
    x,
    y,
    TILE,
    TILE,
    "rgba(218,228,231,.70)"
  );


  const seed =
    jxHash(
      tx,
      ty,
      11
    );


  if(
    seed>.55
  ){

    jxLine(
      x+8,
      y+24,
      x+10,
      y+17,
      "rgba(92,110,104,.28)"
    );


    jxLine(
      x+21,
      y+27,
      x+20,
      y+20,
      "rgba(91,108,102,.22)"
    );

  }

}


// ============================================================
// FROZEN LAKE
// ============================================================

function jxFrozenWater(
  x,
  y,
  tx,
  ty,
  time
){

  const seed =
    jxHash(
      tx,
      ty,
      14
    );


  jxRect(
    x,
    y,
    TILE,
    TILE,
    seed>.5
      ? "rgba(165,199,213,.82)"
      : "rgba(151,189,206,.82)"
  );


  /*
  湖上の雪。
  */

  if(
    seed>.66
  ){

    jxRect(
      x+2,
      y+5,
      19,
      5,
      "rgba(229,238,241,.34)"
    );

  }


  /*
  氷の筋。
  */

  if(
    seed<.25
  ){

    const wobble =
      Math.sin(
        time*.5+
        tx
      )*1.5;


    jxLine(
      x+5,
      y+22,
      x+25+wobble,
      y+18,
      "rgba(221,242,247,.36)"
    );

  }


  if(
    seed>.84
  ){

    jxLine(
      x+9,
      y+10,
      x+17,
      y+15,
      "rgba(101,150,173,.22)"
    );


    jxLine(
      x+17,
      y+15,
      x+25,
      y+13,
      "rgba(101,150,173,.22)"
    );

  }

}


// ============================================================
// ROAD TRACKS
// ============================================================

function jxRoadTracks(){

  const map =
    jxMap();


  if(
    !map ||
    !map.jixiWinter
  ){
    return;
  }


  /*
  道路を走った車の轍。

  マップ座標基準なので、
  カメラ移動にも追従する。
  */

  const roadX =
    26*TILE-
    camera.x;


  jxLine(
    roadX-47,
    -20,
    roadX-47,
    canvas.height+20,
    "rgba(48,64,73,.16)",
    3
  );


  jxLine(
    roadX-34,
    -20,
    roadX-34,
    canvas.height+20,
    "rgba(48,64,73,.14)",
    3
  );


  jxLine(
    roadX+35,
    -20,
    roadX+35,
    canvas.height+20,
    "rgba(48,64,73,.14)",
    3
  );


  jxLine(
    roadX+48,
    -20,
    roadX+48,
    canvas.height+20,
    "rgba(48,64,73,.16)",
    3
  );

}


// ============================================================
// BUILDINGS
// ============================================================

drawBuildings = function(){

  /*
  元の高密度建築をそのまま描く。
  */

  JX_originalDrawBuildings();


  if(
    !jxIsOutdoor()
  ){
    return;
  }


  const map =
    jxMap();


  for(
    const b of
    map.buildings || []
  ){

    const x =
      b.x*TILE-
      camera.x;


    const y =
      b.y*TILE-
      camera.y;


    const w =
      b.w*TILE;


    const h =
      b.h*TILE;


    if(
      x>canvas.width+100 ||
      y>canvas.height+100 ||
      x+w<-100 ||
      y+h<-100
    ){
      continue;
    }


    jxBuildingSnow(
      b,
      x,
      y,
      w,
      h
    );

  }

};


// ============================================================
// BUILDING SNOW
// ============================================================

function jxBuildingSnow(
  b,
  x,
  y,
  w,
  h
){

  /*
  屋根の積雪。

  元の屋根形状を完全に消さず、
  上側だけに雪を置く。
  */

  ctx.save();


  ctx.fillStyle =
    "rgba(230,238,241,.96)";


  ctx.beginPath();


  ctx.moveTo(
    x-10,
    y+10
  );


  ctx.lineTo(
    x+w+10,
    y+10
  );


  ctx.lineTo(
    x+w+2,
    y+23
  );


  ctx.lineTo(
    x-3,
    y+23
  );


  ctx.closePath();

  ctx.fill();


  /*
  雪の明るい上面。
  */

  jxRect(
    x,
    y+7,
    w,
    5,
    "rgba(248,251,252,.94)"
  );


  /*
  屋根端の青い雪影。
  */

  jxRect(
    x-3,
    y+21,
    w+6,
    3,
    "rgba(135,160,176,.42)"
  );


  /*
  不規則な積雪。
  */

  for(
    let px=x+13;
    px<x+w-12;
    px+=34
  ){

    const n =
      jxHash(
        Math.floor(px),
        Math.floor(y),
        21
      );


    const sw =
      12+
      Math.floor(
        n*17
      );


    jxRect(
      px,
      y+4+
      n*3,
      sw,
      5,
      "rgba(242,247,249,.88)"
    );

  }


  /*
  つらら。
  */

  for(
    let px=x+19;
    px<x+w-15;
    px+=51
  ){

    const n =
      jxHash(
        Math.floor(px),
        Math.floor(y),
        33
      );


    if(
      n>.35
    ){

      const length =
        5+
        Math.floor(
          n*10
        );


      jxRect(
        px,
        y+23,
        2,
        length,
        "rgba(190,221,232,.72)"
      );


      jxRect(
        px+1,
        y+23,
        1,
        length-2,
        "rgba(242,251,253,.70)"
      );

    }

  }


  /*
  建物の足元にも雪。
  */

  jxSnowBank(
    x-3,
    y+h-5,
    w+6
  );


  ctx.restore();

}


// ============================================================
// SNOW BANK
// ============================================================

function jxSnowBank(
  x,
  y,
  width
){

  ctx.save();


  ctx.fillStyle =
    "rgba(222,232,236,.94)";


  ctx.beginPath();


  ctx.moveTo(
    x,
    y+8
  );


  for(
    let px=0;
    px<=width;
    px+=18
  ){

    const bump =
      2+
      jxHash(
        Math.floor(x+px),
        Math.floor(y),
        44
      )*7;


    ctx.lineTo(
      x+px,
      y+8-bump
    );

  }


  ctx.lineTo(
    x+width,
    y+14
  );


  ctx.lineTo(
    x,
    y+14
  );


  ctx.closePath();

  ctx.fill();


  jxRect(
    x,
    y+11,
    width,
    3,
    "rgba(125,151,165,.18)"
  );


  ctx.restore();

}


// ============================================================
// STALL WINTER OVERLAY
// ============================================================

drawStalls = function(time){

  JX_originalDrawStalls(time);


  if(
    !jxIsOutdoor()
  ){
    return;
  }


  const map =
    jxMap();


  for(
    const stall of
    map.stalls || []
  ){

    const x =
      stall.x*TILE-
      camera.x;


    const y =
      stall.y*TILE-
      camera.y;


    const width =
      stall.width*TILE;


    /*
    屋台テントの上の雪。
    */

    jxRect(
      x-2,
      y-3,
      width+4,
      6,
      "rgba(239,246,248,.96)"
    );


    jxRect(
      x+3,
      y+3,
      width-6,
      3,
      "rgba(183,205,215,.42)"
    );


    /*
    小さな雪の垂れ。
    */

    for(
      let px=x+10;
      px<x+width-5;
      px+=28
    ){

      const n =
        jxHash(
          Math.floor(px),
          Math.floor(y),
          52
        );


      if(
        n>.45
      ){

        jxRect(
          px,
          y+2,
          2,
          4+n*5,
          "rgba(221,239,244,.76)"
        );

      }

    }

  }

};


// ============================================================
// HEATING SMOKE
// ============================================================

function jxHeatingSmoke(
  time
){

  if(
    !jxIsOutdoor()
  ){
    return;
  }


  const map =
    jxMap();


  for(
    const b of
    map.buildings || []
  ){

    const seed =
      jxHash(
        b.x,
        b.y,
        71
      );


    if(
      seed<.48
    ){
      continue;
    }


    const baseX =
      (
        b.x+
        b.w*.72
      )*TILE-
      camera.x;


    const baseY =
      b.y*TILE-
      camera.y+
      3;


    for(
      let i=0;
      i<4;
      i++
    ){

      const cycle =
        (
          time*11+
          i*19+
          seed*40
        )%70;


      const px =
        baseX+
        Math.sin(
          time*.8+
          i+
          seed*5
        )*
        (
          5+
          cycle*.11
        );


      const py =
        baseY-
        cycle;


      const size =
        4+
        cycle*.14;


      ctx.save();

      ctx.globalAlpha =
        Math.max(
          0,
          .28-
          cycle/300
        );


      ctx.fillStyle =
        "rgba(229,235,237,.82)";


      ctx.beginPath();

      ctx.arc(
        px,
        py,
        size,
        0,
        Math.PI*2
      );

      ctx.fill();

      ctx.restore();

    }

  }

}


// ============================================================
// SNOWFALL
// ============================================================

function jxDrawSnowfall(
  time
){

  if(
    !jxIsOutdoor()
  ){
    return;
  }


  const map =
    jxMap();


  const strength =
    map.jixiWinter?.snowStrength ??
    .7;


  const count =
    Math.floor(
      JX_SNOW_COUNT*
      Math.min(
        1,
        strength
      )
    );


  ctx.save();


  for(
    let i=0;
    i<count;
    i++
  ){

    const s =
      jxSnowflakes[i];


    const layerSpeed =
      .55+
      s.layer*.8;


    const y =
      (
        s.y+
        time*
        s.speed*
        layerSpeed
      )%
      (
        canvas.height+
        40
      )-
      20;


    const x =
      (
        s.x+
        Math.sin(
          time*.7+
          s.phase
        )*
        s.drift+
        time*
        (
          4+
          s.layer*9
        )
      )%
      (
        canvas.width+
        40
      )-
      20;


    const size =
      s.size*
      (
        .65+
        s.layer*.65
      );


    ctx.globalAlpha =
      .40+
      s.layer*.48;


    ctx.fillStyle =
      s.layer>.72
        ? "#ffffff"
        : "#e9f2f5";


    if(
      s.layer>.72
    ){

      /*
      手前の雪は少し縦長。
      */

      ctx.fillRect(
        Math.floor(x),
        Math.floor(y),
        Math.max(
          1,
          Math.floor(size)
        ),
        Math.max(
          2,
          Math.floor(size*1.8)
        )
      );

    }

    else{

      ctx.fillRect(
        Math.floor(x),
        Math.floor(y),
        Math.max(
          1,
          Math.floor(size)
        ),
        Math.max(
          1,
          Math.floor(size)
        )
      );

    }

  }


  ctx.restore();

}


// ============================================================
// COLD AIR / WIND
// ============================================================

function jxColdAir(
  time
){

  if(
    !jxIsOutdoor()
  ){
    return;
  }


  /*
  強すぎない横方向の雪煙。
  */

  ctx.save();

  ctx.globalAlpha =
    .08;


  for(
    let i=0;
    i<7;
    i++
  ){

    const y =
      (
        i*97+
        time*5
      )%
      canvas.height;


    const x =
      (
        time*13+
        i*151
      )%
      (
        canvas.width+220
      )-
      220;


    ctx.strokeStyle =
      "rgba(230,240,244,.55)";


    ctx.lineWidth =
      2;


    ctx.beginPath();


    ctx.moveTo(
      x,
      y
    );


    ctx.lineTo(
      x+80,
      y-5
    );


    ctx.stroke();

  }


  ctx.restore();

}


// ============================================================
// FROSTED SCREEN EDGES
// ============================================================

function jxWinterAtmosphere(){

  if(
    !jxIsOutdoor()
  ){
    return;
  }


  /*
  画面上部に冬空の冷たい空気。
  */

  const top =
    ctx.createLinearGradient(
      0,
      0,
      0,
      150
    );


  top.addColorStop(
    0,
    "rgba(202,219,228,.10)"
  );


  top.addColorStop(
    1,
    "rgba(202,219,228,0)"
  );


  ctx.fillStyle =
    top;


  ctx.fillRect(
    0,
    0,
    canvas.width,
    150
  );

}


// ============================================================
// INDOOR WARMTH
// ============================================================

function jxIndoorWarmth(){

  if(
    !jxIsIndoor()
  ){
    return;
  }


  /*
  外の寒さとの差を出すため、
  店内は暖房の効いた暖色。
  */

  ctx.save();

  ctx.fillStyle =
    "rgba(255,176,95,.025)";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.restore();

}


// ============================================================
// FINAL DRAW WRAPPER
// ============================================================

draw = function(time){

  /*
  visuals.js + motion.js までの
  現在の描画をすべて実行。
  */

  JX_originalDraw(time);


  /*
  鶏西・屋外。
  */

  if(
    jxIsOutdoor()
  ){

    /*
    夜景を冬の昼へ。
    */

    jxDaylight();


    /*
    建物から上がる暖房煙。
    */

    jxHeatingSmoke(
      time
    );


    /*
    冬の風。
    */

    jxColdAir(
      time
    );


    /*
    空気遠近感。
    */

    jxWinterAtmosphere();


    /*
    最前面の降雪。
    */

    jxDrawSnowfall(
      time
    );

  }


  /*
  店内は暖かく。
  */

  else if(
    jxIsIndoor()
  ){

    jxIndoorWarmth();

  }

};


// ============================================================
// JIXI UI
// ============================================================

function jxUpdateStaticUI(){

  const title =
    document.querySelector(
      ".game-header h1"
    );


  if(title){

    title.textContent =
      "鸡西・冬日";

  }


  const eyebrow =
    document.querySelector(
      ".eyebrow"
    );


  if(eyebrow){

    eyebrow.textContent =
      "鸡西探索录 · JIXI EXPLORER";

  }


  const footer =
    document.querySelector(
      ".footer-location"
    );


  if(footer){

    footer.textContent =
      "中国 · 黑龙江省 · 鸡西市";

  }


  const clock =
    document.getElementById(
      "clock"
    );


  if(clock){

    clock.textContent =
      "13:42";

  }

}


// ============================================================
// START
// ============================================================

jxUpdateStaticUI();


console.log(
  "鸡西探索录 Winter Visuals Ver.1 loaded"
);
