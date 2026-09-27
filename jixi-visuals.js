"use strict";

/*
============================================================
 鸡西探索录
 JIXI WINTER VISUALS Ver.2

 「雪の杭州」から「冬の鸡西」へ。

 ・杭州風瓦屋根を視覚的に置換
 ・東北地方の中層都市建築
 ・集合住宅＋1階店舗
 ・連続する中国語店招
 ・鸡西大冷面館
 ・スーパー
 ・薬局
 ・スマホ修理店
 ・東北料理店
 ・雪庇 / つらら
 ・暖房煙
 ・凍結路面
 ・轍
 ・積雪
 ・昼間の寒色光
 ・降雪

 gameplay / collision には触れない。
============================================================
*/


// ============================================================
// ORIGINALS
// ============================================================

const JXV2_drawMap =
  drawMap;

const JXV2_draw =
  draw;

const JXV2_drawBuildings =
  drawBuildings;

const JXV2_drawStalls =
  drawStalls;


// ============================================================
// HELPERS
// ============================================================

function j2rect(x,y,w,h,color){

  ctx.fillStyle=color;

  ctx.fillRect(
    Math.floor(x),
    Math.floor(y),
    Math.ceil(w),
    Math.ceil(h)
  );

}


function j2line(
  x1,y1,
  x2,y2,
  color,
  width=1
){

  ctx.save();

  ctx.strokeStyle=color;
  ctx.lineWidth=width;

  ctx.beginPath();

  ctx.moveTo(
    Math.floor(x1)+.5,
    Math.floor(y1)+.5
  );

  ctx.lineTo(
    Math.floor(x2)+.5,
    Math.floor(y2)+.5
  );

  ctx.stroke();

  ctx.restore();

}


function j2hash(x,y,salt=0){

  let n =
    Math.imul(
      x+salt*37,
      374761393
    )+

    Math.imul(
      y+salt*19,
      668265263
    );

  n =
    (n^(n>>>13))>>>0;

  return (n%1000)/1000;

}


function j2map(){

  return getCurrentMap();

}


function j2Outdoor(){

  const m=j2map();

  return !!(
    m &&
    m.jixiWinter &&
    !m.jixiWinter.indoor
  );

}


function j2Indoor(){

  const m=j2map();

  return !!(
    m &&
    m.jixiWinter &&
    m.jixiWinter.indoor
  );

}


// ============================================================
// TEXT
// ============================================================

function j2Text(
  text,
  x,
  y,
  size=12,
  color="#f5f3eb",
  align="center"
){

  ctx.save();

  ctx.imageSmoothingEnabled=false;

  ctx.font=
    `bold ${size}px sans-serif`;

  ctx.textAlign=align;

  ctx.textBaseline="middle";

  ctx.fillStyle=
    "rgba(20,25,29,.65)";

  ctx.fillText(
    text,
    Math.floor(x)+1,
    Math.floor(y)+1
  );

  ctx.fillStyle=color;

  ctx.fillText(
    text,
    Math.floor(x),
    Math.floor(y)
  );

  ctx.restore();

}


// ============================================================
// SNOW
// ============================================================

const J2_SNOW=[];

for(let i=0;i<190;i++){

  J2_SNOW.push({

    x:Math.random()*canvas.width,

    y:Math.random()*canvas.height,

    size:
      1+
      Math.floor(
        Math.random()*3
      ),

    speed:
      18+
      Math.random()*40,

    drift:
      5+
      Math.random()*16,

    phase:
      Math.random()*Math.PI*2,

    layer:
      Math.random()

  });

}


// ============================================================
// MAP SNOW OVERLAY
// ============================================================

drawMap=function(time){

  JXV2_drawMap(time);

  if(!j2Outdoor()){
    return;
  }

  j2Ground(time);

};


