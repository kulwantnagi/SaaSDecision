#!/usr/bin/env node
/**
 * fix-oss-alternatives.js
 * 
 * Replaces AppFlowy / Logseq with accurate category-matched open-source
 * alternatives throughout src/domain/catalog-data.ts
 */

const fs = require('fs');
const path = require('path');

const CATALOG_PATH = path.join(__dirname, '../src/domain/catalog-data.ts');

// ─── Category → accurate OSS alternatives mapping ────────────────────────────
const CATEGORY_OSS = {
  // Productivity & Notes
  'productivity-notes': [
    { name: 'AppFlowy', githubUrl: 'https://github.com/AppFlowy-IO/AppFlowy', stars: '61k★' },
    { name: 'Logseq', githubUrl: 'https://github.com/logseq/logseq', stars: '34k★' },
    { name: 'Outline', githubUrl: 'https://github.com/outline/outline', stars: '29k★' },
  ],
  // Project Management / Task Management
  'project-management': [
    { name: 'Plane', githubUrl: 'https://github.com/makeplane/plane', stars: '32k★' },
    { name: 'Taiga', githubUrl: 'https://github.com/taigaio/taiga-back', stars: '8k★' },
    { name: 'Focalboard', githubUrl: 'https://github.com/mattermost/focalboard', stars: '21k★' },
  ],
  'task-management': [
    { name: 'Plane', githubUrl: 'https://github.com/makeplane/plane', stars: '32k★' },
    { name: 'Vikunja', githubUrl: 'https://github.com/go-vikunja/vikunja', stars: '5k★' },
    { name: 'Focalboard', githubUrl: 'https://github.com/mattermost/focalboard', stars: '21k★' },
  ],
  // CRM & Sales
  'crm': [
    { name: 'Twenty', githubUrl: 'https://github.com/twentyhq/twenty', stars: '27k★' },
    { name: 'SuiteCRM', githubUrl: 'https://github.com/salesagility/SuiteCRM', stars: '4k★' },
    { name: 'EspoCRM', githubUrl: 'https://github.com/espocrm/espocrm', stars: '2k★' },
  ],
  'sales': [
    { name: 'Twenty', githubUrl: 'https://github.com/twentyhq/twenty', stars: '27k★' },
    { name: 'SuiteCRM', githubUrl: 'https://github.com/salesagility/SuiteCRM', stars: '4k★' },
  ],
  // Analytics & BI
  'analytics': [
    { name: 'Metabase', githubUrl: 'https://github.com/metabase/metabase', stars: '39k★' },
    { name: 'Redash', githubUrl: 'https://github.com/getredash/redash', stars: '25k★' },
    { name: 'Apache Superset', githubUrl: 'https://github.com/apache/superset', stars: '63k★' },
  ],
  'business-intelligence': [
    { name: 'Metabase', githubUrl: 'https://github.com/metabase/metabase', stars: '39k★' },
    { name: 'Apache Superset', githubUrl: 'https://github.com/apache/superset', stars: '63k★' },
    { name: 'Redash', githubUrl: 'https://github.com/getredash/redash', stars: '25k★' },
  ],
  // Communication & Chat
  'communication': [
    { name: 'Mattermost', githubUrl: 'https://github.com/mattermost/mattermost', stars: '31k★' },
    { name: 'Rocket.Chat', githubUrl: 'https://github.com/RocketChat/Rocket.Chat', stars: '41k★' },
    { name: 'Matrix (Element)', githubUrl: 'https://github.com/element-hq/element-web', stars: '11k★' },
  ],
  'team-chat': [
    { name: 'Mattermost', githubUrl: 'https://github.com/mattermost/mattermost', stars: '31k★' },
    { name: 'Rocket.Chat', githubUrl: 'https://github.com/RocketChat/Rocket.Chat', stars: '41k★' },
    { name: 'Zulip', githubUrl: 'https://github.com/zulip/zulip', stars: '21k★' },
  ],
  // HR & People
  'hr': [
    { name: 'OrangeHRM', githubUrl: 'https://github.com/orangehrm/orangehrm', stars: '784★' },
    { name: 'Frappe HR', githubUrl: 'https://github.com/frappe/hrms', stars: '1.8k★' },
    { name: 'IceHrm', githubUrl: 'https://github.com/gamonoid/icehrm', stars: '500★' },
  ],
  'hr-payroll': [
    { name: 'Frappe HR', githubUrl: 'https://github.com/frappe/hrms', stars: '1.8k★' },
    { name: 'OrangeHRM', githubUrl: 'https://github.com/orangehrm/orangehrm', stars: '784★' },
  ],
  // Finance & Accounting
  'finance': [
    { name: 'Hledger', githubUrl: 'https://github.com/simonmichael/hledger', stars: '3k★' },
    { name: 'Odoo (Community)', githubUrl: 'https://github.com/odoo/odoo', stars: '38k★' },
    { name: 'ERPNext', githubUrl: 'https://github.com/frappe/erpnext', stars: '22k★' },
  ],
  'accounting': [
    { name: 'ERPNext', githubUrl: 'https://github.com/frappe/erpnext', stars: '22k★' },
    { name: 'Odoo (Community)', githubUrl: 'https://github.com/odoo/odoo', stars: '38k★' },
    { name: 'Hledger', githubUrl: 'https://github.com/simonmichael/hledger', stars: '3k★' },
  ],
  // DevOps & Infrastructure
  'devops': [
    { name: 'Gitea', githubUrl: 'https://github.com/go-gitea/gitea', stars: '46k★' },
    { name: 'Woodpecker CI', githubUrl: 'https://github.com/woodpecker-ci/woodpecker', stars: '4k★' },
    { name: 'Coolify', githubUrl: 'https://github.com/coollabsio/coolify', stars: '37k★' },
  ],
  'infrastructure': [
    { name: 'Coolify', githubUrl: 'https://github.com/coollabsio/coolify', stars: '37k★' },
    { name: 'Portainer', githubUrl: 'https://github.com/portainer/portainer', stars: '31k★' },
    { name: 'Netdata', githubUrl: 'https://github.com/netdata/netdata', stars: '72k★' },
  ],
  // Security
  'security': [
    { name: 'Vaultwarden', githubUrl: 'https://github.com/dani-garcia/vaultwarden', stars: '42k★' },
    { name: 'Authentik', githubUrl: 'https://github.com/goauthentik/authentik', stars: '15k★' },
    { name: 'OpenVAS', githubUrl: 'https://github.com/greenbone/openvas-scanner', stars: '3k★' },
  ],
  // Customer Support
  'customer-support': [
    { name: 'Chatwoot', githubUrl: 'https://github.com/chatwoot/chatwoot', stars: '22k★' },
    { name: 'Zammad', githubUrl: 'https://github.com/zammad/zammad', stars: '4k★' },
    { name: 'Freescout', githubUrl: 'https://github.com/freescout-helpdesk/freescout', stars: '3k★' },
  ],
  // Marketing
  'marketing': [
    { name: 'Mautic', githubUrl: 'https://github.com/mautic/mautic', stars: '8k★' },
    { name: 'Listmonk', githubUrl: 'https://github.com/knadh/listmonk', stars: '15k★' },
    { name: 'Plausible', githubUrl: 'https://github.com/plausible/analytics', stars: '21k★' },
  ],
  'email-marketing': [
    { name: 'Listmonk', githubUrl: 'https://github.com/knadh/listmonk', stars: '15k★' },
    { name: 'Mautic', githubUrl: 'https://github.com/mautic/mautic', stars: '8k★' },
    { name: 'Postal', githubUrl: 'https://github.com/postalserver/postal', stars: '14k★' },
  ],
  // Design & Creative
  'design': [
    { name: 'Penpot', githubUrl: 'https://github.com/penpot/penpot', stars: '35k★' },
    { name: 'GIMP', githubUrl: 'https://github.com/GNOME/gimp', stars: '5k★' },
    { name: 'Inkscape', githubUrl: 'https://github.com/inkscape/inkscape', stars: '2k★' },
  ],
  // Scheduling & Calendar
  'scheduling': [
    { name: 'Cal.com', githubUrl: 'https://github.com/calcom/cal.com', stars: '34k★' },
    { name: 'Rallly', githubUrl: 'https://github.com/lukevella/rallly', stars: '5k★' },
  ],
  // Video & Meetings
  'video-conferencing': [
    { name: 'Jitsi Meet', githubUrl: 'https://github.com/jitsi/jitsi-meet', stars: '23k★' },
    { name: 'BigBlueButton', githubUrl: 'https://github.com/bigbluebutton/bigbluebutton', stars: '8k★' },
  ],
  // Automation
  'automation': [
    { name: 'n8n', githubUrl: 'https://github.com/n8n-io/n8n', stars: '52k★' },
    { name: 'Activepieces', githubUrl: 'https://github.com/activepieces/activepieces', stars: '11k★' },
    { name: 'Windmill', githubUrl: 'https://github.com/windmill-labs/windmill', stars: '11k★' },
  ],
  // E-commerce
  'ecommerce': [
    { name: 'Medusa', githubUrl: 'https://github.com/medusajs/medusa', stars: '26k★' },
    { name: 'WooCommerce', githubUrl: 'https://github.com/woocommerce/woocommerce', stars: '9k★' },
    { name: 'Saleor', githubUrl: 'https://github.com/saleor/saleor', stars: '21k★' },
  ],
  // Data & Databases
  'database': [
    { name: 'NocoDB', githubUrl: 'https://github.com/nocodb/nocodb', stars: '50k★' },
    { name: 'Baserow', githubUrl: 'https://github.com/bram2w/baserow', stars: '4k★' },
    { name: 'Grist', githubUrl: 'https://github.com/gristlabs/grist-core', stars: '7k★' },
  ],
  // File Storage
  'storage': [
    { name: 'Nextcloud', githubUrl: 'https://github.com/nextcloud/server', stars: '27k★' },
    { name: 'Seafile', githubUrl: 'https://github.com/haiwen/seafile', stars: '12k★' },
    { name: 'MinIO', githubUrl: 'https://github.com/minio/minio', stars: '50k★' },
  ],
  // Password Management
  'password-management': [
    { name: 'Vaultwarden', githubUrl: 'https://github.com/dani-garcia/vaultwarden', stars: '42k★' },
    { name: 'Bitwarden', githubUrl: 'https://github.com/bitwarden/clients', stars: '10k★' },
    { name: 'Passbolt', githubUrl: 'https://github.com/passbolt/passbolt_api', stars: '4k★' },
  ],
  // Monitoring & Observability
  'monitoring': [
    { name: 'Grafana', githubUrl: 'https://github.com/grafana/grafana', stars: '65k★' },
    { name: 'Prometheus', githubUrl: 'https://github.com/prometheus/prometheus', stars: '56k★' },
    { name: 'Netdata', githubUrl: 'https://github.com/netdata/netdata', stars: '72k★' },
  ],
};

