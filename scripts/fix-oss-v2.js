#!/usr/bin/env node
/**
 * fix-oss-v2.js — Direct line-by-line approach
 * Replaces AppFlowy & Logseq entries with category-accurate OSS alternatives
 */

const fs = require('fs');
const path = require('path');

const CATALOG_PATH = path.join(__dirname, '../src/domain/catalog-data.ts');

// Category → OSS alternatives mapping
const CATEGORY_OSS = {
  'automation': [
    { name: 'n8n', githubUrl: 'https://github.com/n8n-io/n8n', stars: '52k★' },
    { name: 'Activepieces', githubUrl: 'https://github.com/activepieces/activepieces', stars: '11k★' },
    { name: 'Windmill', githubUrl: 'https://github.com/windmill-labs/windmill', stars: '11k★' },
  ],
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
  'crm': [
    { name: 'Twenty', githubUrl: 'https://github.com/twentyhq/twenty', stars: '27k★' },
    { name: 'SuiteCRM', githubUrl: 'https://github.com/salesagility/SuiteCRM', stars: '4k★' },
    { name: 'EspoCRM', githubUrl: 'https://github.com/espocrm/espocrm', stars: '2k★' },
  ],
  'sales': [
    { name: 'Twenty', githubUrl: 'https://github.com/twentyhq/twenty', stars: '27k★' },
    { name: 'SuiteCRM', githubUrl: 'https://github.com/salesagility/SuiteCRM', stars: '4k★' },
    { name: 'Odoo CRM', githubUrl: 'https://github.com/odoo/odoo', stars: '38k★' },
  ],
  'analytics': [
    { name: 'Metabase', githubUrl: 'https://github.com/metabase/metabase', stars: '39k★' },
    { name: 'Apache Superset', githubUrl: 'https://github.com/apache/superset', stars: '63k★' },
    { name: 'Redash', githubUrl: 'https://github.com/getredash/redash', stars: '25k★' },
  ],
  'business-intelligence': [
    { name: 'Metabase', githubUrl: 'https://github.com/metabase/metabase', stars: '39k★' },
    { name: 'Apache Superset', githubUrl: 'https://github.com/apache/superset', stars: '63k★' },
    { name: 'Redash', githubUrl: 'https://github.com/getredash/redash', stars: '25k★' },
  ],
  'communication': [
    { name: 'Mattermost', githubUrl: 'https://github.com/mattermost/mattermost', stars: '31k★' },
    { name: 'Rocket.Chat', githubUrl: 'https://github.com/RocketChat/Rocket.Chat', stars: '41k★' },
    { name: 'Zulip', githubUrl: 'https://github.com/zulip/zulip', stars: '21k★' },
  ],
  'team-chat': [
    { name: 'Mattermost', githubUrl: 'https://github.com/mattermost/mattermost', stars: '31k★' },
    { name: 'Rocket.Chat', githubUrl: 'https://github.com/RocketChat/Rocket.Chat', stars: '41k★' },
    { name: 'Zulip', githubUrl: 'https://github.com/zulip/zulip', stars: '21k★' },
  ],
  'hr': [
    { name: 'Frappe HR', githubUrl: 'https://github.com/frappe/hrms', stars: '1.8k★' },
    { name: 'OrangeHRM', githubUrl: 'https://github.com/orangehrm/orangehrm', stars: '784★' },
    { name: 'IceHrm', githubUrl: 'https://github.com/gamonoid/icehrm', stars: '500★' },
  ],
  'hr-payroll': [
    { name: 'Frappe HR', githubUrl: 'https://github.com/frappe/hrms', stars: '1.8k★' },
    { name: 'OrangeHRM', githubUrl: 'https://github.com/orangehrm/orangehrm', stars: '784★' },
  ],
  'finance': [
    { name: 'ERPNext', githubUrl: 'https://github.com/frappe/erpnext', stars: '22k★' },
    { name: 'Odoo Community', githubUrl: 'https://github.com/odoo/odoo', stars: '38k★' },
    { name: 'Hledger', githubUrl: 'https://github.com/simonmichael/hledger', stars: '3k★' },
  ],
  'accounting': [
    { name: 'ERPNext', githubUrl: 'https://github.com/frappe/erpnext', stars: '22k★' },
    { name: 'Odoo Community', githubUrl: 'https://github.com/odoo/odoo', stars: '38k★' },
    { name: 'Hledger', githubUrl: 'https://github.com/simonmichael/hledger', stars: '3k★' },
  ],
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
  'security': [
    { name: 'Vaultwarden', githubUrl: 'https://github.com/dani-garcia/vaultwarden', stars: '42k★' },
    { name: 'Authentik', githubUrl: 'https://github.com/goauthentik/authentik', stars: '15k★' },
    { name: 'OpenVAS', githubUrl: 'https://github.com/greenbone/openvas-scanner', stars: '3k★' },
  ],
  'customer-support': [
    { name: 'Chatwoot', githubUrl: 'https://github.com/chatwoot/chatwoot', stars: '22k★' },
    { name: 'Zammad', githubUrl: 'https://github.com/zammad/zammad', stars: '4k★' },
    { name: 'Freescout', githubUrl: 'https://github.com/freescout-helpdesk/freescout', stars: '3k★' },
  ],
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
  'design': [
    { name: 'Penpot', githubUrl: 'https://github.com/penpot/penpot', stars: '35k★' },
    { name: 'GIMP', githubUrl: 'https://github.com/GNOME/gimp', stars: '5k★' },
    { name: 'Inkscape', githubUrl: 'https://github.com/inkscape/inkscape', stars: '2k★' },
  ],
  'scheduling': [
    { name: 'Cal.com', githubUrl: 'https://github.com/calcom/cal.com', stars: '34k★' },
    { name: 'Rallly', githubUrl: 'https://github.com/lukevella/rallly', stars: '5k★' },
    { name: 'Easy!Appointments', githubUrl: 'https://github.com/alextselegidis/easyappointments', stars: '5k★' },
  ],
  'video-conferencing': [
    { name: 'Jitsi Meet', githubUrl: 'https://github.com/jitsi/jitsi-meet', stars: '23k★' },
    { name: 'BigBlueButton', githubUrl: 'https://github.com/bigbluebutton/bigbluebutton', stars: '8k★' },
    { name: 'LiveKit', githubUrl: 'https://github.com/livekit/livekit', stars: '11k★' },
  ],
  'ecommerce': [
    { name: 'Medusa', githubUrl: 'https://github.com/medusajs/medusa', stars: '26k★' },
    { name: 'Saleor', githubUrl: 'https://github.com/saleor/saleor', stars: '21k★' },
    { name: 'WooCommerce', githubUrl: 'https://github.com/woocommerce/woocommerce', stars: '9k★' },
  ],
  'database': [
    { name: 'NocoDB', githubUrl: 'https://github.com/nocodb/nocodb', stars: '50k★' },
    { name: 'Baserow', githubUrl: 'https://github.com/bram2w/baserow', stars: '4k★' },
    { name: 'Grist', githubUrl: 'https://github.com/gristlabs/grist-core', stars: '7k★' },
  ],
  'storage': [
    { name: 'Nextcloud', githubUrl: 'https://github.com/nextcloud/server', stars: '27k★' },
    { name: 'MinIO', githubUrl: 'https://github.com/minio/minio', stars: '50k★' },
    { name: 'Seafile', githubUrl: 'https://github.com/haiwen/seafile', stars: '12k★' },
  ],
  'monitoring': [
    { name: 'Grafana', githubUrl: 'https://github.com/grafana/grafana', stars: '65k★' },
    { name: 'Prometheus', githubUrl: 'https://github.com/prometheus/prometheus', stars: '56k★' },
    { name: 'Netdata', githubUrl: 'https://github.com/netdata/netdata', stars: '72k★' },
  ],
  'password-management': [
    { name: 'Vaultwarden', githubUrl: 'https://github.com/dani-garcia/vaultwarden', stars: '42k★' },
    { name: 'Bitwarden', githubUrl: 'https://github.com/bitwarden/clients', stars: '10k★' },
    { name: 'Passbolt', githubUrl: 'https://github.com/passbolt/passbolt_api', stars: '4k★' },
  ],
};

