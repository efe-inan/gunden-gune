import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  dailyTimeCommitment: number;
  interests: string[];
  developmentAreas: string[];
  currentProgramId?: mongoose.Types.ObjectId;
  completedPrograms: mongoose.Types.ObjectId[];
  streak: number;
  longestStreak: number;
  totalDays: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 13,
      max: 120,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    },
    dailyTimeCommitment: {
      type: Number,
      required: true,
      min: 15,
      max: 180,
    },
    interests: {
      type: [String],
      required: true,
      default: [],
    },
    developmentAreas: {
      type: [String],
      default: [],
    },
    currentProgramId: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
    },
    completedPrograms: [{
      type: Schema.Types.ObjectId,
      ref: 'Program',
    }],
    streak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    totalDays: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Email index is created by unique: true option above
userSchema.index({ currentProgramId: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
