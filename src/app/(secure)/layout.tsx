import { auth } from "@/auth";
import { SignOut } from "@/components/sign-out";
import { isCodeLabUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SecurePage({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const session = await auth()
    if (!session?.user) {
        redirect('/public/login');
    }
    const isUser = await isCodeLabUser()
    console.log("isUser? ", isUser)
    if (!isUser) {
        redirect('/public/noaccess');
    }

    return (
        <div className="flex flex-col flex-grow">
            <header className="flex items-center justify-between p-8">
                <div className="text-4xl text-center">Lab Work - NEILIT</div>
                <SignOut></SignOut>
            </header>
            <main>
                {children}
            </main>
        </div>
    )
}