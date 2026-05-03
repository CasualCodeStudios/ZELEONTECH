
/* ─── CURSOR ─── */
const dot=document.getElementById('cur-dot'),ring=document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});
(function anim(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(anim)})();
document.querySelectorAll('a,button').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ring.style.width='44px';ring.style.height='44px';ring.style.borderColor='rgba(200,255,0,.85)';dot.style.transform='translate(-50%,-50%) scale(2)'});
  el.addEventListener('mouseleave',()=>{ring.style.width='30px';ring.style.height='30px';ring.style.borderColor='rgba(200,255,0,.45)';dot.style.transform='translate(-50%,-50%) scale(1)'});
});

/* ─── NAV SCROLL ─── */
window.addEventListener('scroll',()=>{
  document.getElementById('main-nav').classList.toggle('scrolled',window.scrollY>40);
});

/* ─── BACKGROUND CANVAS ─── */
const bgC=document.getElementById('bg-canvas'),bx=bgC.getContext('2d');
let W,H,pts=[],stars=[];
function resize(){W=bgC.width=window.innerWidth;H=bgC.height=window.innerHeight}
resize();window.addEventListener('resize',resize);
for(let i=0;i<100;i++)stars.push({x:Math.random(),y:Math.random(),r:Math.random()*1.1,a:Math.random()});
function mkPt(){return{x:Math.random()*W,y:H+10,vx:(Math.random()-.5)*.5,vy:-(Math.random()*1.2+.4),life:1,decay:Math.random()*.005+.003,s:Math.random()*1.8+.4,c:Math.random()>.5?'acid':'plasma'}}
for(let i=0;i<50;i++){let p=mkPt();p.y=Math.random()*H;pts.push(p)}
let fr=0;
(function drawBg(){
  bx.clearRect(0,0,W,H);
  const g=bx.createRadialGradient(W*.5,H*.35,0,W*.5,H*.35,H*.85);
  g.addColorStop(0,'#0b1526');g.addColorStop(.6,'#060810');g.addColorStop(1,'#03050d');
  bx.fillStyle=g;bx.fillRect(0,0,W,H);
  stars.forEach(s=>{
    const f=s.a+Math.sin(fr*.018+s.x*8)*.25;
    bx.beginPath();bx.arc(s.x*W,s.y*H,s.r,0,Math.PI*2);
    bx.fillStyle=`rgba(255,255,255,${Math.max(0,Math.min(.9,f))})`;bx.fill();
  });
  if(fr%4===0&&pts.length<70)pts.push(mkPt());
  pts.forEach((p,i)=>{
    p.x+=p.vx;p.y+=p.vy;p.life-=p.decay;
    if(p.life<=0||p.y<-10){pts[i]=mkPt();return}
    bx.beginPath();bx.arc(p.x,p.y,p.s,0,Math.PI*2);
    bx.fillStyle=p.c==='acid'?`rgba(200,255,0,${p.life*.6})`:`rgba(0,240,255,${p.life*.6})`;
    bx.fill();
  });
  const sy=(fr*.7)%H;
  const sg=bx.createLinearGradient(0,sy-50,0,sy+50);
  sg.addColorStop(0,'transparent');sg.addColorStop(.5,'rgba(0,240,255,.02)');sg.addColorStop(1,'transparent');
  bx.fillStyle=sg;bx.fillRect(0,sy-50,W,100);
  fr++;requestAnimationFrame(drawBg);
})();

/* ─── GLOBE CANVAS (Hero right) ─── */
const gC=document.getElementById('globe-canvas');
const gx=gC.getContext('2d');
let gW,gH;
function resizeGlobe(){gW=gC.width=gC.offsetWidth;gH=gC.height=gC.offsetHeight}
resizeGlobe();window.addEventListener('resize',resizeGlobe);

const rings3d=[];
for(let i=0;i<8;i++){
  rings3d.push({
    tilt:Math.random()*Math.PI,
    phase:Math.random()*Math.PI*2,
    speed:(Math.random()-.5)*.008+.015*(i%2===0?1:-1),
    r:80+i*18,
    dots:Math.floor(Math.random()*4)+7,
    color:i%3===0?'#c8ff00':i%3===1?'#00f0ff':'rgba(255,153,0,.6)'
  });
}
const globeNodes=[];
for(let i=0;i<12;i++){
  const lat=(Math.random()-.5)*Math.PI,lon=Math.random()*Math.PI*2,r=90+Math.random()*900;
  globeNodes.push({lat,lon,r,size:Math.random()*3+7,phase:Math.random()*Math.PI*2,color:Math.random()>.5?'#c8ff00':'#00f0ff'});
}

