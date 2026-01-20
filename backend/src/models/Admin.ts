import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  userId: mongoose.Types.ObjectId;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'moderator'],
      required: true,
      default: 'moderator',
    },
    permissions: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

adminSchema.index({ userId: 1 });

export const Admin = mongoose.model<IAdmin>('Admin', adminSchema);
