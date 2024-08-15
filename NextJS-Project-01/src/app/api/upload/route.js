// src/app/api/upload/route.js
import { connectToDB } from "@/database";
import { Expense } from "@/models/expense";
import { NextResponse } from "next/server";
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.resolve(process.cwd(), "public/uploads");

export async function POST(request) {
    try {
        await connectToDB();
        const formData = await request.formData();
        const file = formData.get("file");
        if (file && file.size > 0) {
            const fileName = Date.now() + path.extname(file.name);
            const filePath = path.join(UPLOAD_DIR, fileName);
            fs.writeFileSync(filePath, Buffer.from(await file.arrayBuffer()));
            return NextResponse.json({ success: true, filePath: `/uploads/${fileName}` });
        }
        return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ success: false, message: "Failed to upload file" }, { status: 500 });
    }
}