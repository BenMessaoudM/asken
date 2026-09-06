export type PublicLanguage = "sv" | "en";
export type PublicPageKind = "info" | "news" | "events" | "documents" | "people" | "contact" | "privacy_request";
export type PublicSection = { title: string; body?: string[]; bullets?: string[]; links?: { label: string; href: string }[] };
export type PublicPageDefinition = { lang: PublicLanguage; alternate: string; eyebrow: string; title: string; lead: string; kind?: PublicPageKind; sections: PublicSection[]; formType?: "contact"|"support"|"harassment"|"tutoring"|"recruitment"|"partnership"|"event" };

const sv = (alternate:string,eyebrow:string,title:string,lead:string,sections:PublicSection[],extra:Partial<PublicPageDefinition>={}):PublicPageDefinition=>({lang:"sv",alternate,eyebrow,title,lead,sections,...extra});
const en = (alternate:string,eyebrow:string,title:string,lead:string,sections:PublicSection[],extra:Partial<PublicPageDefinition>={}):PublicPageDefinition=>({lang:"en",alternate,eyebrow,title,lead,sections,...extra});

export const publicPages:Record<string,PublicPageDefinition>={
  "om-ask":sv("/about","Om studerandekåren","ASK finns för varje Arcada-studerande","Vi bygger gemenskap, försvarar studerandes rättigheter och gör det lättare att påverka vardagen vid Arcada.",[
    {title:"Vårt uppdrag",body:["ASK är studerandekåren vid Yrkeshögskolan Arcada. Vi representerar studerande, ordnar verksamhet och stöder ett tryggt och jämlikt studentliv."],bullets:["Studentinflytande och representation","Medlemskap, studentkort och förmåner","Evenemang, gemenskap och Cor-huset","Rådgivning och stöd i studierelaterade frågor"]},
    {title:"Så styrs ASK",body:["Fullmäktige är studerandekårens högsta beslutande organ. Styrelse och personal verkställer verksamheten inom sina uppdrag."],links:[{label:"Organisation och demokrati",href:"/organisation"},{label:"Dokument",href:"/dokument"}]},
    {title:"Svenska först, öppet för fler",body:["Svenska är webbplatsens huvudspråk och engelska erbjuds som andraspråk. Innehållssystemet kan hantera fler översättningar när ASK behöver det."]}
  ]),
  "about":en("/om-ask","About the student union","ASK is here for every Arcada student","We build community, defend student rights and make it easier to influence everyday life at Arcada.",[
    {title:"Our mission",body:["ASK is the student union at Arcada University of Applied Sciences. We represent students, organise activities and support a safe and equal student life."],bullets:["Student advocacy and representation","Membership, student card and benefits","Events, community and Cor House","Guidance in study-related matters"]},
    {title:"How ASK is governed",body:["The Council is the student union’s highest decision-making body. The Board and staff implement its decisions within their mandates."],links:[{label:"Organisation and democracy",href:"/governance"},{label:"Documents",href:"/documents"}]},
    {title:"Swedish first, open to more",body:["Swedish is the website’s primary language and English is offered as a second language. The content system can support more translations when ASK needs them."]}
  ]),
  "historia":sv("/history","ASK genom åren","Vår historia skapas av studerande","ASK:s identitet, traditioner och studentinflytande har formats av generationer av Arcada-studerande.",[
    {title:"Ett levande arkiv",body:["Historiska milstolpar, tidigare förtroendevalda och verksamhetsberättelser publiceras här efter att materialet har verifierats av ASK."],links:[{label:"Årsberättelser och dokument",href:"/dokument"}]},
    {title:"Bidra till historien",body:["Har du fotografier, affischer eller minnen från ASK? Kontakta oss så bedömer vi materialet, upphovsrätten och samtycken före publicering."],links:[{label:"Kontakta ASK",href:"/kontakt"}]}
  ]),
  "history":en("/historia","ASK through the years","Our history is made by students","ASK’s identity, traditions and student advocacy have been shaped by generations of Arcada students.",[
    {title:"A living archive",body:["Verified milestones, former representatives and annual reports will be published here as ASK completes the archive."],links:[{label:"Annual reports and documents",href:"/documents"}]},
    {title:"Contribute to the story",body:["Do you have photographs, posters or memories from ASK? Contact us so ownership, copyright and consent can be checked before publication."],links:[{label:"Contact ASK",href:"/contact"}]}
  ]),
  "styrelse-och-personal":sv("/board-and-staff","Människorna bakom ASK","Styrelse och personal","Här publicerar ASK aktuella förtroendevalda, ansvarsområden och kontaktvägar från backoffice.",[
    {title:"Styrelsen",body:["Styrelsen leder den löpande verksamheten enligt fullmäktiges beslut. Endast offentliga roller och kontaktuppgifter visas här."]},
    {title:"Personal",body:["Personalen ger kontinuitet, service och sakkunskap. Personuppgifter publiceras endast för arbetsrelaterade kontaktändamål."]}
  ],{kind:"people"}),
  "board-and-staff":en("/styrelse-och-personal","The people behind ASK","Board and staff","ASK publishes current elected representatives, responsibilities and contact routes here through the back office.",[
    {title:"The Board",body:["The Board leads ongoing operations according to Council decisions. Only public roles and work contact details are displayed."]},
    {title:"Staff",body:["Staff provide continuity, services and expertise. Personal data is published only for work-related contact purposes."]}
  ],{kind:"people"}),
  "medlemskap":sv("/membership","Medlem i ASK","Medlemskap som följer med genom studietiden","Köp medlemskap via ASK:s officiella Kide.app-sida och få studentkort, medlemspris och en starkare studentröst.",[
    {title:"Det här ingår",bullets:["Digitalt studentkort enligt den produkt du köper","Medlemspriser på ASK-evenemang","Medlemsförmåner och erbjudanden","Rösträtt och möjlighet att ställa upp i studentdemokratin"]},
    {title:"Köp och förnya",body:["Produkter, aktuella priser och giltighet visas i Kide.app. Betalning och leverans hanteras där."],links:[{label:"Öppna ASK i Kide.app",href:"https://kide.app/community/b112ffe9-2deb-4894-a4b8-ed1b70ef1a00"}]},
    {title:"Problem med medlemskapet?",body:["Skicka köpdatum och den e-postadress som användes i Kide.app. Skicka aldrig kortuppgifter eller lösenord."],links:[{label:"Kontakta medlemsservicen",href:"/kontakt"}]}
  ]),
  "membership":en("/medlemskap","ASK membership","Membership throughout your studies","Buy membership through ASK’s official Kide.app page for a student card, member pricing and a stronger student voice.",[
    {title:"What is included",bullets:["A digital student card according to the product purchased","Member pricing at ASK events","Member benefits and offers","Voting rights and eligibility in student democracy"]},
    {title:"Buy and renew",body:["Products, current prices and validity are shown in Kide.app. Payment and delivery are handled there."],links:[{label:"Open ASK in Kide.app",href:"https://kide.app/community/b112ffe9-2deb-4894-a4b8-ed1b70ef1a00"}]},
    {title:"Membership problem?",body:["Send the purchase date and email address used in Kide.app. Never send card details or passwords."],links:[{label:"Contact membership services",href:"/contact"}]}
  ]),
  "studentkort":sv("/student-card","Medlemskap","Ditt digitala studentkort","Studentkortet visar din medlemsstatus och ger tillgång till de studentförmåner som gäller för din medlemsprodukt.",[
    {title:"Aktivera kortet",body:["Köp eller förnya medlemskapet i Kide.app och följ instruktionerna där. Kontrollera att dina person- och studieuppgifter motsvarar de uppgifter som krävs för produkten."]},
    {title:"Om statusen inte syns",bullets:["Kontrollera att betalningen är genomförd","Uppdatera appen och logga in med samma konto som vid köpet","Kontakta ASK med köpdatum och konto-e-post – aldrig lösenord eller betalkortsuppgifter"]}
  ]),
  "student-card":en("/studentkort","Membership","Your digital student card","The card shows your membership status and provides access to the benefits included in your membership product.",[
    {title:"Activate the card",body:["Purchase or renew membership in Kide.app and follow the instructions there. Make sure your personal and study information meets the product requirements."]},
    {title:"If the status is missing",bullets:["Check that payment completed","Update the app and use the same account as for the purchase","Contact ASK with the purchase date and account email—never a password or card details"]}
  ]),
  "formaner":sv("/benefits","Medlemskap","Förmåner för ASK-medlemmar","Aktuella medlemsförmåner och villkor publiceras här och i de kanaler där förmånen löses in.",[
    {title:"ASK-evenemang",body:["Medlemspris kan erbjudas på utvalda evenemang. Det aktuella priset visas alltid på evenemangssidan eller i Kide.app."]},
    {title:"Externa förmåner",body:["En extern förmån publiceras först när leverantör, giltighet, villkor och eventuell kampanjkod har bekräftats av ASK."]}
  ]),
  "benefits":en("/formaner","Membership","Benefits for ASK members","Current member benefits and conditions are published here and in the service where each benefit is redeemed.",[
    {title:"ASK events",body:["Member pricing may be available for selected events. The current price is always shown on the event page or in Kide.app."]},
    {title:"External benefits",body:["An external benefit is published only after ASK confirms the provider, validity, conditions and any campaign code."]}
  ]),
  "kontakt":sv("/contact","Vi hjälper dig","Kontakta ASK","Skriv till oss om medlemskap, studentinflytande, evenemang, Cor-huset eller samarbete.",[
    {title:"Kontaktuppgifter",body:["ASK – Arcada studerandekår, Majstadsgatan 11, 00560 Helsingfors","E-post: info@asken.fi · Telefon: +358 40 489 0367"]},
    {title:"Vad händer med meddelandet?",body:["Meddelandet sparas i ASK:s backoffice och hanteras av behörig personal. Normalt gallras det senast 12 månader efter att ärendet avslutats."],links:[{label:"Dataskydd",href:"/dataskydd"}]}
  ],{kind:"contact",formType:"contact"}),
  "contact":en("/kontakt","We are here to help","Contact ASK","Write to us about membership, student advocacy, events, Cor House or collaboration.",[
    {title:"Contact details",body:["ASK – Arcada Student Union, Majstadsgatan 11, 00560 Helsinki","Email: info@asken.fi · Phone: +358 40 489 0367"]},
    {title:"What happens to the message?",body:["The message is stored in ASK’s back office and handled by authorised staff. It is normally deleted no later than 12 months after the matter is closed."],links:[{label:"Data protection",href:"/data-protection"}]}
  ],{kind:"contact",formType:"contact"}),
  "stod":sv("/support","Råd och stöd","Du behöver inte lösa allt ensam","ASK hjälper dig hitta rätt väg i frågor om studier, rättigheter, jämlikhet och studentvardag.",[
    {title:"Så kan ASK hjälpa",bullets:["Förklara studerandes rättigheter och processer","Följa med som stöd i ett möte","Hjälpa dig formulera en fråga eller begäran","Vägleda vidare när en annan tjänst ansvarar"]},
    {title:"Brådskande hjälp",body:["Webbformuläret är inte en akutkanal. Vid omedelbar fara, ring nödnumret 112."],links:[{label:"Stöd vid trakasserier",href:"/trakasserier"}]},
    {title:"Integritet",body:["Berätta bara det som behövs för att vi ska kunna kontakta dig. Känsliga uppgifter hanteras med begränsad åtkomst."]}
  ],{kind:"contact",formType:"support"}),
  "support":en("/stod","Advice and support","You do not have to solve everything alone","ASK helps you find the right path in questions about studies, rights, equality and student life.",[
    {title:"How ASK can help",bullets:["Explain student rights and processes","Join a meeting as support","Help formulate a question or request","Guide you to the responsible service"]},
    {title:"Urgent help",body:["This form is not an emergency channel. In immediate danger, call the emergency number 112."],links:[{label:"Harassment support",href:"/harassment-support"}]},
    {title:"Privacy",body:["Share only what is needed for us to contact you. Sensitive information is handled with restricted access."]}
  ],{kind:"contact",formType:"support"}),
  "tutorer":sv("/tutoring","Studentgemenskap","Tutorer välkomnar nya studerande","Tutorer hjälper nya studerande hitta människor, platser och rutiner under starten vid Arcada.",[
    {title:"Bli tutor",body:["När rekryteringen är öppen publicerar ASK uppdrag, krav, utbildningsdatum och ansökningstid här."],bullets:["Introducera nya studerande till campus och gemenskap","Skapa trygg gruppkänsla","Delta i tutorutbildning och följa gemensamma riktlinjer"]},
    {title:"Behöver du en tutor?",body:["Kontakta ASK så kopplar vi din fråga till rätt tutoransvarig."]}
  ],{kind:"contact",formType:"tutoring"}),
  "tutoring":en("/tutorer","Student community","Tutors welcome new students","Tutors help new students find people, places and routines during their start at Arcada.",[
    {title:"Become a tutor",body:["When recruitment opens, ASK publishes the role, requirements, training dates and application period here."],bullets:["Introduce students to campus and the community","Build a safe group atmosphere","Attend tutor training and follow common guidance"]},
    {title:"Need a tutor?",body:["Contact ASK and we will route your question to the right tutor coordinator."]}
  ],{kind:"contact",formType:"tutoring"}),
  "utbytesstuderande":sv("/exchange-students","Welcome to Arcada","För utbytesstuderande","ASK hjälper dig hitta studentgemenskapen, evenemang och praktisk information under tiden i Helsingfors.",[
    {title:"Kom igång",bullets:["Lär känna ASK och ämnesföreningarna","Se kommande evenemang","Fråga om medlemskap och studentkort","Kontakta oss om du inte vet vart du ska vända dig"]},
    {title:"Språk",body:["Du kan kontakta ASK på svenska eller engelska. Engelska används som gemensamt språk när det behövs."]}
  ]),
  "exchange-students":en("/utbytesstuderande","Welcome to Arcada","For exchange students","ASK helps you find the student community, events and practical information during your time in Helsinki.",[
    {title:"Get started",bullets:["Meet ASK and the student associations","See upcoming events","Ask about membership and the student card","Contact us if you do not know where to turn"]},
    {title:"Languages",body:["You can contact ASK in Swedish or English. English is used as a shared language when needed."]}
  ]),
  "trakasserier":sv("/harassment-support","Tryggare studentliv","Stöd vid trakasserier","Om du har upplevt trakasserier, diskriminering eller osakligt bemötande kan du kontakta ASK för stöd och vägledning.",[
    {title:"Du bestämmer takten",body:["Vi lyssnar, förklarar möjliga alternativ och hjälper dig hitta rätt process. Vi lovar inte ett visst resultat och vidtar inte åtgärder utan att först diskutera dem med dig, utom när lag kräver annat."]},
    {title:"Integritet och säkerhet",body:["Ärenden kan innehålla känsliga uppgifter och ges därför begränsad åtkomst. Skriv bara det som behövs för första kontakten. Formuläret är inte en akutkanal; ring 112 vid omedelbar fara."]}
  ],{kind:"contact",formType:"harassment"}),
  "harassment-support":en("/trakasserier","A safer student life","Harassment support","If you have experienced harassment, discrimination or inappropriate treatment, you can contact ASK for support and guidance.",[
    {title:"You set the pace",body:["We listen, explain possible options and help identify the right process. We do not promise a particular outcome or take action without first discussing it with you, except where law requires otherwise."]},
    {title:"Privacy and safety",body:["Cases may contain sensitive information and therefore have restricted access. Share only what is needed for first contact. This form is not an emergency channel; call 112 in immediate danger."]}
  ],{kind:"contact",formType:"harassment"}),
  "rekrytering":sv("/recruitment","Engagera dig","Lediga uppdrag och rekrytering","Här publicerar ASK anställningar, förtroendeuppdrag, funktionärsroller och tutorrekrytering.",[
    {title:"Öppna möjligheter",body:["Varje annons ska ange uppdrag, krav, tidsperiod, ersättning om sådan finns, sista ansökningsdag och hur urvalet görs."]},
    {title:"Öppen ansökan",body:["Du kan också berätta hur du vill bidra. En öppen ansökan är inte ett löfte om uppdrag och gallras normalt inom 12 månader."]}
  ],{kind:"contact",formType:"recruitment"}),
  "recruitment":en("/rekrytering","Get involved","Open roles and recruitment","ASK publishes employment, elected positions, volunteer roles and tutor recruitment here.",[
    {title:"Open opportunities",body:["Every notice should state the role, requirements, term, any compensation, deadline and selection process."]},
    {title:"Open application",body:["You can also tell us how you would like to contribute. An open application does not guarantee a role and is normally deleted within 12 months."]}
  ],{kind:"contact",formType:"recruitment"}),
  "organisation":sv("/governance","Studentdemokrati","Så är ASK organiserat","Studerande väljer riktningen. Offentliga beslut, roller och dokument ska vara lätta att hitta och förstå.",[
    {title:"Fullmäktige",body:["Fullmäktige är ASK:s högsta beslutande organ. Offentliga mötesdatum, föredragningslistor och protokoll publiceras på webbplatsen."],links:[{label:"Fullmäktige",href:"/fullmaktige"}]},
    {title:"Råd, utskott och representanter",links:[{label:"Äldres Råd",href:"/aldres-rad"},{label:"Utskott och kommittéer",href:"/utskott-och-kommitteer"},{label:"Studeranderepresentanter",href:"/studeranderepresentanter"},{label:"Funktionärer",href:"/funktionarer"}]},
    {title:"Avgränsning",body:["Webbplatsen publicerar Fullmäktiges offentliga mötesmaterial. Styrelsens interna möteshantering och interna protokoll ingår inte i den offentliga plattformen."]}
  ]),
  "governance":en("/organisation","Student democracy","How ASK is organised","Students set the direction. Public decisions, roles and documents should be easy to find and understand.",[
    {title:"The Council",body:["The Council is ASK’s highest decision-making body. Public dates, agendas and minutes are published on the website."],links:[{label:"The Council",href:"/council"}]},
    {title:"Councils, committees and representatives",links:[{label:"Seniors’ Council",href:"/seniors-council"},{label:"Committees",href:"/committees"},{label:"Student representatives",href:"/student-representatives"},{label:"Volunteers",href:"/volunteers"}]},
    {title:"Scope",body:["The website publishes the Council’s public meeting material. Internal Board meeting management and internal minutes are not part of the public platform."]}
  ]),
  "fullmaktige":sv("/council","ASK:s högsta beslutande organ","Fullmäktige","Här samlas offentlig information om fullmäktiges roll, möten, föredragningslistor och protokoll.",[
    {title:"Möten",body:["Kommande mötesdatum publiceras som evenemang. Föredragningslista och protokoll publiceras i dokumentarkivet när de är godkända för offentlighet."],links:[{label:"Mötesdokument",href:"/dokument"}]},
    {title:"Påverka",body:["Medlemmar kan följa besluten, kontakta sina representanter och delta i de demokratiska processer som ASK meddelar om."]}
  ],{kind:"documents"}),
  "council":en("/fullmaktige","ASK’s highest decision-making body","The Council","Public information about the Council’s role, meetings, agendas and minutes is collected here.",[
    {title:"Meetings",body:["Upcoming dates are published as events. Agendas and minutes appear in the document archive once approved for public release."],links:[{label:"Meeting documents",href:"/documents"}]},
    {title:"Have an impact",body:["Members can follow decisions, contact representatives and participate in the democratic processes announced by ASK."]}
  ],{kind:"documents"}),
  "aldres-rad":sv("/seniors-council","Erfarenhet och kontinuitet","Äldres Råd","Rådet kan ge ASK institutionellt minne, råd och stöd inom det mandat som fullmäktige eller stadgarna fastställer.",[{title:"Aktuellt mandat",body:["Sammansättning, mandatperiod och offentliga kontaktuppgifter publiceras efter att ASK har godkänt dem."]}]),
  "seniors-council":en("/aldres-rad","Experience and continuity","Seniors’ Council","The Council can provide institutional memory, advice and support within the mandate set by the Council or bylaws.",[{title:"Current mandate",body:["Composition, term and public contact details are published after ASK has approved them."]}]),
  "utskott-och-kommitteer":sv("/committees","Arbetsgrupper","Utskott och kommittéer","Tillfälliga och permanenta grupper bereder frågor, ordnar verksamhet och breddar deltagandet.",[{title:"Aktiva grupper",body:["Namn, uppdrag, mandatperiod och kontaktperson publiceras som innehåll i backoffice. Interna arbetsanteckningar visas inte offentligt."]},{title:"Delta",body:["Öppna platser publiceras under rekrytering."],links:[{label:"Se rekrytering",href:"/rekrytering"}]}]),
  "committees":en("/utskott-och-kommitteer","Working groups","Committees","Temporary and permanent groups prepare matters, organise activities and broaden participation.",[{title:"Active groups",body:["Names, mandates, terms and contacts are published through the back office. Internal working notes are not public."]},{title:"Participate",body:["Open positions are published under recruitment."],links:[{label:"View recruitment",href:"/recruitment"}]}]),
  "studeranderepresentanter":sv("/student-representatives","Studenternas röst","Studeranderepresentanter","Representanter för in studerandes perspektiv i organ och arbetsgrupper där beslut påverkar utbildning och vardag.",[{title:"Uppdraget",bullets:["Förbereda sig och delta i möten","Lyssna på studerandes erfarenheter","Rapportera relevanta offentliga frågor tillbaka","Hantera konfidentiella uppgifter ansvarsfullt"]},{title:"Bli representant",links:[{label:"Öppna uppdrag",href:"/rekrytering"}]}]),
  "student-representatives":en("/studeranderepresentanter","The student voice","Student representatives","Representatives bring the student perspective into bodies and working groups whose decisions affect education and daily life.",[{title:"The role",bullets:["Prepare for and attend meetings","Listen to student experience","Report relevant public matters back","Handle confidential information responsibly"]},{title:"Become a representative",links:[{label:"Open positions",href:"/recruitment"}]}]),
  "funktionarer":sv("/volunteers","Gör studentlivet möjligt","Funktionärer","Funktionärer hjälper till med evenemang, kommunikation, gemenskap och praktiska uppgifter.",[{title:"Trygga uppdrag",body:["Varje roll ska ha tydligt ansvar, kontaktperson, introduktion och tillämpliga trygghetsregler."],links:[{label:"Se öppna roller",href:"/rekrytering"}]}]),
  "volunteers":en("/funktionarer","Making student life possible","Volunteers","Volunteers help with events, communications, community and practical tasks.",[{title:"Safe roles",body:["Every role should have clear responsibilities, a contact person, onboarding and applicable safety guidance."],links:[{label:"View open roles",href:"/recruitment"}]}]),
  "dokument":sv("/documents","Öppen förvaltning","Dokument och blanketter","Sök stadgar, reglementen, policyer, årsberättelser samt fullmäktiges offentliga föredragningslistor och protokoll.",[{title:"Offentlighetsprincip",body:["Endast dokument som ASK har godkänt för offentlig publicering visas. Personuppgifter och sekretessbelagda delar ska granskas före publicering."]}],{kind:"documents"}),
  "documents":en("/dokument","Open governance","Documents and forms","Find bylaws, regulations, policies, annual reports, and the Council’s public agendas and minutes.",[{title:"Public release",body:["Only documents approved by ASK for public publication are displayed. Personal data and confidential sections must be reviewed before release."]}],{kind:"documents"}),
  "nyheter":sv("/news","Aktuellt från ASK","Nyheter","Meddelanden, beslut och berättelser från studentgemenskapen.",[],{kind:"news"}),
  "news":en("/nyheter","Latest from ASK","News","Announcements, decisions and stories from the student community.",[],{kind:"news"}),
  "evenemang":sv("/events","Studentliv","Evenemang","Hitta ASK:s kommande evenemang och öppna biljettlänken när anmälan finns i Kide.app.",[{title:"Tryggare evenemang",body:["Deltagare förväntas respektera andra och följa evenemangets information. Kontakta ASK om du behöver tillgänglighetsinformation eller stöd."]}],{kind:"events"}),
  "events":en("/evenemang","Student life","Events","Find upcoming ASK events and open the ticket link when registration is available in Kide.app.",[{title:"Safer events",body:["Participants are expected to respect others and follow event information. Contact ASK if you need accessibility information or support."]}],{kind:"events"}),
  "partnerskap":sv("/partnerships","Samarbeta med ASK","Partnerskap och sponsring","Nå Arcada-studerande genom ett tydligt, ansvarsfullt och tidsbegränsat samarbete.",[
    {title:"Så arbetar vi",bullets:["Syfte, motprestationer och giltighet dokumenteras","Synlighet publiceras först efter godkännande","Marknadsföring ska passa studentgemenskapen och ASK:s värderingar","Personuppgifter delas inte för marknadsföring utan giltig grund"]},
    {title:"Aktiva samarbeten",links:[{label:"Föreningar, partner och sponsorer",href:"/samarbeten"}]}
  ],{kind:"contact",formType:"partnership"}),
  "partnerships":en("/partnerskap","Work with ASK","Partnerships and sponsorship","Reach Arcada students through a clear, responsible and time-limited collaboration.",[
    {title:"How we work",bullets:["Purpose, deliverables and validity are documented","Visibility is published only after approval","Marketing must suit the student community and ASK’s values","Personal data is not shared for marketing without a valid basis"]},
    {title:"Active collaborations",links:[{label:"Associations, partners and sponsors",href:"/collaborations"}]}
  ],{kind:"contact",formType:"partnership"}),
  "cor-regler":sv("/cor-rules","Cor-huset","Regler, priser och ansvar","Bokaren ansvarar för deltagare, ordning, utrustning och att lokalerna lämnas i avtalat skick.",[
    {title:"Utrymmen",bullets:["Sal: högst 80 personer","Kök: högst 8 personer","Kabinett och bastu: högst 20 personer","Varje datum och utrymme måste bokas uttryckligen; kontinuerliga dygnsbokningar godkänns inte"]},
    {title:"Prisbekräftelse",body:["De aktuella priserna ovan hämtas direkt från ASK:s bokningsinställningar. Kalkylatorn visar en preliminär uppskattning och ASK bekräftar slutpriset."]},
    {title:"Städning och skador",body:["Extra städning debiteras med en grundavgift på 150 euro. Skador, förlust och andra kostnader dokumenteras och kan faktureras separat. Bokaren kan begära underlag och bestrida en avgift."]},
    {title:"Avtal och tillträde",body:["Externa bokare får avtal för manuell underskrift. Verifierade Arcadaföreningar behöver inget separat avtal. Dörrkod lämnas först när nödvändiga godkännanden och underskrifter är klara."]}
  ]),
  "cor-rules":en("/cor-regler","Cor House","Rules, prices and responsibility","The booker is responsible for participants, order, equipment and leaving the premises in the agreed condition.",[
    {title:"Spaces",bullets:["Hall: maximum 80 people","Kitchen: maximum 8 people","Cabinet and sauna: maximum 20 people","Every date and space must be requested explicitly; continuous 24-hour bookings are not accepted"]},
    {title:"Price confirmation",body:["The current prices above are loaded directly from ASK’s booking settings. The calculator gives a preliminary estimate and ASK confirms the final price."]},
    {title:"Cleaning and damage",body:["Additional cleaning has a base fee of EUR 150. Damage, loss and other costs are documented and may be invoiced separately. The booker may request evidence and dispute a charge."]},
    {title:"Agreement and access",body:["External bookers receive an agreement for manual signature. Verified Arcada associations do not need a separate agreement. The door code is released only after required approvals and signatures."]}
  ]),
  "dataskydd":sv("/data-protection","GDPR och dataskydd","Så behandlar ASK personuppgifter","ASK behandlar bara personuppgifter för tydliga ändamål, begränsar åtkomsten och gallrar uppgifter enligt fastställda tider.",[
    {title:"Personuppgiftsansvarig",body:["ASK – Arcada studerandekår, Majstadsgatan 11, 00560 Helsingfors · info@asken.fi · +358 40 489 0367"]},
    {title:"Behandling på webbplatsen",bullets:["Kontakt-, stöd- och rekryteringsärenden: för att svara och hantera ärendet","Medlemskap och biljetter: uppgifter behandlas i Kide.app enligt respektive tjänsts ansvar","Cor-bokningar: avtal, fakturering, tillträde, säkerhet och skadehantering","ASKungen: frågor behandlas lokalt i webbläsaren i den nuvarande kunskapsbaserade versionen","Tekniska loggar: säkerhet, felsökning och missbruksförebyggande"]},
    {title:"Rättsliga grunder",body:["Beroende på tjänst behandlar ASK uppgifter för avtal och åtgärder före avtal, rättslig förpliktelse, berättigat intresse eller samtycke. Ett samtycke kan återkallas utan att tidigare behandling blir olaglig."]},
    {title:"Mottagare och leverantörer",body:["Behörig ASK-personal får åtkomst utifrån arbetsuppgift. Tekniska leverantörer kan behandla data som personuppgiftsbiträden. Betalning och medlemsköp sker hos Kide.app. En uppdaterad leverantörsförteckning ska hållas i backoffice."]},
    {title:"Dina rättigheter",body:["Du kan begära tillgång, rättelse, radering, begränsning, invända eller i vissa fall få uppgifter överförda. ASK kan behöva verifiera din identitet. Du kan också kontakta Finlands dataombudsmans byrå."],links:[{label:"Skicka en dataskyddsbegäran",href:"#privacy-request"},{label:"Integritet för Cor-bokningar",href:"/integritet"}]},
    {title:"Incidenter och fotografier",body:["Misstänkta personuppgiftsincidenter rapporteras omedelbart internt för bedömning, begränsning och eventuell myndighets- eller individanmälan. Vid evenemang ska information om fotografering och möjlighet att invända vara tydlig."]}
  ],{kind:"privacy_request"}),
  "data-protection":en("/dataskydd","GDPR and data protection","How ASK handles personal data","ASK processes personal data only for clear purposes, restricts access and deletes information according to defined periods.",[
    {title:"Controller",body:["ASK – Arcada Student Union, Majstadsgatan 11, 00560 Helsinki · info@asken.fi · +358 40 489 0367"]},
    {title:"Website processing",bullets:["Contact, support and recruitment cases: to reply and handle the matter","Membership and tickets: information is handled in Kide.app under each service’s responsibilities","Cor bookings: agreements, invoicing, access, security and damage handling","ASKungen: questions are processed locally in the browser in the current knowledge-based version","Technical logs: security, troubleshooting and abuse prevention"]},
    {title:"Legal bases",body:["Depending on the service, ASK relies on contract and pre-contractual steps, legal obligation, legitimate interest or consent. Consent may be withdrawn without affecting earlier lawful processing."]},
    {title:"Recipients and suppliers",body:["Authorised ASK staff receive role-based access. Technical suppliers may process data as processors. Membership purchases and payments take place at Kide.app. An up-to-date processor register should be maintained in the back office."]},
    {title:"Your rights",body:["You may request access, correction, deletion, restriction, object or, in some cases, receive portable data. ASK may need to verify your identity. You may also contact the Finnish Data Protection Ombudsman."],links:[{label:"Submit a data request",href:"#privacy-request"},{label:"Cor booking privacy",href:"/privacy"}]},
    {title:"Incidents and photographs",body:["Suspected personal-data breaches are reported internally at once for assessment, containment and any required authority or individual notification. Event photography information and a way to object should be clearly provided."]}
  ],{kind:"privacy_request"}),
  "kakor":sv("/cookies","Integritet","Kakor och lokal lagring","Webbplatsen ska fungera utan marknadsföringskakor. Nödvändiga tekniska funktioner används för säkerhet, språk och inloggning.",[
    {title:"Nödvändiga funktioner",body:["Inloggning till backoffice och säkerhetsfunktioner kan kräva tekniska kakor. De kan inte stängas av om tjänsten ska fungera."]},
    {title:"Analys och marknadsföring",body:["Ingen valfri analys eller marknadsföringsspårning aktiveras utan att ASK först väljer leverantör, dokumenterar ändamål och inför giltigt samtycke där det krävs."]}
  ]),
  "cookies":en("/kakor","Privacy","Cookies and local storage","The website is designed to work without marketing cookies. Necessary technical functions are used for security, language and sign-in.",[
    {title:"Necessary functions",body:["Back-office sign-in and security may require technical cookies. These cannot be disabled while using the relevant service."]},
    {title:"Analytics and marketing",body:["No optional analytics or marketing tracking is enabled until ASK selects a supplier, documents the purpose and implements valid consent where required."]}
  ]),
  "villkor":sv("/terms","Webbplatsen","Användningsvillkor","Informationen ska hjälpa studerande använda ASK:s tjänster. Specifika köp, evenemang och bokningar kan ha egna villkor som visas före beställning.",[
    {title:"Ansvar",body:["ASK strävar efter korrekt och tillgänglig information men kan behöva ändra tider, priser eller innehåll. En bekräftad beställning eller ett undertecknat avtal har företräde framför allmän webbinformation."]},
    {title:"Tillåten användning",body:["Försök att kringgå säkerhet, överbelasta formulär, använda någon annans bokningslänk eller publicera olagligt material är förbjudna."]},
    {title:"Immateriella rättigheter",body:["ASK:s namn, logotyp och originalmaterial får inte användas så att det antyder ett obefintligt samarbete. Externt material följer respektive rättighetsinnehavares villkor."]}
  ]),
  "terms":en("/villkor","The website","Terms of use","The information helps students use ASK’s services. Purchases, events and bookings may have specific terms shown before ordering.",[
    {title:"Responsibility",body:["ASK aims to provide accurate, accessible information but may need to change times, prices or content. A confirmed order or signed agreement takes precedence over general website information."]},
    {title:"Acceptable use",body:["Attempts to bypass security, overload forms, use another person’s booking link or publish unlawful material are prohibited."]},
    {title:"Intellectual property",body:["ASK’s name, logo and original material must not be used to suggest a partnership that does not exist. External material remains subject to its owner’s terms."]}
  ]),
  "tillganglighet":sv("/accessibility","Tillgänglighet","Alla ska kunna använda ASK:s webbplats","Vi arbetar för tydligt språk, tangentbordsanvändning, god kontrast, responsiv layout och alternativ till visuellt innehåll.",[
    {title:"Rapportera ett problem",body:["Beskriv sidan, vad du försökte göra och vilket hjälpmedel eller vilken enhet du använde. Vi försöker ge informationen i ett tillgängligt format och åtgärda återkommande problem."],links:[{label:"Kontakta ASK",href:"/kontakt"}]},
    {title:"Kända begränsningar",body:["Äldre uppladdade PDF-filer kan sakna full struktur eller taggning. ASK ska granska nya dokument före publicering och erbjuda ett alternativ vid behov."]}
  ]),
  "accessibility":en("/tillganglighet","Accessibility","Everyone should be able to use ASK’s website","We work for plain language, keyboard access, good contrast, responsive layouts and alternatives to visual content.",[
    {title:"Report a problem",body:["Describe the page, what you tried to do and the assistive technology or device used. We will try to provide the information in an accessible format and fix recurring problems."],links:[{label:"Contact ASK",href:"/contact"}]},
    {title:"Known limitations",body:["Older uploaded PDFs may lack complete structure or tagging. ASK should review new documents before publication and provide an alternative when needed."]}
  ]),
  "cor-lokaler":sv("/cor-spaces","Cor-huset","Lokaler, utrustning och vägbeskrivning","Planera besöket och kontrollera vad som ingår innan du skickar bokningsförfrågan.",[
    {title:"Lokaler",bullets:["Sal för högst 80 personer","Kök för högst 8 personer","Kabinett och bastu för högst 20 personer"]},
    {title:"Utrustning",body:["Bokningsbekräftelsen anger vilka utrymmen och vilken utrustning som ingår. Fråga ASK om exakt inventarielista och eventuella begränsningar för ditt datum innan du planerar programmet."]},
    {title:"Hitta till Cor",body:["Cor-huset finns på Majstadsgatan 11, 00560 Helsingfors."],links:[{label:"Öppna karta",href:"https://www.openstreetmap.org/search?query=Majstadsgatan%2011%20Helsinki"}]},
    {title:"Tillgänglighet",body:["Kontakta ASK före bokningen om du behöver information om entré, nivåskillnader, toaletter, parkering eller andra anpassningar. ASK bekräftar den aktuella situationen och möjliga lösningar."]},
    {title:"Bilder",body:["ASK kan publicera aktuella lokalbilder via backoffice när rättigheter, samtycken och alternativtexter har kontrollerats."]}
  ]),
  "cor-spaces":en("/cor-lokaler","Cor House","Spaces, equipment and directions","Plan your visit and check what is included before submitting a booking request.",[
    {title:"Spaces",bullets:["Hall for up to 80 people","Kitchen for up to 8 people","Cabinet and sauna for up to 20 people"]},
    {title:"Equipment",body:["The booking confirmation states which spaces and equipment are included. Ask ASK for the exact inventory and any date-specific limitations before planning your programme."]},
    {title:"Getting to Cor",body:["Cor House is at Majstadsgatan 11, 00560 Helsinki."],links:[{label:"Open map",href:"https://www.openstreetmap.org/search?query=Majstadsgatan%2011%20Helsinki"}]},
    {title:"Accessibility",body:["Contact ASK before booking if you need information about the entrance, level changes, toilets, parking or other adjustments. ASK will confirm the current situation and possible arrangements."]},
    {title:"Gallery",body:["ASK can publish current room photos through the back office after rights, consent and alternative text have been checked."]}
  ]),
};
