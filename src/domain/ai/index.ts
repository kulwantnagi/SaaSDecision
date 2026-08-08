import { z } from 'zod';

export const ReplacementBlueprintSchema = z.object({
  softwareName: z.string(),
  architectureSummary: z.string(),
  suggestedStack: z.array(z.string()),
  coreFeatures: z.array(z.string()),
  excludedFeatures: z.array(z.string()),
  estimatedDevHours: z.number(),
  estimatedInitialCost: z.number(),
  estimatedMonthlyHosting: z.number(),
  codexPrompt: z.string(),
});

export type ReplacementBlueprint = z.infer<typeof ReplacementBlueprintSchema>;

export interface AIProvider {
  generateBlueprint(softwareName: string, requirements: string): Promise<ReplacementBlueprint>;
}

/**
 * Deterministic Fallback AI Provider with Zod validation
 */
export class StandardAIProvider implements AIProvider {
  async generateBlueprint(softwareName: string, requirements: string): Promise<ReplacementBlueprint> {
    const rawData = {
      softwareName,
      architectureSummary: `Clean modular Next.js 16 App Router application with PostgreSQL on Neon, Prisma ORM, and Tailwind CSS v4 to replace ${softwareName}.`,
      suggestedStack: ['Next.js 16', 'React 19', 'Tailwind CSS v4', 'PostgreSQL (Neon)', 'Prisma ORM 7', 'Cloudflare Workers'],
      coreFeatures: ['User authentication & session management', 'Core workflow database models', 'REST/GraphQL API endpoints', 'Clean reactive dashboard UI'],
      excludedFeatures: ['Legacy enterprise SAML v1', 'Complex phone routing', 'Third-party legacy connectors'],
      estimatedDevHours: 120,
      estimatedInitialCost: 9000,
      estimatedMonthlyHosting: 35,
      codexPrompt: `Build a clean lightweight Next.js 16 + React 19 replacement for ${softwareName} focusing on user requirements: ${requirements}. Use PostgreSQL on Neon and deploy to Cloudflare Workers.`,
    };

    return ReplacementBlueprintSchema.parse(rawData);
  }
}
