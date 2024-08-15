// src/app/signup/page.js
'use client'

import { registerUser } from "@/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from './page.module.css';
export default function page() {
    const [signupForm, setsignupForm] = useState({ userName: "", userEmail: "", userPassword: "" });
    const router = useRouter();

    function HandleSignupDisabled() {
        return Object.keys(signupForm).every(key => signupForm[key].trim() !== '')
    }
    const handleSignup = async () => {
        const result = await registerUser(signupForm);
        console.log(result);
        if (result?.data) router.push("/signin");
    }
    return (
        <>
            <div className={styles.divSignup}>
                <h1 className={styles.dh1}>Signup Page</h1>
                <form action={handleSignup} className={styles.frm}>
                    <div className={styles.frm1}>
                        <label className={styles.lbl}>Username</label>
                        <div>
                            <input className={styles.ip} required type="text" onChange={(event) => setsignupForm({ ...signupForm, userName: event.target.value })} vlaue={signupForm.userName} name="userName" placeholder="Enter Username" />
                        </div>
                    </div>
                    <div className={styles.frm1}>
                        <label  className={styles.lbl}>Usermail</label>
                        <div>
                            <input className={styles.ip} required type="text" onChange={(event) => setsignupForm({ ...signupForm, userEmail: event.target.value })} vlaue={signupForm.userEmail} name="userEmail" placeholder="Enter Usermail" />
                        </div>
                    </div>
                    <div className={styles.frm1}>
                        <label  className={styles.lbl}>Userpassword</label>
                        <div>
                            <input className={styles.ip} required type="password" onChange={(event) => setsignupForm({ ...signupForm, userPassword: event.target.value })} vlaue={signupForm.userPassword} name="userPassword" placeholder="Enter Userpassword" />
                        </div>
                    </div>
                    <div className={styles.btndiv}>
                        <input className={styles.btn1} disabled={!HandleSignupDisabled()} type="submit" value="Signup" />
                        <Link className={styles.btn2} href="/signin">Have An Account? Signin</Link>
                    </div>
                </form>
            </div>
        </>
    );
}