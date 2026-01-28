import mongoose, { Schema, Document } from 'mongoose';

export interface ITask {
  _id: mongoose.Types.ObjectId;
  type: 'reading' | 'exercise' | 'practice' | 'reflection' | 'meditation';
  content: string;
  duration: number;
  completed: boolean;
  order: number;
}

export interface IDailyTask extends Document {
  programId: mongoose.Types.ObjectId;
  dayNumber: number;
  tasks: ITask[];
  reflection?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const dailyTaskSchema = new Schema<IDailyTask>(
  {
    programId: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
    },
    dayNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 21,
    },
    tasks: [{
      type: {
        type: String,
        enum: ['reading', 'exercise', 'practice', 'reflection', 'meditation'],
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      duration: {
        type: Number,
        required: true,
      },
      completed: {
        type: Boolean,
        default: false,
      },
      order: {
        type: Number,
        required: true,
      },
    }],
    reflection: {
      type: String,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

dailyTaskSchema.index({ programId: 1, dayNumber: 1 }, { unique: true });

export const DailyTask = mongoose.model<IDailyTask>('DailyTask', dailyTaskSchema);
