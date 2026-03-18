import { prisma } from '../lib/prisma';
export const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            name: true,
            passwordhash: true,
            isVerified: true,
        }
    });
};
export const createUser = async (data) => {
    const { email, name, passwordhash, verificationToken } = data;
    return await prisma.user.create({
        data: {
            email,
            name,
            passwordhash,
            verificationToken
        },
        select: {
            id: true,
            email: true,
            name: true,
        }
    });
};
export const findOrCreateGoogleUser = async (email, name, googleUid) => {
    const existingUser = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            name: true,
        }
    });
    if (existingUser) {
        return existingUser;
    }
    return await prisma.user.create({
        data: {
            email,
            name,
            googleUid,
            passwordhash: '', // No password for Google users
        },
        select: {
            id: true,
            email: true,
            name: true,
        }
    });
};
export const findUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            name: true,
            monthlyIncome: true,
            savingsGoal: true,
            createdAt: true,
            updatedAt: true,
        }
    });
};
export const updateUserProfile = async (id, data) => {
    return await prisma.user.update({
        where: { id },
        data,
        select: {
            id: true,
            email: true,
            name: true,
            monthlyIncome: true,
            savingsGoal: true,
            createdAt: true,
            updatedAt: true,
        }
    });
};
export const markUserAsVerified = async (id) => {
    return await prisma.user.update({
        where: { id },
        data: { isVerified: true },
        select: {
            id: true,
            email: true,
            name: true,
            isVerified: true,
        }
    });
};
export const findUserByVerificationToken = async (token) => {
    return await prisma.user.findUnique({
        where: { verificationToken: token },
        select: {
            id: true,
            email: true,
            name: true,
        }
    });
};