function j2Ground(time){

  const map=j2map();

  if(
    !map ||
    !map.grid
  ){
    return;
  }


  const rows=
    map.grid.length;

  const cols=
    map.grid[0].length;


  const sx0=
    Math.max(
      0,
      Math.floor(camera.x/TILE)-1
    );

  const sy0=
    Math.max(
      0,
      Math.floor(camera.y/TILE)-1
    );

  const sx1=
    Math.min(
      cols,
      Math.ceil(
        (camera.x+canvas.width)/TILE
      )+1
    );

  const sy1=
    Math.min(
      rows,
      Math.ceil(
        (camera.y+canvas.height)/TILE
      )+1
    );


  for(let ty=sy0;ty<sy1;ty++){

    for(let tx=sx0;tx<sx1;tx++){

      const tile=
        map.grid[ty][tx];

      const x=
        tx*TILE-camera.x;

      const y=
        ty*TILE-camera.y;

      const seed=
        j2hash(tx,ty,3);


      // ------------------------------------------------------
      // SNOWY PAVEMENT
      // ------------------------------------------------------

      if(tile===T.FLOOR){

        j2rect(
          x,y,TILE,TILE,
          seed>.5
            ? "rgba(218,227,232,.72)"
            : "rgba(203,215,221,.70)"
        );


        if(seed>.68){

          j2rect(
            x+5,
            y+7,
            17,
            2,
            "rgba(249,251,252,.40)"
          );

        }


        if(seed<.20){

          j2rect(
            x+18,
            y+23,
            9,
            2,
            "rgba(124,148,161,.18)"
          );

        }

      }


      // ------------------------------------------------------
      // ROAD
      // ------------------------------------------------------

      else if(tile===T.ROAD){

        j2rect(
          x,y,TILE,TILE,
          seed>.52
            ? "rgba(79,94,103,.59)"
            : "rgba(70,85,95,.60)"
        );


        if(seed>.66){

          j2rect(
            x+3,
            y+6,
            18,
            3,
            "rgba(210,219,223,.18)"
          );

        }


        if(seed>.84){

          j2rect(
            x+8,
            y+18,
            18,
            2,
            "rgba(190,219,229,.18)"
          );

        }

      }


      // ------------------------------------------------------
      // PLAZA
      // ------------------------------------------------------

      else if(tile===T.PLAZA){

        j2rect(
          x,y,TILE,TILE,
          "rgba(198,211,218,.60)"
        );

        ctx.strokeStyle=
          "rgba(110,133,146,.13)";

        ctx.strokeRect(
          Math.floor(x)+.5,
          Math.floor(y)+.5,
          TILE-1,
          TILE-1
        );

      }


      // ------------------------------------------------------
      // GRASS
      // ------------------------------------------------------

      else if(tile===T.GRASS){

        j2rect(
          x,y,TILE,TILE,
          "rgba(217,227,230,.72)"
        );

        if(seed>.58){

          j2line(
            x+9,y+27,
            x+10,y+18,
            "rgba(82,105,95,.25)"
          );

        }

      }


      // ------------------------------------------------------
      // XINGKAI LAKE
      // ------------------------------------------------------

      else if(
        tile===T.WATER &&
        map.jixiWinter?.frozenLake
      ){

        j2rect(
          x,y,TILE,TILE,
          seed>.5
            ? "rgba(157,193,209,.86)"
            : "rgba(145,183,201,.86)"
        );


        if(seed>.70){

          j2rect(
            x+2,
            y+5,
            21,
            5,
            "rgba(233,240,243,.35)"
          );

        }


        if(seed<.25){

          j2line(
            x+4,y+22,
            x+26,y+18,
            "rgba(225,244,248,.35)"
          );

        }

      }

    }

  }


  j2Tracks();

}


// ============================================================
// ROAD TRACKS
// ============================================================

function j2Tracks(){

  /*
  中心大街だけ強く見せる。
  */

  if(currentMapId!=="food"){
    return;
  }


  const center=
    26*TILE-camera.x;


  const tracks=[
    center-50,
    center-36,
    center+36,
    center+50
  ];


  for(const x of tracks){

    j2line(
      x,
      -20,
      x,
      canvas.height+20,
      "rgba(36,51,60,.18)",
      3
    );

  }

}


// ============================================================
// WINDOWS
// ============================================================

