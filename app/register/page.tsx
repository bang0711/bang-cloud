import RegisterForm from "@/components/auth/register-form";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Register Page",
};
function AuthPage() {
  return (
    <div className="h-screen w-full">
      <RegisterForm />
    </div>
  );
}

export default AuthPage;
