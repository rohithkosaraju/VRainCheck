document.addEventListener("DOMContentLoaded", () => {
  const btnYes = document.getElementById("btnYes");
  const btnNo = document.getElementById("btnNo");
  const hint = document.getElementById("hint");
  const decor = document.getElementById("decor");
  const reveal = document.getElementById("reveal");
  const closeReveal = document.getElementById("closeReveal");

  let tries = 0;
  let noHover = 0;

  function makeParticle() {
    const p = document.createElement("div");
    p.className = "particle heart";
    p.style.left = Math.random() * 100 + "vw";
    p.style.bottom = "-10px";
    p.style.setProperty("--dur", 10 + Math.random() * 10 + "s");
    decor.appendChild(p);
    setTimeout(() => p.remove(), 20000);
  }

  setInterval(makeParticle, 1600);

  function moveYes(x, y) {
    const rect = btnYes.getBoundingClientRect();
    const dx = rect.left + rect.width / 2 - x;
    const dy = rect.top + rect.height / 2 - y;
    const dist = Math.hypot(dx, dy) || 1;

    const move = 80 + tries * 14;
    const tx = (dx / dist) * move;
    const ty = (dy / dist) * move;

    btnYes.style.transform =
      `translate(${tx}px, ${ty}px) rotate(${Math.random()*8-4}deg)`;

    tries++;
    const texts = ["Almost.", "Nope.", "Still no.", "Nice try.", "Persistent 😅"];
    hint.textContent = texts[Math.min(tries - 1, texts.length - 1)];
  }

  document.addEventListener("pointermove", e => {
    const r = btnYes.getBoundingClientRect();
    const d = Math.hypot(
      e.clientX - (r.left + r.width / 2),
      e.clientY - (r.top + r.height / 2)
    );
    if (d < 120) moveYes(e.clientX, e.clientY);
  });

  btnYes.addEventListener("click", e => {
    e.preventDefault();
    hint.textContent = "Not happening 😌";
  });

  btnNo.addEventListener("mouseenter", () => {
    noHover++;
    btnNo.style.transform = `scale(${1 + noHover * 0.04})`;
    hint.textContent = ["You sure?", "Feeling bold.", "Okay then.", "I see you."][Math.min(noHover - 1, 3)];
  });

  btnNo.addEventListener("click", () => {
    reveal.classList.add("visible");
    for (let i = 0; i < 20; i++) {
      setTimeout(makeParticle, i * 50);
    }
  });

  closeReveal.addEventListener("click", () => {
    reveal.classList.remove("visible");
    hint.textContent = "";
  });
});
