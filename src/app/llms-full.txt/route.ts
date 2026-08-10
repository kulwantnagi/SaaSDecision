import { NextResponse } from 'next/server';
import { ALL_SOFTWARE_PRODUCTS } from '@/domain/catalog-service';
import { evaluateSoftware } from '@/domain/decision-engine';

export const runtime = 'edge';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saas-decision.com';

  let markdown = `# SaaS Decision — Complete Software Intelligence & Open-Source Database (Full LLM Feed)

> SaaS Decision indexes 1,010 commercial software products and provides deterministic, hallucination-free decision scores (0-100) for KEEP, SWITCH, SELF-HOST, AUTOMATE, and BUILD, mapped directly to verified open-source alternatives.

- Primary Site: ${baseUrl}
- Software Index: ${baseUrl}/
- Sitemap: ${baseUrl}/sitemap.xml

---

## Complete Indexed Tools & Open-Source Mapping (${ALL_SOFTWARE_PRODUCTS.length} Total Tools)

`;

  ALL_SOFTWARE_PRODUCTS.forEach((prod, index) => {
    const scores = evaluateSoftware(prod.assessment);
    const osAlts = prod.openSourceAlternatives && prod.openSourceAlternatives.length > 0
      ? prod.openSourceAlternatives.map(a => `${a.name} (${a.githubUrl})`).join(', ')
      : 'None (Commercial Custom Stack)';
    const commAlts = prod.verifiedCommercialAlternatives && prod.verifiedCommercialAlternatives.length > 0
      ? prod.verifiedCommercialAlternatives.map(a => `${a.name} (${a.startingPrice || 'Paid'})`).join(', ')
      : 'N/A';

    markdown += `### ${index + 1}. ${prod.name} (\`${prod.slug}\`)
- **Category**: ${prod.categoryName} (\`${prod.categorySlug}\`)
- **Tags**: ${Array.isArray(prod.tags) ? prod.tags.join(', ') : 'software'}
- **Official URL**: ${prod.websiteUrl}
- **Short Description**: ${prod.shortDescription}
- **Primary Recommendation**: ${scores.primaryDecision.replace('_', ' ')} (${scores.confidence}% confidence)
- **Scores**: KEEP: ${scores.keepScore}/100 | SWITCH: ${scores.switchScore}/100 | SELF-HOST: ${scores.selfHostScore}/100 | AUTOMATE: ${scores.automateScore}/100 | BUILD: ${scores.buildScore}/100
- **Verified Open-Source Alternatives**: ${osAlts}
- **Commercial Alternatives**: ${commAlts}
- **Page Link**: ${baseUrl}/software/${prod.slug}
- **Open-Source Guide Link**: ${baseUrl}/software/${prod.slug}/open-source
- **Alternatives Comparison Link**: ${baseUrl}/software/${prod.slug}/alternatives

`;
  });

  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