let gfr=0;
(function drawGlobe(){
  gx.clearRect(0,0,gW,gH);
  const cx=gW/2,cy=gH/2,R=Math.min(gW,gH)*.5;
  // Outer glow
  const og=gx.createRadialGradient(cx,cy,R*.5,cx,cy,R*1.4);
  og.addColorStop(0,'rgba(200,255,0,.04)');og.addColorStop(.6,'rgba(0,240,255,.02)');og.addColorStop(1,'transparent');
  gx.fillStyle=og;gx.fillRect(0,0,gW,gH);
  // Globe base
  const bg=gx.createRadialGradient(cx-R*.2,cy-R*.2,0,cx,cy,R);
  bg.addColorStop(0,'rgba(0,240,255,.06)');bg.addColorStop(.5,'rgba(3,5,13,.4)');bg.addColorStop(1,'rgba(3,5,13,.95)');
  gx.beginPath();gx.arc(cx,cy,R,0,Math.PI*2);gx.fillStyle=bg;gx.fill();
  gx.beginPath();gx.arc(cx,cy,R,0,Math.PI*2);gx.strokeStyle='rgba(200,255,0,.2)';gx.lineWidth=4;gx.stroke();
  // Latitude lines
  for(let lat=-.8;lat<=.8;lat+=.2){
    const ry=Math.cos(lat*Math.PI*.5)*R,rx2=Math.sqrt(Math.max(0,R*R-ry*ry));
    if(rx2<2)continue;
    gx.beginPath();gx.ellipse(cx,cy+lat*R*.6,rx2,rx2*.25,0,0,Math.PI*2);
    gx.strokeStyle='rgba(0,240,255,.08)';gx.lineWidth=.5;gx.stroke();
  }
  // Longitude lines
  for(let lon=0;lon<Math.PI;lon+=Math.PI/6){
    const a=lon+gfr*.002;
    gx.beginPath();gx.ellipse(cx,cy,R*Math.abs(Math.cos(a)),R,a,0,Math.PI*2);
    gx.strokeStyle='rgba(200,255,0,.06)';gx.lineWidth=.5;gx.stroke();
  }
  // Orbiting rings
  rings3d.forEach(ring=>{
    ring.phase+=ring.speed;
    const tX=Math.cos(ring.tilt),tY=Math.sin(ring.tilt);
    const scaleR=ring.r*(R/160);
    for(let a=0;a<Math.PI*2;a+=.08){
      const nx=Math.cos(a)*scaleR,ny=Math.sin(a)*scaleR;
      const px=cx+nx,py=cy+ny*tY;
      const alpha=.15+.1*Math.sin(a+ring.phase);
      gx.beginPath();gx.arc(px,py,.8,0,Math.PI*2);
      gx.fillStyle=ring.color.replace(')',`,${alpha})`).replace('#c8ff00',`rgba(200,255,0,${alpha})`).replace('#00f0ff',`rgba(0,240,255,${alpha})`);
      gx.fill();
    }
    // Dot on ring
    ring.dots>0&&[...Array(ring.dots)].forEach((_,di)=>{
      const a=ring.phase+di*(Math.PI*2/ring.dots);
      const px=cx+Math.cos(a)*scaleR,py=cy+Math.sin(a)*scaleR*tY;
      gx.beginPath();gx.arc(px,py,2.5,0,Math.PI*2);
      gx.fillStyle=ring.color.includes('c8ff00')||ring.color.includes('200,255')?'#c8ff00':'#00f0ff';
      gx.fill();
    });
  });
  // Node points on globe surface
  globeNodes.forEach(n=>{
    const a=n.lon+gfr*.003;
    const px=cx+Math.cos(a)*Math.cos(n.lat)*R*.88;
    const py=cy+Math.sin(n.lat)*R*.88;
    const pulse=.5+.5*Math.sin(gfr*.04+n.phase);
    gx.beginPath();gx.arc(px,py,n.size*pulse,0,Math.PI*2);
    gx.fillStyle=n.color;gx.globalAlpha=.7*pulse;gx.fill();gx.globalAlpha=1;
  });
  // Center dot
  gx.beginPath();gx.arc(cx,cy,4,0,Math.PI*2);gx.fillStyle='#c8ff00';gx.fill();
  // Labels
  gx.font=`8px 'Share Tech Mono',monospace`;gx.fillStyle='rgba(200,255,0,.5)';
  gx.textAlign='center';gx.fillText('ZELEONTECH // LIVE',cx,cy+R+20);
  gfr++;requestAnimationFrame(drawGlobe);
})();

