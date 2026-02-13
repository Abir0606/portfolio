import './style.css';
import { publications, services, projects } from './data.js';

// --- State Management ---
const state = {
    theme: localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
    filter: 'all',
    sortBy: 'newest'
};

// --- DOM Elements ---
const elements = {
    body: document.body,
    themeToggle: document.getElementById('theme-toggle'),
    themeIcon: document.querySelector('#theme-toggle i'),
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
    applyTheme(state.theme);

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

// --- Theme Handling ---
function applyTheme(theme) {
    if (theme === 'dark') {
        elements.body.classList.add('dark');
        elements.themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        elements.body.classList.remove('dark');
        elements.themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
}

function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', state.theme);
    applyTheme(state.theme);
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
        container.innerHTML = `<p class="text-center text-gray-500 dark:text-gray-400 col-span-full py-12">No publications found for this category.</p>`;
        return;
    }

    filtered.forEach((pub, index) => {
        const card = document.createElement('article');
        card.className = 'glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-l-4 hover:border-l-blue-500 reveal';
        card.style.transitionDelay = `${index * 100}ms`; // Stagger effect

        card.innerHTML = `
      <div class="relative z-10">
        <div class="flex flex-wrap items-center gap-2 mb-3">
          <span class="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            ${pub.year}
          </span>
          <span class="px-3 py-1 rounded-full text-xs font-semibold ${pub.categoryColorClass}">
            ${pub.categoryLabel}
          </span>
          ${pub.status !== 'Published' ? `<span class="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">${pub.status}</span>` : ''}
        </div>
        
        <h3 class="text-lg md:text-xl font-bold mb-3 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          ${pub.title}
        </h3>

        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          ${pub.authors}
        </p>

        <div class="flex items-center gap-3">
          ${pub.doi ? `
            <a href="${pub.doi}" target="_blank" rel="noopener noreferrer" 
               class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
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
        // Using col-span logic for bento grid feel - make 1st and 4th wider on large screens if we had more items
        // For 4 items, let's keep it uniform grid but styled richly
        card.className = `group tilt-card relative overflow-hidden rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${service.gradient} reveal border border-white/50 dark:border-white/5`;
        card.style.transitionDelay = `${index * 150}ms`;

        card.innerHTML = `
      <div class="relative z-10 h-full flex flex-col">
        <div class="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/80 dark:bg-white/10 backdrop-blur-md shadow-sm">
          <i class="${service.icon} text-2xl text-${service.color}-600 dark:text-${service.color}-400"></i>
        </div>
        
        <h3 class="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:translate-x-1 transition-transform">
          ${service.title}
        </h3>
        
        <p class="text-gray-600 dark:text-gray-300 mb-6 flex-grow leading-relaxed">
          ${service.description}
        </p>

        <ul class="space-y-2 mb-8">
          ${service.outcomes.map(outcome => `
            <li class="flex items-start text-sm text-gray-600 dark:text-gray-400">
              <i class="fas fa-check-circle text-${service.color}-500 mt-1 mr-2 flex-shrink-0"></i>
              <span>${outcome}</span>
            </li>
          `).join('')}
        </ul>

        <button onclick="document.getElementById('contact').scrollIntoView({behavior: 'smooth'})"
          class="w-full py-3 px-4 rounded-xl font-medium text-white bg-${service.color}-600 hover:bg-${service.color}-700 shadow-md hover:shadow-lg transform active:scale-95 transition-all">
          Get Started
        </button>
      </div>
      
      <!-- Decorative background blur -->
      <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-${service.color}-400/20 rounded-full blur-3xl pointer-events-none group-hover:w-48 group-hover:h-48 transition-all duration-700"></div>
    `;

        // Add tilt event listeners directly to element
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);

        container.appendChild(card);
    });
}

// --- Projects Rendering ---
const techColors = {
    'Python': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    'NumPy': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    'Keras': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
    'TensorFlow': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    'Django': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
    'HTML': 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    'CSS': 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    'JavaScript': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    'Linear Regression': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 border-pink-200 dark:border-pink-800',
    'ScikitLearn': 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    'default': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
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
                    <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                        <i class="fas fa-code-branch text-xl"></i>
                    </div>
                    <a href="${project.link}" target="_blank" 
                       class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors transform hover:scale-110 hover:rotate-12">
                        <i class="fab fa-github text-2xl"></i>
                    </a>
                </div>

                <h3 class="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    ${project.title}
                </h3>

                <div class="flex-grow">
                    <ul class="space-y-2 mb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                        ${project.description.map(desc => `
                            <li class="flex items-start">
                                <span class="mr-2 mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                                <span>${desc}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="flex flex-wrap gap-2 mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
                    ${project.tools.map(tool => `
                        <span class="px-3 py-1 rounded-full text-xs font-semibold border ${techColors[tool] || techColors['default']}">
                            ${tool}
                        </span>
                    `).join('')}
                </div>
            </div>
            
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
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
    // Theme Toggle
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }

    // Filter Buttons (Publications Page)
    if (elements.filterBtns && elements.filterBtns.length > 0) {
        elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // UI Update
                elements.filterBtns.forEach(b => {
                    b.classList.remove('bg-blue-600', 'text-white');
                    b.classList.add('bg-gray-100', 'text-gray-600', 'dark:bg-gray-800', 'dark:text-gray-300');
                });
                e.target.classList.remove('bg-gray-100', 'text-gray-600', 'dark:bg-gray-800', 'dark:text-gray-300');
                e.target.classList.add('bg-blue-600', 'text-white');

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
            link.classList.add('active', 'text-blue-600', 'dark:text-blue-400');
        } else if (href !== currentPage && !href.startsWith('#')) {
            link.classList.remove('active', 'text-blue-600', 'dark:text-blue-400');
        }
    });

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
                        link.classList.add('active', 'text-blue-600', 'dark:text-blue-400');
                    } else if (href.startsWith('#')) {
                        link.classList.remove('active', 'text-blue-600', 'dark:text-blue-400');
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
                        elements.formMessage.classList.add('bg-green-100', 'text-green-800', 'dark:bg-green-900/30', 'dark:text-green-300');
                        elements.formMessage.innerHTML = '<i class="fas fa-check-circle mr-2"></i> Message sent successfully! I will get back to you soon.';
                    }
                    form.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                if (elements.formMessage) {
                    elements.formMessage.classList.remove('hidden', 'bg-green-100', 'text-green-800');
                    elements.formMessage.classList.add('bg-red-100', 'text-red-800', 'dark:bg-red-900/30', 'dark:text-red-300');
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
