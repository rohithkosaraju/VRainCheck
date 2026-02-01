document.addEventListener("DOMContentLoaded", () => {
  const btnYes = document.getElementById("btnYes");
  const btnNo = document.getElementById("btnNo");
  const hint = document.getElementById("hint");
  const decor = document.getElementById("decor");
  const reveal = document.getElementById("reveal");
  const closeReveal = document.getElementById("closeReveal");

  let tries = 0;
  const MAX_TRIES = 50;

  /* BACKGROUND PARTICLES – START IMMEDIATELY */
  function makeParticle(symbol) {
    const p = document.createElement("div");
    p.className = "particle";
    p.textContent = symbol;
    p.style.left = Math.random() * 100 + "vw";
    p.style.bottom = "-20px";
    p.style.setProperty("--dur", 8 + Math.random() * 6 + "s");
    decor.appendChild(p);
    setTimeout(() => p.remove(), 16000);
  }

  setInterval(() => {
    makeParticle(Math.random() > 0.5 ? "❤" : "🌸");
  }, 700); // faster & richer

  /* YES BUTTON DODGE */
  function moveYes(x, y) {
    if (tries >= MAX_TRIES) {
      btnYes.style.opacity = "0";
      btnYes.style.pointerEvents = "none";
      hint.textContent = "Fine… I’m gone 😌";
      return;
    }

    const r = btnYes.getBoundingClientRect();
    const dx = r.left + r.width / 2 - x;
    const dy = r.top + r.height / 2 - y;
    const dist = Math.hypot(dx, dy) || 1;

    const move = 90 + tries * 10;
    btnYes.style.transform =
      `translate(${(dx/dist)*move}px, ${(dy/dist)*move}px) rotate(${Math.random()*10-5}deg)`;

    tries++;

    hint.textContent = [
      "Almost.",
      "Nope.",
      "Still no.",
      "Nice try 😌",
      "Persistent 👀",
      "Very persistent…"
    ][Math.min(Math.floor(tries/8),5)];
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

  /* NO CLICK → REVEAL */
  btnNo.addEventListener("click", () => {
    reveal.classList.add("visible");
    for (let i = 0; i < 26; i++) {
      setTimeout(() => makeParticle("❤"), i * 50);
    }
  });

  /* CLOSE → RESET */
  closeReveal.addEventListener("click", () => {
    reveal.classList.remove("visible");

    // reset yes button
    tries = 0;
    btnYes.style.opacity = "1";
    btnYes.style.pointerEvents = "auto";
    btnYes.style.transform = "translate(0,0) rotate(0deg)";

    hint.textContent = "";
  });
});
