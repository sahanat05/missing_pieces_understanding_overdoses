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

// Story Gallery Controls
let currentStory = 0;
const totalStories = 3;
const storySlides = document.querySelectorAll('.story-slide');
const storyDots = document.querySelectorAll('.story-dot');
const prevBtn = document.getElementById('prev-story');
const nextBtn = document.getElementById('next-story');

function showStory(index) {
  storySlides.forEach(slide => slide.classList.remove('active'));
  storyDots.forEach(dot => dot.classList.remove('active'));
  
  storySlides[index].classList.add('active');
  storyDots[index].classList.add('active');
  
  // Clear transcript highlighting
  clearTranscript();
  
  document.querySelectorAll('audio').forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
  
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.textContent = '▶ Play Story';
  });
  
  // Reset all transcript lines
  document.querySelectorAll('.transcript-line').forEach(line => {
    line.classList.remove('active', 'past');
  });
}

function nextStory() {
  currentStory = (currentStory + 1) % totalStories;
  showStory(currentStory);
}

function prevStory() {
  currentStory = (currentStory - 1 + totalStories) % totalStories;
  showStory(currentStory);
}

if (nextBtn) nextBtn.addEventListener('click', nextStory);
if (prevBtn) prevBtn.addEventListener('click', prevStory);

storyDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentStory = index;
    showStory(currentStory);
  });
});

// Transcript highlighting system
const transcriptData = {
  'jonathans-audio': 'jonathans-transcript',
  'sofias-audio': 'sofias-transcript',
  'jakes-audio': 'jakes-transcript'
};

let currentTranscript = null;
let transcriptInterval = null;

function updateTranscript(audioId) {
  const transcriptId = transcriptData[audioId];
  if (!transcriptId) return;
  
  const transcript = document.getElementById(transcriptId);
  if (!transcript) return;
  
  currentTranscript = transcript;
  const lines = transcript.querySelectorAll('.transcript-line');
  const audio = document.getElementById(audioId);
  
  // Clear any existing interval
  if (transcriptInterval) {
    clearInterval(transcriptInterval);
  }
  
  // Reset all lines
  lines.forEach(line => {
    line.classList.remove('active', 'past');
  });
  
  // Update transcript highlighting based on audio time
  function highlightTranscript() {
    if (!audio || audio.paused) return;
    
    const currentTime = audio.currentTime;
    
    lines.forEach((line, index) => {
      const lineTime = parseFloat(line.getAttribute('data-time'));
      const nextLineTime = index < lines.length - 1 
        ? parseFloat(lines[index + 1].getAttribute('data-time'))
        : Infinity;
      
      line.classList.remove('active', 'past');
      
      if (currentTime >= lineTime && currentTime < nextLineTime) {
        line.classList.add('active');
        // Scroll to active line if needed (only if it's not already visible)
        const rect = line.getBoundingClientRect();
        const transcriptRect = transcript.getBoundingClientRect();
        if (rect.top < transcriptRect.top || rect.bottom > transcriptRect.bottom) {
          line.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else if (currentTime >= nextLineTime) {
        line.classList.add('past');
      }
    });
  }
  
  // Update every 100ms for smooth highlighting
  transcriptInterval = setInterval(highlightTranscript, 100);
  
  // Also update on timeupdate for more accuracy
  audio.addEventListener('timeupdate', highlightTranscript);
}

function clearTranscript() {
  if (transcriptInterval) {
    clearInterval(transcriptInterval);
    transcriptInterval = null;
  }
  
  if (currentTranscript) {
    const lines = currentTranscript.querySelectorAll('.transcript-line');
    lines.forEach(line => {
      line.classList.remove('active', 'past');
    });
  }
}

document.querySelectorAll('.play-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const audioId = e.target.getAttribute('data-audio');
    const audio = document.getElementById(audioId);
    
    if (audio.paused) {
      audio.play();
      e.target.textContent = '⏸ Pause Story';
      updateTranscript(audioId);
    } else {
      audio.pause();
      e.target.textContent = '▶ Play Story';
      clearTranscript();
    }
  });
});

document.querySelectorAll('audio').forEach((audio, index) => {
  audio.addEventListener('ended', () => {
    // Clear transcript when audio ends
    clearTranscript();
    
    // Reset play button
    const audioId = audio.id;
    const btn = document.querySelector(`[data-audio="${audioId}"]`);
    if (btn) {
      btn.textContent = '▶ Play Story';
    }
    
    // Reset all transcript lines for this audio
    const transcriptId = transcriptData[audioId];
    if (transcriptId) {
      const transcript = document.getElementById(transcriptId);
      if (transcript) {
        transcript.querySelectorAll('.transcript-line').forEach(line => {
          line.classList.remove('active', 'past');
        });
      }
    }
    
    if (index < totalStories - 1) {
      setTimeout(() => {
        nextStory();
      }, 1000);
    }
  });
});

// Arrow key navigation
document.addEventListener('keydown', e => {
  const scrollAmount = window.innerHeight;
  const humanStoriesSection = document.getElementById('human-stories');
  const isInStoriesSection = humanStoriesSection && 
    window.scrollY >= humanStoriesSection.offsetTop - 100 && 
    window.scrollY < humanStoriesSection.offsetTop + humanStoriesSection.offsetHeight - 100;
  
  if (isInStoriesSection) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextStory();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevStory();
    }
  } else {
    if (e.key === 'ArrowDown') {
      window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    } else if (e.key === 'ArrowUp') {
      window.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
    }
  }
});