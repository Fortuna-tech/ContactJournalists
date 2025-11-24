# Contact Journalists

A platform connecting journalists with founders and PR agencies for story pitches and source requests.

## Overview

Contact Journalists is a two-sided marketplace platform that enables:

- **Journalists** to post story requests and receive pitches from founders/agencies
- **Founders/Agencies** to discover journalists, submit pitches, and manage media contacts
- **AI-powered pitch generation** for creating compelling press pitches

## Routes & Pages

### Public Routes

- `/` - Landing page
- `/auth` - Authentication (Supabase Auth)
- `/auth/callback` - OAuth callback handler
- `/onboarding` - User onboarding flow (role selection, profile setup, pricing)
- `/profile/:id` - Public user profile view
- `/blog/how-to-get-press-for-your-brand-without-a-pr-agency` - Blog post
- `/affiliate` - Affiliate program page
- `*` - 404 Not Found page

### Founder/Agency Routes (`/feed/*`)

Protected by `BillingGuard` - requires active subscription.

- `/feed` - Main feed showing journalist story requests
- `/feed/:queryId` - Detailed view of a journalist's story request with pitches
- `/feed/find-journalists` - Search and browse journalist directory
- `/feed/pitch-generator` - AI-powered press pitch generator
- `/feed/media-lists` - Create and manage custom media lists
- `/feed/saved-contacts` - Saved journalist contacts
- `/feed/activity` - View all submitted pitches and their status
- `/feed/settings` - Profile and account settings
- `/feed/help` - Help documentation

### Journalist Routes (`/journalist/*`)

Free access - no subscription required.

- `/journalist` or `/journalist/dashboard` - Journalist dashboard with active requests and suggested sources
- `/journalist/requests` - List all story requests (active/archived)
- `/journalist/requests/new` - Create a new story request
- `/journalist/requests/:id` - View request details with pitches and comments
- `/journalist/saved-sources` - Saved founder/agency contacts
- `/journalist/settings` - Profile and account settings
- `/journalist/help` - Help documentation

## Features

### Authentication & Onboarding

- **Supabase Auth**: Email/password and OAuth providers
- **Role Selection**: Choose between Journalist, PR Agency, or Founder
- **Profile Setup**:
  - Journalists: Publication name, publisher profile link, LinkedIn, X handle, categories
  - Founders/Agencies: Company name, website, LinkedIn, X handle, categories
- **Pricing Selection**: Three-tier subscription plans (Starter, Growth, Team) for founders/agencies

### Founder/Agency Features

#### Story Request Feed (`/feed`)

- Browse active journalist story requests
- Filter by category
- View request details: title, description, deadline, preferred contact method
- Submit pitches directly to requests
- View pitch count per request

#### Find Journalists (`/feed/find-journalists`)

- Search journalists by publication name
- Filter by category (Technology, Business, Finance, Healthcare, Lifestyle)
- View journalist profiles: name, publication, categories, query count
- Save contacts for future reference
- Navigate to journalist's requests

#### AI Press Pitch Generator (`/feed/pitch-generator`)

- Generate professional press pitches using OpenAI GPT-5
- Input fields: beat/topic, business info, website URL, additional context
- Website content fetching via OpenAI function calling
- Generates subject line and email body
- Copy individual sections or full pitch
- Editable output before copying

#### Media Lists (`/feed/media-lists`)

- Create custom media lists for organizing contacts
- Add/remove journalists from lists
- View list member count
- Manage multiple lists

#### Saved Contacts (`/feed/saved-contacts`)

- Quick access to saved journalists
- View contact details and recent activity
- Remove saved contacts

#### My Activity (`/feed/activity`)

- View all submitted pitches
- Track pitch status: pending, responded, archived
- See associated query/journalist info
- Copy pitch content
- Open external contact methods (email, X DM, website)
- Filter by status

#### Billing & Subscriptions

- Three subscription tiers:
  - **Starter**: $45/mo or $450/yr - 200 pitches/month, 1 user, daily pitch generator sample
  - **Growth**: $99/mo or $990/yr - 800 pitches/month, up to 3 users, full pitch generator
  - **Team**: $199/mo or $1990/yr - Unlimited pitches, up to 10 users, priority support
- Stripe Checkout integration
- Billing account management
- Subscription status tracking

### Journalist Features

#### Dashboard (`/journalist/dashboard`)

- Overview of active story requests (latest 3)
- Quick actions: Create request, View submissions, Saved sources
- Suggested sources based on journalist's categories
- Archive/delete requests

#### Story Requests (`/journalist/requests`)

- Create new requests with:
  - Title and description
  - Category selection
  - Optional deadline
  - Preferred contact method (email, X DM, website)
  - Optional attachment URL
