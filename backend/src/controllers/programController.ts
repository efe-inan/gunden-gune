import { Response } from 'express';
import mongoose from 'mongoose';
import { Program, DailyTask, TestResult, User, DevelopmentArea } from '../models';
import { AuthRequest, AppError } from '../middleware';

export const createProgram = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { developmentAreaId, testResultId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.currentProgramId) {
      throw new AppError('User already has an active program', 400);
    }

    const testResult = await TestResult.findById(testResultId);
    if (!testResult) {
      throw new AppError('Test result not found', 404);
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 21);

    const program = new Program({
      userId,
      developmentAreaId,
      startDate,
      endDate,
      status: 'active',
      currentDay: 1,
      completedDays: [],
      totalProgress: 0,
      testResultId,
      dailyTimeCommitment: user.dailyTimeCommitment,
    });

    await program.save();

    await generateDailyTasks(program, testResult.difficultyLevel);

    await User.findByIdAndUpdate(userId, {
      $set: { currentProgramId: program._id },
    });

    res.status(201).json({
      message: 'Program created successfully',
      program,
    });
  } catch (error) {
    throw error;
  }
};

export const getCurrentProgram = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const program = await Program.findOne({ userId, status: 'active' })
      .populate('developmentAreaId')
      .populate('testResultId');

    if (!program) {
      throw new AppError('No active program found', 404);
    }

    res.json({ program });
  } catch (error) {
    throw error;
  }
};

export const getProgramById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const program = await Program.findById(id)
      .populate('developmentAreaId')
      .populate('testResultId');

    if (!program) {
      throw new AppError('Program not found', 404);
    }

    if (program.userId.toString() !== userId) {
      throw new AppError('Access denied', 403);
    }

    res.json({ program });
  } catch (error) {
    throw error;
  }
};

export const updateProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { completedTaskIds, reflection } = req.body;

    const program = await Program.findById(id);
    if (!program) {
      throw new AppError('Program not found', 404);
    }

    if (program.userId.toString() !== userId) {
      throw new AppError('Access denied', 403);
    }

    const dailyTask = await DailyTask.findOne({
      programId: id,
      dayNumber: program.currentDay,
    });

    if (!dailyTask) {
      throw new AppError('Daily task not found', 404);
    }

    dailyTask.tasks.forEach((task) => {
      if (completedTaskIds.includes(task._id.toString())) {
        task.completed = true;
      }
    });

    if (reflection) {
      dailyTask.reflection = reflection;
    }

    const allTasksCompleted = dailyTask.tasks.every((task) => task.completed);

    const updatePromises = [];

    if (allTasksCompleted && !dailyTask.completedAt) {
      dailyTask.completedAt = new Date();

      if (!program.completedDays.includes(program.currentDay)) {
        program.completedDays.push(program.currentDay);
      }

      program.currentDay = Math.min(program.currentDay + 1, 21);
      program.totalProgress = Math.round((program.completedDays.length / 21) * 100);

      if (program.completedDays.length === 21) {
        program.status = 'completed';
        updatePromises.push(User.findByIdAndUpdate(userId, {
          $push: { completedPrograms: program._id },
          $set: { currentProgramId: null },
        }));
      }

      updatePromises.push(program.save());

      updatePromises.push(User.findByIdAndUpdate(userId, {
        $inc: {
          totalDays: 1,
          streak: 1,
        },
      }));
    }

    updatePromises.push(dailyTask.save());

    await Promise.all(updatePromises);

    res.json({
      message: 'Progress updated successfully',
      program,
      dailyTask,
    });
  } catch (error) {
    throw error;
  }
};

export const getTasksForDay = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id, day } = req.params;
    const userId = req.user?.userId;

    const program = await Program.findById(id);
    if (!program) {
      throw new AppError('Program not found', 404);
    }

    if (program.userId.toString() !== userId) {
      throw new AppError('Access denied', 403);
    }

    const dailyTask = await DailyTask.findOne({
      programId: id,
      dayNumber: parseInt(day),
    });

    if (!dailyTask) {
      throw new AppError('Daily tasks not found', 404);
    }

    res.json({ dailyTask });
  } catch (error) {
    throw error;
  }
};

