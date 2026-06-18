/* THE DREAM STATE — Journal page: cards, filter, scroll scene, iframe reader */
(function(){
  'use strict';
  var A = window.TDS_ARTICLES || [];
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var grid = document.getElementById('blogGrid');
  var empty = document.getElementById('blogEmpty');

  /* ---------- category visual themes ---------- */
  var THEMES = {
    journey:{c1:'#3b0a4d',c2:'#160f1e'},
    leaks:{c1:'#2a0838',c2:'#120e18'},
    upgrade:{c1:'#43124f',c2:'#1a1022'},
    ai:{c1:'#34104a',c2:'#130d1c'},
    convert:{c1:'#2d0a3a',c2:'#140e1d'},
    copy:{c1:'#3a0b46',c2:'#171019'},
    strategy:{c1:'#270030',c2:'#0f0b14'}
  };

  function motif(cat){
    var G='#D4AF37', G2='#F3DE9B', M='rgba(247,242,233,.22)';
    switch(cat){
      case 'journey': return '<path d="M6 54 C 26 54, 30 34, 50 34 S 74 14, 96 16" fill="none" stroke="'+G+'" stroke-width="1.6" stroke-linecap="round"/><circle cx="30" cy="44" r="2.4" fill="'+G+'"/><circle cx="50" cy="34" r="2.4" fill="'+G2+'"/><circle cx="78" cy="18" r="3" fill="'+G2+'"/>';
      case 'leaks': return '<circle cx="34" cy="30" r="15" fill="none" stroke="'+M+'" stroke-width="1.6"/><line x1="45" y1="41" x2="60" y2="56" stroke="'+M+'" stroke-width="2"/><path d="M72 14 C 72 26, 64 28, 64 36 a8 8 0 1 0 16 0 c0 -8 -8 -10 -8 -22 z" fill="'+G+'" opacity=".9"/>';
      case 'upgrade': return '<rect x="20" y="40" width="10" height="20" rx="2" fill="'+M+'"/><rect x="38" y="30" width="10" height="30" rx="2" fill="'+G+'" opacity=".7"/><rect x="56" y="18" width="10" height="42" rx="2" fill="'+G2+'"/><path d="M70 18 l8 -6 -2 7 z" fill="'+G2+'"/>';
      case 'ai': return '<g stroke="'+G+'" stroke-width="1.2" opacity=".85"><line x1="24" y1="22" x2="50" y2="36"/><line x1="50" y1="36" x2="40" y2="56"/><line x1="50" y1="36" x2="76" y2="26"/><line x1="76" y1="26" x2="78" y2="50"/></g><circle cx="24" cy="22" r="3" fill="'+G2+'"/><circle cx="50" cy="36" r="3.6" fill="'+G+'"/><circle cx="40" cy="56" r="2.6" fill="'+G+'"/><circle cx="76" cy="26" r="2.6" fill="'+G2+'"/><circle cx="78" cy="50" r="2.6" fill="'+G+'"/>';
      case 'convert': return '<path d="M22 16 H82 L62 40 V58 L42 50 V40 Z" fill="none" stroke="'+M+'" stroke-width="1.6"/><path d="M22 16 H82 L64 38 H40 Z" fill="'+G+'" opacity=".18"/><circle cx="52" cy="56" r="6" fill="'+G+'"/><text x="52" y="59.5" text-anchor="middle" font-family="Fraunces,serif" font-size="7" fill="#1c0024">£</text>';
      case 'copy': return '<text x="14" y="58" font-family="Fraunces,serif" font-size="64" fill="'+G+'" opacity=".55">&#8220;</text><text x="52" y="58" font-family="Fraunces,serif" font-size="64" fill="'+M+'">&#8221;</text>';
      case 'strategy': return '<circle cx="52" cy="35" r="24" fill="none" stroke="'+M+'" stroke-width="1.4"/><circle cx="52" cy="35" r="15" fill="none" stroke="'+G+'" stroke-width="1.4" opacity=".8"/><circle cx="52" cy="35" r="6" fill="none" stroke="'+G2+'" stroke-width="1.4"/><circle cx="52" cy="35" r="2.6" fill="'+G2+'"/>';
      default: return '';
    }
  }

  function artSVG(cat, idx){
    var t = THEMES[cat] || THEMES.journey;
    var id = 'bg'+idx;
    return '<svg viewBox="0 0 104 70" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
      + '<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+t.c1+'"/><stop offset="1" stop-color="'+t.c2+'"/></linearGradient></defs>'
      + '<rect width="104" height="70" fill="url(#'+id+')"/>'
      + '<circle cx="86" cy="14" r="26" fill="rgba(212,175,55,.06)"/>'
      + motif(cat) + '</svg>';
  }

  /* ---------- render cards ---------- */
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.1, rootMargin:'0px 0px -6% 0px'});

  function render(filter){
    grid.innerHTML='';
    var n=0;
    A.forEach(function(a, i){
      if(filter && filter!=='all' && a.cat!==filter) return;
      n++;
      var card=document.createElement('article');
      card.className='bcard'+((filter==='all'||!filter) && i===0 ? ' feat':'');
      card.setAttribute('data-i', i);
      card.innerHTML =
        '<div class="bcard-art">'+artSVG(a.cat,i)
          +'<span class="num">'+String(i+1).padStart(2,'0')+'</span>'
          +'<span class="rd">'+a.read+'</span></div>'
        +'<div class="bcard-body">'
          +'<span class="cat">'+a.catLabel+'</span>'
          +'<h3>'+a.title+'</h3>'
          +'<p>'+a.dek+'</p>'
          +'<span class="read-link">Read it <span class="arw">&rarr;</span></span>'
        +'</div>';
      card.addEventListener('click', function(){ openReader(i); });
      grid.appendChild(card);
      if(reduce){ card.classList.add('in'); } else { io.observe(card); }
    });
    empty.style.display = n? 'none':'block';
  }

  /* ---------- filter chips ---------- */
  document.querySelectorAll('.fchip').forEach(function(chip){
    chip.addEventListener('click', function(){
      document.querySelectorAll('.fchip').forEach(function(c){ c.classList.remove('active'); });
      chip.classList.add('active');
      render(chip.getAttribute('data-cat'));
      window.scrollTo({top: document.getElementById('grid-top').offsetTop-90, behavior:'smooth'});
    });
  });

  /* ---------- iframe reader ---------- */
  var reader=document.getElementById('reader');
  var frame=document.getElementById('readerFrame');
  var current=-1;
  var base=location.href.replace(/[^\/]*$/,''); // .../Website/

  function readerDoc(a, idx){
    var cta = base+'contact.html';
    var quiz = base+'quiz.html';
    return '<!doctype html><html lang="en-GB"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">'
    +'<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
    +'<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500&family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">'
    +'<style>'
    +':root{--gold:#D4AF37;--gold2:#E8C766;--gold3:#F3DE9B;--purple:#270030;--ink:#0c0810;--cream:#F7F2E9;--mist:#b9b1c4;--line:rgba(212,175,55,.18)}'
    +'*{margin:0;padding:0;box-sizing:border-box}'
    +'html{scroll-behavior:smooth}'
    +'body{background:#0c0810;color:var(--cream);font-family:Inter,sans-serif;line-height:1.75}'
    +'::selection{background:var(--gold);color:#1a0020}'
    +'.r-hero{position:relative;height:300px;overflow:hidden;border-bottom:1px solid var(--line)}'
    +'.r-hero svg{position:absolute;inset:0;width:100%;height:100%}'
    +'.r-hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(12,8,16,.1),rgba(12,8,16,.92))}'
    +'.r-hero-cap{position:absolute;left:0;right:0;bottom:0;padding:34px clamp(24px,6vw,64px);z-index:2}'
    +'.r-hero-cap .cat{font-family:"Space Mono",monospace;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold3)}'
    +'.r-hero-cap h1{font-family:Fraunces,serif;font-weight:340;color:#fff;font-size:clamp(1.7rem,4.4vw,2.9rem);line-height:1.08;margin-top:.5rem;max-width:20ch}'
    +'.r-wrap{max-width:680px;margin:0 auto;padding:clamp(32px,5vw,56px) clamp(22px,5vw,32px) 80px}'
    +'.r-wrap p{font-size:1.1rem;margin-bottom:1.5rem;color:#e9e3d6}'
    +'.r-wrap p.drop::first-letter{font-family:Fraunces,serif;font-size:3.8rem;float:left;line-height:.8;padding:.08em .12em 0 0;color:var(--gold2)}'
    +'.r-wrap h2{font-family:Fraunces,serif;font-weight:360;color:#fff;font-size:1.55rem;margin:2.4rem 0 1rem}'
    +'.r-wrap h3{font-family:Fraunces,serif;color:var(--gold2);font-size:1.15rem;margin:1.8rem 0 .6rem}'
    +'.r-wrap blockquote{border-left:2px solid var(--gold);padding:.5rem 0 .5rem 1.6rem;margin:2rem 0;font-family:Fraunces,serif;font-style:italic;font-size:1.45rem;line-height:1.4;color:#fff}'
    +'.r-wrap ul{list-style:none;margin:0 0 1.6rem .2rem}'
    +'.r-wrap li{position:relative;padding-left:1.7em;margin-bottom:.7rem;color:#e9e3d6}'
    +'.r-wrap li::before{content:"\\2726";position:absolute;left:0;color:var(--gold)}'
    +'.r-wrap b{color:#fff}'
    +'.r-cta{margin-top:3rem;border:1px solid var(--line);border-radius:20px;padding:clamp(28px,5vw,44px);text-align:center;position:relative;overflow:hidden;background:linear-gradient(150deg,#1a0c22,#0c0810)}'
    +'.r-cta::before{content:"";position:absolute;inset:0;background:radial-gradient(40% 60% at 80% 0%,rgba(212,175,55,.16),transparent 60%)}'
    +'.r-cta>*{position:relative}'
    +'.r-cta .e{font-family:"Space Mono",monospace;font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold)}'
    +'.r-cta h3{font-family:Fraunces,serif;color:#fff;font-size:1.7rem;margin:.6rem 0 .5rem}'
    +'.r-cta p{font-size:1rem;color:var(--mist);max-width:42ch;margin:0 auto 1.6rem}'
    +'.r-cta .btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}'
    +'.r-btn{display:inline-flex;align-items:center;gap:.5em;font-family:Inter,sans-serif;font-weight:600;font-size:.95rem;padding:.95rem 1.7rem;border-radius:100px;cursor:pointer;text-decoration:none;transition:transform .3s}'
    +'.r-btn.gold{background:linear-gradient(105deg,var(--gold),var(--gold2));color:#1c0024}'
    +'.r-btn.ghost{border:1px solid var(--line);color:var(--gold2)}'
    +'.r-btn:hover{transform:translateY(-2px)}'
    +'</style></head><body>'
    +'<div class="r-hero">'+artSVG(a.cat, 'r'+idx)+'<div class="r-hero-cap"><span class="cat">'+a.catLabel+' &middot; '+a.read+' read</span><h1>'+a.title+'</h1></div></div>'
    +'<div class="r-wrap">'+a.body
      +'<div class="r-cta"><span class="e">The Dream State</span><h3>Is this happening on your store?</h3>'
      +'<p>If any of this hit a nerve, that’s a leak you can see and fix. Book a 30-minute call and we’ll read your journey live — brutally honest, no hard sell.</p>'
      +'<div class="btns"><a class="r-btn gold" target="_top" href="'+cta+'">Book a discovery call &rarr;</a><a class="r-btn ghost" target="_top" href="'+quiz+'">Take the 2-min diagnostic</a></div></div>'
    +'</div></body></html>';
  }

  function openReader(i){
    current=i;
    frame.srcdoc = readerDoc(A[i], i);
    reader.classList.add('open');
    document.body.classList.add('reader-lock');
    var rt=document.getElementById('readerTotal'); if(rt) rt.textContent = (i+1)+' / '+A.length;
  }
  function closeReader(){ reader.classList.remove('open'); document.body.classList.remove('reader-lock'); setTimeout(function(){ frame.srcdoc=''; },400); }
  function step(d){ var n=(current+d+A.length)%A.length; openReader(n); var sh=document.querySelector('.reader-shell'); if(sh) sh.scrollTop=0; }

  document.getElementById('readerClose').addEventListener('click', closeReader);
  document.getElementById('readerPrev').addEventListener('click', function(){ step(-1); });
  document.getElementById('readerNext').addEventListener('click', function(){ step(1); });
  document.querySelector('.reader-backdrop').addEventListener('click', closeReader);
  document.addEventListener('keydown', function(e){
    if(!reader.classList.contains('open')) return;
    if(e.key==='Escape') closeReader();
    if(e.key==='ArrowRight') step(1);
    if(e.key==='ArrowLeft') step(-1);
  });

  /* ---------- scroll-reactive background ---------- */
  if(!reduce){
    var layers=[].slice.call(document.querySelectorAll('[data-par]'));
    var ty=0, raf=false;
    function apply(){
      layers.forEach(function(el){
        var p=parseFloat(el.getAttribute('data-par'));
        var rot=parseFloat(el.getAttribute('data-rot')||'0');
        el.style.transform='translate3d(0,'+(ty*p)+'px,0) rotate('+(ty*rot)+'deg)';
      });
      raf=false;
    }
    window.addEventListener('scroll', function(){ ty=window.scrollY; if(!raf){ raf=true; requestAnimationFrame(apply); } }, {passive:true});
    apply();
  }

  /* ---------- init ---------- */
  render('all');
})();
