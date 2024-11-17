"use server"
import { signIn, signOut } from "@/auth";
import connectDb from "@/lib/db";
import {hashPassword, loginValidateSchema, userValidateSchema } from "@/lib/validators"
import { User } from "@/models/Users";
import { redirect } from "next/navigation";

export const login = async(state:any , formData: any) => {
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

      //validate data 
      const validateResult = loginValidateSchema.safeParse(data)

      if(!validateResult.success) {
        return {
            errors: validateResult.error.flatten().fieldErrors
        }
    }
    
    const email = data.email
    const password= data.password

    try{
        await signIn("credentials", {
            redirect: false, 
            callbackUrl : '/', 
            email, password
        })
    }
    catch(error: any) {
        if (error.cause && error.cause.err) {
            return {message: error.cause.err.message}
          } 
          return { message: "An unknown error occurred." };  // Fallback message
    }
    redirect('/')
}

export const logout = async(state:any) => {
    await signOut({
        redirect: false,
      });

      redirect('/login')
}

export const signInWithGoogle = async () => {
    await signIn("google")
}

export const register = async (state:any, formData:any) => {
    const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password'),
        house: formData.get('house'),
        unit: formData.get('unit')
    }

    //validate data 
    const validateResult = userValidateSchema.safeParse(data)

    if(!validateResult.success) {
        return {
            errors: validateResult.error.flatten().fieldErrors
        }
    }
    
    //conection to mongoDb
    await connectDb()

    console.log(data)

    //check for exisiting user
    // const existingUser = await User.findOne({email: data.email})
    const existingUser = await User.findOne({
        email: { 
          $regex: new RegExp('^' + data.email + '$', 'i')
        }
      });
    if(existingUser) return {message: "User already exist"}

    //create new user 
    try {
        const user = new User({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashPassword(data.password),
            role: "User",
            isActive:false, 
            houseNumber: data.house + data.unit[data.unit.length - 1]
        })
        await User.create(user)
    }
    catch (error: any) {
        return {
            message: error.message
        }
    }
    
    redirect('/login')

}
