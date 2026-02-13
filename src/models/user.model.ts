import { prisma } from '../lib/prisma'
import { SignUpType } from '@/schema/auth.schema'

export const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            name: true,
            passwordhash: true,
        }
    })
}

export const createUser = async (data: Omit<SignUpType, 'password' | 'confirmPassword'> & {passwordHash: string}) => {
    const {email, name, passwordHash} = data
    return await prisma.user.create({
        data: {
            email,
            name,
            passwordhash:passwordHash,
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
