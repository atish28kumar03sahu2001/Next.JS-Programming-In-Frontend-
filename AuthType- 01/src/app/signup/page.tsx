import { User } from "@/models/userModel";
import Link from "next/link";
import {hash} from 'bcryptjs';
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/util";
export default function page () {
    const signup = async(formData:FormData)=>{
        'use server';
        const name = formData.get("name") as string | undefined;
        const email = formData.get("email") as string | undefined;
        const password = formData.get("password") as string | undefined; 

        if(!name || !email || !password) throw new Error("Please Provide All Fields")

        
       await connectToDatabase();
        const user = await User.findOne({email});
        if(user) throw new Error("User Already Exists");

        const hashedPassword = await hash(password, 10)

        User.create({
            name, email, password: hashedPassword,
        })
        redirect("/login");
    }
    return(
        <>
            <h1>Sign Up Page</h1>
            <form action={signup}>
                <label>UserName</label>
                <input type="text" name="name" placeholder="Enter UserName" /><br />

                <label>UserEmail</label>
                <input type="text" name="email" placeholder="Enter UserEmail" /><br />

                <label>UserPassword</label>
                <input type="password" name="password" placeholder="Enter UserPassword" /><br />

                <input type="submit" value="Submit User" /><br />
                <button type="submit">Login With Google</button>
                <Link href="/login">
                    <p>Already have an account? Login</p>
                </Link>
            </form>
        </>
    );
}