import mongoose, { Schema, Document } from 'mongoose';

export interface IAnswer {
  questionId: string;
  answer: number;
}

export interface IRecommendation {
  area: string;
  description: string;
  suggestedActivities: string[];
}

export interface ITestResult extends Document {
  userId: mongoose.Types.ObjectId;
  areaId: mongoose.Types.ObjectId;
  answers: IAnswer[];
  score: number;
  maxScore: number;
  recommendations: IRecommendation[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  updatedAt: Date;
}

const testResultSchema = new Schema<ITestResult>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    areaId: {
      type: Schema.Types.ObjectId,
      ref: 'DevelopmentArea',
      required: true,
    },
    answers: [{
      questionId: String,
      answer: Number,
    }],
    score: {
      type: Number,
      required: true,
    },
    maxScore: {
      type: Number,
      required: true,
    },
    recommendations: [{
      area: String,
      description: String,
      suggestedActivities: [String],
    }],
    difficultyLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

testResultSchema.index({ userId: 1 });
testResultSchema.index({ areaId: 1 });

export const TestResult = mongoose.model<ITestResult>('TestResult', testResultSchema);
