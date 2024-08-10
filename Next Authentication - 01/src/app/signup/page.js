'use client'

import { registerUser } from "@/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function page(){
    const [signupForm, setsignupForm] = useState({userName: "", userEmail: "", userPassword:""});
    const router = useRouter();

    function HandleSignupDisabled(){
        return Object.keys(signupForm).every(key=> signupForm[key].trim() !== '')
    }
    const handleSignup = async () => {
        const result = await registerUser(signupForm);
        console.log(result);
        if(result?.data) router.push("/signin");
    }
    return(
        <>
            <h1>Signup Page</h1>
            <form action={handleSignup}>
                <label>Username</label>
                <input required type="text" onChange={(event)=>setsignupForm({...signupForm, userName: event.target.value})} vlaue={signupForm.userName} name="userName" placeholder="Enter Username" />

                <label>Usermail</label>
                <input required type="text" onChange={(event)=>setsignupForm({...signupForm, userEmail: event.target.value})} vlaue={signupForm.userEmail} name="userEmail" placeholder="Enter Usermail" />

                <label>Userpassword</label>
                <input required type="password" onChange={(event)=>setsignupForm({...signupForm, userPassword:event.target.value})} vlaue={signupForm.userPassword} name="userPassword" placeholder="Enter Userpassword" />

                <input disabled={!HandleSignupDisabled()} type="submit" value="Sign Up User" />
            </form>
            <Link href="/signin"><button>Already Have An Account? Click Here To Sign In User</button></Link>
        </>
    );
}