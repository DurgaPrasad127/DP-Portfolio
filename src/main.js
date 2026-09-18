import './style.css';

document.getElementById('yr').textContent = new Date().getFullYear();

  // nav toggle
  const navtoggle = document.getElementById('navtoggle');
  const navlinks = document.getElementById('navlinks');
  navtoggle.addEventListener('click', () => navlinks.classList.toggle('open'));
  navlinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navlinks.classList.remove('open')));

  // reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  reveals.forEach(el => io.observe(el));

  // ---------- neural network hero canvas ----------
  (function(){
    const canvas = document.getElementById('netcanvas');
    const ctx = canvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w, h, nodes, mouse = {x:null, y:null};
    const hero = document.querySelector('.hero');

    function resize(){
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
      const count = Math.max(28, Math.min(70, Math.floor((w*h)/22000)));
      nodes = Array.from({length: count}, () => ({
        x: Math.random()*w,
        y: Math.random()*h,
        vx: (Math.random()-0.5)*0.28,
        vy: (Math.random()-0.5)*0.28,
        r: Math.random()*1.6+1
      }));
    }
    window.addEventListener('resize', resize);
    resize();

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    const maxDist = 150;

    function frame(){
      ctx.clearRect(0,0,w,h);
      for(const n of nodes){
        n.x += n.vx; n.y += n.vy;
        if(n.x < 0 || n.x > w) n.vx *= -1;
        if(n.y < 0 || n.y > h) n.vy *= -1;
      }
      // connections
      for(let i=0;i<nodes.length;i++){
        for(let j=i+1;j<nodes.length;j++){
          const a = nodes[i], b = nodes[j];
          const dx = a.x-b.x, dy = a.y-b.y;
          const dist = Math.sqrt(dx*dx+dy*dy);
          if(dist < maxDist){
            const op = (1 - dist/maxDist) * 0.5;
            ctx.strokeStyle = `rgba(77,216,255,${op})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
            ctx.stroke();
          }
        }
        if(mouse.x !== null){
          const dx = nodes[i].x-mouse.x, dy = nodes[i].y-mouse.y;
          const dist = Math.sqrt(dx*dx+dy*dy);
          if(dist < 190){
            const op = (1 - dist/190) * 0.8;
            ctx.strokeStyle = `rgba(167,139,250,${op})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(mouse.x,mouse.y);
            ctx.stroke();
          }
        }
      }
      // nodes
      for(const n of nodes){
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(233,237,246,0.75)';
        ctx.fill();
      }
      if(!reducedMotion) requestAnimationFrame(frame);
    }
    frame();
  })();
