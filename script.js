document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle (Basic implementation)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            // A simple toggle, in a full implementation we'd add CSS classes to show/hide
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '80px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'var(--glass-bg)';
                navLinks.style.backdropFilter = 'blur(12px)';
                navLinks.style.padding = '2rem 0';
                navLinks.style.alignItems = 'center';
            }
        });
    }

    // Scroll Reveal Animation using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.05,
        rootMargin: "0px 0px -20px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
    
    // Projects Filtering and Search Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('project-search');
    const projectCards = document.querySelectorAll('.project-card');

    let activeFilter = 'all';
    let searchQuery = '';

    function filterProjects() {
        let visibleIndex = 0;
        projectCards.forEach((card) => {
            const cardCategory = card.getAttribute('data-category');
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            const cardDesc = card.querySelector('p').textContent.toLowerCase();
            const techTags = Array.from(card.querySelectorAll('.project-tech span'))
                .map(tag => tag.textContent.toLowerCase());
            
            const matchesCategory = activeFilter === 'all' || 
                (cardCategory && cardCategory.split(' ').includes(activeFilter));
            const matchesSearch = searchQuery === '' || 
                cardTitle.includes(searchQuery) || 
                cardDesc.includes(searchQuery) ||
                techTags.some(tag => tag.includes(searchQuery));

            if (matchesCategory && matchesSearch) {
                card.classList.remove('hide');
                
                // Stagger delay dynamically based only on visible cards (max 0.2s stagger)
                const delay = (visibleIndex % 3) * 0.1;
                card.style.transitionDelay = `${delay}s`;
                visibleIndex++;

                // Ensure card is active/visible if already scrolled past
                setTimeout(() => {
                    card.classList.add('active');
                }, 50);
            } else {
                card.classList.add('hide');
                card.style.transitionDelay = '0s';
            }
        });
    }

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeFilter = btn.getAttribute('data-filter');
                filterProjects();
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            filterProjects();
        });
    }

    // Run filterProjects once initially to strip hardcoded inline delays and apply snappy stagger
    filterProjects();

    // Form submission handling (prevent default for demo)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
            btn.style.background = '#00f3ff';
            btn.style.color = '#050810';
            
            setTimeout(() => {
                contactForm.reset();
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.color = '';
            }, 3000);
        });
    }
});
