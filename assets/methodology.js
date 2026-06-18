/* THE DREAM STATE — Methodology: reactive background + scroll theming */
(function(){
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  var THEMES = {
    system:  {accent:[212,175,55], glow:'#57156E'},
    persona: {accent:[232,199,102], glow:'#5B1370'},
    failure: {accent:[243,222,155], glow:'#7A1E9C'},
    funnel:  {accent:[212,175,55], glow:'#3B0A4D'},
    map:     {accent:[232,199,102], glow:'#5B1370'},
    rebuild: {accent:[243,222,155], glow:'#270030'},
    vault:   {accent:[212,175,55], glow:'#1c0026'}
  };
  function rgb(a){ return 'rgb('+a[0]+','+a[1]+','+a[2]+')'; }
  function rgba(a,al){ return 'rgba('+a[0]+','+a[1]+','+a[2]+','+al+')'; }

  var target = THEMES.system.accent.slice();
  var cur = THEMES.system.accent.slice();

  function setTheme(name){
    var t = THEMES[name] || THEMES.system;
    target = t.accent.slice();
    root.style.setProperty('--m-glow', t.glow);
    root.style.setProperty('--m-accent', rgb(t.accent));
    root.style.setProperty('--m-accent-soft', rgba(t.accent,.5));
    // motif crossfade
    document.querySelectorAll('.m-motif').forEach(function(m){
      m.classList.toggle('on', m.getAttribute('data-theme')===name);
    });
    // rail
    document.querySelectorAll('.m-rail a').forEach(function(a){
      a.classList.toggle('active', a.getAttribute('data-theme')===name);
    });
  }

  /* ---- section theme switching ---- */
  var secObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ setTheme(e.target.getAttribute('data-theme')); }
    });
  }, {rootMargin:'-45% 0px -45% 0px', threshold:0});
  document.querySelectorAll('[data-theme]').forEach(function(s){ secObs.observe(s); });

  /* ---- reveal ---- */
  var rev = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); rev.unobserve(e.target); } });
  }, {threshold:.14, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.mrise').forEach(function(el){ rev.observe(el); });

  /* ---- rail smooth scroll ---- */
  document.querySelectorAll('.m-rail a').forEach(function(a){
    a.addEventListener('click', function(ev){
      ev.preventDefault();
      var t=document.querySelector(a.getAttribute('href'));
      if(t) window.scrollTo({top:t.offsetTop, behavior:'smooth'});
    });
  });

  /* ---- constellation network canvas ---- */
  var cv=document.getElementById('m-net');
  if(cv && !reduce){
    var ctx=cv.getContext('2d'), W,H,DPR=Math.min(devicePixelRatio||1,2), nodes=[];
    function size(){ W=cv.width=innerWidth*DPR; H=cv.height=innerHeight*DPR; cv.style.width=innerWidth+'px'; cv.style.height=innerHeight+'px'; build(); }
    function build(){
      var n=Math.min(64, Math.round(innerWidth/26));
      nodes=[];
      for(var i=0;i<n;i++){
        nodes.push({ x:Math.random()*W, y:Math.random()*H,
          vx:(Math.random()-.5)*.16*DPR, vy:(Math.random()-.5)*.16*DPR,
          r:(Math.random()*1.5+.7)*DPR });
      }
    }
    size(); addEventListener('resize', size);
    var mx=-1e9,my=-1e9;
    addEventListener('mousemove', function(e){ mx=e.clientX*DPR; my=e.clientY*DPR; });
    var LINK=140*DPR;
    function frame(){
      // lerp accent
      for(var k=0;k<3;k++) cur[k]+=(target[k]-cur[k])*0.05;
      ctx.clearRect(0,0,W,H);
      var i,j,a,b,dx,dy,d;
      for(i=0;i<nodes.length;i++){
        a=nodes[i]; a.x+=a.vx; a.y+=a.vy;
        if(a.x<0||a.x>W) a.vx*=-1; if(a.y<0||a.y>H) a.vy*=-1;
        // gentle attraction to cursor
        dx=mx-a.x; dy=my-a.y; d=dx*dx+dy*dy;
        if(d<(180*DPR)*(180*DPR)){ a.x+=dx*0.0009; a.y+=dy*0.0009; }
      }
      // links
      for(i=0;i<nodes.length;i++){
        a=nodes[i];
        for(j=i+1;j<nodes.length;j++){
          b=nodes[j]; dx=a.x-b.x; dy=a.y-b.y; d=Math.sqrt(dx*dx+dy*dy);
          if(d<LINK){
            var al=(1-d/LINK)*0.5;
            ctx.strokeStyle='rgba('+(cur[0]|0)+','+(cur[1]|0)+','+(cur[2]|0)+','+al+')';
            ctx.lineWidth=DPR*0.6;
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          }
        }
      }
      // nodes
      for(i=0;i<nodes.length;i++){
        a=nodes[i];
        ctx.beginPath(); ctx.arc(a.x,a.y,a.r,0,Math.PI*2);
        ctx.fillStyle='rgba('+(cur[0]|0)+','+(cur[1]|0)+','+(cur[2]|0)+',.85)';
        ctx.shadowColor='rgba('+(cur[0]|0)+','+(cur[1]|0)+','+(cur[2]|0)+',.7)'; ctx.shadowBlur=6*DPR;
        ctx.fill();
      }
      ctx.shadowBlur=0;
      requestAnimationFrame(frame);
    }
    frame();
  }

  setTheme('system');
})();
