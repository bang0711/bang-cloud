import LoginForm from "@/components/auth/login-form";
import React from "react";

type Props = {};

function LoginPage({}: Props) {
  return (
    <div className="h-screen w-full ">
      <LoginForm />
    </div>
  );
}

export default LoginPage;
