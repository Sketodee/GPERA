import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDb from "./lib/db"
import { User } from "./models/Users"
import Google from "next-auth/providers/google"
import { validatePassword } from "./lib/validators"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),

    Credentials({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },

      authorize: async (credentials) => {
        const email = credentials.email as string | undefined
        const password = credentials.password as string | undefined

        if (!email || !password) {
          throw new CredentialsSignin("Please provide both email and password")
        }

        await connectDb()

        // const user = await User.findOne({ email })
        const user =  await User.findOne({
          email: { 
            $regex: new RegExp('^' + email + '$', 'i')
          }
        });

        if (!user) {
          throw new Error("Invalid email or password")

        }

        if (!user.password) {
          throw new Error("Invalid email or password")
        }

        const isMatched = await validatePassword(password, user.password)
        if (!isMatched) {
          throw new Error("Invalid credentials")
        }

        const userData = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          id: user._id,
          isActive: user.isActive,
          houseNumber: user.houseNumber
        }

        return userData
      }


    })
  ],

  pages: {
    signIn: "/login"
  },

  //change existing behavior of the session 
  callbacks: {
    async session({ session, token }) {
      if (token?.sub && token?.role) {
        session.user.id = token.sub;
        session.user.role = token.role //role was throwing error.. so i added an next-auth.d.ts file and included the file name in tsconfig.json
        session.user.email = token.email
        session.user.fullName = token.name
        session.user.houseNumber = token.houseNumber
        session.user.isActive = token.isActive
      }
      return session
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.name = user.firstName + " " + user.lastName
        token.houseNumber = user.houseNumber
        token.isActive = user.isActive
      }
      return token
    },

    signIn: async ({ user, account }) => {
      if (account?.provider === 'google') {
        try {
          const { email, name, id } = user
          await connectDb()
          // const alreadyUser = await User.findOne({ email })
          const alreadyUser =  await User.findOne({
            email: { 
              $regex: new RegExp('^' + email as string + '$', 'i')
            }
          });
          if (!alreadyUser) {
            const [firstName, ...lastNameArr] = name?.split(" ") || [];
            const lastName = lastNameArr.join(" ");
            const newUser = new User({
              firstName: firstName,
              lastName: lastName,
              email: email,
              role: "User",
              isActive: false, 
              authProviderId: id
            })
            await User.create(newUser)
          } else {
            return true
          }
        } catch (error) {
          throw new Error("Error creating user")
        }
      }


      if(account?.provider === 'credentials') {
        return true 
      } else {
        return false 
      }
    }

  }



})