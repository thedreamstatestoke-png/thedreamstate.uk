/* THE DREAM STATE — Packages: flow-field background + revenue→tier matcher */
(function(){
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* reveals */
  var rev=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); rev.unobserve(e.target); } });
  },{threshold:.14, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){ rev.observe(el); });

  /* revenue selector → highlight matching build tier */
  var opts=document.querySelectorAll('.selopt');
  var tiers=document.querySelectorAll('.tier');
  function match(key){
    opts.forEach(function(o){ o.classList.toggle('active', o.getAttribute('data-match')===key); });
    tiers.forEach(function(t){ t.classList.toggle('match', t.getAttribute('data-tier')===key); });
  }
  opts.forEach(function(o){ o.addEventListener('click', function(){ match(o.getAttribute('data-match')); }); });
  if(opts.length) match('growth');

  /* ---------- FLOW-FIELD BACKGROUND ---------- */
  var cv=document.getElementById('pr-flow');
  if(cv && !reduce){
    var ctx=cv.getContext('2d'), W,H,DPR=Math.min(devicePixelRatio||1,2), parts=[], t=0;
    var mouse={x:-1e9,y:-1e9};
    function size(){ W=cv.width=innerWidth*DPR; H=cv.height=innerHeight*DPR; cv.style.width=innerWidth+'px'; cv.style.height=innerHeight+'px'; ctx.fillStyle='#08070a'; ctx.fillRect(0,0,W,H); }
    size(); addEventListener('resize', size);
    addEventListener('mousemove', function(e){ mouse.x=e.clientX*DPR; mouse.y=e.clientY*DPR; }, {passive:true});
    addEventListener('mouseout', function(){ mouse.x=mouse.y=-1e9; });
    var N=Math.min(460, Math.round(innerWidth*0.34));
    function spawn(){ var p={ x:Math.random()*W, y:Math.random()*H, px:0, py:0, life:Math.random()*220+90, warm:Math.random()<0.45 }; p.px=p.x; p.py=p.y; return p; }
    for(var i=0;i<N;i++) parts.push(spawn());
    function field(x,y){
      var s=0.0015;
      return (Math.sin(x*s + t) * Math.cos(y*s*1.12 - t*0.8)
            + Math.sin((x+y)*s*0.55 + t*0.5)) * Math.PI;
    }
    function frame(){
      t+=0.0016;
      ctx.fillStyle='rgba(8,7,10,0.05)'; ctx.fillRect(0,0,W,H);
      for(var i=0;i<parts.length;i++){
        var p=parts[i];
        var a=field(p.x,p.y), sp=1.15*DPR;
        var vx=Math.cos(a)*sp, vy=Math.sin(a)*sp - 0.34*DPR; /* upward bias = rising */
        var dx=p.x-mouse.x, dy=p.y-mouse.y, d2=dx*dx+dy*dy, R=170*DPR;
        if(d2 < R*R){ var d=Math.sqrt(d2)||1, f=(1-d/R)*1.8*DPR; vx += (-dy/d)*f; vy += (dx/d)*f; }
        p.px=p.x; p.py=p.y; p.x+=vx; p.y+=vy; p.life--;
        if(p.life<0 || p.x<-5||p.x>W+5||p.y<-5||p.y>H+5){ parts[i]=spawn(); continue; }
        ctx.beginPath(); ctx.moveTo(p.px,p.py); ctx.lineTo(p.x,p.y);
        ctx.strokeStyle = p.warm ? 'rgba(243,222,155,0.20)' : 'rgba(212,175,55,0.20)';
        ctx.lineWidth=DPR*0.9; ctx.stroke();
      }
      requestAnimationFrame(frame);
    }
    frame();
  }
})();
