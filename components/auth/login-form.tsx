"use client";
import React, { useState } from "react";
// Import form UI
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// Import form validation
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

// Import loading state UI and notification
import { Loader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

// Import for authentication
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { login } from "@/lib/action";
type Props = {};
// Define schema for the form validation
const formSchema = z.object({
  email: z.string().email({
    message: "This field only accept email",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters",
  }),
});

function LoginForm({}: Props) {
  // Define variables for UI loading, navigation and notification
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Define the form resolver and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Define function handle the submit event
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    // Start loading state
    setIsLoading(true);

    // Make a POSt request to the backend
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(values),
    });

    // Catch the response from the API
    const response: ResponseFromAPI = await res.json();

    // Check if the status of the function is failed
    if (response.status !== 200) {
      toast({
        title: response.message,
        variant: "destructive",
        duration: 1000,
      });
      setIsLoading(false);
      return;
    }

    //  Call the function login
    const check = await login(response.object?.id as string);
    // Notification and user navigation
    toast({
      title: "Welcome",
      duration: 1000,
    });
    setIsLoading(false);

    router.push("/");
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="m-auto w-full space-y-8 rounded-md border border-muted-foreground p-3 shadow-md md:w-1/2 lg:w-1/3"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter Your Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Your Password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading} type="submit" className="gap-2">
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Loading
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;
