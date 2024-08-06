import { auth, signIn } from "@/auth";
import { CredentialsSignin } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
export default async function page() {
    const session = await auth();
    if(session?.user){
        redirect("/")
    }

    const login = async (formData: FormData) => {
        'use server'
        const name = formData.get("name") as string | undefined;
        const email = formData.get("email") as string | undefined;
        const password = formData.get("password") as string | undefined;

        if (!name || !email || !password) throw new Error("Please Provide All Fields");

        try {
            await signIn("credentials", {
                name, email, password,
            })
        } catch (error) {
            const err = error as CredentialsSignin;
            return err.cause;
        }
    }
    return (
        <>
            <h1>Login Page</h1>
            <form action={login}>
                <label>UserName</label>
                <input type="text" name="name" placeholder="Enter UserName" /><br />

                <label>UserEmail</label>
                <input type="text" name="email" placeholder="Enter UserEmail" /><br />

                <label>UserPassword</label>
                <input type="password" name="password" placeholder="Enter UserPassword" /><br />

                <input type="submit" value="Submit User" /><br />
                <button type="submit">Login With Google</button>
                <Link href="/signup">
                    <p>Don't have an account? Signup</p>
                </Link>
            </form>
        </>
    );
}