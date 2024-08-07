import Link from "next/link";
import React from "react";
export const Header = () => {
    return (
        <>
            <div style={{ border: "2px solid black", display:"flex", justifyContent:"space-around"}}>
                <h1><Link href="/">Note App</Link></h1>
                <div style={{display:"flex", width:"300px", justifyContent:"space-around", alignItems:"center"}}>
                    <Link href="/login">Login</Link><br />
                    <Link href="/signup">Signup</Link>
                </div>
            </div>
        </>
    );
}