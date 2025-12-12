
import { UserProfile, QuizResult, Difficulty, ActivityLog } from '../types';

const SESSION_KEY = 'rad_safe_session';
const USERS_DB_KEY = 'rad_safe_users_db';
const LOGS_DB_KEY = 'rad_safe_activity_logs';

export const getInitialProfile = (): UserProfile => ({
  id: '',
  email: '',
  name: 'Student',
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
      const parsed = JSON.parse(data);
      
      // Check for New Session Format { profile, expiry }
      if (parsed.profile && parsed.expiry) {
        // Enforce Expiry
        if (Date.now() > parsed.expiry) {
          console.warn("Session expired. Logging out.");
          localStorage.removeItem(SESSION_KEY);
          return getInitialProfile();
        }
        return parsed.profile;
      }
      
      return parsed; // Legacy format support
    }
  } catch (e) {
    console.error("Failed to load user profile", e);
  }
  return getInitialProfile();
};

// --- MONITORING / DATABASE SIMULATION ---

export const logUserActivity = (userId: string, userName: string, email: string, action: 'LOGIN' | 'LOGOUT' | 'REGISTER') => {
  try {
    const existingLogsStr = localStorage.getItem(LOGS_DB_KEY);
    const logs: ActivityLog[] = existingLogsStr ? JSON.parse(existingLogsStr) : [];
    
    const newLog: ActivityLog = {
      id: Date.now().toString() + Math.random().toString().slice(2, 5),
      userId,
      userName,
      email,
      action,
      timestamp: Date.now(),
      device: navigator.userAgent // Capture basic device info
    };

    // Add to top
    logs.unshift(newLog);
    
    // Limit to last 200 logs to prevent overflow in simulation
    const trimmedLogs = logs.slice(0, 200);
    
    localStorage.setItem(LOGS_DB_KEY, JSON.stringify(trimmedLogs));
  } catch (e) {
    console.error("Failed to log activity", e);
  }
};

export const getActivityLogs = (): ActivityLog[] => {
  try {
    const str = localStorage.getItem(LOGS_DB_KEY);
    return str ? JSON.parse(str) : [];
  } catch (e) {
    return [];
  }
};

export const saveQuizResult = (
  score: number, 
  total: number, 
  category: any, 
  difficulty: Difficulty
): { profile: UserProfile, xpGained: number, leveledUp: boolean } => {
  
  // Retrieve current session to preserve expiry time
  const currentDataStr = localStorage.getItem(SESSION_KEY);
  let currentExpiry = Date.now() + 86400000; // Default if not found
  
  if (currentDataStr) {
    try {
      const parsed = JSON.parse(currentDataStr);
      if (parsed.expiry) currentExpiry = parsed.expiry;
    } catch(e) {}
  }

  const profile = getUserProfile();
  
  // XP Calculation Logic
  let multiplier = 1;
  if (difficulty === 'Intermediate') multiplier = 1.5;
  if (difficulty === 'Advanced') multiplier = 2.5;

  const xpGained = Math.round(score * 10 * multiplier);
  
  // Update Profile Stats
  profile.currentXp += xpGained;
  profile.totalXp += xpGained;
  profile.quizzesTaken += 1;
  
  const newResult: QuizResult = {
    id: Date.now().toString(),
    date: Date.now(),
    category,
    difficulty,
    score,
    totalQuestions: total,
    xpEarned: xpGained
  };

  // Keep last 50 entries
  profile.history.unshift(newResult);
  if (profile.history.length > 50) profile.history.pop();

  // Level Up Logic
  let leveledUp = false;
  while (profile.currentXp >= profile.nextLevelXp) {
    profile.currentXp -= profile.nextLevelXp;
    profile.level += 1;
    profile.nextLevelXp = Math.round(profile.nextLevelXp * 1.5);
    leveledUp = true;
  }

  // SAVE TO SESSION (Wrapped with Expiry)
  const sessionData = {
    profile: profile,
    expiry: currentExpiry
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

  // SYNC TO DB (So persistence works across logouts)
  const usersStr = localStorage.getItem(USERS_DB_KEY);
  if (usersStr) {
    const users = JSON.parse(usersStr);
    const index = users.findIndex((u: any) => u.email === profile.email);
    if (index !== -1) {
      users[index].profile = profile;
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    }
  }
  
  return { profile, xpGained, leveledUp };
};
