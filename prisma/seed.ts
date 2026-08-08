import { PrismaClient } from '@prisma/client';
import { INITIAL_25_PRODUCTS } from '../src/domain/seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process for 25 high-commercial-intent products...');

  for (const item of INITIAL_25_PRODUCTS) {
    // Upsert Category
    const category = await prisma.category.upsert({
      where: { slug: item.categorySlug },
      update: { name: item.categoryName },
      create: {
        name: item.categoryName,
        slug: item.categorySlug,
      },
    });

    // Upsert Software
    const software = await prisma.software.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        shortDescription: item.shortDescription,
        summary: item.summary,
        websiteUrl: item.websiteUrl,
        categoryId: category.id,
        status: 'PUBLISHED',
      },
      create: {
        name: item.name,
        slug: item.slug,
        shortDescription: item.shortDescription,
        summary: item.summary,
        websiteUrl: item.websiteUrl,
        categoryId: category.id,
        status: 'PUBLISHED',
      },
    });

    // Upsert Aliases
    for (const aliasStr of item.aliases) {
      await prisma.softwareAlias.upsert({
        where: { alias: aliasStr },
        update: { softwareId: software.id },
        create: {
          softwareId: software.id,
          alias: aliasStr,
        },
      });
    }

    // Upsert Assessment
    await prisma.softwareAssessment.upsert({
      where: { softwareId: software.id },
      update: { ...item.assessment },
      create: {
        softwareId: software.id,
        ...item.assessment,
      },
    });

    // Create Pricing Plans
    for (const plan of item.pricing) {
      const createdPlan = await prisma.pricingPlan.create({
        data: {
          softwareId: software.id,
          name: plan.name,
          billingInterval: plan.billingInterval,
          basePrice: plan.basePrice,
          pricePerSeat: plan.pricePerSeat,
          freeTier: plan.freeTier,
        },
      });

      await prisma.pricingSnapshot.create({
        data: {
          pricingPlanId: createdPlan.id,
          price: plan.basePrice,
        },
      });
    }

    // Create Sources
    for (const src of item.sources) {
      await prisma.source.create({
        data: {
          softwareId: software.id,
          type: src.type,
          title: src.title,
          url: src.url,
        },
      });
    }

    console.log(`Seeded: ${item.name} (${item.slug})`);
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
