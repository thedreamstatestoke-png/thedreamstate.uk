/* THE DREAM STATE — About: scroll-driven Stoke sky + embers */
(function(){
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dawn=document.querySelector('.sky-dawn'),
      stars=document.querySelector('.stars'),
      skyline=document.querySelector('.skyline');

  /* ---- Potteries motif crossfade ---- */
  var motifs=document.querySelectorAll('.pot-motif');
  var secObs=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){
      var k=e.target.getAttribute('data-pot');
      motifs.forEach(function(m){ m.classList.toggle('on', m.getAttribute('data-pot')===k); });
    }});
  }, {rootMargin:'-45% 0px -45% 0px', threshold:0});
  document.querySelectorAll('[data-pot]').forEach(function(s){ secObs.observe(s); });

  /* ---- scroll: dawn breaks, skyline rises ---- */
  var y=0, raf=false;
  function apply(){
    var max=Math.max(1, document.documentElement.scrollHeight - innerHeight);
    var p=Math.max(0, Math.min(1, y/max));
    if(dawn) dawn.style.opacity = (0.15 + p*0.72).toFixed(3);
    if(stars) stars.style.opacity = (0.7*(1-p)).toFixed(3);
    if(skyline){ skyline.style.opacity=(0.22 + p*0.6).toFixed(3); skyline.style.transform='translateY('+((1-p)*40)+'px)'; }
    raf=false;
  }
  function onScroll(){ y=window.scrollY; if(!raf){ raf=true; requestAnimationFrame(apply); } }
  addEventListener('scroll', onScroll, {passive:true});
  addEventListener('resize', apply); apply();

  /* ---- ember canvas: kiln sparks rising ---- */
  var cv=document.getElementById('stoke-embers');
  if(cv && !reduce){
    var ctx=cv.getContext('2d'), W,H,DPR=Math.min(devicePixelRatio||1,2), ps=[];
    function size(){ W=cv.width=innerWidth*DPR; H=cv.height=innerHeight*DPR; cv.style.width=innerWidth+'px'; cv.style.height=innerHeight+'px'; }
    size(); addEventListener('resize', size);
    var N=Math.min(60, Math.round(innerWidth/26));
    for(var i=0;i<N;i++) ps.push(spawn(true));
    function spawn(rand){
      return { x:Math.random()*innerWidth*DPR, y:(rand?Math.random()*innerHeight:innerHeight+10)*DPR,
        r:(Math.random()*1.6+.5)*DPR, vy:-(Math.random()*.5+.2)*DPR, vx:(Math.random()-.5)*.2*DPR,
        a:Math.random()*.6+.2, tw:Math.random()*Math.PI*2, warm:Math.random()<.5 };
    }
    function draw(){
      ctx.clearRect(0,0,W,H);
      for(var i=0;i<ps.length;i++){
        var p=ps[i]; p.y+=p.vy; p.x+=p.vx; p.tw+=.04;
        if(p.y< -10) ps[i]=spawn(false);
        var fl=Math.sin(p.tw)*.4+.6;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        var col = p.warm ? '243,222,155' : '212,175,55';
        ctx.fillStyle='rgba('+col+','+(p.a*fl)+')';
        ctx.shadowColor='rgba(212,175,55,.8)'; ctx.shadowBlur=6*DPR; ctx.fill();
      }
      ctx.shadowBlur=0;
      requestAnimationFrame(draw);
    }
    draw();
  }
})();
