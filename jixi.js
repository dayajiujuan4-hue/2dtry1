"use strict";

/*
============================================================
 鸡西探索录
 JIXI WORLD CONVERSION Ver.2

 STEP 1
 鸡冠区・中心大街 本格置換版

 map.js のデータ構造を利用しながら、
 鶏西の街として再構成する。

 読み込み順：

 map.js
 ↓
 jixi.js
 ↓
 vocabulary.js
 dialogue.js
 game.js
 visuals.js
 motion.js
 jixi-visuals.js
============================================================
*/


// ============================================================
// WORLD
// ============================================================

const JIXI_WORLD = {

  title:"鸡西探索录",

  province:"黑龙江省",

  city:"鸡西市",

  district:"鸡冠区",

  season:"冬",

  weather:"小雪",

  time:"13:42",

  temperature:"-12°C"

};


// ============================================================
// HELPERS
// ============================================================

function jxBuilding(
  x,
  y,
  w,
  h,
  name,
  color,
  doorX,
  target=null,
  style="urban"
){

  return {

    x,
    y,
    w,
    h,

    name,

    color,

    doorX,

    target,

    jixiStyle:style

  };

}


function jxStall(
  x,
  y,
  width,
  sign,
  type="food"
){

  return {

    x,
    y,
    width,

    sign,

    type,

    jixi:true

  };

}


function jxProp(
  type,
  x,
  y,
  extra={}
){

  return {

    type,
    x,
    y,

    ...extra

  };

}


// ============================================================
// MAP 1
//
// 鸡冠区・中心大街
// ============================================================

