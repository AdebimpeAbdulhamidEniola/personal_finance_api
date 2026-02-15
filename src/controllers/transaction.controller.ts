import { Request, Response, NextFunction } from "express";
import { handleResponse } from "@/utils/success.utils";
import { AppError } from "@/utils/error.utils";
import { createTransaction, getTransactionsByUser, updateTransaction, deleteTransaction} from "@/models/transaction.model";
import { TransactionInput } from "@/types/transaction.types";
import {verifyToken} from "@/utils/auth.utils";
import { UpdateTransactionInput} from "@/schema/transaction.schema";


export const createTransactionController= async (
  req: Request<{},{},TransactionInput,{}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const transactionData = {...req.body, userId}

    // Call the model function
    const transaction = await createTransaction(transactionData);

    handleResponse(res, 201, "Transaction created successfully", transaction);
  } catch (error) {
    next(error);
  }
};

export const getTransactionController = async (
  req: Request<{},{},{},{}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }
    
    const transaction = await getTransactionsByUser(userId)

    handleResponse(res, 200, "Transaction retrieved successfully", transaction);
  } catch (error) {
    next(error);
  }
};


export const updateTransacctionController = async (
  req: Request<{id:string},{},UpdateTransactionInput,{}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }
    const transaction = await updateTransaction(req.params.id, req.body);
    
    handleResponse(res, 200, "Transaction updated successfully", transaction);
  } catch (error) {
    next(error);
  }
}

export const deleteTransactionController = async (
  req: Request<{id:string},{},{},{}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }
    const transaction = await deleteTransaction(req.params.id);
    
    handleResponse(res, 200, "Transaction deleted successfully", transaction);
  } catch (error) {
    next(error);
  }
}
