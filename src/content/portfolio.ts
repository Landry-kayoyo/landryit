// Tout le contenu du site est ici : modifiez ce fichier pour mettre à jour les textes.
const cv = { url: "/cv.pdf" };

// Adresse publique du site : sert à l'image d'aperçu au partage (WhatsApp, LinkedIn, Facebook, X).
export const siteUrl = "https://project-trailblazer-hub.lovable.app";
export const shareImage = { url: `${siteUrl}/og-landry-net.jpg`, width: 1200, height: 630, alt: "Logo Landry Net" };

// ─────────────────────────────────────────────────────────
// WHATSAPP — c'est ici que vous changez votre numéro.
// Écrivez-le sans "+", sans espaces ni tirets, avec l'indicatif du pays.
// RD Congo : 243 puis votre numéro  →  243906619747
// ─────────────────────────────────────────────────────────
export const whatsappNumber = "243906619747";

// Message écrit d'avance pour la personne qui clique sur le bouton WhatsApp.
export const whatsappMessage =
  "Bonjour Landry, je vous contacte depuis votre portfolio.";

// Lien WhatsApp complet, construit automatiquement à partir du numéro ci-dessus.
export const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

export const profile = {
  name: "Landry Kayoyo",
  fullName: "Ngoy Bahati Kayoyo Landry",
  title: "Administrateur systèmes & réseaux | Développeur web",
  tagline:
    "Je conçois des infrastructures fiables et des applications web utiles — du câblage réseau jusqu'à la mise en ligne.",
  email: "Kayoyolandry@gmail.com",
  phone: "+243 906 619 747",
  phoneHref: "tel:+243906619747",
  whatsappNumber,
  whatsappMessage,
  whatsapp: whatsappUrl,
  linkedin: "https://cd.linkedin.com/in/landry-kayoyo-48141534b",
  github: "https://github.com/landrykayoyo",
  location: "Lubumbashi, RD Congo",
  cvUrl: cv.url,
};

// Les liens avec "href" mènent à une section de la page d'accueil ;
// ceux avec "to" mènent à une page dédiée.
export const nav = [
  { to: "/a-propos", label: "À propos" },
  { href: "#competences", label: "Compétences" },
  { href: "#projets", label: "Projets" },
  { href: "#parcours", label: "Parcours" },
  { href: "#contact", label: "Contact" },
];

// Résumé court affiché sur la page d'accueil (5 à 8 lignes).
export const about = [
  "Diplômé en administration des systèmes et réseaux à l'Université Don Bosco de Lubumbashi, je suis membre de l'équipe technique de XSECURITY.",
  "J'accompagne les petites entreprises : mise en place de réseaux, sécurisation des systèmes et développement d'applications web.",
  "Mon objectif : livrer des services fiables, sécurisés et simples à maintenir.",
];

