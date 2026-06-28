import { PublicLanguage } from '../localization/languages'

export type SiteLocale = PublicLanguage
export type PageKey = 'about' | 'board' | 'membership' | 'associations' | 'cor-house' | 'booking' | 'privacy' | 'accessibility'

export interface ContentSection {
  title: string
  body: string
  items?: string[]
}

export interface PageDefinition {
  eyebrow: string
  title: string
  intro: string
  metaDescription: string
  sections: ContentSection[]
  cta?: { label: string; href: string; external?: boolean }
}

interface SiteContent {
  organizationName: string
  shortName: string
  nav: {
    home: string
    about: string
    organization: string
    board: string
    membership: string
    associations: string
    collaborations: string
    corHouse: string
    booking: string
    contact: string
    news: string
    events: string
    alumni: string
    getInvolved: string
    more: string
    join: string
    open: string
    close: string
    main: string
    mobile: string
  }
  common: {
    learnMore: string
    readMore: string
    viewAll: string
    cmsUnavailable: string
  }
  home: {
    metaTitle: string
    metaDescription: string
    hero: { eyebrow: string; title: string; description: string; primary: string; secondary: string }
    about: { eyebrow: string; title: string; body: string; action: string }
    benefits: { eyebrow: string; title: string; description: string; items: Array<{ title: string; body: string }> }
    associations: { eyebrow: string; title: string; body: string; action: string }
    cor: { eyebrow: string; title: string; body: string; action: string }
    membership: { eyebrow: string; title: string; body: string; action: string }
    news: { eyebrow: string; title: string; description: string; all: string; error: string; empty: string }
    events: { eyebrow: string; title: string; description: string; all: string; error: string; empty: string }
  }
  pages: Record<PageKey, PageDefinition>
  contact: {
    eyebrow: string
    title: string
    intro: string
    metaDescription: string
    general: string
    support: string
    visit: string
    social: string
    location: string
    hoursNote: string
  }
  footer: { description: string; explore: string; information: string; contact: string; privacy: string; accessibility: string; harassment: string }
}

