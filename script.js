// Minimal, elegant interactivity for the Valentine page.
// - Yes button evades pointer/touch
// - No button reveals a calm celebration
// - Soft decorative particles are created and animated

document.addEventListener('DOMContentLoaded', () => {
  const stage = document.getElementById('stage');
  const decor = document.getElementById('decor');
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const hint = document.getElementById('hint');
  const reveal = document.getElementById('reveal');
  const closeReveal = document.getElementById('closeReveal');

  // entrance
  requestAnimationFrame(()=> document.querySelector('.card').classList.add('enter'));

  // create some soft floating particles (hearts/petals)
  function makeParticle(kind){
    const el = document.createElement('div');
    el.className = 'particle ' + kind;
    // random position across width, start near bottom
    const left = Math.random() * 100;
    const bottom = - (Math.random()*6);
    el.style.left = left + 'vw';
    el.style.bottom = bottom + 'vh';
    el.style.setProperty('--dur', (12 + Math.random()*12) + 's');
    // subtle random scale & rotation
    el.style.transform = `translate3d(0,0,0) rotate(${Math.random()*360}deg) scale(${0.8 + Math.random()*0.6})`;
    decor.appendChild(el);
    // remove old ones if too many
    if(decor.children.length > 40) decor.removeChild(decor.firstChild);
    return el;
  }

  // initial particles
  for(let i=0;i<9;i++){
    makeParticle(i%2? 'petal':'heart');
  }

  // evading YES button behavior
  let tries = 0;
  let lastPos = {x:0,y:0};
  const margin = 18; // px margin from edges

  function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

  function moveYesAway(clientX, clientY){
    const rect = btnYes.getBoundingClientRect();
    const stageRect = document.body.getBoundingClientRect();
    // center of button
    const bx = rect.left + rect.width/2;
    const by = rect.top + rect.height/2;

    // vector from pointer to button center
    const vx = bx - clientX;
    const vy = by - clientY;
    const dist = Math.hypot(vx, vy) || 1;

    // compute displacement magnitude: grows slightly with tries
    const base = 72 + Math.min(tries * 18, 140);
    // normalized vector away
    const nx = vx / dist;
    const ny = vy / dist;

    // target center
    let tx = bx + nx * base;
    let ty = by + ny * (base * 0.6);

    // ensure button stays within viewport (with margin)
    tx = clamp(tx, margin + rect.width/2, window.innerWidth - margin - rect.width/2);
    ty = clamp(ty, margin + rect.height/2, window.innerHeight - margin - rect.height/2);

    // compute CSS translate relative to its original container (position absolute via transform)
    const parentRect = btnYes.offsetParent ? btnYes.offsetParent.getBoundingClientRect() : {left:0,top:0};
    const curTransform = btnYes.style.transform || 'translate3d(0px,0px,0px)';
    // animate with transform to new center
    const translateX = tx - (rect.left + rect.width/2);
    const translateY = ty - (rect.top + rect.height/2);

    // visually tease with rotation & scale
    const rot = (Math.random()*8 - 4) * (tries>3 ? 1.6 : 1);
    const scale = 1 + (Math.min(tries, 6) * 0.02);

    btnYes.style.transition = 'transform 450ms cubic-bezier(.22,.9,.32,1)';
    btnYes.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rot}deg) scale(${scale})`;

    tries++;
    // hint micro-text updates
    const hints = ['Almost.', 'Not yet.', 'Hmm…', 'Soon?', 'Keep trying.'];
    hint.textContent = hints[Math.min(tries-1, hints.length-1)];
  }

  // avoid clicks (safety)
  btnYes.addEventListener('click', (e)=> {
    e.preventDefault();
    e.stopPropagation();
    // small nudge back to avoid accidental acceptance
    hint.textContent = 'Not this time.';
  });

  // pointer detection (desktop)
  let pointerActive = false;
  document.addEventListener('pointermove', (ev) => {
    // if pointer is close to the YES button, nudge it away
    const rect = btnYes.getBoundingClientRect();
    const dx = ev.clientX - (rect.left + rect.width/2);
    const dy = ev.clientY - (rect.top + rect.height/2);
    const d = Math.hypot(dx, dy);
    // threshold scales with window
    const thresh = Math.max(70, Math.min(window.innerWidth * 0.18, 160));
    if(d < thresh){
      moveYesAway(ev.clientX, ev.clientY);
      pointerActive = true;
    } else {
      pointerActive = false;
    }
  });

  // touch support (mobile)
  document.addEventListener('touchstart', (ev) => {
    if(ev.touches && ev.touches[0]){
      const t = ev.touches[0];
      // if user touches YES area, move it away
      const rect = btnYes.getBoundingClientRect();
      if(t.clientX >= rect.left - 10 && t.clientX <= rect.right + 10 &&
         t.clientY >= rect.top - 10 && t.clientY <= rect.bottom + 10){
        // perform several quick evasions to be graceful on touch
        moveYesAway(t.clientX, t.clientY);
        setTimeout(()=> moveYesAway(t.clientX + 30, t.clientY + 10), 180);
      }
    }
  }, {passive:true});

  // NO button reveal action
  btnNo.addEventListener('click', () => {
    // soft reveal: add class, show overlay, enrich decor
    stage.classList.add('revealed');
    reveal.classList.add('visible');
    // gently increase decorative elements
    for(let i=0;i<12;i++){
      setTimeout(()=> makeParticle(i%2? 'heart':'petal'), i*70);
    }
    // mild background tone shift handled by CSS class
    // focus close button for accessibility
    const close = document.getElementById('closeReveal');
    close && close.focus();
  });

  closeReveal.addEventListener('click', () => {
    reveal.classList.remove('visible');
    stage.classList.remove('revealed');
    hint.textContent = '';
  });

  // Accessibility: keyboard safety for Yes (prevent Enter)
  btnYes.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      hint.textContent = 'Try another way.';
    }
  });

  // warming: on resize, nudge yes back to center occasionally
  window.addEventListener('resize', ()=> {
    btnYes.style.transition = 'transform 380ms cubic-bezier(.22,.9,.32,1)';
    btnYes.style.transform = 'translate3d(0,0,0) rotate(0deg) scale(1)';
  });

  // keep the UI calm: periodically spawn slow particles
  setInterval(()=> makeParticle(Math.random()>0.5?'heart':'petal'), 1800);
});