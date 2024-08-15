// src/app/signin/page.js
'use client'

import { SignInUser } from "@/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from './page.module.css';

export default function page() {
    const [SignInForm, SetSignInForm] = useState({ userName: "", userEmail: "", userPassword: "" });
    const router = useRouter();
    function HandleSignupDisabled() {
        return Object.keys(SignInForm).every(key => SignInForm[key].trim() !== '')
    }
    const handleSignIn = async () => {
        const result = await SignInUser(SignInForm);
        console.log(result);
        if (result?.success) {
            router.push("/");
        }
    }
    return (
        <>
            <div className={styles.divSignup}>
                <h1 className={styles.dh1}>Login Page</h1>
                <form action={handleSignIn} className={styles.frm}>
                    <div className={styles.frm1}>
                        <label className={styles.lbl}>Username</label>
                        <div>
                            <input className={styles.ip} required type="text" onChange={(event) => SetSignInForm({ ...SignInForm, userName: event.target.value })} value={SignInForm.userName} name="userName" placeholder="Enter Username" />
                        </div>
                    </div>
                    <div className={styles.frm1}>
                        <label className={styles.lbl}>Usermail</label>
                        <div>
                            <input className={styles.ip} required type="text" onChange={(event) => SetSignInForm({ ...SignInForm, userEmail: event.target.value })} value={SignInForm.userEmail} name="userEmail" placeholder="Enter Usermail" />
                        </div>
                    </div>
                    <div className={styles.frm1}>
                        <label className={styles.lbl}>Userpassword</label>
                        <div>
                            <input className={styles.ip} required type="password" onChange={(event) => SetSignInForm({ ...SignInForm, userPassword: event.target.value })} value={SignInForm.userPassword} name="userPassword" placeholder="Enter Userpassword" />
                        </div>
                    </div>
                    <div className={styles.btndiv}>
                        <input className={styles.btn1} disabled={!HandleSignupDisabled()} type="submit" value="Login" />
                        <Link className={styles.btn2} href="/signup">Don't Have Account? Signup</Link>
                    </div>
                </form>
            </div>
        </>
    );
}