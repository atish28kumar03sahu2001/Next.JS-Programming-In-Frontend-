import NextAuth, { CredentialsSignin } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import CredentialProvider from 'next-auth/providers/credentials';
import { User } from "./models/userModel";
import { compare } from "bcryptjs";
import { connectToDatabase } from "./lib/util";
export const {handlers, signIn, signOut, auth} = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        CredentialProvider({
            name:"Credentials",
            credentials:{
                name: {label: "Username",type:"text"},
                email: {label: "Email",type:"email"},
                password: {label:"Password",type:"password"},
            },
            authorize: async (credentials)=>{
                const name = credentials.name as string | undefined;
                const email = credentials.email as string | undefined;
                const password = credentials.password as string | undefined;

                if(!name || !email || !password)  throw new CredentialsSignin("Please Provide All The Given Credentials");

                await connectToDatabase();

                const user = await User.findOne({email}).select("+password");

                if(!user) throw new CredentialsSignin({cause: "User Not Found"});

                if(!user.password) throw new CredentialsSignin({cause: "Invalid Credential"});

                const isMatch = await compare(password, user.password);

                if(!isMatch) throw new CredentialsSignin({cause: "Invalid Credential"});

                return {name: user.name, email: user.email, id:user._id};
            }
        })
    ],
    pages:{
        signIn: "/login",
    }
});