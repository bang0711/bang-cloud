"use client";
import React, { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import router from "next/router";

type Props = {
  apiKey: string;
};

function UploadImage({ apiKey }: Props) {
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleUpload = async () => {
    // Set loading state for UI
    setIsLoading(true);

    // Fetch the upload url
    const res = await fetch("/api/upload", {
      headers: {
        Authorized: `Bearer ${apiKey}`,
      },
      method: "POST",
      body: image,
    });

    // Get the result from the backend
    const result: ResponseFromAPI = await res.json();

    // Check if the upload is failed
    if (result.status !== 200) {
      toast({ title: result.message, duration: 1000, variant: "destructive" });
      return;
    }

    // Check if the upload is success
    toast({ title: "Image uploaded", duration: 1000 });
    // Remove the current image
    setImage(null);

    // Remove loading state for UI
    setIsLoading(false);

    // Reload the UI
    router.refresh();
  };
  return (
    <div className="mx-auto flex w-fit flex-col items-center gap-3">
      <Label htmlFor="image">
        <Button onClick={handleButtonClick}>Upload</Button>
      </Label>
      <Input
        onChange={handleChange}
        hidden
        id="image"
        type="file"
        className="hidden"
        ref={fileInputRef}
      />

      {image && (
        <div className="flex flex-col items-center gap-3">
          <Image
            alt="Image"
            src={URL.createObjectURL(image)}
            width={300}
            height={400}
            className="mx-auto"
          />

          <Button onClick={handleUpload} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Loading
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default UploadImage;
