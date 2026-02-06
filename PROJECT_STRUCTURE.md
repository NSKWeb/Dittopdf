# Dittopdf Project Structure

## Phase 3: AI-Powered Enterprise Platform

This document describes the complete project structure including Phase 3 AI-powered enterprise features.

```
dittopdf/
├── prisma/
│   └── schema.prisma              # Extended database schema with Phase 3 tables
├── public/                        # Static assets
│   ├── robots.txt                 # SEO robots file
│   └── manifest.json             # PWA manifest
├── mobile/                        # React Native Mobile App (Phase 3)
│   ├── package.json              # Mobile app dependencies
│   ├── src/
│   │   ├── components/           # Mobile React components
│   │   ├── screens/              # App screens
│   │   │   ├── HomeScreen.tsx
│   │   │   └── ...
│   │   ├── services/             # API services
│   │   │   └── api.ts
│   │   ├── store/                # Redux store
│   │   └── utils/                # Mobile utilities
│   ├── android/                  # Android-specific files
│   └── ios/                      # iOS-specific files
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                 # API routes
│   │   │   ├── auth/            # Authentication endpoints (v1)
│   │   │   │   ├── login/
│   │   │   │   ├── logout/
│   │   │   │   ├── me/
│   │   │   │   └── register/
│   │   │   ├── dashboard/        # Dashboard API
│   │   │   ├── files/           # File management
│   │   │   ├── tools/           # PDF processing
│   │   │   ├── user/            # User management
│   │   │   ├── v2/              # Phase 2 API
│   │   │   │   ├── batch/       # Batch processing
│   │   │   │   ├── editor/      # PDF editing
│   │   │   │   ├── ocr/         # OCR processing
│   │   │   │   └── signatures/  # E-signatures
│   │   │   └── v3/              # Phase 3 API (AI & Enterprise)
│   │   │       ├── ai/          # AI-powered analysis
│   │   │       │   ├── analyze/
│   │   │       │   ├── ask/
│   │   │       │   └── compare/
│   │   │       ├── bi/          # Business intelligence
│   │   │       │   └── dashboard/
│   │   │       ├── billing/     # Subscription management
│   │   │       │   ├── subscription/
│   │   │       │   └── usage/
│   │   │       ├── classify/    # Document classification
│   │   │       │   └── document/
│   │   │       ├── compliance/  # Security & compliance
│   │   │       │   ├── audit/
│   │   │       │   └── report/
│   │   │       ├── integrations/ # Enterprise integrations
│   │   │       │   └── [id]/
│   │   │       │       └── sync/
│   │   │       ├── mobile/      # Mobile app API
│   │   │       │   ├── device/
│   │   │       │   └── sync/
│   │   │       ├── tenant/      # Multi-tenant management
│   │   │       │   ├── route.ts
│   │   │       │   └── sso/
│   │   │       ├── white-label/ # White-label customization
│   │   │       │   ├── branding/
│   │   │       │   └── domain/
│   │   │       └── workflows/   # Workflow automation
│   │   │           ├── route.ts
│   │   │           └── [id]/
│   │   │               └── run/
│   │   ├── auth/                # Auth pages
│   │   ├── dashboard/           # Dashboard page
│   │   ├── downloads/           # File downloads
│   │   ├── tools/              # Tool pages
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   ├── loading.tsx         # Loading state
│   │   ├── not-found.tsx       # 404 page
│   │   └── page.tsx           # Home page
│   ├── components/             # React components
│   │   ├── ad-slot.tsx        # AdSense component
│   │   ├── auth-form.tsx      # Login/Register form
│   │   ├── navigation.tsx     # Navigation bar
│   │   └── tool-upload-form.tsx # File upload form
│   └── lib/                   # Utility libraries
│       ├── ai/                # AI services (Phase 3)
│       │   ├── classification.ts  # Document classification
│       │   └── openai.ts      # OpenAI GPT-4 integration
│       ├── analytics/         # Business intelligence (Phase 3)
│       │   └── bi.ts          # Analytics service
│       ├── billing/           # Subscription management (Phase 3)
│       │   └── stripe.ts      # Stripe integration
│       ├── compliance/        # Security & compliance (Phase 3)
│       │   └── audit.ts       # Audit & compliance service
│       ├── integrations/      # Enterprise integrations (Phase 3)
│       │   └── enterprise.ts  # Integration manager
│       ├── mobile/            # Mobile services (Phase 3)
│       │   └── service.ts     # Mobile backend service
│       ├── tenant/            # Multi-tenant & white-label (Phase 3)
│       │   ├── sso.ts         # SSO configuration
│       │   └── white-label.ts # White-label service
│       ├── workflow/          # Automation engine (Phase 3)
│       │   └── engine.ts      # Workflow execution engine
│       ├── api-keys.ts        # API key management
│       ├── batch.ts           # Batch processing
│       ├── collaboration.ts   # Real-time collaboration
│       ├── dashboard.ts       # Dashboard logic
│       ├── ocr.ts             # OCR processing
│       ├── pdf-tools.ts       # PDF processing functions
│       ├── prisma.ts          # Prisma client
│       ├── rate-limit.ts      # Rate limiting
│       ├── request.ts         # Request utilities
│       ├── session.ts         # JWT session handling
│       ├── signatures.ts      # E-signature handling
│       ├── storage.ts         # File storage
│       ├── swagger.ts         # API documentation
│       └── tools.ts          # Tool definitions
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
├── API.md                   # API v1 & v2 documentation
├── API_V3.md                # API v3 documentation (Phase 3)
├── CHECKLIST.md             # Implementation checklist
├── FEATURES.md              # Feature documentation
├── IMPLEMENTATION_SUMMARY.md # Phase 1 & 2 summary
├── next.config.mjs          # Next.js configuration
├── package.json             # Dependencies
├── PHASE3.md                # Phase 3 implementation summary
├── postcss.config.js        # PostCSS configuration
├── PROJECT_STRUCTURE.md     # This file
├── README.md               # Main documentation
├── SETUP.md                # Setup guide
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Phase 3 Key Components

### AI Services (`lib/ai/`)

- **openai.ts**: GPT-4 integration for document analysis, summarization, entity extraction, Q&A
- **classification.ts**: TensorFlow.js-based document classification with 18+ categories

### Workflow Engine (`lib/workflow/`)

- **engine.ts**: Complete workflow automation with nodes, edges, triggers, and execution

### Enterprise Services (`lib/tenant/`)

- **white-label.ts**: Tenant branding, custom domains, email templates
- **sso.ts**: SAML 2.0 and OAuth 2.0 SSO configuration

### Billing (`lib/billing/`)

- **stripe.ts**: Complete Stripe integration with subscriptions, usage metering, invoicing

### Compliance (`lib/compliance/`)

- **audit.ts**: SOC 2, GDPR, HIPAA compliance framework with audit logging

### Integrations (`lib/integrations/`)

- **enterprise.ts**: Salesforce, SharePoint, Google Workspace, Teams, Slack integrations

### Analytics (`lib/analytics/`)

- **bi.ts**: Business intelligence, predictive analytics, executive dashboards

### Mobile (`lib/mobile/`)

- **service.ts**: Device registration, push notifications, offline sync

## Database Tables (Phase 3)

### AI & Automation
- AiJobs, AiModels, AiTrainingData
- Workflows, WorkflowRuns, WorkflowTemplates

### Multi-Tenant
- Tenants, TenantRoles, UserTenantRoles
- CustomDomains

### Compliance
- ComplianceLogs, AuditLogs, UserSessions

### Mobile
- MobileDevices

### Billing
- Subscriptions, Invoices, BillingMeters, TenantBillingSettings

### Analytics
- AnalyticsEvents, AnalyticsDashboards

### Integrations
- TenantIntegrations, IntegrationSyncLogs

### Enhanced Document Management
- Documents, DocumentVersions, DocumentShares, DocumentLibraries

### Notifications
- Notifications, ApiWebhooks, WebhookDeliveries

## API Structure

### v1 - Core
- `/api/auth/*` - Authentication
- `/api/tools/*` - PDF processing
- `/api/files/*` - File management
- `/api/dashboard/*` - User dashboard

### v2 - Enhanced
- `/api/v2/ocr/*` - OCR processing
- `/api/v2/batch/*` - Batch processing
- `/api/v2/signatures/*` - E-signatures
- `/api/v2/editor/*` - PDF editing

### v3 - AI & Enterprise
- `/api/v3/ai/*` - AI analysis
- `/api/v3/classify/*` - Document classification
- `/api/v3/workflows/*` - Workflow automation
- `/api/v3/tenant/*` - Tenant management
- `/api/v3/compliance/*` - Compliance
- `/api/v3/mobile/*` - Mobile API
- `/api/v3/integrations/*` - Enterprise integrations
- `/api/v3/billing/*` - Subscription management
- `/api/v3/bi/*` - Business intelligence
- `/api/v3/white-label/*` - White-label customization

## Configuration

### Environment Variables

See `.env.example` for complete configuration including:
- Core: DATABASE_URL, JWT_SECRET
- AI: OPENAI_API_KEY
- Payments: STRIPE_* 
- SSO: SAML_CERT, OAuth credentials
- Mobile: FCM_SERVER_KEY, APN_*
- Integrations: Provider credentials

## Development

### Web
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run prisma:migrate  # Run database migrations
```

### Mobile
```bash
npm run mobile:ios       # Run iOS app
npm run mobile:android   # Run Android app
```

### AI
```bash
npm run ai:train         # Train classification models
```
