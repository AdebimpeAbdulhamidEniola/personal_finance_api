import {z} from 'zod';

export const signUpSchema = z.object({
    email: z.email({
        error:(issue) => {
            if (issue.input === undefined) {
                return 'Email is required';
            }
            return 'Invalid email address';
        }
    }),

    password: z.string({
        error: (issue) => {
            if (issue.input === undefined) {
                return 'Password is required';
            }
            return 'Invalid password';
        }
    })
    .min(8, 'Password must be at least 8 characters long'),

    confirmPassword: z.string({
        error: (issue) => {
            if (issue.input === undefined) {
                return 'Confirm password is required';
            }
            return 'Invalid confirm password';
        }
    })
    .min(8, 'Confirm password must be at least 8 characters long'),

    name: z.string({
        error: (issue) => {
            if (issue.input === undefined) {
                return 'Name is required';
            }
            return 'Invalid name';
        }
    })
    .min(2, 'Name must be at least 2 characters long')
}).strict()
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});



export const logInSchema = z.object({
    email: z.email({
        error: (issue) => {
            if (issue.input === undefined) {
                return 'Email is required';
            }
            return 'Invalid email address';
        }
    }),
    password: z.string({
        error: (issue) => {
            if (issue.input === undefined) {
                return 'Password is required';
            }
            return 'Invalid password';
        }
    })
}).strict();        

export type SignUpType = z.infer<typeof signUpSchema>;
export type LogInType = z.infer<typeof logInSchema>;