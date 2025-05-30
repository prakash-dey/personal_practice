import {z} from 'zod';

export const signupValidation = function (userData : {name: string, email: string, password: string}) {
    const userSchema = z.object({
        name: z.string().min(3, "Name must be at least 3 characters long"),
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
    });

    return userSchema.safeParse(userData);
}
export const signinValidation = function (userData : {email: string, password: string}) {
    const userSchema = z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
    });

    return userSchema.safeParse(userData);
}