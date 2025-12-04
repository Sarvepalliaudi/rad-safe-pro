
import { UserProfile, UserRole } from '../types';
import { getInitialProfile } from './userService';

const USERS_DB_KEY = 'rad_safe_users_db';
const SESSION_KEY = 'rad_safe_session';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const registerUser = async (email: string, password: string, name: string, role: UserRole): Promise<UserProfile> => {
  await delay(800); // Fake network loading
  
  const usersStr = localStorage.getItem(USERS_DB_KEY);
  const users = usersStr ? JSON.parse(usersStr) : [];

  // Check if user exists
  if (users.find((u: any) => u.email === email)) {
    throw new Error("User already exists with this email.");
  }

  // Create new profile based on role
  const baseProfile = getInitialProfile();
  const newProfile: UserProfile = {
    ...baseProfile,
    id: Date.now().toString(),
    email,
    name,
    role,
    isPro: false // Standard registration is not Pro
  };

  // Store user with password (In real app, hash this!)
  const newUserRecord = {
    email,
    password, 
    profile: newProfile
  };

  users.push(newUserRecord);
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  
  // Auto login
  localStorage.setItem(SESSION_KEY, JSON.stringify(newProfile));
  
  return newProfile;
};

export const loginUser = async (email: string, password: string): Promise<UserProfile> => {
  await delay(800);

  const usersStr = localStorage.getItem(USERS_DB_KEY);
  const users = usersStr ? JSON.parse(usersStr) : [];

  const user = users.find((u: any) => u.email === email && u.password === password);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(user.profile));
  return user.profile;
};

export const loginWithGoogle = async (): Promise<UserProfile> => {
  await delay(1500); // Simulate popup and OAuth

  // Mock a Google User - AUTO PRO STATUS for Hackathon demo
  const googleProfile: UserProfile = {
    ...getInitialProfile(),
    id: 'google_user_' + Date.now(),
    email: 'google_user@gmail.com',
    name: 'Google User',
    role: 'student',
    isPro: true // Google Users get Pro features (Image Gen)
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(googleProfile));
  return googleProfile;
};

export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentSession = (): UserProfile | null => {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  return sessionStr ? JSON.parse(sessionStr) : null;
};
