const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '../public/catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const existingSlugs = new Set(catalog.map(p => p.slug));

const famousTools = [
  {
    name: "Slack",
    slug: "slack",
    categoryName: "Communication & Messaging",
    categorySlug: "communication",
    shortDescription: "Team messaging, channel-based collaboration, and real-time chat platform.",
    summary: "Slack is the industry-standard productivity platform that connects teams with the people, apps, and data they need to get work done.",
    websiteUrl: "https://slack.com",
    aliases: ["Slack Technologies", "Slack Messaging"],
    assessment: {
      buildComplexity: 4, integrationDependency: 5, dataMoat: 4, networkEffects: 5, complianceRequirement: 4, infrastructureComplexity: 4, realtimeCollaboration: 5, maintenanceBurden: 4, businessCriticality: 5, migrationComplexity: 4, apiAvailability: 5, workflowAutomatable: 4, openSourceMaturity: 5, alternativeMarketStrength: 5, dataPortability: 3, mobileDependency: 5, permissionComplexity: 4, reliabilityRequirement: 5, vendorLockIn: 4
    },
    pricing: [
      { name: "Free", billingInterval: "monthly", basePrice: 0, pricePerSeat: 0, freeTier: true },
      { name: "Pro", billingInterval: "monthly", basePrice: 8.75, pricePerSeat: 8.75, freeTier: false },
      { name: "Business+", billingInterval: "monthly", basePrice: 15, pricePerSeat: 15, freeTier: false }
    ],
    sources: [{ type: "OFFICIAL_WEBSITE", title: "Slack Official Website", url: "https://slack.com" }],
    openSourceAlternatives: [
      { name: "Mattermost", githubUrl: "https://github.com/mattermost/mattermost", description: "Open-source Slack alternative for developer teams.", stars: "31k★" },
      { name: "Rocket.Chat", githubUrl: "https://github.com/RocketChat/Rocket.Chat", description: "Control your communication with open-source chat.", stars: "41k★" },
      { name: "Zulip", githubUrl: "https://github.com/zulip/zulip", description: "Powerful open-source threaded team chat.", stars: "21k★" }
    ]
  },
  {
    name: "Stripe",
    slug: "stripe",
    categoryName: "Finance & Accounting",
    categorySlug: "finance",
    shortDescription: "Financial infrastructure and payment processing platform for the internet.",
    summary: "Stripe offers suite of payment APIs powering commerce for online businesses of all sizes.",
    websiteUrl: "https://stripe.com",
    aliases: ["Stripe Payments", "Stripe Connect"],
    assessment: {
      buildComplexity: 5, integrationDependency: 5, dataMoat: 5, networkEffects: 4, complianceRequirement: 5, infrastructureComplexity: 5, realtimeCollaboration: 2, maintenanceBurden: 5, businessCriticality: 5, migrationComplexity: 5, apiAvailability: 5, workflowAutomatable: 4, openSourceMaturity: 4, alternativeMarketStrength: 4, dataPortability: 2, mobileDependency: 3, permissionComplexity: 5, reliabilityRequirement: 5, vendorLockIn: 5
    },
    pricing: [
      { name: "Pay-as-you-go", billingInterval: "monthly", basePrice: 0, pricePerSeat: 0, freeTier: true }
    ],
    sources: [{ type: "OFFICIAL_WEBSITE", title: "Stripe Official Website", url: "https://stripe.com" }],
    openSourceAlternatives: [
      { name: "Kill Bill", githubUrl: "https://github.com/killbill/killbill", description: "Open-source subscription billing and payments platform.", stars: "5.2k★" },
      { name: "Hyperswitch", githubUrl: "https://github.com/juspay/hyperswitch", description: "High-performance financial switch and payments router.", stars: "11k★" }
    ]
  },
  {
    name: "Jira",
    slug: "jira",
    categoryName: "Project Management",
    categorySlug: "project-management",
    shortDescription: "Issue tracking and agile project management platform by Atlassian.",
    summary: "Jira is the #1 software development tool used by agile teams to plan, track, and release software.",
    websiteUrl: "https://www.atlassian.com/software/jira",
    aliases: ["Jira Software", "Atlassian Jira"],
    assessment: {
      buildComplexity: 5, integrationDependency: 5, dataMoat: 5, networkEffects: 4, complianceRequirement: 5, infrastructureComplexity: 4, realtimeCollaboration: 4, maintenanceBurden: 5, businessCriticality: 5, migrationComplexity: 5, apiAvailability: 4, workflowAutomatable: 4, openSourceMaturity: 5, alternativeMarketStrength: 5, dataPortability: 3, mobileDependency: 3, permissionComplexity: 5, reliabilityRequirement: 5, vendorLockIn: 5
    },
    pricing: [
      { name: "Free", billingInterval: "monthly", basePrice: 0, pricePerSeat: 0, freeTier: true },
      { name: "Standard", billingInterval: "monthly", basePrice: 7.75, pricePerSeat: 7.75, freeTier: false },
      { name: "Premium", billingInterval: "monthly", basePrice: 15.25, pricePerSeat: 15.25, freeTier: false }
    ],
    sources: [{ type: "OFFICIAL_WEBSITE", title: "Jira Official Website", url: "https://www.atlassian.com/software/jira" }],
    openSourceAlternatives: [
      { name: "Plane", githubUrl: "https://github.com/makeplane/plane", description: "Open-source Jira alternative for tracking issues and product roadmaps.", stars: "32k★" },
      { name: "Taiga", githubUrl: "https://github.com/taigaio/taiga-back", description: "Agile project management platform for startups and cross-functional teams.", stars: "8k★" },
      { name: "Redmine", githubUrl: "https://github.com/redmine/redmine", description: "Flexible project management web application.", stars: "5k★" }
    ]
  },
  {
    name: "HubSpot",
    slug: "hubspot",
    categoryName: "CRM & Sales",
    categorySlug: "crm",
    shortDescription: "Inbound marketing, sales CRM, customer service, and content management platform.",
    summary: "HubSpot offers a complete CRM platform with all the software, integrations, and resources you need to connect marketing, sales, and service.",
    websiteUrl: "https://www.hubspot.com",
    aliases: ["HubSpot CRM", "HubSpot Sales Hub"],
    assessment: {
      buildComplexity: 5, integrationDependency: 5, dataMoat: 5, networkEffects: 3, complianceRequirement: 4, infrastructureComplexity: 4, realtimeCollaboration: 3, maintenanceBurden: 4, businessCriticality: 5, migrationComplexity: 5, apiAvailability: 4, workflowAutomatable: 4, openSourceMaturity: 5, alternativeMarketStrength: 4, dataPortability: 3, mobileDependency: 3, permissionComplexity: 4, reliabilityRequirement: 4, vendorLockIn: 5
    },
    pricing: [
      { name: "Free Tools", billingInterval: "monthly", basePrice: 0, pricePerSeat: 0, freeTier: true },
      { name: "Starter", billingInterval: "monthly", basePrice: 15, pricePerSeat: 15, freeTier: false },
      { name: "Professional", billingInterval: "monthly", basePrice: 800, pricePerSeat: 90, freeTier: false }
    ],
    sources: [{ type: "OFFICIAL_WEBSITE", title: "HubSpot Official Website", url: "https://www.hubspot.com" }],
    openSourceAlternatives: [
      { name: "Twenty", githubUrl: "https://github.com/twentyhq/twenty", description: "Open-source CRM alternative to HubSpot and Salesforce.", stars: "27k★" },
      { name: "SuiteCRM", githubUrl: "https://github.com/salesagility/SuiteCRM", description: "Open-source enterprise CRM application.", stars: "4k★" },
      { name: "Mautic", githubUrl: "https://github.com/mautic/mautic", description: "Open-source marketing automation platform.", stars: "8k★" }
    ]
  },
  {
    name: "Salesforce",
    slug: "salesforce",
    categoryName: "CRM & Sales",
    categorySlug: "crm",
    shortDescription: "Enterprise cloud CRM and customer 360 solution.",
    summary: "Salesforce is the global leader in CRM, empowering companies to connect with customers in a whole new way through cloud-based enterprise software.",
    websiteUrl: "https://www.salesforce.com",
    aliases: ["Salesforce Sales Cloud", "SFDC"],
    assessment: {
      buildComplexity: 5, integrationDependency: 5, dataMoat: 5, networkEffects: 4, complianceRequirement: 5, infrastructureComplexity: 5, realtimeCollaboration: 3, maintenanceBurden: 5, businessCriticality: 5, migrationComplexity: 5, apiAvailability: 4, workflowAutomatable: 4, openSourceMaturity: 4, alternativeMarketStrength: 4, dataPortability: 2, mobileDependency: 4, permissionComplexity: 5, reliabilityRequirement: 5, vendorLockIn: 5
    },
    pricing: [
      { name: "Starter Suite", billingInterval: "monthly", basePrice: 25, pricePerSeat: 25, freeTier: false },
      { name: "Pro Suite", billingInterval: "monthly", basePrice: 100, pricePerSeat: 100, freeTier: false },
      { name: "Enterprise", billingInterval: "monthly", basePrice: 165, pricePerSeat: 165, freeTier: false }
    ],
    sources: [{ type: "OFFICIAL_WEBSITE", title: "Salesforce Official Website", url: "https://www.salesforce.com" }],
    openSourceAlternatives: [
      { name: "Twenty", githubUrl: "https://github.com/twentyhq/twenty", description: "Modern open-source CRM alternative to Salesforce.", stars: "27k★" },
      { name: "SuiteCRM", githubUrl: "https://github.com/salesagility/SuiteCRM", description: "Open-source enterprise CRM alternative.", stars: "4k★" },
      { name: "EspoCRM", githubUrl: "https://github.com/espocrm/espocrm", description: "Open-source CRM web application.", stars: "2k★" }
    ]
  },
  {
    name: "Zoom",
    slug: "zoom",
    categoryName: "Video Conferencing",
    categorySlug: "video-conferencing",
    shortDescription: "Video communications platform for virtual meetings and webinars.",
    summary: "Zoom provides video telephony and online chat services through a cloud-based peer-to-peer software platform.",
    websiteUrl: "https://zoom.us",
    aliases: ["Zoom Meetings", "Zoom Workplace"],
    assessment: {
      buildComplexity: 4, integrationDependency: 3, dataMoat: 3, networkEffects: 5, complianceRequirement: 4, infrastructureComplexity: 5, realtimeCollaboration: 5, maintenanceBurden: 3, businessCriticality: 4, migrationComplexity: 2, apiAvailability: 4, workflowAutomatable: 3, openSourceMaturity: 5, alternativeMarketStrength: 5, dataPortability: 4, mobileDependency: 5, permissionComplexity: 3, reliabilityRequirement: 5, vendorLockIn: 3
    },
    pricing: [
      { name: "Basic", billingInterval: "monthly", basePrice: 0, pricePerSeat: 0, freeTier: true },
      { name: "Pro", billingInterval: "monthly", basePrice: 13.33, pricePerSeat: 13.33, freeTier: false },
      { name: "Business", billingInterval: "monthly", basePrice: 18.33, pricePerSeat: 18.33, freeTier: false }
    ],
    sources: [{ type: "OFFICIAL_WEBSITE", title: "Zoom Official Website", url: "https://zoom.us" }],
    openSourceAlternatives: [
      { name: "Jitsi Meet", githubUrl: "https://github.com/jitsi/jitsi-meet", description: "Open-source video conferencing platform.", stars: "23k★" },
      { name: "BigBlueButton", githubUrl: "https://github.com/bigbluebutton/bigbluebutton", description: "Open-source web conferencing system.", stars: "8k★" },
      { name: "LiveKit", githubUrl: "https://github.com/livekit/livekit", description: "Open-source WebRTC infrastructure platform.", stars: "11k★" }
    ]
  },
  {
    name: "GitHub",
    slug: "github",
    categoryName: "Developer Tools",
    categorySlug: "devops",
    shortDescription: "AI-powered developer platform for code hosting, version control, and CI/CD.",
    summary: "GitHub is the world's leading AI-powered developer platform where over 100 million developers build and host software.",
    websiteUrl: "https://github.com",
    aliases: ["GitHub Enterprise", "GitHub Actions"],
    assessment: {
      buildComplexity: 5, integrationDependency: 5, dataMoat: 5, networkEffects: 5, complianceRequirement: 4, infrastructureComplexity: 4, realtimeCollaboration: 4, maintenanceBurden: 4, businessCriticality: 5, migrationComplexity: 4, apiAvailability: 5, workflowAutomatable: 5, openSourceMaturity: 5, alternativeMarketStrength: 5, dataPortability: 4, mobileDependency: 3, permissionComplexity: 4, reliabilityRequirement: 5, vendorLockIn: 4
    },
    pricing: [
      { name: "Free", billingInterval: "monthly", basePrice: 0, pricePerSeat: 0, freeTier: true },
      { name: "Team", billingInterval: "monthly", basePrice: 4, pricePerSeat: 4, freeTier: false },
      { name: "Enterprise", billingInterval: "monthly", basePrice: 21, pricePerSeat: 21, freeTier: false }
    ],
    sources: [{ type: "OFFICIAL_WEBSITE", title: "GitHub Official Website", url: "https://github.com" }],
    openSourceAlternatives: [
      { name: "Gitea", githubUrl: "https://github.com/go-gitea/gitea", description: "Painless self-hosted Git service.", stars: "46k★" },
      { name: "GitLab CE", githubUrl: "https://gitlab.com/gitlab-org/gitlab-foss", description: "Open-source DevOps platform.", stars: "24k★" },
      { name: "Forgejo", githubUrl: "https://codeberg.org/forgejo/forgejo", description: "Community-managed lightweight software forge.", stars: "4k★" }
    ]
  },
  {
    name: "Supabase",
    slug: "supabase",
    categoryName: "Database & Backend",
    categorySlug: "database",
    shortDescription: "Open-source Firebase alternative providing Postgres database, Auth, Instant APIs, and Storage.",
    summary: "Supabase is an open-source Firebase alternative offering a full Postgres database with realtime subscriptions, instant REST/GraphQL APIs, authentication, and file storage.",
    websiteUrl: "https://supabase.com",
    aliases: ["Supabase Cloud"],
    assessment: {
      buildComplexity: 4, integrationDependency: 4, dataMoat: 4, networkEffects: 3, complianceRequirement: 4, infrastructureComplexity: 4, realtimeCollaboration: 3, maintenanceBurden: 3, businessCriticality: 5, migrationComplexity: 3, apiAvailability: 5, workflowAutomatable: 4, openSourceMaturity: 5, alternativeMarketStrength: 5, dataPortability: 5, mobileDependency: 4, permissionComplexity: 4, reliabilityRequirement: 5, vendorLockIn: 2
    },
    pricing: [
      { name: "Free", billingInterval: "monthly", basePrice: 0, pricePerSeat: 0, freeTier: true },
      { name: "Pro", billingInterval: "monthly", basePrice: 25, pricePerSeat: 0, freeTier: false }
    ],
    sources: [{ type: "OFFICIAL_WEBSITE", title: "Supabase Official Website", url: "https://supabase.com" }],
    openSourceAlternatives: [
      { name: "PocketBase", githubUrl: "https://github.com/pocketbase/pocketbase", description: "Open-source Go backend in 1 file.", stars: "42k★" },
      { name: "Appwrite", githubUrl: "https://github.com/appwrite/appwrite", description: "Open-source end-to-end backend server.", stars: "43k★" },
      { name: "Nhost", githubUrl: "https://github.com/nhost/nhost", description: "Open-source serverless backend platform.", stars: "8k★" }
    ]
  },
  {
    name: "Cloudflare",
    slug: "cloudflare",
    categoryName: "Infrastructure & Security",
    categorySlug: "infrastructure",
    shortDescription: "Global cloud network platform providing CDN, DNS, DDoS protection, and edge computing.",
    summary: "Cloudflare is a global cloud platform that delivers security, performance, and reliability for applications and websites around the world.",
    websiteUrl: "https://cloudflare.com",
    aliases: ["Cloudflare CDN", "Cloudflare Workers"],
    assessment: {
      buildComplexity: 5, integrationDependency: 5, dataMoat: 4, networkEffects: 5, complianceRequirement: 5, infrastructureComplexity: 5, realtimeCollaboration: 2, maintenanceBurden: 4, businessCriticality: 5, migrationComplexity: 4, apiAvailability: 5, workflowAutomatable: 5, openSourceMaturity: 4, alternativeMarketStrength: 4, dataPortability: 3, mobileDependency: 2, permissionComplexity: 4, reliabilityRequirement: 5, vendorLockIn: 4
    },
    pricing: [
      { name: "Free", billingInterval: "monthly", basePrice: 0, pricePerSeat: 0, freeTier: true },
      { name: "Pro", billingInterval: "monthly", basePrice: 20, pricePerSeat: 0, freeTier: false },
      { name: "Business", billingInterval: "monthly", basePrice: 200, pricePerSeat: 0, freeTier: false }
    ],
    sources: [{ type: "OFFICIAL_WEBSITE", title: "Cloudflare Official Website", url: "https://cloudflare.com" }],
    openSourceAlternatives: [
      { name: "Traefik", githubUrl: "https://github.com/traefik/traefik", description: "Open-source cloud native application proxy.", stars: "53k★" },
      { name: "Caddy", githubUrl: "https://github.com/caddyserver/caddy", description: "Powerful, enterprise-ready open-source web server with automatic HTTPS.", stars: "58k★" },
      { name: "BunkerWeb", githubUrl: "https://github.com/bunkerity/bunkerweb", description: "Open-source Web Application Firewall (WAF).", stars: "7k★" }
    ]
  }
];

let addedCount = 0;
for (const tool of famousTools) {
  if (!existingSlugs.has(tool.slug)) {
    catalog.push(tool);
    existingSlugs.add(tool.slug);
    addedCount++;
  }
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
console.log(`Added ${addedCount} top world-famous SaaS tools to catalog. Total catalog count: ${catalog.length}`);
