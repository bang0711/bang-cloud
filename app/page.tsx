import { validateRequest } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/action";
import Link from "next/link";
import { Metadata } from "next";

type Props = {};
export const metadata: Metadata = {
  title: "Home Page",
};
async function Homepage({}: Props) {
  const { user } = await validateRequest();

  if (!user) {
    return (
      <div className="space-x-2 p-3">
        <Link href={"/login"}>
          <Button>Login</Button>
        </Link>
        <Link href={"/register"}>
          <Button>Register</Button>
        </Link>
      </div>
    );
  }
  return (
    <div>
      {user.email}
      <form action={logout}>
        <Button>SignOut</Button>
      </form>
    </div>
  );
}

export default Homepage;
