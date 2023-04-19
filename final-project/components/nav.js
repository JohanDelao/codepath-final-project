import Image from "next/image";
import Logo from '../public/logo-nba.svg'
import { useSession } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { supabase } from "@/client";
import { useEffect, useState } from "react";

export default function Nav(){
    const session = useSession()

    async function signOut(e) {
        e.preventDefault();
        try {
            const resp = await supabase.auth.signOut()
            if (resp.error) throw resp.error;
          } catch {

          }
      }

    return(
        <div className="flex justify-center" id="nav">
            <div className="flex h-24 items-center justify-between" id="navWidth">
                <Link href={'/'}><Image src={Logo} width={85} height={50}></Image></Link>
                {!session ? (
                    <Link href={'/auth/login'}><button className="rounded-lg w-28 h-9 font-bold">LOGIN</button></Link>
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