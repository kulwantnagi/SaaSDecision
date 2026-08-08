#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const CATALOG_PATH = path.join(__dirname, '../src/domain/catalog-data.ts');

const NOTE_CATS = new Set(['productivity-notes','productivity','notes','knowledge-management']);

const CATEGORY_OSS = {
  'automation': [{name:'n8n',githubUrl:'https://github.com/n8n-io/n8n',stars:'52k★'},{name:'Activepieces',githubUrl:'https://github.com/activepieces/activepieces',stars:'11k★'},{name:'Windmill',githubUrl:'https://github.com/windmill-labs/windmill',stars:'11k★'}],
  'project-management': [{name:'Plane',githubUrl:'https://github.com/makeplane/plane',stars:'32k★'},{name:'Taiga',githubUrl:'https://github.com/taigaio/taiga-back',stars:'8k★'},{name:'Focalboard',githubUrl:'https://github.com/mattermost/focalboard',stars:'21k★'}],
  'task-management': [{name:'Plane',githubUrl:'https://github.com/makeplane/plane',stars:'32k★'},{name:'Vikunja',githubUrl:'https://github.com/go-vikunja/vikunja',stars:'5k★'},{name:'Focalboard',githubUrl:'https://github.com/mattermost/focalboard',stars:'21k★'}],
  'crm': [{name:'Twenty',githubUrl:'https://github.com/twentyhq/twenty',stars:'27k★'},{name:'SuiteCRM',githubUrl:'https://github.com/salesagility/SuiteCRM',stars:'4k★'},{name:'EspoCRM',githubUrl:'https://github.com/espocrm/espocrm',stars:'2k★'}],
  'sales': [{name:'Twenty',githubUrl:'https://github.com/twentyhq/twenty',stars:'27k★'},{name:'SuiteCRM',githubUrl:'https://github.com/salesagility/SuiteCRM',stars:'4k★'},{name:'Odoo CRM',githubUrl:'https://github.com/odoo/odoo',stars:'38k★'}],
  'analytics': [{name:'Metabase',githubUrl:'https://github.com/metabase/metabase',stars:'39k★'},{name:'Apache Superset',githubUrl:'https://github.com/apache/superset',stars:'63k★'},{name:'Redash',githubUrl:'https://github.com/getredash/redash',stars:'25k★'}],
  'business-intelligence': [{name:'Metabase',githubUrl:'https://github.com/metabase/metabase',stars:'39k★'},{name:'Apache Superset',githubUrl:'https://github.com/apache/superset',stars:'63k★'},{name:'Redash',githubUrl:'https://github.com/getredash/redash',stars:'25k★'}],
  'communication': [{name:'Mattermost',githubUrl:'https://github.com/mattermost/mattermost',stars:'31k★'},{name:'Rocket.Chat',githubUrl:'https://github.com/RocketChat/Rocket.Chat',stars:'41k★'},{name:'Zulip',githubUrl:'https://github.com/zulip/zulip',stars:'21k★'}],
  'team-chat': [{name:'Mattermost',githubUrl:'https://github.com/mattermost/mattermost',stars:'31k★'},{name:'Rocket.Chat',githubUrl:'https://github.com/RocketChat/Rocket.Chat',stars:'41k★'},{name:'Zulip',githubUrl:'https://github.com/zulip/zulip',stars:'21k★'}],
  'hr': [{name:'Frappe HR',githubUrl:'https://github.com/frappe/hrms',stars:'1.8k★'},{name:'OrangeHRM',githubUrl:'https://github.com/orangehrm/orangehrm',stars:'784★'},{name:'IceHrm',githubUrl:'https://github.com/gamonoid/icehrm',stars:'500★'}],
  'hr-payroll': [{name:'Frappe HR',githubUrl:'https://github.com/frappe/hrms',stars:'1.8k★'},{name:'OrangeHRM',githubUrl:'https://github.com/orangehrm/orangehrm',stars:'784★'}],
  'finance': [{name:'ERPNext',githubUrl:'https://github.com/frappe/erpnext',stars:'22k★'},{name:'Odoo Community',githubUrl:'https://github.com/odoo/odoo',stars:'38k★'},{name:'Hledger',githubUrl:'https://github.com/simonmichael/hledger',stars:'3k★'}],
  'accounting': [{name:'ERPNext',githubUrl:'https://github.com/frappe/erpnext',stars:'22k★'},{name:'Odoo Community',githubUrl:'https://github.com/odoo/odoo',stars:'38k★'},{name:'Hledger',githubUrl:'https://github.com/simonmichael/hledger',stars:'3k★'}],
  'devops': [{name:'Gitea',githubUrl:'https://github.com/go-gitea/gitea',stars:'46k★'},{name:'Woodpecker CI',githubUrl:'https://github.com/woodpecker-ci/woodpecker',stars:'4k★'},{name:'Coolify',githubUrl:'https://github.com/coollabsio/coolify',stars:'37k★'}],
  'infrastructure': [{name:'Coolify',githubUrl:'https://github.com/coollabsio/coolify',stars:'37k★'},{name:'Portainer',githubUrl:'https://github.com/portainer/portainer',stars:'31k★'},{name:'Netdata',githubUrl:'https://github.com/netdata/netdata',stars:'72k★'}],
  'security': [{name:'Vaultwarden',githubUrl:'https://github.com/dani-garcia/vaultwarden',stars:'42k★'},{name:'Authentik',githubUrl:'https://github.com/goauthentik/authentik',stars:'15k★'},{name:'OpenVAS',githubUrl:'https://github.com/greenbone/openvas-scanner',stars:'3k★'}],
  'customer-support': [{name:'Chatwoot',githubUrl:'https://github.com/chatwoot/chatwoot',stars:'22k★'},{name:'Zammad',githubUrl:'https://github.com/zammad/zammad',stars:'4k★'},{name:'Freescout',githubUrl:'https://github.com/freescout-helpdesk/freescout',stars:'3k★'}],
  'marketing': [{name:'Mautic',githubUrl:'https://github.com/mautic/mautic',stars:'8k★'},{name:'Listmonk',githubUrl:'https://github.com/knadh/listmonk',stars:'15k★'},{name:'Plausible',githubUrl:'https://github.com/plausible/analytics',stars:'21k★'}],
  'email-marketing': [{name:'Listmonk',githubUrl:'https://github.com/knadh/listmonk',stars:'15k★'},{name:'Mautic',githubUrl:'https://github.com/mautic/mautic',stars:'8k★'},{name:'Postal',githubUrl:'https://github.com/postalserver/postal',stars:'14k★'}],
  'design': [{name:'Penpot',githubUrl:'https://github.com/penpot/penpot',stars:'35k★'},{name:'GIMP',githubUrl:'https://github.com/GNOME/gimp',stars:'5k★'},{name:'Inkscape',githubUrl:'https://github.com/inkscape/inkscape',stars:'2k★'}],
  'scheduling': [{name:'Cal.com',githubUrl:'https://github.com/calcom/cal.com',stars:'34k★'},{name:'Rallly',githubUrl:'https://github.com/lukevella/rallly',stars:'5k★'},{name:'Easy!Appointments',githubUrl:'https://github.com/alextselegidis/easyappointments',stars:'5k★'}],
  'video-conferencing': [{name:'Jitsi Meet',githubUrl:'https://github.com/jitsi/jitsi-meet',stars:'23k★'},{name:'BigBlueButton',githubUrl:'https://github.com/bigbluebutton/bigbluebutton',stars:'8k★'},{name:'LiveKit',githubUrl:'https://github.com/livekit/livekit',stars:'11k★'}],
  'ecommerce': [{name:'Medusa',githubUrl:'https://github.com/medusajs/medusa',stars:'26k★'},{name:'Saleor',githubUrl:'https://github.com/saleor/saleor',stars:'21k★'},{name:'WooCommerce',githubUrl:'https://github.com/woocommerce/woocommerce',stars:'9k★'}],
  'database': [{name:'NocoDB',githubUrl:'https://github.com/nocodb/nocodb',stars:'50k★'},{name:'Baserow',githubUrl:'https://github.com/bram2w/baserow',stars:'4k★'},{name:'Grist',githubUrl:'https://github.com/gristlabs/grist-core',stars:'7k★'}],
  'storage': [{name:'Nextcloud',githubUrl:'https://github.com/nextcloud/server',stars:'27k★'},{name:'MinIO',githubUrl:'https://github.com/minio/minio',stars:'50k★'},{name:'Seafile',githubUrl:'https://github.com/haiwen/seafile',stars:'12k★'}],
  'monitoring': [{name:'Grafana',githubUrl:'https://github.com/grafana/grafana',stars:'65k★'},{name:'Prometheus',githubUrl:'https://github.com/prometheus/prometheus',stars:'56k★'},{name:'Netdata',githubUrl:'https://github.com/netdata/netdata',stars:'72k★'}],
  'password-management': [{name:'Vaultwarden',githubUrl:'https://github.com/dani-garcia/vaultwarden',stars:'42k★'},{name:'Bitwarden',githubUrl:'https://github.com/bitwarden/clients',stars:'10k★'},{name:'Passbolt',githubUrl:'https://github.com/passbolt/passbolt_api',stars:'4k★'}],
};
const FALLBACK = [{name:'Nextcloud',githubUrl:'https://github.com/nextcloud/server',stars:'27k★'},{name:'ERPNext',githubUrl:'https://github.com/frappe/erpnext',stars:'22k★'},{name:'Odoo Community',githubUrl:'https://github.com/odoo/odoo',stars:'38k★'}];

