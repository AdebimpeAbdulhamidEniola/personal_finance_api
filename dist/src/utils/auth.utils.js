import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};
export const comparePassword = async (plain, hash) => {
    return await bcrypt.compare(plain, hash);
};
// FIX: Now correctly accepts id, email, and name to pack into the token
export const generateToken = (id, email, name) => {
    const options = {
        expiresIn: JWT_EXPIRES_IN
    };
    return jwt.sign({ id, email, name }, JWT_SECRET, options);
};
// FIX: Now correctly returns the id, email, and name when verifying
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