function j2Window(
  x,
  y,
  w=16,
  h=19,
  lit=false
){

  /*
  外枠
  */

  j2rect(
    x-2,
    y-2,
    w+4,
    h+4,
    "#3e484d"
  );


  /*
  ガラス
  */

  j2rect(
    x,
    y,
    w,
    h,
    lit
      ? "#b8a77e"
      : "#75909c"
  );


  /*
  冬空の反射
  */

  j2rect(
    x+2,
    y+2,
    w-4,
    3,
    "rgba(218,234,240,.32)"
  );


  /*
  サッシ
  */

  j2rect(
    x+w/2,
    y,
    1,
    h,
    "#46565d"
  );


  j2rect(
    x,
    y+h*.52,
    w,
    1,
    "#46565d"
  );


  /*
  窓下の積雪
  */

  j2rect(
    x-2,
    y+h+2,
    w+4,
    3,
    "#dbe6e9"
  );

}


// ============================================================
// AC UNIT
// ============================================================

function j2AC(x,y){

  j2rect(
    x,
    y,
    13,
    8,
    "#b8c0c1"
  );

  j2rect(
    x+2,
    y+2,
    9,
    1,
    "#727e82"
  );

  j2rect(
    x+2,
    y+5,
    7,
    1,
    "#727e82"
  );

}


// ============================================================
// PIPE
// ============================================================

function j2Pipe(
  x,
  y,
  h
){

  j2rect(
    x,
    y,
    4,
    h,
    "#596367"
  );

  j2rect(
    x+1,
    y,
    1,
    h,
    "#879094"
  );

}


// ============================================================
// SHOP SIGN
// ============================================================

function j2ShopSign(
  text,
  x,
  y,
  w,
  color="#8d3e36"
){

  j2rect(
    x,
    y,
    w,
    25,
    "#293238"
  );


  j2rect(
    x+2,
    y+2,
    w-4,
    21,
    color
  );


  j2rect(
    x+3,
    y+3,
    w-6,
    2,
    "rgba(255,255,255,.16)"
  );


  j2Text(
    text,
    x+w/2,
    y+13,
    Math.min(
      13,
      Math.max(
        9,
        w/(text.length+1)
      )
    ),
    "#f4eee0"
  );

}


// ============================================================
// SHOPFRONT
// ============================================================

function j2ShopFront(
  x,
  y,
  w,
  h,
  sign,
  signColor
){

  /*
  一階外壁
  */

  j2rect(
    x,
    y,
    w,
    h,
    "#565e60"
  );


  /*
  看板
  */

  j2ShopSign(
    sign,
    x+4,
    y+4,
    w-8,
    signColor
  );


  /*
  ガラス
  */

  j2rect(
    x+7,
    y+34,
    w-14,
    h-40,
    "#45636e"
  );


  j2rect(
    x+9,
    y+36,
    w-18,
    3,
    "rgba(210,230,236,.25)"
  );


  /*
  店内の暖色
  */

  j2rect(
    x+11,
    y+44,
    w-22,
    h-52,
    "rgba(194,145,84,.25)"
  );


  /*
  ドア
  */

  const doorW=
    Math.min(
      24,
      w*.28
    );


  const dx=
    x+w/2-doorW/2;


  j2rect(
    dx,
    y+h-39,
    doorW,
    35,
    "#33474e"
  );


  j2rect(
    dx+3,
    y+h-35,
    doorW-6,
    18,
    "#7897a1"
  );


  j2rect(
    dx+doorW-6,
    y+h-19,
    2,
    2,
    "#d4c39b"
  );


  /*
  店頭の雪
  */

  j2rect(
    x,
    y+h-5,
    w,
    7,
    "#dbe6e9"
  );

}


// ============================================================
// GENERIC JIXI URBAN BUILDING
// ============================================================

