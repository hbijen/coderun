import NextAuth, { Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import Keycloak from "next-auth/providers/keycloak";


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Keycloak],
  callbacks: {
    session: sessionCallback
  }
})

function sessionCallback({ session, user }: {session: Session, user: AdapterUser}) {
  // console.log("Observe Login! ", session, user)
  return session
}
