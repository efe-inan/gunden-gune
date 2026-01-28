import { Response } from 'express';
import { User, Program, DailyTask } from '../models';
import { AuthRequest, AppError } from '../middleware';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId).select('-password')
      .populate('currentProgramId')
      .populate('completedPrograms');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({ user });
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    await User.findByIdAndDelete(userId);
    await Program.deleteMany({ userId });
    await DailyTask.deleteMany({ programId: { $in: await Program.find({ userId }).distinct('_id') } });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    throw error;
  }
};

export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  const [user, totalPrograms, completedPrograms, activeProgram] = await Promise.all([
    User.findById(userId),
    Program.countDocuments({ userId }),
    Program.countDocuments({ userId, status: 'completed' }),
    Program.findOne({ userId, status: 'active' }),
  ]);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const [totalTasks, completedTasks] = await Promise.all([
    DailyTask.countDocuments({
      programId: activeProgram?._id,
    }),
    DailyTask.countDocuments({
      programId: activeProgram?._id,
      completedAt: { $exists: true },
    }),
  ]);

  res.json({
    stats: {
      streak: user.streak,
      totalDays: user.totalDays,
      totalPrograms,
      completedPrograms,
      totalTasks,
      completedTasks,
      currentProgress: activeProgram?.totalProgress || 0,
    },
  });
};
