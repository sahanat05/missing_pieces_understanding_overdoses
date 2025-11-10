// Highlight active scroll indicator
const sections = document.querySelectorAll('.section');
const indicators = document.querySelectorAll('.indicator');

function updateActiveIndicator() {
  const scrollPosition = window.scrollY;
  const sectionHeight = window.innerHeight;
  const currentSection = Math.round(scrollPosition / sectionHeight);

  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentSection);
  });
}

window.addEventListener('scroll', updateActiveIndicator);

// Smooth scroll on click
indicators.forEach((indicator, index) => {
  indicator.addEventListener('click', e => {
    e.preventDefault();
    sections[index].scrollIntoView({ behavior: 'smooth' });
  });
});

// Optional arrow key navigation
document.addEventListener('keydown', e => {
  const scrollAmount = window.innerHeight;
  if (e.key === 'ArrowDown') {
    window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
  } else if (e.key === 'ArrowUp') {
    window.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
  }
});


// Jonathan's Story Controls
const jonAudio = document.getElementById("jonathans-audio");
const jonBtn = document.getElementById("play-audio-btn");

jonBtn.addEventListener("click", () => {
  if (jonAudio.paused) {
    jonAudio.play();
    jonBtn.textContent = "⏸ Pause Story";
  } else {
    jonAudio.pause();
    jonBtn.textContent = "▶ Play Story";
  }
});

// Sofia's Story Controls
const sofiaAudio = document.getElementById("sofias-audio");
const sofiaBtn = document.getElementById("play-audio-btn-sofia");

sofiaBtn.addEventListener("click", () => {
  if (sofiaAudio.paused) {
    sofiaAudio.play();
    sofiaBtn.textContent = "⏸ Pause Story";
  } else {
    sofiaAudio.pause();
    sofiaBtn.textContent = "▶ Play Story";
  }
});

// ✅ Automatically play Sofia after Jonathan finishes
jonAudio.addEventListener("ended", () => {
  // Start Sofia’s story
  sofiaAudio.play();
  sofiaBtn.textContent = "⏸ Pause Story";

  // Scroll smoothly to Sofia’s story section (optional but nice)
  document.getElementById("sofias-story").scrollIntoView({ behavior: "smooth" });
});


// Jake's Story Controls
const jakeAudio = document.getElementById("jakes-audio");
const jakeBtn = document.getElementById("play-audio-btn-jake");

jakeBtn.addEventListener("click", () => {
  if (jakeAudio.paused) {
    jakeAudio.play();
    jakeBtn.textContent = "⏸ Pause Story";
  } else {
    jakeAudio.pause();
    jakeBtn.textContent = "▶ Play Story";
  }
});

// ✅ Automatically play Jake after Sofia
sofiaAudio.addEventListener("ended", () => {
  jakeAudio.play();
  jakeBtn.textContent = "⏸ Pause Story";
  document.getElementById("jakes-story").scrollIntoView({ behavior: "smooth" });
});