// Contenu de la page dédiée /a-propos. Le texte de « story » est une
// proposition crédible : remplacez-le par votre vraie histoire quand vous voulez.
export const aboutPage = {
  back: "Retour à l'accueil",
  readStory: "Lire mon histoire",
  eyebrow: "À propos de moi",
  title: "Derrière les réseaux et le code, il y a une histoire.",
  intro: "Administrateur systèmes & réseaux et développeur web à Lubumbashi — et avant tout, quelqu'un qui aime comprendre comment les choses fonctionnent.",
  storyTitle: "Mon histoire",
  story: [
    "Administrateur systèmes & réseaux et développeur web à Lubumbashi, j'interviens au cœur des infrastructures numériques pour garantir leur continuité, leur sécurité et leur efficacité.",
    "Diplômé en administration des systèmes et réseaux de l'Université Don Bosco de Lubumbashi, j'ai forgé mes compétences autour des architectures résilientes et de la haute disponibilité par cluster. Mes expériences pratiques au sein de l'INPP et de la CNSS m'ont confronté aux réalités du terrain : maintenir des services critiques, assister les utilisateurs et anticiper les pannes avant qu'elles n'impactent l'activité.",
    "Aujourd'hui membre de l'équipe technique de XSECURITY, j'accompagne les entreprises dans l'installation de réseaux fiables, la sécurisation de leurs données et la création d'applications web modernes (comme PayLix). Ma double maîtrise des réseaux et du code me permet de livrer des solutions cohérentes de bout en bout, sans intermédiaire.",
    "Mon engagement est simple : transformer la complexité technique en outils stables, clairs et immédiatement utiles à votre organisation.",
  ],
  valuesTitle: "Ce qui me motive",
  valuesIntro: "Quatre principes guident chacune de mes missions, du câblage d'un bureau au déploiement d'une plateforme web.",
  values: [
    { title: "Fiabilité", text: "Un service qui tombe, c'est une activité qui s'arrête. Je conçois des systèmes pensés pour durer et rester disponibles." },
    { title: "Sécurité", text: "Les données de mes clients sont précieuses. J'intègre la protection dès la conception, jamais après coup." },
    { title: "Clarté", text: "Un bon travail est un travail que l'on comprend : je documente et j'explique mes choix en langage simple." },
    { title: "Progrès continu", text: "La technologie évolue vite. Formations, veille et projets personnels font partie de ma routine." },
  ],
  milestonesTitle: "Les moments clés de mon parcours",
  ctaTitle: "Travaillons ensemble",
  ctaText: "Un réseau à installer, un système à sécuriser, une application à développer ? Racontez-moi votre projet — je vous réponds rapidement.",
  cta: "Me contacter",
};

export const skills = [
  { category: "Systèmes", icon: "server", items: ["Windows", "Ubuntu / Linux", "Virtualisation", "Clusters haute disponibilité"] },
  { category: "Réseaux", icon: "network", items: ["Réseaux LAN", "Adressage IP", "Cisco Packet Tracer", "Dépannage réseau"] },
  { category: "Sécurité", icon: "shield", items: ["Sécurisation des systèmes", "Gestion des accès", "Sauvegardes", "Continuité de service"] },
  { category: "Développement web", icon: "code", items: ["HTML / CSS", "JavaScript", "Applications web", "Bases de données"] },
  { category: "Support & outils", icon: "wrench", items: ["Support informatique", "Matériel informatique", "Outils open source", "Git"] },
];

export const projectPage = {
  back: "Tous les projets",
  readMore: "Voir le projet en détail",
  live: "Voir le projet en ligne",
  liveShort: "Accéder au site",
  liveBadge: "En ligne",
  eyebrow: "Étude de cas",
  technologies: "Technologies & outils",
  contactTitle: "Un besoin similaire ? Parlons-en.",
  contactText: "Vous avez un projet de réseau, de sécurité ou d'application web ? Échangeons sur votre besoin.",
  contact: "Discuter sur WhatsApp",
  email: "M'écrire par email",
  next: "Découvrir un autre projet",
  unavailableText: "Ce projet n'est pas disponible. Retrouvez les autres réalisations du portfolio.",
};

export const languages = [
  { name: "Français", level: "Langue maternelle", value: 100 },
  { name: "Swahili", level: "Courant", value: 85 },
  { name: "Anglais", level: "Débutant", value: 30 },
];

// À remplacer par de vrais témoignages.
export const testimonials = [
  { quote: "Landry est rigoureux et toujours prêt à apprendre. Il a su s'intégrer rapidement à l'équipe et prendre en charge le support aux utilisateurs.", name: "Jean Ngoy", role: "Encadreur de stage" },
  { quote: "Un technicien sérieux qui comprend à la fois le réseau et le développement. Il explique clairement ses choix.", name: "Don Moen", role: "Collègue, XSECURITY" },
  { quote: "Travail soigné, délais respectés et une vraie envie de bien faire. Je le recommande.", name: "Leader Bokassa", role: "Client" },
];
