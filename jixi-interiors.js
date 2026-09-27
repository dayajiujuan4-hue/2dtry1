"use strict";

/*
============================================================
 鸡西探索录
 JIXI INTERIORS Ver.1

 新しく作った建物を実際に探索できるようにする。

 ・中心大街
 ・南山早市
 ・鸡西站前
 ・兴凯湖

 既存の MAPS / changeMap / collision system を利用。
============================================================
*/


// ============================================================
// HELPERS
// ============================================================

function jxiGrid(
  w=28,
  h=20,
  type="shop"
){

  const grid=
    Array.from(
      {length:h},
      ()=>Array(w).fill(T.INDOOR)
    );


  // outer walls
  for(let x=0;x<w;x++){

    grid[0][x]=T.WALL;
    grid[h-1][x]=T.WALL;

  }


  for(let y=0;y<h;y++){

    grid[y][0]=T.WALL;
    grid[y][w-1]=T.WALL;

  }


  // entrance
  grid[h-1][13]=T.INDOOR;
  grid[h-1][14]=T.INDOOR;


  // counter
  if(type==="shop"){

    for(let x=5;x<=22;x++){

      grid[6][x]=T.COUNTER;

    }

  }


  if(type==="restaurant"){

    for(let x=3;x<=10;x++){
      grid[5][x]=T.COUNTER;
    }

  }


  if(type==="hotel"){

    for(let x=7;x<=20;x++){
      grid[5][x]=T.COUNTER;
    }

  }


  return grid;

}



function jxiCreateInterior({

  id,

  name,

  subtitle,

  theme="winterStore",

  type="shop",

  returnMap,

  returnX,

  returnY,

  props=[],

  interactables=[]

}){


  MAPS[id]={

    name,

    subtitle,

    ambient:"indoor",

    interiorType:type,

    theme,

    jixiInterior:true,


    jixiWinter:{

      indoor:true,

      warm:true,

      snow:false

    },


    grid:
      jxiGrid(
        28,
        20,
        type
      ),


    spawn:{

      x:14,
      y:16

    },


    buildings:[],

    stalls:[],

    lanternRows:[],

    props,

    interactables,


    exits:[

      {

        x:12,
        y:18,

        width:4,
        height:1,

        label:"外へ出る",

        target:returnMap,

        targetX:returnX,
        targetY:returnY

      }

    ]

  };

}



function jxiSetBuildingTarget(
  mapId,
  buildingName,
  target
){

  const map=
    MAPS[mapId];

  if(
    !map ||
    !map.buildings
  ){
    return;
  }


  const building=
    map.buildings.find(
      b=>b.name===buildingName
    );


  if(building){

    building.target=
      target;

  }

}



// ============================================================
// ============================================================
//
// CENTER STREET
//
// 鸡冠区・中心大街
//
// ============================================================
// ============================================================


// ------------------------------------------------------------
// 彩票站
// ------------------------------------------------------------

jxiCreateInterior({

  id:"jixiLottery",

  name:"彩票站",

  subtitle:
    "小さな店内に数字表とポスターが並んでいる",

  theme:"lottery",

  type:"shop",

  returnMap:"food",

  returnX:21,
  returnY:9,


  props:[

    {
      type:"menuBoard",
      x:5,
      y:3
    },

    {
      type:"counterItem",
      x:9,
      y:6
    },

    {
      type:"chair",
      x:19,
      y:11
    },

    {
      type:"chair",
      x:21,
      y:11
    }

  ],


  interactables:[

    {
      x:5,
      y:4,
      label:"掲示を見る",
      word:"zhaopai"
    },

    {
      x:9,
      y:7,
      label:"カウンターを見る",
      word:"fuwuyuan"
    }

  ]

});


jxiSetBuildingTarget(
  "food",
  "彩票站",
  "jixiLottery"
);



// ------------------------------------------------------------
// 烟酒食杂店
// ------------------------------------------------------------

