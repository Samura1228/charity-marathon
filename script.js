/* ============================================
   LIMASSOL CHARITY RUN — JAVASCRIPT
   ============================================ */

(function () {
    'use strict';

    // ========================================
    // 1. COUNTDOWN TIMER
    // ========================================
    const targetDate = new Date('2026-10-11T08:00:00+03:00').getTime();

    function updateCountdown() {
        const now = Date.now();
        const diff = targetDate - now;

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

        if (diff <= 0) {
            daysEl.textContent = '0';
            hoursEl.textContent = '0';
            minutesEl.textContent = '0';
            secondsEl.textContent = '0';

            // Replace countdown with "Race started" message
            const countdown = document.getElementById('countdown');
            if (countdown) {
                const isRu = document.body.classList.contains('ru');
                countdown.innerHTML = '<div class="countdown-item" style="min-width:auto;padding:20px 40px;"><span class="countdown-number" style="font-size:1.5rem;">' +
                    (isRu ? 'Забег начался!' : 'The race has started!') +
                    '</span></div>';
            }
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(3, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ========================================
    // 2. LANGUAGE TOGGLE
    // ========================================
    const langToggle = document.getElementById('lang-toggle');

    function setLanguage(lang) {
        if (lang === 'ru') {
            document.body.classList.add('ru');
            if (langToggle) langToggle.textContent = 'RU';
        } else {
            document.body.classList.remove('ru');
            if (langToggle) langToggle.textContent = 'EN';
        }
        localStorage.setItem('lcr-lang', lang);
    }

    // Load saved preference
    const savedLang = localStorage.getItem('lcr-lang');
    if (savedLang) {
        setLanguage(savedLang);
    }

    if (langToggle) {
        langToggle.addEventListener('click', function () {
            const isRu = document.body.classList.contains('ru');
            setLanguage(isRu ? 'en' : 'ru');
        });
    }

    // ========================================
    // 3. MOBILE MENU TOGGLE
    // ========================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a nav link is clicked
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ========================================
    // 4. STICKY NAVIGATION
    // ========================================
    const navbar = document.getElementById('navbar');

    function handleScroll() {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ========================================
    // 5. FAQ ACCORDION
    // ========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        const question = item.querySelector('.faq-question');
        if (!question) return;

        // Set initial aria state
        question.setAttribute('aria-expanded', 'false');

        question.addEventListener('click', function () {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(function (otherItem) {
                otherItem.classList.remove('active');
                var otherBtn = otherItem.querySelector('.faq-question');
                if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ========================================
    // 6. SCROLL ANIMATIONS (IntersectionObserver)
    // ========================================
    const fadeElements = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback: show all elements
        fadeElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // ========================================
    // 7. ACTIVE NAV LINK HIGHLIGHTING
    // ========================================
    const sections = document.querySelectorAll('section[id]');
    const allNavLinks = document.querySelectorAll('.nav-link');

    function highlightNavLink() {
        const scrollPos = window.scrollY + 120;

        sections.forEach(function (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                allNavLinks.forEach(function (link) {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    if (href === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink, { passive: true });

    // ========================================
    // 8. REGISTRATION FORM — NETLIFY FUNCTION
    // ========================================
    const registrationForm = document.getElementById('registration-form');
    const formSuccess = document.getElementById('form-success');

    if (registrationForm) {
        registrationForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Validate all required fields
            const firstName = document.getElementById('firstName');
            const lastName = document.getElementById('lastName');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const distance = document.getElementById('distance');
            const tshirtSize = document.getElementById('tshirtSize');
            const emergencyName = document.getElementById('emergencyName');
            const emergencyPhone = document.getElementById('emergencyPhone');
            const terms = document.getElementById('terms');

            const requiredFields = [firstName, lastName, email, phone, distance, tshirtSize, emergencyName, emergencyPhone];
            let isValid = true;

            // Remove previous error styles
            requiredFields.forEach(function (field) {
                field.style.borderColor = '';
            });

            // Check each field
            requiredFields.forEach(function (field) {
                if (!field.value || field.value.trim() === '') {
                    field.style.borderColor = 'var(--accent)';
                    isValid = false;
                }
            });

            // Validate email format
            if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                email.style.borderColor = 'var(--accent)';
                isValid = false;
            }

            // Check terms
            if (!terms.checked) {
                isValid = false;
                const isRu = document.body.classList.contains('ru');
                alert(isRu ? 'Пожалуйста, примите условия.' : 'Please agree to the terms and conditions.');
                return;
            }

            if (!isValid) {
                const isRu = document.body.classList.contains('ru');
                alert(isRu ? 'Пожалуйста, заполните все обязательные поля.' : 'Please fill in all required fields.');
                return;
            }

            // Collect form data
            const formData = {
                firstName: firstName.value.trim(),
                lastName: lastName.value.trim(),
                email: email.value.trim(),
                phone: phone.value.trim(),
                distance: distance.value,
                tshirtSize: tshirtSize.value,
                emergencyName: emergencyName.value.trim(),
                emergencyPhone: emergencyPhone.value.trim(),
                registrationDate: new Date().toISOString(),
                language: document.body.classList.contains('ru') ? 'RU' : 'EN'
            };

            // Show loading state
            const submitBtn = registrationForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            const isRuLang = document.body.classList.contains('ru');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + (isRuLang ? 'Обработка...' : 'Processing...');
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Supabase configuration
            var SUPABASE_URL = 'https://rugxsvceksogunhqxwxd.supabase.co';
            var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1Z3hzdmNla3NvZ3VuaHF4d3hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MjYzODQsImV4cCI6MjA5MjAwMjM4NH0.FrOhyTeicRZW_mXse28zm6XDJALbhj0obB5qfHJNv78';

            try {
                // Send registration directly to Supabase (works on ALL devices)
                var response = await fetch(SUPABASE_URL + '/rest/v1/registrations', {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': 'Bearer ' + SUPABASE_KEY,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        email: formData.email,
                        phone: formData.phone,
                        distance: formData.distance,
                        tshirt_size: formData.tshirtSize,
                        emergency_name: formData.emergencyName,
                        emergency_phone: formData.emergencyPhone,
                        registration_date: formData.registrationDate,
                        language: formData.language
                    })
                });

                if (!response.ok) {
                    var errorText = await response.text();
                    console.error('Supabase error:', response.status, errorText);
                    throw new Error('Registration failed: ' + response.status);
                }

                // Success — show payment selection
                registrationForm.style.display = 'none';
                var paymentSelection = document.getElementById('payment-selection');
                if (paymentSelection) {
                    paymentSelection.style.display = 'block';
                }
            } catch (error) {
                console.error('Registration error:', error);
                var isRu2 = document.body.classList.contains('ru');
                alert(isRu2 ? 'Ошибка регистрации. Пожалуйста, попробуйте снова.' : 'Registration failed. Please try again.');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }
        });
    }

    // ========================================
    // 9. PROGRESS BAR ANIMATION ON SCROLL
    // ========================================
    const progressBar = document.getElementById('progress-bar');

    if (progressBar && 'IntersectionObserver' in window) {
        // Reset width initially
        progressBar.style.width = '0%';
        progressBar.style.animation = 'none';

        const progressObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    progressBar.style.transition = 'width 2s ease';
                    progressBar.style.width = '28%';
                    progressObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });

        progressObserver.observe(progressBar.closest('.progress-card') || progressBar);
    }

})();