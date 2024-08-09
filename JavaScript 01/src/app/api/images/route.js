import { connectToDatabase } from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { ObjectId } from "mongodb";

export async function GET(req) {
    try {
        const { db } = await connectToDatabase();
        const images = await db.collection('images').find({}).toArray();
        return NextResponse.json(images);
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
// POST Handler
export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");
        const name = formData.get("name");

        if (file && name) {
            // Ensure uploads directory exists
            const uploadDir = path.resolve(process.cwd(), "public/uploads");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Handle file upload logic
            const buffer = Buffer.from(await file.arrayBuffer());
            const filePath = path.join(uploadDir, file.name);
            fs.writeFileSync(filePath, buffer);

            // Save file details to MongoDB
            const { db } = await connectToDatabase();
            const result = await db.collection('images').insertOne({
                name: name,
                url: `/uploads/${file.name}`, // Adjust path if needed
            });

            console.log("File uploaded and saved to DB:", {
                name: name,
                url:`/uploads/${file.name}`,
                _id: result.insertedId,
            }); // Debugging line

            return NextResponse.json({
                success: true,
                name: name,
                url: `/uploads/${file.name}`,
                _id: result.insertedId,
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "File or name is missing.",
            });
        }
    } catch (error) {
        console.error("Error in POST handler:", error.message); // Debugging line
        return NextResponse.json({
            success: false,
            message: error.message,
        });
    }
}

// DELETE Handler
export async function DELETE(req) {
    try {
        const { id } = await req.json();
        const { db } = await connectToDatabase();
        const result = await db.collection('images').deleteOne({ _id: new ObjectId(id) });

        console.log("Delete result:", result); // Debugging line

        if (result.deletedCount > 0) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, message: "Delete failed." });
        }
    } catch (error) {
        console.error("Error in DELETE handler:", error.message); // Debugging line
        return NextResponse.json({ success: false, message: error.message });
    }
}

// PATCH Handler
export async function PATCH(req) {
    try {
        const formData = await req.formData();
        const id = formData.get("id");
        const name = formData.get("name");
        const file = formData.get("file");

        const { db } = await connectToDatabase();

        let updatedData = { name: name };

        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const uploadDir = path.resolve(process.cwd(), "public/uploads");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, file.name);
            fs.writeFileSync(filePath, buffer);

            updatedData.url = `/uploads/${file.name}`;
        }

        const result = await db.collection('images').updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedData }
        );

        console.log("Update result:", result); // Debugging line

        if (result.modifiedCount > 0) {
            return NextResponse.json({
                success: true,
                name: updatedData.name,
                url: updatedData.url || null,
            });
        } else {
            return NextResponse.json({ success: false, message: "Update failed." });
        }
    } catch (error) {
        console.error("Error in PATCH handler:", error.message); // Debugging line
        return NextResponse.json({ success: false, message: error.message });
    }
}