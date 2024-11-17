import { auth } from "@/auth";
import { cache } from "react";

export const getSession = cache(async() => {
    const session = await auth ()
    return session
})

//note this is for server side 
//if you want to access session on client..i had to use the getsession fron next-auth/react