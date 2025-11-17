// ==========================================
// NALOXONE QUIZ — PURE SVG, CLICK-LOCK LOGIC
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("Naloxone quiz script loaded ✓");

  const quizData = [
    { id: "know", question: "Know what naloxone is", trueValue: 46 },
    { id: "carry", question: "Carry naloxone", trueValue: 11 },
    { id: "administer", question: "Administered naloxone", trueValue: 8 }
  ];

  const quizContainer = document.getElementById("quiz-container");
  if (!quizContainer) return;

  const SVG_NS = "http://www.w3.org/2000/svg";
  const RADIUS = 60;
  const THICKNESS = 20;
  const CIRC = 2 * Math.PI * RADIUS;

  const userGuesses = {};
  const locked = {}; // tracks which pies are locked

  function isPointerOnRing(svg, evt) {
    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = evt.clientX - cx;
    const dy = evt.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Only count pointer inside "ring zone"
    return dist >= RADIUS - THICKNESS && dist <= RADIUS + THICKNESS;
  }

  function angleToPercent(evt, svg) {
    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = evt.clientX - cx;
    const dy = evt.clientY - cy;

    let angle = Math.atan2(dy, dx);
    angle = angle < 0 ? angle + Math.PI * 2 : angle;

    return +(angle / (Math.PI * 2) * 100).toFixed(1);
  }

  function updateFill(fg, percent) {
    fg.style.strokeDasharray = `${(percent / 100) * CIRC} ${CIRC}`;
  }

  function createPie(item) {
    const card = document.createElement("div");
    card.className = "quiz-pie";

    // Title
    const title = document.createElement("h3");
    title.textContent = item.question;
    card.appendChild(title);

    // SVG container
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("width", "180");
    svg.setAttribute("height", "180");
    card.appendChild(svg);

    // Background circle
    const bg = document.createElementNS(SVG_NS, "circle");
    bg.setAttribute("cx", "90");
    bg.setAttribute("cy", "90");
    bg.setAttribute("r", RADIUS);
    bg.setAttribute("fill", "none");
    bg.setAttribute("stroke", "#333");
    bg.setAttribute("stroke-width", THICKNESS);
    svg.appendChild(bg);

    // Foreground dynamic arc
    const fg = document.createElementNS(SVG_NS, "circle");
    fg.setAttribute("cx", "90");
    fg.setAttribute("cy", "90");
    fg.setAttribute("r", RADIUS);
    fg.setAttribute("fill", "none");
    fg.setAttribute("stroke", "#4d90fe");
    fg.setAttribute("stroke-width", THICKNESS);
    fg.setAttribute("stroke-linecap", "round");
    fg.style.transform = "rotate(-90deg)";
    fg.style.transformOrigin = "50% 50%";
    fg.style.strokeDasharray = `0 ${CIRC}`;
    svg.appendChild(fg);

    // Labels
    const guessLabel = document.createElement("p");
    guessLabel.innerHTML = `Your guess: <span id="${item.id}-guess">0%</span>`;
    card.appendChild(guessLabel);

    const result = document.createElement("p");
    result.id = `${item.id}-result`;
    result.textContent = "";
    card.appendChild(result);

    // Hover logic
    svg.addEventListener("mousemove", evt => {
      if (locked[item.id]) return; // ignore hover after click

      // Only apply if pointer is within ring zone
      if (!isPointerOnRing(svg, evt)) return;

      const percent = angleToPercent(evt, svg);

      userGuesses[item.id] = percent;
      guessLabel.querySelector("span").textContent = `${percent}%`;
      updateFill(fg, percent);
    });

    // Click to lock answer
    svg.addEventListener("click", evt => {
      if (!isPointerOnRing(svg, evt)) return;

      const percent = angleToPercent(evt, svg);

      locked[item.id] = true;
      userGuesses[item.id] = percent;
      guessLabel.querySelector("span").textContent = `${percent}%`;
      updateFill(fg, percent);
    });

    quizContainer.appendChild(card);
  }

  // Initialize all pies
  quizData.forEach(createPie);

  // Reveal answers
  document.getElementById("submit-quiz").addEventListener("click", () => {
    quizData.forEach(item => {
      const resultEl = document.getElementById(`${item.id}-result`);
      const guess = userGuesses[item.id] || 0;
      const real = item.trueValue;

      let msg =
        Math.abs(guess - real) < 1
          ? "You guessed correctly!"
          : guess > real
          ? "Fewer Americans than you guessed."
          : "More Americans than you guessed.";

      resultEl.textContent = `Reality: ${real}% — ${msg}`;
    });
  });
});
