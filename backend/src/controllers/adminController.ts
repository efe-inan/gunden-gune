import { Response } from 'express';
import { User, Program, TestResult, DevelopmentArea, BlogPost } from '../models';
import { AuthRequest, AppError } from '../middleware';

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .skip((parseInt(page as string) - 1) * parseInt(limit as string));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password')
      .populate('currentProgramId')
      .populate('completedPrograms');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const userStats = {
      totalPrograms: await Program.countDocuments({ userId: id }),
      completedPrograms: await Program.countDocuments({ userId: id, status: 'completed' }),
      activeProgram: await Program.findOne({ userId: id, status: 'active' }),
      testResults: await TestResult.countDocuments({ userId: id }),
    };

    res.json({ user, stats: userStats });
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    delete updates.password;
    delete updates.email;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);
    await Program.deleteMany({ userId: id });
    await TestResult.deleteMany({ userId: id });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    throw error;
  }
};

export const getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });
    const totalPrograms = await Program.countDocuments();
    const activePrograms = await Program.countDocuments({ status: 'active' });
    const completedPrograms = await Program.countDocuments({ status: 'completed' });
    const totalBlogPosts = await BlogPost.countDocuments();
    const publishedBlogPosts = await BlogPost.countDocuments({ published: true });

    const topDevelopmentAreas = await Program.aggregate([
      { $group: { _id: '$developmentAreaId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'developmentareas',
          localField: '_id',
          foreignField: '_id',
          as: 'area',
        },
      },
    ]);

    res.json({
      stats: {
        users: {
          total: totalUsers,
          active: activeUsers,
        },
        programs: {
          total: totalPrograms,
          active: activePrograms,
          completed: completedPrograms,
        },
        blog: {
          total: totalBlogPosts,
          published: publishedBlogPosts,
        },
        topDevelopmentAreas,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getAllPrograms = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const programs = await Program.find(query)
      .populate('userId', 'name email')
      .populate('developmentAreaId', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .skip((parseInt(page as string) - 1) * parseInt(limit as string));

    const total = await Program.countDocuments(query);

    res.json({
      programs,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    throw error;
  }
};

export const createDevelopmentArea = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, slug, description, icon, questions } = req.body;

    const area = new DevelopmentArea({
      name,
      slug,
      description,
      icon,
      questions,
      totalQuestions: questions.length,
    });

    await area.save();

    res.status(201).json({
      message: 'Development area created successfully',
      area,
    });
  } catch (error) {
    throw error;
  }
};
