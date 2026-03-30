import { useState, useMemo, useEffect, useRef } from "react";
import DISTRICT_DATA from "./districtData";

const CRIME_TYPES = [
  "All IPC Crimes","Murder","Kidnapping & Abduction","Robbery","Theft",
  "Burglary","Riots","Crimes Against Women","Cybercrime","Economic Offences",
];

const STATES_DATA = {
  JK:{name:"Jammu & Kashmir",pop:136,grid:[0, 3],data:{"All IPC Crimes":{count:29595,rate:217.0},"Murder":{count:205,rate:1.5},"Kidnapping & Abduction":{count:477,rate:3.5},"Robbery":{count:95,rate:0.7},"Theft":{count:2959,rate:21.7},"Burglary":{count:736,rate:5.4},"Riots":{count:355,rate:2.6},"Crimes Against Women":{count:1923,rate:14.1},"Cybercrime":{count:532,rate:3.9},"Economic Offences":{count:1037,rate:7.6}}},
  LA:{name:"Ladakh",pop:4,grid:[0, 4],data:{"All IPC Crimes":{count:643,rate:175.5},"Murder":{count:3,rate:0.8},"Kidnapping & Abduction":{count:9,rate:2.5},"Robbery":{count:2,rate:0.5},"Theft":{count:64,rate:17.6},"Burglary":{count:16,rate:4.4},"Riots":{count:8,rate:2.1},"Crimes Against Women":{count:42,rate:11.4},"Cybercrime":{count:12,rate:3.2},"Economic Offences":{count:22,rate:6.1}}},
  HP:{name:"Himachal Pradesh",pop:75,grid:[1, 3],data:{"All IPC Crimes":{count:19987,rate:267.2},"Murder":{count:90,rate:1.2},"Kidnapping & Abduction":{count:441,rate:5.9},"Robbery":{count:7,rate:0.1},"Theft":{count:1997,rate:26.7},"Burglary":{count:501,rate:6.7},"Riots":{count:239,rate:3.2},"Crimes Against Women":{count:1302,rate:17.4},"Cybercrime":{count:359,rate:4.8},"Economic Offences":{count:703,rate:9.4}}},
  PB:{name:"Punjab",pop:308,grid:[1, 4],data:{"All IPC Crimes":{count:69944,rate:227.1},"Murder":{count:678,rate:2.2},"Kidnapping & Abduction":{count:1571,rate:5.1},"Robbery":{count:154,rate:0.5},"Theft":{count:6991,rate:22.7},"Burglary":{count:1756,rate:5.7},"Riots":{count:832,rate:2.7},"Crimes Against Women":{count:4558,rate:14.8},"Cybercrime":{count:1263,rate:4.1},"Economic Offences":{count:2433,rate:7.9}}},
  CH:{name:"Chandigarh",pop:12,grid:[1, 5],data:{"All IPC Crimes":{count:4185,rate:338.9},"Murder":{count:17,rate:1.4},"Kidnapping & Abduction":{count:161,rate:13.0},"Robbery":{count:20,rate:1.6},"Theft":{count:419,rate:33.9},"Burglary":{count:105,rate:8.5},"Riots":{count:51,rate:4.1},"Crimes Against Women":{count:272,rate:22.0},"Cybercrime":{count:75,rate:6.1},"Economic Offences":{count:147,rate:11.9}}},
  UK:{name:"Uttarakhand",pop:117,grid:[2, 3],data:{"All IPC Crimes":{count:34017,rate:291.3},"Murder":{count:187,rate:1.6},"Kidnapping & Abduction":{count:1261,rate:10.8},"Robbery":{count:210,rate:1.8},"Theft":{count:3398,rate:29.1},"Burglary":{count:852,rate:7.3},"Riots":{count:409,rate:3.5},"Crimes Against Women":{count:2207,rate:18.9},"Cybercrime":{count:607,rate:5.2},"Economic Offences":{count:1191,rate:10.2}}},
  HR:{name:"Haryana",pop:303,grid:[2, 4],data:{"All IPC Crimes":{count:224216,rate:739.2},"Murder":{count:1031,rate:3.4},"Kidnapping & Abduction":{count:4156,rate:13.7},"Robbery":{count:758,rate:2.5},"Theft":{count:22416,rate:73.9},"Burglary":{count:5611,rate:18.5},"Riots":{count:2700,rate:8.9},"Crimes Against Women":{count:14559,rate:48.0},"Cybercrime":{count:4034,rate:13.3},"Economic Offences":{count:7856,rate:25.9}}},
  DL:{name:"Delhi",pop:215,grid:[2, 5],data:{"All IPC Crimes":{count:344263,rate:1602.0},"Murder":{count:516,rate:2.4},"Kidnapping & Abduction":{count:5716,rate:26.6},"Robbery":{count:1676,rate:7.8},"Theft":{count:34426,rate:160.2},"Burglary":{count:8617,rate:40.1},"Riots":{count:4126,rate:19.2},"Crimes Against Women":{count:22371,rate:104.1},"Cybercrime":{count:6189,rate:28.8},"Economic Offences":{count:12056,rate:56.1}}},
  AR:{name:"Arunachal Pradesh",pop:16,grid:[2, 8],data:{"All IPC Crimes":{count:2941,rate:187.9},"Murder":{count:56,rate:3.6},"Kidnapping & Abduction":{count:64,rate:4.1},"Robbery":{count:36,rate:2.3},"Theft":{count:294,rate:18.8},"Burglary":{count:74,rate:4.7},"Riots":{count:36,rate:2.3},"Crimes Against Women":{count:191,rate:12.2},"Cybercrime":{count:53,rate:3.4},"Economic Offences":{count:103,rate:6.6}}},
  RJ:{name:"Rajasthan",pop:813,grid:[3, 2],data:{"All IPC Crimes":{count:317480,rate:390.4},"Murder":{count:1789,rate:2.2},"Kidnapping & Abduction":{count:9921,rate:12.2},"Robbery":{count:1708,rate:2.1},"Theft":{count:31715,rate:39.0},"Burglary":{count:7970,rate:9.8},"Riots":{count:3822,rate:4.7},"Crimes Against Women":{count:20656,rate:25.4},"Cybercrime":{count:5693,rate:7.0},"Economic Offences":{count:11141,rate:13.7}}},
  UP:{name:"Uttar Pradesh",pop:2365,grid:[3, 4],data:{"All IPC Crimes":{count:793020,rate:335.3},"Murder":{count:3311,rate:1.4},"Kidnapping & Abduction":{count:16556,rate:7.0},"Robbery":{count:1419,rate:0.6},"Theft":{count:79231,rate:33.5},"Burglary":{count:19867,rate:8.4},"Riots":{count:9460,rate:4.0},"Crimes Against Women":{count:51559,rate:21.8},"Cybercrime":{count:14191,rate:6.0},"Economic Offences":{count:27672,rate:11.7}}},
  BR:{name:"Bihar",pop:1274,grid:[3, 6],data:{"All IPC Crimes":{count:353502,rate:277.5},"Murder":{count:2803,rate:2.2},"Kidnapping & Abduction":{count:14395,rate:11.3},"Robbery":{count:2548,rate:2.0},"Theft":{count:35414,rate:27.8},"Burglary":{count:8790,rate:6.9},"Riots":{count:4204,rate:3.3},"Crimes Against Women":{count:22930,rate:18.0},"Cybercrime":{count:6369,rate:5.0},"Economic Offences":{count:12357,rate:9.7}}},
  SK:{name:"Sikkim",pop:7,grid:[3, 7],data:{"All IPC Crimes":{count:718,rate:103.9},"Murder":{count:12,rate:1.7},"Kidnapping & Abduction":{count:36,rate:5.2},"Robbery":{count:2,rate:0.3},"Theft":{count:72,rate:10.4},"Burglary":{count:18,rate:2.6},"Riots":{count:8,rate:1.2},"Crimes Against Women":{count:47,rate:6.8},"Cybercrime":{count:13,rate:1.9},"Economic Offences":{count:25,rate:3.6}}},
  AS:{name:"Assam",pop:358,grid:[3, 8],data:{"All IPC Crimes":{count:64959,rate:181.3},"Murder":{count:1039,rate:2.9},"Kidnapping & Abduction":{count:3547,rate:9.9},"Robbery":{count:752,rate:2.1},"Theft":{count:6485,rate:18.1},"Burglary":{count:1612,rate:4.5},"Riots":{count:788,rate:2.2},"Crimes Against Women":{count:4228,rate:11.8},"Cybercrime":{count:1182,rate:3.3},"Economic Offences":{count:2257,rate:6.3}}},
  NL:{name:"Nagaland",pop:22,grid:[3, 9],data:{"All IPC Crimes":{count:1899,rate:84.9},"Murder":{count:18,rate:0.8},"Kidnapping & Abduction":{count:38,rate:1.7},"Robbery":{count:9,rate:0.4},"Theft":{count:190,rate:8.5},"Burglary":{count:47,rate:2.1},"Riots":{count:22,rate:1.0},"Crimes Against Women":{count:123,rate:5.5},"Cybercrime":{count:34,rate:1.5},"Economic Offences":{count:67,rate:3.0}}},
  GJ:{name:"Gujarat",pop:718,grid:[4, 1],data:{"All IPC Crimes":{count:578879,rate:806.3},"Murder":{count:933,rate:1.3},"Kidnapping & Abduction":{count:1795,rate:2.5},"Robbery":{count:718,rate:1.0},"Theft":{count:57866,rate:80.6},"Burglary":{count:14502,rate:20.2},"Riots":{count:6964,rate:9.7},"Crimes Against Women":{count:37620,rate:52.4},"Cybercrime":{count:10410,rate:14.5},"Economic Offences":{count:20246,rate:28.2}}},
  MP:{name:"Madhya Pradesh",pop:869,grid:[4, 3],data:{"All IPC Crimes":{count:495708,rate:570.3},"Murder":{count:1825,rate:2.1},"Kidnapping & Abduction":{count:11734,rate:13.5},"Robbery":{count:1304,rate:1.5},"Theft":{count:49545,rate:57.0},"Burglary":{count:12430,rate:14.3},"Riots":{count:5911,rate:6.8},"Crimes Against Women":{count:32248,rate:37.1},"Cybercrime":{count:8953,rate:10.3},"Economic Offences":{count:17384,rate:20.0}}},
  CG:{name:"Chhattisgarh",pop:303,grid:[4, 4],data:{"All IPC Crimes":{count:115493,rate:381.2},"Murder":{count:970,rate:3.2},"Kidnapping & Abduction":{count:2999,rate:9.9},"Robbery":{count:424,rate:1.4},"Theft":{count:11543,rate:38.1},"Burglary":{count:2878,rate:9.5},"Riots":{count:1394,rate:4.6},"Crimes Against Women":{count:7514,rate:24.8},"Cybercrime":{count:2091,rate:6.9},"Economic Offences":{count:4030,rate:13.3}}},
  JH:{name:"Jharkhand",pop:396,grid:[4, 6],data:{"All IPC Crimes":{count:63838,rate:161.1},"Murder":{count:1466,rate:3.7},"Kidnapping & Abduction":{count:1664,rate:4.2},"Robbery":{count:594,rate:1.5},"Theft":{count:6380,rate:16.1},"Burglary":{count:1585,rate:4.0},"Riots":{count:753,rate:1.9},"Crimes Against Women":{count:4161,rate:10.5},"Cybercrime":{count:1149,rate:2.9},"Economic Offences":{count:2219,rate:5.6}}},
  WB:{name:"West Bengal",pop:993,grid:[4, 7],data:{"All IPC Crimes":{count:180272,rate:181.6},"Murder":{count:1688,rate:1.7},"Kidnapping & Abduction":{count:8239,rate:8.3},"Robbery":{count:397,rate:0.4},"Theft":{count:18067,rate:18.2},"Burglary":{count:4467,rate:4.5},"Riots":{count:2184,rate:2.2},"Crimes Against Women":{count:11714,rate:11.8},"Cybercrime":{count:3276,rate:3.3},"Economic Offences":{count:6353,rate:6.4}}},
  ML:{name:"Meghalaya",pop:34,grid:[4, 8],data:{"All IPC Crimes":{count:3532,rate:105.2},"Murder":{count:60,rate:1.8},"Kidnapping & Abduction":{count:94,rate:2.8},"Robbery":{count:67,rate:2.0},"Theft":{count:353,rate:10.5},"Burglary":{count:87,rate:2.6},"Riots":{count:44,rate:1.3},"Crimes Against Women":{count:228,rate:6.8},"Cybercrime":{count:64,rate:1.9},"Economic Offences":{count:124,rate:3.7}}},
  MN:{name:"Manipur",pop:32,grid:[4, 9],data:{"All IPC Crimes":{count:20283,rate:627.8},"Murder":{count:152,rate:4.7},"Kidnapping & Abduction":{count:90,rate:2.8},"Robbery":{count:1541,rate:47.7},"Theft":{count:2029,rate:62.8},"Burglary":{count:507,rate:15.7},"Riots":{count:242,rate:7.5},"Crimes Against Women":{count:1318,rate:40.8},"Cybercrime":{count:365,rate:11.3},"Economic Offences":{count:711,rate:22.0}}},
  DD:{name:"Dadra & NH / Daman & Diu",pop:13,grid:[5, 0],data:{"All IPC Crimes":{count:865,rate:66.9},"Murder":{count:19,rate:1.5},"Kidnapping & Abduction":{count:49,rate:3.8},"Robbery":{count:8,rate:0.6},"Theft":{count:87,rate:6.7},"Burglary":{count:22,rate:1.7},"Riots":{count:10,rate:0.8},"Crimes Against Women":{count:56,rate:4.3},"Cybercrime":{count:16,rate:1.2},"Economic Offences":{count:30,rate:2.3}}},
  MH:{name:"Maharashtra",pop:1267,grid:[5, 2],data:{"All IPC Crimes":{count:596103,rate:470.4},"Murder":{count:2154,rate:1.7},"Kidnapping & Abduction":{count:13052,rate:10.3},"Robbery":{count:6590,rate:5.2},"Theft":{count:59560,rate:47.0},"Burglary":{count:14953,rate:11.8},"Riots":{count:7096,rate:5.6},"Crimes Against Women":{count:38777,rate:30.6},"Cybercrime":{count:10771,rate:8.5},"Economic Offences":{count:20909,rate:16.5}}},
  OD:{name:"Odisha",pop:464,grid:[5, 6],data:{"All IPC Crimes":{count:199954,rate:431.2},"Murder":{count:1345,rate:2.9},"Kidnapping & Abduction":{count:6121,rate:13.2},"Robbery":{count:3339,rate:7.2},"Theft":{count:19986,rate:43.1},"Burglary":{count:5008,rate:10.8},"Riots":{count:2411,rate:5.2},"Crimes Against Women":{count:12984,rate:28.0},"Cybercrime":{count:3617,rate:7.8},"Economic Offences":{count:7002,rate:15.1}}},
  TR:{name:"Tripura",pop:42,grid:[5, 8],data:{"All IPC Crimes":{count:5002,rate:120.4},"Murder":{count:100,rate:2.4},"Kidnapping & Abduction":{count:133,rate:3.2},"Robbery":{count:8,rate:0.2},"Theft":{count:499,rate:12.0},"Burglary":{count:125,rate:3.0},"Riots":{count:58,rate:1.4},"Crimes Against Women":{count:324,rate:7.8},"Cybercrime":{count:91,rate:2.2},"Economic Offences":{count:174,rate:4.2}}},
  MZ:{name:"Mizoram",pop:12,grid:[5, 9],data:{"All IPC Crimes":{count:4050,rate:326.3},"Murder":{count:24,rate:1.9},"Kidnapping & Abduction":{count:5,rate:0.4},"Robbery":{count:19,rate:1.5},"Theft":{count:405,rate:32.6},"Burglary":{count:102,rate:8.2},"Riots":{count:48,rate:3.9},"Crimes Against Women":{count:263,rate:21.2},"Cybercrime":{count:73,rate:5.9},"Economic Offences":{count:141,rate:11.4}}},
  GA:{name:"Goa",pop:16,grid:[6, 1],data:{"All IPC Crimes":{count:3082,rate:195.4},"Murder":{count:25,rate:1.6},"Kidnapping & Abduction":{count:77,rate:4.9},"Robbery":{count:11,rate:0.7},"Theft":{count:308,rate:19.5},"Burglary":{count:77,rate:4.9},"Riots":{count:36,rate:2.3},"Crimes Against Women":{count:200,rate:12.7},"Cybercrime":{count:55,rate:3.5},"Economic Offences":{count:107,rate:6.8}}},
  TS:{name:"Telangana",pop:381,grid:[6, 4],data:{"All IPC Crimes":{count:183644,rate:481.6},"Murder":{count:953,rate:2.5},"Kidnapping & Abduction":{count:3165,rate:8.3},"Robbery":{count:572,rate:1.5},"Theft":{count:18380,rate:48.2},"Burglary":{count:4576,rate:12.0},"Riots":{count:2212,rate:5.8},"Crimes Against Women":{count:11935,rate:31.3},"Cybercrime":{count:3317,rate:8.7},"Economic Offences":{count:6444,rate:16.9}}},
  AP:{name:"Andhra Pradesh",pop:532,grid:[6, 5],data:{"All IPC Crimes":{count:184293,rate:346.3},"Murder":{count:905,rate:1.7},"Kidnapping & Abduction":{count:745,rate:1.4},"Robbery":{count:266,rate:0.5},"Theft":{count:18413,rate:34.6},"Burglary":{count:4630,rate:8.7},"Riots":{count:2235,rate:4.2},"Crimes Against Women":{count:11974,rate:22.5},"Cybercrime":{count:3299,rate:6.2},"Economic Offences":{count:6439,rate:12.1}}},
  KA:{name:"Karnataka",pop:678,grid:[7, 2],data:{"All IPC Crimes":{count:214234,rate:315.8},"Murder":{count:1289,rate:1.9},"Kidnapping & Abduction":{count:3731,rate:5.5},"Robbery":{count:2035,rate:3.0},"Theft":{count:21437,rate:31.6},"Burglary":{count:5359,rate:7.9},"Riots":{count:2578,rate:3.8},"Crimes Against Women":{count:13907,rate:20.5},"Cybercrime":{count:3867,rate:5.7},"Economic Offences":{count:7530,rate:11.1}}},
  TN:{name:"Tamil Nadu",pop:769,grid:[7, 4],data:{"All IPC Crimes":{count:539651,rate:701.4},"Murder":{count:1693,rate:2.2},"Kidnapping & Abduction":{count:462,rate:0.6},"Robbery":{count:2385,rate:3.1},"Theft":{count:53934,rate:70.1},"Burglary":{count:13464,rate:17.5},"Riots":{count:6463,rate:8.4},"Crimes Against Women":{count:35084,rate:45.6},"Cybercrime":{count:9694,rate:12.6},"Economic Offences":{count:18850,rate:24.5}}},
  PY:{name:"Puducherry",pop:16,grid:[7, 5],data:{"All IPC Crimes":{count:6284,rate:387.6},"Murder":{count:23,rate:1.4},"Kidnapping & Abduction":{count:32,rate:2.0},"Robbery":{count:15,rate:0.9},"Theft":{count:629,rate:38.8},"Burglary":{count:157,rate:9.7},"Riots":{count:76,rate:4.7},"Crimes Against Women":{count:409,rate:25.2},"Cybercrime":{count:113,rate:7.0},"Economic Offences":{count:220,rate:13.6}}},
  KL:{name:"Kerala",pop:358,grid:[8, 2],data:{"All IPC Crimes":{count:584373,rate:1631.2},"Murder":{count:358,rate:1.0},"Kidnapping & Abduction":{count:322,rate:0.9},"Robbery":{count:967,rate:2.7},"Theft":{count:58430,rate:163.1},"Burglary":{count:14616,rate:40.8},"Riots":{count:7022,rate:19.6},"Crimes Against Women":{count:37974,rate:106.0},"Cybercrime":{count:10532,rate:29.4},"Economic Offences":{count:20456,rate:57.1}}},
  AN:{name:"Andaman & Nicobar",pop:4,grid:[8, 7],data:{"All IPC Crimes":{count:1873,rate:464.8},"Murder":{count:8,rate:2.0},"Kidnapping & Abduction":{count:22,rate:5.5},"Robbery":{count:5,rate:1.2},"Theft":{count:187,rate:46.5},"Burglary":{count:47,rate:11.6},"Riots":{count:23,rate:5.6},"Crimes Against Women":{count:122,rate:30.2},"Cybercrime":{count:34,rate:8.4},"Economic Offences":{count:66,rate:16.3}}},
  LD:{name:"Lakshadweep",pop:1,grid:[9, 1],data:{"All IPC Crimes":{count:152,rate:217.1},"Murder":{count:0,rate:0.0},"Kidnapping & Abduction":{count:0,rate:0.0},"Robbery":{count:0,rate:0.0},"Theft":{count:15,rate:21.7},"Burglary":{count:4,rate:5.4},"Riots":{count:2,rate:2.6},"Crimes Against Women":{count:10,rate:14.1},"Cybercrime":{count:3,rate:3.9},"Economic Offences":{count:5,rate:7.6}}}
};

