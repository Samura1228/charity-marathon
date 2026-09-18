/* ============================================================
   LIMASSOL CHARITY RUN — app.js
   1. translations   2. language toggle   3. countdown
   4. header/menu    5. sign-up form
   ============================================================ */
(function () {
    'use strict';

    /* ---------- Config ---------- */
    var SUPABASE_URL = 'https://rugxsvceksogunhqxwxd.supabase.co/rest/v1/registrations';
    var SUPABASE_KEY = 'sb_publishable_cl593if7NYgdCHA7mCiCRA_Ch69Q9-I'; // publishable key — safe in client code

    // Sunday 11 October 2026, 08:30 Europe/Nicosia (EEST, UTC+3) = 05:30 UTC
    var RUN_START_UTC = Date.UTC(2026, 9, 11, 5, 30, 0);
    var RUN_MEET_UTC = Date.UTC(2026, 9, 11, 5, 0, 0);
    var RUN_END_UTC = Date.UTC(2026, 9, 11, 7, 0, 0);

    var PAGE_LOADED_AT = Date.now();
    var MIN_FILL_MS = 2000;

    /* ---------- 1. Translations ---------- */
    var I18N = {
        en: {
            'meta.title': 'Limassol Charity Run — free community run, 11 October 2026',
            'meta.description': 'A free community run on the Limassol seafront on Sunday 11 October 2026, and a charity 5 km and 10 km race in spring 2027 raising money for a playground everyone can use.',

            'a11y.skip': 'Skip to content',
            'a11y.home': 'Limassol Charity Run — home',
            'a11y.language': 'Language',
            'a11y.events': 'Events',
            'a11y.glance': 'At a glance',

            'nav.run': 'The run',
            'nav.course': 'Course',
            'nav.race': '2027',
            'nav.involved': 'Get involved',
            'nav.faq': 'FAQ',
            'nav.menu': 'Menu',
            'nav.close': 'Close',

            'hero.eyebrow': 'Limassol · Cyprus',
            'hero.title': 'Run the seafront. For a playground everyone can use.',
            'hero.sub': 'We start with a free community run on Sunday 11 October. In spring 2027 it becomes a charity race — 5 km and 10 km along the Limassol seafront.',
            'hero.cta1': 'Reserve a free place',
            'hero.cta2': 'About the 2027 race',
            'countdown.line': '{days} · {hours} to the community run',
            'countdown.day': ['day', 'days'],
            'countdown.hour': ['hour', 'hours'],

            'card1.date': 'Sunday 11 October 2026',
            'card1.title': 'Free community run',
            'card1.text': 'About 5 km on the seafront path, plus a 1 km loop for families. No timing, no entry fee, every pace welcome.',
            'card1.link': 'Sign up',
            'card2.date': 'Spring 2027',
            'card2.title': 'The charity race',
            'card2.text': '5 km, 10 km and a children\'s race, chip-timed, raising money for an accessible sports playground. Date confirmed with the city soon.',
            'card2.link': 'Read more',

            'facts.title': 'The run on 11 October',
            'facts.date': 'Date',
            'facts.date.v': 'Sunday 11 October 2026',
            'facts.meet': 'Meet',
            'facts.meet.v': '08:00',
            'facts.start': 'Start',
            'facts.start.v': '08:30',
            'facts.distance': 'Distance',
            'facts.distance.v': '≈ 5 km, plus a 1 km family loop',
            'facts.entry': 'Entry',
            'facts.entry.v': 'Free',
            'facts.places': 'Places',
            'facts.places.v': '150',
            'facts.where': 'Where',
            'facts.where.v': 'Limassol seafront path — meeting point emailed to you',

            'course.title': 'Out 2.5 km. Turn. Home.',
            'course.sub': 'Flat, paved, and free of cars the whole way.',
            'course.svg.title': 'Course diagram: out 2.5 km along the seafront, turn, and return the same way',
            'course.svg.startfinish': 'Start · Finish',
            'course.svg.turn': 'Turn',
            'course.note1': 'Surface — paved promenade',
            'course.note2': 'Climb — about 0 m',
            'course.note3': 'Traffic — none, pedestrian path',
            'course.note4': 'Water — at start and finish',

            'cause.title': 'Why we run',
            'cause.p1': 'Most playgrounds have a step, a gate, or sand at the entrance. That is enough to keep a child in a wheelchair on the outside, watching.',
            'cause.p2': 'We are raising money for a sports playground in Limassol built so that nobody is left on the outside. The organisation that will receive the money is being confirmed now.',
            'cause.note': 'Every euro raised will be published here, with the name of the organisation that receives it.',

            'race.title': 'The charity race, spring 2027',
            'race.d10': '<strong>10 km</strong> — the full seafront course, chip-timed.',
            'race.d5': '<strong>5 km</strong> — the shorter course, for first-timers and corporate teams.',
            'race.d1': '<strong>1 km</strong> — the children\'s race.',
            'race.chip1': 'Spring 2027',
            'race.chip2': 'Chip timed',
            'race.chip3': 'Medal & t-shirt',
            'race.chip4': 'Registration opens later',
            'race.note': 'The route and start times are being agreed with the Municipality and the Police.',

            'involved.title': 'Build it with us',
            'involved.clubs': '<strong>Running clubs</strong> — co-host the monthly runs, lead pace groups, help shape the course.',
            'involved.companies': '<strong>Local companies</strong> — become a founding partner, or enter a corporate team in the 2027 race.',
            'involved.volunteers': '<strong>Volunteers</strong> — marshal the course, hand out water, take photos. Ten people make the October run happen.',
            'involved.link': 'Write to us',

            'faq.title': 'Questions',
            'faq.q1': 'Is the October run really free?',
            'faq.a1': 'Yes. No entry fee, no timing, no pressure. Sign up so we know how many people to expect.',
            'faq.q2': 'Can children take part?',
            'faq.a2': 'Yes, with a parent or guardian running or walking with them. The 1 km loop is made for families.',
            'faq.q3': 'Is it accessible?',
            'faq.a3': 'The seafront path is flat and paved, with no cars. Wheelchair users and buggies are welcome on the 1 km loop.',
            'faq.q4': 'What do I need to bring?',
            'faq.a4': 'Water and something to keep the sun off. There is water at the start and finish.',
            'faq.q5': 'Where does the money go?',
            'faq.a5': 'Nothing is collected in October. From the 2027 race, every donation goes to the playground project and we publish the total and the recipient.',
            'faq.q6': 'What if the weather is bad?',
            'faq.a6': 'If it is not safe to run we will email everyone who signed up by 18:00 the evening before.',
            'faq.q7': 'When can I enter the 2027 race?',
            'faq.a7': 'Registration opens in spring, before the race. Sign up for the October run and you will hear first.',

            'form.title': 'Reserve your place',
            'form.sub': 'Free, and capped at 150 people so the path stays comfortable.',
            'form.first': 'First name',
            'form.last': 'Last name',
            'form.email': 'Email',
            'form.phone': 'Phone (optional)',
            'form.phone.placeholder': '+357 …',
            'form.distance': 'Which distance?',
            'form.d5': '5 km run',
            'form.d1': '1 km family loop',
            'form.heard': 'Where did you hear about us? (optional)',
            'form.heard.choose': 'Choose…',
            'form.heard.friend': 'A friend',
            'form.heard.club': 'Running club',
            'form.heard.instagram': 'Instagram',
            'form.heard.facebook': 'Facebook',
            'form.heard.search': 'Search',
            'form.heard.other': 'Other',
            'form.submit': 'Reserve my place',
            'form.sending': 'Sending…',
            'form.success.title': 'You\'re in.',
            'form.success.body': 'We\'ll email the meeting point a few days before Sunday 11 October. See you on the seafront.',
            'form.error': 'Something went wrong. Please write to info@limassolcharityrun.com and we\'ll add you by hand.',
            'form.calendar': 'Add to calendar',
            'form.v.required': 'Please fill this in.',
            'form.v.email': 'Please enter a valid email address.',
            'form.v.distance': 'Please choose a distance.',
            'form.v.fix': 'Please check the highlighted fields.',

            'ics.summary': 'Limassol Charity Run — free community run',
            'ics.location': 'Limassol seafront path',
            'ics.description': 'Meet 08:00, start 08:30. The meeting point is emailed to everyone who signs up.',

            'footer.desc': 'Limassol Charity Run — a community running event on the seafront in Limassol, Cyprus.'
        },

        ru: {
            'meta.title': 'Limassol Charity Run — бесплатный забег, 11 октября 2026',
            'meta.description': 'Бесплатный забег по набережной Лимассола в воскресенье, 11 октября 2026, и благотворительный забег на 5 и 10 км весной 2027 года в поддержку площадки, доступной каждому.',

            'a11y.skip': 'К содержанию',
            'a11y.home': 'Limassol Charity Run — на главную',
            'a11y.language': 'Язык',
            'a11y.events': 'События',
            'a11y.glance': 'Коротко',

            'nav.run': 'Забег',
            'nav.course': 'Маршрут',
            'nav.race': '2027',
            'nav.involved': 'Участвовать',
            'nav.faq': 'Вопросы',
            'nav.menu': 'Меню',
            'nav.close': 'Закрыть',

            'hero.eyebrow': 'Лимассол · Кипр',
            'hero.title': 'Беги по набережной. Ради площадки, доступной каждому.',
            'hero.sub': 'Начинаем с бесплатного забега в воскресенье, 11 октября. Весной 2027 года он станет благотворительным забегом — 5 и 10 км по набережной Лимассола.',
            'hero.cta1': 'Забронировать место',
            'hero.cta2': 'О забеге 2027 года',
            'countdown.line': '{days} · {hours} до забега',
            'countdown.day': ['день', 'дня', 'дней'],
            'countdown.hour': ['час', 'часа', 'часов'],

            'card1.date': 'Воскресенье, 11 октября 2026',
            'card1.title': 'Бесплатный забег для всех',
            'card1.text': 'Около 5 км по набережной плюс круг 1 км для семей. Без хронометража, без взноса, для любого уровня.',
            'card1.link': 'Зарегистрироваться',
            'card2.date': 'Весна 2027',
            'card2.title': 'Благотворительный забег',
            'card2.text': '5 км, 10 км и детский забег с хронометражем — в поддержку доступной спортивной площадки. Дату согласуем с городом.',
            'card2.link': 'Подробнее',

            'facts.title': 'Забег 11 октября',
            'facts.date': 'Дата',
            'facts.date.v': 'Воскресенье, 11 октября 2026',
            'facts.meet': 'Сбор',
            'facts.meet.v': '08:00',
            'facts.start': 'Старт',
            'facts.start.v': '08:30',
            'facts.distance': 'Дистанция',
            'facts.distance.v': '≈ 5 км плюс круг 1 км для семей',
            'facts.entry': 'Участие',
            'facts.entry.v': 'Бесплатно',
            'facts.places': 'Мест',
            'facts.places.v': '150',
            'facts.where': 'Где',
            'facts.where.v': 'Набережная Лимассола — точку сбора пришлём по почте',

            'course.title': '2,5 км туда. Разворот. Обратно.',
            'course.sub': 'Ровно, с твёрдым покрытием и без машин на всём пути.',
            'course.svg.title': 'Схема маршрута: 2,5 км по набережной, разворот и возвращение тем же путём',
            'course.svg.startfinish': 'Старт · Финиш',
            'course.svg.turn': 'Разворот',
            'course.note1': 'Покрытие — набережная',
            'course.note2': 'Набор высоты — около 0 м',
            'course.note3': 'Движение — нет, пешеходная зона',
            'course.note4': 'Вода — на старте и финише',

            'cause.title': 'Зачем мы бежим',
            'cause.p1': 'У большинства площадок есть ступенька, калитка или песок у входа. Этого достаточно, чтобы ребёнок в коляске остался снаружи и просто смотрел.',
            'cause.p2': 'Мы собираем деньги на спортивную площадку в Лимассоле, устроенную так, чтобы снаружи не остался никто. Организацию-получателя мы согласовываем сейчас.',
            'cause.note': 'Каждый собранный евро будет опубликован здесь вместе с названием организации, которая его получает.',

            'race.title': 'Благотворительный забег, весна 2027',
            'race.d10': '<strong>10 км</strong> — полная дистанция по набережной, с хронометражем.',
            'race.d5': '<strong>5 км</strong> — короткая дистанция для новичков и корпоративных команд.',
            'race.d1': '<strong>1 км</strong> — детский забег.',
            'race.chip1': 'Весна 2027',
            'race.chip2': 'С хронометражем',
            'race.chip3': 'Медаль и футболка',
            'race.chip4': 'Регистрация откроется позже',
            'race.note': 'Маршрут и время старта согласовываются с Муниципалитетом и Полицией.',

            'involved.title': 'Сделаем это вместе',
            'involved.clubs': '<strong>Беговые клубы</strong> — проводите забеги вместе с нами, ведите группы по темпу, помогите с маршрутом.',
            'involved.companies': '<strong>Местные компании</strong> — станьте партнёром-основателем или выставьте корпоративную команду в 2027 году.',
            'involved.volunteers': '<strong>Волонтёры</strong> — помощь на трассе, вода, фотографии. Десять человек делают октябрьский забег возможным.',
            'involved.link': 'Напишите нам',

            'faq.title': 'Вопросы и ответы',
            'faq.q1': 'Октябрьский забег правда бесплатный?',
            'faq.a1': 'Да. Ни взноса, ни хронометража, ни давления. Зарегистрируйтесь, чтобы мы знали, сколько человек ждать.',
            'faq.q2': 'Можно с детьми?',
            'faq.a2': 'Да, вместе с родителем или взрослым. Круг 1 км сделан как раз для семей.',
            'faq.q3': 'Насколько доступен маршрут?',
            'faq.a3': 'Набережная ровная, с твёрдым покрытием и без машин. На круге 1 км ждём и коляски, и людей на колясках.',
            'faq.q4': 'Что взять с собой?',
            'faq.a4': 'Воду и что-то от солнца. Вода будет на старте и финише.',
            'faq.q5': 'Куда идут деньги?',
            'faq.a5': 'В октябре мы ничего не собираем. С забега 2027 года все пожертвования идут на проект площадки, а итоговую сумму и получателя мы публикуем.',
            'faq.q6': 'А если погода испортится?',
            'faq.a6': 'Если бежать будет небезопасно, мы напишем всем зарегистрированным до 18:00 накануне.',
            'faq.q7': 'Когда можно зарегистрироваться на забег 2027?',
            'faq.a7': 'Регистрация откроется весной, до забега. Зарегистрируйтесь на октябрьский забег — сообщим первыми.',

            'form.title': 'Забронируйте место',
            'form.sub': 'Бесплатно, не более 150 человек — чтобы всем было комфортно на набережной.',
            'form.first': 'Имя',
            'form.last': 'Фамилия',
            'form.email': 'Email',
            'form.phone': 'Телефон (необязательно)',
            'form.phone.placeholder': '+357 …',
            'form.distance': 'Какая дистанция?',
            'form.d5': '5 км бег',
            'form.d1': '1 км для семей',
            'form.heard': 'Откуда вы о нас узнали? (необязательно)',
            'form.heard.choose': 'Выберите…',
            'form.heard.friend': 'От друзей',
            'form.heard.club': 'Беговой клуб',
            'form.heard.instagram': 'Instagram',
            'form.heard.facebook': 'Facebook',
            'form.heard.search': 'Поиск',
            'form.heard.other': 'Другое',
            'form.submit': 'Забронировать место',
            'form.sending': 'Отправляем…',
            'form.success.title': 'Вы в списке.',
            'form.success.body': 'Пришлём точку сбора за несколько дней до воскресенья 11 октября. До встречи на набережной.',
            'form.error': 'Что-то пошло не так. Напишите на info@limassolcharityrun.com — добавим вручную.',
            'form.calendar': 'Добавить в календарь',
            'form.v.required': 'Заполните это поле.',
            'form.v.email': 'Введите корректный адрес электронной почты.',
            'form.v.distance': 'Выберите дистанцию.',
            'form.v.fix': 'Проверьте выделенные поля.',

            'ics.summary': 'Limassol Charity Run — бесплатный забег',
            'ics.location': 'Набережная Лимассола',
            'ics.description': 'Сбор 08:00, старт 08:30. Точку сбора пришлём всем зарегистрированным по почте.',

            'footer.desc': 'Limassol Charity Run — общественный забег по набережной в Лимассоле, Кипр.'
        }
    };

    var lang = 'en';

    function t(key) {
        var dict = I18N[lang] || I18N.en;
        return (key in dict) ? dict[key] : (I18N.en[key] !== undefined ? I18N.en[key] : key);
    }

    // Russian has three plural forms; English two.
    function plural(n, forms) {
        if (forms.length === 2) return forms[n === 1 ? 0 : 1];
        var m10 = n % 10, m100 = n % 100;
        if (m10 === 1 && m100 !== 11) return forms[0];
        if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return forms[1];
        return forms[2];
    }

    /* ---------- 2. Language toggle ---------- */
    var metaDescription = document.querySelector('meta[name="description"]');

    function applyLanguage(next) {
        lang = (next === 'ru') ? 'ru' : 'en';
        var dict = I18N[lang];

        document.documentElement.lang = lang;
        document.title = dict['meta.title'];
        if (metaDescription) metaDescription.setAttribute('content', dict['meta.description']);

        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            el.textContent = t(el.getAttribute('data-i18n'));
        });
        document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
            el.innerHTML = t(el.getAttribute('data-i18n-html')); // author-controlled markup only
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
        });
        document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
            el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
        });
        document.querySelectorAll('.lang-btn').forEach(function (btn) {
            btn.setAttribute('aria-pressed', btn.getAttribute('data-lang') === lang ? 'true' : 'false');
        });

        try { localStorage.setItem('lcr-lang', lang); } catch (e) { /* storage unavailable */ }

        renderCountdown();
        refreshVisibleErrors();
        buildCalendarLink();
    }

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            applyLanguage(btn.getAttribute('data-lang'));
        });
    });

    /* ---------- 3. Countdown ---------- */
    var countdownEl = document.getElementById('countdown');
    var countdownTimer = null;

    function renderCountdown() {
        if (!countdownEl) return;
        var diff = RUN_START_UTC - Date.now();
        if (diff <= 0) {
            countdownEl.hidden = true;
            if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
            return;
        }
        var totalHours = Math.floor(diff / 3600000);
        var days = Math.floor(totalHours / 24);
        var hours = totalHours % 24;
        countdownEl.textContent = t('countdown.line')
            .replace('{days}', days + ' ' + plural(days, t('countdown.day')))
            .replace('{hours}', hours + ' ' + plural(hours, t('countdown.hour')));
        countdownEl.hidden = false;
    }

    if (countdownEl && RUN_START_UTC > Date.now()) {
        countdownTimer = setInterval(renderCountdown, 60000);
    }

    /* ---------- 4. Header and menu ---------- */
    var header = document.getElementById('site-header');
    var menuBtn = document.getElementById('menu-btn');
    var nav = document.getElementById('site-nav');

    function onScroll() {
        if (header) header.classList.toggle('is-scrolled', window.scrollY > 0);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    function setMenu(open) {
        if (!menuBtn || !nav) return;
        nav.classList.toggle('is-open', open);
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        menuBtn.querySelector('span').textContent = t(open ? 'nav.close' : 'nav.menu');
    }

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function () {
            setMenu(!nav.classList.contains('is-open'));
        });
        nav.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') setMenu(false);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                setMenu(false);
                menuBtn.focus();
            }
        });
    }

    /* ---------- 5. Sign-up form ---------- */
    var form = document.getElementById('signup-form');
    var submitBtn = document.getElementById('submit-btn');
    var statusEl = document.getElementById('form-status');
    var confirmEl = document.getElementById('confirm');
    var calendarLink = document.getElementById('calendar-link');

    var errorKeys = {}; // field id -> translation key of the error currently shown

    function setFieldError(id, key) {
        var errEl = document.getElementById('err-' + id);
        var fieldEl = errEl ? errEl.closest('.field') : null;
        if (key) {
            errorKeys[id] = key;
            if (errEl) { errEl.textContent = t(key); errEl.hidden = false; }
            if (fieldEl) fieldEl.classList.add('is-invalid');
            var input = document.getElementById(id);
            if (input) input.setAttribute('aria-invalid', 'true');
        } else {
            delete errorKeys[id];
            if (errEl) { errEl.textContent = ''; errEl.hidden = true; }
            if (fieldEl) fieldEl.classList.remove('is-invalid');
            var input2 = document.getElementById(id);
            if (input2) input2.removeAttribute('aria-invalid');
        }
    }

    // Re-translate any error currently on screen when the language changes
    function refreshVisibleErrors() {
        Object.keys(errorKeys).forEach(function (id) { setFieldError(id, errorKeys[id]); });
        if (statusEl && statusEl.getAttribute('data-key')) statusEl.textContent = t(statusEl.getAttribute('data-key'));
    }

    function setStatus(key) {
        if (!statusEl) return;
        if (key) { statusEl.setAttribute('data-key', key); statusEl.textContent = t(key); }
        else { statusEl.removeAttribute('data-key'); statusEl.textContent = ''; }
    }

    function value(id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }

    function validate() {
        var ok = true;

        ['first_name', 'last_name'].forEach(function (id) {
            if (!value(id)) { setFieldError(id, 'form.v.required'); ok = false; }
            else setFieldError(id, null);
        });

        var email = value('email');
        if (!email) { setFieldError('email', 'form.v.required'); ok = false; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setFieldError('email', 'form.v.email'); ok = false; }
        else setFieldError('email', null);

        if (!form.querySelector('input[name="distance"]:checked')) { setFieldError('distance', 'form.v.distance'); ok = false; }
        else setFieldError('distance', null);

        return ok;
    }

    function todayIso() {
        var d = new Date();
        var m = String(d.getMonth() + 1).padStart(2, '0');
        var day = String(d.getDate()).padStart(2, '0');
        return d.getFullYear() + '-' + m + '-' + day;
    }

    function showConfirmation() {
        form.hidden = true;
        buildCalendarLink();
        confirmEl.hidden = false;
        confirmEl.focus();
    }

    if (form) {
        // Clear an error as soon as the field is corrected
        form.addEventListener('input', function (e) {
            var el = e.target;
            if (!el) return;
            if (el.name === 'distance') setFieldError('distance', null);
            else if (el.id && errorKeys[el.id]) setFieldError(el.id, null);
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            setStatus(null);

            // Bot checks: honeypot filled, or submitted faster than a human could type.
            var honeypot = form.querySelector('input[name="website"]');
            if ((honeypot && honeypot.value) || (Date.now() - PAGE_LOADED_AT < MIN_FILL_MS)) {
                showConfirmation(); // reject silently
                return;
            }

            if (!validate()) {
                setStatus('form.v.fix');
                var firstBad = form.querySelector('.field.is-invalid input, .field.is-invalid select');
                if (firstBad && firstBad.focus) firstBad.focus();
                return;
            }

            var phone = value('phone');
            var heard = value('heard_from');
            var row = {
                first_name: value('first_name'),
                last_name: value('last_name'),
                email: value('email'),
                phone: phone ? phone : null,
                distance: form.querySelector('input[name="distance"]:checked').value,
                language: lang === 'ru' ? 'RU' : 'EN',
                heard_from: heard ? heard : null,
                registration_date: todayIso()
            };

            submitBtn.disabled = true;
            submitBtn.textContent = t('form.sending');

            fetch(SUPABASE_URL, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': 'Bearer ' + SUPABASE_KEY,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(row)
            }).then(function (res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                showConfirmation();
            }).catch(function (err) {
                // Keep everything the person typed; just tell them.
                if (window.console) console.error('Sign-up failed:', err);
                setStatus('form.error');
            }).finally(function () {
                submitBtn.disabled = false;
                submitBtn.textContent = t('form.submit');
            });
        });
    }

    /* Add-to-calendar: an .ics built on the fly for 11 Oct 2026, 08:00–10:00 Europe/Nicosia */
    function icsStamp(ms) {
        return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    }

    function icsEscape(s) {
        return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
    }

    function buildCalendarLink() {
        if (!calendarLink) return;
        var lines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Limassol Charity Run//EN',
            'CALSCALE:GREGORIAN',
            'BEGIN:VEVENT',
            'UID:free-run-2026-10-11@limassolcharityrun.com',
            'DTSTAMP:' + icsStamp(Date.now()),
            'DTSTART:' + icsStamp(RUN_MEET_UTC),
            'DTEND:' + icsStamp(RUN_END_UTC),
            'SUMMARY:' + icsEscape(t('ics.summary')),
            'LOCATION:' + icsEscape(t('ics.location')),
            'DESCRIPTION:' + icsEscape(t('ics.description')),
            'URL:https://limassolcharityrun.com/',
            'END:VEVENT',
            'END:VCALENDAR'
        ];
        calendarLink.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(lines.join('\r\n'));
    }

    /* ---------- Init ---------- */
    var saved = null;
    try { saved = localStorage.getItem('lcr-lang'); } catch (e) { /* storage unavailable */ }
    applyLanguage(saved === 'ru' ? 'ru' : 'en');
})();
