/* THE DREAM STATE — Case Studies: the Drag-to-Rebuild console */
(function(){
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- reveals ---------- */
  var rev = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); rev.unobserve(e.target); } });
  }, {threshold:.16, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.csr, .case-tile').forEach(function(el){ rev.observe(el); });

  /* ---------- count-ups ---------- */
  function countUp(el){
    var t=parseFloat(el.getAttribute('data-count')), dec=parseInt(el.getAttribute('data-dec')||'0',10),
        pre=el.getAttribute('data-prefix')||'', suf=el.getAttribute('data-suffix')||'', dur=1600, s=null;
    function step(ts){ if(!s)s=ts; var p=Math.min((ts-s)/dur,1), e=1-Math.pow(1-p,3);
      el.textContent=pre+(t*e).toLocaleString('en-GB',{minimumFractionDigits:dec,maximumFractionDigits:dec})+suf;
      if(p<1) requestAnimationFrame(step); else el.textContent=pre+t.toLocaleString('en-GB',{minimumFractionDigits:dec,maximumFractionDigits:dec})+suf; }
    requestAnimationFrame(step);
  }
  var cObs=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ countUp(e.target); cObs.unobserve(e.target); } }); },{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){ cObs.observe(el); });

  /* ---------- THE REBUILD CONSOLE ---------- */
  var rb=document.getElementById('rebuild');
  if(!rb) return;
  var gold=document.getElementById('rbGold'),
      broken=document.getElementById('rbBroken'),
      leaks=document.getElementById('rbLeaks'),
      flow=document.getElementById('rbFlow'),
      drips=document.getElementById('rbDrips'),
      nodesGold=document.getElementById('rbNodesGold'),
      num=document.getElementById('rbNum'),
      state=document.getElementById('rbState'),
      gauge=document.getElementById('rbGaugeFill'),
      fill=document.getElementById('rbFill'),
      handle=document.getElementById('rbHandle'),
      track=document.getElementById('rbTrack');
  var goldLen = gold ? gold.getTotalLength() : 100;
  if(gold){ gold.style.strokeDasharray=goldLen; }
  var p=0;

  function fmt(n){ return Math.round(n).toLocaleString('en-GB'); }
  function setP(v, fromUser){
    p=Math.max(0,Math.min(1,v));
    if(gold) gold.style.strokeDashoffset = goldLen*(1-p);
    if(broken) broken.style.opacity = (1-p);
    if(leaks) leaks.style.opacity = (1-p);
    if(drips) drips.style.opacity = (1-p);
    if(flow) flow.style.opacity = Math.max(0,(p-0.35)/0.65);
    if(nodesGold) nodesGold.style.opacity = p;
    if(num) num.textContent = fmt(p*1045000);
    if(gauge) gauge.style.width = (p*100)+'%';
    if(fill) fill.style.width = (p*100)+'%';
    if(handle) handle.style.left = (p*100)+'%';
    if(state){
      var t = p<0.1 ? 'Before · journey leaking' : (p>0.92 ? 'After · engineered to convert' : 'Rebuilding the journey…');
      state.innerHTML = '<span class="pip"></span>'+t;
    }
    rb.classList.toggle('done', p>0.96);
    if(fromUser) rb.classList.add('touched');
  }

  /* drag */
  var dragging=false;
  function pFromX(clientX){ var r=track.getBoundingClientRect(); return (clientX-r.left)/r.width; }
  function down(e){ dragging=true; rb.classList.add('touched'); track.setPointerCapture&&track.setPointerCapture(e.pointerId); setP(pFromX(e.clientX), true); }
  function move(e){ if(dragging) setP(pFromX(e.clientX), true); }
  function up(){ dragging=false; }
  track.addEventListener('pointerdown', down);
  track.addEventListener('pointermove', move);
  track.addEventListener('pointerup', up);
  track.addEventListener('pointercancel', up);
  // keyboard
  handle.setAttribute('tabindex','0');
  handle.addEventListener('keydown', function(e){
    if(e.key==='ArrowRight'||e.key==='ArrowUp'){ setP(p+0.05,true); e.preventDefault(); }
    if(e.key==='ArrowLeft'||e.key==='ArrowDown'){ setP(p-0.05,true); e.preventDefault(); }
  });
  // replay
  var replay=document.getElementById('rbReplay');
  if(replay) replay.addEventListener('click', function(){ rb.classList.remove('touched'); demo(); });

  /* auto-demo on first view */
  function demo(){
    if(reduce){ setP(1); return; }
    var t0=null, dur=2600;
    function step(ts){ if(!t0)t0=ts; var k=Math.min((ts-t0)/dur,1); var e=1-Math.pow(1-k,3);
      if(rb.classList.contains('touched')) return; // user grabbed it
      setP(e);
      if(k<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var seen=false;
  var dObs=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting && !seen){ seen=true; setTimeout(demo,400); } });
  },{threshold:.4});
  dObs.observe(rb);

  setP(0);
})();
