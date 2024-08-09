import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.resolve("", "public/uploads");

// Handle POST requests to /api/upload
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const name = formData.get("name");

    if (file && name) {
      const buffer = Buffer.from(await file.arrayBuffer());

      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }

      fs.writeFileSync(
        path.resolve(UPLOAD_DIR, file.name),
        buffer
      );

      return NextResponse.json({
        success: true,
        name: name,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "File or name is missing.",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}