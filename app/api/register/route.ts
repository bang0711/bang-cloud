import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
export async function POST(req: Request) {
  const body = await req.json();
  const { email, name, password } = body;
  if (!email || !name || !password) {
    return NextResponse.json({
      message: "Please provide all required fields.",
      status: 400,
    });
  }

  const isUserExisting = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExisting) {
    return NextResponse.json({
      message: "User already exist.",
      status: 400,
    });
  }
  const length = new TextEncoder().encode(password).length;
  const hashedPassword = await bcrypt.hash(password, length);

  const newUser = await prisma.user.create({
    data: {
      email,
      hashedPassword,
      name,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6Bla4a1fQemjdDv19BrNpl46791XI7E_gwQ&usqp=CAU",
    },
  });
  await prisma.aPIKey.create({
    data: {
      user: {
        connect: newUser,
      },
    },
  });
  return NextResponse.json({
    message: "User created successfully.",
    status: 201,
  });
}
