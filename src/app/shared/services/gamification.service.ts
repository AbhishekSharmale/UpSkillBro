import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserStats {
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  totalPoints: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

@Injectable({
  providedIn: 'root'
})
export class GamificationService {
  private userStats = new BehaviorSubject<UserStats>({
    level: 5,
    xp: 1250,
    xpToNext: 1500,
    streak: 12,
    totalPoints: 8450,
    achievements: [
      { id: '1', title: 'First Steps', description: 'Complete your first lesson', icon: '🎯', unlocked: true, unlockedAt: new Date(), rarity: 'common' },
      { id: '2', title: 'Streak Master', description: '10 day learning streak', icon: '🔥', unlocked: true, unlockedAt: new Date(), rarity: 'rare' },
      { id: '3', title: 'Code Warrior', description: 'Complete 50 coding challenges', icon: '⚔️', unlocked: true, unlockedAt: new Date(), rarity: 'epic' },
      { id: '4', title: 'Mentor', description: 'Help 10 community members', icon: '👨‍🏫', unlocked: false, rarity: 'legendary' }
    ]
  });

  userStats$ = this.userStats.asObservable();

  addXP(amount: number) {
    const current = this.userStats.value;
    const newXP = current.xp + amount;
    const newLevel = Math.floor(newXP / 250) + 1;
    
    this.userStats.next({
      ...current,
      xp: newXP,
      level: newLevel,
      xpToNext: (newLevel * 250) - newXP,
      totalPoints: current.totalPoints + amount
    });
  }

  updateStreak(days: number) {
    const current = this.userStats.value;
    this.userStats.next({ ...current, streak: days });
  }

  unlockAchievement(id: string) {
    const current = this.userStats.value;
    const achievements = current.achievements.map(a => 
      a.id === id ? { ...a, unlocked: true, unlockedAt: new Date() } : a
    );
    this.userStats.next({ ...current, achievements });
  }

  getCurrentStats(): UserStats {
    return this.userStats.value;
  }
}