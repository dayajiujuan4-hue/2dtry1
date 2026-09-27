"use strict";

/*
============================================================
 鸡西探索录
 JIXI WORLD CONVERSION

 武林夜市版のゲームシステムをそのまま使用し、
 舞台設定だけを黒竜江省・鶏西市へ変更する。

 IMPORTANT:
 map.js の後
 game.js の前
 に読み込むこと。

 内部MAP ID
 food / market / hotel / lake
 は既存システムとの互換性維持のため変更しない。
============================================================
*/


// ============================================================
// WORLD INFORMATION
// ============================================================

const JIXI_WORLD = {

  title: "鸡西探索录",

  province: "黑龙江省",

  city: "鸡西市",

  season: "冬",

  weather: "小雪",

  time: "13:42",

  temperature: "-12°C"

};


// ============================================================
// HELPERS
// ============================================================

function jixiBuilding(
  building,
  name,
  color
){

  if(!building){
    return;
  }

  building.name = name;

  if(color){
    building.color = color;
  }

}


function jixiStall(
  stall,
  sign,
  type
){

  if(!stall){
    return;
  }

  stall.sign = sign;

  if(type){
    stall.type = type;
  }

}


// ============================================================
// MAP 1
// 鸡西・中心街
// ============================================================

(function(){

  const map = MAPS.food;

  if(!map){
    return;
  }


  map.name =
    "鸡西・中心街";


  map.subtitle =
    "冬日 · 小雪 · 东北小吃 · 城市生活";


  map.ambient =
    "winterDay";


  // ----------------------------------------------------------
  // BUILDINGS
  // ----------------------------------------------------------

  jixiBuilding(
    map.buildings[0],
    "老东北饭馆",
    "#65717a"
  );


  jixiBuilding(
    map.buildings[1],
    "鸡西大冷面",
    "#7a6259"
  );


  jixiBuilding(
    map.buildings[2],
    "北方便利店",
    "#58727b"
  );


  jixiBuilding(
    map.buildings[3],
    "东北家常菜",
    "#725c55"
  );


  jixiBuilding(
    map.buildings[4],
    "冬日杂货铺",
    "#66615d"
  );


  jixiBuilding(
    map.buildings[5],
    "鸡西特产",
    "#66717d"
  );


  // ----------------------------------------------------------
  // STALLS
  // ----------------------------------------------------------

  const stalls =
    map.stalls || [];


  const stallData = [

    ["烤冷面","food"],

    ["锅包肉","food"],

    ["烤地瓜","food"],

    ["煎饼果子","food"],

    ["炸串","shaokao"],

    ["东北小吃","food"],

    ["烤鱿鱼","shaokao"],

    ["鸡架","food"],

    ["冻梨","fruit"],

    ["糖葫芦","fruit"],

    ["烤串","shaokao"],

    ["热豆浆","drink"],

    ["奶茶","drink"],

    ["烤肠","food"]

  ];


  for(
    let i=0;
    i<stalls.length &&
    i<stallData.length;
    i++
  ){

    jixiStall(
      stalls[i],
      stallData[i][0],
      stallData[i][1]
    );

  }


  // ----------------------------------------------------------
  // EXIT
  // ----------------------------------------------------------

  if(map.exits?.[0]){

    map.exits[0].label =
      "↓ 东北市场";

  }


})();


// ============================================================
// MAP 2
// 东北市场・生活街
// ============================================================

(function(){

  const map =
    MAPS.market;


  if(!map){
    return;
  }


  map.name =
    "东北市场・生活街";


  map.subtitle =
    "市场 · 冬装 · 冻货 · 市井生活";


  map.ambient =
    "winterMarket";


  // ----------------------------------------------------------
  // BUILDINGS
  // ----------------------------------------------------------

  jixiBuilding(
    map.buildings[0],
    "鸡西百货",
    "#66707a"
  );


  jixiBuilding(
    map.buildings[1],
    "黑龙江特产",
    "#6f6a72"
  );


  jixiBuilding(
    map.buildings[2],
    "冬装商店",
    "#73646e"
  );


  jixiBuilding(
    map.buildings[3],
    "热饮店",
    "#59716f"
  );


  // ----------------------------------------------------------
  // STALLS
  // ----------------------------------------------------------

  const stalls =
    map.stalls || [];


  const stallData = [

    ["冻梨","fruit"],

    ["冻柿子","fruit"],

    ["山货","food"],

    ["干货","food"],

    ["棉帽","goods"],

    ["手套","goods"],

    ["糖葫芦","fruit"],

    ["热饮","drink"]

  ];


  for(
    let i=0;
    i<stalls.length &&
    i<stallData.length;
    i++
  ){

    jixiStall(
      stalls[i],
      stallData[i][0],
      stallData[i][1]
    );

  }


  // ----------------------------------------------------------
  // EXITS
  // ----------------------------------------------------------

  if(map.exits?.[0]){

    map.exits[0].label =
      "↑ 鸡西中心街";

  }


  if(map.exits?.[1]){

    map.exits[1].label =
      "↓ 鸡西站方向";

  }


})();


