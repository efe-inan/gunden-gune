/* eslint-disable @typescript-eslint/no-explicit-any */
import { completeTask } from './taskController';
import { DailyTask, Program } from '../models';
import { Response } from 'express';
import { AuthRequest } from '../middleware';

// Mock specific files to ensure real models are not loaded
jest.mock('../models/DailyTask');
jest.mock('../models/Program');
jest.mock('../models');

describe('TaskController Performance', () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    req = {
      params: { id: 'task1' },
      user: { userId: 'user1' } as any,
      body: { taskId: 'subtask1' }
    };
    res = {
      json: jsonMock
    };
    jest.clearAllMocks();
  });

  it('should measure execution time of completeTask', async () => {
    // Setup Mocks
    const mockProgram = {
      _id: 'program1',
      userId: { toString: () => 'user1' },
      completedDays: [],
      currentDay: 1,
      totalProgress: 0,
      save: jest.fn().mockResolvedValue(true)
    };

    const mockDailyTask = {
      _id: 'task1',
      programId: 'program1',
      tasks: [
        { _id: { toString: () => 'subtask1' }, completed: false }
      ],
      save: jest.fn().mockResolvedValue(true),
      dayNumber: 1
    };

    // When populated, programId becomes the object
    const mockDailyTaskPopulated = {
      ...mockDailyTask,
      programId: mockProgram
    };

    // Delay helper
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Mock DailyTask.findById
    (DailyTask.findById as jest.Mock).mockImplementation((_id) => {
      console.log('DailyTask.findById called');
      const result = {
        populate: jest.fn().mockImplementation((path) => {
          console.log('DailyTask.populate called with', path);
          return {
            then: (resolve: any, _reject: any) => {
               // Optimized path: 50ms total
               return delay(50).then(() => resolve(mockDailyTaskPopulated));
            }
          };
        }),
        then: (resolve: any, _reject: any) => {
           // Unoptimized path: 50ms
           console.log('DailyTask.then called (unpopulated)');
           return delay(50).then(() => {
             console.log('Resolving DailyTask with tasks:', mockDailyTask.tasks ? 'yes' : 'no');
             resolve(mockDailyTask);
           });
        }
      };
      return result;
    });

    // Mock Program.findById
    (Program.findById as jest.Mock).mockImplementation((_id) => {
      console.log('Program.findById called');
      return {
        then: (resolve: any, _reject: any) => {
           // Unoptimized path 2nd call: 50ms
           return delay(50).then(() => resolve(mockProgram));
        }
      };
    });

    const start = Date.now();
    try {
        await completeTask(req as AuthRequest, res as Response);
    } catch (e) {
        console.error('Error in completeTask:', e);
        throw e;
    }
    const end = Date.now();
    const duration = end - start;

    console.log(`Execution time: ${duration}ms`);

    // Basic verification that it worked
    expect(jsonMock).toHaveBeenCalled();
  });
});
