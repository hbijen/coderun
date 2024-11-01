import { auth } from "@/auth";
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

    return (
        <>
            {children}
        </>
    )
}