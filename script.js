const portfolioProjects = [
  {
    title: 'Anas PKD Portfolio',
    category: 'Reels',
    video: encodeURI('/assets/videos/anas pkd portfolio final out.mp4')
  },
  {
    title: 'Wedding Highlight',
    category: 'Events',
    video: encodeURI('/assets/videos/Wedding video 1.mp4')
  },
  {
    title: 'Short-form Motion',
    category: 'Short-form',
    video: encodeURI('/assets/videos/short_form/short_form1.mp4')
  },
  {
    title: 'Social Story Cut',
    category: 'Short-form',
    video: encodeURI('/assets/videos/short_form/short_form2.mp4')
  },
  {
    title: 'Brand Motion',
    category: 'Motion Graphics',
    video: encodeURI('/assets/videos/motion_graphics/motion_graphics1.mp4')
  },
  {
    title: 'SaaS Motion Graphics',
    category: 'Motion Graphics',
    video: encodeURI('/assets/videos/motion_graphics/motion_graphics2.mp4')
  }
];

const galleryImages = [
  encodeURI('/assets/ Ai images/image1.png'),
  encodeURI('/assets/ Ai images/image2.png'),
  encodeURI('/assets/ Ai images/image3.png'),
  encodeURI('/assets/ Ai images/image4.png')
];

const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(nav.classList.contains('is-open')));
  });
}

const navLinks = document.querySelectorAll('.nav a');
const sections = [...document.querySelectorAll('main section[id]')];

const setActiveLink = () => {
  const scrollPosition = window.scrollY + 140;
  let activeId = sections[0]?.id || 'top';

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${activeId}`;
    link.classList.toggle('active', isActive);
  });
};

window.addEventListener('scroll', setActiveLink, { passive: true });
setActiveLink();

const portfolioGrid = document.getElementById('portfolioGrid');
const galleryGrid = document.getElementById('galleryGrid');

if (portfolioGrid) {
  portfolioProjects.forEach((project, index) => {
    const card = document.createElement('article');
    card.className = 'portfolio-card';
    card.dataset.category = project.category.toLowerCase();
    card.innerHTML = `
      <video preload="metadata" loading="lazy">
        <source src="${project.video}" type="video/mp4" />
      </video>
      <div class="portfolio-card__meta">
        <div>
          <strong>${project.title}</strong>
          <span>${project.category}</span>
        </div>
        <span class="card-action" data-index="${index}">+</span>
      </div>
    `;

    card.querySelector('.card-action').addEventListener('click', () => openLightbox(index));
    card.addEventListener('click', (event) => {
      if (!event.target.closest('.card-action')) {
        openLightbox(index);
      }
    });

    portfolioGrid.appendChild(card);
  });
}

if (galleryGrid) {
  galleryImages.forEach((src) => {
    const item = document.createElement('figure');
    item.className = 'gallery-item';
    item.innerHTML = `<img src="${src}" alt="Portfolio visual" loading="lazy" />`;
    galleryGrid.appendChild(item);
  });
}

const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));

    portfolioCards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !matches);
    });
  });
});

const modal = document.getElementById('videoModal');
const modalVideo = document.getElementById('lightboxVideo');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const closeButton = document.querySelector('.lightbox__close');
const prevButton = document.getElementById('prevProject');
const nextButton = document.getElementById('nextProject');
let currentProjectIndex = 0;

function openLightbox(index) {
  currentProjectIndex = index;
  const project = portfolioProjects[index];
  if (!project || !modal || !modalVideo) return;

  modalVideo.src = project.video;
  modalVideo.load();
  modalTitle.textContent = project.title;
  modalCategory.textContent = project.category;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  if (!modal || !modalVideo) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  modalVideo.pause();
}

if (closeButton) closeButton.addEventListener('click', closeLightbox);
if (modal) {
  modal.addEventListener('click', (event) => {
    if (event.target.dataset.close === 'true' || event.target === modal) {
      closeLightbox();
    }
  });
}

if (prevButton) {
  prevButton.addEventListener('click', () => {
    const nextIndex = (currentProjectIndex - 1 + portfolioProjects.length) % portfolioProjects.length;
    openLightbox(nextIndex);
  });
}

if (nextButton) {
  nextButton.addEventListener('click', () => {
    const nextIndex = (currentProjectIndex + 1) % portfolioProjects.length;
    openLightbox(nextIndex);
  });
}

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => observer.observe(item));

const miniProjects = document.querySelectorAll('.mini-project');
miniProjects.forEach((card) => {
  card.addEventListener('click', () => {
    const index = Number(card.dataset.index);
    if (!Number.isNaN(index)) openLightbox(index);
  });
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (!submitButton) return;

    const originalText = submitButton.textContent;
    submitButton.textContent = 'Inquiry Sent';
    submitButton.disabled = true;

    setTimeout(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      contactForm.reset();
    }, 1600);
  });
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal && modal.classList.contains('is-open')) {
    closeLightbox();
  }
});
