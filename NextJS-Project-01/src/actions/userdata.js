// src/actions/userdata.js
'use server';
import { connectToDB } from "@/database";
import { Expense } from "@/models/expense";

export async function PostData(formData, userId) {
    await connectToDB();
    try {
        const {expid, expname, expprice,expdate, expimg} = formData;
        const checkData = await Expense.findOne({expid});
        if(checkData) {
            return {
                success: false,
                mesggae: "Expense Id Already Exist Give Unique Id",
            }
        }
        const newlyCreatedData = new Expense({
            expid, expname, expprice,expdate, expimg, user: userId
        });
        const savedData = await newlyCreatedData.save();
        if(savedData){
            return{
                success: true,
                data: JSON.parse(JSON.stringify(savedData))
            }
        } else {
            return {
                success: false,
                message: "Invalid Credential. Try Again!",
            }
        }
    } catch(error) {
        console.log(error);
        return{
            message: "Something Error Occured",
            success: false,
        }
    }
}

export async function GetData (userId) {
    await connectToDB();
    try{
        const userExpenses = await Expense.find({ user: userId });
        return {
            success: true,
            data: JSON.parse(JSON.stringify(userExpenses)),
        };
    }catch (error) {
        console.log(error);
        return {
            message: "Something went wrong while fetching user data",
            success: false,
        };
    }
}