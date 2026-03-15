import { Request, Response, NextFunction } from "express";
import { SignUpType, LogInType } from "@/schema/auth.schema";
import {
  hashPassword,
  generateToken,
  comparePassword,
  verifyToken,
} from "@/utils/auth.utils";
import { createUser, findUserByEmail } from "@/models/user.model";
import { handleResponse } from "@/utils/success.utils";
import { AppError } from "@/utils/error.utils";
import { findOrCreateGoogleUser } from "@/models/user.model";
import { firebaseAuth } from "@/config/firebase.config";
import { sendConfirmationEmail } from "@/services/email.services";
import crypto from "crypto"
import { findUserByVerificationToken, markUserAsVerified } from "@/models/user.model";

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
    const hashedPassword = await hashPassword(password)

    //Generate a secure random verification token
    const verificationToken = crypto.randomBytes(32).toString("hex")
    

    const user = await createUser({
      email,
      name,
      passwordhash: hashedPassword,
      verificationToken: verificationToken
    })
    try {
      await sendConfirmationEmail({email, name, token:verificationToken})
    } catch (emailError) {
      console.error("Email sending failed during registration:", emailError);
      throw new AppError("Registration successful but failed to send confirmation email. Please contact support.", 500);
    }
    handleResponse(res, 201, "Registration successful.Please check your email to verify your account")
  } 
  catch (error) {
    next(error)
  }
};


export const verifyEmail = async(req: Request<{token: string}>, res:Response, next: NextFunction) => {
  try {
    const { token } = req.query;
    const user = await findUserByVerificationToken(token as string);
    if (!user) {
      throw new AppError("Invalid or expired verification token", 400);
    }
    await markUserAsVerified(user.id);
    handleResponse(res, 200, "Email verified successfully. You can now log in.");
  } catch (error) 
  {   next(error);
  }
  
}

export const logIn = async (
  req: Request<{}, {}, LogInType>,
  res: Response,
  next: NextFunction,
) => {
  try {
    // FIX 1: Removed `id` from here. The frontend only sends email and password!
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
    // Check if email is verified
    if (!user.isVerified) {
      throw new AppError("Please verify your email before logging in", 401);
    }

    // FIX 2: We now pass `user.id` as the first argument to generateToken!
    const token = generateToken(user.id, user.email, user.name);

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

    // FIX 3: Also pass `user.id` here for users who log in with Google!
    const token = generateToken(user.id, user.email, user.name);
    
    // Send response
    handleResponse(res, 200, "Logged in with Google successfully", {
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};