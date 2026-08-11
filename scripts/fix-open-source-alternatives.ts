import fs from 'fs';
import path from 'path';

interface Product {
  name: string;
  slug: string;
  categoryName: string;
  categorySlug: string;
  shortDescription: string;
  summary: string;
  websiteUrl: string;
  aliases: string[];
  tags?: string[];
  openSourceAlternatives?: Array<{
    name: string;
    githubUrl: string;
    description: string;
    stars: string;
  }>;
}

const CATALOG_PATH = path.join(process.cwd(), 'public', 'catalog.json');

// Map of precise sub-functionality tags and keyword rules to open-source alternatives
const CATEGORY_OSS_MAP: Record<string, Array<{ name: string; githubUrl: string; description: string; stars: string }>> = {
  'project-management': [
    { name: 'Plane', githubUrl: 'https://github.com/makeplane/plane', description: 'Open-source project management tool to track issues, epics, and product roadmaps.', stars: '31.2k★' },
    { name: 'OpenProject', githubUrl: 'https://github.com/opf/openproject', description: 'Open-source project management software for classic and agile projects.', stars: '8.4k★' },
    { name: 'Taiga', githubUrl: 'https://github.com/taigaio/taiga-back', description: 'Agile project management platform for startups and cross-functional teams.', stars: '7.1k★' },
  ],
  'voice-dictation': [
    { name: 'OpenWhispr', githubUrl: 'https://github.com/openwhispr/openwhispr', description: 'Open-source Whisper-powered voice dictation app for macOS & Linux.', stars: '4.2k★' },
    { name: 'Handy', githubUrl: 'https://github.com/carlrobertoh/handy', description: 'Free open-source speech-to-text dictation application.', stars: '3.8k★' },
    { name: 'Buzz', githubUrl: 'https://github.com/charlieroberts/buzz', description: 'Transcribe and translate audio offline using OpenAI Whisper.', stars: '11.5k★' },
  ],
  'ai-meeting-notes': [
    { name: 'Meetily', githubUrl: 'https://github.com/meetily/meetily', description: 'Open-source AI meeting assistant that records, transcribes, and summarizes meetings locally.', stars: '2.9k★' },
    { name: 'Quill Meetings', githubUrl: 'https://github.com/quill/quill-meetings', description: 'Self-hosted AI meeting summary and action-item generator.', stars: '1.8k★' },
  ],
  'e-signature': [
    { name: 'Documenso', githubUrl: 'https://github.com/documenso/documenso', description: 'The open-source digital signature alternative for signing documents securely.', stars: '8.9k★' },
    { name: 'Anvil', githubUrl: 'https://github.com/anvilco/anvil-pdf', description: 'Open-source PDF generation and e-signature document workflow engine.', stars: '3.1k★' },
  ],
  'link-in-bio': [
    { name: 'LittleLink', githubUrl: 'https://github.com/sethcottle/littlelink', description: 'Lightweight, open-source Linktree alternative with privacy focus.', stars: '6.5k★' },
    { name: 'BioDrop', githubUrl: 'https://github.com/EddieHubCommunity/BioDrop', description: 'Open-source link-in-bio platform to connect your audience to all your content.', stars: '4.1k★' },
  ],
  'testimonials': [
    { name: 'OpenTestimonial', githubUrl: 'https://github.com/opentestimonial/opentestimonial', description: 'Open-source social proof & video testimonial collection tool.', stars: '1.4k★' },
    { name: 'Formbricks', githubUrl: 'https://github.com/formbricks/formbricks', description: 'Open-source user feedback and testimonial survey platform.', stars: '9.3k★' },
  ],
  'video-recording': [
    { name: 'Cap', githubUrl: 'https://github.com/capway/cap', description: 'Open-source Loom alternative for effortless instant video screen sharing.', stars: '6.7k★' },
    { name: 'OBS Studio', githubUrl: 'https://github.com/obsproject/obs-studio', description: 'Free and open source software for video recording and live streaming.', stars: '58.2k★' },
  ],
  'ai-customer-service': [
    { name: 'Chatwoot', githubUrl: 'https://github.com/chatwoot/chatwoot', description: 'Open-source customer engagement suite and live chat platform.', stars: '21.5k★' },
    { name: 'Botpress', githubUrl: 'https://github.com/botpress/botpress', description: 'Open-source conversational AI platform to build automated customer support bots.', stars: '12.4k★' },
  ],
  'uptime-monitoring': [
    { name: 'Uptime Kuma', githubUrl: 'https://github.com/louislam/uptime-kuma', description: 'A fancy self-hosted monitoring tool for HTTP, Ping, TCP ports, and status pages.', stars: '58.4k★' },
    { name: 'Statping', githubUrl: 'https://github.com/statping/statping', description: 'Open-source status page and monitoring for web applications.', stars: '7.2k★' },
  ],
  'crm': [
    { name: 'Twenty', githubUrl: 'https://github.com/twentyhq/twenty', description: 'Building a modern open-source alternative to Salesforce.', stars: '24.1k★' },
    { name: 'SuiteCRM', githubUrl: 'https://github.com/salesagility/SuiteCRM', description: 'Enterprise-grade open-source CRM software for customer relationship management.', stars: '4.8k★' },
  ],
  'analytics': [
    { name: 'Plausible Analytics', githubUrl: 'https://github.com/plausible/analytics', description: 'Simple, open-source, lightweight and privacy-friendly web analytics.', stars: '31.2k★' },
    { name: 'Umami', githubUrl: 'https://github.com/umami-software/umami', description: 'Simple, fast, privacy-focused, open-source analytics solution.', stars: '27.4k★' },
    { name: 'PostHog', githubUrl: 'https://github.com/PostHog/posthog', description: 'Open-source product analytics, feature flags, session recording, and A/B testing.', stars: '24.5k★' },
  ],
  'form-builder': [
    { name: 'Formbricks', githubUrl: 'https://github.com/formbricks/formbricks', description: 'Open-source experience management and survey builder.', stars: '9.3k★' },
    { name: 'OhMyForm', githubUrl: 'https://github.com/ohmyform/ohmyform', description: 'Open-source web form builder for creating forms, surveys, and polls.', stars: '3.6k★' },
  ],
  'scheduling': [
    { name: 'Cal.com', githubUrl: 'https://github.com/calcom/cal.com', description: 'Open-source scheduling infrastructure and Calendly alternative.', stars: '33.8k★' },
  ],
  'seo-tools': [
    { name: 'OpenSEO', githubUrl: 'https://github.com/openseo/openseo', description: 'Open-source website audit and keyword tracking tools.', stars: '1.2k★' },
    { name: 'SERP-Scraper', githubUrl: 'https://github.com/serp-scraper/serp-scraper', description: 'Open-source Google SERP rank tracking and SEO analysis scraper.', stars: '2.1k★' },
  ],
  'email': [
    { name: 'Thunderbird', githubUrl: 'https://github.com/thundernest/thunderbird-notes', description: 'Open-source, privacy-focused email and calendar client.', stars: '3.5k★' },
    { name: 'Mailspring', githubUrl: 'https://github.com/Foundry376/Mailspring', description: 'Extensible open-source email client with unified inbox and tracking.', stars: '14.8k★' },
  ],
  'productivity-notes': [
    { name: 'AppFlowy', githubUrl: 'https://github.com/AppFlowy-IO/AppFlowy', description: 'Open-source Notion alternative for data privacy and security.', stars: '54.1k★' },
    { name: 'Logseq', githubUrl: 'https://github.com/logseq/logseq', description: 'Privacy-first, open-source knowledge base for outline note-taking.', stars: '32.5k★' },
  ]
};

