import LoginForm from "@/components/auth/login-form";
import { Metadata } from "next";
import React from "react";

type Props = {};
export const metadata: Metadata = {
  title: "Login Page",
};
function LoginPage({}: Props) {
  return (
    <div className="h-screen w-full ">
      <LoginForm />
    </div>
  );
}

export default LoginPage;
