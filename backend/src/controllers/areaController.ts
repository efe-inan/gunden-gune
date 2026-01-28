import { Response } from 'express';
import { DevelopmentArea } from '../models';
import { AuthRequest, AppError } from '../middleware';

export const getAllAreas = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const areas = await DevelopmentArea.find().sort({ name: 1 });

    res.json({ areas, count: areas.length });
  } catch (error) {
    throw error;
  }
};

export const getAreaById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const area = await DevelopmentArea.findById(id);
    if (!area) {
      throw new AppError('Development area not found', 404);
    }

    res.json({ area });
  } catch (error) {
    throw error;
  }
};

export const submitTest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    const area = await DevelopmentArea.findById(id);
    if (!area) {
      throw new AppError('Development area not found', 404);
    }

    let score = 0;
    const maxScore = area.questions.length;

    answers.forEach((answer: any) => {
      const question = area.questions.find((q) => q.id === answer.questionId);
      if (question) {
        score += answer.answer;
      }
    });

    const percentage = (score / maxScore) * 100;
    let difficultyLevel: 'beginner' | 'intermediate' | 'advanced';

    if (percentage < 40) {
      difficultyLevel = 'beginner';
    } else if (percentage < 70) {
      difficultyLevel = 'intermediate';
    } else {
      difficultyLevel = 'advanced';
    }

    const recommendations = generateRecommendations(area.name, difficultyLevel, percentage);

    res.json({
      score,
      maxScore,
      percentage,
      difficultyLevel,
      recommendations,
    });
  } catch (error) {
    throw error;
  }
};

function generateRecommendations(
  area: string,
  level: 'beginner' | 'intermediate' | 'advanced',
  score: number
): any[] {
  const recommendations = [];

  if (level === 'beginner') {
    recommendations.push({
      area: 'Foundation Building',
      description: `Start with basic concepts in ${area}. Focus on understanding fundamentals.`,
      suggestedActivities: ['Reading introductory materials', 'Basic exercises', 'Daily reflections'],
    });
  } else if (level === 'intermediate') {
    recommendations.push({
      area: 'Skill Enhancement',
      description: `Build upon your existing knowledge in ${area} with more challenging activities.`,
      suggestedActivities: ['Advanced exercises', 'Practical applications', 'Peer discussions'],
    });
  } else {
    recommendations.push({
      area: 'Mastery Development',
      description: `Deepen your expertise in ${area} with advanced techniques and teaching opportunities.`,
      suggestedActivities: ['Complex projects', 'Mentoring others', 'Creating content'],
    });
  }

  return recommendations;
}
