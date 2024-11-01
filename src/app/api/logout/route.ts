
import { auth, signOut } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {

  const session = await auth()
  console.log('session ', session)
  // https://auth-test.lamzing.com/realms/neilit/protocol/openid-connect/token

  await signOut({ redirect: false })

   const html = await fetch(`${process.env.AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/logout?redirect_uri=/`, {
    method: "POST",
    body: JSON.stringify({
      client_id: process.env.AUTH_KEYCLOAK_ID,
    })
  }).then(r => r.text())
    .catch(err => {
      console.log("err sso", err)
      return { "ok": false }
    })

    console.log("html : ", html)

    return new NextResponse(html as string, {
      status: 200,
      headers: {
          'Content-Type': 'text/html', // Set content type for HTML
      },
  });
  // console.log("ssoOut: ", ssoOut)

  
  // return NextResponse.json({ ok: true })
}
