import NextAuth, { Account, Profile, Session, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import Keycloak from "next-auth/providers/keycloak";
import { NextRequest } from "next/server";

import { decode, JwtPayload } from "jsonwebtoken";

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string | null
      email?: string | null
      firstname?: string | null
      lastname?: string | null
      appRoles?: string[]
    };

  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: {
      id?: string | null
      email?: string | null
      firstname?: string | null
      lastname?: string | null
      appRoles?: string[]
    },
    tokens?: {
      accessToken?: string;
      refreshToken?: string;
      expiresIn?: number;
    };
  }

}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Keycloak({
    name: "Neilit SSO",
    account: (tokens) => {
      console.log("accounts.... ", tokens)
      return tokens
    }
  })],
  secret: process.env.NEXTAUTH_SECRET, // Ensure you set a secret here
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: jwt,
    session: sessionCallback,
    // authorized: authorized,
    
  }
})

function sessionCallback({ session, token }: { session: Session, token: JWT }) {
  // console.log("Observe Login! ", session, token)
  session.user = token.user!
  return session
}

function authorized({ request, auth }: { request: NextRequest; auth: Session | null; }) {

  if (!auth) {
    return true
  }
  console.log("authorized 2? ", auth)

  return true
}

function nestedValue(obj: { [key: string]: any }, keys: string[]) {
  return keys.reduce((acc, key) => acc?.[key], obj) ?? null;
}

function jwt({ account, profile, ...params }: { token: JWT; user: User | AdapterUser; account: Account | null; profile?: Profile | undefined; trigger?: "signIn" | "signUp" | "update" | undefined; isNewUser?: boolean | undefined; session?: any; }) {
  const jwt: JWT = {}

  if (account) {
    // when user logins the account is set, if already logged in its null and token has all the user data
    // console.log("signIn? ", account, profile, params)

    let clientRoles: string[] = []
    try {
      const decoded = decode(account.access_token!) as JwtPayload
      clientRoles = nestedValue(decoded, ["resource_access", process.env.AUTH_KEYCLOAK_ID!, "roles"]) as string[]
    } catch (err) {
      console.log('err ', err)
    }

    if (profile) {
      jwt.user = {
        ...params.user,
        firstname: profile.given_name,
        lastname: profile.family_name,
        appRoles: clientRoles,
      }
    }
    jwt.tokens = {
      accessToken: account.access_token,
      refreshToken: account.refresh_token,
      expiresIn: account.expires_in
    }
    return jwt
  }


  return params.token
}