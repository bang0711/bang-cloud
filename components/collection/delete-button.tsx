"use client";
import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { deleteImage } from "@/lib/action";
import { useToast } from "../ui/use-toast";

type Props = {
  id: string;
};

function DeleteButton({ id }: Props) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  return (
    <form
      action={() =>
        startTransition(async () => {
          const res = await deleteImage(id);
          if (res.status !== 200) {
            toast({
              title: res.message,
              duration: 1000,
              variant: "destructive",
            });
            return;
          }

          toast({ title: res.message, duration: 1000 });
        })
      }
    >
      <Button variant={"destructive"} disabled={isPending}>
        Delete
      </Button>
    </form>
  );
}

export default DeleteButton;
