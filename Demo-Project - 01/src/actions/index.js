// src/actions/index.js
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
    getCookies.set("token", "", { path: '/', expires: new Date(0) }); // Clear the cookie by setting it to expire immediately
    
    return {
        success: true,
        message: "Logout successful"
    };
}

export async function updateUserProfile(formData) {
    await connectToDB();

    try {
        const { userName, userEmail, userPassword, _id } = formData;

        // Check if all update fields are empty
        if (!userName && !userEmail && !userPassword) {
            return { success: false, message: "Provide update data for update profile." };
        }

        // Find the user by _id
        const user = await User.findById(_id);
        if (!user) {
            return { success: false, message: "User not found." };
        }

        // Prepare updates
        const updateData = {};
        if (userName) updateData.userName = userName;
        if (userEmail) updateData.userEmail = userEmail;
        if (userPassword) {
            // Hash the new password
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(userPassword, salt);
            updateData.userPassword = hashedPassword;
        }

        // Update user document in MongoDB
        const updatedUser = await User.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedUser) {
            return { success: false, message: "Failed to update user." };
        }

        return {
            success: true,
            data: JSON.parse(JSON.stringify(updatedUser))
        };

    } catch (error) {
        console.log(error);
        return { success: false, message: "An error occurred while updating the profile." };
    }
}