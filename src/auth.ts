import NextAuth, { Account, Profile, Session, User } from "next-auth";
import { AdapterSession, AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import Keycloak from "next-auth/providers/keycloak";

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
      idToken?: string;
      accessToken?: string;
      refreshToken?: string;
      expiresIn?: number;
    };
  }

}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Keycloak({
    name: "Neilit SSO",
    issuer: process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER,
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

  },
  events: {
    signOut({ token }: { token?: JWT | null; session?: AdapterSession | null | void }) {
      console.log("sign out1: ", token)
      const { idToken } = token!.tokens!

      const data = {
        id_token_hint: idToken!,
        client_id: process.env.AUTH_KEYCLOAK_ID!,
      }
      const body = new URLSearchParams(data).toString();

      fetch(`${process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body
      }).then(async r => {
        console.log("sso logout status: ", r.status, r.statusText)
      }).catch(err => {
        console.log("err sso", err)
      })
    },
  }
})

function sessionCallback({ session, token }: { session: Session, token: JWT }) {
  // console.log("Observe Login! ", session, token)
  session.user = token.user!
  return session
}

// function authorized({ request, auth }: { request: NextRequest; auth: Session | null; }) {

//   if (!auth) {
//     return true
//   }
//   console.log("authorized 2? ", auth)

//   return true
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function nestedValue(obj: { [key: string]: any }, keys: string[]) {
  return keys.reduce((acc, key) => acc?.[key], obj) ?? null;
}

function jwt({ account, profile, ...params }: { token: JWT; user: User | AdapterUser; account: Account | null; profile?: Profile | undefined }) {
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
      idToken: account.id_token,
      accessToken: account.access_token,
      refreshToken: account.refresh_token,
      expiresIn: account.expires_in
    }
    return jwt
  }


  return params.token
}