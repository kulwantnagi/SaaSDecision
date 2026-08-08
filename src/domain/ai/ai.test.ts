import { describe, it, expect } from 'vitest';
import { StandardAIProvider, ReplacementBlueprintSchema } from './index';

describe('AI Replacement Blueprint Engine', () => {
  it('generates Zod-validated replacement blueprint specs', async () => {
    const provider = new StandardAIProvider();
    const blueprint = await provider.generateBlueprint('Calendly', 'Need custom booking widget with Google Calendar sync.');

    expect(blueprint.softwareName).toBe('Calendly');
    expect(blueprint.suggestedStack.length).toBeGreaterThan(0);
    expect(ReplacementBlueprintSchema.safeParse(blueprint).success).toBe(true);
  });
});