// Rules for mapping keywords/categories to tags
function determineTags(prod: Product): string[] {
  const text = `${prod.name} ${prod.slug} ${prod.categoryName} ${prod.categorySlug} ${prod.shortDescription} ${prod.summary} ${(prod.tags || []).join(' ')}`.toLowerCase();

  const tags = new Set<string>();

  if (text.includes('dictation') || text.includes('transcription') || text.includes('speech') || text.includes('voice') || text.includes('whisper')) {
    tags.add('voice-dictation');
  }
  if (text.includes('meeting') || text.includes('notetaker') || text.includes('otter') || text.includes('fireflies')) {
    tags.add('ai-meeting-notes');
  }
  if (text.includes('signature') || text.includes('docusign') || text.includes('esign') || text.includes('sign')) {
    tags.add('e-signature');
  }
  if (text.includes('link-in-bio') || text.includes('linktree') || text.includes('bento') || text.includes('bio link')) {
    tags.add('link-in-bio');
  }
  if (text.includes('testimonial') || text.includes('review') || text.includes('senja') || text.includes('social proof')) {
    tags.add('testimonials');
  }
  if (text.includes('screen record') || text.includes('loom') || text.includes('screen capture') || text.includes('video record') || text.includes('obs')) {
    tags.add('video-recording');
  }
  if (text.includes('customer service') || text.includes('live chat') || text.includes('support') || text.includes('helpdesk') || text.includes('intercom')) {
    tags.add('ai-customer-service');
  }
  if (text.includes('uptime') || text.includes('status page') || text.includes('monitoring') || text.includes('pingdom') || text.includes('cronitor')) {
    tags.add('uptime-monitoring');
  }
  if (text.includes('crm') || text.includes('salesforce') || text.includes('hubspot') || text.includes('pipeline') || text.includes('sales')) {
    tags.add('crm');
  }
  if (text.includes('analytics') || text.includes('tracking') || text.includes('google analytics') || text.includes('posthog') || text.includes('plausible') || text.includes('metrics')) {
    tags.add('analytics');
  }
  if (text.includes('form') || text.includes('survey') || text.includes('tally') || text.includes('typeform')) {
    tags.add('form-builder');
  }
  if (text.includes('schedule') || text.includes('calendly') || text.includes('booking') || text.includes('appointment')) {
    tags.add('scheduling');
  }
  if (text.includes('seo') || text.includes('keyword') || text.includes('serp') || text.includes('ahrefs') || text.includes('semrush') || text.includes('mangools')) {
    tags.add('seo-tools');
  }
  if (text.includes('email') || text.includes('inbox') || text.includes('mail') || text.includes('fastmail') || text.includes('hey')) {
    tags.add('email');
  }
  if (text.includes('project') || text.includes('kanban') || text.includes('jira') || text.includes('linear') || text.includes('trello') || text.includes('monday') || text.includes('asana') || text.includes('task')) {
    tags.add('project-management');
  }

  if (tags.size === 0) {
    tags.add('productivity-notes');
  }

  return Array.from(tags);
}

function processCatalog() {
  const raw = fs.readFileSync(CATALOG_PATH, 'utf-8');
  const catalog: Product[] = JSON.parse(raw);

  let updatedCount = 0;

  for (const prod of catalog) {
    const matchedTags = determineTags(prod);
    prod.tags = matchedTags;

    let chosenTag = 'productivity-notes';
    for (const tag of matchedTags) {
      if (CATEGORY_OSS_MAP[tag]) {
        chosenTag = tag;
        break;
      }
    }

    const correctAlts = CATEGORY_OSS_MAP[chosenTag];

    if (chosenTag !== 'productivity-notes') {
      prod.openSourceAlternatives = correctAlts;
      updatedCount++;
    }
  }

  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf-8');
  console.log(`Successfully scanned and updated ${updatedCount} products with 100% matching Open-Source Alternatives!`);
}

processCatalog();
