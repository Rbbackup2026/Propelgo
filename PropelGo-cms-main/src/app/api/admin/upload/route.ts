import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Please log in first." },
        { status: 401 },
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("Cloudinary environment variables are missing.");

      return NextResponse.json(
        {
          success: false,
          message: "Image storage is not configured on the server.",
        },
        { status: 500 },
      );
    }

    const incoming = await request.formData();
    const file = incoming.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "Please select an image." },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only JPG, PNG, WEBP and GIF images are allowed.",
        },
        { status: 400 },
      );
    }

    if (file.size === 0 || file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Image size must be greater than 0 and no more than 5 MB.",
        },
        { status: 400 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    // Verify that the selected file's contents match an allowed image format.
    const validJpeg =
      bytes.length >= 3 &&
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff;

    const validPng =
      bytes.length >= 8 &&
      bytes.subarray(0, 8).equals(
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      );

    const validWebp =
      bytes.length >= 12 &&
      bytes.toString("ascii", 0, 4) === "RIFF" &&
      bytes.toString("ascii", 8, 12) === "WEBP";

    const validGif =
      bytes.length >= 6 &&
      ["GIF87a", "GIF89a"].includes(bytes.toString("ascii", 0, 6));

    const validSignature =
      (file.type === "image/jpeg" && validJpeg) ||
      (file.type === "image/png" && validPng) ||
      (file.type === "image/webp" && validWebp) ||
      (file.type === "image/gif" && validGif);

    if (!validSignature) {
      return NextResponse.json(
        { success: false, message: "The selected file is not a valid image." },
        { status: 400 },
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "propelgo-cms";

    const signaturePayload =
      `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

    const signature = createHash("sha1")
      .update(signaturePayload)
      .digest("hex");

    const uploadData = new FormData();

    uploadData.append(
      "file",
      new Blob([bytes], { type: file.type }),
      file.name,
    );
    uploadData.append("api_key", apiKey);
    uploadData.append("timestamp", String(timestamp));
    uploadData.append("folder", folder);
    uploadData.append("signature", signature);

    const cloudResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: uploadData,
        cache: "no-store",
      },
    );

    const cloudResult = await cloudResponse.json();

    if (!cloudResponse.ok || !cloudResult.secure_url) {
      console.error("Cloudinary upload failed:", cloudResult.error);

      return NextResponse.json(
        { success: false, message: "Unable to upload the image." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded successfully.",
        data: {
          image_url: cloudResult.secure_url,
          public_id: cloudResult.public_id,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Image upload failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to upload the image." },
      { status: 500 },
    );
  }
}