function buildBlock(alts) {
  const entries = alts.map(a =>
    `      {\n        "name": "${a.name}",\n        "githubUrl": "${a.githubUrl}",\n        "description": "Verified open-source alternative.",\n        "stars": "${a.stars}"\n      }`
  );
  return `[\n${entries.join(',\n')}\n    ]`;
}

function findArrEnd(src, arrStart) {
  let depth = 0;
  for (let i = arrStart; i < src.length; i++) {
    const ch = src[i];
    if (ch === '[' || ch === '{') depth++;
    else if (ch === ']' || ch === '}') {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  return -1;
}

let src = fs.readFileSync(CATALOG_PATH, 'utf8');
const OSS_KEY = '"openSourceAlternatives":';
let fixedCount = 0;
let searchFrom = 0;

while (true) {
  const ossIdx = src.indexOf(OSS_KEY, searchFrom);
  if (ossIdx === -1) break;

  // Find the array start
  const arrStart = src.indexOf('[', ossIdx);
  if (arrStart === -1) break;

  const arrEnd = findArrEnd(src, arrStart);
  if (arrEnd === -1) break;

  const ossBlock = src.slice(arrStart, arrEnd);

  if (ossBlock.includes('"AppFlowy"') || ossBlock.includes('"Logseq"')) {
    // Find nearest categorySlug BEFORE this ossIdx (search backwards in the preceding ~500 chars)
    const lookback = src.slice(Math.max(0, ossIdx - 3500), ossIdx);
    const lastCatMatch = [...lookback.matchAll(/"categorySlug":\s*"([^"]+)"/g)].pop();

    if (lastCatMatch) {
      const categorySlug = lastCatMatch[1];
      if (!NOTE_CATS.has(categorySlug)) {
        const key = Object.keys(CATEGORY_OSS).find(k =>
          categorySlug === k || categorySlug.includes(k) || k.includes(categorySlug)
        );
        const alts = key ? CATEGORY_OSS[key] : FALLBACK;
        const newBlock = buildBlock(alts);
        src = src.slice(0, arrStart) + newBlock + src.slice(arrEnd);
        fixedCount++;
        // Adjust search position past the newly inserted block
        searchFrom = arrStart + newBlock.length;
        continue;
      }
    }
  }

  searchFrom = arrEnd;
}

fs.writeFileSync(CATALOG_PATH, src, 'utf8');

const final = fs.readFileSync(CATALOG_PATH, 'utf8');
const af = (final.match(/"name": "AppFlowy"/g) || []).length;
const ls = (final.match(/"name": "Logseq"/g) || []).length;
console.log(`Fixed: ${fixedCount} tool OSS blocks`);
console.log(`AppFlowy remaining: ${af}`);
console.log(`Logseq remaining: ${ls}`);
