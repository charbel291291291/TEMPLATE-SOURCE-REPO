import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Language = "en" | "fr" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.booking": "Book Session",
    "nav.contact": "Contact",
    "nav.whatsapp": "WhatsApp",

    // Hero
    "hero.badge": "Professional Services",
    "hero.name": "Professional",
    "hero.tagline": "Safe space. Evidence-based care. Real progress.",
    "hero.bookSession": "Book a Session",
    "hero.chatWhatsApp": "Chat on WhatsApp",

    // Services Section
    "services.badge": "How I Can Help",
    "services.title": "Specialized Support",
    "services.description":
      "Every person's journey is unique. I offer tailored therapeutic approaches to address your specific needs and goals.",
    "services.viewAll": "View All Services",
    "services.individual": "Individual Therapy",
    "services.individualDesc":
      "Personalized one-on-one sessions tailored to your unique journey.",
    "services.anxiety": "Anxiety & Stress",
    "services.anxietyDesc":
      "Evidence-based techniques to restore calm and build resilience.",
    "services.relationship": "Relationship Support",
    "services.relationshipDesc":
      "Strengthen connections and improve communication patterns.",

    // How It Works
    "howItWorks.badge": "Simple Process",
    "howItWorks.title": "How It Works",
    "howItWorks.description":
      "Getting started is easy. Three simple steps to begin your journey toward healing.",
    "howItWorks.step1Title": "Choose Your Service",
    "howItWorks.step1Desc":
      "Select the type of support that resonates with your needs.",
    "howItWorks.step2Title": "Book Your Time",
    "howItWorks.step2Desc":
      "Pick a convenient slot from available appointments.",
    "howItWorks.step3Title": "Begin Your Journey",
    "howItWorks.step3Desc":
      "Meet online or in-person in a safe, supportive space.",

    // Trust Section
    "trust.title": "A Safe Space for Healing",
    "trust.quote":
      "Every person has the capacity for growth and healing. Our role is to provide a compassionate, non-judgmental environment where you can explore your thoughts and feelings, develop new perspectives, and build the skills needed for lasting change.",
    "trust.author": "— Your Professional",

    // CTA
    "cta.title": "Ready to Begin Your Journey?",
    "cta.description":
      "Take the first step toward healing. Book a session or reach out via WhatsApp for a confidential conversation.",

    // About Page
    "about.badge": "About",
    "about.title": "About the Professional",
    "about.subtitle":
      "Professional dedicated to helping individuals navigate life's challenges with compassion and evidence-based care.",
    "about.approachTitle": "My Approach to Therapy",
    "about.approach1":
      "With years of experience in mental health care, our practice specializes in helping individuals navigate life's challenges with compassion and evidence-based therapeutic approaches.",
    "about.approach2":
      "Our practice is built on creating a safe, non-judgmental space where healing can begin. We believe that every person has the innate capacity for growth and positive change—our role is to help you discover and nurture that potential.",
    "about.approach3":
      "We integrate various therapeutic modalities including Cognitive Behavioral Therapy (CBT), psychodynamic approaches, and mindfulness techniques, tailoring each treatment plan to your unique needs and goals.",
    "about.languages": "English, Arabic & French",
    "about.experience": "10+ Years Experience",
    "about.valuesTitle": "Core Values",
    "about.valuesSubtitle":
      "The principles that guide my practice and commitment to your wellbeing.",
    "about.compassion": "Compassion",
    "about.compassionDesc":
      "Every interaction is grounded in empathy and genuine care for your wellbeing.",
    "about.confidentiality": "Confidentiality",
    "about.confidentialityDesc":
      "Your privacy is sacred. Everything shared remains strictly confidential.",
    "about.evidenceBased": "Evidence-Based",
    "about.evidenceBasedDesc":
      "Therapeutic approaches backed by research and proven effectiveness.",
    "about.excellence": "Excellence",
    "about.excellenceDesc":
      "Committed to continuous learning and the highest standards of care.",
    "about.expectTitle": "What to Expect in Therapy",
    "about.expectSubtitle":
      "Understanding the therapeutic process helps you feel more comfortable and prepared.",
    "about.expectBadge": "Your Journey",
    "about.expect1Title": "First Session",
    "about.expect1Desc":
      "We'll discuss your concerns, goals, and what you hope to achieve. This is a safe space for you to share at your own pace.",
    "about.expect2Title": "Collaborative Approach",
    "about.expect2Desc":
      "Together, we'll develop a personalized treatment plan that fits your unique needs and lifestyle.",
    "about.expect3Title": "Ongoing Support",
    "about.expect3Desc":
      "Regular sessions to work through challenges, celebrate progress, and adjust our approach as needed.",
    "about.expect4Title": "Your Pace",
    "about.expect4Desc":
      "Healing takes time. We move at a pace that feels comfortable and sustainable for you.",
    "about.privacyTitle": "Your Privacy Matters",
    "about.privacyDesc":
      "Everything shared in our sessions is strictly confidential. I adhere to the highest ethical standards and legal requirements to protect your privacy. You can speak freely, knowing your information is safe.",
    "about.beginJourney": "Begin Your Journey",

    // Services Page
    "servicesPage.badge": "Services",
    "servicesPage.title": "Therapeutic Services",
    "servicesPage.subtitle":
      "Personalized mental health support tailored to your unique journey. Every service is designed to help you thrive.",
    "servicesPage.popular": "Popular",
    "servicesPage.duration": "min",
    "servicesPage.online": "Online",
    "servicesPage.inPerson": "In-person",
    "servicesPage.whoFor": "Who it's for:",
    "servicesPage.perSession": "/session",
    "servicesPage.bookNow": "Book Now",
    "servicesPage.flexibleTitle": "Flexible Session Options",
    "servicesPage.flexibleDesc":
      "Choose the format that works best for your lifestyle and comfort level.",
    "servicesPage.onlineTitle": "Online Sessions",
    "servicesPage.onlineDesc":
      "Secure video sessions from the comfort of your home. Available to clients worldwide with a stable internet connection.",
    "servicesPage.officeTitle": "In-Person Sessions",
    "servicesPage.officeDesc":
      "Face-to-face sessions in a calm, private office environment. Available for local clients by appointment.",
    "servicesPage.notSure": "Not Sure Which Service Is Right for You?",
    "servicesPage.notSureDesc":
      "Reach out for a brief consultation to discuss your needs and find the best path forward.",
    "servicesPage.getInTouch": "Get in Touch",

    // Contact Page
    "contact.badge": "Contact",
    "contact.title": "Get in Touch",
    "contact.subtitle":
      "Have questions or ready to begin your journey? I'd love to hear from you.",
    "contact.connectTitle": "Let's Connect",
    "contact.whatsappTitle": "WhatsApp",
    "contact.whatsappDesc": "Preferred for quick responses",
    "contact.emailTitle": "Email",
    "contact.emailDesc": "For detailed inquiries",
    "contact.hoursTitle": "Office Hours",
    "contact.hoursValue": "Mon-Fri, 9AM-6PM",
    "contact.hoursDesc": "Timezone: GMT+3",
    "contact.locationTitle": "Location",
    "contact.locationValue": "Online Sessions Worldwide",
    "contact.locationDesc": "In-person by appointment",
    "contact.preferWhatsApp": "Prefer WhatsApp?",
    "contact.whatsappCTA":
      "For the quickest response, reach out via WhatsApp. I typically respond within a few hours.",
    "contact.startChat": "Start Chat",
    "contact.sendMessage": "Send a Message",
    "contact.fullName": "Full Name",
    "contact.email": "Email",
    "contact.phone": "Phone (optional)",
    "contact.message": "Message",
    "contact.yourName": "Your name",
    "contact.yourEmail": "your@email.com",
    "contact.phonePlaceholder": "+1 (555) 000-0000",
    "contact.messagePlaceholder": "How can I help you?",
    "contact.sendBtn": "Send Message",
    "contact.sending": "Sending...",
    "contact.privacyNote":
      "Your privacy is important. All communications are confidential and handled with the utmost care.",

    // Booking Page
    "booking.title": "Book Your Session",
    "booking.subtitle":
      "Take the first step toward healing. Schedule your appointment in just a few clicks.",
    "booking.service": "Service",
    "booking.type": "Type",
    "booking.time": "Time",
    "booking.details": "Details",
    "booking.selectService": "Select a Service",
    "booking.selectType": "Choose Session Type",
    "booking.selectTime": "Select a Time Slot",
    "booking.yourDetails": "Your Details",
    "booking.onlineSession": "Online Session",
    "booking.inPersonSession": "In-Person",
    "booking.videoCall": "Secure video call",
    "booking.officeVisit": "Office visit",
    "booking.minutes": "minutes",
    "booking.additionalNotes": "Additional Notes (optional)",
    "booking.notesPlaceholder":
      "Anything you'd like to share before our session...",
    "booking.summary": "Booking Summary",
    "booking.total": "Total",
    "booking.back": "Back",
    "booking.continue": "Continue",
    "booking.confirm": "Confirm Booking",
    "booking.confirmed": "Booking Confirmed!",
    "booking.confirmedDesc":
      "Thank you for booking with us. You'll receive a confirmation email with all the details.",
    "booking.yourAppointment": "Your Appointment",
    "booking.messageWhatsApp": "Message on WhatsApp",

    // Footer
    "footer.description":
      "Professional services providing compassionate, evidence-based mental health care.",
    "footer.quickLinks": "Quick Links",
    "footer.services": "Services",
    "footer.contact": "Contact",
    "footer.privacyPolicy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.rights": "All rights reserved.",

    // Common
    "common.required": "required",
  },
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.about": "À propos",
    "nav.services": "Services",
    "nav.booking": "Prendre RDV",
    "nav.contact": "Contact",
    "nav.whatsapp": "WhatsApp",

    // Hero
    "hero.badge": "Services Professionnels",
    "hero.name": "Professional",
    "hero.tagline":
      "Un espace sûr. Des soins basés sur les preuves. De vrais progrès.",
    "hero.bookSession": "Prendre Rendez-vous",
    "hero.chatWhatsApp": "Discuter sur WhatsApp",

    // Services Section
    "services.badge": "Comment je peux vous aider",
    "services.title": "Accompagnement Spécialisé",
    "services.description":
      "Le parcours de chaque personne est unique. Je propose des approches thérapeutiques adaptées à vos besoins et objectifs spécifiques.",
    "services.viewAll": "Voir tous les services",
    "services.individual": "Thérapie Individuelle",
    "services.individualDesc":
      "Séances personnalisées adaptées à votre parcours unique.",
    "services.anxiety": "Anxiété et Stress",
    "services.anxietyDesc":
      "Techniques basées sur les preuves pour retrouver le calme et renforcer la résilience.",
    "services.relationship": "Soutien Relationnel",
    "services.relationshipDesc":
      "Renforcer les liens et améliorer les modes de communication.",

    // How It Works
    "howItWorks.badge": "Processus Simple",
    "howItWorks.title": "Comment ça marche",
    "howItWorks.description":
      "Commencer est facile. Trois étapes simples pour débuter votre chemin vers la guérison.",
    "howItWorks.step1Title": "Choisissez votre service",
    "howItWorks.step1Desc":
      "Sélectionnez le type d'accompagnement qui correspond à vos besoins.",
    "howItWorks.step2Title": "Réservez votre créneau",
    "howItWorks.step2Desc":
      "Choisissez un horaire disponible qui vous convient.",
    "howItWorks.step3Title": "Commencez votre parcours",
    "howItWorks.step3Desc":
      "Rencontrez-moi en ligne ou en personne dans un espace sûr et bienveillant.",

    // Trust Section
    "trust.title": "Un Espace Sûr pour Guérir",
    "trust.quote":
      "Chaque personne a la capacité de grandir et de guérir. Notre rôle est de fournir un environnement compatissant et sans jugement où vous pouvez explorer vos pensées et vos émotions, développer de nouvelles perspectives et acquérir les compétences nécessaires à un changement durable.",
    "trust.author": "— Votre Professionnel",

    // CTA
    "cta.title": "Prêt(e) à commencer votre parcours ?",
    "cta.description":
      "Faites le premier pas vers la guérison. Prenez rendez-vous ou contactez-moi via WhatsApp pour une conversation confidentielle.",

    // About Page
    "about.badge": "À propos",
    "about.title": "À propos du Professionnel",
    "about.subtitle":
      "Professional dévoué(e) à aider les individus à naviguer les défis de la vie avec compassion et soins basés sur les preuves.",
    "about.approachTitle": "Mon Approche Thérapeutique",
    "about.approach1":
      "Avec des années d'expérience en santé mentale, notre pratique se spécialise dans l'aide aux individus pour naviguer les défis de la vie avec compassion et des approches thérapeutiques basées sur les preuves.",
    "about.approach2":
      "Notre pratique est fondée sur la création d'un espace sûr et sans jugement où la guérison peut commencer. Nous croyons que chaque personne possède la capacité innée de croissance et de changement positif — notre rôle est de vous aider à découvrir et nourrir ce potentiel.",
    "about.approach3":
      "Nous intégrons diverses modalités thérapeutiques incluant la Thérapie Cognitivo-Comportementale (TCC), les approches psychodynamiques et les techniques de pleine conscience, adaptant chaque plan de traitement à vos besoins et objectifs uniques.",
    "about.languages": "Anglais, Arabe et Français",
    "about.experience": "10+ Ans d'Expérience",
    "about.valuesTitle": "Valeurs Fondamentales",
    "about.valuesSubtitle":
      "Les principes qui guident ma pratique et mon engagement envers votre bien-être.",
    "about.compassion": "Compassion",
    "about.compassionDesc":
      "Chaque interaction est ancrée dans l'empathie et un souci sincère de votre bien-être.",
    "about.confidentiality": "Confidentialité",
    "about.confidentialityDesc":
      "Votre vie privée est sacrée. Tout ce qui est partagé reste strictement confidentiel.",
    "about.evidenceBased": "Basé sur les Preuves",
    "about.evidenceBasedDesc":
      "Approches thérapeutiques soutenues par la recherche et l'efficacité prouvée.",
    "about.excellence": "Excellence",
    "about.excellenceDesc":
      "Engagée à l'apprentissage continu et aux plus hauts standards de soins.",
    "about.expectTitle": "À quoi s'attendre en thérapie",
    "about.expectSubtitle":
      "Comprendre le processus thérapeutique vous aide à vous sentir plus à l'aise et préparé(e).",
    "about.expectBadge": "Votre Parcours",
    "about.expect1Title": "Première Séance",
    "about.expect1Desc":
      "Nous discuterons de vos préoccupations, objectifs et ce que vous espérez accomplir. C'est un espace sûr pour partager à votre rythme.",
    "about.expect2Title": "Approche Collaborative",
    "about.expect2Desc":
      "Ensemble, nous développerons un plan de traitement personnalisé adapté à vos besoins et votre mode de vie.",
    "about.expect3Title": "Soutien Continu",
    "about.expect3Desc":
      "Des séances régulières pour travailler les défis, célébrer les progrès et ajuster notre approche si nécessaire.",
    "about.expect4Title": "Votre Rythme",
    "about.expect4Desc":
      "La guérison prend du temps. Nous avançons à un rythme qui vous semble confortable et durable.",
    "about.privacyTitle": "Votre Vie Privée Compte",
    "about.privacyDesc":
      "Tout ce qui est partagé lors de nos séances est strictement confidentiel. Je respecte les normes éthiques et légales les plus strictes pour protéger votre vie privée.",
    "about.beginJourney": "Commencer Votre Parcours",

    // Services Page
    "servicesPage.badge": "Services",
    "servicesPage.title": "Services Thérapeutiques",
    "servicesPage.subtitle":
      "Accompagnement en santé mentale personnalisé et adapté à votre parcours unique.",
    "servicesPage.popular": "Populaire",
    "servicesPage.duration": "min",
    "servicesPage.online": "En ligne",
    "servicesPage.inPerson": "En personne",
    "servicesPage.whoFor": "Pour qui :",
    "servicesPage.perSession": "/séance",
    "servicesPage.bookNow": "Réserver",
    "servicesPage.flexibleTitle": "Options de Séance Flexibles",
    "servicesPage.flexibleDesc":
      "Choisissez le format qui convient le mieux à votre mode de vie.",
    "servicesPage.onlineTitle": "Séances en Ligne",
    "servicesPage.onlineDesc":
      "Séances vidéo sécurisées depuis le confort de votre domicile. Disponible dans le monde entier.",
    "servicesPage.officeTitle": "Séances en Personne",
    "servicesPage.officeDesc":
      "Séances en face à face dans un environnement calme et privé. Sur rendez-vous.",
    "servicesPage.notSure": "Pas sûr(e) du service qui vous convient ?",
    "servicesPage.notSureDesc":
      "Contactez-moi pour une brève consultation afin de discuter de vos besoins.",
    "servicesPage.getInTouch": "Me Contacter",

    // Contact Page
    "contact.badge": "Contact",
    "contact.title": "Contactez-moi",
    "contact.subtitle":
      "Vous avez des questions ou êtes prêt(e) à commencer ? J'aimerais avoir de vos nouvelles.",
    "contact.connectTitle": "Restons en Contact",
    "contact.whatsappTitle": "WhatsApp",
    "contact.whatsappDesc": "Préféré pour des réponses rapides",
    "contact.emailTitle": "Email",
    "contact.emailDesc": "Pour les demandes détaillées",
    "contact.hoursTitle": "Heures de Bureau",
    "contact.hoursValue": "Lun-Ven, 9h-18h",
    "contact.hoursDesc": "Fuseau horaire : GMT+3",
    "contact.locationTitle": "Localisation",
    "contact.locationValue": "Séances en ligne mondiales",
    "contact.locationDesc": "En personne sur rendez-vous",
    "contact.preferWhatsApp": "Vous préférez WhatsApp ?",
    "contact.whatsappCTA":
      "Pour une réponse rapide, contactez-moi via WhatsApp. Je réponds généralement dans les quelques heures.",
    "contact.startChat": "Démarrer la Discussion",
    "contact.sendMessage": "Envoyer un Message",
    "contact.fullName": "Nom Complet",
    "contact.email": "Email",
    "contact.phone": "Téléphone (optionnel)",
    "contact.message": "Message",
    "contact.yourName": "Votre nom",
    "contact.yourEmail": "votre@email.com",
    "contact.phonePlaceholder": "+33 1 23 45 67 89",
    "contact.messagePlaceholder": "Comment puis-je vous aider ?",
    "contact.sendBtn": "Envoyer",
    "contact.sending": "Envoi en cours...",
    "contact.privacyNote":
      "Votre vie privée est importante. Toutes les communications sont confidentielles.",

    // Booking Page
    "booking.title": "Réservez Votre Séance",
    "booking.subtitle":
      "Faites le premier pas vers la guérison. Planifiez votre rendez-vous en quelques clics.",
    "booking.service": "Service",
    "booking.type": "Type",
    "booking.time": "Horaire",
    "booking.details": "Détails",
    "booking.selectService": "Sélectionnez un Service",
    "booking.selectType": "Choisissez le Type de Séance",
    "booking.selectTime": "Sélectionnez un Créneau",
    "booking.yourDetails": "Vos Coordonnées",
    "booking.onlineSession": "Séance en Ligne",
    "booking.inPersonSession": "En Personne",
    "booking.videoCall": "Appel vidéo sécurisé",
    "booking.officeVisit": "Visite au cabinet",
    "booking.minutes": "minutes",
    "booking.additionalNotes": "Notes supplémentaires (optionnel)",
    "booking.notesPlaceholder":
      "Quelque chose à partager avant notre séance...",
    "booking.summary": "Résumé de la Réservation",
    "booking.total": "Total",
    "booking.back": "Retour",
    "booking.continue": "Continuer",
    "booking.confirm": "Confirmer la Réservation",
    "booking.confirmed": "Réservation Confirmée !",
    "booking.confirmedDesc":
      "Merci d'avoir réservé avec nous. Vous recevrez un email de confirmation.",
    "booking.yourAppointment": "Votre Rendez-vous",
    "booking.messageWhatsApp": "Message WhatsApp",

    // Footer
    "footer.description":
      "Professional offrant des soins de santé mentale compatissants et basés sur les preuves.",
    "footer.quickLinks": "Liens Rapides",
    "footer.services": "Services",
    "footer.contact": "Contact",
    "footer.privacyPolicy": "Politique de Confidentialité",
    "footer.terms": "Conditions d'Utilisation",
    "footer.rights": "Tous droits réservés.",

    // Common
    "common.required": "obligatoire",
  },
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.about": "عنّي",
    "nav.services": "الخدمات",
    "nav.booking": "حجز جلسة",
    "nav.contact": "اتصل بنا",
    "nav.whatsapp": "واتساب",

    // Hero
    "hero.badge": "الخدمات المهنية",
    "hero.name": "متخصص",
    "hero.tagline": "مساحة آمنة. رعاية قائمة على الأدلة. تقدم حقيقي.",
    "hero.bookSession": "احجز جلسة",
    "hero.chatWhatsApp": "تواصل عبر واتساب",

    // Services Section
    "services.badge": "كيف يمكنني مساعدتك",
    "services.title": "دعم متخصص",
    "services.description":
      "رحلة كل شخص فريدة. أقدم مناهج علاجية مصممة خصيصًا لتلبية احتياجاتك وأهدافك.",
    "services.viewAll": "عرض جميع الخدمات",
    "services.individual": "العلاج الفردي",
    "services.individualDesc": "جلسات شخصية مصممة لرحلتك الفريدة.",
    "services.anxiety": "القلق والتوتر",
    "services.anxietyDesc":
      "تقنيات مبنية على الأدلة لاستعادة الهدوء وبناء المرونة.",
    "services.relationship": "دعم العلاقات",
    "services.relationshipDesc": "تعزيز الروابط وتحسين أنماط التواصل.",

    // How It Works
    "howItWorks.badge": "عملية بسيطة",
    "howItWorks.title": "كيف يعمل",
    "howItWorks.description":
      "البدء سهل. ثلاث خطوات بسيطة لبدء رحلتك نحو الشفاء.",
    "howItWorks.step1Title": "اختر خدمتك",
    "howItWorks.step1Desc": "حدد نوع الدعم الذي يناسب احتياجاتك.",
    "howItWorks.step2Title": "احجز موعدك",
    "howItWorks.step2Desc": "اختر موعدًا مناسبًا من المواعيد المتاحة.",
    "howItWorks.step3Title": "ابدأ رحلتك",
    "howItWorks.step3Desc":
      "التقِ عبر الإنترنت أو شخصيًا في مساحة آمنة وداعمة.",

    // Trust Section
    "trust.title": "مساحة آمنة للشفاء",
    "trust.quote":
      "كل شخص لديه القدرة على النمو والشفاء. دورنا هو توفير بيئة رحيمة وخالية من الأحكام حيث يمكنك استكشاف أفكارك ومشاعرك، وتطوير وجهات نظر جديدة، وبناء المهارات اللازمة للتغيير الدائم.",
    "trust.author": "— متخصصك",

    // CTA
    "cta.title": "مستعد لبدء رحلتك؟",
    "cta.description":
      "اتخذ الخطوة الأولى نحو الشفاء. احجز جلسة أو تواصل عبر واتساب لمحادثة سرية.",

    // About Page
    "about.badge": "عنّي",
    "about.title": "تعرف على المتخصص",
    "about.subtitle":
      "متخصص مكرس(ة) لمساعدة الأفراد على التغلب على تحديات الحياة بالتعاطف والرعاية القائمة على الأدلة.",
    "about.approachTitle": "نهجي في العلاج",
    "about.approach1":
      "مع سنوات من الخبرة في الرعاية الصحية النفسية، تتخصص ممارستنا في مساعدة الأفراد على التغلب على تحديات الحياة بالتعاطف والمناهج العلاجية القائمة على الأدلة.",
    "about.approach2":
      "ممارستنا مبنية على خلق مساحة آمنة وخالية من الأحكام حيث يمكن أن يبدأ الشفاء. نؤمن أن كل شخص لديه القدرة الفطرية على النمو والتغيير الإيجابي — دورنا هو مساعدتك على اكتشاف ورعاية هذه الإمكانية.",
    "about.approach3":
      "ندمج مختلف الأساليب العلاجية بما في ذلك العلاج السلوكي المعرفي (CBT)، والمناهج النفسية الديناميكية، وتقنيات اليقظة الذهنية، مع تخصيص كل خطة علاج لاحتياجاتك وأهدافك الفريدة.",
    "about.languages": "الإنجليزية والعربية والفرنسية",
    "about.experience": "+10 سنوات خبرة",
    "about.valuesTitle": "القيم الأساسية",
    "about.valuesSubtitle": "المبادئ التي توجه ممارستي والتزامي برفاهيتك.",
    "about.compassion": "التعاطف",
    "about.compassionDesc":
      "كل تفاعل مبني على التعاطف والاهتمام الحقيقي برفاهيتك.",
    "about.confidentiality": "السرية",
    "about.confidentialityDesc":
      "خصوصيتك مقدسة. كل ما يُشارك يبقى سريًا تمامًا.",
    "about.evidenceBased": "قائم على الأدلة",
    "about.evidenceBasedDesc": "مناهج علاجية مدعومة بالبحث والفعالية المثبتة.",
    "about.excellence": "التميز",
    "about.excellenceDesc": "ملتزمة بالتعلم المستمر وأعلى معايير الرعاية.",
    "about.expectTitle": "ماذا تتوقع في العلاج",
    "about.expectSubtitle":
      "فهم العملية العلاجية يساعدك على الشعور براحة أكبر والاستعداد.",
    "about.expectBadge": "رحلتك",
    "about.expect1Title": "الجلسة الأولى",
    "about.expect1Desc":
      "سنناقش مخاوفك وأهدافك وما تأمل في تحقيقه. هذه مساحة آمنة لك للمشاركة بوتيرتك الخاصة.",
    "about.expect2Title": "نهج تعاوني",
    "about.expect2Desc":
      "معًا، سنطور خطة علاج شخصية تناسب احتياجاتك ونمط حياتك الفريد.",
    "about.expect3Title": "دعم مستمر",
    "about.expect3Desc":
      "جلسات منتظمة للعمل على التحديات، والاحتفال بالتقدم، وتعديل نهجنا حسب الحاجة.",
    "about.expect4Title": "وتيرتك الخاصة",
    "about.expect4Desc":
      "الشفاء يستغرق وقتًا. نتحرك بوتيرة تشعر فيها بالراحة والاستدامة.",
    "about.privacyTitle": "خصوصيتك مهمة",
    "about.privacyDesc":
      "كل ما يُشارك في جلساتنا سري تمامًا. ألتزم بأعلى المعايير الأخلاقية والقانونية لحماية خصوصيتك. يمكنك التحدث بحرية مع العلم أن معلوماتك آمنة.",
    "about.beginJourney": "ابدأ رحلتك",

    // Services Page
    "servicesPage.badge": "الخدمات",
    "servicesPage.title": "الخدمات العلاجية",
    "servicesPage.subtitle":
      "دعم الصحة النفسية المخصص لرحلتك الفريدة. كل خدمة مصممة لمساعدتك على الازدهار.",
    "servicesPage.popular": "شائع",
    "servicesPage.duration": "دقيقة",
    "servicesPage.online": "عبر الإنترنت",
    "servicesPage.inPerson": "حضوري",
    "servicesPage.whoFor": "لمن هذه الخدمة:",
    "servicesPage.perSession": "/جلسة",
    "servicesPage.bookNow": "احجز الآن",
    "servicesPage.flexibleTitle": "خيارات جلسات مرنة",
    "servicesPage.flexibleDesc":
      "اختر الشكل الذي يناسب نمط حياتك ومستوى راحتك.",
    "servicesPage.onlineTitle": "جلسات عبر الإنترنت",
    "servicesPage.onlineDesc":
      "جلسات فيديو آمنة من راحة منزلك. متاحة للعملاء في جميع أنحاء العالم.",
    "servicesPage.officeTitle": "جلسات حضورية",
    "servicesPage.officeDesc":
      "جلسات وجهًا لوجه في بيئة مكتبية هادئة وخاصة. متاحة بموعد مسبق.",
    "servicesPage.notSure": "غير متأكد من الخدمة المناسبة لك؟",
    "servicesPage.notSureDesc":
      "تواصل للحصول على استشارة موجزة لمناقشة احتياجاتك وإيجاد أفضل مسار للأمام.",
    "servicesPage.getInTouch": "تواصل معي",

    // Contact Page
    "contact.badge": "اتصل بنا",
    "contact.title": "تواصل معي",
    "contact.subtitle": "لديك أسئلة أو مستعد لبدء رحلتك؟ يسعدني أن أسمع منك.",
    "contact.connectTitle": "لنتواصل",
    "contact.whatsappTitle": "واتساب",
    "contact.whatsappDesc": "مفضل للردود السريعة",
    "contact.emailTitle": "البريد الإلكتروني",
    "contact.emailDesc": "للاستفسارات المفصلة",
    "contact.hoursTitle": "ساعات العمل",
    "contact.hoursValue": "الإثنين-الجمعة، 9ص-6م",
    "contact.hoursDesc": "المنطقة الزمنية: GMT+3",
    "contact.locationTitle": "الموقع",
    "contact.locationValue": "جلسات عبر الإنترنت عالميًا",
    "contact.locationDesc": "حضوريًا بموعد مسبق",
    "contact.preferWhatsApp": "تفضل واتساب؟",
    "contact.whatsappCTA":
      "للحصول على أسرع رد، تواصل عبر واتساب. عادةً أرد خلال بضع ساعات.",
    "contact.startChat": "ابدأ المحادثة",
    "contact.sendMessage": "أرسل رسالة",
    "contact.fullName": "الاسم الكامل",
    "contact.email": "البريد الإلكتروني",
    "contact.phone": "الهاتف (اختياري)",
    "contact.message": "الرسالة",
    "contact.yourName": "اسمك",
    "contact.yourEmail": "your@email.com",
    "contact.phonePlaceholder": "+966 50 123 4567",
    "contact.messagePlaceholder": "كيف يمكنني مساعدتك؟",
    "contact.sendBtn": "إرسال",
    "contact.sending": "جاري الإرسال...",
    "contact.privacyNote":
      "خصوصيتك مهمة. جميع المراسلات سرية ويتم التعامل معها بأقصى درجات العناية.",

    // Booking Page
    "booking.title": "احجز جلستك",
    "booking.subtitle":
      "اتخذ الخطوة الأولى نحو الشفاء. حدد موعدك بنقرات قليلة.",
    "booking.service": "الخدمة",
    "booking.type": "النوع",
    "booking.time": "الوقت",
    "booking.details": "التفاصيل",
    "booking.selectService": "اختر خدمة",
    "booking.selectType": "اختر نوع الجلسة",
    "booking.selectTime": "اختر موعدًا",
    "booking.yourDetails": "بياناتك",
    "booking.onlineSession": "جلسة عبر الإنترنت",
    "booking.inPersonSession": "حضوري",
    "booking.videoCall": "مكالمة فيديو آمنة",
    "booking.officeVisit": "زيارة المكتب",
    "booking.minutes": "دقيقة",
    "booking.additionalNotes": "ملاحظات إضافية (اختياري)",
    "booking.notesPlaceholder": "أي شيء تود مشاركته قبل جلستنا...",
    "booking.summary": "ملخص الحجز",
    "booking.total": "الإجمالي",
    "booking.back": "رجوع",
    "booking.continue": "متابعة",
    "booking.confirm": "تأكيد الحجز",
    "booking.confirmed": "تم تأكيد الحجز!",
    "booking.confirmedDesc":
      "شكرًا لحجزك معنا. ستتلقى بريدًا إلكترونيًا تأكيديًا مع جميع التفاصيل.",
    "booking.yourAppointment": "موعدك",
    "booking.messageWhatsApp": "رسالة عبر واتساب",

    // Footer
    "footer.description":
      "متخصص يقدم رعاية صحة نفسية متعاطفة وقائمة على الأدلة.",
    "footer.quickLinks": "روابط سريعة",
    "footer.services": "الخدمات",
    "footer.contact": "اتصل بنا",
    "footer.privacyPolicy": "سياسة الخصوصية",
    "footer.terms": "شروط الخدمة",
    "footer.rights": "جميع الحقوق محفوظة.",

    // Common
    "common.required": "مطلوب",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