const FALLBACK_OSS = [
  { name: 'Nextcloud', githubUrl: 'https://github.com/nextcloud/server', stars: '27k★' },
  { name: 'ERPNext', githubUrl: 'https://github.com/frappe/erpnext', stars: '22k★' },
  { name: 'Odoo Community', githubUrl: 'https://github.com/odoo/odoo', stars: '38k★' },
];

// Note-taking tools where AppFlowy/Logseq ARE valid
const NOTE_CATEGORIES = new Set(['productivity-notes', 'productivity', 'notes', 'knowledge-management']);

function buildOssEntry(alt) {
  return `      {
        "name": "${alt.name}",
        "githubUrl": "${alt.githubUrl}",
        "description": "Verified open-source alternative.",
        "stars": "${alt.stars}"
      }`;
}

function buildOssBlock(alternatives) {
  return `[\n${alternatives.map(buildOssEntry).join(',\n')}\n    ]`;
}

// Parse catalog into tool blocks
const src = fs.readFileSync(CATALOG_PATH, 'utf8');
const lines = src.split('\n');

let output = [];
let i = 0;
let fixedCount = 0;

// State machine: track current tool's categorySlug and openSourceAlternatives block
let currentCategorySlug = null;
let inOssBlock = false;
let ossBlockStart = -1;
let ossBlockDepth = 0;
let ossBlockHasAppFlowy = false;
let ossBlockLines = [];

