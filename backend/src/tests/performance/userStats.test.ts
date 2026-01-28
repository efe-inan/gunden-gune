import { Response } from 'express';
import { getStats } from '../../controllers/userController';
import { User, Program, DailyTask } from '../../models';
import { AuthRequest } from '../../middleware';

// Mock the models
jest.mock('../../models', () => ({
  User: {
    findById: jest.fn(),
  },
  Program: {
    countDocuments: jest.fn(),
    findOne: jest.fn(),
  },
  DailyTask: {
    countDocuments: jest.fn(),
  },
}));

const DELAY_MS = 50;

const delay = <T>(value: T, ms: number = DELAY_MS): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
};

describe('Performance Benchmark: getStats', () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    req = {
      user: {
        userId: 'test-user-id',
        email: 'test@example.com',
      },
    };
    res = {
      json: jsonMock,
    } as unknown as Response;

    // Reset mocks
    jest.clearAllMocks();

    // Setup mock implementations with delays
    (User.findById as jest.Mock).mockReturnValue({
        streak: 5,
        totalDays: 10,
    });
    // Need to handle the fact that findById returns a thenable/query object often,
    // but here we are mocking the resolved value or the promise.
    // The controller does `await User.findById(...)`.
    // If we mock return value as a promise, it works.

    (User.findById as jest.Mock).mockImplementation(() => delay({
        streak: 5,
        totalDays: 10,
    }));

    (Program.countDocuments as jest.Mock).mockImplementation(() => delay(5));
    (Program.findOne as jest.Mock).mockImplementation(() => delay({
        _id: 'active-program-id',
        totalProgress: 50,
    }));
    (DailyTask.countDocuments as jest.Mock).mockImplementation(() => delay(10));
  });

  it('should measure execution time of getStats', async () => {
    const start = Date.now();
    await getStats(req as AuthRequest, res as Response);
    const end = Date.now();
    const duration = end - start;

    console.log(`Execution time: ${duration}ms`);

    // Sanity check
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        stats: expect.anything()
    }));
  });
});
