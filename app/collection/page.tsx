import DeleteButton from "@/components/collection/delete-button";
import { Button } from "@/components/ui/button";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};

async function CollectionPage({}: Props) {
  const { user } = await validateRequest();
  const images = await prisma.image.findMany({
    where: {
      userId: user?.id,
    },
  });
  const baseUrl = process.env.API_BASE_URL!;
  return (
    <div className="flex flex-col gap-2 p-3">
      <Link href={"/dashboard"} className=" mx-auto">
        <Button>Dashboard</Button>
      </Link>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {images.map((image) => {
          return (
            <div key={image.id} className="flex flex-col items-center gap-2">
              <Link href={`/image/${image.id}`}>
                <Image
                  alt={image.id}
                  width={150}
                  height={200}
                  src={`${baseUrl}${image.id}`}
                  className="h-auto: mx-auto w-32"
                />
              </Link>

              <DeleteButton id={image.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CollectionPage;
