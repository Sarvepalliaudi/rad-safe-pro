
import { UserProfile, QuizResult, Difficulty, ActivityLog } from '../types';

const SESSION_KEY = 'rad_safe_session_secure';
const USERS_DB_KEY = 'rad_safe_users_db_secure';
const LOGS_DB_KEY = 'rad_safe_activity_logs';

// Mock decryption for session persistence
const mockDecrypt = (str: string) => {
  try {
    return JSON.parse(atob(str));
  } catch (e) {
    return null;
  }
};
const mockEncrypt = (obj: any) => btoa(JSON.stringify(obj));

export const getInitialProfile = (): UserProfile => ({
  id: '',
  email: '',
  name: 'Scholar',
  role: 'student',
  isPro: false,
  level: 1,
  currentXp: 0,
  totalXp: 0,
  nextLevelXp: 100,
  quizzesTaken: 0,
  history: []
});

export const getUserProfile = (): UserProfile => {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (data) {
      const parsed = mockDecrypt(data);
      if (parsed && parsed.profile) {
        if (Date.now() > parsed.expiry) {
          localStorage.removeItem(SESSION_KEY);
          return getInitialProfile();
        }
        return parsed.profile;
      }
    }
  } catch (e) {}
  return getInitialProfile();
};

export const logUserActivity = (userId: string, userName: string, email: string, action: 'LOGIN' | 'LOGOUT' | 'REGISTER') => {
  try {
    const existingLogsStr = localStorage.getItem(LOGS_DB_KEY);
    const logs: ActivityLog[] = existingLogsStr ? JSON.parse(existingLogsStr) : [];
    const newLog: ActivityLog = {
      id: Date.now().toString() + Math.random().toString().slice(2, 5),
      userId, userName, email, action,
      timestamp: Date.now(),
      device: navigator.userAgent
    };
    logs.unshift(newLog);
    localStorage.setItem(LOGS_DB_KEY, JSON.stringify(logs.slice(0, 200)));
  } catch (e) {}
};

export const getActivityLogs = (): ActivityLog[] => {
  try {
    const str = localStorage.getItem(LOGS_DB_KEY);
    return str ? JSON.parse(str) : [];
  } catch (e) { return []; }
};

export const saveQuizResult = (
  score: number, 
  total: number, 
  category: any, 
  difficulty: Difficulty
): { profile: UserProfile, xpGained: number, leveledUp: boolean } => {
  
  const currentDataStr = localStorage.getItem(SESSION_KEY);
  let currentExpiry = Date.now() + 86400000;
  if (currentDataStr) {
    const parsed = mockDecrypt(currentDataStr);
    if (parsed?.expiry) currentExpiry = parsed.expiry;
  }

  const profile = getUserProfile();
  
  // Advanced XP Engine
  let diffMultiplier = 1;
  if (difficulty === 'Intermediate') diffMultiplier = 1.5;
  if (difficulty === 'Advanced') diffMultiplier = 2.5;

  // Question Count Marathon Bonus (Rewards longer study sessions)
  let countMultiplier = 1;
  if (total >= 10) countMultiplier = 2;
  if (total >= 25) countMultiplier = 5;
  if (total >= 50) countMultiplier = 10;

  const xpGained = Math.round(score * 10 * diffMultiplier * countMultiplier);
  
  profile.currentXp += xpGained;
  profile.totalXp += xpGained;
  profile.quizzesTaken += 1;
  
  const newResult: QuizResult = {
    id: Date.now().toString(),
    date: Date.now(),
    category, difficulty, score,
    totalQuestions: total,
    xpEarned: xpGained
  };

  profile.history.unshift(newResult);
  if (profile.history.length > 50) profile.history.pop();

  let leveledUp = false;
  while (profile.currentXp >= profile.nextLevelXp) {
    profile.currentXp -= profile.nextLevelXp;
    profile.level += 1;
    profile.nextLevelXp = Math.round(profile.nextLevelXp * 1.6); // Slightly harder levels
    leveledUp = true;
  }

  localStorage.setItem(SESSION_KEY, mockEncrypt({ profile, expiry: currentExpiry }));

  // Mock DB Sync
  const usersStr = localStorage.getItem(USERS_DB_KEY);
  if (usersStr) {
    const users = JSON.parse(usersStr);
    const index = users.findIndex((u: any) => {
      const p = mockDecrypt(u.encryptedProfile);
      return p?.email === profile.email;
    });
    if (index !== -1) {
      users[index].encryptedProfile = mockEncrypt(profile);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    }
  }
  
  return { profile, xpGained, leveledUp };
};
