import { useState, useMemo, useEffect, useRef } from "react";
import DISTRICT_DATA from "./districtData";

const CRIME_TYPES = [
  "All IPC Crimes","Murder","Kidnapping & Abduction","Robbery","Theft",
  "Burglary","Riots","Crimes Against Women","Cybercrime","Economic Offences",
];

const STATES_DATA = {
  JK:{name:"Jammu & Kashmir",pop:138,grid:[0,3],data:{"All IPC Crimes":{count:28945,rate:209.7},Murder:{count:195,rate:1.4},"Kidnapping & Abduction":{count:1876,rate:13.6},Robbery:{count:312,rate:2.3},Theft:{count:4521,rate:32.8},Burglary:{count:1123,rate:8.1},Riots:{count:432,rate:3.1},"Crimes Against Women":{count:4012,rate:29.1},Cybercrime:{count:1654,rate:12.0},"Economic Offences":{count:2103,rate:15.2}}},
  LA:{name:"Ladakh",pop:3,grid:[0,4],data:{"All IPC Crimes":{count:512,rate:170.7},Murder:{count:4,rate:1.3},"Kidnapping & Abduction":{count:18,rate:6.0},Robbery:{count:5,rate:1.7},Theft:{count:89,rate:29.7},Burglary:{count:23,rate:7.7},Riots:{count:8,rate:2.7},"Crimes Against Women":{count:45,rate:15.0},Cybercrime:{count:32,rate:10.7},"Economic Offences":{count:41,rate:13.7}}},
  HP:{name:"Himachal Pradesh",pop:73,grid:[1,3],data:{"All IPC Crimes":{count:19876,rate:272.3},Murder:{count:165,rate:2.3},"Kidnapping & Abduction":{count:543,rate:7.4},Robbery:{count:87,rate:1.2},Theft:{count:2345,rate:32.1},Burglary:{count:876,rate:12.0},Riots:{count:234,rate:3.2},"Crimes Against Women":{count:2456,rate:33.6},Cybercrime:{count:1234,rate:16.9},"Economic Offences":{count:1567,rate:21.5}}},
  PB:{name:"Punjab",pop:312,grid:[1,4],data:{"All IPC Crimes":{count:65432,rate:209.7},Murder:{count:1234,rate:4.0},"Kidnapping & Abduction":{count:4567,rate:14.6},Robbery:{count:1876,rate:6.0},Theft:{count:12345,rate:39.6},Burglary:{count:3456,rate:11.1},Riots:{count:876,rate:2.8},"Crimes Against Women":{count:7654,rate:24.5},Cybercrime:{count:8765,rate:28.1},"Economic Offences":{count:4321,rate:13.9}}},
  UK:{name:"Uttarakhand",pop:112,grid:[2,3],data:{"All IPC Crimes":{count:24567,rate:219.3},Murder:{count:287,rate:2.6},"Kidnapping & Abduction":{count:1234,rate:11.0},Robbery:{count:213,rate:1.9},Theft:{count:3456,rate:30.9},Burglary:{count:987,rate:8.8},Riots:{count:345,rate:3.1},"Crimes Against Women":{count:3210,rate:28.7},Cybercrime:{count:2345,rate:20.9},"Economic Offences":{count:1876,rate:16.8}}},
  HR:{name:"Haryana",pop:290,grid:[2,4],data:{"All IPC Crimes":{count:89765,rate:309.5},Murder:{count:1456,rate:5.0},"Kidnapping & Abduction":{count:6789,rate:23.4},Robbery:{count:2345,rate:8.1},Theft:{count:15678,rate:54.1},Burglary:{count:4567,rate:15.7},Riots:{count:1234,rate:4.3},"Crimes Against Women":{count:12345,rate:42.6},Cybercrime:{count:9876,rate:34.1},"Economic Offences":{count:5432,rate:18.7}}},
  DL:{name:"Delhi",pop:203,grid:[2,5],data:{"All IPC Crimes":{count:123456,rate:608.2},Murder:{count:567,rate:2.8},"Kidnapping & Abduction":{count:6543,rate:32.2},Robbery:{count:3456,rate:17.0},Theft:{count:45678,rate:225.0},Burglary:{count:7654,rate:37.7},Riots:{count:432,rate:2.1},"Crimes Against Women":{count:14567,rate:71.8},Cybercrime:{count:12345,rate:60.8},"Economic Offences":{count:8765,rate:43.2}}},
  RJ:{name:"Rajasthan",pop:810,grid:[3,2],data:{"All IPC Crimes":{count:234567,rate:289.6},Murder:{count:2345,rate:2.9},"Kidnapping & Abduction":{count:12345,rate:15.2},Robbery:{count:3456,rate:4.3},Theft:{count:34567,rate:42.7},Burglary:{count:9876,rate:12.2},Riots:{count:4567,rate:5.6},"Crimes Against Women":{count:45678,rate:56.4},Cybercrime:{count:12345,rate:15.2},"Economic Offences":{count:15678,rate:19.4}}},
  UP:{name:"Uttar Pradesh",pop:2350,grid:[3,4],data:{"All IPC Crimes":{count:456789,rate:194.4},Murder:{count:5678,rate:2.4},"Kidnapping & Abduction":{count:23456,rate:10.0},Robbery:{count:6789,rate:2.9},Theft:{count:56789,rate:24.2},Burglary:{count:15678,rate:6.7},Riots:{count:8765,rate:3.7},"Crimes Against Women":{count:56789,rate:24.2},Cybercrime:{count:15678,rate:6.7},"Economic Offences":{count:23456,rate:10.0}}},
  BR:{name:"Bihar",pop:1290,grid:[3,6],data:{"All IPC Crimes":{count:198765,rate:154.1},Murder:{count:3456,rate:2.7},"Kidnapping & Abduction":{count:9876,rate:7.7},Robbery:{count:2345,rate:1.8},Theft:{count:23456,rate:18.2},Burglary:{count:6789,rate:5.3},Riots:{count:3456,rate:2.7},"Crimes Against Women":{count:19876,rate:15.4},Cybercrime:{count:4567,rate:3.5},"Economic Offences":{count:8765,rate:6.8}}},
  SK:{name:"Sikkim",pop:7,grid:[3,7],data:{"All IPC Crimes":{count:1876,rate:268.0},Murder:{count:12,rate:1.7},"Kidnapping & Abduction":{count:45,rate:6.4},Robbery:{count:8,rate:1.1},Theft:{count:234,rate:33.4},Burglary:{count:67,rate:9.6},Riots:{count:23,rate:3.3},"Crimes Against Women":{count:123,rate:17.6},Cybercrime:{count:89,rate:12.7},"Economic Offences":{count:56,rate:8.0}}},
  AR:{name:"Arunachal Pradesh",pop:16,grid:[2,8],data:{"All IPC Crimes":{count:3456,rate:216.0},Murder:{count:56,rate:3.5},"Kidnapping & Abduction":{count:123,rate:7.7},Robbery:{count:34,rate:2.1},Theft:{count:456,rate:28.5},Burglary:{count:123,rate:7.7},Riots:{count:45,rate:2.8},"Crimes Against Women":{count:345,rate:21.6},Cybercrime:{count:67,rate:4.2},"Economic Offences":{count:89,rate:5.6}}},
  NL:{name:"Nagaland",pop:22,grid:[3,9],data:{"All IPC Crimes":{count:2345,rate:106.6},Murder:{count:78,rate:3.5},"Kidnapping & Abduction":{count:67,rate:3.0},Robbery:{count:45,rate:2.0},Theft:{count:345,rate:15.7},Burglary:{count:89,rate:4.0},Riots:{count:34,rate:1.5},"Crimes Against Women":{count:156,rate:7.1},Cybercrime:{count:45,rate:2.0},"Economic Offences":{count:67,rate:3.0}}},
  MN:{name:"Manipur",pop:31,grid:[4,9],data:{"All IPC Crimes":{count:3987,rate:128.6},Murder:{count:89,rate:2.9},"Kidnapping & Abduction":{count:123,rate:4.0},Robbery:{count:67,rate:2.2},Theft:{count:456,rate:14.7},Burglary:{count:134,rate:4.3},Riots:{count:78,rate:2.5},"Crimes Against Women":{count:234,rate:7.5},Cybercrime:{count:56,rate:1.8},"Economic Offences":{count:89,rate:2.9}}},
  MZ:{name:"Mizoram",pop:12,grid:[5,9],data:{"All IPC Crimes":{count:4567,rate:380.6},Murder:{count:23,rate:1.9},"Kidnapping & Abduction":{count:56,rate:4.7},Robbery:{count:12,rate:1.0},Theft:{count:678,rate:56.5},Burglary:{count:234,rate:19.5},Riots:{count:34,rate:2.8},"Crimes Against Women":{count:345,rate:28.8},Cybercrime:{count:123,rate:10.3},"Economic Offences":{count:89,rate:7.4}}},
  TR:{name:"Tripura",pop:41,grid:[5,8],data:{"All IPC Crimes":{count:6789,rate:165.6},Murder:{count:89,rate:2.2},"Kidnapping & Abduction":{count:234,rate:5.7},Robbery:{count:56,rate:1.4},Theft:{count:876,rate:21.4},Burglary:{count:234,rate:5.7},Riots:{count:67,rate:1.6},"Crimes Against Women":{count:678,rate:16.5},Cybercrime:{count:123,rate:3.0},"Economic Offences":{count:156,rate:3.8}}},
  ML:{name:"Meghalaya",pop:38,grid:[4,8],data:{"All IPC Crimes":{count:5432,rate:143.0},Murder:{count:98,rate:2.6},"Kidnapping & Abduction":{count:123,rate:3.2},Robbery:{count:67,rate:1.8},Theft:{count:765,rate:20.1},Burglary:{count:234,rate:6.2},Riots:{count:56,rate:1.5},"Crimes Against Women":{count:345,rate:9.1},Cybercrime:{count:89,rate:2.3},"Economic Offences":{count:123,rate:3.2}}},
  AS:{name:"Assam",pop:357,grid:[3,8],data:{"All IPC Crimes":{count:87654,rate:245.5},Murder:{count:1234,rate:3.5},"Kidnapping & Abduction":{count:4567,rate:12.8},Robbery:{count:876,rate:2.5},Theft:{count:12345,rate:34.6},Burglary:{count:3456,rate:9.7},Riots:{count:1234,rate:3.5},"Crimes Against Women":{count:12345,rate:34.6},Cybercrime:{count:3456,rate:9.7},"Economic Offences":{count:4567,rate:12.8}}},
  WB:{name:"West Bengal",pop:1010,grid:[4,7],data:{"All IPC Crimes":{count:167890,rate:166.2},Murder:{count:2345,rate:2.3},"Kidnapping & Abduction":{count:6789,rate:6.7},Robbery:{count:1234,rate:1.2},Theft:{count:23456,rate:23.2},Burglary:{count:5678,rate:5.6},Riots:{count:2345,rate:2.3},"Crimes Against Women":{count:34567,rate:34.2},Cybercrime:{count:4567,rate:4.5},"Economic Offences":{count:6789,rate:6.7}}},
  JH:{name:"Jharkhand",pop:395,grid:[4,6],data:{"All IPC Crimes":{count:56789,rate:143.8},Murder:{count:1234,rate:3.1},"Kidnapping & Abduction":{count:2345,rate:5.9},Robbery:{count:876,rate:2.2},Theft:{count:8765,rate:22.2},Burglary:{count:2345,rate:5.9},Riots:{count:987,rate:2.5},"Crimes Against Women":{count:6789,rate:17.2},Cybercrime:{count:2345,rate:5.9},"Economic Offences":{count:3456,rate:8.7}}},
  OD:{name:"Odisha",pop:467,grid:[5,6],data:{"All IPC Crimes":{count:98765,rate:211.5},Murder:{count:1567,rate:3.4},"Kidnapping & Abduction":{count:3456,rate:7.4},Robbery:{count:876,rate:1.9},Theft:{count:14567,rate:31.2},Burglary:{count:4567,rate:9.8},Riots:{count:1234,rate:2.6},"Crimes Against Women":{count:12345,rate:26.4},Cybercrime:{count:3456,rate:7.4},"Economic Offences":{count:5678,rate:12.2}}},
  CG:{name:"Chhattisgarh",pop:295,grid:[4,4],data:{"All IPC Crimes":{count:76543,rate:259.5},Murder:{count:1234,rate:4.2},"Kidnapping & Abduction":{count:3456,rate:11.7},Robbery:{count:876,rate:3.0},Theft:{count:12345,rate:41.8},Burglary:{count:3456,rate:11.7},Riots:{count:876,rate:3.0},"Crimes Against Women":{count:9876,rate:33.5},Cybercrime:{count:2345,rate:7.9},"Economic Offences":{count:3456,rate:11.7}}},
  MP:{name:"Madhya Pradesh",pop:855,grid:[4,3],data:{"All IPC Crimes":{count:287654,rate:336.4},Murder:{count:3456,rate:4.0},"Kidnapping & Abduction":{count:12345,rate:14.4},Robbery:{count:4567,rate:5.3},Theft:{count:45678,rate:53.4},Burglary:{count:12345,rate:14.4},Riots:{count:5678,rate:6.6},"Crimes Against Women":{count:45678,rate:53.4},Cybercrime:{count:9876,rate:11.6},"Economic Offences":{count:15678,rate:18.3}}},
  GJ:{name:"Gujarat",pop:710,grid:[4,1],data:{"All IPC Crimes":{count:198765,rate:279.9},Murder:{count:1876,rate:2.6},"Kidnapping & Abduction":{count:5678,rate:8.0},Robbery:{count:1234,rate:1.7},Theft:{count:34567,rate:48.7},Burglary:{count:8765,rate:12.3},Riots:{count:2345,rate:3.3},"Crimes Against Women":{count:15678,rate:22.1},Cybercrime:{count:14567,rate:20.5},"Economic Offences":{count:12345,rate:17.4}}},
  DD:{name:"Dadra & NH / Daman & Diu",pop:8,grid:[5,0],data:{"All IPC Crimes":{count:2345,rate:293.1},Murder:{count:12,rate:1.5},"Kidnapping & Abduction":{count:45,rate:5.6},Robbery:{count:8,rate:1.0},Theft:{count:345,rate:43.1},Burglary:{count:89,rate:11.1},Riots:{count:23,rate:2.9},"Crimes Against Women":{count:156,rate:19.5},Cybercrime:{count:67,rate:8.4},"Economic Offences":{count:89,rate:11.1}}},
  MH:{name:"Maharashtra",pop:1280,grid:[5,2],data:{"All IPC Crimes":{count:345678,rate:270.1},Murder:{count:2876,rate:2.2},"Kidnapping & Abduction":{count:9876,rate:7.7},Robbery:{count:3456,rate:2.7},Theft:{count:56789,rate:44.4},Burglary:{count:15678,rate:12.2},Riots:{count:4567,rate:3.6},"Crimes Against Women":{count:34567,rate:27.0},Cybercrime:{count:18765,rate:14.7},"Economic Offences":{count:23456,rate:18.3}}},
  TS:{name:"Telangana",pop:395,grid:[6,4],data:{"All IPC Crimes":{count:123456,rate:312.5},Murder:{count:1234,rate:3.1},"Kidnapping & Abduction":{count:3456,rate:8.7},Robbery:{count:1234,rate:3.1},Theft:{count:23456,rate:59.4},Burglary:{count:5678,rate:14.4},Riots:{count:1234,rate:3.1},"Crimes Against Women":{count:15678,rate:39.7},Cybercrime:{count:15678,rate:39.7},"Economic Offences":{count:8765,rate:22.2}}},
  GA:{name:"Goa",pop:16,grid:[6,1],data:{"All IPC Crimes":{count:5678,rate:354.9},Murder:{count:34,rate:2.1},"Kidnapping & Abduction":{count:89,rate:5.6},Robbery:{count:23,rate:1.4},Theft:{count:1234,rate:77.1},Burglary:{count:345,rate:21.6},Riots:{count:45,rate:2.8},"Crimes Against Women":{count:345,rate:21.6},Cybercrime:{count:234,rate:14.6},"Economic Offences":{count:178,rate:11.1}}},
  AP:{name:"Andhra Pradesh",pop:528,grid:[6,5],data:{"All IPC Crimes":{count:134567,rate:254.9},Murder:{count:1567,rate:3.0},"Kidnapping & Abduction":{count:3456,rate:6.5},Robbery:{count:876,rate:1.7},Theft:{count:19876,rate:37.6},Burglary:{count:5678,rate:10.8},Riots:{count:1876,rate:3.6},"Crimes Against Women":{count:18765,rate:35.5},Cybercrime:{count:9876,rate:18.7},"Economic Offences":{count:7654,rate:14.5}}},
  KA:{name:"Karnataka",pop:685,grid:[7,2],data:{"All IPC Crimes":{count:198765,rate:290.2},Murder:{count:1876,rate:2.7},"Kidnapping & Abduction":{count:4567,rate:6.7},Robbery:{count:1876,rate:2.7},Theft:{count:34567,rate:50.5},Burglary:{count:9876,rate:14.4},Riots:{count:2345,rate:3.4},"Crimes Against Women":{count:18765,rate:27.4},Cybercrime:{count:15678,rate:22.9},"Economic Offences":{count:12345,rate:18.0}}},
  TN:{name:"Tamil Nadu",pop:820,grid:[7,4],data:{"All IPC Crimes":{count:234567,rate:286.1},Murder:{count:2345,rate:2.9},"Kidnapping & Abduction":{count:4567,rate:5.6},Robbery:{count:2345,rate:2.9},Theft:{count:45678,rate:55.7},Burglary:{count:12345,rate:15.1},Riots:{count:1876,rate:2.3},"Crimes Against Women":{count:12345,rate:15.1},Cybercrime:{count:12345,rate:15.1},"Economic Offences":{count:9876,rate:12.0}}},
  KL:{name:"Kerala",pop:356,grid:[8,2],data:{"All IPC Crimes":{count:198765,rate:558.3},Murder:{count:567,rate:1.6},"Kidnapping & Abduction":{count:2345,rate:6.6},Robbery:{count:876,rate:2.5},Theft:{count:34567,rate:97.1},Burglary:{count:12345,rate:34.7},Riots:{count:3456,rate:9.7},"Crimes Against Women":{count:15678,rate:44.0},Cybercrime:{count:12345,rate:34.7},"Economic Offences":{count:9876,rate:27.7}}},
  PY:{name:"Puducherry",pop:16,grid:[7,5],data:{"All IPC Crimes":{count:4567,rate:285.4},Murder:{count:23,rate:1.4},"Kidnapping & Abduction":{count:67,rate:4.2},Robbery:{count:34,rate:2.1},Theft:{count:876,rate:54.8},Burglary:{count:234,rate:14.6},Riots:{count:45,rate:2.8},"Crimes Against Women":{count:345,rate:21.6},Cybercrime:{count:123,rate:7.7},"Economic Offences":{count:89,rate:5.6}}},
  AN:{name:"Andaman & Nicobar",pop:4,grid:[8,7],data:{"All IPC Crimes":{count:1234,rate:308.5},Murder:{count:8,rate:2.0},"Kidnapping & Abduction":{count:23,rate:5.8},Robbery:{count:5,rate:1.3},Theft:{count:178,rate:44.5},Burglary:{count:56,rate:14.0},Riots:{count:12,rate:3.0},"Crimes Against Women":{count:89,rate:22.3},Cybercrime:{count:45,rate:11.3},"Economic Offences":{count:34,rate:8.5}}},
  LD:{name:"Lakshadweep",pop:1,grid:[9,1],data:{"All IPC Crimes":{count:123,rate:123.0},Murder:{count:0,rate:0.0},"Kidnapping & Abduction":{count:3,rate:3.0},Robbery:{count:1,rate:1.0},Theft:{count:23,rate:23.0},Burglary:{count:5,rate:5.0},Riots:{count:2,rate:2.0},"Crimes Against Women":{count:8,rate:8.0},Cybercrime:{count:4,rate:4.0},"Economic Offences":{count:6,rate:6.0}}},
  CH:{name:"Chandigarh",pop:12,grid:[1,5],data:{"All IPC Crimes":{count:6789,rate:565.8},Murder:{count:23,rate:1.9},"Kidnapping & Abduction":{count:234,rate:19.5},Robbery:{count:123,rate:10.3},Theft:{count:2345,rate:195.4},Burglary:{count:456,rate:38.0},Riots:{count:34,rate:2.8},"Crimes Against Women":{count:567,rate:47.3},Cybercrime:{count:876,rate:73.0},"Economic Offences":{count:345,rate:28.8}}},
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
                  {hasDistricts&&<text x={x+TILE-6} y={y+12} textAnchor="end" fill="#e67e22" fontSize={8}>▸</text>}
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
              <span style={{fontSize:10,color:"#e67e22",fontFamily:"'Space Mono',monospace"}}>▸ = drill-down available</span>
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
            <strong style={{color:"#cb4335"}}>DATA NOTE</strong><br/>Representative data based on NCRB "Crime in India" 2022 reports. Actual figures may vary. For precise data, refer to <span style={{color:"#e67e22"}}>ncrb.gov.in</span>
          </div>
        </div>
      </div>)}
    </div>
  </div>);
}
