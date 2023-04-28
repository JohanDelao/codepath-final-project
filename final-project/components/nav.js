import Image from "next/image";
import Logo from '../public/logo-nba.svg'
import { useSession } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { supabase } from "@/client";
import { useRouter } from "next/router";

export default function Nav(){
    const session = useSession()
    const router = useRouter()
    
    async function signOut(e) {
        e.preventDefault();
        try {
            const resp = await supabase.auth.signOut()
            router.push('/homePage')
            if (resp.error) throw resp.error;
          } catch {
            
          }
      }

    return(
        <div className="flex justify-center" id="nav">
            <div className={"flex md:h-24 h-fit md:mb-0 mb-4 items-center md:justify-between justify-center md:gap-0 gap-5 xl:max-w-7xl xl:w-full md:max-w-2xl w-full max-w-sm mx-6 md:mx-0 flex-wrap md:mt-0 mt-4"} id="navWidth">
                <Link href={'/'}><Image src={Logo} width={85} height={50}></Image></Link>
                {!session ? (
                    <Link href={'/auth/login'}><button className="ml-20 md:ml-0 rounded-lg w-28 h-9 font-bold">LOGIN</button></Link>
                ) : (
                    <div className="flex w-80 justify-between">
                        <Link href={'/createPost'}><button className="rounded-lg w-36 h-9 font-bold">Create Post</button></Link>
                        <button className="rounded-lg w-28 h-9 font-bold" id="signOut" onClick={(e) => signOut(e)}>Sign Out</button>
                    </div>
                )}
            </div>
        </div>
    )
}