export const completeTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { taskId } = req.body;

    const program = await Program.findOne({ userId, status: 'active' });
    if (!program) {
      throw new AppError('No active program found', 404);
    }

    const dailyTask = await DailyTask.findOne({
      programId: program._id,
      dayNumber: program.currentDay,
    });

    if (!dailyTask) {
      throw new AppError('Daily task not found', 404);
    }

    const task = dailyTask.tasks.find(t => t._id.toString() === taskId);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    task.completed = true;
    await dailyTask.save();

    res.json({ message: 'Task completed successfully' });
  } catch (error) {
    throw error;
  }
};

export const uncompleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { taskId } = req.body;

    const program = await Program.findOne({ userId, status: 'active' });
    if (!program) {
      throw new AppError('No active program found', 404);
    }

    const dailyTask = await DailyTask.findOne({
      programId: program._id,
      dayNumber: program.currentDay,
    });

    if (!dailyTask) {
      throw new AppError('Daily task not found', 404);
    }

    const task = dailyTask.tasks.find(t => t._id.toString() === taskId);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    task.completed = false;
    await dailyTask.save();

    res.json({ message: 'Task uncompleted successfully' });
  } catch (error) {
    throw error;
  }
};

export const submitReflection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { reflection } = req.body;

    const program = await Program.findOne({ userId, status: 'active' });
    if (!program) {
      throw new AppError('No active program found', 404);
    }

    const dailyTask = await DailyTask.findOne({
      programId: program._id,
      dayNumber: program.currentDay,
    });

    if (!dailyTask) {
      throw new AppError('Daily task not found', 404);
    }

    dailyTask.reflection = reflection;
    await dailyTask.save();

    res.json({ message: 'Reflection submitted successfully' });
  } catch (error) {
    throw error;
  }
};

export const getCurrentDayProgram = async (req: AuthRequest, res: Response): Promise<void> => {
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
      throw new AppError('Daily task not found', 404);
    }

    const tasks = dailyTask.tasks.map(t => ({
      id: t._id.toString(),
      title: t.type.charAt(0).toUpperCase() + t.type.slice(1),
      description: t.content,
      duration: t.duration,
      completed: t.completed,
      day: dailyTask.dayNumber,
    }));

    const totalDuration = tasks.reduce((sum, t) => sum + t.duration, 0);
    const completedDuration = tasks
      .filter(t => t.completed)
      .reduce((sum, t) => sum + t.duration, 0);

    res.json({
      day: dailyTask.dayNumber,
      tasks,
      totalDuration,
      completedDuration,
      motivationMessage: getMotivationMessage(dailyTask.dayNumber),
    });
  } catch (error) {
    throw error;
  }
};

export const getDayProgram = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { day } = req.params;

    const program = await Program.findOne({ userId, status: 'active' });
    if (!program) {
      throw new AppError('No active program found', 404);
    }

    const dailyTask = await DailyTask.findOne({
      programId: program._id,
      dayNumber: parseInt(day),
    });

    if (!dailyTask) {
      throw new AppError('Daily task not found', 404);
    }

    const tasks = dailyTask.tasks.map(t => ({
      id: t._id.toString(),
      title: t.type.charAt(0).toUpperCase() + t.type.slice(1),
      description: t.content,
      duration: t.duration,
      completed: t.completed,
      day: dailyTask.dayNumber,
    }));

    const totalDuration = tasks.reduce((sum, t) => sum + t.duration, 0);
    const completedDuration = tasks
      .filter(t => t.completed)
      .reduce((sum, t) => sum + t.duration, 0);

    res.json({
      day: dailyTask.dayNumber,
      tasks,
      totalDuration,
      completedDuration,
      motivationMessage: getMotivationMessage(dailyTask.dayNumber),
    });
  } catch (error) {
    throw error;
  }
};

