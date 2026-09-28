import { useEffect, useMemo, useState } from 'react';

const navLinks = [
  { href: '#top', label: 'Home' },
  { href: '#portfolio', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Contact' },
];

const buildFilterOptions = (videos) => {
  const categories = [...new Set(videos.map((video) => video.category))];

  return [
    { value: 'all', label: 'All' },
    ...categories.map((category) => ({
      value: category.toLowerCase(),
      label: category,
    })),
  ];
};

const withBaseUrl = (url) => {
  if (!url) return url;
  const normalizedPath = url.replace(/^\/+/, '');
  return `${import.meta.env.BASE_URL}${encodeURI(normalizedPath)}`;
};

const normalizePortfolioData = (data) => ({
  videos: (data.videos || []).map((video) => ({
    ...video,
    video: withBaseUrl(video.video),
  })),
  images: (data.images || []).map((image) => ({
    ...image,
    src: withBaseUrl(image.src),
  })),
});

export default function App() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeNav, setActiveNav] = useState('top');
  const [navOpen, setNavOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [portfolioData, setPortfolioData] = useState({ videos: [], images: [] });

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}assets/portfolio.json`)
      .then((response) => response.json())
      .then((data) => {
        setPortfolioData(normalizePortfolioData(data));
      })
      .catch(() => {
        setPortfolioData({ videos: [], images: [] });
      });
  }, []);

  const portfolioProjects = portfolioData.videos;
  const galleryItems = portfolioData.images;
  const filterOptions = useMemo(() => buildFilterOptions(portfolioProjects), [portfolioProjects]);

  const visibleProjects = useMemo(() => {
    if (activeFilter === 'all') {
      return portfolioProjects;
    }

    return portfolioProjects.filter((project) => project.category.toLowerCase() === activeFilter);
  }, [activeFilter, portfolioProjects]);

  useEffect(() => {
    const revealItems = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [...document.querySelectorAll('main section[id]')];
      const scrollPosition = window.scrollY + 140;
      let activeId = 'top';

      sections.forEach((section) => {
        if (scrollPosition >= section.offsetTop) {
          activeId = section.id;
        }
      });

      setActiveNav(activeId);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && modalOpen) {
        setModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  const openLightbox = (id) => {
    setCurrentProjectId(Number(id));
    setModalOpen(true);
  };

  const closeLightbox = () => {
    setModalOpen(false);
  };

  const shiftProject = (offset) => {
    const currentIndex = portfolioProjects.findIndex((project) => project.id === currentProjectId);
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (safeIndex + offset + portfolioProjects.length) % portfolioProjects.length;
    setCurrentProjectId(portfolioProjects[nextIndex]?.id ?? 0);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);

    window.setTimeout(() => {
      setIsSubmitted(false);
      event.target.reset();
    }, 1600);
  };

  const currentProject = portfolioProjects.find((project) => project.id === currentProjectId) || portfolioProjects[0] || { title: '', category: '', video: '' };

  return (
    <>
      <header className="site-header">
        <div className="container navbar">
          <a href="#top" className="brand" aria-label="Anas Shamsudheen home page">
            <span className="brand__mark">A</span>
            <span>Anas</span>
          </a>

          <button
            className="nav-toggle"
            type="button"
            aria-label="Open menu"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((prev) => !prev)}
          >
            ☰
          </button>

          <nav className={navOpen ? 'nav is-open' : 'nav'} aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={activeNav === link.href.replace('#', '') ? 'active' : ''}
                onClick={() => setNavOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a href="https://instagram.com/anas.cine" target="_blank" rel="noreferrer" className="nav__cta">
              @anas.cine
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <video  key={portfolioProjects[0]?.video ?? 'hero-video'}
            className="hero-video" 
            src={portfolioProjects[0]?.video ?? ''}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="Featured portfolio video">
             
          </video>
          <div className="hero__overlay" />

          <div className="container hero__content reveal">
            <span className="eyebrow">Freelance Video Editor</span>
            <h1>ANAS SHAMSUDHEEN</h1>
            <p className="hero__subtitle">Visual Storyteller</p>
            <div className="hero__actions">
              <a href="#portfolio" className="button button--primary">View Portfolio</a>
              <a href="#contact" className="button button--secondary">Let's Work Together</a>
            </div>
          </div>

          <div className="container hero__rail reveal">
            {portfolioProjects.slice(0, 3).map((project) => (
              <article key={project.id} className="mini-project" onClick={() => openLightbox(project.id)}>
                <video muted preload="metadata" aria-label={project.title}>
                  <source src={project.video} type="video/mp4" />
                </video>
                <div className="mini-project__info">
                  <strong>{project.title}</strong>
                  <span>{project.category}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="portfolio" className="section">
          <div className="container">
            <div className="section-head reveal">
              <div>
                <span className="section-label">Selected Work</span>
                <h2>SELECTED WORK</h2>
              </div>
            </div>

            <div className="portfolio-filters reveal" aria-label="Portfolio filters">
              {filterOptions.map((filter) => (
                <button
                  key={filter.value}
                  className={activeFilter === filter.value ? 'filter-btn is-active' : 'filter-btn'}
                  type="button"
                  data-filter={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="portfolio-grid reveal" id="portfolioGrid">
              {visibleProjects.map((project) => (
                <article
                  key={project.id}
                  className="portfolio-card"
                  data-category={project.category.toLowerCase()}
                  onClick={() => openLightbox(project.id)}
                >
                  <video preload="metadata" loading="lazy" muted>
                    <source src={project.video} type="video/mp4" />
                  </video>
                  <div className="portfolio-card__meta">
                    <div>
                      <strong>{project.title}</strong>
                      <span>{project.category}</span>
                    </div>
                    <span className="card-action" onClick={(event) => { event.stopPropagation(); openLightbox(project.id); }}>
                      +
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="featured-project section">
          <div className="container featured-layout">
            <div className="featured-media reveal">
              <video controls preload="metadata" playsInline aria-label="Featured project video">
                <source src={portfolioProjects[0]?.video ?? ''} type="video/mp4" />
              </video>
            </div>

            <div className="featured-copy reveal">
              <span className="section-label">Featured Project</span>
              <h3>Showreel</h3>
              <p>
                A cinematic overview of the editing style, pacing, type-driven motion and visual storytelling that define the portfolio.
              </p>
              <div className="featured-meta">
                <span>Category: Reels</span>
                <a href="#portfolio" className="button button--primary">Watch Project</a>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section about-section">
          <div className="container about-grid">
            <div className="about-copy reveal">
              <span className="section-label">About Me</span>
              <h2>ABOUT ME</h2>
              <p>
                I am a freelance video editor focused on creating engaging, cinematic and modern visual content for brands, creators and businesses that want to stand out.
              </p>
              <div className="skill-list">
                <span>Video Editing</span>
                <span>Color Grading</span>
                <span>Cinematic Storytelling</span>
                <span>Reels &amp; Short-form</span>
                <span>YouTube Videos</span>
                <span>Social Media Content</span>
                <span>Motion Graphics</span>
              </div>
            </div>

            <div className="about-panel reveal">
              <div className="info-row"><span>Instagram</span><strong>@anas.cine</strong></div>
              <div className="info-row"><span>Specialty</span><strong>Freelance Editing</strong></div>
              <div className="info-row"><span>Focus</span><strong>Brand / Social / Motion</strong></div>
              <div className="info-row"><span>Style</span><strong>Cinematic / Minimal</strong></div>
            </div>
          </div>
        </section>

        <section id="services" className="section">
          <div className="container">
            <div className="section-head reveal">
              <div>
                <span className="section-label">Services</span>
                <h2>What I Do</h2>
              </div>
            </div>

            <div className="services-grid">
              {[
                ['◎', 'Social Media Reels', 'Fast, engaging edits designed to hold attention and increase reach across platforms.'],
                ['▶', 'YouTube Video Editing', 'Structured edits that improve retention, clarity and story impact for long-form content.'],
                ['✦', 'Cinematic Video Editing', 'Premium visual storytelling built around pacing, mood, transitions and cinematic rhythm.'],
                ['✧', 'Wedding / Event Highlights', 'Emotion-led edits that preserve the energy and memory of the moment.'],
                ['▣', 'Promotional Videos', 'Clean, persuasive edits for brands that need stronger visual communication.'],
                ['◌', 'Color Grading', 'Enhancement of tone, atmosphere and contrast for a refined cinematic finish.'],
                ['✹', 'Motion Graphics', 'Animated visuals and typography that make content feel polished and premium.'],
              ].map(([icon, title, description]) => (
                <article key={title} className="service-card reveal">
                  <div className="service-icon">{icon}</div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section gallery-section">
          <div className="container">
            <div className="section-head reveal">
              <div>
                <span className="section-label">Visual Gallery</span>
                <h2>IMAGE GALLERY</h2>
              </div>
            </div>
            <div className="gallery-grid reveal" id="galleryGrid">
              {galleryItems.map((image) => (
                <figure key={image.id} className="gallery-item">
                  <img src={image.src} alt={image.alt || 'Portfolio visual'} loading="lazy" />
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="container contact-layout">
            <div className="contact-panel reveal">
              <span className="section-label">Contact</span>
              <h2>LET'S CREATE SOMETHING GREAT</h2>
              <p>
                Have a project in mind? Let's turn your idea into a powerful visual story.
              </p>

              <div className="contact-list">
                <div className="info-row"><span>Instagram</span><strong>@anas.cine</strong></div>
                <div className="info-row"><span>Email</span><strong>Anashamsudheen9544@gmail.com</strong></div>
                <div className="info-row"><span>WhatsApp</span><strong>+91 9633214193</strong></div>
                <div className="info-row"><span>GitHub</span><a href="https://github.com/afsathjamal01-svg/anasshamsudheenportfolio" target="_blank" rel="noreferrer">Repository</a></div>
              </div>

              <div className="socials">
                <a href="https://instagram.com/anas.cine" target="_blank" rel="noreferrer">◎</a>
                <a href="mailto:hello@anasine.com">✉</a>
                <a href="https://wa.me/919633214193" target="_blank" rel="noreferrer">✆</a>
                <a href="https://github.com/afsathjamal01-svg/anasshamsudheenportfolio" target="_blank" rel="noreferrer" aria-label="GitHub repository">GH</a>
              </div>
            </div>

            <form className="contact-form reveal" onSubmit={handleSubmit}>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input id="name" type="text" name="name" placeholder="Your name" />
                </div>

                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" name="email" placeholder="Your email" />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="projectType">Project Type</label>
                  <select id="projectType" name="projectType">
                    <option>Social Media Reel</option>
                    <option>YouTube Editing</option>
                    <option>Cinematic Editing</option>
                    <option>Wedding / Event Highlights</option>
                    <option>Promotional Video</option>
                    <option>Color Grading</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" placeholder="Tell me about your project..." />
              </div>

              <button type="submit" className="button button--primary" disabled={isSubmitted}>
                {isSubmitted ? 'Inquiry Sent' : 'Send Inquiry'}
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-row">
          <span>ANAS SHAMSUDHEEN</span>
          <span>Freelance Video Editor</span>
          <span>Instagram: @anas.cine</span>
          <span>© 2026 Anas Shamsudheen. All Rights Reserved.</span>
        </div>
      </footer>

      <div className={modalOpen ? 'lightbox is-open' : 'lightbox'} aria-hidden={!modalOpen}>
        <div className="lightbox__backdrop" data-close="true" onClick={closeLightbox} />
        <div className="lightbox__dialog" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <button className="lightbox__close" type="button" aria-label="Close video" onClick={closeLightbox}>
            ×
          </button>
          <div className="lightbox__content">
            <video id="lightboxVideo" controls playsInline preload="metadata" key={currentProject.video}>
              <source src={currentProject.video} type="video/mp4" />
            </video>
          </div>
          <div className="lightbox__info">
            <div>
              <p className="lightbox__meta" id="modalCategory">{currentProject.category}</p>
              <h3 id="modalTitle">{currentProject.title}</h3>
            </div>
            <div className="lightbox__nav">
              <button type="button" onClick={() => shiftProject(-1)}>← Prev</button>
              <button type="button" onClick={() => shiftProject(1)}>Next →</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