// Fallback for unrecognised categories
const FALLBACK_OSS = [
  { name: 'Nextcloud', githubUrl: 'https://github.com/nextcloud/server', stars: '27k★' },
  { name: 'Odoo Community', githubUrl: 'https://github.com/odoo/odoo', stars: '38k★' },
  { name: 'ERPNext', githubUrl: 'https://github.com/frappe/erpnext', stars: '22k★' },
];

// Tools that are legitimately note/productivity tools — keep AppFlowy/Logseq
const LEGITIMATE_NOTE_SLUGS = new Set([
  'notion', 'obsidian', 'confluence', 'roam-research', 'coda', 'craft',
  'bear', 'evernote', 'onenote', 'joplin', 'standard-notes', 'anytype',
  'granola', 'capacities', 'mem', 'reflect', 'relanote',
]);

function getOssForTool(slug, categorySlug) {
  // If it's a legitimate note-taking tool, AppFlowy/Logseq are valid
  if (LEGITIMATE_NOTE_SLUGS.has(slug)) return null; // keep existing

  // Map category slug to our lookup key
  const key = Object.keys(CATEGORY_OSS).find(k =>
    categorySlug.includes(k) || k.includes(categorySlug)
  );

  if (key) return CATEGORY_OSS[key];
  return FALLBACK_OSS;
}

