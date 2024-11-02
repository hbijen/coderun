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
                    <CardTitle>
                        <div className="flex items-end p-6 pl-0 border-b">
                            <Image src="/NIELIT-Logo.png" alt="Logo" width={200} height={100} />
                            <span className="pl-2">Manipur</span>
                        </div>
                        <div className="text-2xl pt-4">Login</div>
                    </CardTitle>
                    <CardDescription>
                        Use your NEILIT Account to Login
                    </CardDescription>
                </CardHeader>
                <CardContent>
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