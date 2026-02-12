import { Request, Response, NextFunction } from "express";
import { SignUpType, LogInType } from "@/schema/auth.schema";
import {
  hashPassword,
  generateToken,
  comparePassword,
} from "@/utils/auth.utils";
import { createUser, findUserByEmail } from "@/models/user.model";
import { handleResponse } from "@/utils/success.utils";
import { AppError } from "@/utils/error.utils";
import { findOrCreateGoogleUser } from "@/models/user.model";
import { firebaseAuth } from "@/config/firebase.config";

export const signUp = async (
  req: Request<{}, {}, SignUpType>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, confirmPassword, name } = req.body;

    // Validate passwords match
    if (password !== confirmPassword) {
      throw new AppError("Passwords don't match", 400);
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new AppError("Email already exists", 409);
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await createUser({
      email,
      name,
      passwordHash: hashedPassword,
    });

    // Generate token
    const token = generateToken(user.id);
    // Send response
    handleResponse(res, 201, "User registered successfully", { user, token });
  } catch (error) {
    next(error);
  }
};

export const logIn = async (
  req: Request<{}, {}, LogInType>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await findUserByEmail(email);
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }
    // Compare password
    const isPasswordValid = await comparePassword(password, user.passwordhash);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }
    // Generate token
    const token = generateToken(user.id);

    // Send response
    const { passwordhash, ...userWithoutPassword } = user; // Exclude password hash from response
    handleResponse(res, 200, "Logged in successfully", {
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      throw new AppError("ID token is required", 400);
    }

    const decodedToken = await firebaseAuth.verifyIdToken(idToken);

    const { email, name, uid } = decodedToken;

    if (!email || !name) {
      throw new AppError("Google account information is incomplete", 400);
    }

    // Find or create user in the database
    const user = await findOrCreateGoogleUser(email, name, uid);

    // Generate JWT token for the user
    const token = generateToken(user.id);
    // Send response
    handleResponse(res, 200, "Logged in with Google successfully", {
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};
