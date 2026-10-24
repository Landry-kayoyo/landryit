/**
 * scripts/seed-projects-content.mjs
 * ─────────────────────────────────────────────────────────────
 * Remplissage complet et structuré du contenu des projets
 * (études de cas complètes avec blocs enrichis).
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const raw = fs.readFileSync(".env", "utf-8");
const env = {};
for (const line of raw.split("\n")) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
}

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

function textDoc(text) {
  return {
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text }] }],
  };
}

function listDoc(items) {
  return {
    type: "doc",
    content: [
      {
        type: "bulletList",
        content: items.map((t) => ({
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: t }] }],
        })),
      },
    ],
  };
}

function newId() {
  return "b" + Math.random().toString(36).slice(2, 12);
}

// ==============================================================================
// 1. CLUSTER HAUTE DISPONIBILITÉ
// ==============================================================================
const clusterContent = [
  {
    id: newId(),
    type: "heading",
    text: "Contexte du projet",
    layout: "half",
    tone: "plain",
    variant: "default",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "Dans le cadre de mon travail de fin d'études en administration des systèmes et réseaux à l'Université Don Bosco de Lubumbashi, j'ai étudié la problématique de la continuité des services numériques critiques au sein d'organisations réparties sur plusieurs sites géographiques."
    ),
  },
  {
    id: newId(),
    type: "heading",
    text: "Enjeux et Problématique",
    layout: "half",
    tone: "plain",
    variant: "default",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "Une panne de serveur unique ou un incident physique localisé (coupure électrique, panne matérielle, perte réseau) paralyse l'ensemble des opérations d'une institution. Les sauvegardes traditionnelles prennent du temps à être restaurées, provoquant des heures d'arrêt inacceptables."
    ),
  },
  {
    id: newId(),
    type: "heading",
    text: "Architecture & Solution déployée",
    layout: "full",
    tone: "muted",
    variant: "default",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "Conception et mise en œuvre d'une architecture de cluster étendu (stretch cluster) multi-nœuds sous Linux avec réplication de données en temps réel et basculement automatique sans intervention humaine (failover automatique)."
    ),
  },
  {
    id: newId(),
    type: "list",
    style: "check",
    doc: listDoc([
      "Synchronisation des disques au niveau bloc via DRBD en mode synchrone haute performance.",
      "Gestionnaire de cluster Pacemaker et moteur de communication Corosync pour le quorum et la surveillance des ressources.",
      "Mise en place d'un mécanisme de fencing / STONITH pour prévenir le split-brain et garantir l'intégrité absolue des données.",
      "Répartition de charge et basculement transparent des adresses IP virtuelles de service (Virtual IP).",
      "Tableau de bord de télémétrie et alertes automatisées pour la supervision de l'état des nœuds.",
    ]),
  },
  {
    id: newId(),
    type: "heading",
    text: "Mon rôle personnel",
    layout: "full",
    tone: "plain",
    variant: "default",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "J'ai mené l'étude comparative des solutions de haute disponibilité, dimensionné l'infrastructure virtuelle de test, rédigé les scripts d'automatisation et de surveillance, et simulé des crashs matériels sévères pour valider les temps de basculement."
    ),
  },
  {
    id: newId(),
    type: "heading",
    text: "Technologies & Outils clés",
    layout: "full",
    tone: "plain",
    variant: "default",
  },
  {
    id: newId(),
    type: "list",
    style: "tags",
    doc: listDoc([
      "Linux Ubuntu / Debian",
      "Pacemaker",
      "Corosync",
      "DRBD",
      "KVM / Proxmox",
      "HAProxy",
      "Supervision Zabbix",
      "Bash Scripting",
    ]),
  },
  {
    id: newId(),
    type: "heading",
    text: "Résultats & Impact",
    layout: "full",
    tone: "plain",
    variant: "result",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "Basculement automatique validé en moins de 15 secondes lors des tests de coupure abrupte d'un nœud primaire, avec zéro perte de données et continuité transparente pour les postes clients."
    ),
  },
];

// ==============================================================================
// 2. PAYLIX
// ==============================================================================
const paylixContent = [
  {
    id: newId(),
    type: "heading",
    text: "Contexte de PayLix",
    layout: "half",
    tone: "plain",
    variant: "default",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "PayLix est une application web conçue pour moderniser et fiabiliser la gestion financière des établissements scolaires en République Démocratique du Congo, accessible aux directions, aux comptables et aux parents d'élèves."
    ),
  },
  {
    id: newId(),
    type: "heading",
    text: "Le problème terrain",
    layout: "half",
    tone: "plain",
    variant: "default",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "La majorité des écoles gèrent encore le suivi des frais sur des registres papier ou des tableurs Excel dispersés. Cela engendre des erreurs comptables, des contestations de paiement, de longues files d'attente à la rentrée et un manque de visibilité globale sur les impayés."
    ),
  },
  {
    id: newId(),
    type: "heading",
    text: "Solution développée",
    layout: "full",
    tone: "muted",
    variant: "default",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "Développement d'une plateforme web complète, rapide et sécurisée, pensée pour fonctionner de manière optimale sur ordinateur comme sur smartphone même avec des connexions internet à débit variable."
    ),
  },
  {
    id: newId(),
    type: "list",
    style: "check",
    doc: listDoc([
      "Tableau de bord financier en temps réel : état des recouvrements par classe, niveau et élève.",
      "Génération et émission instantanée de reçus de paiement numériques vérifiables.",
      "Gestion des classes, des sections, des frais périodiques et des échéances de versement.",
      "Interface adaptée aux parents pour consulter l'historique financier de leurs enfants en toute transparence.",
      "Sauvegarde centralisée des données avec export Excel et PDF pour les clôtures d'exercice.",
    ]),
  },
  {
    id: newId(),
    type: "heading",
    text: "Mon rôle & Développement",
    layout: "full",
    tone: "plain",
    variant: "default",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "Conception intégrale du modèle de données, développement des interfaces utilisateur avec React et Tailwind CSS, mise en place des flux de validation comptable et déploiement continu sur cloud."
    ),
  },
  {
    id: newId(),
    type: "heading",
    text: "Stack technique",
    layout: "full",
    tone: "plain",
    variant: "default",
  },
  {
    id: newId(),
    type: "list",
    style: "tags",
    doc: listDoc([
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Vite",
      "PostgreSQL",
      "Vercel",
      "UI Réactive & Mobile-First",
    ]),
  },
  {
    id: newId(),
    type: "heading",
    text: "Accès à la plateforme",
    layout: "full",
    tone: "plain",
    variant: "default",
  },
  {
    id: newId(),
    type: "button",
    label: "Tester la démo en ligne de PayLix",
    url: "https://paylix-gamma.vercel.app/",
  },
  {
    id: newId(),
    type: "heading",
    text: "Résultats & Perspectives",
    layout: "full",
    tone: "plain",
    variant: "result",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "Un outil adopté en phase de test qui réduit de plus de 80% le temps de vérification manuelle des reçus et offre une vision exacte de la trésorerie scolaire à tout instant."
    ),
  },
];

// ==============================================================================
// 3. MARKETNET
// ==============================================================================
const marketnetContent = [
  {
    id: newId(),
    type: "heading",
    text: "Contexte de MarketNet",
    layout: "half",
    tone: "plain",
    variant: "default",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "MarketNet est né du constat quotidien des commerçants et créateurs en RDC et en Afrique francophone qui utilisent intensivement WhatsApp comme vitrine commerciale principale."
    ),
  },
  {
    id: newId(),
    type: "heading",
    text: "Problème à résoudre",
    layout: "half",
    tone: "plain",
    variant: "default",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "Vendre par statut WhatsApp est chronophage : répéter les prix à des dizaines d'acheteurs en privé, ré-envoyer sans cesse des photos, et recevoir des commandes incomplètes (manque de taille, adresse floue, quantité incertaine) qui mènent à des abandons."
    ),
  },
  {
    id: newId(),
    type: "heading",
    text: "Solution apportée",
    layout: "full",
    tone: "muted",
    variant: "default",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "Une plateforme mobile-first qui permet à n'importe quel vendeur de créer sa mini-boutique en ligne en quelques minutes depuis son téléphone, et de recevoir des commandes 100% formatées directement dans son WhatsApp."
    ),
  },
  {
    id: newId(),
    type: "list",
    style: "check",
    doc: listDoc([
      "Catalogue digital interactif avec photos des articles, variantes de tailles/couleurs et prix clairs.",
      "Génération automatique d'un panier d'achat récapitulatif sans obliger le client à créer un compte complexe.",
      "Bouton d'envoi en un clic vers WhatsApp avec message pré-rempli structuré contenant le détail exact de la commande.",
      "Gestion des stocks, activation/désactivation rapide des produits épuisés depuis le smartphone.",
      "Optimisation maximale du poids des images pour un chargement instantané avec les forfaits mobiles locaux.",
    ]),
  },
  {
    id: newId(),
    type: "heading",
    text: "Mon implication",
    layout: "full",
    tone: "plain",
    variant: "default",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "Idéation, modélisation de l'expérience utilisateur mobile, intégration des liens d'API WhatsApp structurés et optimisation des performances de chargement."
    ),
  },
  {
    id: newId(),
    type: "heading",
    text: "Technologies",
    layout: "full",
    tone: "plain",
    variant: "default",
  },
  {
    id: newId(),
    type: "list",
    style: "tags",
    doc: listDoc([
      "Next.js / React",
      "TypeScript",
      "WhatsApp Web API",
      "Cloudinary CDN",
      "Tailwind CSS",
      "Supabase",
    ]),
  },
  {
    id: newId(),
    type: "heading",
    text: "Voir le projet",
    layout: "full",
    tone: "plain",
    variant: "default",
  },
  {
    id: newId(),
    type: "button",
    label: "Accéder à l'application MarketNet",
    url: "https://appmarketnet.vercel.app/",
  },
  {
    id: newId(),
    type: "heading",
    text: "Impact & Retours",
    layout: "full",
    tone: "plain",
    variant: "result",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "Gain de temps considérable pour les vendeurs : fin des malentendus sur les prix et les articles, et une expérience d'achat moderne qui valorise l'image professionnelle du commerçant."
    ),
  },
];

// ==============================================================================
// 4. RÉSEAUX PME (XSECURITY)
// ==============================================================================
const reseauxPmeContent = [
  {
    id: newId(),
    type: "heading",
    text: "Contexte de la mission",
    layout: "half",
    tone: "plain",
    variant: "default",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "Au sein de l'équipe technique de XSECURITY à Lubumbashi, j'interviens chez des entreprises et PME pour concevoir, installer et optimiser leurs infrastructures de réseaux locaux d'entreprise."
    ),
  },
  {
    id: newId(),
    type: "heading",
    text: "Besoins clients fréquents",
    layout: "half",
    tone: "plain",
    variant: "default",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "Réseaux instables avec des câbles non repérés, coupures intempestives d'accès à Internet, impossibilité de partager des imprimantes ou des serveurs de fichiers, et réseaux Wi-Fi saturés sans séparation entre collaborateurs et visiteurs."
    ),
  },
  {
    id: newId(),
    type: "heading",
    text: "Démarche et Réalisations",
    layout: "full",
    tone: "muted",
    variant: "default",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "Mise en place d'une infrastructure réseau structurée, professionnelle et documentée pour garantir performance et évolutivité."
    ),
  },
  {
    id: newId(),
    type: "list",
    style: "check",
    doc: listDoc([
      "Audit sur site de l'existant, plan de câblage et pose de goulottes et prises murales RJ45 blindées.",
      "Montage et organisation complète de baies de brassage avec patch panels étiquetés et repérés.",
      "Segmentation logique du réseau via VLANs (VLAN Administration, Collaborateurs, Invités, Imprimantes).",
      "Configuration de routeurs et switchs manageables (Cisco, MikroTik) avec attribution dynamique DHCP sécurisée.",
      "Déploiement de bornes Wi-Fi professionnelles avec couverture homogène et portail captif pour visiteurs.",
      "Rédaction d'un plan d'adressage IP clair et de schémas de topologie réseau remis au client.",
    ]),
  },
  {
    id: newId(),
    type: "heading",
    text: "Mon rôle",
    layout: "full",
    tone: "plain",
    variant: "default",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "Intervention directe sur le terrain : tirage et sertissage des câbles, configuration logicielle des équipements actifs, tests de débit et de continuité, et formation des référents informatiques de l'entreprise."
    ),
  },
  {
    id: newId(),
    type: "heading",
    text: "Équipements & Compétences",
    layout: "full",
    tone: "plain",
    variant: "default",
  },
  {
    id: newId(),
    type: "list",
    style: "tags",
    doc: listDoc([
      "Câblage structuré Cat 6",
      "Switchs & Routeurs Cisco",
      "MikroTik RouterOS",
      "Segmentation VLAN 802.1Q",
      "Baies de brassage & Patch Panels",
      "Wi-Fi Professionnel UniFi / TP-Link Omada",
      "Testeurs de réseau & Fluke",
    ]),
  },
  {
    id: newId(),
    type: "heading",
    text: "Bénéfices constatés",
    layout: "full",
    tone: "plain",
    variant: "result",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "Stabilité réseau à 100%, élimination des déconnexions aléatoires, partage de ressources fluide entre bureaux et maintenance grandement facilitée par l'étiquetage rigoureux."
    ),
  },
];

// ==============================================================================
// 5. SÉCURISATION SYSTÈMES (XSECURITY)
// ==============================================================================
const securisationContent = [
  {
    id: newId(),
    type: "heading",
    text: "Contexte de sécurité",
    layout: "half",
    tone: "plain",
    variant: "default",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "Mission de renforcement de la sécurité informatique menée auprès d'entreprises partenaires de XSECURITY pour protéger leurs postes de travail, serveurs et données sensibles face aux cybermenaces."
    ),
  },
  {
    id: newId(),
    type: "heading",
    text: "Vulnérabilités identifiées",
    layout: "half",
    tone: "plain",
    variant: "default",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "Utilisation fréquente de mots de passe faibles partagés, absence totale de sauvegarde hors-site, postes de travail dépourvus de protection contre les ransomwares et ports d'accès ouverts directement sur Internet sans filtrage."
    ),
  },
  {
    id: newId(),
    type: "heading",
    text: "Mesures de sécurité déployées",
    layout: "full",
    tone: "muted",
    variant: "default",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "Mise en place d'une politique de sécurité globale articulée autour de la protection périmétrique, de la gestion stricte des privilèges et de la résilience des données."
    ),
  },
  {
    id: newId(),
    type: "list",
    style: "check",
    doc: listDoc([
      "Configuration de pare-feu matériel (Firewall) avec règles de filtrage strictes et blocage des connexions suspectes.",
      "Mise en œuvre d'une stratégie de sauvegarde 3-2-1 automatisée (sauvegardes locales rapides + réplication distante chiffrée).",
      "Gestion centralisée des droits d'accès selon le principe du moindre privilège (fin des comptes administrateurs génériques).",
      "Déploiement et paramétrage d'antivirus professionnels managés avec mises à jour de définitions en temps réel.",
      "Sensibilisation des collaborateurs aux bonnes pratiques d'hygiène numérique (détection du phishing, verrouillage des sessions).",
    ]),
  },
  {
    id: newId(),
    type: "heading",
    text: "Mon intervention",
    layout: "full",
    tone: "plain",
    variant: "default",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "Audit des vulnérabilités, durcissement (hardening) des systèmes Windows et Linux, paramétrage des routines de sauvegarde chiffrées et tests récurrents de restauration de données pour garantir leur exploitabilité."
    ),
  },
  {
    id: newId(),
    type: "heading",
    text: "Outils & Protocoles",
    layout: "full",
    tone: "plain",
    variant: "default",
  },
  {
    id: newId(),
    type: "list",
    style: "tags",
    doc: listDoc([
      "Pare-feu pfSense / Fortinet",
      "Stratégie de sauvegarde 3-2-1",
      "Chiffrement AES-256",
      "Gestion des accès & Active Directory",
      "Hardening systèmes Windows & Linux",
      "Plan de Reprise d'Activité (PRA)",
    ]),
  },
  {
    id: newId(),
    type: "heading",
    text: "Résultats",
    layout: "full",
    tone: "plain",
    variant: "result",
  },
  {
    id: newId(),
    type: "paragraph",
    doc: textDoc(
      "Données critiques protégées et récupérables en moins de 30 minutes en cas de sinistre ou d'attaque par rançongiciel, avec une sérénité totale pour les dirigeants d'entreprise."
    ),
  },
];

// ==============================================================================
// APPLICATION EN BASE DE DONNÉES
// ==============================================================================
async function main() {
  console.log("🚀 Mise à jour du contenu riche des projets en cours...");

  const updates = [
    { slug: "cluster-haute-disponibilite", content: clusterContent },
    { slug: "paylix", content: paylixContent },
    { slug: "marketnet", content: marketnetContent },
    { slug: "reseaux-pme", content: reseauxPmeContent },
    { slug: "securisation-systemes", content: securisationContent },
  ];

  for (const item of updates) {
    const { data, error } = await supabase
      .from("projects")
      .update({ content: item.content, status: "published" })
      .eq("slug", item.slug)
      .select("id, title, slug");

    if (error) {
      console.error(`❌ Erreur pour ${item.slug}:`, error.message);
    } else {
      console.log(`✅ ${item.slug} (${data?.[0]?.title}) mis à jour avec succès !`);
    }
  }

  console.log("\n🎉 Tous les projets disposent maintenant d'un contenu complet, soigné et prêt à être consulté ou édité dans l'admin !");
}

main().catch((err) => {
  console.error("Erreur fatale:", err);
  process.exit(1);
});
