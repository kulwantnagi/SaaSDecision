import { UniqueOpenSourceTool } from './catalog-service';

export interface OssTechnicalProfile {
  headline: string;
  subheadline: string;
  functionalRole: string;
  deploymentType: 'OFFICIAL_DOCKER_IMAGE' | 'GIT_REPOSITORY_COMPOSE';
  officialImage?: string;
  hardwareMin: { cpu: string; ram: string; disk: string };
  hardwareRec: { cpu: string; ram: string; disk: string };
  dbEngine: string;
  ports: number[];
  dockerComposeYaml: string;
  envTemplate: string;
  caddyConfig: string;
  featureMatrix: { feature: string; ossValue: string; saasValue: string; isAdvantage: boolean }[];
  migrationSteps: { title: string; detail: string; command?: string }[];
  tcoComparison: {
    teamSize: number;
    saasAnnualCost: number;
    vpsAnnualCost: number;
    annualSavings: number;
    savingsPercent: number;
  }[];
  proTips: string[];
}

interface KnownToolConfig {
  functionalRole?: string;
  deploymentType: 'OFFICIAL_DOCKER_IMAGE' | 'GIT_REPOSITORY_COMPOSE';
  officialImage?: string;
  port: number;
  cpuMin: string;
  ramMin: string;
  diskMin: string;
  cpuRec: string;
  ramRec: string;
  diskRec: string;
  dbEngine: string;
  saasPerUserMonthly: number;
  dockerComposeYaml?: string;
  envTemplate?: string;
  migrationCommands?: { step1?: string; step2?: string; step3?: string; step4?: string };
  proTips?: string[];
}

