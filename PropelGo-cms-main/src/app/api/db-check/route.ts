
import { NextResponse } from "next/server";
import { testDatabaseConnection } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const connected = await testDatabaseConnection();

    if (!connected) {
      return NextResponse.json(
        { success: false, message: "Database connection failed." },
        { status: 503 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "CMS database connected successfully.",
    });
  } catch (error) {
    console.error("Database connection check failed:", error);

    return NextResponse.json(
      { success: false, message: "Database connection failed." },
      { status: 503 },
    );
  }
}
