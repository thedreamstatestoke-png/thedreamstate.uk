/* THE DREAM STATE — Homepage
   The whole background is one scroll-scrubbed art journey: a winding gold
   road you travel down, passing detailed illustrated scenes, that ARRIVES
   at a shopfront and stops. Pure function of scroll — never loops. */
(function(){
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* reveals */
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  },{threshold:.16, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.up').forEach(function(el){ io.observe(el); });

  var cv=document.getElementById('home-field');
  if(!cv) return;
  var ctx=cv.getContext('2d'), W,H,DPR=Math.min(devicePixelRatio||1,2);
  var docH=1, scrollable=1, sy=0, syTarget=0;
  function measure(){ docH=Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); scrollable=Math.max(1, docH-innerHeight); }
  function size(){ W=cv.width=innerWidth*DPR; H=cv.height=innerHeight*DPR; cv.style.width=innerWidth+'px'; cv.style.height=innerHeight+'px'; measure(); }
  size(); addEventListener('resize', size);
  setTimeout(measure,400); setTimeout(measure,1500);
  addEventListener('scroll', function(){ syTarget=window.scrollY; }, {passive:true}); syTarget=window.scrollY;

  function roadX(docY){ return W*0.5 + Math.sin(docY*0.0011/DPR)*W*0.18 + Math.sin(docY*0.00043/DPR)*W*0.10; }

  var SHOP_AT=0.90; /* road ends here */
  var MARKS=[
    {at:0.05,type:'click'},{at:0.20,type:'crowd'},{at:0.37,type:'leak'},
    {at:0.53,type:'rebuild'},{at:0.71,type:'product'},{at:SHOP_AT,type:'store'}
  ];

  var P=[];
  (function(){ var n=reduce?70:Math.min(240, Math.round(innerWidth*0.18));
    for(var i=0;i<n;i++) P.push({ q:Math.random()*SHOP_AT, off:(Math.random()*2-1), r:Math.random()*1.4+0.6, warm:Math.random()<0.5 }); })();

  function lerp(a,b,t){return a+(b-a)*t;} function clamp(v,a,b){return v<a?a:(v>b?b:v);}

  /* gold helpers */
  function goldGrad(x0,y0,x1,y1,a){ var g=ctx.createLinearGradient(x0,y0,x1,y1);
    g.addColorStop(0,'rgba(243,222,155,'+a+')'); g.addColorStop(.5,'rgba(212,175,55,'+a+')'); g.addColorStop(1,'rgba(154,123,34,'+a+')'); return g; }
  function halo(R,a){ var g=ctx.createRadialGradient(0,0,0,0,0,R); g.addColorStop(0,'rgba(212,175,55,'+(a*0.5)+')'); g.addColorStop(1,'rgba(212,175,55,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,R,0,6.283); ctx.fill(); }

  /* ---------- detailed scene renderers ---------- */
  function drawMark(type,cx,cy,s,a){
    ctx.save(); ctx.translate(cx,cy); ctx.lineJoin='round'; ctx.lineCap='round';
    var R=s;
    if(type==='click'){
      halo(R*1.6,a);
      ctx.strokeStyle='rgba(212,175,55,'+(a*0.7)+')'; ctx.lineWidth=2*DPR;
      for(var i=0;i<3;i++){ ctx.globalAlpha=a*(1-i*0.3); ctx.beginPath(); ctx.arc(0,0,R*(0.5+i*0.28),0,6.283); ctx.stroke(); }
      ctx.globalAlpha=1;
      // cursor
      ctx.fillStyle=goldGrad(-R*0.1,-R*0.1,R*0.5,R*0.6,a);
      ctx.beginPath(); ctx.moveTo(-R*0.05,-R*0.1); ctx.lineTo(R*0.5,R*0.18); ctx.lineTo(R*0.24,R*0.26); ctx.lineTo(R*0.36,R*0.62); ctx.lineTo(R*0.2,R*0.5); ctx.lineTo(R*0.06,R*0.66); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='rgba(8,6,12,'+(a*0.7)+')'; ctx.lineWidth=1.4*DPR; ctx.stroke();
      ctx.fillStyle='rgba(243,222,155,'+a+')'; ctx.font='600 '+(R*0.26)+"px 'Space Mono',monospace"; ctx.textAlign='center'; ctx.fillText('AD CLICK',0,-R*1.15);
    }
    else if(type==='crowd'){
      halo(R*1.5,a*0.8);
      // little buyers funnelling
      ctx.fillStyle='rgba(212,175,55,'+a+')';
      for(var j=0;j<22;j++){ var t=j/22; var spread=(1-t)*R*1.5; var x=Math.sin(j*2.4)*spread; var y=lerp(-R*1.1,R*1.1,t); var rr=lerp(R*0.16,R*0.07,t);
        // head + body
        ctx.globalAlpha=a*lerp(0.5,1,t); ctx.beginPath(); ctx.arc(x,y-rr*0.7,rr*0.5,0,6.283); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x,y-rr*0.2); ctx.quadraticCurveTo(x-rr*0.7,y+rr*1.1,x,y+rr*1.2); ctx.quadraticCurveTo(x+rr*0.7,y+rr*1.1,x,y-rr*0.2); ctx.fill();
      }
      ctx.globalAlpha=1;
      ctx.fillStyle='rgba(183,174,196,'+a+')'; ctx.font=(R*0.24)+"px 'Space Mono',monospace"; ctx.textAlign='center'; ctx.fillText('TRAFFIC',0,R*1.5);
    }
    else if(type==='leak'){
      // broken road with red spill
      ctx.strokeStyle=goldGrad(-R*1.4,0,0,0,a); ctx.lineWidth=R*0.34;
      ctx.beginPath(); ctx.moveTo(-R*1.5,-R*0.6); ctx.quadraticCurveTo(-R*0.6,-R*0.1,-R*0.28,R*0.05); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(R*0.28,R*0.05); ctx.quadraticCurveTo(R*0.6,-R*0.1,R*1.5,-R*0.6); ctx.stroke();
      // crack
      ctx.strokeStyle='rgba(192,57,43,'+a+')'; ctx.lineWidth=2*DPR;
      ctx.beginPath(); ctx.moveTo(-R*0.28,R*0.05); ctx.lineTo(0,R*0.3); ctx.lineTo(R*0.28,R*0.05); ctx.stroke();
      // drips
      ctx.fillStyle='rgba(192,57,43,'+a+')';
      for(var k=0;k<4;k++){ var dx=lerp(-R*0.18,R*0.18,k/3); var dy=R*(0.4+ (k%2)*0.25);
        ctx.beginPath(); ctx.moveTo(dx,R*0.2); ctx.quadraticCurveTo(dx-R*0.07,dy, dx, dy+R*0.12); ctx.quadraticCurveTo(dx+R*0.07,dy,dx,R*0.2); ctx.fill(); }
      ctx.fillStyle='rgba(255,107,94,'+a+')'; ctx.font='600 '+(R*0.26)+"px 'Space Mono',monospace"; ctx.textAlign='center'; ctx.fillText('⚠ LEAK',0,-R*0.95);
    }
    else if(type==='rebuild'){
      halo(R*1.3,a*0.7);
      // healed road join
      ctx.strokeStyle=goldGrad(-R*1.4,0,R*1.4,0,a); ctx.lineWidth=R*0.34;
      ctx.beginPath(); ctx.moveTo(-R*1.5,R*0.5); ctx.bezierCurveTo(-R*0.4,R*0.5,-R*0.35,-R*0.15,0,-R*0.15); ctx.bezierCurveTo(R*0.35,-R*0.15,R*0.4,R*0.5,R*1.5,R*0.5); ctx.stroke();
      // weld spark
      ctx.fillStyle='rgba(243,222,155,'+a+')'; ctx.beginPath(); ctx.arc(0,-R*0.15,R*0.18,0,6.283); ctx.fill();
      ctx.strokeStyle='rgba(243,222,155,'+a+')'; ctx.lineWidth=2*DPR;
      for(var m=0;m<8;m++){ var an=m/8*6.283; ctx.beginPath(); ctx.moveTo(Math.cos(an)*R*0.3,-R*0.15+Math.sin(an)*R*0.3); ctx.lineTo(Math.cos(an)*R*0.55,-R*0.15+Math.sin(an)*R*0.55); ctx.stroke(); }
      ctx.fillStyle='rgba(212,175,55,'+a+')'; ctx.font='600 '+(R*0.24)+"px 'Space Mono',monospace"; ctx.textAlign='center'; ctx.fillText('ENGINEERED',0,R*1.15);
    }
    else if(type==='product'){
      halo(R*1.4,a*0.7);
      // hanger
      ctx.strokeStyle='rgba(212,175,55,'+a+')'; ctx.lineWidth=2*DPR;
      ctx.beginPath(); ctx.arc(0,-R*1.05,R*0.12,0,6.283); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,-R*0.93); ctx.lineTo(-R*0.7,-R*0.5); ctx.lineTo(R*0.7,-R*0.5); ctx.closePath(); ctx.stroke();
      // dress body (filled garment)
      ctx.fillStyle=goldGrad(0,-R*0.5,0,R*1.1,a*0.9);
      ctx.beginPath();
      ctx.moveTo(-R*0.5,-R*0.5); ctx.lineTo(R*0.5,-R*0.5);
      ctx.lineTo(R*0.34,-R*0.18); ctx.lineTo(R*0.7,R*1.05);
      ctx.quadraticCurveTo(0,R*1.25,-R*0.7,R*1.05);
      ctx.lineTo(-R*0.34,-R*0.18); ctx.closePath(); ctx.fill();
      // neckline + seam
      ctx.strokeStyle='rgba(8,6,12,'+(a*0.5)+')'; ctx.lineWidth=1.6*DPR;
      ctx.beginPath(); ctx.moveTo(-R*0.5,-R*0.5); ctx.quadraticCurveTo(0,-R*0.18,R*0.5,-R*0.5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,-R*0.2); ctx.lineTo(0,R*1.1); ctx.stroke();
      // price tag
      ctx.save(); ctx.translate(R*0.62,-R*0.34); ctx.rotate(0.5);
      ctx.fillStyle='rgba(243,222,155,'+a+')'; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(R*0.5,0); ctx.lineTo(R*0.62,R*0.18); ctx.lineTo(R*0.5,R*0.36); ctx.lineTo(0,R*0.36); ctx.closePath(); ctx.fill();
      ctx.fillStyle='rgba(20,12,8,'+a+')'; ctx.font='600 '+(R*0.18)+"px Inter,sans-serif"; ctx.textAlign='left'; ctx.fillText('£68',R*0.06,R*0.25);
      ctx.beginPath(); ctx.arc(R*0.1,R*0.1,R*0.04,0,6.283); ctx.fill(); ctx.restore();
    }
    else if(type==='store'){
      // SHOPFRONT — the destination. warm light + detailed building.
      var g=ctx.createRadialGradient(0,-R*0.2,0,0,-R*0.2,R*2.6);
      g.addColorStop(0,'rgba(243,222,155,'+(a*0.5)+')'); g.addColorStop(0.5,'rgba(212,175,55,'+(a*0.18)+')'); g.addColorStop(1,'rgba(212,175,55,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,-R*0.2,R*2.6,0,6.283); ctx.fill();
      var bw=R*2.0, bh=R*1.7, bx=-bw/2, by=-bh*0.55;
      // building body
      ctx.fillStyle='rgba(24,14,30,'+Math.min(1,a+0.1)+')'; ctx.strokeStyle='rgba(212,175,55,'+a+')'; ctx.lineWidth=2.2*DPR;
      ctx.beginPath(); ctx.rect(bx,by,bw,bh); ctx.fill(); ctx.stroke();
      // brick lines
      ctx.strokeStyle='rgba(212,175,55,'+(a*0.16)+')'; ctx.lineWidth=1*DPR;
      for(var br=1;br<5;br++){ var yy=by+bh*0.42*br/5+bh*0.28; if(yy<by+bh){ ctx.beginPath(); ctx.moveTo(bx,yy); ctx.lineTo(bx+bw,yy); ctx.stroke(); } }
      // sign board
      ctx.fillStyle=goldGrad(bx,by-R*0.42,bx,by-R*0.06,a); ctx.beginPath(); ctx.rect(bx+bw*0.08,by-R*0.42,bw*0.84,R*0.36); ctx.fill();
      ctx.fillStyle='rgba(20,12,8,'+a+')'; ctx.font='600 '+(R*0.2)+"px Fraunces,serif"; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('THE DREAM STATE', 0, by-R*0.24); ctx.textBaseline='alphabetic';
      // awning (scalloped stripes)
      var ay=by+R*0.02, aw=bw*0.96, ax=-aw/2, ah=R*0.34, segs=8, seg=aw/segs;
      for(var sgi=0;sgi<segs;sgi++){ ctx.fillStyle = (sgi%2===0)? 'rgba(212,175,55,'+a+')' : 'rgba(39,0,48,'+a+')';
        ctx.beginPath(); ctx.moveTo(ax+sgi*seg,ay); ctx.lineTo(ax+(sgi+1)*seg,ay); ctx.lineTo(ax+(sgi+1)*seg,ay+ah*0.6); ctx.quadraticCurveTo(ax+(sgi+0.5)*seg,ay+ah,ax+sgi*seg,ay+ah*0.6); ctx.closePath(); ctx.fill(); }
      ctx.strokeStyle='rgba(212,175,55,'+a+')'; ctx.lineWidth=1.6*DPR; ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(ax+aw,ay); ctx.stroke();
      // windows (warm glow) + door
      var wy=by+bh*0.42, wh=bh*0.5;
      ctx.fillStyle='rgba(243,222,155,'+(a*0.85)+')';
      ctx.fillRect(bx+bw*0.10,wy,bw*0.26,wh);
      ctx.fillRect(bx+bw*0.64,wy,bw*0.26,wh);
      ctx.strokeStyle='rgba(24,14,30,'+a+')'; ctx.lineWidth=2*DPR;
      ctx.strokeRect(bx+bw*0.10,wy,bw*0.26,wh); ctx.strokeRect(bx+bw*0.64,wy,bw*0.26,wh);
      ctx.beginPath(); ctx.moveTo(bx+bw*0.23,wy); ctx.lineTo(bx+bw*0.23,wy+wh); ctx.moveTo(bx+bw*0.10,wy+wh/2); ctx.lineTo(bx+bw*0.36,wy+wh/2);
      ctx.moveTo(bx+bw*0.77,wy); ctx.lineTo(bx+bw*0.77,wy+wh); ctx.moveTo(bx+bw*0.64,wy+wh/2); ctx.lineTo(bx+bw*0.90,wy+wh/2); ctx.stroke();
      // door (slightly open) with warm spill
      var dx=bx+bw*0.40, dw=bw*0.20, dy=wy, dh=bh*0.58;
      ctx.fillStyle='rgba(243,222,155,'+(a*0.6)+')'; ctx.beginPath(); ctx.moveTo(dx,by+bh); ctx.lineTo(dx-R*0.5,by+bh+R*0.5); ctx.lineTo(dx+dw+R*0.5,by+bh+R*0.5); ctx.lineTo(dx+dw,by+bh); ctx.closePath(); ctx.fill();
      ctx.fillStyle='rgba(28,16,34,'+a+')'; ctx.fillRect(dx,dy,dw,dh);
      ctx.strokeStyle='rgba(212,175,55,'+a+')'; ctx.lineWidth=2*DPR; ctx.strokeRect(dx,dy,dw,dh);
      ctx.fillStyle='rgba(243,222,155,'+a+')'; ctx.beginPath(); ctx.arc(dx+dw*0.8,dy+dh*0.5,R*0.04,0,6.283); ctx.fill();
      // OPEN sign
      ctx.fillStyle='rgba(243,222,155,'+a+')'; ctx.font='600 '+(R*0.16)+"px 'Space Mono',monospace"; ctx.textAlign='center'; ctx.fillText('OPEN', dx+dw/2, dy+dh*0.28);
      // conversion £ ping above door
      ctx.fillStyle='rgba(243,222,155,'+a+')'; ctx.font='600 '+(R*0.5)+"px Fraunces,serif"; ctx.fillText('£', 0, by-R*0.6);
    }
    ctx.restore();
  }

  function draw(){
    sy += (syTarget - sy)*0.085;
    var p = clamp(sy/scrollable,0,1);
    var bg=ctx.createLinearGradient(0,0,0,H); bg.addColorStop(0,'#0a0712'); bg.addColorStop(.5,'#0c0814'); bg.addColorStop(1,'#0a0710');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

    var gy=H*lerp(0.25,0.78,p);
    var gg=ctx.createRadialGradient(roadX(sy*DPR+H*0.5),gy,0,roadX(sy*DPR+H*0.5),gy,H*0.9);
    gg.addColorStop(0,'rgba(87,21,110,0.45)'); gg.addColorStop(.5,'rgba(39,0,48,0.22)'); gg.addColorStop(1,'rgba(10,7,16,0)');
    ctx.fillStyle=gg; ctx.fillRect(0,0,W,H);

    var topDocY=sy*DPR, roadEnd=SHOP_AT*docH*DPR;

    /* THE ROAD — stops at the shop */
    ctx.beginPath(); var started=false, lastX=0,lastY=0;
    for(var yS=-40*DPR; yS<=H+40*DPR; yS+=8*DPR){
      var dY=topDocY+yS; if(dY>roadEnd){ break; }
      var x=roadX(dY); if(!started){ ctx.moveTo(x,yS); started=true; } else ctx.lineTo(x,yS); lastX=x; lastY=yS;
    }
    if(started){
      ctx.strokeStyle='rgba(212,175,55,0.32)'; ctx.lineWidth=3.4*DPR; ctx.lineCap='round';
      ctx.shadowColor='rgba(212,175,55,0.5)'; ctx.shadowBlur=14*DPR; ctx.stroke();
      ctx.strokeStyle='rgba(212,175,55,0.07)'; ctx.lineWidth=20*DPR; ctx.shadowBlur=0; ctx.stroke();
      /* arrival cap if the road end is on screen */
      var endY=roadEnd-topDocY;
      if(endY>-40*DPR && endY<H+40*DPR){ ctx.fillStyle='rgba(243,222,155,0.9)'; ctx.beginPath(); ctx.arc(roadX(roadEnd),endY,5*DPR,0,6.283); ctx.fill(); }
    }

    /* particles along the road (before the shop) */
    for(var i=0;i<P.length;i++){ var pt=P[i]; var dY=pt.q*docH*DPR; var yS2=dY-topDocY;
      var span=SHOP_AT*docH*DPR;
      while(yS2 < -60*DPR) yS2 += span;
      if(yS2>H+60*DPR) continue;
      var dYv=topDocY+yS2; if(dYv>roadEnd) continue;
      var x2=roadX(dYv)+pt.off*22*DPR;
      var lp=clamp(dYv/(docH*DPR),0,1), near=1-clamp(Math.abs(lp-0.37)/0.05,0,1);
      var cr=Math.round(lerp(212,200,near)),cg=Math.round(lerp(175,70,near)),cb=Math.round(lerp(55,60,near));
      ctx.beginPath(); ctx.arc(x2,yS2,pt.r*DPR,0,6.283); ctx.fillStyle='rgba('+cr+','+cg+','+cb+','+(pt.warm?0.8:0.5)+')';
      ctx.shadowColor='rgba(212,175,55,0.6)'; ctx.shadowBlur=4*DPR; ctx.fill(); }
    ctx.shadowBlur=0;

    /* scenes */
    for(var m=0;m<MARKS.length;m++){ var mk=MARKS[m]; var dY=mk.at*docH*DPR; var yS3=dY-topDocY;
      if(yS3<-H*0.9||yS3>H*1.9) continue;
      var prox=1-clamp(Math.abs(yS3-H*0.5)/(H*0.85),0,1);
      var s=lerp(Math.min(W,H)*0.085, Math.min(W,H)*0.20, prox);
      var a=lerp(0.10,0.92,prox*prox);
      drawMark(mk.type, roadX(dY), yS3, s, a);
    }

    /* readability scrim */
    var sc=ctx.createLinearGradient(0,0,0,H);
    sc.addColorStop(0,'rgba(8,6,12,0.42)'); sc.addColorStop(.45,'rgba(8,6,12,0.1)'); sc.addColorStop(.55,'rgba(8,6,12,0.1)'); sc.addColorStop(1,'rgba(8,6,12,0.5)');
    ctx.fillStyle=sc; ctx.fillRect(0,0,W,H);
    requestAnimationFrame(draw);
  }
  draw();
})();
