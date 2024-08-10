'use server';

import { connectToDB } from "@/database";
import { User } from "@/models";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";

export async function registerUser(formData) {
    await connectToDB();
    try {
        const {userName, userEmail, userPassword} = formData;
        const checkUser = await User.findOne({userEmail});
        if(checkUser){
            return {
                success: false,
                mesggae: "User Already Exist. Please Try Different Email"
            }
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(userPassword, salt);
        const newlyCreatedUser = new User({
            userName, userEmail, userPassword: hashedPassword
        })
        const savedUser = await newlyCreatedUser.save();
        if(savedUser){
            return{
                success: true,
                data: JSON.parse(JSON.stringify(savedUser))
            }
        } else {
            return {
                success: false,
                message: "Invalid Credential. Try Again!",
            }
        }
    } catch (error) {
        console.log(error);
        return{
            message: "Something Error Occured",
            success: false,
        }
    }
}

export async function SignInUser(formData) {
    await connectToDB();
    try{
        const {userName, userEmail, userPassword} = formData;
        const checkUser = await User.findOne({userEmail});
        if(!checkUser) {
            return {
                success: false,
                message: "User Doesn't Exist. Please SignUp",
            }
        }
        const checkPassword = await bcryptjs.compare(userPassword, checkUser.userPassword);
        if(!checkPassword) {
            return {
                success: false,
                message: "Password Is Incorrect",
            };
        }
        const createTokenData = {
            id: checkUser._id,
            userName: checkUser.userName,
            userEmail: checkUser.userEmail,
        }
        const token = jwt.sign(createTokenData,"DEFAULT_KEY", {expiresIn:'1d'});
        
        const getCookies = cookies();
        getCookies.set('token',token);

        return{
            success: true,
            message: "Login Successful",
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Invalid Credentail. Try Again!"
        }
    }
}

export async function fetchAuthUserAction () {
    await connectToDB();
    try {
        const getCookies = cookies();
        const token = getCookies.get("token")?.value || "";
        if(token === ""){
            return {
                success: false,
                message: "Token Is InValid!"
            }
        }
        const decodeToken = jwt.verify(token, "DEFAULT_KEY");
        const userinfo = await User.findOne({_id:decodeToken.id});
        if(userinfo) {
            return {
                success:true,
                data: JSON.parse(JSON.stringify(userinfo))
            }
        } else {
            return {
                success: false,
                message: "Error Occured, Please try agin!"
            }
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Invalid Credentail. Try Again!"
        }
    }
}

export async function logoutAction() {
    const getCookies = cookies();
    getCookies.set("token","");
}