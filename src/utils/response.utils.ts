import {Prisma} from "../generated/prisma/client";
import { Response } from "express";
import { AppError } from "./error.utils";

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: Array<{ field: string; message: string }>
): void => {
  const isServerError = statusCode >= 500;

  const payload: any = {
    status: isServerError ? "error" : "failed",
    message,
  };

  if (errors && errors.length > 0) {
    payload.errors = errors;
  }

  res.status(statusCode).json(payload);
};

const catchPrismaError = (error: unknown, res: Response): boolean => {
  if (error instanceof Prisma.PrismaClientValidationError) {
    sendErrorResponse(res, 400, "Invalid data format provided");
    return true;
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    sendErrorResponse(res, 503, "Database connection unavailable");
    return true;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = error as Prisma.PrismaClientKnownRequestError;

    if (prismaError.code === "P2002") {
      const field = (prismaError.meta?.target as string[])?.[0] || "field";
      sendErrorResponse(res, 409, `A record with this ${field} already exists`);
      return true;
    }

    if (prismaError.code === "P2025") {
      sendErrorResponse(res, 404, "Record not found");
      return true;
    }

    if (prismaError.code === "P2003") {
      sendErrorResponse(res, 400, "Foreign key constraint violation");
      return true;
    }

    sendErrorResponse(res, 500, "Database error occurred");
    return true;
  }

  return false;
};

const handleUnexpectedError = (error: unknown, res: Response): void => {
  console.error("Unexpected error:", error);
  res.status(500).json({
    status: "error",
    message: "An unexpected error occurred",
  });
};

const handleAppError = (error: unknown, res: Response): boolean => {
  if (error instanceof AppError) {
    sendErrorResponse(res, error.statusCode, error.message, (error as AppError).errors);
    return true;
  }
  return false;
};

export const handleAllErrors = (error: unknown, res: Response): void => {
  if (handleAppError(error, res)) return;
  if (catchPrismaError(error, res)) return;
  handleUnexpectedError(error, res);
};