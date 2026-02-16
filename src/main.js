import './style.css';
import { publications, services, projects } from './data.js';

// --- State Management ---
const state = {
    filter: 'all',
    sortBy: 'newest'
};

// --- DOM Elements ---
const elements = {
    body: document.body,
    nav: document.querySelector('nav'),
    publicationsGrid: document.getElementById('publications-grid'),
    servicesGrid: document.getElementById('services-grid'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    yearSort: document.getElementById('year-sort'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    mobileMenu: document.getElementById('mobile-menu'),
    contactForm: document.getElementById('contact-form'),
    formMessage: document.getElementById('form-message')
};

// --- Initialization ---
function init() {
    // Check initial scroll position
    handleNavbarScroll();

    // Conditional Rendering based on Page
    if (elements.publicationsGrid) {
        renderPublications();
    }

    if (document.getElementById('projects-grid')) {
        renderProjects();
    }

    if (elements.servicesGrid) {
        renderServices();
    }

    setupEventListeners();
    setupIntersectionObserver();
    setupTiltEffect();
}

function handleNavbarScroll() {
    if (window.scrollY > 20) {
        elements.nav.classList.add('scrolled');
    } else {
        elements.nav.classList.remove('scrolled');
    }
}



// --- Publications Rendering ---
function renderPublications() {
    const container = elements.publicationsGrid;
    if (!container) return; // Exit if element doesn't exist
    container.innerHTML = '';

    let filtered = publications.filter(pub =>
        state.filter === 'all' || pub.category === state.filter
    );

    filtered.sort((a, b) =>
        state.sortBy === 'newest' ? a.year - b.year : b.year - a.year // newest = descending year
    );

    // Fix logic: Newest first = descending (2025 -> 2024), Oldest first = ascending
    if (state.sortBy === 'newest') {
        filtered.sort((a, b) => b.year - a.year);
    } else {
        filtered.sort((a, b) => a.year - b.year);
    }

    if (filtered.length === 0) {
        container.innerHTML = `<p class="text-center text-slate col-span-full py-12">No publications found for this category.</p>`;
        return;
    }

    filtered.forEach((pub, index) => {
        const card = document.createElement('article');
        card.className = 'glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-l-4 hover:border-l-goldenrod reveal';
        card.style.transitionDelay = `${index * 100}ms`; // Stagger effect

        card.innerHTML = `
      <div class="relative z-10">
        <div class="flex flex-wrap items-center gap-2 mb-3">
          <span class="px-3 py-1 rounded-full text-xs font-semibold bg-paper text-slate border border-midnight/10">
            ${pub.year}
          </span>
          <span class="px-3 py-1 rounded-full text-xs font-semibold ${pub.categoryColorClass}">
            ${pub.categoryLabel}
          </span>
          ${pub.status !== 'Published' ? `<span class="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200">${pub.status}</span>` : ''}
        </div>
        
        <h3 class="text-lg md:text-xl font-bold mb-3 leading-snug group-hover:text-goldenrod transition-colors">
          ${pub.title}
        </h3>

        <p class="text-sm text-gray-600 mb-4 line-clamp-2">
          ${pub.authors}
        </p>

        <div class="flex items-center gap-3">
          ${pub.doi ? `
            <a href="${pub.doi}" target="_blank" rel="noopener noreferrer" 
               class="inline-flex items-center text-sm font-medium text-royal hover:text-goldenrod transition-colors">
              <i class="fas fa-external-link-alt mr-2 text-xs"></i> 
              Read Paper
            </a>
          ` : ''}
        </div>
      </div>
    `;
        container.appendChild(card);
    });
}

// --- Services Rendering (Bento Grid) ---
function renderServices() {
    const container = elements.servicesGrid;
    if (!container) return; // Exit if element doesn't exist
    container.innerHTML = '';

    services.forEach((service, index) => {
        const card = document.createElement('div');
        card.className = `group tilt-card relative overflow-hidden rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-500 bg-gradient-to-br ${service.gradient} reveal border border-midnight/5`;
        card.style.transitionDelay = `${index * 150}ms`;

        card.innerHTML = `
      <div class="relative z-10 h-full flex flex-col">
        <div class="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-paper/80 backdrop-blur-md shadow-sm">
          <i class="${service.icon} text-2xl text-${service.color}"></i>
        </div>
        
        <h3 class="text-2xl font-bold mb-3 text-midnight group-hover:translate-x-1 transition-transform">
          ${service.title}
        </h3>
        
        <p class="text-slate mb-6 flex-grow leading-relaxed">
          ${service.description}
        </p>

        <ul class="space-y-2 mb-8">
          ${service.outcomes.map(outcome => `
            <li class="flex items-start text-sm text-slate">
              <i class="fas fa-check-circle text-${service.color} mt-1 mr-2 flex-shrink-0"></i>
              <span>${outcome}</span>
            </li>
          `).join('')}
        </ul>

        <button onclick="document.getElementById('contact').scrollIntoView({behavior: 'smooth'})"
          class="w-full py-3 px-4 rounded-xl font-medium text-eggshell bg-midnight hover:bg-goldenrod shadow-md transform active:scale-95 transition-all">
          Get Started
        </button>
      </div>
      
      <!-- Decorative background blur -->
      <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-${service.color}/10 rounded-full blur-3xl pointer-events-none group-hover:w-48 group-hover:h-48 transition-all duration-700"></div>
    `;

        // Add tilt event listeners directly to element
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);

        container.appendChild(card);
    });
}

// --- Projects Rendering ---
const techColors = {
    'default': 'bg-eggshell text-midnight border-midnight/10'
};

function renderProjects() {
    const container = document.getElementById('projects-grid');
    if (!container) return; // Exit if projects grid doesn't exist

    container.innerHTML = '';

    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'glass-card rounded-2xl p-0 overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 reveal flex flex-col h-full';
        card.style.transitionDelay = `${index * 100}ms`;

        card.innerHTML = `
            <div class="p-8 flex flex-col h-full relative z-10">
                <div class="flex justify-between items-start mb-6">
                    <div class="p-3 bg-goldenrod/10 rounded-xl text-goldenrod">
                        <i class="fas fa-code-branch text-xl"></i>
                    </div>
                    <a href="${project.link}" target="_blank" 
                       class="text-slate/50 hover:text-goldenrod transition-colors transform hover:scale-110 hover:rotate-12">
                        <i class="fab fa-github text-2xl"></i>
                    </a>
                </div>

                <h3 class="text-2xl font-bold mb-3 text-midnight group-hover:text-goldenrod transition-colors">
                    ${project.title}
                </h3>

                <div class="flex-grow">
                    <ul class="space-y-2 mb-6 text-slate leading-relaxed">
                        ${project.description.map(desc => `
                            <li class="flex items-start">
                                <span class="mr-2 mt-1.5 w-1.5 h-1.5 bg-goldenrod rounded-full flex-shrink-0"></span>
                                <span>${desc}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="flex flex-wrap gap-2 mt-auto pt-6 border-t border-midnight/10">
                    ${project.tools.map(tool => `
                        <span class="px-3 py-1 rounded-full text-xs font-semibold border ${techColors[tool] || techColors['default']}">
                            ${tool}
                        </span>
                    `).join('')}
                </div>
            </div>
            
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-br from-goldenrod/5 to-royal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        `;

        container.appendChild(card);
    });
}

// --- Tilt Interaction ---
function handleTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg tilt
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
}

function resetTilt(e) {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
}

// --- Intersection Observer for Scroll Animations ---
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: unobserve after showing
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe dynamically formed elements later, so use a MutationObserver or delay
    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, 100);
}

// --- Event Listeners ---
function setupEventListeners() {



    // Filter Buttons (Publications Page)
    if (elements.filterBtns && elements.filterBtns.length > 0) {
        elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // UI Update
                elements.filterBtns.forEach(b => {
                    b.classList.remove('bg-goldenrod', 'text-white');
                    b.classList.add('bg-paper', 'text-slate');
                });
                e.target.classList.remove('bg-paper', 'text-slate');
                e.target.classList.add('bg-goldenrod', 'text-white');

                // State Update
                state.filter = e.target.dataset.filter;
                renderPublications();

                // Re-observe new elements
                setTimeout(() => {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) entry.target.classList.add('active');
                        });
                    }, { threshold: 0.1 });
                    document.querySelectorAll('.reveal:not(.active)').forEach(el => observer.observe(el));
                }, 50);
            });
        });
    }

    // Year Sort (Publications Page)
    if (elements.yearSort) {
        elements.yearSort.addEventListener('change', (e) => {
            state.sortBy = e.target.value;
            renderPublications();
        });
    }

    // Mobile Menu
    if (elements.mobileMenuBtn) {
        elements.mobileMenuBtn.addEventListener('click', () => {
            elements.mobileMenu.classList.toggle('hidden');
            const icon = elements.mobileMenuBtn.querySelector('i');
            if (elements.mobileMenu.classList.contains('hidden')) {
                icon.classList.replace('fa-times', 'fa-bars');
            } else {
                icon.classList.replace('fa-bars', 'fa-times');
            }
        });
    }

    // Navigation Highlighting for Multi-page & Single-page Hybrid
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Set initial active state based on current file
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        // Check if link points specifically to the current file
        if (href === currentPage || (currentPage === 'index.html' && href === '#home')) {
            link.classList.add('active');
        } else if (href !== currentPage && !href.startsWith('#')) {
            link.classList.remove('active');
        }
    });

    // Add scroll event for Navbar
    window.addEventListener('scroll', handleNavbarScroll);

    // Smooth Scroll Highlighting (Only on Index Page for local sections)
    if (currentPage === 'index.html' || currentPage === 'index.html' || currentPage === '') {
        const sections = document.querySelectorAll('section[id]');
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollY = window.scrollY;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });

            if (current) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${current}`) {
                        link.classList.add('active');
                    } else if (href.startsWith('#')) {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }

    // Contact Form (Formspree) - Only on pages where it exists
    if (elements.contactForm) {
        elements.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(elements.contactForm);
            const form = e.target;

            // UI Loading State
            const submitBtn = form.querySelector('button[type="submit"]');
            if (!submitBtn) return;
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    if (elements.formMessage) {
                        elements.formMessage.classList.remove('hidden', 'bg-red-100', 'text-red-800');
                        elements.formMessage.classList.add('bg-green-100', 'text-green-800');
                        elements.formMessage.innerHTML = '<i class="fas fa-check-circle mr-2"></i> Message sent successfully! I will get back to you soon.';
                    }
                    form.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                if (elements.formMessage) {
                    elements.formMessage.classList.remove('hidden', 'bg-green-100', 'text-green-800');
                    elements.formMessage.classList.add('bg-red-100', 'text-red-800');
                    elements.formMessage.innerHTML = '<i class="fas fa-exclamation-circle mr-2"></i> Oops! There was a problem sending your message. Please try again.';
                }
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                setTimeout(() => {
                    if (elements.formMessage) elements.formMessage.classList.add('hidden');
                }, 5000);
            }
        });
    }
}

// Start App
init();