// ============================================================
// MAP 3
// 鸡西站・站前街
// ============================================================

(function(){

  const map =
    MAPS.hotel;


  if(!map){
    return;
  }


  map.name =
    "鸡西站・站前街";


  map.subtitle =
    "车站 · 出租车 · 旅馆 · 冬日街景";


  map.ambient =
    "winterStation";


  // ----------------------------------------------------------
  // BUILDINGS
  // ----------------------------------------------------------

  jixiBuilding(
    map.buildings[0],
    "鸡西宾馆",
    "#626d78"
  );


  jixiBuilding(
    map.buildings[1],
    "站前旅馆",
    "#6d6874"
  );


  jixiBuilding(
    map.buildings[2],
    "站前便利店",
    "#5a737a"
  );


  // ----------------------------------------------------------
  // STALLS
  // ----------------------------------------------------------

  const stalls =
    map.stalls || [];


  if(stalls[0]){

    jixiStall(
      stalls[0],
      "热汤",
      "food"
    );

  }


  if(stalls[1]){

    jixiStall(
      stalls[1],
      "热咖啡",
      "drink"
    );

  }


  // ----------------------------------------------------------
  // EXITS
  // ----------------------------------------------------------

  if(map.exits?.[0]){

    map.exits[0].label =
      "↑ 东北市场";

  }


  if(map.exits?.[1]){

    map.exits[1].label =
      "↓ 前往兴凯湖";

  }


})();


// ============================================================
// MAP 4
// 兴凯湖・冬景
// ============================================================

(function(){

  const map =
    MAPS.lake;


  if(!map){
    return;
  }


  map.name =
    "兴凯湖・冬景";


  map.subtitle =
    "冰雪 · 湖岸 · 寒风 · 黑龙江的冬天";


  map.ambient =
    "winterLake";


  // ----------------------------------------------------------
  // BUILDINGS
  // ----------------------------------------------------------

  jixiBuilding(
    map.buildings[0],
    "湖畔暖屋",
    "#66706f"
  );


  jixiBuilding(
    map.buildings[1],
    "兴凯湖特产",
    "#65727c"
  );


  // ----------------------------------------------------------
  // STALLS
  // ----------------------------------------------------------

  const stalls =
    map.stalls || [];


  if(stalls[0]){

    jixiStall(
      stalls[0],
      "糖葫芦",
      "fruit"
    );

  }


  if(stalls[1]){

    jixiStall(
      stalls[1],
      "纪念品",
      "goods"
    );

  }


  // ----------------------------------------------------------
  // EXIT
  // ----------------------------------------------------------

  if(map.exits?.[0]){

    map.exits[0].label =
      "↑ 返回鸡西市区";

  }


})();


// ============================================================
// INTERIOR HELPER
// ============================================================

function jixiInterior(
  id,
  name,
  subtitle,
  theme
){

  const map =
    MAPS[id];


  if(!map){
    return;
  }


  map.name =
    name;


  map.subtitle =
    subtitle;


  if(theme){

    map.theme =
      theme;

  }

}


// ============================================================
// CENTER AREA INTERIORS
// ============================================================

jixiInterior(

  "tea",

  "老东北饭馆",

  "暖气与饭菜香气包围着小小的饭馆",

  "northeastRestaurant"

);


jixiInterior(

  "noodle",

  "鸡西大冷面",

  "冷面、辣菜与热气腾腾的后厨",

  "coldNoodle"

);


jixiInterior(

  "convenience",

  "北方便利店",

  "门外是冰雪，店内却十分温暖",

  "winterStore"

);


