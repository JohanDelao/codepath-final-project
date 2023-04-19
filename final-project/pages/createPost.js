import { useSession } from "@supabase/auth-helpers-react";
import LoginPage from "@/components/loginPage";
import Create from "@/components/create";
import { useEffect, useState } from "react";
import { supabase } from "@/client";

const CreatePost = () => {
    const session = useSession();
    const [userID, setUserID] = useState(undefined)

    useEffect(() => {
        const getUser = async () => {
            const user = await supabase.auth.getUser();
            setUserID(user.data.user.id)
        }

        getUser()
    }, [])

    return (
        <>
            {!session ? <LoginPage /> : <Create userID={userID} />}
        </>
    )
}
export default CreatePost;