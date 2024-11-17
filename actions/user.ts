// app/actions.ts
'use server'

import connectDb from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { generateCode, isWithinFiveHours } from "@/lib/validators";
import { Code, ICode } from "@/models/Codes";
import { User } from "@/models/Users";

export type FormState = {
    message: string | undefined,
    error: string | undefined // Changed from null to undefined
    data?: any
}

export type UserResponseState = {
    message: string| undefined, 
    error: string | undefined, 
    data?: any
}

export type UserCountState = {
    message: string| undefined, 
    error: string | undefined, 
    activeCount: number,
    inactiveCount: number 
}

export type ConfirmCodeState = {
    message: string| undefined, 
    error: string | undefined, 
}
// interface CustomUser {
//     fullName: string;
//     name: string;
//     id: string;
//     role: string;
//     email: string
//     // other user properties...
//   }

const session = await getSession()
const user = session?.user //as CustomUser

export async function createCode(prevState: FormState,formData: FormData): Promise<FormState> {
    const userName = formData.get("name") as string;
    if(!userName) return{error: "Enter a name",message: undefined}
    
  //conection to mongoDb
  await connectDb()

    //create new Code
    try {
        const code = await  Code.create({
            createdBy : user?.fullName,
            code: generateCode(), 
            status: "Active",
            creatorId: user?.id, 
            visitorName: userName,
            createdAt: new Date()
        })
        return{
            error: undefined,
            message: "Code generated Successfully",
            data: JSON.parse(JSON.stringify(code))
        }
    } catch (error) {
        console.log(error)
        return {
            error: "Unable to generate code", 
            message: undefined
        }
    }
}

export async function getRecentCodes(prevState: FormState) : Promise<FormState> {
      //conection to mongoDb
      await connectDb()
    try {
        const recentCodes = await Code.find({ creatorId: user?.id })
        .sort({ createdAt: -1, _id: -1 }) // Sort by `creationTime` in descending order
        .limit(5); // Limit to the 5 most recent codes

    if(recentCodes) {
        return {
            error: undefined, 
            message: undefined,
            data: JSON.parse(JSON.stringify(recentCodes))
        }
    } else {
        return {
            error: undefined, 
            message: "No recently generated codes",
        }
    }
    } catch (error) {
        return {
            error: "Error getting codes", 
            message: undefined,
        }
    }
}

export async function getActiveUsers(prevState: UserResponseState, data: number) : Promise<UserResponseState> {
      //conection to mongoDb
      await connectDb()
      const pageSize = 2; // Number of users per page
      const skip = (data - 1) * pageSize; // Calculate the number of documents to skip
    try {
        const users = await User.find({ isActive: true})
        .sort({ createdAt: -1, _id: -1 }) // Sort by creation time, most recent first
        .skip(skip) // Skip previous pages' items
        .limit(pageSize); 

        return {
            message: "User fetched successfully", 
            error: undefined, 
            data: JSON.parse(JSON.stringify(users))
        }
        
    } catch (error) {
        return {
            error: "Error getting users", 
            message: undefined,
        }
    }
}

export async function getInactiveUsers(prevState: UserResponseState, data: number) : Promise<UserResponseState> {
    //conection to mongoDb
    await connectDb()
    const pageSize = 2; // Number of users per page
    const skip = (data - 1) * pageSize; // Calculate the number of documents to skip
  try {
      const users = await User.find({ isActive: false})
      .sort({ createdAt: -1, _id: -1 }) // Sort by creation time, most recent first
      .skip(skip) // Skip previous pages' items
      .limit(pageSize); 

      return {
          message: "User fetched successfully", 
          error: undefined, 
          data: JSON.parse(JSON.stringify(users))
      }
      
  } catch (error) {
      return {
          error: "Error getting users", 
          message: undefined,
      }
  }
}

export async function getUserCount(prevState: UserCountState) : Promise< UserCountState> {
    await connectDb(); 
    try {
        const activeCount = await User.countDocuments({ isActive: true });
        const inactiveCount = await User.countDocuments({ isActive: false });
        return {
            message: "count successful", 
            error:undefined, 
            activeCount: activeCount, 
            inactiveCount: inactiveCount
        }
    } catch (error) {
        return {
            error: "Error getting count", 
            message: undefined,
            activeCount: 0,
            inactiveCount: 0
        }
    }
}

export async function approveUser(prevState: UserResponseState, data: { userId: string; isActive: boolean }) : Promise<UserResponseState> {
    console.log(data)
     // Destructure userId and isActive from data
     const { userId, isActive } = data;
    try {
         // Find user by ID and update status
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isActive: true },
        { new: true } // Return the updated document
      );

      if (!updatedUser) {
        return { error: "User not found", message: undefined };
    }

    console.log("updated", userId)
    return {
        error: undefined,
        message: "User status updated successfully",
    };

    } catch (error) {
        return { error: "Error updating user status", message: undefined };
    }
   
}


export async function confirmCode(prevState: ConfirmCodeState, formData: FormData) : Promise<ConfirmCodeState> {
    const code = formData.get("name") as string;
    if(!code) return{error: "Enter a code",message: undefined}
    try {
         //find if code exist
        //  const codeToConfirm = await Code.findOne({ code}) as ICode
        const codeToConfirm = await Code.findOne({
            code: { 
                $regex: new RegExp('^' + code + '$', 'i')
            }
          }) as ICode;
         if(!codeToConfirm) return {
            error: "Code doesn't exist",
            message: undefined
         }

         

         if(codeToConfirm.status === "Expired") {
            return { error: "Code expired", message: undefined };
         }

         if(codeToConfirm.status === "Used") {
            return { error: "Code has been used previously", message: undefined };
         }

         //check if the code is still within the 5 hour value
         var confirmLifeSpan = await isWithinFiveHours(codeToConfirm?.createdAt) 

         if(!confirmLifeSpan) {
            const setCodeToExpire = await Code.findOneAndUpdate(
                {
                  code: {
                    $regex: new RegExp('^' + code + '$', 'i')
                  }
                },
                {
                  status: 'Expired', 
                },
                {
                  new: true                 
                }
              ) as ICode;

            if(setCodeToExpire) {
                return { error: "Code expired", message: undefined };
            }
            
         }

         //this confirms the code 
        const updatedCode = await Code.findOneAndUpdate(
            {
              code: {
                $regex: new RegExp('^' + code + '$', 'i')
              }
            },
            {
              status: 'Used',          
              activationTime: new Date()  
            },
            {
              new: true         
            }
          ) as ICode;

      if (updatedCode) {
        return { error: undefined, message: `Code Confirmed for ${updatedCode.visitorName} -` };
    }

    return { error: "Error confirming code", message: undefined };

    } catch (error) {
        return { error: "Error confirming code", message: undefined };
    }
}