jixiInterior(

  "restaurant",

  "东北家常菜",

  "锅里冒着热气，食客们围桌而坐",

  "northeastRestaurant"

);


// ============================================================
// MARKET INTERIORS
// ============================================================

jixiInterior(

  "department",

  "鸡西百货",

  "冬装、日用品和生活用品整齐陈列",

  "winterDepartment"

);


jixiInterior(

  "culture",

  "黑龙江特产",

  "来自黑土地的土特产摆满货架",

  "heilongjiangGoods"

);


jixiInterior(

  "accessory",

  "冬装商店",

  "棉帽、围巾与厚手套挂满墙面",

  "winterClothes"

);


jixiInterior(

  "drink",

  "热饮店",

  "玻璃窗上蒙着一层薄薄的水汽",

  "hotDrink"

);


// ============================================================
// STATION INTERIORS
// ============================================================

jixiInterior(

  "wulinHotel",

  "鸡西宾馆",

  "旅客拖着行李从雪地走进温暖大厅",

  "winterHotel"

);


jixiInterior(

  "hangzhouHotel",

  "站前旅馆",

  "窗外可以看到白雪覆盖的街道",

  "winterHotel"

);


jixiInterior(

  "cityStore",

  "站前便利店",

  "旅客在这里购买热饮和日用品",

  "winterStore"

);


// ============================================================
// LAKE INTERIORS
// ============================================================

jixiInterior(

  "lakeTea",

  "湖畔暖屋",

  "透过结霜的窗户可以看到兴凯湖",

  "winterLakeHouse"

);


jixiInterior(

  "lakeGift",

  "兴凯湖特产",

  "湖区纪念品与黑龙江特产陈列在店内",

  "xingkaiGoods"

);


// ============================================================
// REMOVE HANGZHOU LANTERN ROWS
// ============================================================

for(
  const mapId
  of [
    "food",
    "market",
    "hotel",
    "lake"
  ]
){

  const map =
    MAPS[mapId];


  if(!map){
    continue;
  }


  /*
    元の夜市の提灯列を無効化。

    配列自体は残すことで
    visuals.js / game.js 側との互換性を維持する。
  */

  map.lanternRows = [];

}


// ============================================================
// WINTER MAP SETTINGS
// ============================================================

MAPS.food.jixiWinter = {

  snow:true,

  snowStrength:0.72,

  roadSnow:0.34,

  breath:true,

  daytime:true

};


MAPS.market.jixiWinter = {

  snow:true,

  snowStrength:0.82,

  roadSnow:0.48,

  breath:true,

  daytime:true

};


MAPS.hotel.jixiWinter = {

  snow:true,

  snowStrength:0.65,

  roadSnow:0.28,

  breath:true,

  daytime:true

};


MAPS.lake.jixiWinter = {

  snow:true,

  snowStrength:1.0,

  roadSnow:0.80,

  breath:true,

  daytime:true,

  frozenLake:true

};


// ============================================================
// INTERIOR WINTER SETTINGS
// ============================================================

const JIXI_INTERIORS = [

  "tea",

  "noodle",

  "convenience",

  "restaurant",

  "department",

  "culture",

  "accessory",

  "drink",

  "wulinHotel",

  "hangzhouHotel",

  "cityStore",

  "lakeTea",

  "lakeGift"

];


for(
  const id
  of JIXI_INTERIORS
){

  if(!MAPS[id]){
    continue;
  }


  MAPS[id].jixiWinter = {

    indoor:true,

    warm:true,

    snow:false

  };

}


// ============================================================
// JIXI MAP FLAGS
// ============================================================

MAPS.food.jixiArea =
  "downtown";


MAPS.market.jixiArea =
  "market";


MAPS.hotel.jixiArea =
  "station";


MAPS.lake.jixiArea =
  "xingkai";


// ============================================================
// BODY CLASS
// ============================================================

if(
  typeof document !== "undefined" &&
  document.body
){

  document.body.classList.add(
    "jixi-version"
  );

}


// ============================================================
// PAGE TITLE
// ============================================================

if(
  typeof document !== "undefined"
){

  document.title =
    "鸡西探索录 - 黑龙江的冬";

}


// ============================================================
// READY
// ============================================================

console.log(
  "鸡西探索录 - World Conversion loaded"
);