const KNOWN_TOOLS: Record<string, KnownToolConfig> = {
  vexa: {
    functionalRole: 'Self-Hosted AI Meeting Assistant & Audio Intelligence Engine',
    deploymentType: 'GIT_REPOSITORY_COMPOSE',
    port: 3000,
    cpuMin: '4 vCPU',
    ramMin: '8 GB',
    diskMin: '50 GB SSD',
    cpuRec: '8 vCPU (or 4 vCPU + NVIDIA GPU for Whisper)',
    ramRec: '16 GB',
    diskRec: '100 GB NVMe',
    dbEngine: 'PostgreSQL 16 & Redis 7',
    saasPerUserMonthly: 19,
    dockerComposeYaml: `version: '3.8'

services:
  # Vexa Web API & Bot Orchestrator
  vexa-api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: vexa-api
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - .env
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:secret_db_password@postgres:5432/vexa
      - REDIS_URL=redis://redis:6379/0
      - TRANSCRIPTION_SERVICE_URL=http://whisper-service:8000/v1
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - vexa-net

  # Real-Time Local Whisper Transcription Engine
  whisper-service:
    image: onerahmet/openai-whisper-asr-webservice:latest
    container_name: vexa-whisper
    restart: unless-stopped
    environment:
      - ASR_MODEL=base.en
      - ASR_ENGINE=openai_whisper
    networks:
      - vexa-net

  postgres:
    image: postgres:16-alpine
    container_name: vexa-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret_db_password
      POSTGRES_DB: vexa
    volumes:
      - vexa_pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - vexa-net

  redis:
    image: redis:7-alpine
    container_name: vexa-redis
    restart: unless-stopped
    volumes:
      - vexa_redisdata:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - vexa-net

volumes:
  vexa_pgdata:
  vexa_redisdata:

networks:
  vexa-net:
    driver: bridge`,
    envTemplate: `NODE_ENV=production
PORT=3000
APP_URL=https://vexa.yourdomain.com
DATABASE_URL=postgresql://postgres:secret_db_password@postgres:5432/vexa
REDIS_URL=redis://redis:6379/0
TRANSCRIPTION_SERVICE_URL=http://whisper-service:8000/v1
RECORDINGS_STORAGE_PATH=/data/recordings
MAX_RECORDING_MINUTES=240
JWT_SECRET=change_to_64_char_secure_random_hex_string`,
    migrationCommands: {
      step1: `ssh root@your_server_ip
sudo apt update && sudo apt upgrade -y
sudo apt install -y git make curl
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
sudo usermod -aG docker $USER`,
      step2: `git clone https://github.com/Vexa-ai/vexa.git /opt/vexa
cd /opt/vexa
cp .env.example .env`,
      step3: `# Launch core microservices
make all

# Build and register the meeting bot (Google Meet, Zoom, MS Teams)
make bot`,
    },
    proTips: [
      'Vexa requires at least 8 GB RAM if running local Whisper transcription models simultaneously with the meeting bot manager.',
      'For resource-constrained VPS instances (under 4GB RAM), deploy the lightweight runner using `make lite` and connect to an external transcription API.',
      'Configure webhook endpoints in `.env` to automatically pipe meeting summaries into Slack, Notion, or internal PostgreSQL databases.',
      'Schedule a nightly cleanup cron to prune raw audio recordings older than 30 days while retaining JSON transcript summaries.',
    ],
  },
  n8n: {
    functionalRole: 'Enterprise Workflow & Integration Automation Platform',
    deploymentType: 'OFFICIAL_DOCKER_IMAGE',
    officialImage: 'docker.n8n.io/n8nio/n8n:latest',
    port: 5678,
    cpuMin: '2 vCPU',
    ramMin: '4 GB',
    diskMin: '30 GB SSD',
    cpuRec: '4 vCPU',
    ramRec: '8 GB',
    diskRec: '60 GB NVMe',
    dbEngine: 'PostgreSQL 16',
    saasPerUserMonthly: 29,
    dockerComposeYaml: `version: '3.8'

services:
  n8n:
    image: docker.n8n.io/n8nio/n8n:latest
    container_name: n8n-app
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=n8n.yourdomain.com
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - WEBHOOK_URL=https://n8n.yourdomain.com/
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=postgres
      - DB_POSTGRESDB_PASSWORD=secret_db_password
      - N8N_ENCRYPTION_KEY=generate_32_char_hex_key
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - n8n-net

  postgres:
    image: postgres:16-alpine
    container_name: n8n-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret_db_password
      POSTGRES_DB: n8n
    volumes:
      - n8n_pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - n8n-net

volumes:
  n8n_data:
  n8n_pgdata:

networks:
  n8n-net:
    driver: bridge`,
    envTemplate: `N8N_HOST=n8n.yourdomain.com
N8N_PORT=5678
N8N_PROTOCOL=https
NODE_ENV=production
WEBHOOK_URL=https://n8n.yourdomain.com/
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=postgres
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=postgres
DB_POSTGRESDB_PASSWORD=secret_db_password
N8N_ENCRYPTION_KEY=generate_32_char_hex_key`,
  },
  listmonk: {
    functionalRole: 'High-Volume Newsletter & Transactional Email Engine',
    deploymentType: 'OFFICIAL_DOCKER_IMAGE',
    officialImage: 'listmonk/listmonk:latest',
    port: 9000,
    cpuMin: '1 vCPU',
    ramMin: '2 GB',
    diskMin: '20 GB SSD',
    cpuRec: '2 vCPU',
    ramRec: '4 GB',
    diskRec: '40 GB NVMe',
    dbEngine: 'PostgreSQL 16',
    saasPerUserMonthly: 25,
    dockerComposeYaml: `version: '3.8'

services:
  listmonk:
    image: listmonk/listmonk:latest
    container_name: listmonk-app
    restart: unless-stopped
    ports:
      - "9000:9000"
    environment:
      - LISTMONK_app__address=0.0.0.0:9000
      - LISTMONK_db__host=postgres
      - LISTMONK_db__port=5432
      - LISTMONK_db__user=postgres
      - LISTMONK_db__password=secret_db_password
      - LISTMONK_db__database=listmonk
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - listmonk-net

  postgres:
    image: postgres:16-alpine
    container_name: listmonk-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret_db_password
      POSTGRES_DB: listmonk
    volumes:
      - listmonk_pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - listmonk-net

volumes:
  listmonk_pgdata:

networks:
  listmonk-net:
    driver: bridge`,
    envTemplate: `LISTMONK_app__address=0.0.0.0:9000
LISTMONK_db__host=postgres
LISTMONK_db__port=5432
LISTMONK_db__user=postgres
LISTMONK_db__password=secret_db_password
LISTMONK_db__database=listmonk`,
  },
  vaultwarden: {
    functionalRole: 'Self-Hosted Bitwarden-Compatible Password Management Server',
    deploymentType: 'OFFICIAL_DOCKER_IMAGE',
    officialImage: 'vaultwarden/server:latest',
    port: 8080,
    cpuMin: '1 vCPU',
    ramMin: '1 GB',
    diskMin: '15 GB SSD',
    cpuRec: '1 vCPU',
    ramRec: '2 GB',
    diskRec: '30 GB SSD',
    dbEngine: 'SQLite / PostgreSQL (Built-in)',
    saasPerUserMonthly: 10,
    dockerComposeYaml: `version: '3.8'

services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped
    ports:
      - "8080:80"
    environment:
      - WEBSOCKET_ENABLED=true
      - SIGNUPS_ALLOWED=false
      - ADMIN_TOKEN=secure_admin_token_hash_here
    volumes:
      - vaultwarden_data:/data

volumes:
  vaultwarden_data:`,
    envTemplate: `WEBSOCKET_ENABLED=true
SIGNUPS_ALLOWED=false
ADMIN_TOKEN=secure_admin_token_hash_here`,
  },
  twenty: {
    functionalRole: 'Modern Open-Source Customer Relationship Management (CRM)',
    deploymentType: 'OFFICIAL_DOCKER_IMAGE',
    officialImage: 'twentycrm/twenty:latest',
    port: 3000,
    cpuMin: '2 vCPU',
    ramMin: '4 GB',
    diskMin: '30 GB SSD',
    cpuRec: '4 vCPU',
    ramRec: '8 GB',
    diskRec: '60 GB NVMe',
    dbEngine: 'PostgreSQL 16',
    saasPerUserMonthly: 35,
  },
  postiz: {
    functionalRole: 'Open-Source Social Media Scheduling & Content Pipeline',
    deploymentType: 'OFFICIAL_DOCKER_IMAGE',
    officialImage: 'ghcr.io/gitroomhq/postiz-app:latest',
    port: 5000,
    cpuMin: '2 vCPU',
    ramMin: '4 GB',
    diskMin: '30 GB SSD',
    cpuRec: '4 vCPU',
    ramRec: '8 GB',
    diskRec: '60 GB NVMe',
    dbEngine: 'PostgreSQL 16 & Redis 7',
    saasPerUserMonthly: 29,
  },
  formbricks: {
    functionalRole: 'Privacy-First Experience Management & Survey Suite',
    deploymentType: 'OFFICIAL_DOCKER_IMAGE',
    officialImage: 'ghcr.io/formbricks/formbricks:latest',
    port: 3000,
    cpuMin: '2 vCPU',
    ramMin: '4 GB',
    diskMin: '25 GB SSD',
    cpuRec: '4 vCPU',
    ramRec: '8 GB',
    diskRec: '50 GB NVMe',
    dbEngine: 'PostgreSQL 16',
    saasPerUserMonthly: 30,
  },
  matomo: {
    functionalRole: 'Privacy-Compliant Web Analytics & User Behavior Suite',
    deploymentType: 'OFFICIAL_DOCKER_IMAGE',
    officialImage: 'matomo:latest',
    port: 8080,
    cpuMin: '2 vCPU',
    ramMin: '4 GB',
    diskMin: '40 GB SSD',
    cpuRec: '4 vCPU',
    ramRec: '8 GB',
    diskRec: '100 GB NVMe',
    dbEngine: 'MariaDB 10.11',
    saasPerUserMonthly: 25,
  },
};