const en: SiteContent = {
  organizationName: 'Arcada Student Union – ASK',
  shortName: 'ASK',
  nav: {
    home: 'Home', about: 'About ASK', organization: 'Organization', board: 'Board', membership: 'Membership', associations: 'Associations', collaborations: 'Collaborations',
    corHouse: 'Cor House', booking: 'Booking', contact: 'Contact', news: 'News', events: 'Events', alumni: 'Alumni', getInvolved: 'Get Involved', more: 'More',
    join: 'Join ASK', open: 'Open navigation', close: 'Close navigation', main: 'Main navigation', mobile: 'Mobile navigation',
  },
  common: { learnMore: 'Learn more', readMore: 'Read more', viewAll: 'View all', cmsUnavailable: 'Managed content is temporarily unavailable.' },
  home: {
    metaTitle: 'ASK – Your student community at Arcada',
    metaDescription: 'Discover student services, events, news, membership and community at Arcada Student Union – ASK.',
    hero: {
      eyebrow: 'Your student union at Arcada',
      title: 'A stronger student life, built together.',
      description: 'ASK represents Arcada students, creates community and helps make everyday student life more rewarding — in English and Swedish.',
      primary: 'Become a member', secondary: 'See upcoming events',
    },
    about: {
      eyebrow: 'About ASK', title: 'Students supporting students',
      body: 'Arcada Student Union – ASK represents students, protects their interests and creates opportunities to meet, participate and influence life at Arcada.',
      action: 'Get to know ASK',
    },
    benefits: {
      eyebrow: 'Student benefits', title: 'More value from student life', description: 'Membership connects you with practical support, community and opportunities.',
      items: [
        { title: 'A voice at Arcada', body: 'ASK represents student interests and brings student perspectives into decision-making.' },
        { title: 'Events and community', body: 'Meet other students through activities, traditions and shared experiences.' },
        { title: 'Support and guidance', body: 'Find help, contacts and practical information when you need it.' },
      ],
    },
    associations: {
      eyebrow: 'Student associations', title: 'Find people who share your interests',
      body: 'Student associations create communities around study fields, interests and activities. Explore ways to participate or start something new.', action: 'Explore associations',
    },
    cor: {
      eyebrow: 'Cor House', title: 'Your shared space on campus',
      body: 'Cor is a place to meet, work together and take part in student life. Learn about the house, practical information and booking options.', action: 'Discover Cor House',
    },
    membership: {
      eyebrow: 'Join the community', title: 'Become an ASK member',
      body: 'Support student advocacy, take part in the community and access ASK activities and member opportunities.', action: 'Join through Kide.app',
    },
    news: { eyebrow: 'Latest from ASK', title: 'News worth knowing', description: 'Updates and practical information for your studies and student life.', all: 'View all news', error: 'Latest news is temporarily unavailable.', empty: 'New stories are on the way.' },
    events: { eyebrow: 'Meet, learn and celebrate', title: 'Upcoming events', description: 'See what is happening next and find your place in the ASK community.', all: 'View all events', error: 'Upcoming events are temporarily unavailable.', empty: 'There are no upcoming events published yet.' },
  },
  pages: {
    about: {
      eyebrow: 'About ASK', title: 'The student union for everyone at Arcada',
      intro: 'ASK is the student union of Arcada University of Applied Sciences. We represent students, strengthen community and help students influence their education and everyday life.',
      metaDescription: 'Learn about Arcada Student Union – ASK, its mission, advocacy and student community.',
      sections: [
        { title: 'Our purpose', body: 'ASK exists to protect student interests and build a welcoming, active student community. We work close to students and bring their needs into conversations with Arcada and other partners.' },
        { title: 'What we do', body: 'Our work combines advocacy, student services, events, communication and support.', items: ['Represent students in matters affecting education and wellbeing', 'Create events and opportunities to participate', 'Share reliable information and connect students with support', 'Support student associations and student-led initiatives'] },
        { title: 'An open community', body: 'ASK serves students in English and Swedish. Everyone should be able to participate regardless of background, identity or previous experience in student activities.' },
      ],
    },
    board: {
      eyebrow: 'Governance', title: 'The ASK board',
      intro: 'The board leads the student union’s daily work and carries responsibility for decisions, finances and the implementation of the representative council’s direction.',
      metaDescription: 'Learn how the board of Arcada Student Union – ASK works and how students can get in touch.',
      sections: [
        { title: 'Board responsibilities', body: 'The board turns strategy and decisions into action. Its responsibilities include advocacy, member services, events, partnerships, finances and organizational development.' },
        { title: 'Student-led decision-making', body: 'ASK is governed by students. Elected representatives set direction, and the board is accountable for carrying it out transparently and responsibly.' },
        { title: 'Contact the board', body: 'Students are encouraged to raise ideas, concerns and questions. Contact ASK through the general email address and your message will be directed to the appropriate board member.' },
      ],
      cta: { label: 'Contact ASK', href: '/contact' },
    },
    membership: {
      eyebrow: 'Membership', title: 'Belong, participate and make a difference',
      intro: 'ASK membership supports student advocacy and gives you a direct connection to the student community at Arcada.',
      metaDescription: 'Learn about ASK membership and join Arcada Student Union through Kide.app.',
      sections: [
        { title: 'Why join?', body: 'Membership strengthens ASK’s ability to represent students and develop services, activities and community.', items: ['Support student advocacy at Arcada', 'Take part in ASK events and community activities', 'Discover member opportunities and collaborations', 'Help shape the future of student life'] },
        { title: 'How to join', body: 'Membership is handled through Kide.app. Follow the link, review the current membership information and complete the process in the service.' },
      ],
      cta: { label: 'Join through Kide.app', href: 'https://kide.app/', external: true },
    },
    associations: {
      eyebrow: 'Associations', title: 'Communities created by students',
      intro: 'Associations bring students together around study fields, interests, culture and shared activities.',
      metaDescription: 'Discover student associations and opportunities to participate in student-led communities at Arcada.',
      sections: [
        { title: 'Find your community', body: 'Associations are an easy way to meet people, learn new skills and contribute to campus life. Activities vary from social events to professional, cultural and recreational interests.' },
        { title: 'Support from ASK', body: 'ASK helps student-led groups connect with the wider community and can guide new initiatives toward the right contacts and practical resources.' },
        { title: 'Get listed', body: 'Association profiles will be expanded as managed content becomes available. Associations can contact ASK to update their information or discuss collaboration.' },
      ],
      cta: { label: 'Contact ASK', href: '/contact' },
    },
    'cor-house': {
      eyebrow: 'Cor House', title: 'A shared home for student life',
      intro: 'Cor House is ASK’s student space at the Arcada campus — a place for community, activities and practical student-union services.',
      metaDescription: 'Learn about Cor House, ASK’s student space at the Arcada campus.',
      sections: [
        { title: 'A place to meet', body: 'Cor is designed for student life. It supports informal meetings, events, association activities and collaboration.' },
        { title: 'Using the space', body: 'Respect the shared environment, other visitors and the current house rules. Booking information and available resources are published through ASK’s booking page.' },
        { title: 'Accessibility and practical questions', body: 'Contact ASK before your visit if you need accessibility information or help planning an activity at Cor.' },
      ],
      cta: { label: 'See booking information', href: '/booking' },
    },
    booking: {
      eyebrow: 'Booking', title: 'Plan an activity at Cor',
      intro: 'ASK is preparing a digital booking service for eligible student activities and shared resources.',
      metaDescription: 'Find current information about booking ASK spaces and resources at Cor House.',
      sections: [
        { title: 'Current booking process', body: 'The self-service booking system is not yet open. Contact ASK with the date, time, purpose, expected number of participants and any accessibility needs.' },
        { title: 'Before requesting a booking', body: 'Consider setup and cleanup time, capacity, accessibility, responsible contact persons and whether the activity requires special equipment or permissions.' },
        { title: 'Fair use', body: 'Availability and eligibility are confirmed by ASK. A request is not a confirmed booking until you receive confirmation.' },
      ],
      cta: { label: 'Ask about a booking', href: 'mailto:info@asken.fi', external: true },
    },
    privacy: {
      eyebrow: 'Privacy', title: 'Privacy policy',
      intro: 'ASK handles personal data carefully and only for defined purposes connected to membership, communication, services and student-union operations.',
      metaDescription: 'Read the privacy policy for Arcada Student Union – ASK.',
      sections: [
        { title: 'Data we process', body: 'The exact data depends on the service. It may include contact information, account details, booking information, communication preferences and records required for administration or legal obligations.' },
        { title: 'Why data is used', body: 'Personal data is used to provide requested services, manage legitimate student-union operations, communicate where permitted and meet legal responsibilities. Service-specific notices provide more detail at collection points.' },
        { title: 'Storage and access', body: 'Access is limited according to responsibilities. Data is retained only as long as required by its purpose, applicable rules and documented retention decisions.' },
        { title: 'Your rights', body: 'Depending on the legal basis and circumstances, you may request access, correction, restriction, deletion or a portable copy of your data. Contact ASK to make a request or ask a privacy question.' },
      ],
      cta: { label: 'Contact ASK about privacy', href: 'mailto:info@asken.fi', external: true },
    },
    accessibility: {
      eyebrow: 'Accessibility', title: 'Accessibility statement',
      intro: 'ASK aims for its digital services to meet WCAG 2.1 level AA and to be usable with different devices and assistive technologies.',
      metaDescription: 'Read the accessibility statement for the Arcada Student Union – ASK website.',
      sections: [
        { title: 'Accessibility approach', body: 'The website uses semantic structure, keyboard-accessible controls, visible focus, responsive layouts, text alternatives and reduced-motion support.' },
        { title: 'Known limitations', body: 'Accessibility testing is ongoing. Some managed content or third-party services may not yet meet every requirement. Known issues will be documented and prioritized as they are identified.' },
        { title: 'Give feedback', body: 'If you encounter an accessibility barrier, contact ASK and describe the page, task and assistive technology involved. We will investigate and respond as soon as practical.' },
      ],
      cta: { label: 'Send accessibility feedback', href: 'mailto:info@asken.fi', external: true },
    },
  },
  contact: {
    eyebrow: 'Contact', title: 'We are here for you', intro: 'Have a question, an idea or need support? Reach ASK through the channel that fits your situation.',
    metaDescription: 'Contact Arcada Student Union – ASK for student support, services, activities and general enquiries.',
    general: 'General enquiries', support: 'Anti-harassment support', visit: 'Visit Cor House', social: 'Follow student life',
    location: 'Cor House, Arcada campus, Helsinki', hoursNote: 'Contact ASK before visiting if you need to confirm availability or accessibility arrangements.',
  },
  footer: { description: 'ASK represents and connects Arcada students through advocacy, services, events and community.', explore: 'Explore', information: 'Information', contact: 'Contact', privacy: 'Privacy policy', accessibility: 'Accessibility', harassment: 'Anti-harassment contact' },
}

