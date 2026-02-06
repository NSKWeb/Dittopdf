# Dittopdf - Complete PDF Tool Suite

A production-ready SaaS platform with 16 core PDF tools, user authentication, file storage, and monetization.

## Features

### 16 PDF Tools

**Basic Tools:**
- Merge PDFs - Combine multiple files into one
- Split PDF - Extract pages or ranges
- Compress PDF - Reduce file size
- Rotate PDF - Rotate pages by 90°/180°/270°

**Conversion Tools:**
- PDF to Office - Convert to Word, Excel, PowerPoint
- PDF to Images - Export as JPG or PNG
- Images to PDF - Convert JPG/PNG to PDF
- PDF to Text - Extract text from PDFs

**Security Tools:**
- Password Protect PDF - Encrypt with password
- Remove Password - Remove password protection
- Text Watermark - Add text watermark
- Image Watermark - Add image/logo watermark
- Text Annotations - Add notes and highlights

**Advanced Tools:**
- Extract Pages - Pull specific pages
- Extract Images - Download embedded images
- Edit Metadata - Edit title, author, subject

### Core Features

- ✅ User authentication with JWT
- ✅ File upload with validation (max 25MB)
- ✅ Multiple storage options (Local, AWS S3, Cloudinary)
- ✅ Usage tracking and analytics
- ✅ Free and Pro plan tiers
- ✅ Daily usage limits (5 files/day for free users)
- ✅ Responsive dark theme design
- ✅ Google AdSense integration
- ✅ Rate limiting for API endpoints
- ✅ Secure file handling with auto-cleanup

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.4
- **Database:** PostgreSQL with Prisma ORM
- **PDF Processing:** pdf-lib
- **Authentication:** JWT with bcrypt
- **Storage:** AWS S3 / Cloudinary / Local

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dittopdf
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dittopdf
JWT_SECRET=your_secure_jwt_secret_here

# Storage (choose one or use local storage)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# OR Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AdSense (optional)
ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Set up the database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Users Table
- `id` - Unique identifier (CUID)
- `email` - User email (unique)
- `passwordHash` - Bcrypt hashed password
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp
- `usageCount` - Daily usage counter
- `lastResetDate` - Usage reset timestamp
- `planType` - User plan (Free/Pro)

### Files Table
- `id` - Unique identifier (CUID)
- `userId` - User who uploaded the file
- `originalFilename` - Original file name
- `processedFilename` - Processed file name
- `fileSize` - File size in bytes
- `toolUsed` - Tool that processed the file
- `status` - Processing status
- `createdAt` - Upload timestamp

### UsageLogs Table
- `id` - Unique identifier (CUID)
- `userId` - User who used the tool
- `toolUsed` - Tool that was used
- `fileSize` - Processed file size
- `timestamp` - Usage timestamp

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Tools
- `POST /api/tools/[tool]` - Process PDF with tool

### Files
- `POST /api/files/upload` - Upload file
- `GET /api/files/history` - Get user file history

### Dashboard
- `GET /api/dashboard/overview` - Get dashboard stats

### User
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update user profile

## Usage Limits

### Free Plan
- 5 files per day
- Max 25MB file size
- Files deleted after 1 hour

### Pro Plan
- Unlimited files
- Max 25MB file size
- Files deleted after 1 hour

## Deployment

### Build for production

```bash
npm run build
npm run start
```

### Environment Variables for Production

Make sure to set all required environment variables in your production environment:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secure secret for JWT signing
- Storage provider credentials (AWS S3 or Cloudinary)
- `NODE_ENV=production`

### Recommended Platforms

- Vercel (recommended for Next.js)
- Railway
- Render
- AWS (ECS, Elastic Beanstalk)

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token-based authentication
- Rate limiting on API endpoints
- File type and size validation
- Automatic file cleanup
- Protected routes with middleware
- CORS protection

## AdSense Integration

Google AdSense is integrated with placeholder components. To enable:

1. Set `ADSENSE_CLIENT_ID` in your environment variables
2. The ad slots will automatically load AdSense
3. Positions: header, sidebar, footer
4. Pro users can upgrade to remove ads

## Project Structure

```
dittopdf/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/         # API routes
│   │   ├── auth/        # Authentication pages
│   │   ├── dashboard/   # User dashboard
│   │   ├── tools/       # PDF tool pages
│   │   └── downloads/   # File downloads
│   ├── components/      # React components
│   └── lib/            # Utility libraries
├── prisma/
│   └── schema.prisma    # Database schema
├── public/              # Static assets
└── .env.example         # Environment variables template
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

### Adding New Tools

1. Add tool to `src/lib/tools.ts`
2. Implement tool logic in `src/lib/pdf-tools.ts`
3. Tool automatically becomes available at `/tools/[slug]`

## License

Copyright © 2024 Dittopdf. All rights reserved.

## Support

For issues, questions, or contributions, please contact the development team.
