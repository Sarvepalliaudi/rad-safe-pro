
import { UserProfile, QuizResult, Difficulty } from '../types';

const STORAGE_KEY = 'rad_safe_user_v1';

const getInitialProfile = (): UserProfile => ({
  name: 'Student',
  level: 1,
  currentXp: 0,
  totalXp: 0,
  nextLevelXp: 100,
  quizzesTaken: 0,
  history: []
});

export const getUserProfile = (): UserProfile => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
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
  // Base XP: 10 per correct answer
  // Multipliers: Beginner 1x, Intermediate 1.5x, Advanced 2.5x
  let multiplier = 1;
  if (difficulty === 'Intermediate') multiplier = 1.5;
  if (difficulty === 'Advanced') multiplier = 2.5;

  const xpGained = Math.round(score * 10 * multiplier);
  
  // Update Profile
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

  // Level Up Logic (Simple curve)
  // Level 1: 100, Level 2: 200, Level 3: 400, etc.
  let leveledUp = false;
  while (profile.currentXp >= profile.nextLevelXp) {
    profile.currentXp -= profile.nextLevelXp;
    profile.level += 1;
    profile.nextLevelXp = Math.round(profile.nextLevelXp * 1.5);
    leveledUp = true;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  
  return { profile, xpGained, leveledUp };
};

export const clearUserData = () => {
  localStorage.removeItem(STORAGE_KEY);
};
