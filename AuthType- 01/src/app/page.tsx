import { auth } from "@/auth";

export default async function home() {
    const session = await auth();
    const user = session?.user;
    console.log("Home -> session",user);
    return (
        <>
            <h1>Welcome To Next.JS Authentication</h1>
            <p>{user?.name}</p>
        </>
    );
}