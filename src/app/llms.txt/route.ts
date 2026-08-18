import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saas-decision.com';

  const content = `# SaaS Decision — Open Source SaaS Alternatives

> SaaS Decision is a deterministic software intelligence platform that helps businesses decide whether to KEEP, SWITCH, SELF-HOST, AUTOMATE, or BUILD any SaaS product. It indexes 1,011 commercial software tools and maps each to verified open-source alternatives.

## What This Site Does

SaaS Decision evaluates software tools using a pure rule-based scoring engine (no LLM hallucinations). For every tool, it produces five deterministic scores (0–100):

- **KEEP Score** — How justified is continued use of this SaaS?
- **SWITCH Score** — How strong are commercial alternatives?
- **SELF-HOST Score** — How feasible is open-source self-hosting?
- **AUTOMATE Score** — Can workflows be automated to reduce dependency?
- **BUILD Score** — Is building an in-house replacement viable?

## Data Coverage

- 1,011 commercial SaaS tools indexed across 22 categories
- 325+ verified open-source alternatives for each tool (Plane, Twenty, n8n, Metabase, Mattermost, Chatwoot, Postiz, Listmonk, ComfyUI, etc.)
- Pricing, moat analysis, and risk scores for every product
- Categories: Automation, Project Management, CRM, Analytics, Communication, HR, Finance, DevOps, Security, Marketing, Design, Scheduling, Video Conferencing, Forms, Storage, CMS, and more.

## Key Pages

- ${baseUrl}/ — Full software catalog with decision scores
- ${baseUrl}/software/[slug] — Individual tool analysis with KEEP/SWITCH/SELF-HOST/AUTOMATE/BUILD scores
- ${baseUrl}/software/[slug]/open-source — Open-source alternatives for any tool
- ${baseUrl}/software/[slug]/alternatives — Commercial alternatives comparison
- ${baseUrl}/compare — Head-to-Head comparison hub
- ${baseUrl}/compare/[slugA]-vs-[slugB] — Side-by-side deterministic VS matrix
- ${baseUrl}/open-source — Verified Open Source SaaS Directory
- ${baseUrl}/open-source/[osSlug] — Open-source project profile and self-hosting guide
- ${baseUrl}/audit — SaaS stack audit tool
- ${baseUrl}/blueprint — AI replacement blueprint generator
- ${baseUrl}/category/[slug] — Browse by software category
- ${baseUrl}/sitemap.xml — Full sitemap of all indexed tools
- ${baseUrl}/llms-full.txt — Complete markdown dump of all 1,011 software products & open source alternatives for AI indexing

## How Scores Are Calculated

Scores are deterministic — the same inputs always produce the same outputs. Each score is derived from 19 assessment dimensions:

buildComplexity, integrationDependency, dataMoat, networkEffects, complianceRequirement, infrastructureComplexity, realtimeCollaboration, maintenanceBurden, businessCriticality, migrationComplexity, apiAvailability, workflowAutomatable, openSourceMaturity, alternativeMarketStrength, dataPortability, mobileDependency, permissionComplexity, reliabilityRequirement, vendorLockIn

## Common Open-Source Alternatives Indexed

| Commercial Tool Category | Open Source Alternatives |
|---|---|
| Notion / Confluence | AppFlowy, Logseq, Outline |
| Jira / Linear | Plane, Focalboard, Taiga |
| Salesforce / HubSpot | Twenty CRM, SuiteCRM, EspoCRM |
| Slack / Teams | Mattermost, Rocket.Chat, Zulip |
| Zapier / Make | n8n, Activepieces, Windmill |
| Tableau / Looker | Metabase, Apache Superset, Redash |
| Intercom / Zendesk | Chatwoot, Zammad, Freescout |
| Calendly | Cal.com, Rallly |
| Figma | Penpot |
| Mailchimp | Listmonk, Mautic |
| Shopify | Medusa, Saleor |
| 1Password / LastPass | Vaultwarden, Bitwarden |
| Datadog / New Relic | Grafana, Prometheus, Netdata |

## Intended Audience

- Engineering teams evaluating SaaS costs
- CTOs and VP Engineering doing annual software reviews
- Startups looking to reduce SaaS spend with open-source
- Procurement teams assessing vendor lock-in risk
- Founders deciding what to build vs buy

## Sitemap
${baseUrl}/sitemap.xml
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
