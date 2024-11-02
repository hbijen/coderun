// app/lib/auth.ts

import { auth } from '@/auth';


export const isCodeLabUser = async (): Promise<boolean> => {
    const session = await auth()
    const appRoles = session?.user?.appRoles
    return (appRoles && appRoles.length > 0 ) ? true : false
}

export const checkUserRole = async (role: string): Promise<boolean> => {
    const session = await auth()
    console.log("session ", session)
    const appRoles = session?.user?.appRoles
    return (appRoles && appRoles.indexOf(role) != -1 ) ? true : false
};
