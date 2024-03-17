"use server";

import { cookies } from "next/headers";
import { lucia, validateRequest } from "./auth";
import { v4 } from "uuid";
import prisma from "./prisma";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export async function register(email: string, name: string, password: string) {
  // Check if the front end provides all essential information
  if (!email || !name || !password) {
    return { message: "Please provide all required fields.", status: 400 };
  }
  // Check if the user with provided email is exist
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // If there is an user with that email, return the appropriate message and status
  if (isUserExist) {
    return { message: "User already exist.", status: 400 };
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create new user
  await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6Bla4a1fQemjdDv19BrNpl46791XI7E_gwQ&usqp=CAU",
    },
  });

  return { message: "User created successfully.", status: 201 };
}

export async function login(userId: string) {
  // Create a session using lucia
  const session = await lucia.createSession(userId, {});

  // Create a session cookie using lucia
  const sessionCookie = lucia.createSessionCookie(session.id);

  // Set attributes into cookies
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return sessionCookie.attributes;
}

export async function logout() {
  // Get the current session
  const { session } = await validateRequest();

  // If no session, throw an error
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  // Make that session become invalid which means it cannot be used
  await lucia.invalidateSession(session.id);

  // Make an empty session
  const sessionCookie = lucia.createBlankSessionCookie();

  // Set that empty session to the session we just found which means delete it
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}

export async function regenerateKey(id: string) {
  // Check if the api key is exist
  const isApiKeyExist = await prisma.aPIKey.findUnique({
    where: {
      id,
    },
  });

  // If api key does not exist, return the appropriate message
  if (!isApiKeyExist) {
    return { message: "API key not found", status: 404 };
  }

  // generate new api key
  await prisma.aPIKey.update({
    where: {
      id,
    },
    data: {
      value: v4(),
    },
  });

  // Revalidate the UI to get the new api key
  revalidatePath("/dashboard");

  // Send the appropriate message
  return { message: "API updated successfully", status: 200 };
}

export async function deleteImage(id: string) {
  // Check if frontend provide an ID
  if (!id) {
    return { message: "Please provide an ID.", status: 400 };
  }

  // Check if there is an image with provided ID
  const image = await prisma.image.findUnique({
    where: {
      id,
    },
  });

  // If there is no image with such ID, return the appropriate message and status
  if (!image) {
    return { message: "Image not found.", status: 404 };
  }

  // Delete the image
  await prisma.image.delete({
    where: {
      id,
    },
  });

  // Update UI
  revalidatePath("/collection");
  // Return the success message
  return { message: "Image deleted.", status: 200 };
}
