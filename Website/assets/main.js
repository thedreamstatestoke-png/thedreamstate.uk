/* THE DREAM STATE — interactions & signature animations */
(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- NAV ---------- */
  var nav = document.querySelector('.nav');
  function onScroll(){ if(nav) nav.classList.toggle('scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  var burger = document.querySelector('.burger');
  var mobile = document.querySelector('.mobile-menu');
  if(burger){
    burger.addEventListener('click', function(){
      nav.classList.toggle('open');
      if(mobile) mobile.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });
  }
  if(mobile){ mobile.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ nav.classList.remove('open'); mobile.classList.remove('open'); document.body.style.overflow=''; });
  }); }

  /* ---------- REVEAL ---------- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* ---------- COUNT UP ---------- */
  function animateCount(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-dec')||'0',10);
    var prefix = el.getAttribute('data-prefix')||'';
    var suffix = el.getAttribute('data-suffix')||'';
    var dur = 1700, start = null;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts-start)/dur,1);
      var eased = 1-Math.pow(1-p,3);
      var val = target*eased;
      el.textContent = prefix + val.toLocaleString('en-GB',{minimumFractionDigits:dec,maximumFractionDigits:dec}) + suffix;
      if(p<1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toLocaleString('en-GB',{minimumFractionDigits:dec,maximumFractionDigits:dec}) + suffix;
    }
    requestAnimationFrame(step);
  }
  var cio = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ animateCount(e.target); cio.unobserve(e.target); } });
  }, {threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){ cio.observe(el); });

  /* ---------- FAQ ---------- */
  document.querySelectorAll('.faq-q').forEach(function(q){
    q.addEventListener('click', function(){
      var item = q.closest('.faq-item');
      var open = item.classList.contains('open');
      // accordion within same group
      var group = item.parentElement;
      if(group){ group.querySelectorAll('.faq-item.open').forEach(function(o){ if(o!==item) o.classList.remove('open'); }); }
      item.classList.toggle('open', !open);
    });
  });

  /* ---------- IMAGE FALLBACK ---------- */
  document.querySelectorAll('img[data-fallback]').forEach(function(img){
    img.addEventListener('error', function(){
      var wrap = img.closest('.media');
      if(wrap){ wrap.classList.add('ph');
        var label = img.getAttribute('data-fallback')||'Image';
        wrap.innerHTML = '<div class="ph-label"><div class="ic">◇</div><b>'+label+'</b><span>brand photography placeholder</span></div>';
      }
    });
  });

  /* ---------- BACKGROUND CANVAS: gold dust + soft drift ---------- */
  var cv = document.getElementById('bg-canvas');
  if(cv && !reduce){
    var ctx = cv.getContext('2d'), W, H, parts=[], DPR=Math.min(window.devicePixelRatio||1,2);
    function resize(){ W=cv.width=innerWidth*DPR; H=cv.height=innerHeight*DPR; cv.style.width=innerWidth+'px'; cv.style.height=innerHeight+'px'; }
    resize(); window.addEventListener('resize', resize);
    var N = Math.min(70, Math.floor(innerWidth/22));
    for(var i=0;i<N;i++){
      parts.push({ x:Math.random()*W, y:Math.random()*H, r:(Math.random()*1.6+.4)*DPR,
        vx:(Math.random()-.5)*.12*DPR, vy:(-Math.random()*.16-.04)*DPR,
        a:Math.random()*.5+.1, tw:Math.random()*Math.PI*2 });
    }
    function draw(){
      ctx.clearRect(0,0,W,H);
      for(var i=0;i<parts.length;i++){
        var p=parts[i]; p.x+=p.vx; p.y+=p.vy; p.tw+=.02;
        if(p.y<-10){ p.y=H+10; p.x=Math.random()*W; }
        if(p.x<-10) p.x=W+10; if(p.x>W+10) p.x=-10;
        var fl=(Math.sin(p.tw)*.4+.6);
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle='rgba(212,175,55,'+(p.a*fl)+')';
        ctx.shadowColor='rgba(212,175,55,.8)'; ctx.shadowBlur=6*DPR; ctx.fill();
      }
      ctx.shadowBlur=0;
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ---------- HERO JOURNEY LINE: draws an ad→checkout path with pulsing nodes ---------- */
  var hj = document.getElementById('hero-journey');
  if(hj){
    var path = hj.querySelector('.jpath');
    if(path){
      var len = path.getTotalLength();
      path.style.strokeDasharray = len; path.style.strokeDashoffset = reduce?0:len;
      if(!reduce){
        var t0=null;
        function drawLine(ts){ if(!t0)t0=ts; var p=Math.min((ts-t0)/2600,1);
          path.style.strokeDashoffset = len*(1-(1-Math.pow(1-p,3)));
          if(p<1) requestAnimationFrame(drawLine);
        }
        requestAnimationFrame(drawLine);
      }
    }
  }

  /* ---------- MAGNETIC BUTTONS ---------- */
  if(!reduce && matchMedia('(pointer:fine)').matches){
    document.querySelectorAll('.btn-gold,.btn-light').forEach(function(b){
      b.addEventListener('mousemove', function(e){
        var r=b.getBoundingClientRect();
        b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18)+'px,'+((e.clientY-r.top-r.height/2)*.28-3)+'px)';
      });
      b.addEventListener('mouseleave', function(){ b.style.transform=''; });
    });
  }

  /* ---------- QUIZ ---------- */
  var quiz = document.querySelector('.quiz');
  if(quiz){
    var steps = quiz.querySelectorAll('.quiz-step');
    var bar = quiz.querySelector('.quiz-bar i');
    var result = quiz.querySelector('.quiz-result');
    var idx = 0, answers = {}, score = 0;
    var total = steps.length;
    function show(i){
      steps.forEach(function(s,n){ s.classList.toggle('active', n===i); });
      if(bar) bar.style.width = (((i+1)/(total+1))*100)+'%';
    }
    quiz.querySelectorAll('.quiz-opt').forEach(function(opt){
      opt.addEventListener('click', function(){
        var w = parseInt(opt.getAttribute('data-w')||'0',10);
        var key = opt.closest('.quiz-step').getAttribute('data-key');
        answers[key]=opt.textContent.trim(); score+=w;
        idx++;
        if(idx<total){ show(idx); }
        else { finish(); }
      });
    });
    function finish(){
      steps.forEach(function(s){ s.classList.remove('active'); });
      if(bar) bar.style.width='100%';
      var tier, body, cta;
      if(score>=7){ tier='Priority — book a call';
        body="Your ad spend is producing real traffic. At this level, customer-journey work pays back fastest. Based on what you've described, your site almost certainly isn't converting that traffic at the rate it should. The next step is a 30-minute discovery call — brutally honest, no commitment.";
        cta='Book the discovery call'; }
      else if(score>=4){ tier='Strong fit — start with the Audit';
        body="You're spending enough that the leaks are costing you real money every week. The 72-hour Conversion Audit shows you exactly where the journey breaks — most brands recover the cost in 4–5 weeks of saved ad spend.";
        cta='See the Audit'; }
      else { tier='Build the foundation first';
        body="You're earlier in the journey. Get the fundamentals of your customer journey right before scaling spend. Read the Methodology — it'll show you what 'done properly' actually means, and what to fix first.";
        cta='Read the Methodology'; }
      if(result){
        result.classList.add('active');
        result.querySelector('[data-r=tier]').textContent = tier;
        result.querySelector('[data-r=body]').textContent = body;
        var rc = result.querySelector('[data-r=cta]'); if(rc) rc.textContent = cta;
      }
    }
    show(0);
  }

  /* ---------- YEAR ---------- */
  var y=document.getElementById('yr'); if(y) y.textContent=new Date().getFullYear();
})();
