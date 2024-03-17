import prisma from "@/lib/prisma";
import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/action";

type Props = {};
async function Homepage({}: Props) {
  const { user } = await validateRequest();

  if (!user) {
    return <div>Not Login</div>;
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
