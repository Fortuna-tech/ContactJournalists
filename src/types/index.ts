export type UserRole = "journalist" | "agency" | "founder";

export interface User {
  id: string;
  email: string;
  role?: UserRole;
  onboardingComplete: boolean;
  createdAt: string;
  subscriptionStatus?: string;
  planId?: string;
}

export interface JournalistProfile {
  userId: string;
  name: string; // Assuming name is stored in meta or we just use email part for now if not available
  press: string;
  linkedin: string;
  publisherProfile: string;
  xHandle: string;
  categories: string[];
  queryCount: number;
  isSaved?: boolean;
  email?: string;
}

export interface AgencyFounderProfile {
  userId: string;
  name: string;
  company: string;
  website: string;
  linkedin: string;
  xHandle: string;
  categories: string[];
  isSaved?: boolean;
  subscriptionStatus?: string;
  planId?: string;
}

export interface BillingAccount {
  id: string;
  profileId: string;
  planId: string | null;
  priceId: string | null;
  status: string;
  trialEndsAt?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
}

export interface SubscriptionStatus {
  plan: string;
  status: string;
  maxPitches: number;
  remainingPitches: number;
  maxPitchGen: number;
  remainingPitchGen: number;
  maxUsers: number;
  remainingUsers: number;
  maxContacts: number;
  remainingContacts: number;
}

export interface Category {
  id: string;
  title: string;
}

export interface Query {
  id: string;
  journalistId: string;
  title: string;
  description: string;
  categoryId: string;
  categoryTitle: string;
  datePosted: string;
  pitchCount: number;
  archivedAt?: string | null;
  deadline?: string | null;
  preferredContactMethod?: string | null;
  attachmentUrl?: string | null;
  journalist?: {
    email: string;
    website?: string | null;
    xHandle?: string | null;
  };
}

export interface Pitch {
  id: string;
  queryId: string;
  userId: string;
  content: string;
  status: "pending" | "responded" | "archived";
  createdAt: string;
  query?: Query;
  author?: AgencyFounderProfile;
}

export interface PitchComment {
  id: string;
  pitchId: string;
  userId: string;
  content: string;
  createdAt: string;
  author?: {
    name: string;
    role: UserRole;
    company?: string;
  };
}

export interface MediaList {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  memberCount?: number;
}

export interface MediaListMember {
  id: string;
  listId: string;
  journalistId: string;
  createdAt: string;
}

export interface Affiliate {
  id: string;
  email: string;
  payoutLink?: string | null;
  code?: string | null;
  cutPercentage: number;
  status: "pending" | "active" | "banned";
  createdAt: string;
  updatedAt: string;
}
