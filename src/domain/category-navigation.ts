export interface CategoryNavigationItem {
  name: string;
  slug: string;
  subcategories: {
    name: string;
    slug: string;
    toolCount: number;
  }[];
}

export const CATEGORY_TREE: CategoryNavigationItem[] = [
  {
    name: 'AI & LLMs',
    slug: 'ai-llm',
    subcategories: [
      { name: 'LLMs & Conversational AI', slug: 'ai-llm', toolCount: 42 },
      { name: 'AI Image & Media Generators', slug: 'design-media', toolCount: 28 },
      { name: 'Audio & Voice Synthesis', slug: 'audio-voice', toolCount: 18 },
      { name: 'AI Code & Dev Assistants', slug: 'developer-tools', toolCount: 35 },
    ],
  },
  {
    name: 'Developer Tools',
    slug: 'developer-tools',
    subcategories: [
      { name: 'Databases & Backend BaaS', slug: 'developer-tools', toolCount: 65 },
      { name: 'CI/CD & DevOps Automation', slug: 'automation', toolCount: 48 },
      { name: 'API Platforms & Gateways', slug: 'developer-tools', toolCount: 32 },
      { name: 'Security & Authentication', slug: 'security-auth', toolCount: 29 },
    ],
  },
  {
    name: 'Productivity & Workspace',
    slug: 'productivity-notes',
    subcategories: [
      { name: 'Notes & Knowledge Bases', slug: 'productivity-notes', toolCount: 54 },
      { name: 'Project Management & Issue Trackers', slug: 'project-management', toolCount: 62 },
      { name: 'Forms & Surveys', slug: 'forms', toolCount: 24 },
      { name: 'Scheduling & Calendar', slug: 'scheduling', toolCount: 20 },
    ],
  },
  {
    name: 'Marketing & Sales',
    slug: 'crm-sales',
    subcategories: [
      { name: 'CRM & Pipeline Management', slug: 'crm-sales', toolCount: 58 },
      { name: 'Email & Marketing Automation', slug: 'marketing-email', toolCount: 46 },
      { name: 'SEO & Content Intelligence', slug: 'seo-content', toolCount: 31 },
      { name: 'Product Analytics & Metrics', slug: 'analytics', toolCount: 39 },
    ],
  },
  {
    name: 'Design & Media',
    slug: 'design-media',
    subcategories: [
      { name: 'UI/UX Design & Prototyping', slug: 'design-media', toolCount: 40 },
      { name: 'Storage & Asset Backup', slug: 'storage-backup', toolCount: 22 },
      { name: 'Video Editing & Recording', slug: 'design-media', toolCount: 19 },
    ],
  },
  {
    name: 'Finance & Operations',
    slug: 'finance-accounting',
    subcategories: [
      { name: 'Invoicing & Accounting', slug: 'finance-accounting', toolCount: 37 },
      { name: 'E-Commerce & Subscriptions', slug: 'ecommerce-billing', toolCount: 44 },
      { name: 'Workflow Automation', slug: 'automation', toolCount: 51 },
    ],
  },
];
