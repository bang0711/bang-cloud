import prisma from "@/lib/prisma";
import Image from "next/image";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

async function ImagePage({ params: { id } }: Props) {
  const image = await prisma.image.findUnique({
    where: { id },
  });
  if (!image) {
    return <div>No Image found!</div>;
  }
  return (
    <div className=" flex h-screen items-center justify-center">
      <Image
        alt={image.id}
        src={` ${process.env.API_BASE_URL}${id}`}
        width={200}
        height={300}
      />
    </div>
  );
}

export default ImagePage;
