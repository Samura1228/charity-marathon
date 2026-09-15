/* ============================================
   LIMASSOL CHARITY RUN — JAVASCRIPT
   ============================================ */

/* ============================================
   CONFIGURATION — edit these, nothing else needs to change
   ============================================ */

// Start of the free community run (Asia/Nicosia is UTC+3 in October).
// The countdown targets this and hides itself once it has passed.
var EVENT_START = '2026-10-11T08:30:00+03:00';

// Where sign-ups are delivered. This is a Supabase table; the anon key is
// public by design (row-level security only allows inserts). If you switch to
// another service, change sendRegistration() below and these two constants.
var SUPABASE_URL = 'https://rugxsvceksogunhqxwxd.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1Z3hzdmNla3NvZ3VuaHF4d3hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MjYzODQsImV4cCI6MjA5MjAwMjM4NH0.FrOhyTeicRZW_mXse28zm6XDJALbhj0obB5qfHJNv78';
var SUPABASE_TABLE = 'registrations';

// Page title and description per language (the <title>/<meta> in the HTML are
// the English defaults; these are swapped in when the visitor toggles language).
var PAGE_META = {
    en: {
        title: 'Limassol Charity Run — free community run 11 Oct 2026, charity race 22 May 2027',
        description: 'A charity run on the Limassol seafront raising money for a playground everyone can use. Free community run on 11 October 2026; 5 km and 10 km race on 22 May 2027.'
    },
    ru: {
        title: 'Limassol Charity Run — бесплатный забег 11 октября 2026, благотворительный забег 22 мая 2027',
        description: 'Благотворительный забег по набережной Лимассола в поддержку доступной спортивной площадки. Бесплатный забег 11 октября 2026, дистанции 5 и 10 км — 22 мая 2027.'
    }
};