function getColorScale(values){const min=Math.min(...values),max=Math.max(...values);return(val)=>{if(max===min)return"#0f3460";const t=(val-min)/(max-min);if(t<0.1)return"#0d253f";if(t<0.2)return"#0f3460";if(t<0.3)return"#145a7e";if(t<0.4)return"#1a7a6d";if(t<0.5)return"#2d8f4e";if(t<0.6)return"#7fb032";if(t<0.7)return"#d4ac0d";if(t<0.8)return"#e67e22";if(t<0.9)return"#cb4335";return"#8b1a1a"};}
function formatNum(n){if(n>=100000)return(n/100000).toFixed(1)+"L";if(n>=1000)return(n/1000).toFixed(1)+"K";return n.toString();}

function StateDetailMap({stateCode,selectedCrime,onBack}){
  const mapRef=useRef(null),mapInstanceRef=useRef(null),heatLayerRef=useRef(null),markersRef=useRef([]);
  const[hoveredDistrict,setHoveredDistrict]=useState(null);
  const districtInfo=DISTRICT_DATA[stateCode];
  const stateName=STATES_DATA[stateCode]?.name||stateCode;
  const hasData=!!districtInfo;
  const districts=hasData?districtInfo.districts:[];
  const rates=districts.map(d=>d.data[selectedCrime]?.rate||0);
  const maxRate=Math.max(...rates,1);

  useEffect(()=>{
    if(!hasData||!mapRef.current)return;
    if(mapInstanceRef.current){mapInstanceRef.current.remove();mapInstanceRef.current=null;}
    const L=window.L;if(!L)return;
    const map=L.map(mapRef.current,{center:districtInfo.center,zoom:districtInfo.zoom,zoomControl:true,attributionControl:false});
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{maxZoom:19}).addTo(map);
    mapInstanceRef.current=map;
    return()=>{if(mapInstanceRef.current){mapInstanceRef.current.remove();mapInstanceRef.current=null;}};
  },[hasData,stateCode]);

  useEffect(()=>{
    if(!mapInstanceRef.current||!hasData)return;
    const L=window.L,map=mapInstanceRef.current;
    markersRef.current.forEach(m=>map.removeLayer(m));markersRef.current=[];
    if(heatLayerRef.current){map.removeLayer(heatLayerRef.current);heatLayerRef.current=null;}
    const heatData=districts.map(d=>{const rate=d.data[selectedCrime]?.rate||0;return[d.lat,d.lng,rate/maxRate];});
    if(L.heatLayer){
      heatLayerRef.current=L.heatLayer(heatData,{radius:35,blur:25,maxZoom:10,max:1.0,
        gradient:{0.0:"#0d253f",0.2:"#0f3460",0.35:"#1a7a6d",0.5:"#2d8f4e",0.65:"#d4ac0d",0.8:"#e67e22",0.95:"#cb4335",1.0:"#8b1a1a"}
      }).addTo(map);
    }
    districts.forEach(d=>{
      const rate=d.data[selectedCrime]?.rate||0,count=d.data[selectedCrime]?.count||0;
      const radius=6+(rate/maxRate)*18;
      const marker=L.circleMarker([d.lat,d.lng],{radius,fillColor:"transparent",fillOpacity:0,color:"rgba(255,255,255,0.25)",weight:1})
        .bindTooltip(`<div style="font-family:'Space Mono',monospace;font-size:11px;background:#0e0e14;color:#e8e6e1;padding:8px 12px;border-radius:6px;border:1px solid #2a2a35;min-width:140px"><div style="font-weight:700;margin-bottom:4px;font-size:12px">${d.name}</div><div style="color:#e67e22">Cases: ${count.toLocaleString()}</div><div style="color:#cb4335">Rate: ${rate.toFixed(1)} /lakh</div></div>`,
          {direction:"top",offset:[0,-8],className:"custom-tooltip"})
        .on("mouseover",()=>setHoveredDistrict(d)).on("mouseout",()=>setHoveredDistrict(null)).addTo(map);
      markersRef.current.push(marker);
    });
  },[selectedCrime,hasData,districts,maxRate]);

  const sortedDistricts=useMemo(()=>[...districts].sort((a,b)=>(b.data[selectedCrime]?.rate||0)-(a.data[selectedCrime]?.rate||0)),[districts,selectedCrime]);

  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
      <button onClick={onBack} style={{background:"#141419",border:"1px solid #2a2a35",color:"#e8e6e1",padding:"8px 16px",borderRadius:8,fontSize:13,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"all 0.2s"}}
        onMouseEnter={e=>e.currentTarget.style.background="#1e1e28"} onMouseLeave={e=>e.currentTarget.style.background="#141419"}>
        <span style={{fontSize:16}}>←</span> Back to India
      </button>
      <h2 style={{fontSize:22,fontWeight:700,margin:0,background:"linear-gradient(135deg,#e8e6e1 0%,#8a8a8a 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{stateName}</h2>
      {hasData&&<span style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#5a5a5a",marginLeft:"auto"}}>{districts.length} districts · {selectedCrime}</span>}
    </div>
    {!hasData?(<div style={{background:"#0e0e14",borderRadius:12,border:"1px solid #1a1a25",padding:60,textAlign:"center"}}>
      <div style={{fontSize:48,marginBottom:16}}>🚧</div>
      <h3 style={{fontSize:18,fontWeight:600,color:"#e8e6e1",margin:"0 0 8px"}}>District data coming soon</h3>
      <p style={{color:"#5a5a5a",fontSize:13,fontFamily:"'Space Mono',monospace",margin:0}}>{stateName} district-level data is being compiled from NCRB reports.<br/>Gujarat is currently available as a demo.</p>
    </div>):(
    <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
      <div style={{flex:"1 1 520px"}}>
        <div ref={mapRef} style={{width:"100%",height:500,borderRadius:12,border:"1px solid #1a1a25",overflow:"hidden"}}/>
      </div>
      <div style={{flex:"1 1 280px",minWidth:260}}>
        <div style={{background:"#0e0e14",borderRadius:12,border:"1px solid #1a1a25",padding:16,marginBottom:16,minHeight:100}}>
          {hoveredDistrict?(<>
            <div style={{fontSize:10,color:"#5a5a5a",fontFamily:"'Space Mono',monospace",textTransform:"uppercase",letterSpacing:2,marginBottom:6}}>District Detail</div>
            <h3 style={{fontSize:18,fontWeight:600,margin:"0 0 12px",color:"#e8e6e1"}}>{hoveredDistrict.name}</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div style={{background:"#141419",borderRadius:8,padding:10}}>
                <div style={{fontSize:10,color:"#5a5a5a",fontFamily:"'Space Mono',monospace"}}>CASES</div>
                <div style={{fontSize:22,fontWeight:700,color:"#e67e22"}}>{(hoveredDistrict.data[selectedCrime]?.count||0).toLocaleString()}</div>
              </div>
              <div style={{background:"#141419",borderRadius:8,padding:10}}>
                <div style={{fontSize:10,color:"#5a5a5a",fontFamily:"'Space Mono',monospace"}}>RATE/LAKH</div>
                <div style={{fontSize:22,fontWeight:700,color:"#cb4335"}}>{(hoveredDistrict.data[selectedCrime]?.rate||0).toFixed(1)}</div>
              </div>
            </div>
          </>):(<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:80,color:"#2a2a35",fontSize:13,fontFamily:"'Space Mono',monospace"}}>Hover over a district on the map</div>)}
        </div>
        <div style={{background:"#0e0e14",borderRadius:12,border:"1px solid #1a1a25",padding:16,maxHeight:340,overflowY:"auto"}}>
          <div style={{fontSize:10,color:"#5a5a5a",fontFamily:"'Space Mono',monospace",textTransform:"uppercase",letterSpacing:2,marginBottom:12}}>District Ranking · {selectedCrime}</div>
          {sortedDistricts.map((d,i)=>{const rate=d.data[selectedCrime]?.rate||0;const barW=maxRate>0?(rate/maxRate)*100:0;
            return(<div key={d.name} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2}}>
                <span><span style={{color:"#3a3a45",fontFamily:"'Space Mono',monospace",fontSize:10,marginRight:6}}>{String(i+1).padStart(2,"0")}</span>{d.name}</span>
                <span style={{fontFamily:"'Space Mono',monospace",color:"#e67e22",fontSize:10}}>{rate.toFixed(1)}</span>
              </div>
              <div style={{height:2,background:"#1a1a25",borderRadius:2}}><div style={{height:"100%",borderRadius:2,width:`${barW}%`,background:`hsl(${30-(rate/maxRate)*30},80%,${50-(rate/maxRate)*15}%)`,transition:"width 0.3s ease"}}/></div>
            </div>);})}
        </div>
      </div>
    </div>)}
  </div>);
}

