# DittoPDF - Complete PDF Tool Suite

A comprehensive PDF tool suite with 16+ core tools, authentication, file storage, and ad monetization.

## Features

### 16+ PDF Tools
- **Merge PDF**: Combine multiple PDF files into one
- **Split PDF**: Split PDF into multiple files
- **Compress PDF**: Reduce PDF file size
- **PDF to Word**: Convert PDF to editable Word documents
- **PDF to Images**: Convert PDF pages to images
- **Images to PDF**: Convert images to PDF
- **Protect PDF**: Add password protection to PDF
- **Unlock PDF**: Remove password from PDF
- **Add Watermark**: Add text or image watermark
- **Add Text**: Add text annotations to PDF
- **Rotate PDF**: Rotate PDF pages
- **Extract Pages**: Extract specific pages from PDF
- **Edit Metadata**: Edit PDF document properties
- **Extract Text**: Extract text content from PDF
- **Extract Images**: Extract images from PDF
- **PDF to HTML**: Convert PDF to HTML

### User Authentication
- Email/password registration and login
- Google OAuth integration
- GitHub OAuth integration
- JWT-based authentication
- Password hashing with bcrypt
- Session management

### File Storage
- Local storage for development
- AWS S3 integration for production
- File upload and download
- File size limits and validation
- Automatic file cleanup

### Usage Tracking
- Track tool usage by user
- Rate limiting to prevent abuse
- Usage statistics and analytics
- Monthly usage limits

### Ad Monetization
- Google AdSense integration
- Ad impression tracking
- Ad click tracking
- Ad performance analytics

### User Dashboard
- Personal file management
- Usage statistics
- Account settings
- Billing and subscriptions
- API key management

### Security
- Rate limiting
- CSRF protection
- CORS configuration
- Secure cookie settings
- Input validation
- Audit logging

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: Tailwind CSS, Radix UI, Lucide Icons
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **File Storage**: AWS S3 or local storage
- **PDF Processing**: pdf-lib
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation
- **Analytics**: Google Analytics, Speed Insights
- **Monetization**: Google AdSense

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/dittopdf.git
cd dittopdf
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
# or
pnpm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t dittopdf .
docker run -p 3000:3000 dittopdf
```

### AWS/Other Cloud Providers
Follow standard Next.js deployment procedures for your cloud provider.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### PDF Tools
- `POST /api/pdf/merge` - Merge PDF files
- `POST /api/pdf/split` - Split PDF file
- `POST /api/pdf/compress` - Compress PDF file
- `POST /api/pdf/protect` - Protect PDF with password
- `POST /api/pdf/unlock` - Remove PDF password
- `POST /api/pdf/watermark` - Add watermark to PDF

### Usage Tracking
- `POST /api/usage/track` - Track tool usage

### File Management
- `POST /api/files/upload` - Upload file
- `GET /api/files/:key` - Download file
- `DELETE /api/files/:key` - Delete file

## Project Structure

```
src/
├── app/                  # Next.js app router
│   ├── api/               # API endpoints
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── tools/             # PDF tool pages
│   └── ...
├── components/           # Reusable UI components
├── context/              # React context providers
├── lib/                  # Utility functions
├── services/             # Business logic
├── types/                # TypeScript types
├── config/               # Configuration files
├── constants/            # App constants
├── middleware/           # Next.js middleware
├── prisma/               # Prisma schema
└── ...
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact us at support@dittopdf.com or visit our [contact page](https://dittopdf.com/contact).

## Roadmap

- [x] Core PDF tools (16 tools)
- [x] User authentication
- [x] File storage and management
- [x] Usage tracking and rate limiting
- [x] Ad monetization
- [x] User dashboard
- [ ] Advanced OCR capabilities
- [ ] Team collaboration features
- [ ] Mobile applications
- [ ] Desktop applications
- [ ] Browser extensions

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

## Security

If you discover any security vulnerabilities, please email security@dittopdf.com instead of using the issue tracker.

## Acknowledgements

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [pdf-lib](https://pdf-lib.js.org/) - PDF manipulation library
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js

## Contact

- Website: [https://dittopdf.com](https://dittopdf.com)
- Email: support@dittopdf.com
- Twitter: [@dittopdf](https://twitter.com/dittopdf)
- Facebook: [DittoPDF](https://facebook.com/dittopdf)
- LinkedIn: [DittoPDF](https://linkedin.com/company/dittopdf)