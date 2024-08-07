import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from 'next-auth/providers/credentials'
import { connectToDB } from "./utils/connectdb";
import { User } from "./models/userModel";
import bcrypt from "bcrypt";
export const {auth, signIn, signOut} = NextAuth({
    ...authConfig,
    providers:[
        Credentials({
            async authorize(credentials){
                try {
                    await connectToDB();
                    const user = await User.findOne({usermail: credentials.usermail});
                    if(!user) return null;
                    const isCorrect = await bcrypt.compare(credentials.userpassword, user.userpassword);
                    if(!isCorrect) return null;
                    return user;
                } catch (error) {
                    console.log("Error : ",error);
                    return null;
                }
            }
        })
    ]
})