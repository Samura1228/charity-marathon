/* ============================================================
   LIMASSOL CHARITY RUN — app.js
   1. translations   2. language toggle   3. header/menu
   4. sign-up form
   Legal pages add their own strings via window.LCR_LEGAL (legal.js).
   ============================================================ */
(function () {
    'use strict';

    /* ---------- Config ---------- */
    var SUPABASE_URL = 'https://rugxsvceksogunhqxwxd.supabase.co/rest/v1/registrations';
    var SUPABASE_KEY = 'sb_publishable_cl593if7NYgdCHA7mCiCRA_Ch69Q9-I'; // publishable key — safe in client code

    var PAGE_LOADED_AT = Date.now();
    var MIN_FILL_MS = 2000;

    /* ---------- 1. Translations ---------- */
    var I18N = {
        en: {
            'meta.title': 'Limassol Charity Run — a free community run on the Limassol seafront',
            'meta.description': 'A free community run at Molos Sculpture Park on the Limassol seafront. The date is being agreed with the Municipality — leave your email and we will tell you first. A charity 5 km and 10 km race follows in spring 2027.',

            'a11y.skip': 'Skip to content',
            'a11y.home': 'Limassol Charity Run — home',
            'a11y.language': 'Language',
            'a11y.events': 'Events',
            'a11y.glance': 'At a glance',
            'a11y.schedule': 'Planned timetable for the morning',

            'nav.run': 'The run',
            'nav.course': 'Course',
            'nav.rules': 'Rules',
            'nav.race': '2027',
            'nav.faq': 'FAQ',
            'nav.menu': 'Menu',
            'nav.close': 'Close',

            'hero.eyebrow': 'Limassol · Cyprus',
            'hero.title': 'Run the seafront. For a playground everyone can use.',
            'hero.sub': 'A free community run on the Limassol seafront. Date to be announced.',
            'hero.cta1': 'Be the first to know',
            'hero.cta2': 'About the 2027 race',

            'card1.date': 'Date: to be announced',
            'card1.title': 'Free community run',
            'card1.text': 'About 5 km on the seafront path, plus a 1 km loop for families. No timing, no entry fee, every pace welcome.',
            'card1.link': 'Be the first to know',
            'card2.date': 'Spring 2027',
            'card2.title': 'The charity race',
            'card2.text': '5 km, 10 km and a children\'s race, chip-timed, raising money for an accessible sports playground. Date confirmed with the city soon.',
            'card2.link': 'Read more',

            'facts.title': 'The run',
            'facts.date': 'Date',
            'facts.date.v': 'To be announced',
            'facts.meet': 'Meet',
            'facts.meet.v': '08:00 (planned)',
            'facts.start': 'Start',
            'facts.start.v': '08:30 (planned)',
            'facts.distance': 'Distance',
            'facts.distance.v': '≈ 5 km, plus a 1 km family loop',
            'facts.entry': 'Entry',
            'facts.entry.v': 'Free',
            'facts.places': 'Places',
            'facts.places.v': '150',
            'facts.where': 'Where',
            'facts.where.v': 'Molos Sculpture Park, Limassol seafront',
            'facts.map': 'Open in Google Maps',

            'course.title': 'Out 2.5 km. Turn. Home.',
            'course.sub': 'Flat, paved, and free of cars the whole way.',
            'course.svg.title': 'Course diagram: out 2.5 km along the seafront, turn, and return the same way',
            'course.svg.startfinish': 'Start · Finish',
            'course.svg.turn': 'Turn',
            'course.note1': 'Surface — paved promenade',
            'course.note2': 'Climb — about 0 m',
            'course.note3': 'Traffic — none, pedestrian path',
            'course.note4': 'Water — at start and finish',

            'rules.title': 'Rules',
            'rules.1': 'Minimum age 4. Children under 11 must stay beside an adult for the whole distance.',
            'rules.2': 'Under-18s must be registered by a parent or guardian.',
            'rules.3': 'Buggies and prams are welcome. Please start at the back.',
            'rules.4': 'No dogs, bicycles, scooters, skates or any wheels other than buggies and wheelchairs.',
            'rules.5': 'Wheelchair users are welcome on the paved promenade.',
            'rules.6': 'This is not a race. There is no timing and no finish order.',
            'rules.7': 'Please keep to the right and let faster runners pass on the left. The promenade stays open to the public.',

            'sched.title': 'How the morning will work',
            'sched.sub': 'Planned times. The date is still being agreed.',
            'sched.t1': '08:00',
            'sched.d1': 'Meet at Molos Sculpture Park',
            'sched.t2': '08:15',
            'sched.d2': 'Briefing — rules, route, photography',
            'sched.t3': '08:30',
            'sched.d3': 'Start',
            'sched.t4': '~09:15',
            'sched.d4': '5 km finishers back',
            'sched.t5': '~10:00',
            'sched.d5': 'Done',

            'travel.title': 'Getting there',
            'travel.1': 'On foot along the promenade — from either direction.',
            'travel.2': 'By car — paid parking along the seafront and on the side streets; on a Sunday morning there is usually space.',
            'travel.3': 'City buses stop on the seafront.',
            'travel.4': 'There are public toilets in the park.',
            'travel.5': 'Water at the start and the finish. Bring your own bottle — we do not hand out single-use plastic.',

            'plastic.title': 'No single-use plastic',
            'plastic.body': 'No single-use plastic. Bring your own bottle — we will refill it at the start and the finish. We take everything we bring away with us, and we would rather leave the seafront cleaner than we found it. If you see litter on the route, pick it up.',

            'notify.title': 'How you will hear the date',
            'notify.body': 'When the date is agreed we will email everyone on the list. We will also email you if the run has to be cancelled for weather or any other reason, by 20:00 the evening before at the latest. Email is our only notification channel, so please use an address you check.',

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
            'involved.volunteers': '<strong>Volunteers</strong> — marshal the course, hand out water, take photos. Ten people make this run happen.',
            'involved.link': 'Write to us',

            'faq.title': 'Questions',
            'faq.q1': 'When is the run?',
            'faq.a1': 'We do not have a date yet. We are agreeing it with the Municipality, and we will email everyone on the list as soon as it is set.',
            'faq.q2': 'Why is there no date?',
            'faq.a2': 'We would rather announce a date we can keep than one we have to move. The seafront is shared with other events, and the route needs the Municipality\'s agreement.',
            'faq.q3': 'Is the run really free?',
            'faq.a3': 'Yes. No entry fee, no timing, no pressure. Join the list so we know how many people to expect.',
            'faq.q4': 'Can children take part?',
            'faq.a4': 'Yes, with a parent or guardian running or walking with them. The 1 km loop is made for families.',
            'faq.q5': 'Can I bring my dog?',
            'faq.a5': 'No. Dogs are not allowed at this run.',
            'faq.q6': 'Is it accessible?',
            'faq.a6': 'The seafront path is flat and paved, with no cars. Wheelchair users and buggies are welcome on the 1 km loop.',
            'faq.q7': 'What do I need to bring?',
            'faq.a7': 'Water and something to keep the sun off. There is water at the start and finish.',
            'faq.q8': 'Do I need a medical certificate?',
            'faq.a8': 'No. You confirm you are fit and healthy when you sign up. If you have any doubt, see a doctor first.',
            'faq.q9': 'Will there be photos?',
            'faq.a9': 'Yes, for our website and social media. You can opt out when you sign up, and we will give you a coloured wristband at the start. Email us and we will remove any photo.',
            'faq.q10': 'How will I hear the date, or that the run is off?',
            'faq.a10': 'By email, to everyone on the list. If the weather or anything else makes the run unsafe we will cancel it and email you by 20:00 the evening before at the latest.',
            'faq.q11': 'Where does the money go?',
            'faq.a11': 'Nothing is collected at the community run. From the 2027 race, every donation goes to the playground project and we publish the total and the recipient.',
            'faq.q12': 'When can I enter the 2027 race?',
            'faq.a12': 'Registration opens in spring, before the race. Join the list for the community run and you will hear first.',

            'form.title': 'Tell me the date',
            'form.sub': 'We are working with the Municipality to agree a date. Leave your email and we will tell you as soon as it is set — that is the only thing we will use it for.',
            'form.first': 'First name',
            'form.last': 'Last name',
            'form.email': 'Email',
            'form.phone': 'Phone (optional)',
            'form.phone.hint': 'In case we need to reach you on the morning of the run',
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
            'form.emergency': 'Emergency contact',
            'form.emergency.hint': 'Optional now — we will ask again before the run',
            'form.emergency.name': 'Name (optional)',
            'form.emergency.phone': 'Phone (optional)',
            'form.consents': 'Before you send',
            'form.terms': 'I have read and accept the <a href="terms.html" target="_blank" rel="noopener">Terms of Participation</a>, and I confirm I am fit and healthy enough to take part.',
            'form.photo': 'Please don\'t publish photos where I am the main subject.',
            'form.news': 'Email me about the charity race in spring 2027.',
            'form.privacy.note': 'We use your details only to tell you the date and to organise the run. Emergency contact is used only in a medical emergency. We delete everything 12 months after the run. <a href="privacy.html">Read the privacy policy</a>.',
            'form.submit': 'Keep me posted',
            'form.sending': 'Sending…',
            'form.success.title': 'You\'re on the list.',
            'form.success.body': 'We will email you as soon as the date is agreed, and nothing else. See you on the seafront.',
            'form.error': 'Something went wrong. Please write to info@limassolcharityrun.com and we\'ll add you by hand.',
            'form.v.required': 'Please fill this in.',
            'form.v.email': 'Please enter a valid email address.',
            'form.v.distance': 'Please choose a distance.',
            'form.v.terms': 'Please accept the Terms of Participation to continue.',
            'form.v.fix': 'Please check the highlighted fields.',

            'footer.desc': 'Limassol Charity Run — a community running event on the seafront in Limassol, Cyprus.',
            'footer.org': 'Organised by Artem Bobrov · Limassol, Cyprus · <a href="mailto:info@limassolcharityrun.com">info@limassolcharityrun.com</a>',
            'footer.privacy': 'Privacy policy',
            'footer.terms': 'Terms of participation',
            'footer.home': 'Back to the run'
        },

        ru: {
            'meta.title': 'Limassol Charity Run — бесплатный забег по набережной Лимассола',
            'meta.description': 'Бесплатный забег в парке скульптур Молос на набережной Лимассола. Дату согласовываем с муниципалитетом — оставьте почту, и мы сообщим вам первыми. Весной 2027 года — благотворительный забег на 5 и 10 км.',

            'a11y.skip': 'К содержанию',
            'a11y.home': 'Limassol Charity Run — на главную',
            'a11y.language': 'Язык',
            'a11y.events': 'События',
            'a11y.glance': 'Коротко',
            'a11y.schedule': 'Планируемое расписание утра',

            'nav.run': 'Забег',
            'nav.course': 'Маршрут',
            'nav.rules': 'Правила',
            'nav.race': '2027',
            'nav.faq': 'Вопросы',
            'nav.menu': 'Меню',
            'nav.close': 'Закрыть',

            'hero.eyebrow': 'Лимассол · Кипр',
            'hero.title': 'Беги по набережной. Ради площадки, доступной каждому.',
            'hero.sub': 'Бесплатный забег по набережной Лимассола. Дату объявим.',
            'hero.cta1': 'Узнайте первыми',
            'hero.cta2': 'О забеге 2027 года',

            'card1.date': 'Дата: будет объявлена',
            'card1.title': 'Бесплатный забег для всех',
            'card1.text': 'Около 5 км по набережной плюс круг 1 км для семей. Без хронометража, без взноса, для любого уровня.',
            'card1.link': 'Узнайте первыми',
            'card2.date': 'Весна 2027',
            'card2.title': 'Благотворительный забег',
            'card2.text': '5 км, 10 км и детский забег с хронометражем — в поддержку доступной спортивной площадки. Дату согласуем с городом.',
            'card2.link': 'Подробнее',

            'facts.title': 'О забеге',
            'facts.date': 'Дата',
            'facts.date.v': 'Будет объявлена',
            'facts.meet': 'Сбор',
            'facts.meet.v': '08:00 (план)',
            'facts.start': 'Старт',
            'facts.start.v': '08:30 (план)',
            'facts.distance': 'Дистанция',
            'facts.distance.v': '≈ 5 км плюс круг 1 км для семей',
            'facts.entry': 'Участие',
            'facts.entry.v': 'Бесплатно',
            'facts.places': 'Мест',
            'facts.places.v': '150',
            'facts.where': 'Где',
            'facts.where.v': 'Парк скульптур Молос, набережная Лимассола',
            'facts.map': 'Открыть в Google Maps',

            'course.title': '2,5 км туда. Разворот. Обратно.',
            'course.sub': 'Ровно, с твёрдым покрытием и без машин на всём пути.',
            'course.svg.title': 'Схема маршрута: 2,5 км по набережной, разворот и возвращение тем же путём',
            'course.svg.startfinish': 'Старт · Финиш',
            'course.svg.turn': 'Разворот',
            'course.note1': 'Покрытие — набережная',
            'course.note2': 'Набор высоты — около 0 м',
            'course.note3': 'Движение — нет, пешеходная зона',
            'course.note4': 'Вода — на старте и финише',

            'rules.title': 'Правила',
            'rules.1': 'Минимальный возраст — 4 года. Дети до 11 лет должны всю дистанцию находиться рядом со взрослым.',
            'rules.2': 'Участников младше 18 лет регистрирует родитель или опекун.',
            'rules.3': 'С колясками можно. Пожалуйста, стартуйте сзади.',
            'rules.4': 'Нельзя с собаками, велосипедами, самокатами, роликами и любыми колёсами, кроме колясок и инвалидных кресел.',
            'rules.5': 'Участники на инвалидных колясках — добро пожаловать, набережная асфальтированная.',
            'rules.6': 'Это не соревнование. Хронометража и мест нет.',
            'rules.7': 'Держитесь правой стороны, пропускайте более быстрых слева. Набережная остаётся открытой для всех.',

            'sched.title': 'Как будет устроено утро',
            'sched.sub': 'Планируемое время. Дата ещё согласовывается.',
            'sched.t1': '08:00',
            'sched.d1': 'Сбор в парке скульптур Молос',
            'sched.t2': '08:15',
            'sched.d2': 'Брифинг: правила, маршрут, фотосъёмка',
            'sched.t3': '08:30',
            'sched.d3': 'Старт',
            'sched.t4': '~09:15',
            'sched.d4': 'Первые финишируют на 5 км',
            'sched.t5': '~10:00',
            'sched.d5': 'Завершение',

            'travel.title': 'Как добраться',
            'travel.1': 'Пешком по набережной — с любой стороны.',
            'travel.2': 'На машине — платная парковка вдоль набережной и на прилегающих улицах; в воскресенье утром места обычно есть.',
            'travel.3': 'Городские автобусы останавливаются на набережной.',
            'travel.4': 'Общественные туалеты есть в парке.',
            'travel.5': 'Вода будет на старте и на финише. Своя бутылка приветствуется — мы не раздаём одноразовый пластик.',

            'plastic.title': 'Без одноразового пластика',
            'plastic.body': 'Никакого одноразового пластика. Приносите свою бутылку — мы наполним её на старте и на финише. Мы увозим с собой всё, что привезли, и хотим оставить набережную чище, чем она была. Увидите мусор на маршруте — подберите.',

            'notify.title': 'Как вы узнаете дату',
            'notify.body': 'Когда дата согласуется, мы напишем всем из списка. Так же мы напишем, если забег придётся отменить из-за погоды или по другой причине — не позднее 20:00 накануне. Email — наш единственный канал связи, поэтому укажите адрес, который вы проверяете.',

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
            'involved.volunteers': '<strong>Волонтёры</strong> — помощь на трассе, вода, фотографии. Десять человек делают этот забег возможным.',
            'involved.link': 'Напишите нам',

            'faq.title': 'Вопросы и ответы',
            'faq.q1': 'Когда забег?',
            'faq.a1': 'Даты пока нет. Мы согласовываем её с муниципалитетом и напишем всем из списка, как только она появится.',
            'faq.q2': 'Почему нет даты?',
            'faq.a2': 'Мы предпочитаем назвать дату, которую сможем сдержать, а не ту, которую придётся переносить. Набережная делится с другими мероприятиями, и маршрут требует согласования с муниципалитетом.',
            'faq.q3': 'Забег правда бесплатный?',
            'faq.a3': 'Да. Ни взноса, ни хронометража, ни давления. Оставьте почту, чтобы мы знали, сколько человек ждать.',
            'faq.q4': 'Можно с детьми?',
            'faq.a4': 'Да, вместе с родителем или взрослым. Круг 1 км сделан как раз для семей.',
            'faq.q5': 'Можно с собакой?',
            'faq.a5': 'Нет, собаки на забеге запрещены.',
            'faq.q6': 'Насколько доступен маршрут?',
            'faq.a6': 'Набережная ровная, с твёрдым покрытием и без машин. На круге 1 км ждём и коляски, и людей на колясках.',
            'faq.q7': 'Что взять с собой?',
            'faq.a7': 'Воду и что-то от солнца. Вода будет на старте и финише.',
            'faq.q8': 'Нужна ли медицинская справка?',
            'faq.a8': 'Нет. При регистрации вы подтверждаете, что достаточно здоровы. Если сомневаетесь — сначала к врачу.',
            'faq.q9': 'Будут ли фотографировать?',
            'faq.a9': 'Да, для сайта и соцсетей. При регистрации можно отказаться — на старте выдадим цветной браслет. Напишите нам, и мы удалим любое фото.',
            'faq.q10': 'Как я узнаю дату или об отмене?',
            'faq.a10': 'По почте — мы напишем всем из списка. Если погода или что-то иное сделает забег небезопасным, мы отменим его и напишем не позднее 20:00 накануне.',
            'faq.q11': 'Куда идут деньги?',
            'faq.a11': 'На бесплатном забеге мы ничего не собираем. С забега 2027 года все пожертвования идут на проект площадки, а итоговую сумму и получателя мы публикуем.',
            'faq.q12': 'Когда можно зарегистрироваться на забег 2027?',
            'faq.a12': 'Регистрация откроется весной, до забега. Оставьте почту сейчас — сообщим первыми.',

            'form.title': 'Сообщите мне дату',
            'form.sub': 'Мы согласовываем дату с муниципалитетом. Оставьте почту — напишем, как только она появится. Больше ни для чего адрес использовать не будем.',
            'form.first': 'Имя',
            'form.last': 'Фамилия',
            'form.email': 'Email',
            'form.phone': 'Телефон (необязательно)',
            'form.phone.hint': 'На случай, если нужно будет связаться утром в день забега',
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
            'form.emergency': 'Экстренный контакт',
            'form.emergency.hint': 'Пока необязательно — спросим ещё раз перед забегом',
            'form.emergency.name': 'Имя (необязательно)',
            'form.emergency.phone': 'Телефон (необязательно)',
            'form.consents': 'Перед отправкой',
            'form.terms': 'Я прочитал(а) и принимаю <a href="terms.html" target="_blank" rel="noopener">Условия участия</a> и подтверждаю, что достаточно здоров(а) для участия.',
            'form.photo': 'Пожалуйста, не публикуйте фотографии, где я главный объект съёмки.',
            'form.news': 'Напишите мне о благотворительном забеге весной 2027 года.',
            'form.privacy.note': 'Мы используем ваши данные только чтобы сообщить дату и организовать забег. Экстренный контакт — только при медицинской необходимости. Удаляем всё через 12 месяцев после забега. <a href="privacy.html">Политика конфиденциальности</a>.',
            'form.submit': 'Держите меня в курсе',
            'form.sending': 'Отправляем…',
            'form.success.title': 'Вы в списке.',
            'form.success.body': 'Напишем, как только дата согласуется, и больше ни по какому поводу. До встречи на набережной.',
            'form.error': 'Что-то пошло не так. Напишите на info@limassolcharityrun.com — добавим вручную.',
            'form.v.required': 'Заполните это поле.',
            'form.v.email': 'Введите корректный адрес электронной почты.',
            'form.v.distance': 'Выберите дистанцию.',
            'form.v.terms': 'Чтобы продолжить, примите Условия участия.',
            'form.v.fix': 'Проверьте выделенные поля.',

            'footer.desc': 'Limassol Charity Run — общественный забег по набережной в Лимассоле, Кипр.',
            'footer.org': 'Организатор — Artem Bobrov · Лимассол, Кипр · <a href="mailto:info@limassolcharityrun.com">info@limassolcharityrun.com</a>',
            'footer.privacy': 'Политика конфиденциальности',
            'footer.terms': 'Условия участия',
            'footer.home': 'Назад к забегу'
        }
    };

    // Legal pages ship their own (long) strings in legal.js so the home page
    // never downloads them.
    if (window.LCR_LEGAL) {
        Object.keys(I18N).forEach(function (code) {
            if (window.LCR_LEGAL[code]) {
                Object.keys(window.LCR_LEGAL[code]).forEach(function (key) {
                    I18N[code][key] = window.LCR_LEGAL[code][key];
                });
            }
        });
    }

    var lang = 'en';
    var page = document.body.getAttribute('data-page'); // 'privacy' | 'terms' | null

    function t(key) {
        var dict = I18N[lang] || I18N.en;
        return (key in dict) ? dict[key] : (I18N.en[key] !== undefined ? I18N.en[key] : key);
    }

    /* ---------- 2. Language toggle ---------- */
    var metaDescription = document.querySelector('meta[name="description"]');

    function applyLanguage(next) {
        lang = (next === 'ru') ? 'ru' : 'en';

        document.documentElement.lang = lang;
        document.title = t(page ? page + '.meta.title' : 'meta.title');
        if (metaDescription) {
            metaDescription.setAttribute('content', t(page ? page + '.meta.description' : 'meta.description'));
        }

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

        refreshVisibleErrors();
    }

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            applyLanguage(btn.getAttribute('data-lang'));
        });
    });

    /* ---------- 3. Header and menu ---------- */
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

    /* ---------- 4. Sign-up form ---------- */
    var form = document.getElementById('signup-form');
    var submitBtn = document.getElementById('submit-btn');
    var statusEl = document.getElementById('form-status');
    var confirmEl = document.getElementById('confirm');

    var errorKeys = {}; // field id -> translation key of the error currently shown

    function setFieldError(id, key) {
        var errEl = document.getElementById('err-' + id);
        var fieldEl = errEl ? errEl.closest('.field') : null;
        var input = document.getElementById(id);
        if (key) {
            errorKeys[id] = key;
            if (errEl) { errEl.textContent = t(key); errEl.hidden = false; }
            if (fieldEl) fieldEl.classList.add('is-invalid');
            if (input) input.setAttribute('aria-invalid', 'true');
        } else {
            delete errorKeys[id];
            if (errEl) { errEl.textContent = ''; errEl.hidden = true; }
            if (fieldEl) fieldEl.classList.remove('is-invalid');
            if (input) input.removeAttribute('aria-invalid');
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

    function checked(id) {
        var el = document.getElementById(id);
        return !!(el && el.checked);
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

        // Accepting the Terms is required: it is the record of consent.
        if (!checked('terms_accepted')) { setFieldError('terms_accepted', 'form.v.terms'); ok = false; }
        else setFieldError('terms_accepted', null);

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
        confirmEl.hidden = false;
        confirmEl.focus();
    }

    if (form) {
        // Clear an error as soon as the field is corrected
        function clearOwnError(el) {
            if (!el) return;
            if (el.name === 'distance') setFieldError('distance', null);
            else if (el.id && errorKeys[el.id]) setFieldError(el.id, null);
        }
        form.addEventListener('input', function (e) { clearOwnError(e.target); });
        form.addEventListener('change', function (e) { clearOwnError(e.target); });

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
            var emName = value('emergency_name');
            var emPhone = value('emergency_phone');
            var row = {
                first_name: value('first_name'),
                last_name: value('last_name'),
                email: value('email'),
                phone: phone ? phone : null,
                distance: form.querySelector('input[name="distance"]:checked').value,
                language: lang === 'ru' ? 'RU' : 'EN',
                heard_from: heard ? heard : null,
                emergency_name: emName ? emName : null,
                emergency_phone: emPhone ? emPhone : null,
                terms_accepted: true,
                photo_opt_out: checked('photo_opt_out'),
                marketing_opt_in: checked('marketing_opt_in'),
                consent_at: new Date().toISOString(), // proof of consent, required by GDPR
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

    /* ---------- Init ---------- */
    var saved = null;
    try { saved = localStorage.getItem('lcr-lang'); } catch (e) { /* storage unavailable */ }
    applyLanguage(saved === 'ru' ? 'ru' : 'en');
})();
