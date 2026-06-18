/* THE DREAM STATE — How We Work: mechanical scroll system */
(function(){
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* station + dayruler reveals */
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); } });
  }, {threshold:.22, rootMargin:'0px 0px -10% 0px'});
  document.querySelectorAll('.station, .dayruler, .reveal').forEach(function(el){ io.observe(el); });

  if(reduce) return;

  var gears = [].slice.call(document.querySelectorAll('.gear-layer svg'));
  var asm = document.querySelector('.assembly');
  var fill = document.querySelector('.spine-fill');
  var carriage = document.querySelector('.carriage');
  var y=0, raf=false;

  function update(){
    // gears spin with scroll
    for(var i=0;i<gears.length;i++){
      var dir = (i%2===0)? 1 : -1;
      var spd = 0.05 + i*0.012;
      gears[i].style.transform = 'rotate('+(y*spd*dir)+'deg)';
    }
    // assembly spine progress
    if(asm && fill){
      var rect = asm.getBoundingClientRect();
      var p = Math.max(0, Math.min(1, (innerHeight*0.5 - rect.top) / rect.height));
      fill.style.height = (p*100)+'%';
      if(carriage) carriage.style.top = (p*100)+'%';
    }
    raf=false;
  }
  function onScroll(){ y=window.scrollY; if(!raf){ raf=true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', update);
  update();
})();
