import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface IDevelopmentArea extends Document {
  name: string;
  slug: string;
  description: string;
  icon: string;
  questions: IQuestion[];
  totalQuestions: number;
  createdAt: Date;
  updatedAt: Date;
}

const developmentAreaSchema = new Schema<IDevelopmentArea>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    questions: [{
      id: String,
      question: String,
      options: [String],
    }],
    totalQuestions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Slug index is created by unique: true option above

export const DevelopmentArea = mongoose.model<IDevelopmentArea>('DevelopmentArea', developmentAreaSchema);