function j2UrbanBuilding(
  b,
  x,
  y,
  w,
  h,
  options={}
){

  const {

    wall="#70777a",

    side="#5b6265",

    floors=4,

    sign=b.name,

    signColor="#76504a",

    shop=true,

    ac=true,

    pipes=true

  }=options;


  // ----------------------------------------------------------
  // SHADOW
  // ----------------------------------------------------------

  j2rect(
    x+8,
    y+12,
    w,
    h,
    "rgba(25,32,36,.35)"
  );


  // ----------------------------------------------------------
  // BODY
  // ----------------------------------------------------------

  j2rect(
    x,
    y,
    w,
    h,
    wall
  );


  // ----------------------------------------------------------
  // SIDE SHADE
  // ----------------------------------------------------------

  j2rect(
    x+w-13,
    y,
    13,
    h,
    side
  );


  // ----------------------------------------------------------
  // CONCRETE LINES
  // ----------------------------------------------------------

  for(
    let yy=y+10;
    yy<y+h-70;
    yy+=32
  ){

    j2rect(
      x,
      yy,
      w-13,
      1,
      "rgba(44,51,54,.18)"
    );

  }


  // ----------------------------------------------------------
  // WINDOWS
  // ----------------------------------------------------------

  const upperHeight=
    Math.max(
      50,
      h-75
    );


  const floorGap=
    Math.max(
      26,
      upperHeight/floors
    );


  for(let f=0;f<floors;f++){

    const wy=
      y+17+
      f*floorGap;


    if(wy>y+h-77){
      break;
    }


    for(
      let wx=x+18;
      wx<x+w-35;
      wx+=43
    ){

      const seed=
        j2hash(
          Math.floor(wx),
          Math.floor(wy),
          20+f
        );


      j2Window(
        wx,
        wy,
        17,
        18,
        seed>.84
      );

    }

  }


  // ----------------------------------------------------------
  // AIR CONDITIONERS
  // ----------------------------------------------------------

  if(ac){

    for(
      let yy=y+42;
      yy<y+h-100;
      yy+=64
    ){

      j2AC(
        x+w-34,
        yy
      );

    }

  }


  // ----------------------------------------------------------
  // HEATING / DRAIN PIPE
  // ----------------------------------------------------------

  if(pipes){

    j2Pipe(
      x+8,
      y+18,
      Math.max(
        20,
        h-91
      )
    );

  }


  // ----------------------------------------------------------
  // SHOP
  // ----------------------------------------------------------

  if(shop){

    j2ShopFront(
      x+5,
      y+h-69,
      w-23,
      67,
      sign,
      signColor
    );

  }


  // ----------------------------------------------------------
  // SNOW ROOF
  // ----------------------------------------------------------

  j2SnowRoof(
    x,
    y,
    w
  );


  // ----------------------------------------------------------
  // SNOW BANK
  // ----------------------------------------------------------

  j2SnowBank(
    x-3,
    y+h-7,
    w+5
  );

}


// ============================================================
// SNOW ROOF
// ============================================================

function j2SnowRoof(
  x,
  y,
  w
){

  /*
  重要：
  中国南方風の勾配瓦屋根は描かない。

  東北の都市建築らしく
  フラットルーフ＋積雪。
  */

  j2rect(
    x-4,
    y-2,
    w+8,
    10,
    "#dfe9ec"
  );


  j2rect(
    x-2,
    y-5,
    w+4,
    7,
    "#f1f6f7"
  );


  j2rect(
    x-3,
    y+7,
    w+6,
    3,
    "#9db2bd"
  );


  /*
  雪の凹凸
  */

  for(
    let px=x+7;
    px<x+w-8;
    px+=25
  ){

    const n=
      j2hash(
        Math.floor(px),
        Math.floor(y),
        38
      );


    j2rect(
      px,
      y-7-n*3,
      11+n*10,
      5+n*2,
      "#edf4f6"
    );

  }


  /*
  つらら
  */

  for(
    let px=x+18;
    px<x+w-12;
    px+=48
  ){

    const n=
      j2hash(
        Math.floor(px),
        Math.floor(y),
        41
      );


    if(n>.43){

      j2rect(
        px,
        y+8,
        2,
        5+n*8,
        "#b8d7e1"
      );

    }

  }

}


// ============================================================
// SNOW BANK
// ============================================================

function j2SnowBank(
  x,
  y,
  w
){

  ctx.save();

  ctx.fillStyle=
    "#dbe6e9";

  ctx.beginPath();

  ctx.moveTo(
    x,
    y+11
  );


  for(
    let px=0;
    px<=w;
    px+=17
  ){

    const bump=
      3+
      j2hash(
        Math.floor(x+px),
        Math.floor(y),
        47
      )*7;


    ctx.lineTo(
      x+px,
      y+11-bump
    );

  }


  ctx.lineTo(
    x+w,
    y+15
  );

  ctx.lineTo(
    x,
    y+15
  );

  ctx.closePath();

  ctx.fill();


  j2rect(
    x,
    y+12,
    w,
    3,
    "rgba(102,132,147,.22)"
  );

  ctx.restore();

}


