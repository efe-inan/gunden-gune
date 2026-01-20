import { Response } from 'express';
import { AuthRequest } from '../middleware';
import path from 'path';
import { config } from '../config/config';

export const uploadFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
      message: 'File uploaded successfully',
      fileUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ error: 'File upload failed' });
  }
};
