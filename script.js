document.addEventListener("DOMContentLoaded", () => {
  const btnYes = document.getElementById("btnYes");
  const btnNo = document.getElementById("btnNo");
  const hint = document.getElementById("hint");
  const decor = document.getElementById("decor");
  const reveal = document.getElementById("reveal");
  const closeReveal = document.getElementById("closeReveal");

  let tries = 0;

  function makeParticle(type = "❤") {
    const p = document.createElement("div");
    p.className = "particle";
    p.textContent = type;
    p.style.left = Math.random() * 100 + "vw";
    p.style.bottom = "-20px";
    p.style.setProperty("--dur", 12 + Math.random() * 10 + "s");
    decor.appendChild(p);
    setTimeout(() => p.remove(), 22000);
  }

  setInterval(() => {
    makeParticle(Math.random() > .5 ? "❤" : "🌸");
  }, 1200);

  function moveYes(x, y) {
    const r = btnYes.getBoundingClientRect();
    const dx = r.left + r.width / 2 - x;
    const dy = r.top + r.height / 2 - y;
    const dist = Math.hypot(dx, dy) || 1;

    const move = 90 + tries * 14;
    btnYes.style.transform =
      `translate(${(dx/dist)*move}px, ${(dy/dist)*move}px) rotate(${Math.random()*8-4}deg)`;

    tries++;
    hint.textContent = ["Almost.", "Nope.", "Still no.", "Nice try 😌", "Persistent 👀"]
      [Math.min(tries-1,4)];
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

  btnNo.addEventListener("click", () => {
    reveal.classList.add("visible");
    for (let i = 0; i < 22; i++) {
      setTimeout(() => makeParticle("❤"), i * 60);
    }
  });

  closeReveal.addEventListener("click", () => {
    reveal.classList.remove("visible");
    hint.textContent = "";
  });
});
