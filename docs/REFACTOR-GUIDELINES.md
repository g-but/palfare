# Refactoring Guidelines

## MVP Scope: Profiles Only

### High-Level Goals
- Focus on individual user profiles (display_name, bio, avatar_url)
- Defer organizations, projects, and wallet integration
- Keep authentication simple (email/password via Supabase)
- Maintain clean, maintainable code structure

### Final Directory Layout
```
src/
├── features/
│   ├── auth/
│   │   ├── AuthContext.tsx
│   │   ├── hooks.ts
│   │   └── types.ts
│   ├── profile/
│   │   ├── components/
│   │   │   └── ProfileForm.tsx
│   │   ├── hooks.ts
│   │   ├── service.ts
│   │   └── types.ts
│   └── bitcoin/
│       ├── hooks.ts
│       └── types.ts
└── app/
    └── profile/
        └── page.tsx
```

### Database Migration
- Slim down profiles table to essential fields:
  - id (uuid, primary key)
  - user_id (uuid, foreign key)
  - display_name (text, not null)
  - bio (text, nullable)
  - avatar_url (text, nullable)
  - created_at (timestamp)
  - updated_at (timestamp)
- RLS Policies:
  - Public read access
  - User-only updates
  - Index on display_name for performance

### Migration Script Usage
1. **Dry Run**
   ```bash
   npm run migrate:features:dry-run
   ```
   - Reviews all proposed file moves
   - Shows import path updates
   - No changes are made

2. **Interactive Confirmation**
   - Review proposed changes
   - Confirm with 'y' to proceed
   - 'n' to abort

3. **Real Run**
   ```bash
   npm run migrate:features
   ```
   - Executes file moves
   - Updates import paths
   - Preserves git history

### Frontend Scaffold
1. **Profile Page** (`src/app/profile/page.tsx`)
   - Client-side component
   - Uses AuthContext for user state
   - Renders ProfileForm

2. **Profile Hook** (`src/features/profile/hooks.ts`)
   - Unified useProfile hook
   - Handles loading/error states
   - Manages profile updates

3. **Profile Form** (`src/features/profile/components/ProfileForm.tsx`)
   - React Hook Form + Zod validation
   - Fields: display_name, bio, avatar_url
   - Loading states and error handling

### Testing Requirements
1. **Hook Tests** (`src/features/profile/__tests__/hooks.test.ts`)
   ```typescript
   describe('useProfile', () => {
     it('fetches profile data', () => {})
     it('handles loading state', () => {})
     it('updates profile', () => {})
     it('handles errors', () => {})
   })
   ```

2. **Form Tests** (`src/features/profile/__tests__/ProfileForm.test.tsx`)
   ```typescript
   describe('ProfileForm', () => {
     it('renders form fields', () => {})
     it('validates input', () => {})
     it('submits form data', () => {})
     it('shows loading state', () => {})
   })
   ``` 