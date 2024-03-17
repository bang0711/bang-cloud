import APIKeySection from "@/components/dashboard/api-key-section";
import UploadImage from "@/components/dashboard/upload-image";
import { Button } from "@/components/ui/button";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};
export const metadata: Metadata = {
  title: "Dashboard Page",
};
async function DashBoardPage({}: Props) {
  const { user } = await validateRequest();

  const apiKey = await prisma.aPIKey.findUnique({
    where: {
      userId: user?.id,
    },
  });
  if (!apiKey) {
    return null;
  }

  return (
    <div className="flex flex-col justify-center gap-3 p-3">
      <Image
        alt={user?.name as string}
        src={user?.image as string}
        width={200}
        height={200}
        className=" mx-auto rounded-full"
      />
      <Link href={"/collection"} className="mx-auto">
        <Button>Collection</Button>
      </Link>
      <p className="text-center">
        Welcome <span className="font-bold">{user?.name}</span>
      </p>
      <p className="text-center">
        Your API key can use to upload{" "}
        <span className="font-bold">{apiKey?.valid_times}</span> times
      </p>
      <APIKeySection apiKey={apiKey.value} apiKeyId={apiKey.id} />
      <UploadImage apiKey={apiKey.value} />
    </div>
  );
}

export default DashBoardPage;
