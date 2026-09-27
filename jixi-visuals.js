"use strict";

/*
==========================================================
 鸡西探索录
 JIXI VISUAL SYSTEM Ver.4
 "WINTER CITY"

 対応：
  food   = 鸡冠区・中心大街
  market = 园林路・南山早市
  hotel  = 鸡西站・煤城街区
  lake   = 兴凯湖・冰雪湖岸

 方針：
 ・杭州版 visuals.js のゲーム機能は維持
 ・屋外建築を東北都市型へ変更
 ・南山早市を専用描画
 ・鸡西站エリアを専用描画
 ・兴凯湖を完全冬景色化
 ・雪、除雪跡、煙、氷、冬季生活感を追加
==========================================================
*/


// ======================================================
// ORIGINAL
// ======================================================

const JX4_originalDrawMap = drawMap;
const JX4_originalDrawBuildings = drawBuildings;
const JX4_originalDrawStalls = drawStalls;
const JX4_originalDraw = draw;


// ======================================================
// BASIC
// ======================================================

function jx4Map(){
  return getCurrentMap();
}

function jx4Outdoor(){
  return (
    currentMapId==="food" ||
    currentMapId==="market" ||
    currentMapId==="hotel" ||
    currentMapId==="lake"
  );
}

function jx4Rect(x,y,w,h,color){
  ctx.fillStyle=color;
  ctx.fillRect(
    Math.floor(x),
    Math.floor(y),
    Math.ceil(w),
    Math.ceil(h)
  );
}

