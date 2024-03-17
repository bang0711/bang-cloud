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

type Props = {};
// Define schema for the form validation
const formSchema = z
  .object({
    email: z.string().email({
      message: "This field only accept email",
    }),
    name: z.string().min(2, {
      message: "Name must be at least 2 characters",
    }),
    password: z.string().min(2, {
      message: "Password must be at least 2 characters",
    }),
    confirmPassword: z.string().min(2),
  })
  // Define the rule of checking confirmation password
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirmation password does not match",
    path: ["confirmPassword"],
  });

function RegisterForm({}: Props) {
  // Define variables for UI loading, navigation and notification
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Define the form resolver and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirmPassword: "",
      email: "",
      name: "",
      password: "",
    },
  });

  // Define function handle the submit event
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    // Start loading state
    setIsLoading(true);

    // Make a POSt request to the backend
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(values),
    });

    // Catch the response from the API
    const response: ResponseFromAPI = await res.json();

    // Check if the status of the function is failed
    if (response.status !== 201) {
      toast({
        title: response.message,
        variant: "destructive",
        duration: 1000,
      });
      setIsLoading(false);
      return;
    }

    // Check if the status of the function is successful
    toast({ title: response.message, duration: 1000 });
    setIsLoading(false);

    // Redirect user to the login page
    router.push("/login");
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Your Name" {...field} />
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter Your Password Again"
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
            "Register"
          )}
        </Button>
      </form>
    </Form>
  );
}

export default RegisterForm;
