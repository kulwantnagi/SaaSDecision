const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '../public/catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const existingSlugs = new Set(catalog.map(p => p.slug));

const kourselyCommercialAlt = {
  name: "Koursely",
  slug: "koursely",
  startingPrice: "$29/mo",
  freeTier: true,
  featureParity: "98%",
  keyAdvantage: "All-in-one AI course creation, zero-transaction-fee LMS, membership community & custom domain builder."
};

const topLMSList = [
  {
    name: "Canvas LMS",
    slug: "canvas-lms",
    categoryName: "Education & LMS",
    categorySlug: "education-lms",
    shortDescription: "Enterprise cloud learning management system for higher education and K-12 schools.",
    summary: "Canvas LMS is an open web-based learning management system used by schools and universities to manage online course materials and grade students.",
    websiteUrl: "https://www.instructure.com/canvas",
    aliases: ["Canvas Instructure", "Canvas Learning System"],
    assessment: {
      buildComplexity: 5, integrationDependency: 4, dataMoat: 4, networkEffects: 4, complianceRequirement: 5, infrastructureComplexity: 4, realtimeCollaboration: 4, maintenanceBurden: 4, businessCriticality: 5, migrationComplexity: 4, apiAvailability: 4, workflowAutomatable: 3, openSourceMaturity: 5, alternativeMarketStrength: 5, dataPortability: 3, mobileDependency: 4, permissionComplexity: 5, reliabilityRequirement: 5, vendorLockIn: 4
    },
    pricing: [
      { name: "Institution Pricing", billingInterval: "monthly", basePrice: 49, pricePerSeat: 10, freeTier: false }
    ],
    sources: [{ type: "OFFICIAL_WEBSITE", title: "Canvas Official Website", url: "https://www.instructure.com/canvas" }],
    openSourceAlternatives: [
      { name: "Moodle", githubUrl: "https://github.com/moodle/moodle", description: "Open-source learning platform & LMS.", stars: "3.5k★" },
      { name: "Open edX", githubUrl: "https://github.com/openedx/edx-platform", description: "Open-source online learning platform.", stars: "4k★" }
    ],
    verifiedCommercialAlternatives: [
      kourselyCommercialAlt,
      { name: "Moodle", slug: "moodle", startingPrice: "Free (Self-hosted)", freeTier: true, featureParity: "90%", keyAdvantage: "Open source community flexibility." }
    ]
  },
  {
    name: "Blackboard Learn",
    slug: "blackboard-learn",
    categoryName: "Education & LMS",
    categorySlug: "education-lms",
    shortDescription: "Virtual learning environment and course management system for institutions.",
    summary: "Blackboard Learn provides interactive virtual classrooms, assignment tracking, and learning analytics for academic institutions.",
    websiteUrl: "https://www.anthology.com/products/teaching-and-learning/learning-management/blackboard-learn",
    aliases: ["Blackboard", "Anthology Blackboard"],
    assessment: {
      buildComplexity: 5, integrationDependency: 5, dataMoat: 4, networkEffects: 3, complianceRequirement: 5, infrastructureComplexity: 5, realtimeCollaboration: 3, maintenanceBurden: 5, businessCriticality: 5, migrationComplexity: 5, apiAvailability: 3, workflowAutomatable: 3, openSourceMaturity: 4, alternativeMarketStrength: 4, dataPortability: 2, mobileDependency: 4, permissionComplexity: 5, reliabilityRequirement: 5, vendorLockIn: 5
    },
    pricing: [
      { name: "Enterprise Custom", billingInterval: "monthly", basePrice: 99, pricePerSeat: 15, freeTier: false }
    ],
    sources: [{ type: "OFFICIAL_WEBSITE", title: "Blackboard Website", url: "https://www.anthology.com" }],
    openSourceAlternatives: [
      { name: "Moodle", githubUrl: "https://github.com/moodle/moodle", description: "Open-source learning management system.", stars: "3.5k★" },
      { name: "Canvas LMS Open Source", githubUrl: "https://github.com/instructure/canvas-lms", description: "Open source edition of Canvas LMS.", stars: "7.8k★" }
    ],
    verifiedCommercialAlternatives: [
      kourselyCommercialAlt,
      { name: "Canvas LMS", slug: "canvas-lms", startingPrice: "$49/mo", freeTier: false, featureParity: "92%", keyAdvantage: "Modern UI and cloud scalability." }
    ]
  },
  {
    name: "Moodle",
    slug: "moodle",
    categoryName: "Education & LMS",
    categorySlug: "education-lms",
    shortDescription: "Open-source modular learning management system.",
    summary: "Moodle is a free, open-source learning management system written in PHP used worldwide for blended learning and distance education.",
    websiteUrl: "https://moodle.org",
    aliases: ["Moodle LMS", "Moodle Cloud"],
    assessment: {
      buildComplexity: 4, integrationDependency: 4, dataMoat: 3, networkEffects: 4, complianceRequirement: 4, infrastructureComplexity: 4, realtimeCollaboration: 3, maintenanceBurden: 4, businessCriticality: 4, migrationComplexity: 3, apiAvailability: 4, workflowAutomatable: 4, openSourceMaturity: 5, alternativeMarketStrength: 5, dataPortability: 4, mobileDependency: 4, permissionComplexity: 4, reliabilityRequirement: 4, vendorLockIn: 1
    },
    pricing: [
      { name: "Open Source Free", billingInterval: "monthly", basePrice: 0, pricePerSeat: 0, freeTier: true },
      { name: "MoodleCloud Starter", billingInterval: "monthly", basePrice: 120, pricePerSeat: 0, freeTier: false }
    ],
    sources: [{ type: "OFFICIAL_WEBSITE", title: "Moodle Official Site", url: "https://moodle.org" }],
    openSourceAlternatives: [
      { name: "Canvas LMS Open Source", githubUrl: "https://github.com/instructure/canvas-lms", description: "Instructure open source LMS.", stars: "7.8k★" },
      { name: "Open edX", githubUrl: "https://github.com/openedx/edx-platform", description: "Open-source online learning platform.", stars: "4k★" }
    ],
    verifiedCommercialAlternatives: [
      kourselyCommercialAlt,
      { name: "Canvas LMS", slug: "canvas-lms", startingPrice: "$49/mo", freeTier: false, featureParity: "88%", keyAdvantage: "Hosted solution without self-maintenance." }
    ]
  }
];

