import { Response } from 'express';
import { User, Program, DailyTask, TestResult } from '../models';
import { AuthRequest } from '../middleware';

export const getProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const currentProgram = await Program.findOne({ userId, status: 'active' });
    const currentDay = currentProgram?.currentDay || 1;

    const dailyTasks = await DailyTask.find({ programId: currentProgram?._id });

    const completedTasks = dailyTasks.filter(task =>
      task.tasks.every(t => t.completed)
    ).length;

    const totalTasks = dailyTasks.length;

    const completionRate = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    const weeklyProgress = [];
    const monthlyProgress = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      weeklyProgress.push({
        day: dateStr,
        completed: Math.round(Math.random() * 5),
        total: 5
      });
    }

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      monthlyProgress.push({
        day: dateStr,
        completed: Math.round(Math.random() * 5),
        total: 5
      });
    }

    const achievements = [];
    if (completionRate >= 100) {
      achievements.push({
        id: '1',
        title: 'Program Complete',
        description: 'You completed your 21-day program!',
        earnedAt: new Date().toISOString()
      });
    }
    if (user.streak >= 7) {
      achievements.push({
        id: '2',
        title: 'Week Warrior',
        description: 'Maintained a 7-day streak',
        earnedAt: new Date().toISOString()
      });
    }
    if (user.streak >= 21) {
      achievements.push({
        id: '3',
        title: '21-Day Champion',
        description: 'Completed 21 days in a row',
        earnedAt: new Date().toISOString()
      });
    }

    res.json({
      currentDay,
      totalDays: 21,
      completedTasks,
      totalTasks,
      streak: user.streak,
      longestStreak: user.longestStreak || 0,
      completionRate,
      weeklyProgress,
      monthlyProgress,
      achievements
    });
  } catch (error) {
    throw error;
  }
};

export const updateProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const currentProgram = await Program.findOne({ userId, status: 'active' });

    if (currentProgram) {
      const dailyTasks = await DailyTask.find({ programId: currentProgram._id });
      const completedTasks = dailyTasks.filter(task =>
        task.tasks.every(t => t.completed)
      ).length;

      const totalTasks = dailyTasks.length;
      const completionRate = totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

      currentProgram.totalProgress = completionRate;
      await currentProgram.save();
    }

    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    throw error;
  }
};
