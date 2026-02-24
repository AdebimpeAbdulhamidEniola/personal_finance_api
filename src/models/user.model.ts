import { prisma } from '../lib/prisma'
import { SignUpType } from '@/schema/auth.schema'
import {Prisma} from '../generated/prisma/client'

export const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            name: true,
            passwordhash: true,
            isVerified: true,
        }
    })
}

export const createUser = async (data: Prisma.UserCreateInput) => {
    const {email, name,passwordhash, verificationToken } = data
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
    })
}

export const findOrCreateGoogleUser = async (email: string, name: string, googleUid: string) => {
    const existingUser = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            name: true,
        }
    })

    if (existingUser) {
        return existingUser
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
    })
}


export const  findUserById = async (id: string) => {
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
    })
}

export const updateUserProfile = async (id: string, data: Prisma.UserUpdateInput) => {
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
    })
}   

export const markUserAsVerified = async (id: string) => {
    return await prisma.user.update({
        where: { id },
        data: { isVerified: true },
        select: {
            id: true,
            email: true,
            name: true,
            isVerified: true,
        }
    })
}

export const findUserByVerificationToken = async (token: string) => {
    return await prisma.user.findUnique({
        where: { verificationToken: token },
        select: {
            id: true,
            email: true,
            name: true,
        }
    })
}