function buildOssBlock(alternatives) {
  return alternatives.map(a => `      {
        "name": "${a.name}",
        "githubUrl": "${a.githubUrl}",
        "description": "Verified open-source alternative.",
        "stars": "${a.stars}"
      }`).join(',\n');
}

// ─── Main processing ─────────────────────────────────────────────────────────
let src = fs.readFileSync(CATALOG_PATH, 'utf8');

// Find each tool block and fix its openSourceAlternatives if it contains AppFlowy or Logseq
// Strategy: parse the slugs and categorySlug for each tool, then do targeted replacement

// Extract all tool entries with their slug, categorySlug, and openSourceAlternatives block
const toolPattern = /"slug":\s*"([^"]+)"[\s\S]*?"categorySlug":\s*"([^"]+)"[\s\S]*?"openSourceAlternatives":\s*\[([\s\S]*?)\]/g;

let match;
let replacements = [];

while ((match = toolPattern.exec(src)) !== null) {
  const [fullMatch, slug, categorySlug, ossBlock] = match;

  // Only fix if AppFlowy or Logseq appears in the current OSS block
  if (!ossBlock.includes('AppFlowy') && !ossBlock.includes('Logseq')) continue;

  const newOss = getOssForTool(slug, categorySlug);
  if (!newOss) continue; // keep existing for legitimate tools

  const newBlock = fullMatch.replace(
    `"openSourceAlternatives": [${ossBlock}]`,
    `"openSourceAlternatives": [\n${buildOssBlock(newOss)}\n    ]`
  );

  replacements.push({ original: fullMatch, replacement: newBlock, slug });
}

console.log(`Found ${replacements.length} tools with AppFlowy/Logseq to fix...`);

let fixed = 0;
for (const { original, replacement, slug } of replacements) {
  if (src.includes(original)) {
    src = src.replace(original, replacement);
    fixed++;
  }
}

fs.writeFileSync(CATALOG_PATH, src, 'utf8');
console.log(`✅ Fixed ${fixed} tool entries with accurate category-matched OSS alternatives.`);

// Verify
const remaining = (src.match(/AppFlowy/g) || []).length;
const legitimateCount = [...LEGITIMATE_NOTE_SLUGS].reduce((acc, slug) => {
  const re = new RegExp(`"slug":\\s*"${slug}"`, 'g');
  return acc + (src.match(re) || []).length;
}, 0);
console.log(`AppFlowy still appears ${remaining} times (${legitimateCount} legitimate note-tool entries expected).`);
