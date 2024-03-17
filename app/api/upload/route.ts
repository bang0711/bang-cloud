import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Get the header to check the api key
  const header = req.headers.get("Authorized");

  // Get the user from the session
  const { user } = await validateRequest();

  // Get the image from the body
  const image = await req.blob();

  // If there is no image from the body, return the appropriate message and status
  if (!image) {
    return NextResponse.json({
      message: "Please provide an image.",
      status: 400,
    });
  }

  // Get the Buffer array from the image
  const buffer = await image.arrayBuffer();

  // Convert ArrayBuffer to Buffer
  const imageBuffer = Buffer.from(buffer);

  // Create a new image into database
  const newImage = await prisma.image.create({
    data: {
      image_data: imageBuffer,
      type: image.type,
      User: {
        connect: {
          id: user?.id,
        },
      },
    },
  });

  // Decrease the usage of api key by 1
  await prisma.aPIKey.update({
    where: {
      userId: user?.id,
    },
    data: {
      valid_times: {
        decrement: 1,
      },
    },
  });
  // Return the id of the image and the image url
  return NextResponse.json({
    imageId: newImage.id,
    imageUrl: `${process.env.API_BASE_URL}${newImage.id}`,
    status: 200,
  });
}
