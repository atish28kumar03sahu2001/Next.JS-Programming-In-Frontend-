'use client'

import { SignInUser } from "@/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function page(){
    const [SignInForm, SetSignInForm] = useState({userName: "", userEmail: "", userPassword:""});
    const router = useRouter();
    function HandleSignupDisabled(){
        return Object.keys(SignInForm).every(key=> SignInForm[key].trim() !== '')
    }
    const handleSignIn = async () => {
        const result = await SignInUser(SignInForm);
        console.log(result);
        if(result?.success) {
            router.push("/");
        }
    }
    return(
        <>
            <h1>Signin Or Login Page</h1>
            <form action={handleSignIn}>
                <label>Username</label>
                <input required type="text" onChange={(event)=>SetSignInForm({...SignInForm, userName: event.target.value})} value={SignInForm.userName} name="userName" placeholder="Enter Username" />

                <label>Usermail</label>
                <input required type="text" onChange={(event)=>SetSignInForm({...SignInForm, userEmail: event.target.value})} value={SignInForm.userEmail} name="userEmail" placeholder="Enter Usermail" />

                <label>Userpassword</label>
                <input required type="password" onChange={(event)=>SetSignInForm({...SignInForm, userPassword: event.target.value})} value={SignInForm.userPassword} name="userPassword" placeholder="Enter Userpassword" />

                <input disabled={!HandleSignupDisabled()} type="submit" value="Log In User" />
            </form>
            <Link href="/signup"><button>Don't Have Any Account? Click Here For Sign Up User</button></Link>
        </>
    );
}