// ============================================================
// SUPERMARKET
// ============================================================

function j2Supermarket(
  b,x,y,w,h
){

  j2UrbanBuilding(
    b,x,y,w,h,
    {
      wall:"#747d80",
      side:"#5c676b",
      floors:3,
      sign:"北方生活超市",
      signColor:"#39705d"
    }
  );


  /*
  小さな販促ポスター
  */

  j2rect(
    x+20,
    y+h-31,
    18,
    19,
    "#e7e0ce"
  );


  j2Text(
    "特价",
    x+29,
    y+h-22,
    8,
    "#a44238"
  );

}


// ============================================================
// COLD NOODLE RESTAURANT
// ============================================================

function j2ColdNoodle(
  b,x,y,w,h
){

  j2UrbanBuilding(
    b,x,y,w,h,
    {
      wall:"#796f68",
      side:"#625952",
      floors:3,
      sign:"鸡西大冷面",
      signColor:"#963f35"
    }
  );


  /*
  辣菜の小看板
  */

  j2rect(
    x+w-58,
    y+h-58,
    36,
    18,
    "#e8ddc4"
  );


  j2Text(
    "冷面·辣菜",
    x+w-40,
    y+h-49,
    7,
    "#a23f34"
  );


  /*
  窓の湯気
  */

  j2rect(
    x+31,
    y+h-30,
    26,
    11,
    "rgba(230,235,229,.17)"
  );

}


// ============================================================
// NORTHEAST RESTAURANT
// ============================================================

function j2Restaurant(
  b,x,y,w,h
){

  j2UrbanBuilding(
    b,x,y,w,h,
    {
      wall:"#756c66",
      side:"#5e5753",
      floors:3,
      sign:"东北家常菜",
      signColor:"#88443c"
    }
  );


  j2Text(
    "热菜 · 炖菜",
    x+w/2,
    y+h-25,
    8,
    "#ead9bd"
  );

}


// ============================================================
// CONVENIENCE STORE
// ============================================================

function j2Convenience(
  b,x,y,w,h
){

  j2UrbanBuilding(
    b,x,y,w,h,
    {
      wall:"#68777b",
      side:"#526369",
      floors:3,
      sign:"冬日便利店",
      signColor:"#3c6570"
    }
  );


  /*
  OPEN
  */

  j2rect(
    x+w-54,
    y+h-33,
    28,
    12,
    "#24383e"
  );


  j2Text(
    "营业中",
    x+w-40,
    y+h-27,
    7,
    "#d5e8d4"
  );

}


// ============================================================
// PHARMACY
// ============================================================

function j2Pharmacy(
  b,x,y,w,h
){

  j2UrbanBuilding(
    b,x,y,w,h,
    {
      wall:"#6e7774",
      side:"#58615f",
      floors:2,
      sign:"百姓药房",
      signColor:"#3d7257"
    }
  );


  /*
  薬局十字
  */

  const cx=
    x+w-34;

  const cy=
    y+h-48;


  j2rect(
    cx-3,
    cy-10,
    6,
    20,
    "#d8eee2"
  );


  j2rect(
    cx-10,
    cy-3,
    20,
    6,
    "#d8eee2"
  );

}


// ============================================================
// PHONE SHOP
// ============================================================

function j2PhoneShop(
  b,x,y,w,h
){

  j2UrbanBuilding(
    b,x,y,w,h,
    {
      wall:"#68707b",
      side:"#535b65",
      floors:2,
      sign:"手机维修",
      signColor:"#426184"
    }
  );


  /*
  スマホアイコン
  */

  const px=
    x+23;

  const py=
    y+h-37;


  j2rect(
    px,
    py,
    13,
    21,
    "#202b34"
  );


  j2rect(
    px+2,
    py+3,
    9,
    13,
    "#7da0af"
  );


  j2rect(
    px+5,
    py+18,
    3,
    1,
    "#d5d9d7"
  );

}


// ============================================================
// FALLBACK URBAN BUILDING
// ============================================================