export default function CrimeMap(){
  const[selectedCrime,setSelectedCrime]=useState("All IPC Crimes");
  const[hovered,setHovered]=useState(null);
  const[showRate,setShowRate]=useState(true);
  const[selectedState,setSelectedState]=useState(null);
  const[leafletReady,setLeafletReady]=useState(false);
  const stateEntries=Object.entries(STATES_DATA);

  useEffect(()=>{
    if(window.L&&window.L.heatLayer){setLeafletReady(true);return;}
    const loadScript=(src)=>new Promise((res,rej)=>{
      if(document.querySelector(`script[src="${src}"]`)){res();return;}
      const s=document.createElement("script");s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s);
    });
    const loadCSS=(href)=>{
      if(document.querySelector(`link[href="${href}"]`))return;
      const l=document.createElement("link");l.rel="stylesheet";l.href=href;document.head.appendChild(l);
    };
    loadCSS("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
    loadScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js")
      .then(()=>loadScript("https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js"))
      .then(()=>setLeafletReady(true))
      .catch(console.error);
  },[]);

  const{colorFn,minVal,maxVal,topStates,totalCrimes}=useMemo(()=>{
    const vals=stateEntries.map(([,s])=>showRate?s.data[selectedCrime].rate:s.data[selectedCrime].count);
    const sorted=[...stateEntries].sort(([,a],[,b])=>b.data[selectedCrime].rate-a.data[selectedCrime].rate);
    const total=stateEntries.reduce((sum,[,s])=>sum+s.data[selectedCrime].count,0);
    return{colorFn:getColorScale(vals),minVal:Math.min(...vals),maxVal:Math.max(...vals),topStates:sorted.slice(0,5),totalCrimes:total};
  },[selectedCrime,showRate]);

  const TILE=58,GAP=4,PADDING=16;
  const hoveredState=hovered?STATES_DATA[hovered]:null;

  return(<div style={{minHeight:"100vh",background:"#0a0a0f",color:"#e8e6e1",fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",padding:"20px"}}>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
    <style>{`.custom-tooltip{background:transparent!important;border:none!important;box-shadow:none!important;padding:0!important}.custom-tooltip .leaflet-tooltip-content{margin:0}.leaflet-tooltip-top:before{display:none!important}.leaflet-container{background:#0a0a0f!important}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0e0e14}::-webkit-scrollbar-thumb{background:#2a2a35;border-radius:4px}`}</style>
    <div style={{maxWidth:960,margin:"0 auto"}}>
      <div style={{marginBottom:6,display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:"#cb4335",boxShadow:"0 0 8px #cb4335"}}/>
        <span style={{fontFamily:"'Space Mono',monospace",fontSize:11,letterSpacing:3,color:"#7a7a7a",textTransform:"uppercase"}}>NCRB Crime Analytics</span>
      </div>
      <h1 style={{fontSize:28,fontWeight:700,margin:"4px 0 2px",letterSpacing:-0.5,background:"linear-gradient(135deg,#e8e6e1 0%,#8a8a8a 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>India Crime Heatmap</h1>
      <p style={{color:"#5a5a5a",fontSize:13,margin:"0 0 20px",fontFamily:"'Space Mono',monospace"}}>{selectedState?"District-level heatmap · Hover districts for details":"Click any state to drill down into district-level data"}</p>

      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:20,alignItems:"center"}}>
        <select value={selectedCrime} onChange={e=>setSelectedCrime(e.target.value)} style={{background:"#141419",border:"1px solid #2a2a35",color:"#e8e6e1",padding:"8px 14px",borderRadius:8,fontSize:13,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",minWidth:200}}>
          {CRIME_TYPES.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        {!selectedState&&<div style={{display:"flex",borderRadius:8,border:"1px solid #2a2a35",overflow:"hidden"}}>
          {["Rate","Count"].map(label=><button key={label} onClick={()=>setShowRate(label==="Rate")} style={{padding:"8px 16px",fontSize:12,fontFamily:"'Space Mono',monospace",border:"none",cursor:"pointer",background:(label==="Rate"?showRate:!showRate)?"#1e1e28":"transparent",color:(label==="Rate"?showRate:!showRate)?"#e8e6e1":"#5a5a5a",transition:"all 0.2s"}}>{label==="Rate"?"Per Lakh":"Absolute"}</button>)}
        </div>}
        {!selectedState&&<div style={{marginLeft:"auto",fontFamily:"'Space Mono',monospace",fontSize:12,color:"#5a5a5a"}}>Total: <span style={{color:"#e67e22",fontWeight:700}}>{formatNum(totalCrimes)}</span> cases</div>}
      </div>

      {selectedState&&leafletReady?(<StateDetailMap stateCode={selectedState} selectedCrime={selectedCrime} onBack={()=>setSelectedState(null)}/>
      ):selectedState&&!leafletReady?(<div style={{textAlign:"center",padding:40,color:"#5a5a5a",fontFamily:"'Space Mono',monospace"}}>Loading map...</div>
      ):(
      <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 520px",position:"relative"}}>
          <div style={{background:"#0e0e14",borderRadius:12,border:"1px solid #1a1a25",padding:PADDING,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:"50%",left:"50%",width:300,height:300,background:"radial-gradient(circle,rgba(203,67,53,0.05) 0%,transparent 70%)",transform:"translate(-50%,-50%)",pointerEvents:"none"}}/>
            <svg width={10*(TILE+GAP)+PADDING*2} height={10*(TILE+GAP)+PADDING} viewBox={`0 0 ${10*(TILE+GAP)+PADDING*2} ${10*(TILE+GAP)+PADDING}`} style={{display:"block",maxWidth:"100%"}}>
              {stateEntries.map(([code,state])=>{
                const[row,col]=state.grid,x=col*(TILE+GAP),y=row*(TILE+GAP);
                const val=showRate?state.data[selectedCrime].rate:state.data[selectedCrime].count;
                const fill=colorFn(val),isHovered=hovered===code,hasDistricts=!!DISTRICT_DATA[code];
                return(<g key={code} onMouseEnter={()=>setHovered(code)} onMouseLeave={()=>setHovered(null)} onClick={()=>setSelectedState(code)} style={{cursor:"pointer"}}>
                  <rect x={x} y={y} width={TILE} height={TILE} rx={6} fill={fill} stroke={isHovered?"#e8e6e1":hasDistricts?"rgba(230,126,34,0.3)":"rgba(255,255,255,0.06)"} strokeWidth={isHovered?2:hasDistricts?1.5:1} style={{transition:"all 0.2s ease",filter:isHovered?"brightness(1.3)":"none"}}/>
                  <text x={x+TILE/2} y={y+TILE/2-4} textAnchor="middle" fill={isHovered?"#fff":"rgba(255,255,255,0.75)"} fontSize={12} fontWeight={600} fontFamily="'Space Mono',monospace">{code}</text>
                  <text x={x+TILE/2} y={y+TILE/2+12} textAnchor="middle" fill={isHovered?"#fff":"rgba(255,255,255,0.4)"} fontSize={9} fontFamily="'Space Mono',monospace">{showRate?val.toFixed(1):formatNum(val)}</text>
                  {hasDistricts&&<><rect x={x+TILE-18} y={y+2} width={16} height={12} rx={3} fill="rgba(230,126,34,0.2)"/><text x={x+TILE-10} y={y+10.5} textAnchor="middle" fill="#e67e22" fontSize={9} fontWeight={700} fontFamily="'Space Mono',monospace">↓</text></>}
                </g>);
              })}
            </svg>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:12,paddingTop:12,borderTop:"1px solid #1a1a25"}}>
              <span style={{fontSize:10,color:"#5a5a5a",fontFamily:"'Space Mono',monospace"}}>{showRate?minVal.toFixed(1):formatNum(minVal)}</span>
              <div style={{flex:1,height:8,borderRadius:4,background:"linear-gradient(to right,#0d253f,#0f3460,#145a7e,#1a7a6d,#2d8f4e,#7fb032,#d4ac0d,#e67e22,#cb4335,#8b1a1a)"}}/>
              <span style={{fontSize:10,color:"#5a5a5a",fontFamily:"'Space Mono',monospace"}}>{showRate?maxVal.toFixed(1):formatNum(maxVal)}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
              <span style={{fontSize:10,color:"#3a3a45",fontFamily:"'Space Mono',monospace"}}>{showRate?"crimes per lakh population":"total reported cases"}</span>
              <span style={{fontSize:10,color:"#e67e22",fontFamily:"'Space Mono',monospace"}}>↓ = click to drill down</span>
            </div>
          </div>
        </div>
        <div style={{flex:"1 1 280px",minWidth:260}}>
          <div style={{background:"#0e0e14",borderRadius:12,border:"1px solid #1a1a25",padding:16,marginBottom:16,minHeight:140}}>
            {hoveredState?(<>
              <div style={{fontSize:10,color:"#5a5a5a",fontFamily:"'Space Mono',monospace",textTransform:"uppercase",letterSpacing:2,marginBottom:6}}>State Detail</div>
              <h3 style={{fontSize:18,fontWeight:600,margin:"0 0 12px",color:"#e8e6e1"}}>{hoveredState.name}</h3>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div style={{background:"#141419",borderRadius:8,padding:10}}><div style={{fontSize:10,color:"#5a5a5a",fontFamily:"'Space Mono',monospace"}}>CASES</div><div style={{fontSize:22,fontWeight:700,color:"#e67e22"}}>{hoveredState.data[selectedCrime].count.toLocaleString()}</div></div>
                <div style={{background:"#141419",borderRadius:8,padding:10}}><div style={{fontSize:10,color:"#5a5a5a",fontFamily:"'Space Mono',monospace"}}>RATE/LAKH</div><div style={{fontSize:22,fontWeight:700,color:"#cb4335"}}>{hoveredState.data[selectedCrime].rate.toFixed(1)}</div></div>
              </div>
              <div style={{marginTop:10,fontSize:11,color:"#4a4a55",fontFamily:"'Space Mono',monospace"}}>Pop: {hoveredState.pop} lakh · {DISTRICT_DATA[hovered]?"Click to view districts →":"District data coming soon"}</div>
            </>):(<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:120,color:"#2a2a35",fontSize:13,fontFamily:"'Space Mono',monospace"}}>Hover over a state tile</div>)}
          </div>
          <div style={{background:"#0e0e14",borderRadius:12,border:"1px solid #1a1a25",padding:16}}>
            <div style={{fontSize:10,color:"#5a5a5a",fontFamily:"'Space Mono',monospace",textTransform:"uppercase",letterSpacing:2,marginBottom:12}}>Highest Crime Rate · {selectedCrime}</div>
            {topStates.map(([code,state],i)=>{const rate=state.data[selectedCrime].rate;const barWidth=maxVal>0?(rate/maxVal)*100:0;
              return(<div key={code} style={{marginBottom:10,cursor:"pointer",opacity:hovered===code?1:0.8}} onMouseEnter={()=>setHovered(code)} onMouseLeave={()=>setHovered(null)} onClick={()=>setSelectedState(code)}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
                  <span><span style={{color:"#3a3a45",fontFamily:"'Space Mono',monospace",fontSize:10,marginRight:6}}>{String(i+1).padStart(2,"0")}</span>{state.name}</span>
                  <span style={{fontFamily:"'Space Mono',monospace",color:"#e67e22",fontSize:11}}>{rate.toFixed(1)}</span>
                </div>
                <div style={{height:3,background:"#1a1a25",borderRadius:2}}><div style={{height:"100%",borderRadius:2,width:`${barWidth}%`,background:colorFn(rate),transition:"width 0.3s ease"}}/></div>
              </div>);})}
          </div>
          <div style={{marginTop:16,padding:12,background:"rgba(203,67,53,0.05)",border:"1px solid rgba(203,67,53,0.15)",borderRadius:8,fontSize:10,color:"#5a5a5a",fontFamily:"'Space Mono',monospace",lineHeight:1.6}}>
            <strong style={{color:"#cb4335"}}>DATA NOTE</strong><br/>Based on NCRB "Crime in India" 2023 (released Sep 2025). Sub-category breakdowns are estimates. For precise data, refer to <span style={{color:"#e67e22"}}>ncrb.gov.in</span>
          </div>
          <div style={{marginTop:16,padding:14,background:"#0e0e14",border:"1px solid #1a1a25",borderRadius:8,fontSize:11,color:"#5a5a5a",fontFamily:"'Space Mono',monospace",lineHeight:1.8,textAlign:"center"}}>
            <span style={{color:"#e8e6e1",fontWeight:600,fontSize:12}}>Built by Aman Kumar</span><br/>
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:8,marginTop:6}}>
              <a href="https://www.linkedin.com/in/aman-kumar-435775100/" target="_blank" rel="noopener noreferrer" style={{color:"#e67e22",textDecoration:"none",display:"flex",alignItems:"center",gap:4}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#e67e22"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
              <span style={{color:"#2a2a35"}}>·</span>
              <a href="https://github.com/Amankumar2010" target="_blank" rel="noopener noreferrer" style={{color:"#e67e22",textDecoration:"none",display:"flex",alignItems:"center",gap:4}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#e67e22"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>)}
    </div>
  </div>);
}
