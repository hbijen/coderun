import { auth, signOut } from "@/auth"
import { Button } from "./ui/button"

export async function SignOut() {

  const session = await auth()

  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <div>
        <span className="pr-4">{session?.user?.email}</span>
        <Button type="submit">Sign Out</Button>
      </div>
    </form>
  )
}