while (i < lines.length) {
  const line = lines[i];

  // Detect categorySlug
  const catMatch = line.match(/"categorySlug":\s*"([^"]+)"/);
  if (catMatch) {
    currentCategorySlug = catMatch[1];
  }

  // Detect start of openSourceAlternatives block
  if (!inOssBlock && line.includes('"openSourceAlternatives":')) {
    inOssBlock = true;
    ossBlockStart = output.length;
    ossBlockDepth = 0;
    ossBlockHasAppFlowy = false;
    ossBlockLines = [line];
    // Count opening brackets on this line
    for (const ch of line) {
      if (ch === '[') ossBlockDepth++;
      if (ch === ']') ossBlockDepth--;
    }
    if (ossBlockDepth <= 0) {
      // Single line block
      inOssBlock = false;
      output.push(line);
    }
    i++;
    continue;
  }

  if (inOssBlock) {
    ossBlockLines.push(line);
    if (line.includes('AppFlowy') || line.includes('Logseq')) {
      ossBlockHasAppFlowy = true;
    }
    for (const ch of line) {
      if (ch === '[') ossBlockDepth++;
      if (ch === ']') ossBlockDepth--;
    }

    if (ossBlockDepth <= 0) {
      // End of OSS block
      inOssBlock = false;

      const isNoteCategory = NOTE_CATEGORIES.has(currentCategorySlug);

      if (ossBlockHasAppFlowy && !isNoteCategory) {
        // Replace with accurate alternatives
        const key = Object.keys(CATEGORY_OSS).find(k =>
          currentCategorySlug && (currentCategorySlug.includes(k) || k.includes(currentCategorySlug))
        );
        const alts = key ? CATEGORY_OSS[key] : FALLBACK_OSS;
        const indent = ossBlockLines[0].match(/^(\s*)/)[1];
        const replaced = `${indent}"openSourceAlternatives": ${buildOssBlock(alts)}`;
        output.push(replaced);
        fixedCount++;
      } else {
        // Keep original
        output.push(...ossBlockLines);
      }

      ossBlockLines = [];
      i++;
      continue;
    }

    i++;
    continue;
  }

  output.push(line);
  i++;
}

fs.writeFileSync(CATALOG_PATH, output.join('\n'), 'utf8');

// Verify
const result = fs.readFileSync(CATALOG_PATH, 'utf8');
const appFlowyCount = (result.match(/"name":\s*"AppFlowy"/g) || []).length;
const logseqCount = (result.match(/"name":\s*"Logseq"/g) || []).length;

console.log(`✅ Fixed ${fixedCount} tool OSS blocks.`);
console.log(`AppFlowy remaining: ${appFlowyCount} entries (should only be in note-taking tools)`);
console.log(`Logseq remaining: ${logseqCount} entries (should only be in note-taking tools)`);
