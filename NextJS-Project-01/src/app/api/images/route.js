// src/app/api/images
import { connectToDB } from "@/database";
import { Expense } from "@/models/expense";
import { NextResponse } from "next/server";
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.resolve(process.cwd(), "public/uploads");

export async function GET(request) {
    try {
        await connectToDB();
        const url = new URL(request.url);
        const userId = url.searchParams.get('user');

        if (!userId) {
            return NextResponse.json({ success: false, message: "User ID missing" }, { status: 400 });
        }

        const expenses = await Expense.find({ user: userId });
        return NextResponse.json({ success: true, expenses });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch data" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectToDB();
        const formData = await request.formData();
        const expid = formData.get("expid");
        const expname = formData.get("expname");
        const expprice = formData.get("expprice");
        const expdate = formData.get("expdate");
        const user = formData.get("user");

        if (!expid || !expname || !expprice || !expdate || !user) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        // Check for uniqueness of expid for the user
        const existingExpense = await Expense.findOne({ expid, user });
        if (existingExpense) {
            return NextResponse.json({ success: false, message: "Expense ID must be unique for each user" }, { status: 400 });
        }

        let imagePath = '';
        if (formData.has("file")) {
            const file = formData.get("file");
            if (file && file.size > 0) {
                const fileName = Date.now() + path.extname(file.name);
                const filePath = path.join(UPLOAD_DIR, fileName);
                
                // Check if file already exists
                if (!fs.existsSync(filePath)) {
                    fs.writeFileSync(filePath, Buffer.from(await file.arrayBuffer()));
                }
                
                imagePath = `/uploads/${fileName}`; // Adjusted to reflect URL path
            }
        }

        const newExpense = await Expense.create({
            expid,
            expname,
            expprice,
            expdate,
            expimg: imagePath,
            user
        });

        return NextResponse.json({ success: true, ...newExpense });
    } catch (error) {
        console.error("Error creating data:", error);
        return NextResponse.json({ success: false, message: "Failed to create data" }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        await connectToDB();
        const formData = await request.formData();
        const id = formData.get("id");
        const expid = formData.get("expid");
        const expname = formData.get("expname");
        const expprice = formData.get("expprice");
        const expdate = formData.get("expdate");

        if (!id || !expid || !expname || !expprice || !expdate) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        const existingExpense = await Expense.findById(id);
        if (!existingExpense) {
            return NextResponse.json({ success: false, message: "Expense not found" }, { status: 404 });
        }

        // Check if the new expid is unique for the user
        const duplicateExpense = await Expense.findOne({ expid, user: existingExpense.user });
        if (duplicateExpense && duplicateExpense._id.toString() !== id) {
            return NextResponse.json({ success: false, message: "Expense ID must be unique for each user" }, { status: 400 });
        }

        let imagePath = existingExpense.expimg;
        if (formData.has("file")) {
            const file = formData.get("file");
            if (file && file.size > 0) {
                if (imagePath && fs.existsSync(path.join(UPLOAD_DIR, path.basename(imagePath)))) {
                    fs.unlinkSync(path.join(UPLOAD_DIR, path.basename(imagePath)));
                }
                const fileName = Date.now() + path.extname(file.name);
                imagePath = path.join(UPLOAD_DIR, fileName);
                
                // Check if file already exists
                if (!fs.existsSync(imagePath)) {
                    fs.writeFileSync(imagePath, Buffer.from(await file.arrayBuffer()));
                }
                
                imagePath = `/uploads/${fileName}`; // Adjusted to reflect URL path
            }
        }

        const updatedExpense = await Expense.findByIdAndUpdate(id, { expid, expname, expprice, expdate, expimg: imagePath }, { new: true });
        return NextResponse.json({ success: true, ...updatedExpense });
    } catch (error) {
        console.error("Error updating data:", error);
        return NextResponse.json({ success: false, message: "Failed to update data" }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await connectToDB();
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
        }

        const expense = await Expense.findById(id);
        if (!expense) {
            return NextResponse.json({ success: false, message: "Expense not found" }, { status: 404 });
        }

        // Only delete the database record, not the file
        await Expense.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Expense deleted successfully" });
    } catch (error) {
        console.error("Error deleting data:", error);
        return NextResponse.json({ success: false, message: "Failed to delete data" }, { status: 500 });
    }
}