function jx4Line(x1,y1,x2,y2,color,width=1){

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

function jx4Hash(x,y,salt=0){

  let n=
    Math.imul(
      (x|0)+salt*31,
      374761393
    )+
    Math.imul(
      (y|0)+salt*17,
      668265263
    );

  n=(n^(n>>>13))>>>0;

  return (n%1000)/1000;
}

function jx4Visible(x,y,w=32,h=32){

  return !(
    x>canvas.width+120 ||
    y>canvas.height+120 ||
    x+w<-120 ||
    y+h<-120
  );
}


// ======================================================
// MAP
// ======================================================

drawMap=function(time){

  JX4_originalDrawMap(time);

  if(!jx4Outdoor()){
    return;
  }

  jx4WinterGround(time);

  if(currentMapId==="food"){
    jx4DowntownGround();
  }

  else if(currentMapId==="market"){
    jx4MarketGround();
  }

  else if(currentMapId==="hotel"){
    jx4StationGround();
  }

  else if(currentMapId==="lake"){
    jx4LakeGround(time);
  }

};


// ======================================================
// WINTER GROUND
// ======================================================

function jx4WinterGround(time){

  const map=jx4Map();

  const rows=map.grid.length;
  const cols=map.grid[0].length;

  const x0=Math.max(
    0,
    Math.floor(camera.x/TILE)-1
  );

  const x1=Math.min(
    cols,
    Math.ceil(
      (camera.x+canvas.width)/TILE
    )+1
  );

  const y0=Math.max(
    0,
    Math.floor(camera.y/TILE)-1
  );

  const y1=Math.min(
    rows,
    Math.ceil(
      (camera.y+canvas.height)/TILE
    )+1
  );


  for(let ty=y0;ty<y1;ty++){

    for(let tx=x0;tx<x1;tx++){

      const tile=map.grid[ty][tx];

      const x=
        tx*TILE-camera.x;

      const y=
        ty*TILE-camera.y;

      const seed=
        jx4Hash(tx,ty,7);


      // ----------------------------------
      // ROAD
      // ----------------------------------

      if(tile===T.ROAD){

        jx4Rect(
          x,y,
          TILE,TILE,
          "rgba(92,105,112,.30)"
        );

        // 圧雪
        if(seed>.32){

          jx4Rect(
            x+3,
            y+2,
            TILE-6,
            3,
            "rgba(220,228,229,.14)"
          );

        }

        if(seed>.72){

          jx4Rect(
            x+21,
            y+22,
            7,
            2,
            "rgba(229,235,235,.18)"
          );

        }

      }


      // ----------------------------------
      // FLOOR
      // ----------------------------------

      else if(tile===T.FLOOR){

        jx4Rect(
          x,y,
          TILE,TILE,
          "rgba(190,202,202,.23)"
        );

        if(seed>.45){

          jx4Rect(
            x+2,
            y+2,
            TILE-4,
            4,
            "rgba(240,244,241,.18)"
          );

        }

      }


      // ----------------------------------
      // PLAZA
      // ----------------------------------

      else if(tile===T.PLAZA){

        jx4Rect(
          x,y,
          TILE,TILE,
          "rgba(179,192,195,.20)"
        );

        if((tx+ty)%2===0){

          jx4Rect(
            x+2,
            y+2,
            TILE-4,
            TILE-4,
            "rgba(229,235,234,.07)"
          );

        }

      }


      // ----------------------------------
      // GRASS
      // ----------------------------------

      else if(tile===T.GRASS){

        jx4Rect(
          x,y,
          TILE,TILE,
          "rgba(218,228,224,.42)"
        );

        if(seed>.55){

          jx4Rect(
            x+5,
            y+4,
            18,
            4,
            "rgba(246,248,244,.28)"
          );

        }

      }


      // ----------------------------------
      // WATER
      // ----------------------------------

      else if(
        tile===T.WATER &&
        currentMapId==="lake"
      ){

        jx4Rect(
          x,y,
          TILE,TILE,
          "rgba(158,191,201,.68)"
        );

        jx4Rect(
          x,
          y+6,
          TILE,
          1,
          "rgba(224,241,244,.28)"
        );

        if(seed>.72){

          jx4Line(
            x+4,
            y+21,
            x+18,
            y+18,
            "rgba(79,125,142,.28)"
          );

        }

      }

    }

  }

}


// ======================================================
// FOOD : 鸡冠区・中心大街
// ======================================================

function jx4DowntownGround(){

  // 中心街の除雪跡

  const center=
    31*TILE-camera.x;

  for(let y=-60;y<canvas.height+80;y+=92){

    jx4Rect(
      center-62,
      y,
      3,
      38,
      "rgba(48,57,62,.20)"
    );

    jx4Rect(
      center+53,
      y+19,
      3,
      38,
      "rgba(48,57,62,.18)"
    );

  }


  // 車道中央の薄い雪筋

  jx4Rect(
    center-3,
    0,
    6,
    canvas.height,
    "rgba(217,225,225,.08)"
  );

}


// ======================================================
// MARKET : 南山早市
// ======================================================

function jx4MarketGround(){

  const map=jx4Map();

  // 早市は道路脇に踏み固められた雪が多い

  for(let ty=2;ty<map.grid.length-2;ty+=4){

    for(let tx=2;tx<map.grid[0].length-2;tx+=5){

      const tile=map.grid[ty][tx];

      if(
        tile!==T.ROAD &&
        tile!==T.PLAZA
      ){
        continue;
      }

      const x=
        tx*TILE-camera.x;

      const y=
        ty*TILE-camera.y;

      if(!jx4Visible(x,y)){
        continue;
      }

      jx4Rect(
        x+6,
        y+21,
        17,
        4,
        "rgba(232,236,232,.10)"
      );

    }

  }

}


// ======================================================
// HOTEL : 鸡西站・煤城街区
// ======================================================

function jx4StationGround(){

  const map=jx4Map();

  // 駅前広場の大きな舗装ライン

  for(let ty=0;ty<map.grid.length;ty++){

    for(let tx=0;tx<map.grid[0].length;tx++){

      if(map.grid[ty][tx]!==T.PLAZA){
        continue;
      }

      const x=
        tx*TILE-camera.x;

      const y=
        ty*TILE-camera.y;

      if(!jx4Visible(x,y)){
        continue;
      }

      if((tx+ty)%3===0){

        jx4Line(
          x,
          y+TILE-2,
          x+TILE,
          y+TILE-2,
          "rgba(89,103,110,.15)"
        );

      }

    }

  }

}


// ======================================================
// LAKE : 兴凯湖
// ======================================================

function jx4LakeGround(time){

  const map=jx4Map();

  for(let ty=0;ty<map.grid.length;ty++){

    for(let tx=0;tx<map.grid[0].length;tx++){

      if(map.grid[ty][tx]!==T.WATER){
        continue;
      }

      const x=
        tx*TILE-camera.x;

      const y=
        ty*TILE-camera.y;

      if(!jx4Visible(x,y)){
        continue;
      }

      const seed=
        jx4Hash(tx,ty,41);


      // 氷の筋

      if(seed>.73){

        jx4Line(
          x+3,
          y+10,
          x+19,
          y+8,
          "rgba(237,248,249,.35)"
        );

      }


      if(seed<.13){

        jx4Line(
          x+13,
          y+27,
          x+29,
          y+18,
          "rgba(83,136,153,.25)"
        );

      }

    }

  }

}


// ======================================================
// BUILDINGS
// ======================================================

drawBuildings=function(){

  const map=jx4Map();

  if(!jx4Outdoor()){

    JX4_originalDrawBuildings();

    return;
  }

  if(!map.buildings){
    return;
  }


  for(const b of map.buildings){

    const x=
      b.x*TILE-camera.x;

    const y=
      b.y*TILE-camera.y;

    const w=
      b.w*TILE;

    const h=
      b.h*TILE;


    if(!jx4Visible(x,y,w,h)){
      continue;
    }


    if(currentMapId==="food"){

      jx4DrawCityBuilding(
        b,x,y,w,h
      );

    }


    else if(currentMapId==="market"){

      jx4DrawMarketBuilding(
        b,x,y,w,h
      );

    }


    else if(currentMapId==="hotel"){

      jx4DrawStationBuilding(
        b,x,y,w,h
      );

    }


    else if(currentMapId==="lake"){

      jx4DrawLakeBuilding(
        b,x,y,w,h
      );

    }

  }

};


// ======================================================
// COMMON BUILDING
// ======================================================

function jx4BuildingShell(
  b,x,y,w,h,
  options={}
){

  const body=
    options.body||
    "#6d6b68";

  const lower=
    options.lower||
    "#4f5050";

  const trim=
    options.trim||
    "#85817b";


  // shadow

  jx4Rect(
    x+8,
    y+12,
    w,
    h+6,
    "rgba(34,43,48,.22)"
  );


  // wall

  jx4Rect(
    x+3,
    y+12,
    w-6,
    h-12,
    body
  );


  // lower floor

  jx4Rect(
    x+5,
    y+h*.58,
    w-10,
    h*.42-4,
    lower
  );


  // flat roof

  jx4Rect(
    x-2,
    y+6,
    w+4,
    10,
    "#4e5456"
  );

  jx4Rect(
    x,
    y+4,
    w,
    6,
    "#d7ddda"
  );

  jx4Rect(
    x+5,
    y+2,
    w-10,
    5,
    "#eef1ed"
  );


  // snow lip

  jx4Rect(
    x+2,
    y+7,
    w-4,
    3,
    "rgba(246,248,245,.90)"
  );


  // floors/windows

  const floors=
    Math.max(
      1,
      Math.floor(
        (h-50)/44
      )
    );

  for(let row=0;row<floors;row++){

    const wy=
      y+26+row*43;

    for(
      let wx=x+17;
      wx<x+w-25;
      wx+=43
    ){

      jx4Rect(
        wx,
        wy,
        21,
        18,
        "#39484f"
      );

      jx4Rect(
        wx+2,
        wy+2,
        8,
        6,
        "rgba(174,199,202,.25)"
      );

      jx4Line(
        wx+10,
        wy,
        wx+10,
        wy+18,
        "rgba(16,27,31,.55)"
      );

    }

  }


  // pipes

  if(w>190){

    jx4Rect(
      x+w-24,
      y+20,
      4,
      h-36,
      "#565c5d"
    );

    jx4Rect(
      x+w-23,
      y+21,
      1,
      h-38,
      "#929696"
    );

  }


  // AC units

  if(w>220){

    for(let ax=x+65;ax<x+w-45;ax+=130){

      jx4Rect(
        ax,
        y+55,
        24,
        13,
        "#92999a"
      );

      jx4Line(
        ax+4,
        y+60,
        ax+20,
        y+60,
        "#596264"
      );

    }

  }


  jx4ShopFront(
    b,x,y,w,h,
    trim
  );

}


// ======================================================
// SHOP FRONT
// ======================================================

function jx4ShopFront(
  b,x,y,w,h,
  trim
){

  const doorX=
    b.doorX!==undefined
      ? b.doorX*TILE-camera.x
      : x+w/2;


  // fascia

  jx4Rect(
    x+9,
    y+h-47,
    w-18,
    25,
    "#394043"
  );

  jx4Rect(
    x+10,
    y+h-46,
    w-20,
    3,
    trim
  );


  // windows

  const leftWidth=
    Math.max(
      22,
      doorX-(x+16)-20
    );

  const rightStart=
    doorX+20;

  const rightWidth=
    Math.max(
      22,
      x+w-16-rightStart
    );


  if(leftWidth>25){

    jx4Rect(
      x+16,
      y+h-39,
      leftWidth,
      22,
      "#26383e"
    );

  }


  if(rightWidth>25){

    jx4Rect(
      rightStart,
      y+h-39,
      rightWidth,
      22,
      "#26383e"
    );

  }


  // door

  jx4Rect(
    doorX-13,
    y+h-39,
    26,
    39,
    "#242d30"
  );

  jx4Rect(
    doorX-9,
    y+h-34,
    18,
    22,
    "#3e555b"
  );

  jx4Rect(
    doorX+6,
    y+h-20,
    3,
    3,
    "#d3c595"
  );


  // sign

  const signText=
    b.name||"商店";

  const signW=
    Math.min(
      w-34,
      Math.max(
        92,
        signText.length*17+30
      )
    );

  jx4Rect(
    x+w/2-signW/2,
    y+h-68,
    signW,
    24,
    "#314247"
  );

  jx4Rect(
    x+w/2-signW/2,
    y+h-68,
    signW,
    2,
    "#aab7b7"
  );

  ctx.fillStyle="#f2eee2";
  ctx.font="bold 13px sans-serif";
  ctx.textAlign="center";
  ctx.textBaseline="middle";

  ctx.fillText(
    signText,
    x+w/2,
    y+h-56
  );

}


// ======================================================
// FOOD BUILDINGS
// ======================================================

function jx4DrawCityBuilding(
  b,x,y,w,h
){

  const name=b.name||"";


  if(
    b.style==="coldNoodle" ||
    name.includes("冷面")
  ){

    jx4BuildingShell(
      b,x,y,w,h,
      {
        body:"#746f69",
        lower:"#5a5049",
        trim:"#b94e3f"
      }
    );

    jx4Rect(
      x+18,
      y+h-95,
      Math.min(w-36,180),
      26,
      "#9b332c"
    );

    ctx.fillStyle="#fff0d7";
    ctx.font="bold 15px sans-serif";
    ctx.textAlign="center";

    ctx.fillText(
      "鸡西大冷面",
      x+Math.min(w/2,108),
      y+h-77
    );

    return;
  }


  if(
    b.style==="supermarket" ||
    name.includes("超市")
  ){

    jx4BuildingShell(
      b,x,y,w,h,
      {
        body:"#777a76",
        lower:"#5b6666",
        trim:"#3f7872"
      }
    );

    return;
  }


  if(
    b.style==="pharmacy" ||
    name.includes("药房")
  ){

    jx4BuildingShell(
      b,x,y,w,h,
      {
        body:"#777773",
        lower:"#5a6260",
        trim:"#3e8a6b"
      }
    );

    return;
  }


  if(
    b.style==="phoneShop"
  ){

    jx4BuildingShell(
      b,x,y,w,h,
      {
        body:"#6c706f",
        lower:"#4c5559",
        trim:"#477c91"
      }
    );

    return;
  }


  jx4BuildingShell(
    b,x,y,w,h,
    {
      body:"#716d67",
      lower:"#55514d",
      trim:"#8a6b55"
    }
  );

}


// ======================================================
// MARKET BUILDINGS
// ======================================================

function jx4DrawMarketBuilding(
  b,x,y,w,h
){

  // 南山早市周辺は
  // 中心街より低層・雑多に見せる

  const seed=
    jx4Hash(
      b.x,
      b.y,
      33
    );

  const body=
    seed>.5
      ? "#746e65"
      : "#6b706c";

  const lower=
    seed>.5
      ? "#554b44"
      : "#505957";


  jx4BuildingShell(
    b,x,y,w,h,
    {
      body,
      lower,
      trim:"#8b6e54"
    }
  );


  // 外壁の配管

  if(w>120){

    jx4Rect(
      x+20,
      y+18,
      3,
      Math.max(20,h-72),
      "#515858"
    );

  }


  // 店先の雪かき跡

  jx4Rect(
    x+12,
    y+h+2,
    w-24,
    5,
    "rgba(230,235,231,.35)"
  );

}


// ======================================================
// STATION BUILDINGS
// ======================================================

function jx4DrawStationBuilding(
  b,x,y,w,h
){

  const name=b.name||"";


  if(
    name.includes("鸡西站") ||
    b.style==="station"
  ){

    jx4DrawRailwayStation(
      b,x,y,w,h
    );

    return;
  }


  if(
    b.type==="hotel" ||
    name.includes("宾馆") ||
    name.includes("旅馆")
  ){

    jx4BuildingShell(
      b,x,y,w,h,
      {
        body:"#777672",
        lower:"#4f5657",
        trim:"#8b694b"
      }
    );

    return;
  }


  jx4BuildingShell(
    b,x,y,w,h,
    {
      body:"#686d6e",
      lower:"#4c5254",
      trim:"#727c7e"
    }
  );

}


// ======================================================
// RAILWAY STATION
// ======================================================

function jx4DrawRailwayStation(
  b,x,y,w,h
){

  // large station body

  jx4Rect(
    x+6,
    y+24,
    w-12,
    h-24,
    "#777a78"
  );


  // central raised section

  const cw=
    Math.min(
      w*.42,
      280
    );

  const cx=
    x+w/2-cw/2;

  jx4Rect(
    cx,
    y+4,
    cw,
    h-4,
    "#858582"
  );


  // roof snow

  jx4Rect(
    x,
    y+17,
    w,
    10,
    "#dfe5e2"
  );

  jx4Rect(
    cx-4,
    y,
    cw+8,
    10,
    "#edf1ee"
  );


  // station windows

  for(let wx=x+25;wx<x+w-30;wx+=48){

    jx4Rect(
      wx,
      y+h-72,
      28,
      32,
      "#32484f"
    );

    jx4Line(
      wx+14,
      y+h-72,
      wx+14,
      y+h-40,
      "#18292f"
    );

  }


  // entrance

  jx4Rect(
    x+w/2-38,
    y+h-55,
    76,
    55,
    "#293c43"
  );

  jx4Rect(
    x+w/2-31,
    y+h-49,
    62,
    40,
    "#46626a"
  );


  // station sign

  jx4Rect(
    x+w/2-74,
    y+19,
    148,
    30,
    "#606461"
  );

  ctx.fillStyle="#f3f1e8";
  ctx.font="bold 19px sans-serif";
  ctx.textAlign="center";
  ctx.textBaseline="middle";

  ctx.fillText(
    "鸡 西 站",
    x+w/2,
    y+34
  );

}


// ======================================================
// LAKE BUILDINGS
// ======================================================

function jx4DrawLakeBuilding(
  b,x,y,w,h
){

  jx4BuildingShell(
    b,x,y,w,h,
    {
      body:"#696b67",
      lower:"#4e5351",
      trim:"#6e7f7d"
    }
  );

}


// ======================================================
// STALLS
// ======================================================

drawStalls=function(time){

  const map=jx4Map();


  if(!jx4Outdoor()){

    JX4_originalDrawStalls(time);

    return;
  }


  for(
    let index=0;
    index<(map.stalls||[]).length;
    index++
  ){

    const stall=
      map.stalls[index];

    const x=
      stall.x*TILE-camera.x;

    const y=
      stall.y*TILE-camera.y;

    const w=
      stall.width*TILE;


    if(!jx4Visible(x,y,w,70)){
      continue;
    }


    if(currentMapId==="market"){

      jx4DrawMorningMarketStall(
        stall,
        x,y,w,
        index,
        time
      );

    }

    else{

      jx4DrawWinterFoodStall(
        stall,
        x,y,w,
        index,
        time
      );

    }

  }

};


// ======================================================
// MORNING MARKET STALL
// ======================================================

function jx4DrawMorningMarketStall(
  stall,
  x,y,w,
  index,
  time
){

  const even=
    index%2===0;


  // snow behind stall

  jx4Rect(
    x-5,
    y+38,
    w+10,
    8,
    "rgba(228,234,231,.40)"
  );


  // poles

  jx4Rect(
    x+4,
    y+7,
    4,
    37,
    "#4a4b49"
  );

  jx4Rect(
    x+w-8,
    y+7,
    4,
    37,
    "#4a4b49"
  );


  // simple tarp

  jx4Rect(
    x,
    y,
    w,
    13,
    even
      ? "#526a73"
      : "#775b4d"
  );

  jx4Rect(
    x,
    y,
    w,
    3,
    "#e7ece8"
  );


  // table

  jx4Rect(
    x+5,
    y+27,
    w-10,
    13,
    "#62564a"
  );


  // goods

  for(
    let gx=x+12;
    gx<x+w-14;
    gx+=17
  ){

    const seed=
      jx4Hash(
        Math.floor(gx),
        index,
        52
      );

    jx4Rect(
      gx,
      y+22,
      10,
      6,
      seed>.5
        ? "#8b5d42"
        : "#69754f"
    );

  }


  // sign

  jx4Rect(
    x+w/2-34,
    y+8,
    68,
    15,
    "#ece5d4"
  );

  ctx.fillStyle="#343331";
  ctx.font="bold 10px sans-serif";
  ctx.textAlign="center";
  ctx.textBaseline="middle";

  ctx.fillText(
    stall.sign||"早市",
    x+w/2,
    y+15
  );


  if(
    stall.type==="food" ||
    stall.type==="shaokao"
  ){

    jx4Steam(
      x+w/2,
      y+24,
      time,
      index
    );

  }

}


// ======================================================
// WINTER FOOD STALL
// ======================================================

function jx4DrawWinterFoodStall(
  stall,
  x,y,w,
  index,
  time
){

  jx4Rect(
    x+4,
    y+10,
    4,
    31,
    "#4d4843"
  );

  jx4Rect(
    x+w-8,
    y+10,
    4,
    31,
    "#4d4843"
  );


  jx4Rect(
    x,
    y,
    w,
    15,
    "#70483b"
  );


  // snow on awning

  jx4Rect(
    x,
    y,
    w,
    4,
    "#e8eeeb"
  );


  jx4Rect(
    x+6,
    y+29,
    w-12,
    12,
    "#5b4a3e"
  );


  jx4Rect(
    x+w/2-37,
    y+5,
    74,
    16,
    "#394346"
  );


  ctx.fillStyle="#f3eee2";
  ctx.font="bold 10px sans-serif";
  ctx.textAlign="center";
  ctx.textBaseline="middle";

  ctx.fillText(
    stall.sign||"小吃",
    x+w/2,
    y+13
  );


  jx4Steam(
    x+w/2,
    y+27,
    time,
    index
  );

}


// ======================================================
// STEAM
// ======================================================

function jx4Steam(
  x,y,
  time,
  seed=0
){

  const t=
    (
      time*14+
      seed*7
    )%24;


  ctx.fillStyle=
    "rgba(238,242,239,.38)";


  jx4Rect(
    x-8,
    y-t*.6,
    3,
    7,
    "rgba(238,242,239,.34)"
  );

  jx4Rect(
    x+2,
    y-7-t*.8,
    3,
    8,
    "rgba(238,242,239,.28)"
  );

  jx4Rect(
    x+11,
    y-2-t*.5,
    2,
    6,
    "rgba(238,242,239,.22)"
  );

}


// ======================================================
// AFTER DRAW
// ======================================================

draw=function(time){

  /*
   visuals.js + motion.js + game.js の
   現在の描画を全部先に実行する。
  */

  JX4_originalDraw(time);


  if(!jx4Outdoor()){
    return;
  }


  // 遠景
  jx4DrawAtmosphere(time);


  // 地図ごとの追加要素

  if(currentMapId==="food"){

    jx4DrawDowntownDetails(time);

  }

  else if(currentMapId==="market"){

    jx4DrawMarketDetails(time);

  }

  else if(currentMapId==="hotel"){

    jx4DrawStationDetails(time);

  }

  else if(currentMapId==="lake"){

    jx4DrawFrozenLakeDetails(time);

  }


  // snow is last
  jx4DrawSnow(time);

  // cold daylight
  jx4Daylight();

};


// ======================================================
// DOWNTOWN DETAILS
// ======================================================

function jx4DrawDowntownDetails(time){

  // pedestrian crossing near central avenue

  const worldY=
    14*TILE;

  const y=
    worldY-camera.y;

  const cx=
    31*TILE-camera.x;


  if(
    y>-80 &&
    y<canvas.height+80
  ){

    for(let i=-4;i<=4;i++){

      jx4Rect(
        cx+i*18-6,
        y,
        11,
        38,
        "rgba(229,233,230,.32)"
      );

    }

  }


  // road-side snowbanks

  const left=
    25*TILE-camera.x;

  const right=
    37*TILE-camera.x;


  for(let y=-30;y<canvas.height+50;y+=58){

    jx4Rect(
      left-5,
      y,
      7,
      27,
      "rgba(235,239,236,.35)"
    );

    jx4Rect(
      right-2,
      y+20,
      7,
      28,
      "rgba(235,239,236,.30)"
    );

  }

}


// ======================================================
// MARKET DETAILS
// ======================================================

function jx4DrawMarketDetails(time){

  const map=jx4Map();


  // scattered market crates

  for(let i=0;i<14;i++){

    const tx=
      4+
      (
        i*11%
        Math.max(
          5,
          map.grid[0].length-8
        )
      );

    const ty=
      4+
      (
        i*7%
        Math.max(
          5,
          map.grid.length-8
        )
      );


    const x=
      tx*TILE-camera.x;

    const y=
      ty*TILE-camera.y;


    if(!jx4Visible(x,y)){
      continue;
    }


    if(
      map.grid[ty] &&
      (
        map.grid[ty][tx]===T.ROAD ||
        map.grid[ty][tx]===T.PLAZA
      )
    ){

      jx4Rect(
        x+6,
        y+15,
        18,
        12,
        "#665244"
      );

      jx4Line(
        x+7,
        y+20,
        x+23,
        y+20,
        "#3e342e"
      );

    }

  }

}


// ======================================================
// STATION DETAILS
// ======================================================

function jx4DrawStationDetails(time){

  const map=jx4Map();


  // platform / station-area sign

  const signX=
    6*TILE-camera.x;

  const signY=
    6*TILE-camera.y;


  if(
    signX>-200 &&
    signX<canvas.width+200 &&
    signY>-100 &&
    signY<canvas.height+100
  ){

    jx4Rect(
      signX,
      signY,
      118,
      31,
      "#455054"
    );

    jx4Rect(
      signX+4,
      signY+4,
      110,
      23,
      "#d7dfdc"
    );

    ctx.fillStyle="#31383a";
    ctx.font="bold 13px sans-serif";
    ctx.textAlign="center";
    ctx.textBaseline="middle";

    ctx.fillText(
      "鸡西站前",
      signX+59,
      signY+15
    );

  }


  // coal-city industrial silhouettes
  // distant only, no collision

  const baseY=
    2*TILE-camera.y;

  for(let i=0;i<4;i++){

    const x=
      (
        10+i*15
      )*TILE-camera.x;


    if(
      x<-100 ||
      x>canvas.width+100
    ){
      continue;
    }


    jx4Rect(
      x,
      baseY,
      22,
      48+i*6,
      "rgba(67,76,78,.24)"
    );


    jx4Rect(
      x+7,
      baseY-22,
      7,
      24,
      "rgba(67,76,78,.24)"
    );

  }

}


// ======================================================
// FROZEN LAKE DETAILS
// ======================================================

function jx4DrawFrozenLakeDetails(time){

  const map=jx4Map();


  // ice fishing holes / markers
  // only on water tiles

  for(let i=0;i<11;i++){

    const tx=
      3+
      (
        i*7%
        Math.max(
          4,
          map.grid[0].length-6
        )
      );

    const ty=
      4+
      (
        i*11%
        Math.max(
          4,
          map.grid.length-8
        )
      );


    if(
      !map.grid[ty] ||
      map.grid[ty][tx]!==T.WATER
    ){
      continue;
    }


    const x=
      tx*TILE-camera.x+16;

    const y=
      ty*TILE-camera.y+16;


    if(
      x<-50 ||
      x>canvas.width+50 ||
      y<-50 ||
      y>canvas.height+50
    ){
      continue;
    }


    ctx.fillStyle=
      "rgba(64,108,124,.40)";

    ctx.beginPath();

    ctx.ellipse(
      x,y,
      8,4,
      0,
      0,
      Math.PI*2
    );

    ctx.fill();


    ctx.strokeStyle=
      "rgba(235,245,246,.40)";

    ctx.stroke();

  }


  // reed clusters near shore

  for(let i=0;i<20;i++){

    const worldX=
      17*TILE+
      (i%5)*19;

    const worldY=
      3*TILE+
      Math.floor(i/5)*95;


    const x=
      worldX-camera.x;

    const y=
      worldY-camera.y;


    if(
      x<-40 ||
      x>canvas.width+40 ||
      y<-40 ||
      y>canvas.height+40
    ){
      continue;
    }


    const sway=
      Math.sin(
        time*1.2+i
      )*1.5;


    jx4Line(
      x,
      y+22,
      x+sway,
      y,
      "rgba(108,92,64,.65)"
    );

    jx4Line(
      x+5,
      y+22,
      x+7+sway,
      y+5,
      "rgba(108,92,64,.52)"
    );

  }

}


// ======================================================
// ATMOSPHERE
// ======================================================

function jx4DrawAtmosphere(time){

  // cold haze

  const g=
    ctx.createLinearGradient(
      0,0,
      0,canvas.height
    );

  g.addColorStop(
    0,
    "rgba(209,225,230,.065)"
  );

  g.addColorStop(
    .5,
    "rgba(191,211,216,.025)"
  );

  g.addColorStop(
    1,
    "rgba(238,242,238,.018)"
  );

  ctx.fillStyle=g;

  ctx.fillRect(
    0,0,
    canvas.width,
    canvas.height
  );

}


// ======================================================
// SNOW
// ======================================================

function jx4DrawSnow(time){

  const amount=
    currentMapId==="lake"
      ? 115
      : currentMapId==="market"
      ? 95
      : 80;


  ctx.save();


  for(let i=0;i<amount;i++){

    const seed1=
      jx4Hash(
        i,
        17,
        71
      );

    const seed2=
      jx4Hash(
        i,
        41,
        82
      );

    const speed=
      18+
      seed1*31;

    const drift=
      Math.sin(
        time*.8+
        i*.73
      )*
      (
        8+
        seed2*15
      );


    const x=
      (
        seed1*
        (canvas.width+100)+
        drift+
        time*
        (4+seed2*5)
      )%
      (canvas.width+100)-50;


    const y=
      (
        seed2*
        (canvas.height+80)+
        time*speed
      )%
      (canvas.height+80)-40;


    const size=
      seed1>.84
        ? 3
        : seed1>.45
        ? 2
        : 1;


    ctx.fillStyle=
      size===3
        ? "rgba(255,255,252,.78)"
        : size===2
        ? "rgba(249,252,250,.65)"
        : "rgba(244,248,247,.52)";


    ctx.fillRect(
      Math.floor(x),
      Math.floor(y),
      size,
      size
    );

  }


  ctx.restore();

}


// ======================================================
// DAYLIGHT
// ======================================================

function jx4Daylight(){

  ctx.save();

  ctx.globalCompositeOperation=
    "screen";


  if(currentMapId==="lake"){

    ctx.fillStyle=
      "rgba(177,210,221,.075)";

  }

  else if(currentMapId==="market"){

    ctx.fillStyle=
      "rgba(213,222,216,.060)";

  }

  else{

    ctx.fillStyle=
      "rgba(199,216,219,.055)";

  }


  ctx.fillRect(
    0,0,
    canvas.width,
    canvas.height
  );


  ctx.restore();

}


// ======================================================
// UI
// ======================================================

function jx4UpdateUI(){

  try{

    document.title=
      "鸡西探索录 - 黑龙江的冬";


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

  catch(error){

    console.warn(
      "Jixi UI update skipped:",
      error
    );

  }

}


jx4UpdateUI();


console.log(
  "鸡西探索录 Jixi Visual System Ver.4 loaded"
);
