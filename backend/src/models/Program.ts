import mongoose, { Schema, Document } from 'mongoose';

export interface IProgram extends Document {
  userId: mongoose.Types.ObjectId;
  developmentAreaId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'paused';
  currentDay: number;
  completedDays: number[];
  totalProgress: number;
  testResultId?: mongoose.Types.ObjectId;
  dailyTimeCommitment: number;
  createdAt: Date;
  updatedAt: Date;
}

const programSchema = new Schema<IProgram>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    developmentAreaId: {
      type: Schema.Types.ObjectId,
      ref: 'DevelopmentArea',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active',
    },
    currentDay: {
      type: Number,
      default: 1,
      min: 1,
      max: 21,
    },
    completedDays: [{
      type: Number,
    }],
    totalProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    testResultId: {
      type: Schema.Types.ObjectId,
      ref: 'TestResult',
    },
    dailyTimeCommitment: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

programSchema.index({ userId: 1, status: 1 });
programSchema.index({ status: 1 });
programSchema.index({ developmentAreaId: 1 });

export const Program = mongoose.model<IProgram>('Program', programSchema);
