import { fetchAuthUserAction } from "@/actions";
import Logout from "@/components/Logout/Logout";
import { redirect } from "next/navigation";
export default async function HomePage(){
    const currentUser = await fetchAuthUserAction();
    if(!currentUser?.success) redirect('/signin');
    return(
        <>
            <h1>Authentication & MiddleWare</h1>
            <p>{currentUser?.data?.userName} {currentUser?.data?.userEmail}</p>
            <Logout />
        </>
    );
}