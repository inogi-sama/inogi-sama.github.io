const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  nav.classList.toggle('open', !isOpen);
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...nav.querySelectorAll('a')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  });
}, { rootMargin: '-30% 0px -60% 0px' });
sections.forEach((section) => sectionObserver.observe(section));

document.querySelectorAll('.filter-button').forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('.filter-button').forEach((item) => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('.timeline-item').forEach((item) => {
      item.hidden = filter !== 'all' && item.dataset.category !== filter;
    });
  });
});

const canvas = document.querySelector('#waveform');
const context = canvas.getContext('2d');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let phase = 0;

function drawWaveform() {
  const width = canvas.width;
  const height = canvas.height;
  context.clearRect(0, 0, width, height);

  context.strokeStyle = 'rgba(201, 231, 218, 0.12)';
  context.lineWidth = 1;
  for (let row = 1; row < 6; row += 1) {
    context.beginPath();
    context.moveTo(0, (height / 6) * row);
    context.lineTo(width, (height / 6) * row);
    context.stroke();
  }

  ['#c9e7da', '#e46f51'].forEach((color, lineIndex) => {
    context.beginPath();
    for (let x = 0; x <= width; x += 3) {
      const envelope = Math.sin((x / width) * Math.PI) ** 1.4;
      const y = height / 2 + Math.sin(x * (0.045 + lineIndex * 0.012) + phase + lineIndex * 1.8)
        * (62 + 28 * Math.sin(x * 0.009 + phase)) * envelope
        + (lineIndex ? 28 : -28);
      if (x === 0) context.moveTo(x, y); else context.lineTo(x, y);
    }
    context.strokeStyle = color;
    context.lineWidth = lineIndex ? 3 : 4;
    context.globalAlpha = lineIndex ? 0.85 : 1;
    context.stroke();
  });
  context.globalAlpha = 1;
  phase += 0.025;
  if (!reduceMotion) requestAnimationFrame(drawWaveform);
}

drawWaveform();
