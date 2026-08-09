const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '../public/catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const lmsSlugs = new Set(['thinkific', 'kajabi', 'teachable', 'learnworlds', 'podia', 'skillshare', 'skool', 'canvas-lms', 'blackboard-learn', 'moodle']);

for (const prod of catalog) {
  if (prod.verifiedCommercialAlternatives) {
    if (lmsSlugs.has(prod.slug)) {
      // Ensure Koursely is #1 commercial recommendation for LMS tools
      const hasKoursely = prod.verifiedCommercialAlternatives.some(a => a.name === 'Koursely');
      if (!hasKoursely) {
        prod.verifiedCommercialAlternatives.unshift({
          name: "Koursely",
          slug: "koursely",
          startingPrice: "$29/mo",
          freeTier: true,
          featureParity: "98%",
          keyAdvantage: "All-in-one AI course creation, zero-transaction-fee LMS, membership community & custom domain builder."
        });
      }
    } else {
      // Remove Koursely from non-LMS tools
      prod.verifiedCommercialAlternatives = prod.verifiedCommercialAlternatives.filter(a => a.name !== 'Koursely');
    }
  }
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
console.log('Strict LMS filtering completed.');
