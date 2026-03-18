import { findUserById } from "../models/user.model";
import { AppError } from "@/utils/error.utils";
import { handleResponse } from "@/utils/success.utils";
import { updateUserProfile } from "../models/user.model";
export const getProfile = async (req, res, next) => {
    try {
        const userId = req.userId; // Get user ID from request (set by auth middleware)
        if (!userId) {
            throw new AppError("User not authenticated", 401);
        }
        const user = await findUserById(userId);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        handleResponse(res, 200, "User profile retrieved successfully", user);
    }
    catch (error) {
        next(error);
    }
};
export const updateProfile = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new AppError("User not authenticated", 401);
        }
        const updateData = req.body;
        // Call the model function
        const updatedUser = await updateUserProfile(userId, updateData);
        handleResponse(res, 200, "User profile updated successfully", updatedUser);
    }
    catch (error) {
        next(error);
    }
};
