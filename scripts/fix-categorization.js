const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '../public/catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

// High quality category-specific open source alternatives map
const OSS_MAP = {
  'forms': [
    { name: 'Formbricks', githubUrl: 'https://github.com/formbricks/formbricks', description: 'Open-source experience management and survey software.', stars: '8.5k★' },
    { name: 'OhMyForm', githubUrl: 'https://github.com/ohmyform/ohmyform', description: 'Open-source form builder alternative to Typeform & Google Forms.', stars: '3.2k★' },
    { name: 'TellForm', githubUrl: 'https://github.com/tellform/tellform', description: 'Open-source form builder for creating responsive web forms.', stars: '2.5k★' }
  ],
  'marketing-email': [
    { name: 'Listmonk', githubUrl: 'https://github.com/knadh/listmonk', description: 'High-performance self-hosted newsletter and mailing list manager.', stars: '15k★' },
    { name: 'Mautic', githubUrl: 'https://github.com/mautic/mautic', description: 'Open-source marketing automation platform.', stars: '8k★' }
  ],
  'seo-content': [
    { name: 'Plausible Analytics', githubUrl: 'https://github.com/plausible/analytics', description: 'Lightweight and open-source website analytics.', stars: '21k★' },
    { name: 'Ghost', githubUrl: 'https://github.com/TryGhost/Ghost', description: 'Open-source headless CMS and publishing platform.', stars: '45k★' }
  ],
  'video-conferencing': [
    { name: 'Jitsi Meet', githubUrl: 'https://github.com/jitsi/jitsi-meet', description: 'Open-source video conferencing platform.', stars: '23k★' },
    { name: 'LiveKit', githubUrl: 'https://github.com/livekit/livekit', description: 'Open-source WebRTC infrastructure.', stars: '11k★' }
  ],
  'education-lms': [
    { name: 'Moodle', githubUrl: 'https://github.com/moodle/moodle', description: 'Open-source learning management platform.', stars: '3.5k★' },
    { name: 'Open edX', githubUrl: 'https://github.com/openedx/edx-platform', description: 'Open-source online learning platform.', stars: '4k★' }
  ],
  'automation': [
    { name: 'n8n', githubUrl: 'https://github.com/n8n-io/n8n', description: 'Fair-code workflow automation platform.', stars: '52k★' },
    { name: 'Activepieces', githubUrl: 'https://github.com/activepieces/activepieces', description: 'Open-source no-code workflow automation.', stars: '11k★' }
  ],
  'crm-sales': [
    { name: 'Twenty', githubUrl: 'https://github.com/twentyhq/twenty', description: 'Modern open-source CRM alternative to Salesforce.', stars: '27k★' },
    { name: 'SuiteCRM', githubUrl: 'https://github.com/salesagility/SuiteCRM', description: 'Open-source enterprise CRM application.', stars: '4k★' }
  ],
  'analytics': [
    { name: 'Metabase', githubUrl: 'https://github.com/metabase/metabase', description: 'Easy open-source business intelligence and analytics.', stars: '39k★' },
    { name: 'Apache Superset', githubUrl: 'https://github.com/apache/superset', description: 'Modern open-source data exploration platform.', stars: '63k★' }
  ],
  'developer-tools': [
    { name: 'Gitea', githubUrl: 'https://github.com/go-gitea/gitea', description: 'Lightweight self-hosted Git service.', stars: '46k★' },
    { name: 'Coolify', githubUrl: 'https://github.com/coollabsio/coolify', description: "Open-source self-hostable Vercel & Heroku alternative.", stars: '37k★' }
  ]
};

function inferCorrectCategory(name, desc) {
  const text = (name + ' ' + desc).toLowerCase();
  if (text.includes('testimonial') || text.includes('feedback') || text.includes('review') || text.includes('form') || text.includes('survey')) {
    return { slug: 'forms', name: 'Forms & Surveys' };
  }
  if (text.includes('mail') || text.includes('email') || text.includes('newsletter') || text.includes('campaign')) {
    return { slug: 'marketing-email', name: 'Marketing & Email' };
  }
  if (text.includes('seo') || text.includes('keyword') || text.includes('content') || text.includes('copywriting')) {
    return { slug: 'seo-content', name: 'SEO & Content' };
  }
  if (text.includes('crm') || text.includes('sales') || text.includes('lead') || text.includes('pipeline')) {
    return { slug: 'crm-sales', name: 'CRM & Sales' };
  }
  if (text.includes('automate') || text.includes('workflow') || text.includes('zap') || text.includes('integration')) {
    return { slug: 'automation', name: 'Automation' };
  }
  if (text.includes('analytics') || text.includes('metric') || text.includes('track') || text.includes('dashboard')) {
    return { slug: 'analytics', name: 'Analytics' };
  }
  if (text.includes('course') || text.includes('lms') || text.includes('learning') || text.includes('tutor') || text.includes('student')) {
    return { slug: 'education-lms', name: 'Education & LMS' };
  }
  return null;
}

let recategorizedCount = 0;
let ossFixedCount = 0;

for (const prod of catalog) {
  // If product is lazily classified under 'productivity-notes' but is actually something else (e.g. Testimonial.to)
  if (prod.categorySlug === 'productivity-notes') {
    const inferred = inferCorrectCategory(prod.name, prod.shortDescription || prod.summary || '');
    if (inferred) {
      prod.categorySlug = inferred.slug;
      prod.categoryName = inferred.name;
      recategorizedCount++;
    }
  }

  // Replace default AppFlowy/Logseq for non-note categories
  if (prod.categorySlug !== 'productivity-notes' && OSS_MAP[prod.categorySlug]) {
    prod.openSourceAlternatives = OSS_MAP[prod.categorySlug];
    ossFixedCount++;
  }
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
console.log(`Successfully recategorized ${recategorizedCount} tools and updated ${ossFixedCount} tools with accurate open-source alternatives!`);