(function () {
    'use strict';

    function isRussian() {
        return document.body.classList.contains('ru');
    }

    // ========================================
    // 1. COUNTDOWN TIMER
    // ========================================
    var countdownEl = document.getElementById('countdown');
    var daysEl = document.getElementById('days');
    var hoursEl = document.getElementById('hours');
    var minutesEl = document.getElementById('minutes');
    var secondsEl = document.getElementById('seconds');

    // Parse the ISO string; fall back to the same instant built by hand in case
    // an old browser can't parse the timezone offset.
    var targetTime = Date.parse(EVENT_START);
    if (isNaN(targetTime)) {
        targetTime = Date.UTC(2026, 9, 11, 5, 30, 0); // 08:30 +03:00
    }

    var countdownTimer = null;

    function pad(n) {
        return String(n).padStart(2, '0');
    }

    function updateCountdown() {
        if (!countdownEl || !daysEl || !hoursEl || !minutesEl || !secondsEl) return;

        var diff = targetTime - Date.now();

        if (diff <= 0) {
            // The run has started — hide the timer rather than show zeros.
            countdownEl.style.display = 'none';
            if (countdownTimer) {
                clearInterval(countdownTimer);
                countdownTimer = null;
            }
            return;
        }

        var totalSeconds = Math.floor(diff / 1000);
        var days = Math.floor(totalSeconds / 86400);
        var hours = Math.floor((totalSeconds % 86400) / 3600);
        var minutes = Math.floor((totalSeconds % 3600) / 60);
        var seconds = totalSeconds % 60;

        daysEl.textContent = pad(days);
        hoursEl.textContent = pad(hours);
        minutesEl.textContent = pad(minutes);
        secondsEl.textContent = pad(seconds);
    }

    updateCountdown();
    if (countdownEl && countdownEl.style.display !== 'none') {
        countdownTimer = setInterval(updateCountdown, 1000);
    }

    // ========================================
    // 2. LANGUAGE TOGGLE
    // ========================================
    var langToggle = document.getElementById('lang-toggle');
    var metaDescription = document.querySelector('meta[name="description"]');

    function setLanguage(lang) {
        var isRu = lang === 'ru';
        var meta = isRu ? PAGE_META.ru : PAGE_META.en;

        document.body.classList.toggle('ru', isRu);
        document.documentElement.setAttribute('lang', isRu ? 'ru' : 'en');
        document.title = meta.title;
        if (metaDescription) metaDescription.setAttribute('content', meta.description);
        if (langToggle) langToggle.textContent = isRu ? 'RU' : 'EN';

        try {
            localStorage.setItem('lcr-lang', isRu ? 'ru' : 'en');
        } catch (e) { /* storage unavailable — fine */ }
    }

    // Load saved preference
    var savedLang = null;
    try {
        savedLang = localStorage.getItem('lcr-lang');
    } catch (e) { /* storage unavailable — fine */ }
    if (savedLang === 'ru') {
        setLanguage('ru');
    }

    if (langToggle) {
        langToggle.addEventListener('click', function () {
            setLanguage(isRussian() ? 'en' : 'ru');
        });
    }

    // ========================================
    // 3. MOBILE MENU TOGGLE
    // ========================================
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a nav link is clicked
        navMenu.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ========================================
    // 4. STICKY NAVIGATION
    // ========================================
    var navbar = document.getElementById('navbar');

    function handleScroll() {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ========================================
    // 5. FAQ ACCORDION
    // ========================================
    var faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        var question = item.querySelector('.faq-question');
        if (!question) return;

        question.setAttribute('aria-expanded', 'false');

        question.addEventListener('click', function () {
            var isActive = item.classList.contains('active');

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
    var fadeElements = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
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
    var sections = document.querySelectorAll('section[id]');
    var allNavLinks = document.querySelectorAll('.nav-link');

    function highlightNavLink() {
        var scrollPos = window.scrollY + 120;

        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                allNavLinks.forEach(function (link) {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink, { passive: true });

    // ========================================
    // 8. SIGN-UP FORM (free community run)
    // ========================================
    var registrationForm = document.getElementById('registration-form');
    var formSuccess = document.getElementById('form-success');
    var formError = document.getElementById('form-error');
    var formErrorText = document.getElementById('form-error-text');

    var FORM_MESSAGES = {
        en: {
            missing: 'Please fill in the required fields.',
            email: 'Please check your email address.',
            failed: 'Something went wrong and your place wasn\'t saved. Your details are still here — please try again, or email info@limassolcharityrun.com.',
            sending: 'Sending…'
        },
        ru: {
            missing: 'Пожалуйста, заполните обязательные поля.',
            email: 'Пожалуйста, проверьте адрес электронной почты.',
            failed: 'Что-то пошло не так, и место не сохранилось. Ваши данные на месте — попробуйте ещё раз или напишите на info@limassolcharityrun.com.',
            sending: 'Отправляем…'
        }
    };

    function showFormError(key) {
        if (!formError || !formErrorText) return;
        var messages = isRussian() ? FORM_MESSAGES.ru : FORM_MESSAGES.en;
        formErrorText.textContent = messages[key];
        formError.hidden = false;
    }

    function hideFormError() {
        if (formError) formError.hidden = true;
    }

    function markInvalid(el, invalid) {
        if (!el) return;
        el.classList.toggle('is-invalid', invalid);
    }

    // POST one registration row. Returns the fetch Response.
    function sendRegistration(row) {
        return fetch(SUPABASE_URL + '/rest/v1/' + SUPABASE_TABLE, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': 'Bearer ' + SUPABASE_KEY,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(row)
        });
    }

    if (registrationForm) {
        registrationForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            hideFormError();

            var fullName = document.getElementById('fullName');
            var email = document.getElementById('email');
            var phone = document.getElementById('phone');
            var heardFrom = document.getElementById('heardFrom');
            var distanceGroup = document.getElementById('distance-group');
            var distanceInput = registrationForm.querySelector('input[name="distance"]:checked');

            // --- Validate ---
            var valid = true;

            [fullName, email, heardFrom].forEach(function (field) {
                var empty = !field || !field.value || field.value.trim() === '';
                markInvalid(field, empty);
                if (empty) valid = false;
            });

            markInvalid(distanceGroup, !distanceInput);
            if (!distanceInput) valid = false;

            if (!valid) {
                showFormError('missing');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
                markInvalid(email, true);
                showFormError('email');
                return;
            }

            // --- Build the row ---
            // The table has first_name / last_name columns, so split on the first space.
            var nameParts = fullName.value.trim().split(/\s+/);
            var row = {
                first_name: nameParts.shift(),
                last_name: nameParts.join(' '),
                email: email.value.trim(),
                phone: phone && phone.value ? phone.value.trim() : '',
                distance: distanceInput.value,
                heard_from: heardFrom.value.trim(),
                registration_date: new Date().toISOString(),
                language: isRussian() ? 'RU' : 'EN'
            };

            // --- Loading state ---
            var submitBtn = registrationForm.querySelector('button[type="submit"]');
            var originalHtml = submitBtn.innerHTML;
            var messages = isRussian() ? FORM_MESSAGES.ru : FORM_MESSAGES.en;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + messages.sending;
            submitBtn.disabled = true;

            try {
                var response = await sendRegistration(row);

                // If the heard_from column hasn't been added to the table yet, the
                // API rejects the whole row. Don't lose the sign-up over one field:
                // retry without it and log a warning for the site owner.
                if (response.status === 400) {
                    var bodyText = await response.text();
                    if (bodyText.indexOf('heard_from') !== -1) {
                        console.warn('registrations.heard_from column is missing — run the ALTER TABLE in supabase-setup.sql. Retrying without it.');
                        delete row.heard_from;
                        response = await sendRegistration(row);
                    } else {
                        console.error('Registration rejected:', response.status, bodyText);
                    }
                }

                if (!response.ok) {
                    throw new Error('Registration failed: ' + response.status);
                }

                // Success — swap the form for the confirmation
                registrationForm.style.display = 'none';
                if (formSuccess) {
                    formSuccess.style.display = 'block';
                    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } catch (error) {
                // Leave every field exactly as the person typed it.
                console.error('Registration error:', error);
                showFormError('failed');
            } finally {
                submitBtn.innerHTML = originalHtml;
                submitBtn.disabled = false;
            }
        });

        // Clear the red outline as soon as someone starts fixing a field
        registrationForm.addEventListener('input', function (e) {
            if (e.target && e.target.classList) markInvalid(e.target, false);
            if (e.target && e.target.name === 'distance') {
                markInvalid(document.getElementById('distance-group'), false);
            }
        });
    }

    // ========================================
    // 9. FUNDRAISING PROGRESS BAR
    // ========================================
    // Removed for now along with the progress card in index.html. When the card
    // comes back, animate #progress-bar's width here on scroll into view.

})();
