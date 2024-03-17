import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // Get the ID from the
  const id = req.url.replace(process.env.API_BASE_URL!, "");

  // Check if the image with the just-found ID is exist
  const image = await prisma.image.findUnique({
    where: {
      id,
    },
  });

  // If there is no such an image with that ID, return the appropriate message and status
  if (!image) {
    return NextResponse.json({ message: "Image not found", status: 404 });
  }

  // Display the image from the backend
  return new Response(image.image_data, {
    headers: {
      "Content-Type": image.type,
    },
  });
}
