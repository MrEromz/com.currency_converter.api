import * as z from "zod";

export const SignUp = z.object({
    email: z.email({message: 'Invalid email provided'}).min(5),
    password: z.string().min(8, {message: 'Password must be at least 8 characters long'}),
    firstname: z.string().min(2, {message: 'First name is required'}),
    lastname: z.string().min(2, {message: 'Last name is required'})
})

export const Login = z.object({
    email: z.email({message: 'Invalid email format'}).min(5),
    password: z.string().min(8, {message: 'Password must be at least 8 characters long'})
})