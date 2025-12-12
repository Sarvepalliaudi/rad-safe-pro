
import { UserProfile, UserRole } from '../types';
import { getInitialProfile, logUserActivity } from './userService';

const USERS_DB_KEY = 'rad_safe_users_db';
const SESSION_KEY = 'rad_safe_session';

// Helper to simulate network delay for database connection
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// NOTE: Direct registration/login functions are removed/deprecated in UI favor of Google Login
// Keeping stubs for type safety if needed elsewhere, but logic moved to loginWithGoogle

export const loginWithGoogle = async (
  selectedRole: UserRole, 
  additionalData?: { studentId?: string; collegeName?: string; licenseId?: string }
): Promise<UserProfile> => {
  await delay(2000); // Simulate secure database handshake

  // 1. Simulate getting user info from Google
  const googleEmail = `user_${Math.floor(Math.random() * 1000)}@gmail.com`;
  const googleName = selectedRole === 'admin' ? "System Admin" : "Google User";
  
  // 2. Check internal DB for this Google User
  const usersStr = localStorage.getItem(USERS_DB_KEY);
  let users = usersStr ? JSON.parse(usersStr) : [];
  
  let userRecord = users.find((u: any) => u.email === googleEmail);
  let profile: UserProfile;

  if (userRecord) {
    // User exists in DB
    profile = userRecord.profile;
    
    // Update role and data on re-login (Crucial for role switching)
    profile.role = selectedRole; 
    if (additionalData) {
      profile.studentId = additionalData.studentId;
      profile.collegeName = additionalData.collegeName;
      profile.licenseId = additionalData.licenseId;
    }
    
    // SAVE UPDATES TO DB
    // We must update the record in the users array and save it back
    // (This was missing in the previous version)
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

  } else {
    // New Google User - Create DB Entry
    profile = {
      ...getInitialProfile(),
      id: 'google_' + Date.now(),
      email: googleEmail,
      name: googleName,
      role: selectedRole,
      isPro: true, // Google users get Pro perks
      ...additionalData
    };
    users.push({ email: googleEmail, googleId: profile.id, profile });
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    logUserActivity(profile.id, profile.name, profile.email, 'REGISTER');
  }

  // 3. Establish Session with STRICT EXPIRY
  // Admin: 15 minutes (Strict Re-auth), Others: 24 hours
  const expiryDuration = selectedRole === 'admin' ? 15 * 60 * 1000 : 24 * 60 * 60 * 1000;
  
  const sessionData = {
    profile,
    expiry: Date.now() + expiryDuration
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  
  // 4. Log the Login Event
  logUserActivity(profile.id, profile.name, profile.email, 'LOGIN');

  return profile;
};

export const logoutUser = () => {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (sessionStr) {
    try {
      const parsed = JSON.parse(sessionStr);
      const profile = parsed.profile || parsed;
      logUserActivity(profile.id, profile.name, profile.email, 'LOGOUT');
    } catch (e) {}
  }
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentSession = (): UserProfile | null => {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return null;

  try {
    const parsed = JSON.parse(sessionStr);

    // Handle Wrapped Session with Expiry
    if (parsed.profile && parsed.expiry) {
      if (Date.now() > parsed.expiry) {
        // Session Expired
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      return parsed.profile;
    }
    
    // Fallback for old session format
    return parsed;
  } catch (e) {
    return null;
  }
};