(function(){

  const map =
    MAPS.food;


  if(!map){
    return;
  }


  // ----------------------------------------------------------
  // BASIC INFORMATION
  // ----------------------------------------------------------

  map.name =
    "鸡冠区・中心大街";


  map.subtitle =
    "中心城区 · 商业街 · 冬日生活";


  map.ambient =
    "jixiDowntown";


  map.jixiArea =
    "downtown";


  map.jixiWinter = {

    snow:true,

    snowStrength:.72,

    roadSnow:.30,

    breath:true,

    daytime:true

  };


  // ==========================================================
  // BUILDINGS
  //
  // 旧杭州建築をすべて撤去
  // ==========================================================

  map.buildings = [

    // --------------------------------------------------------
    // NORTH WEST
    // --------------------------------------------------------

    jxBuilding(

      1,
      1,

      11,
      8,

      "北方生活超市",

      "#68757d",

      7,

      "convenience",

      "supermarket"

    ),


    // --------------------------------------------------------
    // NORTH EAST
    // --------------------------------------------------------

    jxBuilding(

      40,
      1,

      11,
      8,

      "鸡西大冷面",

      "#79665c",

      45,

      "noodle",

      "coldNoodle"

    ),


    // --------------------------------------------------------
    // MID WEST
    // --------------------------------------------------------

    jxBuilding(

      1,
      15,

      11,
      9,

      "东北家常菜",

      "#71605a",

      7,

      "restaurant",

      "restaurant"

    ),


    // --------------------------------------------------------
    // MID EAST
    // --------------------------------------------------------

    jxBuilding(

      40,
      15,

      11,
      9,

      "冬日便利店",

      "#58727a",

      45,

      "tea",

      "convenience"

    ),


    // --------------------------------------------------------
    // SOUTH WEST
    //
    // 生活感を出す低層商業建築
    // --------------------------------------------------------

    jxBuilding(

      1,
      31,

      10,
      6,

      "百姓药房",

      "#63736c",

      6,

      null,

      "pharmacy"

    ),


    // --------------------------------------------------------
    // SOUTH EAST
    // --------------------------------------------------------

    jxBuilding(

      41,
      31,

      10,
      6,

      "手机维修",

      "#626b79",

      46,

      null,

      "phoneShop"

    )

  ];



  // ==========================================================
  // STALLS
  //
  // 中心大街なので夜市ほど大量には置かない。
  // ==========================================================

  map.stalls = [

    jxStall(
      15,
      7,
      3,
      "烤冷面",
      "food"
    ),


    jxStall(
      34,
      7,
      3,
      "烤地瓜",
      "food"
    ),


    jxStall(
      15,
      22,
      3,
      "糖葫芦",
      "fruit"
    ),


    jxStall(
      34,
      22,
      3,
      "热豆浆",
      "drink"
    ),


    jxStall(
      15,
      32,
      3,
      "热饮",
      "drink"
    ),


    jxStall(
      34,
      32,
      3,
      "烤串",
      "shaokao"
    )

  ];



  // ==========================================================
  // PROPS
  //
  // 杭州の植木・提灯中心から
  // 冬の都市生活へ変更
  // ==========================================================

  map.props = [

    // --------------------------------------------------------
    // BUS STOP
    // --------------------------------------------------------

    jxProp(
      "busStop",
      20,
      5,
      {
        text:"中心大街"
      }
    ),


    jxProp(
      "busStop",
      31,
      27,
      {
        text:"中心大街"
      }
    ),


    // --------------------------------------------------------
    // PARKED CARS
    // --------------------------------------------------------

    jxProp(
      "car",
      23,
      5,
      {
        direction:"down"
      }
    ),


    jxProp(
      "taxi",
      28,
      12,
      {
        direction:"up"
      }
    ),


    jxProp(
      "car",
      24,
      26,
      {
        direction:"down"
      }
    ),


    jxProp(
      "car",
      30,
      33,
      {
        direction:"up"
      }
    ),


    // --------------------------------------------------------
    // BICYCLES / SCOOTERS
    // --------------------------------------------------------

    jxProp(
      "bike",
      12,
      12
    ),


    jxProp(
      "scooter",
      39,
      12
    ),


    jxProp(
      "scooter",
      12,
      28
    ),


    // --------------------------------------------------------
    // STREET FURNITURE
    // --------------------------------------------------------

    jxProp(
      "streetlight",
      19,
      9
    ),


    jxProp(
      "streetlight",
      33,
      9
    ),


    jxProp(
      "streetlight",
      19,
      24
    ),


    jxProp(
      "streetlight",
      33,
      24
    ),


    jxProp(
      "streetlight",
      19,
      34
    ),


    jxProp(
      "streetlight",
      33,
      34
    ),


    // --------------------------------------------------------
    // SNOW / CITY DETAILS
    // --------------------------------------------------------

    jxProp(
      "trash",
      13,
      18
    ),


    jxProp(
      "deliveryBox",
      38,
      18
    ),


    jxProp(
      "priceBoard",
      13,
      7
    ),


    jxProp(
      "crate",
      38,
      22
    ),


    jxProp(
      "manhole",
      25,
      18
    ),


    jxProp(
      "manhole",
      29,
      29
    )

  ];



  // ==========================================================
  // LANTERNS
  // ==========================================================

  /*
  杭州夜市の横断提灯は完全撤去。
  */

  map.lanternRows = [];



  // ==========================================================
  // EXIT
  // ==========================================================

  if(
    map.exits &&
    map.exits[0]
  ){

    map.exits[0].label =
      "↓ 园林路・南山早市";

  }


})();



// ============================================================
// MAP 2
//
// 次の本格改修までは現在構造を維持
// ============================================================

(function(){

  const map =
    MAPS.market;


  if(!map){
    return;
  }


  map.name =
    "园林路・南山早市";


  map.subtitle =
    "早市 · 冷面 · 辣菜 · 市井生活";


  map.ambient =
    "winterMarket";


  map.jixiArea =
    "market";


  map.jixiWinter = {

    snow:true,

    snowStrength:.82,

    roadSnow:.48,

    breath:true,

    daytime:true

  };


  if(
    map.exits?.[0]
  ){

    map.exits[0].label =
      "↑ 鸡冠区・中心大街";

  }


  if(
    map.exits?.[1]
  ){

    map.exits[1].label =
      "↓ 鸡西站";

  }


  map.lanternRows = [];

})();



// ============================================================
// MAP 3
// ============================================================

