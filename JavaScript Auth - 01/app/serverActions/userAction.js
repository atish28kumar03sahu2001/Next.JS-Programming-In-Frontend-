'use server'

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { connectToDB } from "@/utils/connectdb";
import { User } from "@/models/userModel";
import bcrypt from "bcrypt";

export async function authenticate({ username, usermail, userpassword }) {
    try {
        await connectToDB();
        const user = await User.findOne({ usermail });

        if (!user) {
            return "Invalid Credentials.";
        }

        const isPasswordValid = await bcrypt.compare(userpassword, user.userpassword);

        if (!isPasswordValid) {
            return "Invalid Credentials.";
        }

        await signIn('credentials', { username, usermail, userpassword });
        return "Authenticated";
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid Credentials.";
                default:
                    return "Something went wrong";
            }
        }
        return "Something went wrong";
    }
}

export async function registerUser(info) {
    try {
        await connectToDB();
        const { username, usermail, userpassword } = info;

        if (!username || !usermail || !userpassword) return { error: "Must Provide All Fields" };

        const emailPatternValidator = /^(([^<>()\[\]\\.,;:\s@"]+(.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!emailPatternValidator.test(usermail)) return { error: "Invalid Email" };

        if (username.trim().length <= 5 || userpassword.trim().length <= 5) return { error: "Minimum 6 Characters Required" };

        const exists = await User.findOne({ $or: [{ usermail }, { username }] });
        if (exists) return { error: "Username or Usermail already registered" };

        const hashedPassword = await bcrypt.hash(userpassword, 10);
        console.log('Creating user:', { username, usermail, userpassword: hashedPassword });
        await User.create({ username, usermail, userpassword: hashedPassword });

        console.log('User created successfully');
        return {};
    } catch (error) {
        console.error('Error during registration:', error);
        return { error: "Something went wrong" };
    }
}
