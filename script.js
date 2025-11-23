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
  
  document.querySelectorAll('audio').forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
  
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.textContent = '▶ Play Story';
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

document.querySelectorAll('.play-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const audioId = e.target.getAttribute('data-audio');
    const audio = document.getElementById(audioId);
    
    if (audio.paused) {
      audio.play();
      e.target.textContent = '⏸ Pause Story';
    } else {
      audio.pause();
      e.target.textContent = '▶ Play Story';
    }
  });
});

document.querySelectorAll('audio').forEach((audio, index) => {
  audio.addEventListener('ended', () => {
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