function getMotivationMessage(day: number): string {
  const messages = [
    'Welcome to your journey! Every step counts.',
    'Great start! Keep building momentum.',
    'You\'re doing well! Consistency is key.',
    'Building habits takes time - you\'re on track!',
    'Halfway through the first week - amazing!',
    'One week down! Celebrate your progress.',
    'New week, new opportunities to grow.',
    'Keep pushing forward - you\'re stronger than you think.',
    'Embrace the challenge - you\'re growing!',
    'Double digits! Your dedication shows.',
    'Over the halfway point - fantastic work!',
    'You\'ve got this! Stay focused.',
    'Each day brings you closer to your goal.',
    'Two-thirds complete - you\'re unstoppable!',
    'Home stretch! Finish strong.',
    'The end is in sight - keep going!',
    'Almost there - maintain your momentum!',
    'Few more days - you\'re doing incredible!',
    'Final stretch! Give it your all.',
    'One more day after this - amazing journey!',
    'Last day! You\'ve completed the program!',
    'Congratulations on completing your 21-day journey!',
  ];

  return messages[day - 1] || messages[0];
}

async function generateDailyTasks(
  program: any,
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
): Promise<void> {
  const tasks = [];
  const totalDuration = program.dailyTimeCommitment;

  for (let day = 1; day <= 21; day++) {
    const dayTasks = [];
    const difficultyMultiplier = difficultyLevel === 'beginner' ? 1 : difficultyLevel === 'intermediate' ? 1.5 : 2;
    const dayProgress = day / 21;

    const readingDuration = Math.round(totalDuration * 0.4 * difficultyMultiplier);
    const exerciseDuration = Math.round(totalDuration * 0.3 * difficultyMultiplier);
    const practiceDuration = Math.round(totalDuration * 0.2 * (1 + dayProgress));
    const reflectionDuration = Math.round(totalDuration * 0.1);

    dayTasks.push({
      type: 'reading',
      content: getTaskContent('reading', day, difficultyLevel),
      duration: readingDuration,
      completed: false,
      order: 1,
    });

    dayTasks.push({
      type: 'exercise',
      content: getTaskContent('exercise', day, difficultyLevel),
      duration: exerciseDuration,
      completed: false,
      order: 2,
    });

    dayTasks.push({
      type: 'practice',
      content: getTaskContent('practice', day, difficultyLevel),
      duration: practiceDuration,
      completed: false,
      order: 3,
    });

    dayTasks.push({
      type: 'reflection',
      content: getTaskContent('reflection', day, difficultyLevel),
      duration: reflectionDuration,
      completed: false,
      order: 4,
    });

    tasks.push({
      programId: program._id,
      dayNumber: day,
      tasks: dayTasks,
    });
  }

  await DailyTask.insertMany(tasks);
}

function getTaskContent(
  type: string,
  day: number,
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
): string {
  const contents: Record<string, string[]> = {
    reading: [
      'Read about the foundational concepts of your development area',
      'Study the core principles and theories',
      'Explore advanced materials and case studies',
      'Research real-world applications',
      'Analyze expert opinions and research papers',
    ],
    exercise: [
      'Complete basic exercises to build understanding',
      'Practice intermediate exercises to reinforce concepts',
      'Work on challenging problems',
      'Apply concepts to complex scenarios',
      'Create and solve your own problems',
    ],
    practice: [
      'Apply what you learned in a simple context',
      'Practice in real-world situations',
      'Teach concepts to others',
      'Create content or projects',
      'Mentor or guide others',
    ],
    reflection: [
      'Reflect on what you learned today',
      'Journal your thoughts and insights',
      'Analyze your progress and challenges',
      'Plan for tomorrow based on today\'s learning',
      'Evaluate your overall growth and next steps',
    ],
  };

  const difficultyIndex = difficultyLevel === 'beginner' ? 0 : difficultyLevel === 'intermediate' ? 2 : 4;
  const progressIndex = Math.floor((day / 21) * 4);
  const contentIndex = Math.min(difficultyIndex + progressIndex, 4);

  return contents[type][contentIndex] || contents[type][0];
}
