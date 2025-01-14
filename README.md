# QEDIT Website

This is the official website for QEDIT, a company specializing in Zero-Knowledge-Proofs (ZKP) and privacy-enhancing technology solutions for enterprises. The website is built using Next.js 15 with TypeScript and Tailwind CSS.

## Overview

QEDIT provides privacy-enhancing technology solutions that enable secure data collaborations and business analytics. The website showcases QEDIT's expertise in:

- Zero-Knowledge Proofs (ZKP)
- Privacy-Enhancing Technology (PET)
- Blockchain Privacy Solutions
- Central Bank Digital Currency (CBDC)
- Asset Transfer Systems

## Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: Markdown with gray-matter
- **Markdown Processing**: marked
- **Font**: Red Hat Text

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js app directory
├── components/            # Reusable React components
├── content/              # Markdown content files
│   ├── blog/            # Blog posts
│   ├── pages/           # Static page content
│   └── press-releases/  # Press releases
├── lib/                 # Utility functions
└── types/               # TypeScript type definitions
```

## Content Management

The website uses Markdown files for content management. Content is organized into several categories:

- **Pages**: Static page content in `src/content/pages/`
- **Blog Posts**: Blog articles in `src/content/blog/`
- **Press Releases**: News and press releases in `src/content/press-releases/`

Each Markdown file includes frontmatter for metadata and content organization.

## Development Features

- **Turbopack**: Enabled for faster development experience
- **TypeScript**: Strict type checking enabled
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Image Optimization**: Next.js Image component with automatic optimization
- **SEO**: Built-in metadata optimization
- **Content Processing**: Markdown processing with gray-matter and marked

## Deployment

The site is configured for deployment on Vercel. For deployment details, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:
```bash
# Required environment variables
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional environment variables
NEXT_PUBLIC_GA_ID=YOUR_GOOGLE_ANALYTICS_ID
NEXT_PUBLIC_WEB3FORMS_KEY=YOUR_WEB3FORMS_API_KEY 
```

## Browser Support

The website supports the following browsers:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Testing

Run the test suite:
```bash
npm run test
```

Run tests in watch mode during development:
```bash
npm run test:watch
```
## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Proprietary - All rights reserved by QEDIT.

## Contact

For more information about QEDIT, visit [qed-it.com](https://qed-it.com) or reach out through the contact form on the website.