jxiCreateInterior({

  id:"jixiGrocery",

  name:"烟酒食杂店",

  subtitle:
    "近所の人が立ち寄る小さな食料雑貨店",

  theme:"grocery",

  type:"shop",

  returnMap:"food",

  returnX:5,
  returnY:32,


  props:[

    {
      type:"shelf",
      x:4,
      y:9
    },

    {
      type:"shelf",
      x:8,
      y:9
    },

    {
      type:"shelf",
      x:20,
      y:9
    },

    {
      type:"crate",
      x:22,
      y:14
    }

  ],


  interactables:[

    {
      x:4,
      y:9,
      label:"商品棚を見る",
      word:"shangpin"
    },

    {
      x:22,
      y:14,
      label:"商品箱を見る",
      word:"xiangzi"
    }

  ]

});


jxiSetBuildingTarget(
  "food",
  "烟酒食杂店",
  "jixiGrocery"
);



// ------------------------------------------------------------
// 百姓药房
// ------------------------------------------------------------

jxiCreateInterior({

  id:"jixiPharmacy",

  name:"百姓药房",

  subtitle:
    "白い棚が並ぶ街角の薬局",

  theme:"pharmacy",

  type:"shop",

  returnMap:"food",

  returnX:54,
  returnY:25,


  props:[

    {
      type:"shelf",
      x:4,
      y:9
    },

    {
      type:"shelf",
      x:8,
      y:9
    },

    {
      type:"shelf",
      x:20,
      y:9
    },

    {
      type:"shelf",
      x:24,
      y:9
    }

  ],


  interactables:[

    {
      x:5,
      y:9,
      label:"薬棚を見る",
      word:"shangpin"
    },

    {
      x:14,
      y:6,
      label:"薬局のカウンターを見る",
      word:"fuwuyuan"
    }

  ]

});


jxiSetBuildingTarget(
  "food",
  "百姓药房",
  "jixiPharmacy"
);



// ------------------------------------------------------------
// 粮油商店
// ------------------------------------------------------------

jxiCreateInterior({

  id:"jixiGrainShop",

  name:"粮油商店",

  subtitle:
    "米や食用油、調味料が積まれた生活店",

  theme:"grocery",

  type:"shop",

  returnMap:"food",

  returnX:7,
  returnY:37,


  props:[

    {
      type:"crate",
      x:4,
      y:10
    },

    {
      type:"crate",
      x:7,
      y:10
    },

    {
      type:"shelf",
      x:21,
      y:9
    },

    {
      type:"shelf",
      x:24,
      y:9
    }

  ],


  interactables:[

    {
      x:5,
      y:10,
      label:"商品を見る",
      word:"shangpin"
    }

  ]

});


jxiSetBuildingTarget(
  "food",
  "粮油商店",
  "jixiGrainShop"
);



// ------------------------------------------------------------
// 手机维修
// ------------------------------------------------------------

jxiCreateInterior({

  id:"jixiPhoneRepair",

  name:"手机维修",

  subtitle:
    "スマートフォンやケースが並ぶ修理店",

  theme:"phoneShop",

  type:"shop",

  returnMap:"food",

  returnX:19,
  returnY:36,


  props:[

    {
      type:"displayShelf",
      x:4,
      y:9
    },

    {
      type:"displayShelf",
      x:8,
      y:9
    },

    {
      type:"counterItem",
      x:14,
      y:6
    },

    {
      type:"chair",
      x:20,
      y:12
    }

  ],


  interactables:[

    {
      x:5,
      y:9,
      label:"スマホケースを見る",
      word:"shangpin"
    },

    {
      x:14,
      y:7,
      label:"修理カウンターを見る",
      word:"fuwuyuan"
    }

  ]

});


jxiSetBuildingTarget(
  "food",
  "手机维修",
  "jixiPhoneRepair"
);



// ------------------------------------------------------------
// 鸡冠百货
// ------------------------------------------------------------

