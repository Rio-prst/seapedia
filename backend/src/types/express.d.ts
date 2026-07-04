export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        activeRole?: string;
      };
    }
  }
}