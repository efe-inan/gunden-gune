import { Response } from 'express';
import { DailyTask, Program } from '../models';
import { AuthRequest, AppError } from '../middleware';

export const getTodayTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const program = await Program.findOne({ userId, status: 'active' });
    if (!program) {
      throw new AppError('No active program found', 404);
    }

    const dailyTask = await DailyTask.findOne({
      programId: program._id,
      dayNumber: program.currentDay,
    });

    if (!dailyTask) {
      throw new AppError('No tasks found for today', 404);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    res.json({
      dailyTask,
      programDay: program.currentDay,
      programProgress: program.totalProgress,
    });
  } catch (error) {
    throw error;
  }
};

export const completeTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const dailyTask = await DailyTask.findById(id);
    if (!dailyTask) {
      throw new AppError('Task not found', 404);
    }

    const program = await Program.findById(dailyTask.programId);
    if (!program || program.userId.toString() !== userId) {
      throw new AppError('Access denied', 403);
    }

    const { taskId } = req.body;

    const task = dailyTask.tasks.find((t) => t._id.toString() === taskId);
    if (!task) {
      throw new AppError('Subtask not found', 404);
    }

    task.completed = !task.completed;

    const allCompleted = dailyTask.tasks.every((t) => t.completed);

    if (allCompleted && !dailyTask.completedAt) {
      dailyTask.completedAt = new Date();

      if (!program.completedDays.includes(dailyTask.dayNumber)) {
        program.completedDays.push(dailyTask.dayNumber);
      }

      program.currentDay = Math.min(program.currentDay + 1, 21);
      program.totalProgress = Math.round((program.completedDays.length / 21) * 100);

      if (program.completedDays.length === 21) {
        program.status = 'completed';
      }

      await program.save();
    }

    await dailyTask.save();

    res.json({
      message: 'Task updated successfully',
      task,
      allCompleted,
      program,
    });
  } catch (error) {
    throw error;
  }
};

export const addReflection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { reflection } = req.body;

    const dailyTask = await DailyTask.findById(id);
    if (!dailyTask) {
      throw new AppError('Task not found', 404);
    }

    const program = await Program.findById(dailyTask.programId);
    if (!program || program.userId.toString() !== userId) {
      throw new AppError('Access denied', 403);
    }

    dailyTask.reflection = reflection;
    await dailyTask.save();

    res.json({
      message: 'Reflection added successfully',
      dailyTask,
    });
  } catch (error) {
    throw error;
  }
};
