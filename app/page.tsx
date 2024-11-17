import { getSession } from "@/lib/getSession";
import { redirect } from "next/navigation";
import HomeComp from "./components/auth/HomeComp";
import NotActiveComp from "./components/auth/NotActiveComp";
import ConfirmCodeComp from "./components/auth/ConfirmCodeComp";

export default async function Home() {
  const session = await getSession()
  const user = session?.user 
  if(!user) redirect('/login')
  return (
    <div>
    {!user.isActive ? (
        <NotActiveComp />
    ) : user.role === "Security" || user.role === "Admin" ? (
        <ConfirmCodeComp />
    ) : user.role === "User" ? (
        <HomeComp />
    ) : (
        <p>Role not recognized</p>
    )}
</div>
  );
}