jxiCreateInterior({

  id:"jixiDepartment",

  name:"鸡冠百货",

  subtitle:
    "冬物衣料や生活用品が並ぶ売り場",

  theme:"department",

  type:"shop",

  returnMap:"food",

  returnX:48,
  returnY:33,


  props:[

    {
      type:"displayShelf",
      x:4,
      y:10
    },

    {
      type:"displayShelf",
      x:8,
      y:10
    },

    {
      type:"displayShelf",
      x:20,
      y:10
    },

    {
      type:"displayShelf",
      x:24,
      y:10
    },

    {
      type:"plant",
      x:3,
      y:3
    }

  ],


  interactables:[

    {
      x:5,
      y:10,
      label:"冬物商品を見る",
      word:"shangpin"
    },

    {
      x:14,
      y:6,
      label:"売り場を見る",
      word:"fuwuyuan"
    }

  ]

});


jxiSetBuildingTarget(
  "food",
  "鸡冠百货",
  "jixiDepartment"
);



// ============================================================
// ============================================================
//
// NANSHAN MORNING MARKET
//
// 园林路・南山早市
//
// ============================================================
// ============================================================


// ------------------------------------------------------------
// 冬装棉服
// ------------------------------------------------------------

jxiCreateInterior({

  id:"jixiWinterClothes",

  name:"冬装棉服",

  subtitle:
    "厚手のコートや防寒着が並んでいる",

  theme:"clothes",

  type:"shop",

  returnMap:"market",

  returnX:53,
  returnY:25,


  props:[

    {
      type:"displayShelf",
      x:4,
      y:9
    },

    {
      type:"displayShelf",
      x:8,
      y:9
    },

    {
      type:"displayShelf",
      x:20,
      y:9
    },

    {
      type:"mirror",
      x:24,
      y:4
    }

  ],


  interactables:[

    {
      x:5,
      y:9,
      label:"防寒着を見る",
      word:"shangpin"
    }

  ]

});


jxiSetBuildingTarget(
  "market",
  "冬装棉服",
  "jixiWinterClothes"
);



// ------------------------------------------------------------
// 鸡西土特产
// ------------------------------------------------------------

jxiCreateInterior({

  id:"jixiLocalGoods",

  name:"鸡西土特产",

  subtitle:
    "鸡西と黒竜江の品が並ぶ土産店",

  theme:"localGoods",

  type:"shop",

  returnMap:"market",

  returnX:12,
  returnY:34,


  props:[

    {
      type:"displayShelf",
      x:4,
      y:9
    },

    {
      type:"displayShelf",
      x:8,
      y:9
    },

    {
      type:"crate",
      x:20,
      y:10
    },

    {
      type:"crate",
      x:23,
      y:10
    }

  ],


  interactables:[

    {
      x:5,
      y:9,
      label:"特産品を見る",
      word:"shangpin"
    },

    {
      x:14,
      y:6,
      label:"値札を見る",
      word:"jiamubiao"
    }

  ]

});


jxiSetBuildingTarget(
  "market",
  "鸡西土特产",
  "jixiLocalGoods"
);



// ------------------------------------------------------------
// 早餐铺
// ------------------------------------------------------------

jxiCreateInterior({

  id:"jixiBreakfast",

  name:"早餐铺",

  subtitle:
    "湯気の向こうから朝食の香りがする",

  theme:"breakfast",

  type:"restaurant",

  returnMap:"market",

  returnX:29,
  returnY:39,


  props:[

    {
      type:"steamPot",
      x:5,
      y:5
    },

    {
      type:"steamPot",
      x:8,
      y:5
    },

    {
      type:"noodleTable",
      x:9,
      y:11
    },

    {
      type:"noodleTable",
      x:18,
      y:11
    },

    {
      type:"menuBoard",
      x:21,
      y:3
    }

  ],


  interactables:[

    {
      x:21,
      y:4,
      label:"朝食メニューを見る",
      word:"caidan"
    },

    {
      x:6,
      y:6,
      label:"湯気の立つ鍋を見る",
      word:"chuguo"
    }

  ]

});


