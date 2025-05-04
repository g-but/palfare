# Components Directory

This directory contains all React components used in the OrangeCat application. Components are organized following atomic design principles and feature-based organization to maintain a clear and scalable structure.

## Directory Structure

```
components/
├── auth/             # Authentication-related components
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── AuthProvider.tsx
├── bitcoin/          # Bitcoin-specific components
│   ├── AddressDisplay.tsx
│   └── QRCode.tsx
├── dashboard/        # Dashboard components
│   ├── StatsCard.tsx
│   ├── ActivityFeed.tsx
│   └── FundingOverview.tsx
├── funding/          # Funding page components
│   ├── ProfileSection.tsx
│   ├── FundUsNavigation.tsx
│   ├── FundingPageList.tsx
│   ├── TransactionTracker.tsx
│   └── BalanceSummary.tsx
├── layout/           # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
├── profile/          # Profile-related components
│   ├── ProfileHeader.tsx
│   ├── ProfileForm.tsx
│   └── SocialLinks.tsx
├── sections/         # Page section components
│   ├── Hero.tsx
│   └── Features.tsx
├── transparency/     # Transparency-related components
│   └── TransparencyScore.tsx
├── ui/               # Reusable UI components (atoms)
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── IconButton.tsx
│   ├── Input.tsx
│   └── Modal.tsx
└── user/             # User-related components
    ├── Avatar.tsx
    └── UserMenu.tsx
```

## Component Architecture

The project follows atomic design principles:

1. **Atoms**: Basic building blocks (buttons, inputs, etc.)
   - Located in `ui/` directory
   - Highly reusable
   - Minimal dependencies

2. **Molecules**: Groups of atoms bonded together
   - Located in feature-specific directories
   - Form distinct sections of interfaces
   - Examples: `TransparencyScore`, `ProfileSection`

3. **Organisms**: Groups of molecules joined together
   - Form complete sections of pages
   - Examples: `FundingPageList`, `TransactionTracker`

## Component Guidelines

1. **Naming Convention**
   - Use PascalCase for component names
   - Suffix with `.tsx` for TypeScript React components
   - Use descriptive names that reflect the component's purpose
   - Follow the pattern: `[Feature][ComponentType].tsx`

2. **Props**
   - Define all props using TypeScript interfaces
   - Use meaningful prop names
   - Document required and optional props
   - Provide default values where appropriate
   - Use proper typing for all props

3. **Styling**
   - Use Tailwind CSS for styling
   - Follow the design system guidelines
   - Ensure responsive design
   - Maintain accessibility standards
   - Use consistent spacing and color variables

4. **State Management**
   - Use React hooks for local state
   - Use context for global state
   - Implement proper loading and error states
   - Follow React hooks rules

5. **Documentation**
   - Include JSDoc comments for component props
   - Document usage examples
   - Note any dependencies or requirements
   - Include TypeScript interfaces

## Best Practices

- Keep components small and focused on a single responsibility
- Use composition over inheritance
- Implement proper error handling
- Use proper TypeScript typing
- Maintain consistent code style
- Follow the project's ESLint and Prettier configuration
- Use proper testing with React Testing Library
- Implement proper accessibility features
- Use proper semantic HTML
- Follow responsive design principles

## Testing

Each component should have corresponding test files:
- Unit tests for component logic
- Integration tests for component interactions
- Accessibility tests
- Visual regression tests (where applicable)

## Accessibility

- Use proper ARIA attributes
- Ensure keyboard navigation
- Maintain proper focus management
- Use semantic HTML elements
- Ensure proper color contrast
- Support screen readers

## Performance

- Implement proper code splitting
- Use React.memo when necessary
- Optimize re-renders
- Use proper image optimization
- Implement proper loading states
- Use proper error boundaries 