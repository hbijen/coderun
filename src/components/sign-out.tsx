import { auth, signOut } from "@/auth"
import { Button } from "./ui/button"

export async function SignOut() {
  
  const session = await auth()

  console.log('session ', session)

  return (
    <form
      action={async () => {
        "use server"
        const result = await signOut()
      }}
    >
      <span className="pr-4">{session?.user?.email}</span>
      
      <Button type="submit">Sign Out</Button>
    </form>
  )
}