- View all requests (active and archived)
- Filter by status (all/open/closed)
- Archive or delete requests
- View pitch count per request

#### Request Details (`/journalist/requests/:id`)

- Full request information
- List of all pitches submitted
- Pitch comments thread
- Pitch status management
- View pitch author profiles
- Respond to pitches via comments

#### Saved Sources (`/journalist/saved-sources`)

- Save founder/agency contacts
- View saved source profiles
- Category-based suggestions
- Remove saved sources

### Shared Features

#### Pitch System

- Submit pitches to journalist requests
- Pitch status tracking: pending → responded → archived
- Pitch comments for communication
- Email notifications via Resend API
- View pitch history

#### Comments System

- Comment threads on pitches
- Real-time notifications
- Author identification (journalist/founder/agency)

#### Categories

- Predefined categories: Technology, Business, Healthcare, Finance, Marketing, Lifestyle, Entertainment, Sports, Politics, Science
- Category-based filtering and matching
- Dynamic category creation support

#### Profile Management

- Update profile information
- Manage categories
- View public profiles

## Technical Stack

### Frontend

- **Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite 5.4
- **Routing**: React Router DOM 6.30
- **State Management**: TanStack Query (React Query) 5.83
- **UI Components**:
  - Radix UI primitives
  - shadcn/ui components
  - Tailwind CSS 3.4
- **Form Handling**: React Hook Form 7.61 + Zod 3.25
- **Icons**: Lucide React 0.462
- **Notifications**: Sonner 1.7 + Radix Toast

### Backend

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Edge Functions**: Deno runtime
  - `generate-pitch`: OpenAI GPT-5 integration for pitch generation
  - `notify-pitch`: Email notifications via Resend API
  - `create-checkout-session`: Stripe Checkout session creation
- **Storage**: Supabase Storage (for attachments)

### External Services

- **OpenAI API**: GPT-5 for pitch generation
- **Stripe**: Payment processing and subscription management
- **Resend**: Email delivery service

## Database Schema

### Core Tables

#### `profiles`

- User profile information
- Fields: `id`, `role` (journalist/agency/founder), `full_name`, `press`, `company`, `website`, `linkedin`, `x_handle`, `categories` (array), `meta` (JSONB), `onboarding_complete`
- RLS policies for data access

#### `queries`

- Journalist story requests
- Fields: `id`, `journalist_id`, `title`, `description`, `category_id`, `deadline`, `preferred_contact_method`, `attachment_url`, `archived_at`, `pitch_count`
- Soft delete via `archived_at`

#### `pitches`

- Pitches submitted by founders/agencies
- Fields: `id`, `query_id`, `user_id`, `content`, `status` (pending/responded/archived), `created_at`
- Linked to queries and users

#### `pitch_comments`

- Comments on pitches
- Fields: `id`, `pitch_id`, `user_id`, `content`, `created_at`
- Enables communication between journalists and pitchers

#### `categories`

- Story categories
- Fields: `id`, `title`
- Normalized IDs for consistency

#### `saved_contacts`

- Founders saving journalists
- Fields: `id`, `user_id`, `journalist_id`, `created_at`
- Many-to-many relationship

#### `saved_sources`

- Journalists saving founders/agencies
- Fields: `id`, `journalist_id`, `source_id`, `created_at`
- Reverse relationship

#### `media_lists`

- Custom media lists for founders
- Fields: `id`, `user_id`, `name`, `created_at`

#### `media_list_members`

- Journalists in media lists
- Fields: `id`, `list_id`, `journalist_id`, `created_at`

#### `billing_accounts`

- Subscription and billing information
- Fields: `id`, `profile_id`, `plan_id`, `price_id`, `subscription_status`, `stripe_customer_id`, `trial_ends_at`, `current_period_end`, `cancel_at_period_end`

### Database Features

- Row Level Security (RLS) policies
- Database triggers for pitch count updates
- Foreign key constraints
- Indexes on frequently queried fields

## Edge Functions

### `generate-pitch`

**Location**: `supabase/functions/generate-pitch/`

Generates AI-powered press pitches using OpenAI GPT-5.

**Input**:

- `beat`: Target topic or beat
- `businessInfo`: Business/story information
- `websiteUrl`: Optional website URL for context
- `additionalInfo`: Additional context

**Process**:

1. Validates OpenAI API key
2. Uses OpenAI function calling to fetch website content if URL provided
3. Generates pitch following structured email template
4. Returns JSON with `subject` and `body` fields

**Model**: GPT-5 (`gpt-5-chat-latest`)

### `notify-pitch`

**Location**: `supabase/functions/notify-pitch/`

Sends email notifications for platform events.

**Event Types**:

- `new_query`: New story request created
- `new_pitch`: New pitch submitted
- `new_comment`: New comment on pitch