function j2GenericBuilding(
  b,x,y,w,h
){

  j2UrbanBuilding(
    b,x,y,w,h,
    {
      wall:b.color || "#70777a",
      side:"#555f63",
      floors:
        h>250
          ? 4
          : 3,
      sign:b.name || "商店",
      signColor:"#76504a"
    }
  );

}


// ============================================================
// BUILDING DISPATCH
// ============================================================

function j2DrawJixiBuilding(
  b,x,y,w,h
){

  switch(b.jixiStyle){

    case "supermarket":

      j2Supermarket(
        b,x,y,w,h
      );

      break;


    case "coldNoodle":

      j2ColdNoodle(
        b,x,y,w,h
      );

      break;


    case "restaurant":

      j2Restaurant(
        b,x,y,w,h
      );

      break;


    case "convenience":

      j2Convenience(
        b,x,y,w,h
      );

      break;


    case "pharmacy":

      j2Pharmacy(
        b,x,y,w,h
      );

      break;


    case "phoneShop":

      j2PhoneShop(
        b,x,y,w,h
      );

      break;


    default:

      j2GenericBuilding(
        b,x,y,w,h
      );

      break;

  }

}


// ============================================================
// BUILDINGS OVERRIDE
// ============================================================

drawBuildings=function(){

  /*
  ============================================================
  鸡西の屋外マップ
  ============================================================
  */

  if(
    j2Outdoor() &&
    currentMapId==="food"
  ){

    const map=j2map();


    for(
      const b of
      map.buildings || []
    ){

      const x=
        b.x*TILE-camera.x;

      const y=
        b.y*TILE-camera.y;

      const w=
        b.w*TILE;

      const h=
        b.h*TILE;


      if(
        x>canvas.width+100 ||
        y>canvas.height+100 ||
        x+w<-100 ||
        y+h<-100
      ){
        continue;
      }


      /*
      ここでは元の杭州建築を描かない。
      完全に鶏西建築へ置換。
      */

      j2DrawJixiBuilding(
        b,x,y,w,h
      );

    }


    return;

  }


  /*
  他マップは次回置換するまで
  既存 visuals.js を維持。
  */

  JXV2_drawBuildings();

};


// ============================================================
// WINTER STALLS
// ============================================================

drawStalls=function(time){

  JXV2_drawStalls(time);


  if(!j2Outdoor()){
    return;
  }


  const map=j2map();


  for(
    const s of
    map.stalls || []
  ){

    const x=
      s.x*TILE-camera.x;

    const y=
      s.y*TILE-camera.y;

    const w=
      s.width*TILE;


    /*
    テント積雪
    */

    j2rect(
      x-2,
      y-4,
      w+4,
      7,
      "#edf4f6"
    );


    j2rect(
      x,
      y+3,
      w,
      3,
      "#a9bec8"
    );


    /*
    雪垂れ
    */

    for(
      let px=x+11;
      px<x+w-5;
      px+=29
    ){

      const n=
        j2hash(
          Math.floor(px),
          Math.floor(y),
          61
        );


      if(n>.45){

        j2rect(
          px,
          y+3,
          2,
          4+n*5,
          "#c6e0e7"
        );

      }

    }

  }

};


// ============================================================
// HEATING SMOKE
// ============================================================

function j2HeatingSmoke(time){

  if(!j2Outdoor()){
    return;
  }


  const map=j2map();


  for(
    const b of
    map.buildings || []
  ){

    const seed=
      j2hash(
        b.x,
        b.y,
        71
      );


    if(seed<.42){
      continue;
    }


    const bx=
      (
        b.x+
        b.w*.76
      )*TILE-
      camera.x;


    const by=
      b.y*TILE-
      camera.y-
      2;


    for(let i=0;i<4;i++){

      const cycle=
        (
          time*10+
          i*18+
          seed*47
        )%72;


      const px=
        bx+
        Math.sin(
          time*.7+
          i+
          seed*4
        )*
        (
          4+
          cycle*.12
        );


      const py=
        by-cycle;


      const r=
        4+
        cycle*.12;


      ctx.save();

      ctx.globalAlpha=
        Math.max(
          0,
          .28-cycle/310
        );


      ctx.fillStyle=
        "#e4eaeb";


      ctx.beginPath();

      ctx.arc(
        px,
        py,
        r,
        0,
        Math.PI*2
      );

      ctx.fill();

      ctx.restore();

    }

  }

}


