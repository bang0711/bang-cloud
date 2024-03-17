"use client";
import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import { regenerateKey } from "@/lib/action";
import { useToast } from "../ui/use-toast";

type Props = {
  apiKey: string;
  apiKeyId: string;
};

function APIKeySection({ apiKey, apiKeyId }: Props) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  return (
    <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
      <p className="rounded-md border p-3 shadow-md">{apiKey}</p>
      <div className="flex items-center gap-2">
        <form
          action={() =>
            startTransition(async (): Promise<any> => {
              // Call the regenerate api key function
              const res = await regenerateKey(apiKeyId);

              // Check if the regeneration is failed
              if (res.status !== 200) {
                toast({
                  title: res.message,
                  variant: "destructive",
                  duration: 1000,
                });
                return;
              }
              // Check if the regeneration is success
              toast({
                title: res.message,
                duration: 1000,
              });
            })
          }
        >
          <Button disabled={isPending} className="flex items-center gap-2">
            <RefreshCcw className={`${isPending && "animate-spin"}`} />
            Regenerate
          </Button>
        </form>
        <Button
          disabled={isPending}
          onClick={() => navigator.clipboard.writeText(apiKey)}
        >
          Copy
        </Button>
      </div>
    </div>
  );
}

export default APIKeySection;
