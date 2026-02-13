import './style.css';
import { publications, services } from './data.js';

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
    renderPublications();
    renderServices();
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
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Filter Buttons
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

    // Year Sort
    elements.yearSort.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        renderPublications();
    });

    // Mobile Menu
    elements.mobileMenuBtn.addEventListener('click', () => {
        elements.mobileMenu.classList.toggle('hidden');
        const icon = elements.mobileMenuBtn.querySelector('i');
        if (elements.mobileMenu.classList.contains('hidden')) {
            icon.classList.replace('fa-times', 'fa-bars');
        } else {
            icon.classList.replace('fa-bars', 'fa-times');
        }
    });

    // Smooth Scroll Highlighting
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

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active', 'text-blue-600', 'dark:text-blue-400');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active', 'text-blue-600', 'dark:text-blue-400');
            }
        });
    });

    // Contact Form (Formspree)
    elements.contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(elements.contactForm);
        const form = e.target;

        // UI Loading State
        const submitBtn = form.querySelector('button[type="submit"]');
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
                elements.formMessage.classList.remove('hidden', 'bg-red-100', 'text-red-800');
                elements.formMessage.classList.add('bg-green-100', 'text-green-800', 'dark:bg-green-900/30', 'dark:text-green-300');
                elements.formMessage.innerHTML = '<i class="fas fa-check-circle mr-2"></i> Message sent successfully! I will get back to you soon.';
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            elements.formMessage.classList.remove('hidden', 'bg-green-100', 'text-green-800');
            elements.formMessage.classList.add('bg-red-100', 'text-red-800', 'dark:bg-red-900/30', 'dark:text-red-300');
            elements.formMessage.innerHTML = '<i class="fas fa-exclamation-circle mr-2"></i> Oops! There was a problem sending your message. Please try again.';
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            setTimeout(() => elements.formMessage.classList.add('hidden'), 5000);
        }
    });
}

// Start App
init();
