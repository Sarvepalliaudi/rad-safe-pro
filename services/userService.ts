
import { UserProfile, QuizResult, Difficulty } from '../types';

const SESSION_KEY = 'rad_safe_session';
const USERS_DB_KEY = 'rad_safe_users_db';

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
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load user profile", e);
  }
  return getInitialProfile();
};

export const saveQuizResult = (
  score: number, 
  total: number, 
  category: any, 
  difficulty: Difficulty
): { profile: UserProfile, xpGained: number, leveledUp: boolean } => {
  
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

  // SAVE TO SESSION
  localStorage.setItem(SESSION_KEY, JSON.stringify(profile));

  // SYNC TO DB (So persistence works across logouts)
  // In a real app, this would be an API call
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
