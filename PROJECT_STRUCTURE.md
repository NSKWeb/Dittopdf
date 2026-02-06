# Dittopdf Project Structure

## Directory Overview

```
dittopdf/
├── prisma/
│   └── schema.prisma              # Database schema and models
├── public/                        # Static assets
│   ├── robots.txt                 # SEO robots file
│   └── manifest.json             # PWA manifest
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                 # API routes
│   │   │   ├── auth/            # Authentication endpoints
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── me/
│   │   │   │   │   └── route.ts
│   │   │   │   └── register/
│   │   │   │       └── route.ts
│   │   │   ├── dashboard/        # Dashboard API
│   │   │   │   └── overview/
│   │   │   │       └── route.ts
│   │   │   ├── files/           # File management
│   │   │   │   ├── history/
│   │   │   │   │   └── route.ts
│   │   │   │   └── upload/
│   │   │   │       └── route.ts
│   │   │   ├── tools/           # PDF processing
│   │   │   │   └── [tool]/
│   │   │   │       └── route.ts
│   │   │   └── user/            # User management
│   │   │       └── profile/
│   │   │           └── route.ts
│   │   ├── auth/                # Auth pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── dashboard/           # Dashboard page
│   │   │   └── page.tsx
│   │   ├── downloads/           # File downloads
│   │   │   └── [key]/
│   │   │       └── route.ts
│   │   ├── tools/              # Tool pages
│   │   │   └── [tool]/
│   │   │       └── page.tsx
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
│   ├── lib/                   # Utility libraries
│   │   ├── dashboard.ts       # Dashboard logic
│   │   ├── pdf-tools.ts      # PDF processing functions
│   │   ├── prisma.ts         # Prisma client
│   │   ├── rate-limit.ts     # Rate limiting
│   │   ├── request.ts        # Request utilities
│   │   ├── session.ts        # JWT session handling
│   │   ├── storage.ts        # File storage (S3/Cloudinary/Local)
│   │   └── tools.ts         # Tool definitions
│   └── middleware.ts         # Next.js middleware
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
├── API.md                   # API documentation
├── next.config.mjs          # Next.js configuration
├── package.json             # Dependencies
├── postcss.config.js        # PostCSS configuration
├── PROJECT_STRUCTURE.md     # This file
├── README.md               # Main documentation
├── SETUP.md                # Setup guide
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Key Components

### Frontend Components

- **Navigation** (`components/navigation.tsx`)
  - User authentication state
  - Login/Logout functionality
  - Mobile responsive menu

- **AuthForm** (`components/auth-form.tsx`)
  - Login and registration
  - Form validation
  - Success/error feedback

- **ToolUploadForm** (`components/tool-upload-form.tsx`)
  - File upload interface
  - Progress indicator
  - Download link display

- **AdSlot** (`components/ad-slot.tsx`)
  - Google AdSense integration
  - Position-based slots

### Backend Libraries

- **PDF Processing** (`lib/pdf-tools.ts`)
  - All 16 PDF tool implementations
  - Server-side processing with pdf-lib

- **Storage** (`lib/storage.ts`)
  - Multi-provider support (Local, AWS S3, Cloudinary)
  - Automatic file cleanup
  - File type handling

- **Session** (`lib/session.ts`)
  - JWT token generation/verification
  - User authentication

- **Rate Limiting** (`lib/rate-limit.ts`)
  - In-memory rate limiting
  - Per-IP tracking

### API Routes

- **Authentication** (`/api/auth/*`)
  - User registration/login
  - Session management
  - Token verification

- **Tools** (`/api/tools/[tool]`)
  - PDF processing endpoints
  - File upload handling
  - Usage tracking

- **Dashboard** (`/api/dashboard/*`)
  - Statistics aggregation
  - User data retrieval

- **Files** (`/api/files/*`)
  - File upload/download
  - History tracking

### Pages

- **Home** (`app/page.tsx`)
  - Tool grid display
  - Feature highlights

- **Dashboard** (`app/dashboard/page.tsx`)
  - Usage statistics
  - Recent files
  - Account settings

- **Tool Pages** (`app/tools/[tool]/page.tsx`)
  - Individual tool interface
  - Instructions and help

- **Auth Pages** (`app/auth/login/page.tsx`, `app/auth/register/page.tsx`)
  - Authentication forms

## Database Schema

### Users Table
```prisma
- id (String, @id, @default(cuid()))
- email (String, @unique)
- passwordHash (String)
- createdAt (DateTime, @default(now()))
- updatedAt (DateTime, @updatedAt)
- usageCount (Int, @default(0))
- lastResetDate (DateTime, @default(now()))
- planType (String, @default("Free"))
- files (Files[])
- usageLogs (UsageLogs[])
```

### Files Table
```prisma
- id (String, @id, @default(cuid()))
- userId (String)
- originalFilename (String)
- processedFilename (String)
- fileSize (Int)
- toolUsed (String)
- status (String, @default("processed"))
- createdAt (DateTime, @default(now()))
- user (Users @relation)
```

### UsageLogs Table
```prisma
- id (String, @id, @default(cuid()))
- userId (String)
- toolUsed (String)
- fileSize (Int)
- timestamp (DateTime, @default(now()))
- user (Users @relation)
```

## Configuration Files

### Tailwind Config (`tailwind.config.ts`)
- Custom color scheme (surface, panel, accent)
- Responsive breakpoints
- Content paths

### TypeScript Config (`tsconfig.json`)
- Path aliases (@/*)
- Strict mode enabled
- Target ES2020

### Next.js Config (`next.config.mjs`)
- React Strict Mode
- Server Actions configuration

### Prisma Schema (`prisma/schema.prisma`)
- PostgreSQL provider
- Database models
- Relations

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection
- `JWT_SECRET` - Token signing secret

### Optional
- `AWS_ACCESS_KEY_ID` - AWS credentials
- `AWS_SECRET_ACCESS_KEY` - AWS secret
- `AWS_REGION` - AWS region
- `AWS_S3_BUCKET` - S3 bucket
- `CLOUDINARY_CLOUD_NAME` - Cloudinary name
- `CLOUDINARY_API_KEY` - Cloudinary key
- `CLOUDINARY_API_SECRET` - Cloudinary secret
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID` - AdSense ID
- `NEXT_PUBLIC_SITE_URL` - Site URL

## Development Workflow

1. Make code changes
2. Test with `npm run dev`
3. Lint with `npm run lint`
4. Build with `npm run build`
5. Deploy to production

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on all endpoints
- File type/size validation
- Protected routes via middleware
- Automatic file cleanup
- Secure cookie handling
