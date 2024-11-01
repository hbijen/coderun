import { signIn } from "@/auth"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import { Button } from "./ui/button"

export default function SignIn() {
    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="w-96">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Use your NEILIT, Manipur Account to Login
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center">
                        <Image src="/NIELIT-Logo.png" alt="Logo" width={200} height={100} className="mx-auto p-6" />
                    </div>
                    <form
                        action={async () => {
                            "use server"
                            await signIn("keycloak", { redirectTo: "/lab" })
                        }}
                    >
                        <Button type="submit" className="w-full">Login</Button>
                    </form>

                </CardContent>
            </Card>
        </div>
    )
}