import { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      resident?: any
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: string
    resident?: any
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    resident?: any
  }
}