const sv: SiteContent = {
  organizationName: 'Arcada Studerandekår – ASK',
  shortName: 'ASK',
  nav: {
    home: 'Hem', about: 'Om ASK', organization: 'Organisation', board: 'Styrelsen', membership: 'Medlemskap', associations: 'Föreningar', collaborations: 'Samarbeten',
    corHouse: 'Cor-huset', booking: 'Bokning', contact: 'Kontakt', news: 'Nyheter', events: 'Evenemang', alumni: 'Alumner', getInvolved: 'Engagera dig', more: 'Mer',
    join: 'Bli medlem', open: 'Öppna navigationen', close: 'Stäng navigationen', main: 'Huvudnavigation', mobile: 'Mobilnavigation',
  },
  common: { learnMore: 'Läs mer', readMore: 'Läs mer', viewAll: 'Visa alla', cmsUnavailable: 'Det redaktionella innehållet är tillfälligt otillgängligt.' },
  home: {
    metaTitle: 'ASK – Din studerandegemenskap vid Arcada',
    metaDescription: 'Upptäck studerandeservice, evenemang, nyheter, medlemskap och gemenskap hos Arcada Studerandekår – ASK.',
    hero: {
      eyebrow: 'Din studerandekår vid Arcada', title: 'Ett starkare studieliv, byggt tillsammans.',
      description: 'ASK representerar Arcadas studerande, skapar gemenskap och gör studievardagen mer givande – på svenska och engelska.',
      primary: 'Bli medlem', secondary: 'Se kommande evenemang',
    },
    about: {
      eyebrow: 'Om ASK', title: 'Studerande stöder studerande',
      body: 'Arcada Studerandekår – ASK representerar studerande, bevakar deras intressen och skapar möjligheter att mötas, delta och påverka livet vid Arcada.', action: 'Lär känna ASK',
    },
    benefits: {
      eyebrow: 'Studerandeförmåner', title: 'Mer värde i studielivet', description: 'Medlemskapet ger dig praktiskt stöd, gemenskap och möjligheter.',
      items: [
        { title: 'En röst vid Arcada', body: 'ASK representerar studerandes intressen och för in studerandeperspektivet i beslutsfattandet.' },
        { title: 'Evenemang och gemenskap', body: 'Träffa andra studerande genom aktiviteter, traditioner och gemensamma upplevelser.' },
        { title: 'Stöd och vägledning', body: 'Hitta hjälp, kontakter och praktisk information när du behöver det.' },
      ],
    },
    associations: {
      eyebrow: 'Studerandeföreningar', title: 'Hitta människor som delar dina intressen',
      body: 'Studerandeföreningar skapar gemenskaper kring studieområden, intressen och aktiviteter. Upptäck hur du kan delta eller starta något nytt.', action: 'Utforska föreningar',
    },
    cor: {
      eyebrow: 'Cor-huset', title: 'Ert gemensamma rum på campus',
      body: 'Cor är en plats för möten, samarbete och studieliv. Läs om huset, praktisk information och bokningsmöjligheter.', action: 'Upptäck Cor-huset',
    },
    membership: {
      eyebrow: 'Bli en del av gemenskapen', title: 'Bli medlem i ASK',
      body: 'Stöd intressebevakningen, delta i gemenskapen och ta del av ASK:s aktiviteter och medlemsmöjligheter.', action: 'Bli medlem via Kide.app',
    },
    news: { eyebrow: 'Senaste från ASK', title: 'Nyheter värda att känna till', description: 'Aktuellt och praktisk information för dina studier och ditt studieliv.', all: 'Se alla nyheter', error: 'De senaste nyheterna är tillfälligt otillgängliga.', empty: 'Nya berättelser är på väg.' },
    events: { eyebrow: 'Möt, lär och fira', title: 'Kommande evenemang', description: 'Se vad som händer härnäst och hitta din plats i ASK-gemenskapen.', all: 'Se alla evenemang', error: 'Kommande evenemang är tillfälligt otillgängliga.', empty: 'Inga kommande evenemang har publicerats ännu.' },
  },
  pages: {
    about: {
      eyebrow: 'Om ASK', title: 'Studerandekåren för alla vid Arcada',
      intro: 'ASK är studerandekåren vid Yrkeshögskolan Arcada. Vi representerar studerande, stärker gemenskapen och hjälper studerande att påverka sin utbildning och vardag.',
      metaDescription: 'Lär känna Arcada Studerandekår – ASK, vårt uppdrag, vår intressebevakning och studerandegemenskap.',
      sections: [
        { title: 'Vårt uppdrag', body: 'ASK finns för att bevaka studerandes intressen och bygga en välkomnande, aktiv studerandegemenskap. Vi arbetar nära studerande och för deras behov vidare i samtal med Arcada och andra partner.' },
        { title: 'Vad vi gör', body: 'Vårt arbete kombinerar intressebevakning, studerandeservice, evenemang, kommunikation och stöd.', items: ['Representerar studerande i frågor som påverkar utbildning och välmående', 'Skapar evenemang och möjligheter att delta', 'Delar tillförlitlig information och hjälper studerande hitta stöd', 'Stöder studerandeföreningar och studerandeinitiativ'] },
        { title: 'En öppen gemenskap', body: 'ASK betjänar studerande på svenska och engelska. Alla ska kunna delta oberoende av bakgrund, identitet eller tidigare erfarenhet av studerandeverksamhet.' },
      ],
    },
    board: {
      eyebrow: 'Förvaltning', title: 'ASK:s styrelse',
      intro: 'Styrelsen leder studerandekårens dagliga arbete och ansvarar för beslut, ekonomi och genomförandet av fullmäktiges riktlinjer.',
      metaDescription: 'Läs om hur styrelsen för Arcada Studerandekår – ASK arbetar och hur studerande kan ta kontakt.',
      sections: [
        { title: 'Styrelsens ansvar', body: 'Styrelsen omsätter strategi och beslut i handling. Ansvaret omfattar bland annat intressebevakning, medlemsservice, evenemang, samarbeten, ekonomi och organisationsutveckling.' },
        { title: 'Studerandeledd verksamhet', body: 'ASK styrs av studerande. Valda representanter fastställer riktningen och styrelsen ansvarar för att genomföra den öppet och ansvarsfullt.' },
        { title: 'Kontakta styrelsen', body: 'Studerande uppmuntras att lyfta idéer, frågor och problem. Kontakta ASK via den allmänna e-postadressen så styrs meddelandet till rätt styrelsemedlem.' },
      ],
      cta: { label: 'Kontakta ASK', href: '/contact' },
    },
    membership: {
      eyebrow: 'Medlemskap', title: 'Hör till, delta och påverka',
      intro: 'Medlemskap i ASK stöder intressebevakningen och ger dig en direkt koppling till studerandegemenskapen vid Arcada.',
      metaDescription: 'Läs om medlemskap i ASK och bli medlem i Arcada Studerandekår via Kide.app.',
      sections: [
        { title: 'Varför bli medlem?', body: 'Medlemskapet stärker ASK:s möjligheter att representera studerande och utveckla service, aktiviteter och gemenskap.', items: ['Stöd studerandes intressebevakning vid Arcada', 'Delta i ASK:s evenemang och gemenskapsaktiviteter', 'Upptäck medlemsmöjligheter och samarbeten', 'Var med och forma framtidens studieliv'] },
        { title: 'Så blir du medlem', body: 'Medlemskapet hanteras via Kide.app. Följ länken, läs den aktuella medlemsinformationen och slutför processen i tjänsten.' },
      ],
      cta: { label: 'Bli medlem via Kide.app', href: 'https://kide.app/', external: true },
    },
    associations: {
      eyebrow: 'Föreningar', title: 'Gemenskaper skapade av studerande',
      intro: 'Föreningar samlar studerande kring studieområden, intressen, kultur och gemensamma aktiviteter.',
      metaDescription: 'Upptäck studerandeföreningar och möjligheter att delta i studerandeledd gemenskap vid Arcada.',
      sections: [
        { title: 'Hitta din gemenskap', body: 'Föreningar är ett enkelt sätt att träffa människor, lära sig nya färdigheter och bidra till campuslivet. Verksamheten kan vara social, professionell, kulturell eller rekreativ.' },
        { title: 'Stöd från ASK', body: 'ASK hjälper studerandegrupper att nå den bredare gemenskapen och kan vägleda nya initiativ till rätt kontakter och praktiska resurser.' },
        { title: 'Syns på webbplatsen', body: 'Föreningsprofilerna utvecklas när redaktionellt innehåll blir tillgängligt. Föreningar kan kontakta ASK för att uppdatera sina uppgifter eller diskutera samarbete.' },
      ],
      cta: { label: 'Kontakta ASK', href: '/contact' },
    },
    'cor-house': {
      eyebrow: 'Cor-huset', title: 'Ett gemensamt hem för studielivet',
      intro: 'Cor-huset är ASK:s studerandeutrymme på Arcadas campus – en plats för gemenskap, aktiviteter och praktisk studerandekårsservice.',
      metaDescription: 'Läs om Cor-huset, ASK:s studerandeutrymme på Arcadas campus.',
      sections: [
        { title: 'En plats att mötas', body: 'Cor är skapat för studielivet. Huset stöder informella möten, evenemang, föreningsverksamhet och samarbete.' },
        { title: 'Användning av utrymmet', body: 'Respektera den gemensamma miljön, andra besökare och gällande husregler. Bokningsinformation och tillgängliga resurser publiceras på ASK:s bokningssida.' },
        { title: 'Tillgänglighet och praktiska frågor', body: 'Kontakta ASK före ditt besök om du behöver tillgänglighetsinformation eller hjälp med att planera en aktivitet på Cor.' },
      ],
      cta: { label: 'Se bokningsinformation', href: '/booking' },
    },
    booking: {
      eyebrow: 'Bokning', title: 'Planera en aktivitet på Cor',
      intro: 'ASK förbereder en digital bokningstjänst för berättigad studerandeverksamhet och gemensamma resurser.',
      metaDescription: 'Hitta aktuell information om bokning av ASK:s utrymmen och resurser i Cor-huset.',
      sections: [
        { title: 'Nuvarande bokningsprocess', body: 'Självbetjäningsbokningen är ännu inte öppen. Kontakta ASK med datum, tid, syfte, förväntat deltagarantal och eventuella tillgänglighetsbehov.' },
        { title: 'Före bokningsförfrågan', body: 'Beakta tid för förberedelser och städning, kapacitet, tillgänglighet, ansvarspersoner och behov av specialutrustning eller tillstånd.' },
        { title: 'Rättvis användning', body: 'ASK bekräftar tillgänglighet och behörighet. En förfrågan är inte en bekräftad bokning innan du har fått en bekräftelse.' },
      ],
      cta: { label: 'Fråga om bokning', href: 'mailto:info@asken.fi', external: true },
    },
    privacy: {
      eyebrow: 'Integritet', title: 'Dataskyddspolicy',
      intro: 'ASK behandlar personuppgifter omsorgsfullt och endast för definierade ändamål som anknyter till medlemskap, kommunikation, service och studerandekårens verksamhet.',
      metaDescription: 'Läs dataskyddspolicyn för Arcada Studerandekår – ASK.',
      sections: [
        { title: 'Uppgifter vi behandlar', body: 'De exakta uppgifterna beror på tjänsten. De kan omfatta kontaktuppgifter, kontouppgifter, bokningsinformation, kommunikationsval och uppgifter som behövs för administration eller rättsliga skyldigheter.' },
        { title: 'Varför uppgifter används', body: 'Personuppgifter används för att tillhandahålla begärda tjänster, sköta berättigad studerandekårsverksamhet, kommunicera när det är tillåtet och uppfylla rättsliga skyldigheter. Tjänstespecifika meddelanden ger mer information vid insamlingen.' },
        { title: 'Lagring och åtkomst', body: 'Åtkomsten begränsas enligt ansvar. Uppgifter bevaras endast så länge som ändamålet, tillämpliga regler och dokumenterade lagringsbeslut kräver.' },
        { title: 'Dina rättigheter', body: 'Beroende på rättslig grund och omständigheter kan du begära tillgång, rättelse, begränsning, radering eller en portabel kopia av dina uppgifter. Kontakta ASK för att göra en begäran eller ställa en dataskyddsfråga.' },
      ],
      cta: { label: 'Kontakta ASK om dataskydd', href: 'mailto:info@asken.fi', external: true },
    },
    accessibility: {
      eyebrow: 'Tillgänglighet', title: 'Tillgänglighetsutlåtande',
      intro: 'ASK strävar efter att de digitala tjänsterna ska uppfylla WCAG 2.1 nivå AA och fungera med olika enheter och hjälpmedel.',
      metaDescription: 'Läs tillgänglighetsutlåtandet för Arcada Studerandekår – ASK:s webbplats.',
      sections: [
        { title: 'Vårt tillgänglighetsarbete', body: 'Webbplatsen använder semantisk struktur, tangentbordstillgängliga kontroller, synlig fokusmarkering, responsiva layouter, textalternativ och stöd för minskad rörelse.' },
        { title: 'Kända begränsningar', body: 'Tillgänglighetstestningen fortsätter. En del redaktionellt innehåll eller tredjepartstjänster uppfyller kanske ännu inte alla krav. Kända problem dokumenteras och prioriteras när de identifieras.' },
        { title: 'Ge respons', body: 'Om du stöter på ett tillgänglighetshinder, kontakta ASK och beskriv sidan, uppgiften och hjälpmedlet. Vi utreder problemet och svarar så snart det är praktiskt möjligt.' },
      ],
      cta: { label: 'Skicka tillgänglighetsrespons', href: 'mailto:info@asken.fi', external: true },
    },
  },
  contact: {
    eyebrow: 'Kontakt', title: 'Vi finns här för dig', intro: 'Har du en fråga, en idé eller behöver du stöd? Nå ASK via den kanal som passar din situation.',
    metaDescription: 'Kontakta Arcada Studerandekår – ASK för studerandestöd, service, aktiviteter och allmänna frågor.',
    general: 'Allmänna frågor', support: 'Stöd vid trakasserier', visit: 'Besök Cor-huset', social: 'Följ studielivet',
    location: 'Cor-huset, Arcadas campus, Helsingfors', hoursNote: 'Kontakta ASK före besöket om du behöver bekräfta tillgänglighet eller praktiska arrangemang.',
  },
  footer: { description: 'ASK representerar och förenar Arcadas studerande genom intressebevakning, service, evenemang och gemenskap.', explore: 'Utforska', information: 'Information', contact: 'Kontakt', privacy: 'Dataskydd', accessibility: 'Tillgänglighet', harassment: 'Trakasserikontakt' },
}

export const siteContent: Record<SiteLocale, SiteContent> = { en, sv }