**Process**:

1. Validates authentication
2. Fetches relevant data from database
3. Generates HTML email templates
4. Sends via Resend API
5. Respects user email preferences

**Email Service**: Resend API

### `create-checkout-session`

**Location**: `supabase/functions/create-checkout-session/`

Creates Stripe Checkout sessions for subscriptions.

**Input**:

- `priceId`: Stripe price ID
- `customerEmail`: User email
- `successUrl`: Redirect URL after success
- `cancelUrl`: Redirect URL on cancel

**Process**:

1. Validates user authentication
2. Creates or retrieves Stripe customer
3. Creates checkout session
4. Returns session URL

**Payment Provider**: Stripe

## API Layer

### Main API File: `src/lib/api.ts`

Comprehensive API wrapper around Supabase client with typed functions:

- **Profile APIs**: `getProfile()`, `updateProfile()`, `getProfileById()`, `searchJournalists()`
- **Query APIs**: `getQueries()`, `getQuery()`, `getMyQueries()`, `createQuery()`, `updateQuery()`, `archiveQuery()`, `deleteQuery()`
- **Pitch APIs**: `getPitchesForQuery()`, `getMyPitches()`, `createPitch()`, `updatePitchStatus()`
- **Comment APIs**: `getPitchComments()`, `createPitchComment()`
- **Contact APIs**: `saveContact()`, `removeSavedContact()`, `getSavedContacts()`, `getSavedContactIds()`
- **Source APIs**: `saveSource()`, `removeSavedSource()`, `getSavedSources()`, `getSuggestedSources()`
- **Media List APIs**: `getMediaLists()`, `createMediaList()`, `deleteMediaList()`, `addJournalistToMediaList()`, `removeJournalistFromMediaList()`, `getMediaListMembers()`
- **Category APIs**: `getCategories()`, `createCategory()`
- **Billing APIs**: `getBillingAccount()`, `createCheckoutSession()`

All functions handle authentication, error handling, and data transformation.

## Authentication Flow

1. User visits `/auth` or protected route
2. Supabase Auth handles login/signup
3. OAuth callback processed at `/auth/callback`
4. If new user or incomplete profile → `/onboarding`
5. Journalists → `/journalist/dashboard`
6. Founders/Agencies → `/feed` (with billing check)

## Billing Flow

1. Founder/Agency completes onboarding
2. Redirected to `/onboarding?step=plan` for pricing selection
3. Selects plan (Starter/Growth/Team) and billing period (monthly/annual)
4. `createCheckoutSession` creates Stripe session
5. User redirected to Stripe Checkout
6. On success, redirected to `/feed?session_id={CHECKOUT_SESSION_ID}`
7. `BillingGuard` component checks subscription status on protected routes
8. Subscription status stored in `billing_accounts` table

## Environment Variables

Required environment variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key (for edge function)
RESEND_API_KEY=your_resend_api_key (for edge function)
STRIPE_SECRET_KEY=your_stripe_secret_key (for edge function)
APP_URL=your_app_url (for email links)
```

## Development

### Setup

```bash
bun install
```

### Run Development Server

```bash
bun run dev
```

### Database Migrations

```bash
bun run supabase:migrate
bun run supabase:migrate:new <migration_name>
```

### Deploy Edge Functions

```bash
bun run supabase:functions:deploy <function_name>
```

## Project Structure

```
src/
├── components/          # React components
│   ├── billing/        # Billing-related components
│   ├── categories/     # Category selection components
│   ├── feed/           # Feed and query components
│   ├── journalist/     # Journalist-specific components
│   ├── onboarding/     # Onboarding components
│   ├── sidebars/       # Navigation sidebars
│   └── ui/             # shadcn/ui components
├── config/             # Configuration files
├── hooks/               # Custom React hooks
├── layouts/             # Layout components
├── lib/                 # Utility libraries and API
├── pages/               # Page components
│   ├── founder/         # Founder/agency pages
│   └── journalist/      # Journalist pages
└── types/               # TypeScript type definitions

supabase/
├── functions/           # Edge functions
│   ├── create-checkout-session/
│   ├── generate-pitch/
│   └── notify-pitch/
└── migrations/          # Database migrations
```

## Key Features Summary

- ✅ Dual-sided marketplace (journalists ↔ founders/agencies)
- ✅ Story request system with pitches
- ✅ AI-powered pitch generation (OpenAI GPT-5)
- ✅ Email notifications (Resend)
- ✅ Subscription billing (Stripe)
- ✅ Media list management
- ✅ Saved contacts/sources
- ✅ Category-based filtering
- ✅ Comment threads on pitches
- ✅ Profile management
- ✅ Role-based access control
- ✅ Responsive UI with shadcn/ui
