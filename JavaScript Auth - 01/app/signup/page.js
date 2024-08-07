'use client';

import Link from "next/link";
import { useState } from "react";
import { registerUser } from "../serverActions/userAction";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const [info, setInfo] = useState({username: "", usermail: "", userpassword: ""});
    const [feedback, setFeedback] = useState({type: "", msg: ""});
    const [pending, setPending] = useState(false);

    function handleInput(e) {
        setInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!info.username || !info.usermail || !info.userpassword) {
            setFeedback(prev => ({ ...prev, type: "error", msg: "Must Provide All The Credentials" }));
            return;
        }
        setPending(true);
        try {
            console.log('Submitting info:', info);
            const res = await registerUser(info);
            if (res?.error) {
                setFeedback(prev => ({ ...prev, type: "error", msg: res.error }));
            } else {
                setFeedback(prev => ({ ...prev, type: "success", msg: "Successfully Registered" }));
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            }
        } catch (error) {
            setFeedback(prev => ({ ...prev, type: "error", msg: "Something Went Wrong" }));
        } finally {
            setPending(false);
        }
    }

    return (
        <>
            <h1>Sign Up Page!</h1>
            <div className="signup">
                <form onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input required type="text" name="username" value={info.username} onChange={handleInput} placeholder="Enter Username" /><br />
                    <label>UserMail</label>
                    <input required type="email" name="usermail" value={info.usermail} onChange={handleInput} placeholder="Enter UserMail" /><br />
                    <label>Password</label>
                    <input required type="password" name="userpassword" value={info.userpassword} onChange={handleInput} placeholder="Enter UserPassword" /><br />
                    <input type="submit" value="Signup User" /><br />
                    <Link href="/login">Already have an account? Login</Link>
                </form>
            </div>
        </>
    );
}
