import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import { getAllSoftware } from '../src/domain/catalog-service';

function generateExcel() {
  const tools = getAllSoftware();

  const data = tools.map((t, index) => {
    // Format pricing summary
    let pricingStr = 'N/A';
    if (t.pricing && t.pricing.length > 0) {
      pricingStr = t.pricing.map(p => {
        const free = p.freeTier ? 'Free' : '';
        const base = p.basePrice !== undefined ? `$${p.basePrice}` : '';
        const seat = p.pricePerSeat ? ` + $${p.pricePerSeat}/seat` : '';
        const period = p.billingInterval ? ` (${p.billingInterval})` : '';
        return `${p.name}: ${free || base}${seat}${period}`.trim();
      }).join(' | ');
    }

    // Open Source Alternatives
    let osAltsStr = '';
    if (t.openSourceAlternatives && t.openSourceAlternatives.length > 0) {
      osAltsStr = t.openSourceAlternatives.map(alt => `${alt.name}${alt.stars ? ' (' + alt.stars + ')' : ''}: ${alt.githubUrl}`).join('\n');
    }

    // Commercial Alternatives
    let commAltsStr = '';
    if (t.verifiedCommercialAlternatives && t.verifiedCommercialAlternatives.length > 0) {
      commAltsStr = t.verifiedCommercialAlternatives.map(alt => `${alt.name} (${alt.startingPrice || 'N/A'})`).join('\n');
    }

    return {
      '#': index + 1,
      'Tool Name': t.name || '',
      'Slug': t.slug || '',
      'Category': t.categoryName || '',
      'Category Slug': t.categorySlug || '',
      'Short Description': t.shortDescription || '',
      'Summary': t.summary || '',
      'Website URL': t.websiteUrl || '',
      'Pricing Tiers': pricingStr,
      'Open Source Alternatives': osAltsStr,
      'Commercial Alternatives': commAltsStr,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Adjust column widths
  const colWidths = [
    { wch: 6 },   // #
    { wch: 25 },  // Tool Name
    { wch: 25 },  // Slug
    { wch: 25 },  // Category
    { wch: 20 },  // Category Slug
    { wch: 50 },  // Short Description
    { wch: 60 },  // Summary
    { wch: 30 },  // Website URL
    { wch: 40 },  // Pricing Tiers
    { wch: 50 },  // Open Source Alternatives
    { wch: 40 },  // Commercial Alternatives
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'SaaS Tools');

  const outputPath = path.join(process.cwd(), 'public', 'all_website_tools.xlsx');
  XLSX.writeFile(workbook, outputPath);

  console.log('Successfully generated Excel file at:', outputPath);
  console.log('Total rows written:', data.length);
}

generateExcel();
