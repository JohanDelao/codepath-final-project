import { useSession } from "@supabase/auth-helpers-react";
import LoginPage from "@/components/loginPage";
import Create from "@/components/create";
import { useEffect, useState } from "react";
import { supabase } from "@/client";

const CreatePost = () => {
    const session = useSession();
    // State for user ID
    const [userID, setUserID] = useState(undefined)

    useEffect(() => {
        // Function to acquire current user's userID from supabase
        const getUser = async () => {
            const user = await supabase.auth.getUser();
            setUserID(user.data.user.id)
        }

        getUser()
    }, [])

    return (
        <>
            {/* If there is no current user than they should have not access to this page so send them to login, else send them to designated create post page with their userID attached */}
            {!session ? <LoginPage /> : <Create userID={userID} />}
        </>
    )
}
export default CreatePost;