jxiSetBuildingTarget(
  "market",
  "早餐铺",
  "jixiBreakfast"
);



// ------------------------------------------------------------
// 日用百货
// ------------------------------------------------------------

jxiCreateInterior({

  id:"jixiDailyGoods",

  name:"日用百货",

  subtitle:
    "市場帰りの人が生活用品を買っていく",

  theme:"dailyGoods",

  type:"shop",

  returnMap:"market",

  returnX:57,
  returnY:36,


  props:[

    {
      type:"shelf",
      x:4,
      y:9
    },

    {
      type:"shelf",
      x:8,
      y:9
    },

    {
      type:"shelf",
      x:20,
      y:9
    },

    {
      type:"shelf",
      x:24,
      y:9
    }

  ],


  interactables:[

    {
      x:5,
      y:9,
      label:"生活用品を見る",
      word:"shangpin"
    }

  ]

});


jxiSetBuildingTarget(
  "market",
  "日用百货",
  "jixiDailyGoods"
);



// ============================================================
// ============================================================
//
// JIXI STATION
//
// 鸡西站・站前街区
//
// ============================================================
// ============================================================


// ------------------------------------------------------------
// 鸡西站
// ------------------------------------------------------------

jxiCreateInterior({

  id:"jixiStation",

  name:"鸡西站・候车大厅",

  subtitle:
    "旅客が行き交う冬の駅舎",

  theme:"station",

  type:"hotel",

  returnMap:"hotel",

  returnX:34,
  returnY:9,


  props:[

    {
      type:"bench",
      x:6,
      y:10
    },

    {
      type:"bench",
      x:10,
      y:10
    },

    {
      type:"bench",
      x:18,
      y:10
    },

    {
      type:"bench",
      x:22,
      y:10
    },

    {
      type:"menuBoard",
      x:14,
      y:3
    },

    {
      type:"trash",
      x:24,
      y:14
    }

  ],


  interactables:[

    {
      x:14,
      y:4,
      label:"列車案内を見る",
      word:"zhaopai"
    },

    {
      x:8,
      y:10,
      label:"待合室を見る",
      word:"jiequ"
    }

  ]

});


jxiSetBuildingTarget(
  "hotel",
  "鸡西站",
  "jixiStation"
);



// ------------------------------------------------------------
// 早餐快餐
// ------------------------------------------------------------

jxiCreateInterior({

  id:"jixiStationFood",

  name:"早餐快餐",

  subtitle:
    "列車を待つ人が温かい食事をとっている",

  theme:"stationFood",

  type:"restaurant",

  returnMap:"hotel",

  returnX:7,
  returnY:39,


  props:[

    {
      type:"steamPot",
      x:5,
      y:5
    },

    {
      type:"noodleTable",
      x:8,
      y:11
    },

    {
      type:"noodleTable",
      x:18,
      y:11
    },

    {
      type:"menuBoard",
      x:21,
      y:3
    }

  ],


  interactables:[

    {
      x:21,
      y:4,
      label:"メニューを見る",
      word:"caidan"
    }

  ]

});


jxiSetBuildingTarget(
  "hotel",
  "早餐快餐",
  "jixiStationFood"
);



// ------------------------------------------------------------
// 行李寄存
// ------------------------------------------------------------

jxiCreateInterior({

  id:"jixiLuggage",

  name:"行李寄存",

  subtitle:
    "駅前の小さな荷物預かり所",

  theme:"luggage",

  type:"shop",

  returnMap:"hotel",

  returnX:48,
  returnY:39,


  props:[

    {
      type:"crate",
      x:5,
      y:10
    },

    {
      type:"crate",
      x:8,
      y:10
    },

    {
      type:"crate",
      x:21,
      y:10
    },

    {
      type:"counterItem",
      x:14,
      y:6
    }

  ],


  interactables:[

    {
      x:5,
      y:10,
      label:"預けられた荷物を見る",
      word:"xiangzi"
    },

    {
      x:14,
      y:7,
      label:"受付を見る",
      word:"fuwuyuan"
    }

  ]

});