// ============================================================
// DAYLIGHT
// ============================================================

function j2Daylight(){

  if(!j2Outdoor()){
    return;
  }


  ctx.save();

  ctx.globalCompositeOperation=
    "screen";


  const g=
    ctx.createLinearGradient(
      0,0,
      0,canvas.height
    );


  g.addColorStop(
    0,
    "rgba(172,195,209,.33)"
  );


  g.addColorStop(
    .5,
    "rgba(150,173,187,.24)"
  );


  g.addColorStop(
    1,
    "rgba(116,139,151,.16)"
  );


  ctx.fillStyle=g;


  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  ctx.restore();

}


// ============================================================
// COLD WIND
// ============================================================

function j2Wind(time){

  if(!j2Outdoor()){
    return;
  }


  ctx.save();

  ctx.globalAlpha=.07;


  for(let i=0;i<6;i++){

    const y=
      (
        i*103+
        time*5
      )%
      canvas.height;


    const x=
      (
        time*14+
        i*167
      )%
      (
        canvas.width+200
      )-
      200;


    j2line(
      x,
      y,
      x+75,
      y-5,
      "#edf5f7",
      2
    );

  }


  ctx.restore();

}


// ============================================================
// FALLING SNOW
// ============================================================

function j2Snowfall(time){

  if(!j2Outdoor()){
    return;
  }


  const map=j2map();


  const strength=
    map.jixiWinter?.snowStrength ?? .7;


  const count=
    Math.floor(
      J2_SNOW.length*
      Math.min(
        1,
        strength
      )
    );


  ctx.save();


  for(let i=0;i<count;i++){

    const s=
      J2_SNOW[i];


    const y=
      (
        s.y+
        time*
        s.speed*
        (
          .55+
          s.layer*.8
        )
      )%
      (
        canvas.height+40
      )-
      20;


    const x=
      (
        s.x+
        Math.sin(
          time*.7+s.phase
        )*
        s.drift+
        time*
        (
          4+
          s.layer*9
        )
      )%
      (
        canvas.width+40
      )-
      20;


    const size=
      s.size*
      (
        .65+
        s.layer*.65
      );


    ctx.globalAlpha=
      .42+
      s.layer*.46;


    ctx.fillStyle=
      s.layer>.72
        ? "#ffffff"
        : "#eaf3f6";


    ctx.fillRect(
      Math.floor(x),
      Math.floor(y),
      Math.max(
        1,
        Math.floor(size)
      ),
      Math.max(
        1,
        Math.floor(
          size*
          (
            s.layer>.72
              ? 1.7
              : 1
          )
        )
      )
    );

  }


  ctx.restore();

}


// ============================================================
// INDOOR WARMTH
// ============================================================

function j2IndoorWarmth(){

  if(!j2Indoor()){
    return;
  }


  ctx.save();

  ctx.fillStyle=
    "rgba(255,176,95,.028)";


  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  ctx.restore();

}


// ============================================================
// FINAL DRAW
// ============================================================

draw=function(time){

  /*
  既存ゲーム＋visuals＋motion
  */

  JXV2_draw(time);


  if(j2Outdoor()){

    /*
    昼光
    */

    j2Daylight();


    /*
    集合住宅・店舗の暖房煙
    */

    j2HeatingSmoke(time);


    /*
    寒風
    */

    j2Wind(time);


    /*
    最前面の降雪
    */

    j2Snowfall(time);

  }


  else if(j2Indoor()){

    j2IndoorWarmth();

  }

};


// ============================================================
// UI
// ============================================================

function j2UpdateUI(){

  const title=
    document.querySelector(
      ".game-header h1"
    );


  if(title){

    title.textContent=
      "鸡西・冬日";

  }


  const eyebrow=
    document.querySelector(
      ".eyebrow"
    );


  if(eyebrow){

    eyebrow.textContent=
      "鸡西探索录 · JIXI EXPLORER";

  }


  const footer=
    document.querySelector(
      ".footer-location"
    );


  if(footer){

    footer.textContent=
      "中国 · 黑龙江省 · 鸡西市";

  }

}


j2UpdateUI();


console.log(
  "鸡西探索录 Winter Visuals Ver.2 loaded"
);
