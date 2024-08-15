'use client';
import { logoutAction } from "@/actions";
import { useRouter } from "next/navigation";
export  default function Logout() {
    const router = useRouter();
    const style = {
        background: "none",
        border: "none",
        outline: "none",
        color: "white",
        fontSize: "16px",
    }
    const HandleLogout = async () => {
        const result = await logoutAction();
        if (result?.success) {
            router.push("/signin");
        }
    }
    return (
        <>
            <button style={style} onClick={HandleLogout}>Logout</button>
        </>
    );
}