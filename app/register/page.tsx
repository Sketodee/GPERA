import { getSession } from "@/lib/getSession"
import RegisterComp from "./components/RegisterComp"
import { redirect } from "next/navigation"

const Register = async () => {

  const session = await getSession()
  const user = session?.user 
  if(user) redirect("/")
    
  return (
    <RegisterComp />
  )
}

export default Register