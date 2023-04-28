import React from "react";
import { useState } from "react";
import { supabase } from "@/client";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from 'next/router'
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [email, setEmail] = useState(undefined);
  const [password, setPassword] = useState(undefined);
  const router = useRouter();

  async function signInWithEmail(e) {
    e.preventDefault();
    try {
      if (email && password) {
        const resp = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        }); 
        if (resp.error){
          throw resp.error
        } else {
          clearInputsAndStates();
          router.push('/homePage');
        }
        
      }
    } catch (error) {
        toast.error('Something went wrong, try again!')
    }
  }

  function clearInputsAndStates(){
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    setEmail("");
    setPassword("");
}

  return (
    <div className="flex justify-center items-center">
      <div
        className="2xl:w-2/12 xl:w-4/12 lg:w-5/12 md:w-6/12 w-80 flex flex-col py-8 xl:h-fit lg:h-2/6 h-fit rounded-lg absolute md:top-1/4 lg:top-1/3 xl:top-1/4 top-1/4 items-center"
        id="login"
      >
        <p className="md:text-4xl text-3xl w-9/12 font-bold float-left">Login</p>
        <p className="md:text-xl text-lg w-9/12 float-left font-medium text-slate-400 mt-2">
          Sign in to your account to continue{" "}
        </p>
        <form className="w-full md:mt-10 mt-4">
          <label htmlFor="email"></label>
          <div className="w-full mt-1">
            <input
              type="email"
              name="email"
              id="email"
              className="w-9/12 md:text-xl text-lg flex rounded-md h-14 pl-2 mx-auto"
              placeholder="Email Address"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></input>
          </div>
          <div className="w-full mt-6">
            <input
              type="password"
              name="password"
              id="password"
              className="w-9/12 md:text-xl text-lg flex rounded-md h-14 pl-2 mx-auto"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></input>
          </div>
          <button
            className="w-9/12 h-14 md:text-xl text-lg justify-center items-center flex font-semibold mx-auto mt-6 rounded-md"
            onClick={(e) => signInWithEmail(e)}
          >
            LOGIN
          </button>
        </form>
        <Link href={'/auth/signup'} className="md:text-md text-base w-9/12 text-center md:mt-2 mt-4 text-slate-400">Don't have an account? Click here to make one</Link>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