jxiSetBuildingTarget(
  "hotel",
  "行李寄存",
  "jixiLuggage"
);



// ------------------------------------------------------------
// 东北特产
// ------------------------------------------------------------

jxiCreateInterior({

  id:"jixiStationGoods",

  name:"东北特产",

  subtitle:
    "旅の最後に土産を選ぶ人たちがいる",

  theme:"localGoods",

  type:"shop",

  returnMap:"hotel",

  returnX:60,
  returnY:39,


  props:[

    {
      type:"displayShelf",
      x:4,
      y:9
    },

    {
      type:"displayShelf",
      x:8,
      y:9
    },

    {
      type:"displayShelf",
      x:20,
      y:9
    },

    {
      type:"displayShelf",
      x:24,
      y:9
    }

  ],


  interactables:[

    {
      x:5,
      y:9,
      label:"東北の特産品を見る",
      word:"shangpin"
    },

    {
      x:14,
      y:6,
      label:"値札を見る",
      word:"jiamubiao"
    }

  ]

});


jxiSetBuildingTarget(
  "hotel",
  "东北特产",
  "jixiStationGoods"
);



// ============================================================
// EXISTING INTERIOR RETURN FIXES
// ============================================================

/*
 map.js の既存室内は杭州版の
 returnX / returnY を持っているため、
 鸡西の新しい建物位置へ戻す。
*/

function jxiFixExit(
  interiorId,
  mapId,
  x,
  y
){

  const map=
    MAPS[interiorId];

  if(
    !map ||
    !map.exits ||
    !map.exits[0]
  ){
    return;
  }


  map.exits[0].target=
    mapId;

  map.exits[0].targetX=
    x;

  map.exits[0].targetY=
    y;

}


// ============================================================
// DOWNTOWN EXISTING
// ============================================================

// 北方生活超市
jxiFixExit(
  "convenience",
  "food",
  10,10
);


// 鸡西大冷面
jxiFixExit(
  "noodle",
  "food",
  48,9
);


// 东北家常菜
jxiFixExit(
  "restaurant",
  "food",
  20,24
);


// 冬日便利店
jxiFixExit(
  "tea",
  "food",
  54,16
);


// ============================================================
// MARKET EXISTING
// ============================================================

// 园林副食
jxiFixExit(
  "department",
  "market",
  9,13
);


// 朝鲜族辣菜
jxiFixExit(
  "culture",
  "market",
  52,10
);


// 山货干货
jxiFixExit(
  "accessory",
  "market",
  8,28
);


// 热饮小铺
jxiFixExit(
  "drink",
  "market",
  30,26
);


// ============================================================
// STATION EXISTING
// ============================================================

// 鸡西宾馆
jxiFixExit(
  "wulinHotel",
  "hotel",
  8,25
);


// 站前旅馆
jxiFixExit(
  "hangzhouHotel",
  "hotel",
  61,25
);


// 站前便利店
jxiFixExit(
  "cityStore",
  "hotel",
  20,39
);


// ============================================================
// XINGKAI LAKE EXISTING
// ============================================================

// 湖畔暖屋
jxiFixExit(
  "lakeTea",
  "lake",
  17,12
);


// 兴凯湖特产
jxiFixExit(
  "lakeGift",
  "lake",
  47,12
);


// ============================================================
// SAFETY
// ============================================================

function jxiEnsureSafeReturn(
  mapId,
  x,
  y
){

  const map=
    MAPS[mapId];

  if(
    !map ||
    !map.grid ||
    !map.grid[y]
  ){
    return false;
  }

  const tile=
    map.grid[y][x];

  return (
    tile===T.FLOOR ||
    tile===T.ROAD ||
    tile===T.PLAZA ||
    tile===T.INDOOR
  );

}


// ============================================================
// READY
// ============================================================

console.log(
  "鸡西探索录 Jixi Interiors Ver.1 loaded"
);