(function(){

  const map =
    MAPS.hotel;


  if(!map){
    return;
  }


  map.name =
    "鸡西站・煤城街区";


  map.subtitle =
    "火车站 · 煤城记忆 · 城市生活";


  map.ambient =
    "winterStation";


  map.jixiArea =
    "station";


  map.jixiWinter = {

    snow:true,

    snowStrength:.65,

    roadSnow:.28,

    breath:true,

    daytime:true

  };


  if(
    map.exits?.[0]
  ){

    map.exits[0].label =
      "↑ 园林路";

  }


  if(
    map.exits?.[1]
  ){

    map.exits[1].label =
      "↓ 前往兴凯湖";

  }


  map.lanternRows = [];

})();



// ============================================================
// MAP 4
// ============================================================

(function(){

  const map =
    MAPS.lake;


  if(!map){
    return;
  }


  map.name =
    "兴凯湖・冰雪湖岸";


  map.subtitle =
    "冰湖 · 雪原 · 寒风 · 北国风景";


  map.ambient =
    "winterLake";


  map.jixiArea =
    "xingkai";


  map.jixiWinter = {

    snow:true,

    snowStrength:1,

    roadSnow:.8,

    breath:true,

    daytime:true,

    frozenLake:true

  };


  if(
    map.exits?.[0]
  ){

    map.exits[0].label =
      "↑ 返回鸡西市区";

  }


  map.lanternRows = [];

})();



// ============================================================
// INTERIORS
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


  map.theme =
    theme;


  map.jixiWinter = {

    indoor:true,

    warm:true,

    snow:false

  };

}


// ------------------------------------------------------------
// DOWNTOWN
// ------------------------------------------------------------

jixiInterior(

  "convenience",

  "北方生活超市",

  "外面飘着雪，店里暖气很足",

  "winterStore"

);


jixiInterior(

  "noodle",

  "鸡西大冷面",

  "冷面与辣菜是这里最熟悉的味道",

  "coldNoodle"

);


jixiInterior(

  "restaurant",

  "东北家常菜",

  "锅里冒着热气，客人围桌吃饭",

  "northeastRestaurant"

);


jixiInterior(

  "tea",

  "冬日便利店",

  "推门进来，眼镜一下蒙上了白雾",

  "winterStore"

);


// ------------------------------------------------------------
// MARKET
// ------------------------------------------------------------

jixiInterior(

  "department",

  "鸡西百货",

  "冬装和生活用品摆满货架",

  "winterDepartment"

);


jixiInterior(

  "culture",

  "黑龙江特产",

  "山货与地方特产摆在店里",

  "heilongjiangGoods"

);


jixiInterior(

  "accessory",

  "冬装商店",

  "棉帽、围巾和手套挂满墙面",

  "winterClothes"

);


jixiInterior(

  "drink",

  "热饮店",

  "窗户上凝结着一层白雾",

  "hotDrink"

);


// ------------------------------------------------------------
// STATION
// ------------------------------------------------------------

jixiInterior(

  "wulinHotel",

  "鸡西宾馆",

  "旅客拖着行李走进温暖大厅",

  "winterHotel"

);


jixiInterior(

  "hangzhouHotel",

  "站前旅馆",

  "窗外是积雪覆盖的站前街",

  "winterHotel"

);


jixiInterior(

  "cityStore",

  "站前便利店",

  "旅客在这里购买热饮和日用品",

  "winterStore"

);


// ------------------------------------------------------------
// XINGKAI LAKE
// ------------------------------------------------------------

jixiInterior(

  "lakeTea",

  "湖畔暖屋",

  "结霜的窗外是一望无际的冰湖",

  "winterLakeHouse"

);


jixiInterior(

  "lakeGift",

  "兴凯湖特产",

  "湖区特产与纪念品陈列在店内",

  "xingkaiGoods"

);



// ============================================================
// PAGE
// ============================================================

if(
  typeof document!=="undefined"
){

  document.title =
    "鸡西探索录 - 黑龙江的冬";


  if(
    document.body
  ){

    document.body.classList.add(
      "jixi-version"
    );

  }

}



// ============================================================
// READY
// ============================================================

console.log(
  "鸡西探索录 World Conversion Ver.2 loaded"
);
