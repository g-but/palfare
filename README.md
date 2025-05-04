# OrangeCat - Transparent Bitcoin Crowdfunding Platform

A modern, transparent crowdfunding platform built with Next.js and Supabase, focused on Bitcoin donations and full transparency.

## Features

- **Transparent Funding**
  - Real-time transaction tracking
  - Public blockchain verification
  - Transparency score system
  - Detailed financial reporting

- **User Features**
  - Secure authentication
  - Profile management
  - Campaign creation and management
  - Real-time donation tracking

- **Bitcoin Integration**
  - Native Bitcoin address support
  - QR code generation
  - Transaction verification
  - Balance tracking

- **Transparency Tools**
  - Public transaction history
  - Financial accountability metrics
  - Mission progress tracking
  - Regular progress reports

## Tech Stack

- **Frontend**: 
  - Next.js 14 (App Router)
  - React 18
  - TypeScript
  - Tailwind CSS
  - Framer Motion

- **Backend**: 
  - Supabase (PostgreSQL)
  - Row Level Security
  - Real-time subscriptions

- **Authentication**: 
  - Supabase Auth
  - Session management
  - Role-based access control

- **Database**: 
  - PostgreSQL
  - Row Level Security
  - Real-time subscriptions

## Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── api/          # API routes
│   ├── auth/         # Authentication pages
│   ├── dashboard/    # Dashboard pages
│   ├── fund-us/      # Funding pages
│   └── profile/      # Profile pages
├── components/       # React components
│   ├── auth/         # Auth components
│   ├── bitcoin/      # Bitcoin components
│   ├── funding/      # Funding components
│   ├── transparency/ # Transparency components
│   └── ui/           # UI components
├── contexts/         # React contexts
├── hooks/            # Custom hooks
├── lib/              # Utility functions
├── services/         # API services
├── types/            # TypeScript types
└── utils/            # Helper functions
```

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/orangecat.git
   cd orangecat
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

## Development

### Database Setup

1. Set up Supabase project
2. Run migrations:
   ```bash
   npx supabase db push
   ```

3. Generate types:
   ```bash
   npx supabase gen types typescript --project-id your-project-id --schema public > src/types/database.ts
   ```

### Component Development

- Follow atomic design principles
- Use TypeScript for type safety
- Implement proper testing
- Follow accessibility guidelines
- Use Tailwind CSS for styling

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- path/to/test.tsx
```

### Refactoring
We are currently undergoing a major refactor to implement a feature-first structure. Please review:
- [Refactoring Guidelines](docs/REFACTOR-GUIDELINES.md)
- [Refactoring Rules](docs/REFACTOR-RULES.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### Commit Guidelines

- Use conventional commits
- Include descriptive messages
- Reference issues when applicable

### Code Review Process

1. Create PR with clear description
2. Ensure tests pass
3. Address review comments
4. Get approval from maintainers
5. Merge to main branch

## License

MIT License - see [LICENSE](LICENSE) for details
