// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role: string; // or another type depending on your application
    firstName: string;
    lastName: string
    houseNumber: string
    isActive: boolean
  }

  interface Session {
    user: User & {
      role: any;
      email: any;
      fullName: any;
      houseNumber: any; 
      isActive: any
    };
  }
}
