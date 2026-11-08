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
            'meta.title': 'Limassol Charity Run — a free running community on the Limassol seafront',
            'meta.description': 'A free running community in Limassol. We run the seafront every week and once a month do something bigger. No fee, every pace welcome.',

            'a11y.skip': 'Skip to content',
            'a11y.home': 'Limassol Charity Run — home',
            'a11y.language': 'Language',
            'a11y.community': 'The community',
            'a11y.known': 'What we know so far',

            'nav.community': 'Community',
            'nav.schedule': 'Schedule',
            'nav.course': 'Course',
            'nav.rules': 'Rules',
            'nav.faq': 'FAQ',
            'nav.menu': 'Menu',
            'nav.close': 'Close',

            'hero.eyebrow': 'Limassol · Cyprus',
            'hero.title': 'Run the seafront. Every week.',
            'hero.sub': 'A free running community in Limassol. We meet at Molos Sculpture Park for about 5 km along the water, and once a month we do something bigger. No fee, no timing, every pace welcome.',
            'hero.note': 'We are settling the day and time now. Leave your email and you will have them first.',
            'hero.cta1': 'Join us',
            'hero.cta2': 'What we know',

            'card1.label': 'Every week',
            'card1.title': 'The training run',
            'card1.text': 'Molos Sculpture Park. About 5 km along the seafront, plus a 1 km loop for anyone walking or pushing a buggy. Free, no timing. Register once, then just turn up. Everyone who runs, including guests, must be registered.',
            'card2.label': 'Once a month',
            'card2.title': 'Something bigger',
            'card2.text': 'A longer route, a photographer, sometimes a guest or a partner. The days worth bringing a friend to — they can register in two minutes via the QR code at the start.',

            'known.title': 'What we know',
            'known.where': 'Where',
            'known.where.v': 'Molos Sculpture Park, on the seafront path',
            'known.map': 'Open in Google Maps',
            'known.often': 'How often',
            'known.often.v': 'Every week, plus one bigger event a month',
            'known.distance': 'Distance',
            'known.distance.v': 'About 5 km, flat and paved, plus a 1 km loop',
            'known.long': 'How long',
            'known.long.v': 'About an hour, including coffee afterwards for anyone who stays',
            'known.cost': 'Cost',
            'known.cost.v': 'Nothing',
            'known.when': 'Day and time',
            'known.when.v': 'Being settled now — everyone on the list hears first',
            'known.fixed': 'We aim to keep the same day and time every week. Any change is announced by email.',
            'known.weather': 'If the weather makes a run unsafe, we cancel and email everyone on the list, normally by 20:00 the evening before. If conditions change overnight, we will let you know as early as possible on the morning of the run.',

            'course.title': 'Out 2.5 km. Turn. Home.',
            'course.sub': 'Flat, paved, and free of cars the whole way.',
            'course.svg.title': 'Course diagram: out 2.5 km along the seafront, turn, and return the same way',
            'course.svg.t05': '0.5',
            'course.svg.t15': '1.5',
            'course.svg.t25': '2.5 km',
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
            'rules.5': 'Wheelchair users are welcome on the whole route — the promenade is flat and paved.',
            'rules.6': 'This is a training run, not a race. There is no timing and no finish order — but there is always someone to run with.',
            'rules.7': 'Please keep to the right and let faster runners pass on the left. The promenade stays open to the public.',

            'travel.title': 'Getting there',
            'travel.1': 'On foot along the promenade — from either direction.',
            'travel.2': 'By car — paid parking along the seafront and on the side streets; in the morning there is usually space.',
            'travel.3': 'City buses stop on the seafront.',
            'travel.4': 'There are public toilets in the park.',
            'travel.5': 'Water at the start and the finish. Bring your own bottle — we do not hand out single-use plastic.',

            'plastic.title': 'No single-use plastic',
            'plastic.body': 'No single-use plastic. Bring your own bottle — we will refill it at the start and the finish. We take everything we bring away with us, and we would rather leave the seafront cleaner than we found it. If you see litter on the route, pick it up.',

            'cause.title': 'Why we run',
            'cause.p1': 'Cyprus has no dedicated local para sport training centres. A Council of Europe and European Union <a href="https://rm.coe.int/cyprus-country-para-sport-factsheet/48802c43a1" target="_blank" rel="noopener">factsheet</a> on para sport in Cyprus, published in February 2026, says it plainly: there are not enough suitable places for athletes with disabilities to train, and one of its recommendations is to explore regional para sport training hubs.',
            'cause.p2': 'One day we would like to support an accessible sports ground in Limassol where people with disabilities, adults and children, can train.',
            'cause.p3': 'The community does not collect or accept money.',

            'involved.title': 'Help us build it',
            'involved.run': '<strong>Run with us</strong> Register, turn up and bring a friend; they can register in two minutes via the QR code at the start.',
            'involved.lead': '<strong>Lead a run</strong> We are looking for a coach, and for people who can run the session when the organiser cannot. A community survives its missed weeks, not its good ones.',
            'involved.partner': '<strong>Partner with us</strong> Local companies: if you would like to be part of the community, contact us.',
            'involved.link': 'Write to us',

            'faq.title': 'Questions',
            'faq.q1': 'When do you run?',
            'faq.a1': 'Every week, at Molos Sculpture Park. We are settling the day and time now, and everyone on the list hears as soon as it is fixed. We aim to keep the same day and time every week; any change is announced by email.',
            'faq.q2': 'Do I need to sign up for every run?',
            'faq.a2': 'No. Register once so we can tell you about changes and the monthly events. After that, just turn up. Guests register at the start via the QR code.',
            'faq.q3': 'How fast do you run?',
            'faq.a3': 'Every pace. Someone will be running yours, and nobody is left behind on the way back.',
            'faq.q4': 'What if I have never run 5 km?',
            'faq.a4': 'Walk it. The 1 km loop exists for exactly this, and plenty of people do the short one for months before the long one.',
            'faq.q5': 'Is it really free?',
            'faq.a5': 'Yes. Taking part is free.',
            'faq.q6': 'Can children take part?',
            'faq.a6': 'Yes, from the age of 4, with an adult beside them if they are under 11. The 1 km loop is made for families.',
            'faq.q7': 'Can I bring my dog?',
            'faq.a7': 'No. Dogs are not allowed at our runs.',
            'faq.q8': 'Is it accessible?',
            'faq.a8': 'The seafront path is flat and paved, with no cars. Wheelchair users and buggies are welcome on the whole route, and the 1 km loop is there for anyone who wants a shorter one.',
            'faq.q9': 'Do I need a medical certificate?',
            'faq.a9': 'No. You confirm you are fit and healthy when you join. If you have any doubt, see a doctor first.',
            'faq.q10': 'What happens if it rains?',
            'faq.a10': 'We run. We only cancel when it is genuinely unsafe, and then we email everyone, normally by 20:00 the evening before. If conditions change overnight, we will email as early as possible on the morning of the run and may also call or text.',
            'faq.q11': 'Will there be photos?',
            'faq.a11': 'Yes, for our website and social media. You can opt out when you join, and we will give you a coloured wristband. Email us and we will remove any photo. Photos in which a child is recognisable are published only with the parent\'s consent given at registration.',

            'form.title': 'Join the community',
            'form.who': 'Who are you registering?',
            'form.who.adult': 'Myself — I am 18 or over',
            'form.who.child': 'My child — I am their parent or guardian',
            'form.first': 'First name',
            'form.last': 'Last name',
            'form.email': 'Email',
            'form.phone': 'Phone (optional)',
            'form.phone.hint': 'In case we need to reach you on the morning of a run',
            'form.children': 'Children',
            'form.children.note': 'Your details above are the parent\'s or guardian\'s, and you are registered too. Children must be between 4 and 17.',
            'form.child.name': 'Child\'s full name',
            'form.child.dob': 'Date of birth',
            'form.child.alone': 'My child may run without an adult (ages 11–17)',
            'form.child.remove': 'Remove',
            'form.child.add': 'Add another child',
            'form.distance': 'Which distance? (optional)',
            'form.d5': '5 km run',
            'form.d1': '1 km loop — walking or with a buggy',
            'form.heard': 'Where did you hear about us? (optional)',
            'form.heard.choose': 'Choose…',
            'form.heard.friend': 'A friend',
            'form.heard.club': 'Running club',
            'form.heard.instagram': 'Instagram',
            'form.heard.facebook': 'Facebook',
            'form.heard.search': 'Search',
            'form.heard.other': 'Other',
            'form.emergency': 'Emergency contact',
            'form.emergency.name': 'Name',
            'form.emergency.phone': 'Phone',
            'form.emergency.note': 'Please tell this person you gave us their details. We use them only in an emergency.',
            'form.consents': 'Before you send',
            'form.terms': 'I have read and accept the <a href="terms.html" target="_blank" rel="noopener">Terms of Participation</a> for myself and for any child I register, and I confirm that everyone I register is fit and healthy enough to take part.',
            'form.photo': 'Please don\'t publish photos where I am the main subject.',
            'form.child.photo': 'I consent to photos of my child being published on the website and social media.',
            'form.news': 'Email me news about the community.',
            'form.privacy.note': 'We use your details only to run this community and to tell you about changes and monthly events. Emergency contact is used only in a medical emergency. You can leave the list at any time. <a href="privacy.html">Read the privacy policy</a>.',
            'form.submit': 'Count me in',
            'form.sending': 'Sending…',
            'form.success.title': 'You\'re in.',
            'form.success.body': 'We\'ll email you before the next run — see you at Molos.',
            'form.error': 'Something went wrong. Please write to info@limassolcharityrun.com and we\'ll add you by hand.',
            'form.v.required': 'Please fill this in.',
            'form.v.email': 'Please enter a valid email address.',
            'form.v.who': 'Please choose who you are registering.',
            'form.v.child.name': 'Please enter the child\'s name.',
            'form.v.child.dob': 'Please enter a date of birth.',
            'form.v.child.age': 'Children must be between 4 and 17 on the day you register.',
            'form.v.terms': 'Please accept the Terms of Participation to continue.',
            'form.v.fix': 'Please check the highlighted fields.',

            'footer.desc': 'Limassol Charity Run — a running community on the seafront in Limassol, Cyprus.',
            'footer.org': 'Limassol, Cyprus · <a href="mailto:info@limassolcharityrun.com">info@limassolcharityrun.com</a>',
            'footer.privacy': 'Privacy policy',
            'footer.terms': 'Terms of participation',
            'footer.home': 'Back to the community'
        },

        ru: {
            'meta.title': 'Limassol Charity Run — бесплатное беговое сообщество на набережной Лимассола',
            'meta.description': 'Бесплатное беговое сообщество в Лимассоле. Каждую неделю бегаем по набережной, а раз в месяц делаем что-то побольше. Без взноса, любой темп.',

            'a11y.skip': 'К содержанию',
            'a11y.home': 'Limassol Charity Run — на главную',
            'a11y.language': 'Язык',
            'a11y.community': 'Сообщество',
            'a11y.known': 'Что уже известно',

            'nav.community': 'Сообщество',
            'nav.schedule': 'Расписание',
            'nav.course': 'Маршрут',
            'nav.rules': 'Правила',
            'nav.faq': 'Вопросы',
            'nav.menu': 'Меню',
            'nav.close': 'Закрыть',

            'hero.eyebrow': 'Лимассол · Кипр',
            'hero.title': 'Бежим по набережной. Каждую неделю.',
            'hero.sub': 'Бесплатное беговое сообщество в Лимассоле. Встречаемся в парке скульптур Молос — около 5 км вдоль воды, а раз в месяц делаем что-то побольше. Без взноса, без хронометража, любой темп.',
            'hero.note': 'Сейчас определяем день и время. Оставьте почту — узнаете первыми.',
            'hero.cta1': 'Присоединиться',
            'hero.cta2': 'Что уже известно',

            'card1.label': 'Каждую неделю',
            'card1.title': 'Тренировка',
            'card1.text': 'Парк скульптур Молос. Около 5 км по набережной плюс круг 1 км для тех, кто идёт пешком или с коляской. Бесплатно, без хронометража. Зарегистрируйтесь один раз — и просто приходите. Все, кто бежит, включая гостей, должны быть зарегистрированы.',
            'card2.label': 'Раз в месяц',
            'card2.title': 'Событие',
            'card2.text': 'Маршрут длиннее, фотограф, иногда гость или партнёр. Те дни, ради которых стоит позвать друга, — он зарегистрируется за две минуты по QR-коду на старте.',

            'known.title': 'Что уже известно',
            'known.where': 'Где',
            'known.where.v': 'Парк скульптур Молос, на набережной',
            'known.map': 'Открыть на карте',
            'known.often': 'Как часто',
            'known.often.v': 'Каждую неделю, плюс одно событие в месяц',
            'known.distance': 'Дистанция',
            'known.distance.v': 'Около 5 км, ровно и по асфальту, плюс круг 1 км',
            'known.long': 'Сколько длится',
            'known.long.v': 'Около часа, плюс кофе для тех, кто остаётся',
            'known.cost': 'Стоимость',
            'known.cost.v': 'Ничего',
            'known.when': 'День и время',
            'known.when.v': 'Сейчас определяются — все из списка узнают первыми',
            'known.fixed': 'Мы стараемся держать один и тот же день и время каждую неделю. Любые изменения сообщаем по почте.',
            'known.weather': 'Если погода делает пробежку небезопасной, мы отменяем её и пишем всем из списка — обычно до 20:00 накануне. Если погода изменится ночью, сообщим как можно раньше утром в день пробежки.',

            'course.title': '2,5 км туда. Разворот. Обратно.',
            'course.sub': 'Ровно, с твёрдым покрытием и без машин на всём пути.',
            'course.svg.title': 'Схема маршрута: 2,5 км по набережной, разворот и возвращение тем же путём',
            'course.svg.t05': '0,5',
            'course.svg.t15': '1,5',
            'course.svg.t25': '2,5 км',
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
            'rules.5': 'Участники на инвалидных колясках — добро пожаловать на всём маршруте: набережная ровная и асфальтированная.',
            'rules.6': 'Это тренировка, а не соревнование. Хронометража и мест нет — зато всегда есть с кем бежать.',
            'rules.7': 'Держитесь правой стороны, пропускайте более быстрых слева. Набережная остаётся открытой для всех.',

            'travel.title': 'Как добраться',
            'travel.1': 'Пешком по набережной — с любой стороны.',
            'travel.2': 'На машине — платная парковка вдоль набережной и на прилегающих улицах; утром места обычно есть.',
            'travel.3': 'Городские автобусы останавливаются на набережной.',
            'travel.4': 'Общественные туалеты есть в парке.',
            'travel.5': 'Вода будет на старте и на финише. Своя бутылка приветствуется — мы не раздаём одноразовый пластик.',

            'plastic.title': 'Без одноразового пластика',
            'plastic.body': 'Никакого одноразового пластика. Приносите свою бутылку — мы наполним её на старте и на финише. Мы увозим с собой всё, что привезли, и хотим оставить набережную чище, чем она была. Увидите мусор на маршруте — подберите.',

            'cause.title': 'Ради чего мы бежим',
            'cause.p1': 'На Кипре нет специализированных местных центров пара-спорта. В феврале 2026 года Совет Европы и Европейский союз выпустили <a href="https://rm.coe.int/cyprus-country-para-sport-factsheet/48802c43a1" target="_blank" rel="noopener">факт-лист</a> о пара-спорте на Кипре, и там это сказано прямо: подходящих мест для тренировок спортсменов с инвалидностью не хватает, а одна из рекомендаций — рассмотреть создание региональных тренировочных центров пара-спорта.',
            'cause.p2': 'Когда-нибудь мы хотели бы поддержать доступную спортивную площадку в Лимассоле, где смогут тренироваться люди с инвалидностью — взрослые и дети.',
            'cause.p3': 'Сообщество не собирает и не принимает деньги.',

            'involved.title': 'Помочь сообществу',
            'involved.run': '<strong>Бегать с нами</strong> Зарегистрируйтесь, приходите и приводите друга — он зарегистрируется за две минуты по QR-коду на старте.',
            'involved.lead': '<strong>Провести тренировку</strong> Ищем тренера и людей, которые проведут пробежку, когда организатор не может. Сообщество переживает не удачные недели, а пропущенные.',
            'involved.partner': '<strong>Стать партнёром</strong> Местным компаниям: если хотите стать частью сообщества — напишите нам.',
            'involved.link': 'Напишите нам',

            'faq.title': 'Вопросы и ответы',
            'faq.q1': 'Когда вы бегаете?',
            'faq.a1': 'Каждую неделю, в парке скульптур Молос. День и время сейчас определяются, и все из списка узнают сразу, как только они будут назначены. Мы стараемся держать один и тот же день и время каждую неделю; любые изменения сообщаем по почте.',
            'faq.q2': 'Нужно ли записываться на каждую тренировку?',
            'faq.a2': 'Нет. Зарегистрируйтесь один раз, чтобы мы могли сообщать об изменениях и ежемесячных событиях. Дальше просто приходите. Гости регистрируются на старте по QR-коду.',
            'faq.q3': 'В каком темпе вы бежите?',
            'faq.a3': 'В любом. Кто-то побежит в вашем, и на обратном пути никого не оставляют одного.',
            'faq.q4': 'А если я никогда не бегал 5 км?',
            'faq.a4': 'Пройдите пешком. Круг 1 км существует ровно для этого, и многие месяцами ходят короткий, прежде чем побежать длинный.',
            'faq.q5': 'Это правда бесплатно?',
            'faq.a5': 'Да. Участие бесплатное.',
            'faq.q6': 'Можно с детьми?',
            'faq.a6': 'Да, с 4 лет; до 11 лет — рядом со взрослым. Круг 1 км сделан для семей.',
            'faq.q7': 'Можно с собакой?',
            'faq.a7': 'Нет, собаки на наших пробежках запрещены.',
            'faq.q8': 'Насколько это доступно?',
            'faq.a8': 'Набережная ровная, асфальтированная, без машин. Коляски и инвалидные кресла — добро пожаловать на всём маршруте, а круг 1 км — для тех, кому нужна дистанция короче.',
            'faq.q9': 'Нужна медицинская справка?',
            'faq.a9': 'Нет. Присоединяясь, вы подтверждаете, что достаточно здоровы. Если сомневаетесь — сначала к врачу.',
            'faq.q10': 'А если дождь?',
            'faq.a10': 'Бежим. Отменяем, только когда это действительно небезопасно, и тогда пишем всем — обычно до 20:00 накануне. Если погода изменится ночью, напишем как можно раньше утром в день пробежки и можем также позвонить или прислать сообщение.',
            'faq.q11': 'Будут ли фотографии?',
            'faq.a11': 'Да, для сайта и соцсетей. При записи можно отказаться — выдадим цветной браслет. Напишите нам, и мы удалим любое фото. Фотографии, на которых можно узнать ребёнка, публикуем только с согласия родителя, данного при регистрации.',

            'form.title': 'Присоединиться',
            'form.who': 'Кого вы регистрируете?',
            'form.who.adult': 'Себя — мне 18 или больше',
            'form.who.child': 'Своего ребёнка — я его родитель или опекун',
            'form.first': 'Имя',
            'form.last': 'Фамилия',
            'form.email': 'Email',
            'form.phone': 'Телефон (необязательно)',
            'form.phone.hint': 'На случай, если нужно связаться утром перед тренировкой',
            'form.children': 'Дети',
            'form.children.note': 'Данные выше — ваши, как родителя или опекуна, и вы тоже зарегистрированы. Детям должно быть от 4 до 17 лет.',
            'form.child.name': 'Имя и фамилия ребёнка',
            'form.child.dob': 'Дата рождения',
            'form.child.alone': 'Мой ребёнок может бежать без взрослого (11–17 лет)',
            'form.child.remove': 'Убрать',
            'form.child.add': 'Добавить ещё ребёнка',
            'form.distance': 'Какая дистанция? (необязательно)',
            'form.d5': '5 км бегом',
            'form.d1': '1 км — пешком или с коляской',
            'form.heard': 'Откуда вы о нас узнали? (необязательно)',
            'form.heard.choose': 'Выберите…',
            'form.heard.friend': 'От друзей',
            'form.heard.club': 'Беговой клуб',
            'form.heard.instagram': 'Instagram',
            'form.heard.facebook': 'Facebook',
            'form.heard.search': 'Поиск',
            'form.heard.other': 'Другое',
            'form.emergency': 'Экстренный контакт',
            'form.emergency.name': 'Имя',
            'form.emergency.phone': 'Телефон',
            'form.emergency.note': 'Пожалуйста, предупредите этого человека, что вы дали нам его контакты. Мы используем их только в экстренной ситуации.',
            'form.consents': 'Перед отправкой',
            'form.terms': 'Я прочитал(а) и принимаю <a href="terms.html" target="_blank" rel="noopener">Условия участия</a> — за себя и за каждого ребёнка, которого регистрирую, — и подтверждаю, что все, кого я регистрирую, достаточно здоровы для участия.',
            'form.photo': 'Пожалуйста, не публикуйте фотографии, где я главный объект съёмки.',
            'form.child.photo': 'Я согласен(на) на публикацию фотографий моего ребёнка на сайте и в соцсетях.',
            'form.news': 'Присылайте мне новости сообщества.',
            'form.privacy.note': 'Мы используем ваши данные только чтобы вести сообщество и сообщать об изменениях и ежемесячных событиях. Экстренный контакт — только при медицинской необходимости. Выйти из списка можно в любой момент. <a href="privacy.html">Политика конфиденциальности</a>.',
            'form.submit': 'Я с вами',
            'form.sending': 'Отправляем…',
            'form.success.title': 'Вы в деле.',
            'form.success.body': 'Напишем перед ближайшей тренировкой — увидимся на Молосе.',
            'form.error': 'Что-то пошло не так. Напишите на info@limassolcharityrun.com — добавим вручную.',
            'form.v.required': 'Заполните это поле.',
            'form.v.email': 'Введите корректный адрес электронной почты.',
            'form.v.who': 'Выберите, кого вы регистрируете.',
            'form.v.child.name': 'Введите имя ребёнка.',
            'form.v.child.dob': 'Укажите дату рождения.',
            'form.v.child.age': 'Ребёнку должно быть от 4 до 17 лет на день регистрации.',
            'form.v.terms': 'Чтобы продолжить, примите Условия участия.',
            'form.v.fix': 'Проверьте выделенные поля.',

            'footer.desc': 'Limassol Charity Run — беговое сообщество на набережной Лимассола, Кипр.',
            'footer.org': 'Лимассол, Кипр · <a href="mailto:info@limassolcharityrun.com">info@limassolcharityrun.com</a>',
            'footer.privacy': 'Политика конфиденциальности',
            'footer.terms': 'Условия участия',
            'footer.home': 'Назад к сообществу'
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

    // Translate every tagged element under root (the page, or a form row added later)
    function translateIn(root) {
        root.querySelectorAll('[data-i18n]').forEach(function (el) {
            el.textContent = t(el.getAttribute('data-i18n'));
        });
        root.querySelectorAll('[data-i18n-html]').forEach(function (el) {
            el.innerHTML = t(el.getAttribute('data-i18n-html')); // author-controlled markup only
        });
        root.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
        });
        root.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
            el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
        });
    }

    function applyLanguage(next) {
        lang = (next === 'ru') ? 'ru' : 'en';

        document.documentElement.lang = lang;
        document.title = t(page ? page + '.meta.title' : 'meta.title');
        if (metaDescription) {
            metaDescription.setAttribute('content', t(page ? page + '.meta.description' : 'meta.description'));
        }

        translateIn(document);
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

        var who = registrant();
        if (!who) { setFieldError('registrant', 'form.v.who'); ok = false; }
        else setFieldError('registrant', null);

        if (who === 'parent') {
            childList.querySelectorAll('.child-row').forEach(function (row) {
                var name = row.querySelector('[data-child="name"]');
                var dob = row.querySelector('[data-child="dob"]');
                var age = ageToday(dob.value);
                if (!name.value.trim()) { setFieldError(name.id, 'form.v.child.name'); ok = false; }
                else setFieldError(name.id, null);
                if (!dob.value) { setFieldError(dob.id, 'form.v.child.dob'); ok = false; }
                else if (!(age >= 4 && age <= 17)) { setFieldError(dob.id, 'form.v.child.age'); ok = false; }
                else setFieldError(dob.id, null);
            });
        }

        ['first_name', 'last_name', 'emergency_name', 'emergency_phone'].forEach(function (id) {
            if (!value(id)) { setFieldError(id, 'form.v.required'); ok = false; }
            else setFieldError(id, null);
        });

        var email = value('email');
        if (!email) { setFieldError('email', 'form.v.required'); ok = false; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setFieldError('email', 'form.v.email'); ok = false; }
        else setFieldError('email', null);

        // Accepting the Terms is required: it is the record of consent.
        if (!checked('terms_accepted')) { setFieldError('terms_accepted', 'form.v.terms'); ok = false; }
        else setFieldError('terms_accepted', null);

        return ok;
    }

    function isoDate(d) {
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    function todayIso() {
        return isoDate(new Date());
    }

    function yearsAgo(n) {
        var d = new Date();
        d.setFullYear(d.getFullYear() - n);
        return d;
    }

    // Whole years from a YYYY-MM-DD birth date to today; NaN if the date is missing or malformed
    function ageToday(dob) {
        var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob || '');
        if (!m) return NaN;
        var now = new Date();
        var age = now.getFullYear() - Number(m[1]);
        var month = now.getMonth() + 1;
        if (month < Number(m[2]) || (month === Number(m[2]) && now.getDate() < Number(m[3]))) age--;
        return age;
    }

    /* ---------- Children: registered by a parent or guardian (Terms 4) ---------- */
    var MAX_CHILDREN = 6;
    var childrenBox = document.getElementById('children');
    var childList = document.getElementById('child-list');
    var childTemplate = document.getElementById('child-row');
    var addChildBtn = document.getElementById('add-child');
    var childPhotoBox = document.getElementById('child-photo-box');
    var childSeq = 0;

    function registrant() {
        var r = form ? form.querySelector('input[name="registrant"]:checked') : null;
        return r ? r.value : ''; // 'adult' | 'parent'
    }

    // "May run without an adult" is only a question for ages 11 to 17
    function syncChildRow(row) {
        var age = ageToday(row.querySelector('[data-child="dob"]').value);
        var alone = row.querySelector('.child-alone');
        alone.hidden = !(age >= 11 && age <= 17);
        if (alone.hidden) alone.querySelector('input').checked = false;
    }

    function syncChildButtons() {
        var rows = childList.querySelectorAll('.child-row');
        rows.forEach(function (row) { row.querySelector('.child-remove').hidden = rows.length === 1; });
        addChildBtn.hidden = rows.length >= MAX_CHILDREN;
    }

    function addChild() {
        var n = ++childSeq;
        var row = childTemplate.content.firstElementChild.cloneNode(true);
        ['name', 'dob'].forEach(function (part) {
            var input = row.querySelector('[data-child="' + part + '"]');
            var field = input.closest('.field');
            input.id = 'child-' + part + '-' + n;
            input.setAttribute('aria-describedby', 'err-' + input.id);
            field.querySelector('label').setAttribute('for', input.id);
            field.querySelector('.field-error').id = 'err-' + input.id;
        });
        var dob = row.querySelector('[data-child="dob"]');
        var oldest = yearsAgo(18);
        oldest.setDate(oldest.getDate() + 1);
        dob.min = isoDate(oldest);       // under 18 today
        dob.max = isoDate(yearsAgo(4));  // at least 4 today
        dob.addEventListener('input', function () { syncChildRow(row); });
        dob.addEventListener('change', function () { syncChildRow(row); });
        row.querySelector('.child-remove').addEventListener('click', function () {
            delete errorKeys['child-name-' + n];
            delete errorKeys['child-dob-' + n];
            row.remove();
            syncChildButtons();
            addChildBtn.focus();
        });
        translateIn(row);
        childList.appendChild(row);
        syncChildButtons();
        return row;
    }

    function syncRegistrant() {
        var isParent = registrant() === 'parent';
        childrenBox.hidden = !isParent;
        childPhotoBox.hidden = !isParent;
        if (!isParent) childPhotoBox.querySelector('input').checked = false;
        if (isParent && !childList.querySelector('.child-row')) addChild();
    }

    function childRows() {
        return Array.prototype.map.call(childList.querySelectorAll('.child-row'), function (row) {
            return {
                name: row.querySelector('[data-child="name"]').value.trim(),
                dob: row.querySelector('[data-child="dob"]').value,
                unaccompanied: row.querySelector('[data-child="alone"]').checked // only offered at 11 to 17
            };
        });
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
            if (el.name === 'registrant') setFieldError('registrant', null);
            else if (el.id && errorKeys[el.id]) setFieldError(el.id, null);
        }
        form.addEventListener('change', function (e) {
            if (e.target.name === 'registrant') syncRegistrant();
        });
        addChildBtn.addEventListener('click', function () {
            addChild().querySelector('[data-child="name"]').focus();
        });
        syncRegistrant();
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
            var distance = form.querySelector('input[name="distance"]:checked');
            var who = registrant();
            var row = {
                first_name: value('first_name'),
                last_name: value('last_name'),
                email: value('email'),
                phone: phone ? phone : null,
                distance: distance ? distance.value : null, // optional
                language: lang === 'ru' ? 'RU' : 'EN',
                heard_from: heard ? heard : null,
                emergency_name: value('emergency_name'),
                emergency_phone: value('emergency_phone'),
                registrant_type: who, // 'adult' | 'parent'; a parent accepts the Terms for each child
                children: who === 'parent' ? childRows() : null,
                child_photo_consent: who === 'parent' && checked('child_photo_consent'),
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
