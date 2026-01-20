import mongoose from 'mongoose';
import { DevelopmentArea } from '../models';

export const seedDevelopmentAreas = async (): Promise<void> => {
  try {
    const areas = [
      {
        name: 'Fitness & Physical Health',
        slug: 'fitness-physical-health',
        description: 'Improve your physical fitness, strength, and overall health through exercise and healthy habits.',
        icon: '🏋️',
        questions: [
          {
            id: 'q1',
            question: 'How many days per week do you currently exercise?',
            options: ['Never', '1-2 days', '3-4 days', '5+ days'],
          },
          {
            id: 'q2',
            question: 'How would you rate your current fitness level?',
            options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
          },
          {
            id: 'q3',
            question: 'What is your primary fitness goal?',
            options: ['Lose weight', 'Build muscle', 'Improve endurance', 'Maintain health'],
          },
          {
            id: 'q4',
            question: 'How much time can you dedicate to exercise daily?',
            options: ['15-30 min', '30-45 min', '45-60 min', '60+ min'],
          },
          {
            id: 'q5',
            question: 'Do you have any previous injuries that limit your exercise?',
            options: ['Yes, multiple', 'Yes, one minor', 'No', 'Prefer not to say'],
          },
        ],
        totalQuestions: 5,
      },
      {
        name: 'Mindfulness & Meditation',
        slug: 'mindfulness-meditation',
        description: 'Develop mindfulness, reduce stress, and improve mental clarity through meditation practices.',
        icon: '🧘',
        questions: [
          {
            id: 'q1',
            question: 'How often do you currently practice mindfulness or meditation?',
            options: ['Never', 'Rarely', 'Sometimes', 'Daily'],
          },
          {
            id: 'q2',
            question: 'What is your biggest challenge with mindfulness?',
            options: ['Finding time', 'Staying focused', 'Knowing techniques', 'Consistency'],
          },
          {
            id: 'q3',
            question: 'How would you rate your current stress level?',
            options: ['Very low', 'Low', 'Moderate', 'High'],
          },
          {
            id: 'q4',
            question: 'What type of meditation interests you most?',
            options: ['Breathing', 'Visualization', 'Body scan', 'Mantra'],
          },
          {
            id: 'q5',
            question: 'How much time can you dedicate to mindfulness daily?',
            options: ['5-10 min', '10-20 min', '20-30 min', '30+ min'],
          },
        ],
        totalQuestions: 5,
      },
      {
        name: 'Productivity & Time Management',
        slug: 'productivity-time-management',
        description: 'Enhance productivity, manage time effectively, and achieve your goals efficiently.',
        icon: '⏰',
        questions: [
          {
            id: 'q1',
            question: 'How often do you complete your daily tasks on time?',
            options: ['Rarely', 'Sometimes', 'Often', 'Always'],
          },
          {
            id: 'q2',
            question: 'What is your biggest productivity challenge?',
            options: ['Procrastination', 'Distractions', 'Planning', 'Motivation'],
          },
          {
            id: 'q3',
            question: 'Do you use any productivity tools or apps?',
            options: ['No', 'One or two', 'Several', 'Many advanced tools'],
          },
          {
            id: 'q4',
            question: 'How do you handle interruptions?',
            options: ['Very poorly', 'Poorly', 'Well', 'Very well'],
          },
          {
            id: 'q5',
            question: 'How do you prioritize your tasks?',
            options: ['No system', 'Random', 'Simple list', 'Advanced prioritization'],
          },
        ],
        totalQuestions: 5,
      },
      {
        name: 'Personal Finance',
        slug: 'personal-finance',
        description: 'Master money management, budgeting, saving, and investing for financial freedom.',
        icon: '💰',
        questions: [
          {
            id: 'q1',
            question: 'Do you currently follow a budget?',
            options: ['No', 'Sometimes', 'Mostly', 'Yes, strictly'],
          },
          {
            id: 'q2',
            question: 'How much of your income do you save monthly?',
            options: ['Less than 5%', '5-10%', '10-20%', 'More than 20%'],
          },
          {
            id: 'q3',
            question: 'What is your current financial goal?',
            options: ['Build emergency fund', 'Pay off debt', 'Start investing', 'Save for major purchase'],
          },
          {
            id: 'q4',
            question: 'How familiar are you with investment concepts?',
            options: ['Not familiar', 'Somewhat familiar', 'Familiar', 'Very familiar'],
          },
          {
            id: 'q5',
            question: 'Do you track your expenses regularly?',
            options: ['Never', 'Rarely', 'Sometimes', 'Always'],
          },
        ],
        totalQuestions: 5,
      },
      {
        name: 'Communication Skills',
        slug: 'communication-skills',
        description: 'Improve your ability to communicate effectively in personal and professional settings.',
        icon: '💬',
        questions: [
          {
            id: 'q1',
            question: 'How comfortable are you with public speaking?',
            options: ['Very uncomfortable', 'Uncomfortable', 'Comfortable', 'Very comfortable'],
          },
          {
            id: 'q2',
            question: 'Do you find it easy to express your thoughts clearly?',
            options: ['No, very difficult', 'Somewhat difficult', 'Mostly easy', 'Very easy'],
          },
          {
            id: 'q3',
            question: 'How do you handle conflicts in relationships?',
            options: ['Avoid them', 'Get emotional', 'Try to resolve', 'Mediate effectively'],
          },
          {
            id: 'q4',
            question: 'Are you a good listener?',
            options: ['Not really', 'Sometimes', 'Mostly', 'Yes, very'],
          },
          {
            id: 'q5',
            question: 'How often do you communicate via writing in your work?',
            options: ['Rarely', 'Sometimes', 'Often', 'Very often'],
          },
        ],
        totalQuestions: 5,
      },
      {
        name: 'Creative Expression',
        slug: 'creative-expression',
        description: 'Unlock your creativity through art, writing, music, or other creative pursuits.',
        icon: '🎨',
        questions: [
          {
            id: 'q1',
            question: 'How often do you engage in creative activities?',
            options: ['Never', 'Rarely', 'Sometimes', 'Daily'],
          },
          {
            id: 'q2',
            question: 'What is your preferred creative medium?',
            options: ['Writing', 'Visual arts', 'Music', 'Mixed media'],
          },
          {
            id: 'q3',
            question: 'What is your biggest creative block?',
            options: ['Lack of ideas', 'Self-doubt', 'Time constraints', 'Perfectionism'],
          },
          {
            id: 'q4',
            question: 'Do you have formal training in any creative field?',
            options: ['No', 'Some classes', 'Formal training', 'Professional experience'],
          },
          {
            id: 'q5',
            question: 'How would you describe your creative confidence?',
            options: ['Very low', 'Low', 'Moderate', 'High'],
          },
        ],
        totalQuestions: 5,
      },
      {
        name: 'Learning & Development',
        slug: 'learning-development',
        description: 'Accelerate your learning, acquire new skills, and embrace continuous growth.',
        icon: '📚',
        questions: [
          {
            id: 'q1',
            question: 'How often do you learn something new?',
            options: ['Rarely', 'Monthly', 'Weekly', 'Daily'],
          },
          {
            id: 'q2',
            question: 'What is your preferred learning style?',
            options: ['Reading', 'Visual', 'Auditory', 'Hands-on'],
          },
          {
            id: 'q3',
            question: 'How do you stay motivated to learn?',
            options: ['Struggle with motivation', 'External motivation', 'Internal motivation', 'Both'],
          },
          {
            id: 'q4',
            question: 'What type of skills do you want to develop?',
            options: ['Technical', 'Soft skills', 'Creative', 'All of the above'],
          },
          {
            id: 'q5',
            question: 'How much time can you dedicate to learning daily?',
            options: ['15-30 min', '30-60 min', '1-2 hours', '2+ hours'],
          },
        ],
        totalQuestions: 5,
      },
      {
        name: 'Emotional Intelligence',
        slug: 'emotional-intelligence',
        description: 'Develop self-awareness, empathy, and emotional regulation for better relationships.',
        icon: '❤️',
        questions: [
          {
            id: 'q1',
            question: 'How well do you recognize your own emotions?',
            options: ['Poorly', 'Somewhat well', 'Well', 'Very well'],
          },
          {
            id: 'q2',
            question: 'How do you react to stressful situations?',
            options: ['Overwhelmed', 'Anxious', 'Manageable', 'Calm'],
          },
          {
            id: 'q3',
            question: 'Are you good at empathizing with others?',
            options: ['Not really', 'Sometimes', 'Usually', 'Very much'],
          },
          {
            id: 'q4',
            question: 'How do you handle criticism?',
            options: ['Defensively', 'With difficulty', 'Openly', 'Very constructively'],
          },
          {
            id: 'q5',
            question: 'Do you maintain good relationships with others?',
            options: ['Struggle with this', 'Some relationships', 'Most relationships', 'All relationships'],
          },
        ],
        totalQuestions: 5,
      },
    ];

    const count = await DevelopmentArea.countDocuments();
    if (count > 0) {
      console.log('Development areas already seeded');
      return;
    }

    await DevelopmentArea.insertMany(areas);
    console.log(`✅ Seeded ${areas.length} development areas`);
  } catch (error) {
    console.error('Error seeding development areas:', error);
  }
};

export const seedAll = async (): Promise<void> => {
  try {
    await seedDevelopmentAreas();
    console.log('✅ Database seeding completed');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
