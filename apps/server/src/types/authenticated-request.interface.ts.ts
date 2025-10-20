// src/types/authenticated-request.interface.ts
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
  };
}