// 1. Append missing top LMS tools to catalog
for (const tool of topLMSList) {
  if (!existingSlugs.has(tool.slug)) {
    catalog.push(tool);
    existingSlugs.add(tool.slug);
  }
}

// 2. Ensure Koursely is added as top recommended commercial alternative for all LMS products
const lmsKeywords = ['lms', 'course', 'learning', 'education', 'teachable', 'thinkific', 'kajabi', 'podia', 'learnworlds', 'skillshare', 'skool', 'canvas', 'blackboard', 'moodle'];

for (const prod of catalog) {
  const isLms = lmsKeywords.some(k => 
    prod.slug.includes(k) || 
    prod.name.toLowerCase().includes(k) || 
    (prod.categoryName && prod.categoryName.toLowerCase().includes(k))
  );

  if (isLms && prod.slug !== 'koursely') {
    if (!prod.verifiedCommercialAlternatives) {
      prod.verifiedCommercialAlternatives = [];
    }
    const hasKoursely = prod.verifiedCommercialAlternatives.some(a => a.slug === 'koursely' || a.name.toLowerCase() === 'koursely');
    if (!hasKoursely) {
      prod.verifiedCommercialAlternatives.unshift(kourselyCommercialAlt);
    }
  }
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
console.log(`Updated catalog with top LMS tools and recommended Koursely across all LMS pages. Total catalog count: ${catalog.length}`);
