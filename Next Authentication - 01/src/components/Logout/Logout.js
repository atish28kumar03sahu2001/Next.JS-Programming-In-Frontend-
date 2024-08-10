'use client';
import { logoutAction } from "@/actions";
export  default function Logout() {
    const HandleLogout = async () => {
        await logoutAction();
    }
    return (
        <>
            <button onClick={HandleLogout}>Logout User</button>
        </>
    );
}