/* ─── MAP CANVAS ─── */
const mC=document.getElementById('map-canvas'),mx2=mC.getContext('2d');
const mW=500,mH=420;
const mapNodes=[
  {x:250,y:160,label:'Nyeri Town',full:true,color:'#c8ff00'},
  {x:310,y:120,label:"Ruring'u",full:true,color:'#00f0ff'},
  {x:180,y:140,label:'D. Kimathi',full:true,color:'#c8ff00'},
  {x:200,y:220,label:'Kirimara',full:true,color:'#00f0ff'},
  {x:360,y:240,label:'Karatina',full:false,color:'#ff9900'},
  {x:140,y:280,label:'Othaya',full:false,color:'rgba(255,255,255,.3)'},
];
const mapLinks=[[0,1],[0,2],[0,3],[1,3],[2,3],[0,4],[3,4]];
let mfr=0,pingPos=0;

(function drawMap(){
  mx2.clearRect(0,0,mW,mH);
  // Grid
  mx2.strokeStyle='rgba(200,255,0,.05)';mx2.lineWidth=.5;
  for(let x=0;x<mW;x+=30){mx2.beginPath();mx2.moveTo(x,0);mx2.lineTo(x,mH);mx2.stroke()}
  for(let y=0;y<mH;y+=30){mx2.beginPath();mx2.moveTo(0,y);mx2.lineTo(mW,y);mx2.stroke()}
  // Links
  mapLinks.forEach(([a,b],li)=>{
    const na=mapNodes[a],nb=mapNodes[b];
    mx2.beginPath();mx2.moveTo(na.x,na.y);mx2.lineTo(nb.x,nb.y);
    mx2.strokeStyle=na.full&&nb.full?'rgba(200,255,0,.3)':'rgba(255,153,0,.2)';
    mx2.lineWidth=1;mx2.setLineDash([4,6]);mx2.stroke();mx2.setLineDash([]);
    // Traveling ping
    if(na.full&&nb.full){
      const t=((mfr*.02+li*.3)%1);
      const px=na.x+(nb.x-na.x)*t,py=na.y+(nb.y-na.y)*t;
      mx2.beginPath();mx2.arc(px,py,2.5,0,Math.PI*2);
      mx2.fillStyle='#c8ff00';mx2.fill();
    }
  });
  // Nodes
  mapNodes.forEach(n=>{
    const pulse=.5+.5*Math.sin(mfr*.05+n.x*.05);
    // Range ring
    mx2.beginPath();mx2.arc(n.x,n.y,20+12*pulse,0,Math.PI*2);
    mx2.strokeStyle=n.color.replace(')',`,${.08*pulse})`).replace('#c8ff00',`rgba(200,255,0,${.08*pulse})`).replace('#00f0ff',`rgba(0,240,255,${.06*pulse})`);
    mx2.lineWidth=1;mx2.stroke();
    // Node circle
    mx2.beginPath();mx2.arc(n.x,n.y,7,0,Math.PI*2);
    mx2.fillStyle=n.full?n.color:'rgba(255,255,255,.1)';mx2.fill();
    mx2.strokeStyle=n.color;mx2.lineWidth=1;mx2.stroke();
    // Label
    mx2.font=`8px 'Share Tech Mono',monospace`;
    mx2.fillStyle=n.full?n.color:'rgba(255,255,255,.3)';
    mx2.textAlign='center';mx2.fillText(n.label,n.x,n.y-14);
    mx2.fillStyle=n.full?'rgba(200,255,0,.4)':'rgba(255,153,0,.4)';
    mx2.font=`7px 'Share Tech Mono',monospace`;
    mx2.fillText(n.full?'LIVE':'SOON',n.x,n.y+20);
  });
  // Corner HUD
  mx2.font=`8px 'Share Tech Mono',monospace`;
  mx2.fillStyle='rgba(200,255,0,.3)';mx2.textAlign='left';
  mx2.fillText('NYERI COUNTY // GRID MAP',10,16);
  mx2.fillStyle='rgba(255,255,255,.15)';
  mx2.fillText(`NODES: ${mapNodes.filter(n=>n.full).length} LIVE`,10,mH-10);
  mx2.textAlign='right';
  mx2.fillText(`PING: ${Math.floor(1+Math.random()*2)} MS`,mW-10,mH-10);
  mfr++;requestAnimationFrame(drawMap);
})();