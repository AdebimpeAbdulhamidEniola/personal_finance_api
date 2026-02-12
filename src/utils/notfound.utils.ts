import { Request, Response } from "express";
import { AppError } from "@/utils/error.utils";

export const notFoundHandler = (req: Request, res: Response): void => {
  throw new AppError(`Route ${req.originalUrl} not found`, 404);
};
