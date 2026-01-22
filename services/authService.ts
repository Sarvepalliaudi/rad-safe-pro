
import { UserProfile, UserRole } from '../types';
import { getInitialProfile, logUserActivity } from './userService';

const USERS_DB_KEY = 'rad_safe_users_db_secure';
const SESSION_KEY = 'rad_safe_session_secure';

const mockHash = (str: string) => btoa(`sha256_${str}`).split('').reverse().join('');
const mockEncrypt = (obj: any) => btoa(JSON.stringify(obj));
const mockDecrypt = (str: string) => {
  try {
    return JSON.parse(atob(str));
  } catch (e) {
    return null;
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const loginAsPublicGuest = async (): Promise<UserProfile> => {
  const profile: UserProfile = {
    ...getInitialProfile(),
    id: 'guest_' + Date.now(),
    name: 'Public Guest',
    email: 'guest@radsafepro.edu',
    role: 'public',
    isPro: false
  };
  const sessionData = {
    profile,
    expiry: Date.now() + (2 * 60 * 60 * 1000) // 2 hour guest session
  };
  localStorage.setItem(SESSION_KEY, mockEncrypt(sessionData));
  logUserActivity(profile.id, profile.name, profile.email, 'LOGIN');
  return profile;
};

export const loginWithGoogle = async (
  selectedRole: UserRole, 
  additionalData?: { studentId?: string; collegeName?: string; licenseId?: string }
): Promise<UserProfile> => {
  await delay(1200); 

  const googleEmail = `user_${Math.floor(Math.random() * 1000)}@gmail.com`;
  const googleName = selectedRole === 'admin' ? "System Admin" : "User";
  const hashedEmail = mockHash(googleEmail);
  
  const usersStr = localStorage.getItem(USERS_DB_KEY);
  let users = usersStr ? JSON.parse(usersStr) : [];
  
  let userRecord = users.find((u: any) => u.emailHash === hashedEmail);
  let profile: UserProfile;

  if (userRecord) {
    profile = mockDecrypt(userRecord.encryptedProfile);
    profile.role = selectedRole; 
    if (additionalData) {
      profile.studentId = additionalData.studentId;
      profile.collegeName = additionalData.collegeName;
      profile.licenseId = additionalData.licenseId;
    }
    userRecord.encryptedProfile = mockEncrypt(profile);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } else {
    profile = {
      ...getInitialProfile(),
      id: 'google_' + mockHash(Date.now().toString()),
      email: googleEmail,
      name: googleName,
      role: selectedRole,
      isPro: true,
      ...additionalData
    };
    users.push({ 
      emailHash: hashedEmail, 
      encryptedProfile: mockEncrypt(profile) 
    });
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    logUserActivity(profile.id, profile.name, profile.email, 'REGISTER');
  }

  const expiryDuration = selectedRole === 'admin' ? 15 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const sessionData = {
    profile,
    expiry: Date.now() + expiryDuration
  };

  localStorage.setItem(SESSION_KEY, mockEncrypt(sessionData));
  logUserActivity(profile.id, profile.name, profile.email, 'LOGIN');
  return profile;
};

export const logoutUser = () => {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (sessionStr) {
    const parsed = mockDecrypt(sessionStr);
    if (parsed) {
      const profile = parsed.profile || parsed;
      logUserActivity(profile.id, profile.name, profile.email, 'LOGOUT');
    }
  }
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentSession = (): UserProfile | null => {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return null;
  const parsed = mockDecrypt(sessionStr);
  if (!parsed) return null;
  if (parsed.profile && parsed.expiry) {
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed.profile;
  }
  return parsed;
};
