// Import for database querying
import prisma from "@/lib/prisma";

// Import for response from the server
import { NextResponse } from "next/server";

// Import library for password comparison
import bcrypt from "bcrypt";
import { object } from "zod";

export async function POST(req: Request) {
  // Get the data from the request coming from front-end
  const body = await req.json();

  // Extract the email and password from the body
  const { email, password } = body;

  // Check if the request contain all essential information or not
  if (!email || !password) {
    return NextResponse.json({
      message: "Missing required fields.",
      status: 400,
    });
  }
  // Check if the user is exiting or not
  const isUserEXisting = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  // If there is no user with that email, return the message and status
  if (!isUserEXisting) {
    return NextResponse.json({ message: "User not found.", status: 404 });
  }

  // Check if password is match or not
  const isPasswordMatch = await bcrypt.compare(
    password,
    isUserEXisting.hashedPassword,
  );

  // If password does not match, return the message and status
  if (!isPasswordMatch) {
    return NextResponse.json({
      message: "Password does not match.",
      status: 400,
    });
  }

  // After al the validation, return that user as an message with status of 200
  return NextResponse.json({
    object: {
      id: isUserEXisting.id,
      name: isUserEXisting.name,
      email: isUserEXisting.email,
      image: isUserEXisting.image,
    },
    status: 200,
  });
}
