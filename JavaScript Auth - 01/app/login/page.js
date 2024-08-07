'use client';
import Link from "next/link";
import { useState } from 'react';
import { authenticate } from "../serverActions/userAction";
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            username: formData.get("username"),
            usermail: formData.get("usermail"),
            userpassword: formData.get("userpassword"),
        };

        try {
            const result = await authenticate(data);
            if (result === "Invalid Credentials.") {
                setErrorMessage(result);
            } else {
                router.push("/");
            }
        } catch (error) {
            setErrorMessage("Something went wrong");
        }
    }

    return (
        <>
            <h1>Login Page</h1>
            <div className="login">
                <form onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input required type="text" name="username" placeholder="Enter Username" /><br />

                    <label>UserMail</label>
                    <input required type="email" name="usermail" placeholder="Enter UserMail" /><br />

                    <label>Password</label>
                    <input required type="password" name="userpassword" placeholder="Enter UserPassword" /><br />
                    {errorMessage && <p>{errorMessage}</p>}
                    <input type="submit" value="Login User" /><br />
                    <Link href="/signup">Don't have an account? Sign Up</Link>
                </form>
            </div>
        </>
    );
}
