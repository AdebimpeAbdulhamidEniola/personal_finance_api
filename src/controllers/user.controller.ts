//This file contains iplementation of get profile and update profile of user
import { Request, Response,NextFunction} from 'express'
import {findUserById}  from'../models/user.model'
import { AppError } from '@/utils/error.utils';
import { handleResponse } from '@/utils/success.utils';
import e from 'cors';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId; // Get user ID from request (set by auth middleware)
        if (!userId) {
            throw new AppError('User not authenticated', 401);
        }
        const user = await findUserById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }   
        handleResponse(res, 200, 'User profile retrieved successfully',  user );
    } catch (error) {
        next(error);
    }

};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        if (!userId) {
            