export function getOssTechnicalProfile(tool: UniqueOpenSourceTool): OssTechnicalProfile {
  const name = tool.name;
  const slug = tool.slug.toLowerCase().trim();
  const tags = tool.tags.map((t) => t.toLowerCase());
  const category = (tool.categoryName || '').toLowerCase();
  const replacedPrimary = tool.replacedProducts[0]?.name || 'Commercial SaaS';
  const replacedList = tool.replacedProducts.slice(0, 4).map((p) => p.name).join(', ');

  // Check known tool dictionary
  if (KNOWN_TOOLS[slug]) {
    const k = KNOWN_TOOLS[slug];
    const functionalRole = k.functionalRole || 'Enterprise Open-Source SaaS Alternative';
    const port = k.port;
    const saasPerUserMonthly = k.saasPerUserMonthly;

    const dockerComposeYaml = k.dockerComposeYaml || `version: '3.8'

services:
  ${slug}:
    image: ${k.officialImage || `${slug}:latest`}
    container_name: ${slug}-app
    restart: unless-stopped
    ports:
      - "${port}:${port}"
    env_file:
      - .env
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ${slug}_data:/data
    networks:
      - ${slug}_network

  postgres:
    image: postgres:16-alpine
    container_name: ${slug}-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret_db_password
      POSTGRES_DB: ${slug.replace(/[^a-z0-9]+/g, '_')}
    volumes:
      - ${slug}_pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - ${slug}_network

volumes:
  ${slug}_data:
  ${slug}_pgdata:

networks:
  ${slug}_network:
    driver: bridge`;

    const envTemplate = k.envTemplate || `NODE_ENV=production
PORT=${port}
APP_URL=https://${slug}.yourdomain.com
DATABASE_URL=postgresql://postgres:secret_db_password@postgres:5432/${slug.replace(/[^a-z0-9]+/g, '_')}
SECRET_KEY_BASE=${slug}_secret_token_change_in_production`;

    const caddyConfig = `${slug}.yourdomain.com {
    reverse_proxy localhost:${port}
    
    encode zstd gzip
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "SAMEORIGIN"
    }
}`;

    const migrationSteps = [
      {
        title: 'Step 1: Prepare Clean VPS Host',
        detail: `Launch a fresh Ubuntu 24.04 LTS VPS instance with at least ${k.cpuMin} and ${k.ramMin} (Hostinger VPS or DigitalOcean).`,
        command: k.migrationCommands?.step1 || `ssh root@your_server_ip
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl ufw git
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
sudo usermod -aG docker $USER`,
      },
      {
        title: `Step 2: Initialize ${name} Configuration`,
        detail: k.deploymentType === 'GIT_REPOSITORY_COMPOSE'
          ? `Clone the official repository from GitHub and prepare your local environment variables.`
          : `Create a dedicated deployment directory, write the production \`docker-compose.yml\`, and configure \`.env\`.`,
        command: k.migrationCommands?.step2 || (k.deploymentType === 'GIT_REPOSITORY_COMPOSE'
          ? `git clone ${tool.githubUrl}.git /opt/${slug}\ncd /opt/${slug}\ncp .env.example .env`
          : `mkdir -p /opt/${slug} && cd /opt/${slug}\ntouch docker-compose.yml .env`),
      },
      {
        title: 'Step 3: Launch Containers & Initialize Services',
        detail: `Start all microservices in detached mode and verify container health logs.`,
        command: k.migrationCommands?.step3 || `docker compose up -d\ndocker compose ps\ndocker compose logs -f`,
      },
      {
        title: 'Step 4: Configure Automatic HTTPS with Caddy',
        detail: `Route traffic securely over port 443 with automatic TLS certificate generation.`,
        command: `sudo apt install -y caddy
echo "${slug}.yourdomain.com { reverse_proxy localhost:${port} }" | sudo tee /etc/caddy/Caddyfile
sudo systemctl reload caddy`,
      },
      {
        title: 'Step 5: Migrate Data & Configure Workspace',
        detail: `Export historical records, transcript JSON, or media from ${replacedPrimary} and import into your new ${name} instance.`,
      },
    ];

    const vpsMonthly = 6.0;
    const vpsAnnual = vpsMonthly * 12;
    const tcoComparison = [5, 20, 50].map((seats) => {
      const saasAnnual = seats * saasPerUserMonthly * 12;
      const savings = saasAnnual - vpsAnnual;
      const pct = Math.round((savings / saasAnnual) * 100);
      return {
        teamSize: seats,
        saasAnnualCost: saasAnnual,
        vpsAnnualCost: vpsAnnual,
        annualSavings: savings,
        savingsPercent: pct,
      };
    });

    return {
      headline: `${name} Self-Hosting Guide: Practical Production Deployment & Migration`,
      subheadline: `Complete actionable guide to deploying ${name} via Docker Compose, replacing ${replacedList}, and saving thousands in SaaS licensing fees.`,
      functionalRole,
      deploymentType: k.deploymentType,
      officialImage: k.officialImage,
      hardwareMin: { cpu: k.cpuMin, ram: k.ramMin, disk: k.diskMin },
      hardwareRec: { cpu: k.cpuRec, ram: k.ramRec, disk: k.diskRec },
      dbEngine: k.dbEngine,
      ports: [port],
      dockerComposeYaml,
      envTemplate,
      caddyConfig,
      featureMatrix: [
        {
          feature: 'Data Sovereignty & Privacy',
          ossValue: '100% Private (Self-hosted on your private VPS)',
          saasValue: `Stored on proprietary cloud servers (${replacedPrimary})`,
          isAdvantage: true,
        },
        {
          feature: 'AI / Model Training Policy',
          ossValue: 'Zero third-party model training on your data',
          saasValue: 'May feed conversations or data into LLM improvements',
          isAdvantage: true,
        },
        {
          feature: 'Monthly Seat Fees',
          ossValue: '$0.00 / month (Unlimited team users)',
          saasValue: `$${saasPerUserMonthly} - $${saasPerUserMonthly * 2} per user per month`,
          isAdvantage: true,
        },
        {
          feature: 'Usage & Tier Limits',
          ossValue: 'Unlimited (Bound only by server hardware)',
          saasValue: 'Strict tier caps, transcription/action quotas',
          isAdvantage: true,
        },
        {
          feature: 'Custom Webhooks & API Freedom',
          ossValue: 'Full access to direct database, Docker logs & APIs',
          saasValue: 'Rate-limited REST API access with tier locks',
          isAdvantage: true,
        },
      ],
      migrationSteps,
      tcoComparison,
      proTips: k.proTips || [
        `Use Docker Named Volumes (/var/lib/docker/volumes/) for database persistence rather than raw bind mounts for optimal I/O.`,
        `Schedule daily automated database dumps with cron: \`docker exec -t ${slug}-db pg_dump -U postgres ${slug.replace(/[^a-z0-9]+/g, '_')} | gzip > /backups/db_\$(date +%F).sql.gz\``,
        `Enable UFW firewall to block exposed database ports: \`sudo ufw allow 80/tcp && sudo ufw allow 443/tcp && sudo ufw enable\``,
      ],
    };
  }

  // Fallback for general OSS tools
  const isMeetingAi = tags.includes('ai-meeting-notes') || tags.includes('ai-voice');
  const isCrm = tags.includes('crm') || category.includes('crm');
  const isAutomation = tags.includes('automation') || category.includes('automation');
  const isEmail = tags.includes('marketing-email') || category.includes('email');
  const isAnalytics = tags.includes('analytics') || category.includes('analytics');
  const isProjectMgmt = tags.includes('project-management') || category.includes('project');
  const isDesignAi = tags.includes('design-media') || tags.includes('ai-image');

  let functionalRole = 'Enterprise Open-Source SaaS Alternative';
  let cpuMin = '1 vCPU';
  let ramMin = '2 GB';
  let diskMin = '20 GB SSD';
  let cpuRec = '2 vCPU';
  let ramRec = '4 GB';
  let diskRec = '50 GB NVMe';
  let dbEngine = 'PostgreSQL 16 (Alpine)';
  let port = 8080;
  let saasPerUserMonthly = 20;

  if (isMeetingAi) {
    functionalRole = 'Self-Hosted AI Meeting Assistant & Audio Intelligence Engine';
    cpuMin = '4 vCPU';
    ramMin = '8 GB';
    diskMin = '50 GB SSD';
    cpuRec = '8 vCPU (or 4 vCPU + CUDA GPU)';
    ramRec = '16 GB';
    diskRec = '100 GB NVMe';
    port = 3000;
    saasPerUserMonthly = 19;
  } else if (isAutomation) {
    functionalRole = 'Enterprise Workflow & Integration Automation Platform';
    cpuMin = '2 vCPU';
    ramMin = '4 GB';
    diskMin = '30 GB SSD';
    cpuRec = '4 vCPU';
    ramRec = '8 GB';
    diskRec = '60 GB NVMe';
    port = 5678;
    saasPerUserMonthly = 29;
  } else if (isCrm) {
    functionalRole = 'Self-Hosted Customer Relationship Management (CRM) Suite';
    cpuMin = '2 vCPU';
    ramMin = '4 GB';
    diskMin = '40 GB SSD';
    cpuRec = '4 vCPU';
    ramRec = '8 GB';
    diskRec = '80 GB NVMe';
    port = 3000;
    saasPerUserMonthly = 35;
  } else if (isEmail) {
    functionalRole = 'High-Volume Newsletter & Transactional Email Engine';
    cpuMin = '1 vCPU';
    ramMin = '2 GB';
    diskMin = '20 GB SSD';
    cpuRec = '2 vCPU';
    ramRec = '4 GB';
    diskRec = '40 GB NVMe';
    port = 9000;
    saasPerUserMonthly = 25;
  } else if (isAnalytics) {
    functionalRole = 'Privacy-Compliant Self-Hosted Analytics Platform';
    cpuMin = '2 vCPU';
    ramMin = '4 GB';
    diskMin = '50 GB SSD';
    cpuRec = '4 vCPU';
    ramRec = '8 GB';
    diskRec = '100 GB NVMe';
    port = 8080;
    saasPerUserMonthly = 25;
  } else if (isProjectMgmt) {
    functionalRole = 'Self-Hosted Agile Project & Team Workspace';
    cpuMin = '2 vCPU';
    ramMin = '4 GB';
    diskMin = '40 GB SSD';
    cpuRec = '4 vCPU';
    ramRec = '8 GB';
    diskRec = '80 GB NVMe';
    port = 8080;
    saasPerUserMonthly = 15;
  } else if (isDesignAi) {
    functionalRole = 'Self-Hosted AI Image & Media Generation Pipeline';
    cpuMin = '4 vCPU';
    ramMin = '16 GB';
    diskMin = '100 GB NVMe';
    cpuRec = '8 vCPU (NVIDIA GPU with 16GB+ VRAM)';
    ramRec = '32 GB';
    diskRec = '250 GB NVMe';
    port = 8188;
    saasPerUserMonthly = 30;
  }

  // Universal Git Clone + Compose Workflow (Guarantees no 404 image errors on Docker Hub)
  const dockerComposeYaml = `version: '3.8'

services:
  ${slug}:
    # Builds locally from cloned repository Dockerfile
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ${slug}-app
    restart: unless-stopped
    ports:
      - "${port}:${port}"
    env_file:
      - .env
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ${slug}_data:/data
    networks:
      - ${slug}_network

  postgres:
    image: postgres:16-alpine
    container_name: ${slug}-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret_db_password
      POSTGRES_DB: ${slug.replace(/[^a-z0-9]+/g, '_')}
    volumes:
      - ${slug}_pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - ${slug}_network

volumes:
  ${slug}_data:
  ${slug}_pgdata:

networks:
  ${slug}_network:
    driver: bridge`;

  const envTemplate = `NODE_ENV=production
PORT=${port}
APP_URL=https://${slug}.yourdomain.com
DATABASE_URL=postgresql://postgres:secret_db_password@postgres:5432/${slug.replace(/[^a-z0-9]+/g, '_')}
SECRET_KEY_BASE=${slug}_secret_token_change_in_production`;

  const caddyConfig = `${slug}.yourdomain.com {
    reverse_proxy localhost:${port}
    
    encode zstd gzip
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "SAMEORIGIN"
    }
}`;

  const migrationSteps = [
    {
      title: 'Step 1: Prepare Clean VPS Host',
      detail: `Launch a fresh Ubuntu 24.04 LTS instance with at least ${cpuMin} and ${ramMin} (Hostinger VPS or DigitalOcean).`,
      command: `ssh root@your_server_ip
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl ufw git make
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
sudo usermod -aG docker $USER`,
    },
    {
      title: `Step 2: Clone ${name} Official Repository`,
      detail: `Clone the official repository from GitHub into \`/opt/${slug}\` and configure your environment variables.`,
      command: `git clone ${tool.githubUrl}.git /opt/${slug}
cd /opt/${slug}
if [ -f .env.example ]; then cp .env.example .env; fi`,
    },
    {
      title: 'Step 3: Launch Containers via Docker Compose',
      detail: `Build the local container and launch in detached mode.`,
      command: `docker compose up -d --build
docker compose ps
docker compose logs -f`,
    },
    {
      title: 'Step 4: Enable Automatic HTTPS with Caddy',
      detail: `Expose ${name} securely on port 443 with automated TLS certificate generation.`,
      command: `sudo apt install -y caddy
echo "${slug}.yourdomain.com { reverse_proxy localhost:${port} }" | sudo tee /etc/caddy/Caddyfile
sudo systemctl reload caddy`,
    },
    {
      title: 'Step 5: Migrate Data & Configure Workspace',
      detail: `Export historical files or database JSON from ${replacedPrimary} and import into your new ${name} instance.`,
    },
  ];

  const vpsMonthly = 6.0;
  const vpsAnnual = vpsMonthly * 12;
  const tcoComparison = [5, 20, 50].map((seats) => {
    const saasAnnual = seats * saasPerUserMonthly * 12;
    const savings = saasAnnual - vpsAnnual;
    const pct = Math.round((savings / saasAnnual) * 100);
    return {
      teamSize: seats,
      saasAnnualCost: saasAnnual,
      vpsAnnualCost: vpsAnnual,
      annualSavings: savings,
      savingsPercent: pct,
    };
  });

  return {
    headline: `${name} Self-Hosting Guide: Practical Production Deployment & Migration`,
    subheadline: `Complete actionable guide to deploying ${name} via Docker Compose, replacing ${replacedList}, and saving thousands in SaaS licensing fees.`,
    functionalRole,
    deploymentType: 'GIT_REPOSITORY_COMPOSE',
    hardwareMin: { cpu: cpuMin, ram: ramMin, disk: diskMin },
    hardwareRec: { cpu: cpuRec, ram: ramRec, disk: diskRec },
    dbEngine,
    ports: [port],
    dockerComposeYaml,
    envTemplate,
    caddyConfig,
    featureMatrix: [
      {
        feature: 'Data Sovereignty & Privacy',
        ossValue: '100% Private (Self-hosted on your private VPS)',
        saasValue: `Stored on proprietary cloud servers (${replacedPrimary})`,
        isAdvantage: true,
      },
      {
        feature: 'AI / Model Training Policy',
        ossValue: 'Zero third-party model training on your data',
        saasValue: 'May feed conversations or data into LLM improvements',
        isAdvantage: true,
      },
      {
        feature: 'Monthly Seat Fees',
        ossValue: '$0.00 / month (Unlimited team users)',
        saasValue: `$${saasPerUserMonthly} - $${saasPerUserMonthly * 2} per user per month`,
        isAdvantage: true,
      },
      {
        feature: 'Usage & Tier Limits',
        ossValue: 'Unlimited (Bound only by server hardware)',
        saasValue: 'Strict tier caps, transcription/action quotas',
        isAdvantage: true,
      },
      {
        feature: 'Custom Webhooks & API Freedom',
        ossValue: 'Full access to direct database, Docker logs & APIs',
        saasValue: 'Rate-limited REST API access with tier locks',
        isAdvantage: true,
      },
    ],
    migrationSteps,
    tcoComparison,
    proTips: [
      `Use Docker Named Volumes (/var/lib/docker/volumes/) for database persistence rather than raw bind mounts for optimal I/O.`,
      `Schedule daily automated database dumps with cron: \`docker exec -t ${slug}-db pg_dump -U postgres ${slug.replace(/[^a-z0-9]+/g, '_')} | gzip > /backups/db_\$(date +%F).sql.gz\``,
      `Enable UFW firewall to block exposed database ports: \`sudo ufw allow 80/tcp && sudo ufw allow 443/tcp && sudo ufw enable\``,
    ],
  };
}

