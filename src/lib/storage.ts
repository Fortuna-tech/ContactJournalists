import { User, JournalistProfile, AgencyFounderProfile, Query, Pitch } from '@/types';

const STORAGE_KEYS = {
  USERS: 'haro_users',
  JOURNALIST_PROFILES: 'haro_journalist_profiles',
  AGENCY_FOUNDER_PROFILES: 'haro_agency_founder_profiles',
  QUERIES: 'haro_queries',
  PITCHES: 'haro_pitches',
  CURRENT_USER: 'haro_current_user',
};

// Generic storage helpers
const getFromStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Users
export const getUsers = (): User[] => getFromStorage<User>(STORAGE_KEYS.USERS);
export const saveUser = (user: User): void => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  saveToStorage(STORAGE_KEYS.USERS, users);
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Journalist Profiles
export const getJournalistProfiles = (): JournalistProfile[] => 
  getFromStorage<JournalistProfile>(STORAGE_KEYS.JOURNALIST_PROFILES);

export const saveJournalistProfile = (profile: JournalistProfile): void => {
  const profiles = getJournalistProfiles();
  const index = profiles.findIndex(p => p.userId === profile.userId);
  if (index >= 0) {
    profiles[index] = profile;
  } else {
    profiles.push(profile);
  }
  saveToStorage(STORAGE_KEYS.JOURNALIST_PROFILES, profiles);
};

export const getJournalistProfile = (userId: string): JournalistProfile | undefined => {
  return getJournalistProfiles().find(p => p.userId === userId);
};

// Agency/Founder Profiles
export const getAgencyFounderProfiles = (): AgencyFounderProfile[] => 
  getFromStorage<AgencyFounderProfile>(STORAGE_KEYS.AGENCY_FOUNDER_PROFILES);

export const saveAgencyFounderProfile = (profile: AgencyFounderProfile): void => {
  const profiles = getAgencyFounderProfiles();
  const index = profiles.findIndex(p => p.userId === profile.userId);
  if (index >= 0) {
    profiles[index] = profile;
  } else {
    profiles.push(profile);
  }
  saveToStorage(STORAGE_KEYS.AGENCY_FOUNDER_PROFILES, profiles);
};

export const getAgencyFounderProfile = (userId: string): AgencyFounderProfile | undefined => {
  return getAgencyFounderProfiles().find(p => p.userId === userId);
};

// Queries
export const getQueries = (): Query[] => getFromStorage<Query>(STORAGE_KEYS.QUERIES);

export const saveQuery = (query: Query): void => {
  const queries = getQueries();
  const index = queries.findIndex(q => q.id === query.id);
  if (index >= 0) {
    queries[index] = query;
  } else {
    queries.push(query);
  }
  saveToStorage(STORAGE_KEYS.QUERIES, queries);
};

// Pitches
export const getPitches = (): Pitch[] => getFromStorage<Pitch>(STORAGE_KEYS.PITCHES);

export const savePitch = (pitch: Pitch): void => {
  const pitches = getPitches();
  const index = pitches.findIndex(p => p.id === pitch.id);
  if (index >= 0) {
    pitches[index] = pitch;
  } else {
    pitches.push(pitch);
  }
  saveToStorage(STORAGE_KEYS.PITCHES, pitches);
};

export const getPitchesForQuery = (queryId: string): Pitch[] => {
  return getPitches().filter(p => p.queryId === queryId);
};

export const getPitchesByUser = (userId: string): Pitch[] => {
  return getPitches().filter(p => p.userId === userId);
};
