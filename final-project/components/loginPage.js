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
        clearInputsAndStates();
        router.push('/homePage')
        if (resp.error) throw resp.error;
        const userId = data.user.id;
        console.log(userId);
        
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
        className="xl:w-2/12 md:w-5/12 flex flex-col h-2/6 rounded-lg absolute md:top-1/3 xl:top-1/3 items-center"
        id="login"
      >
        <p className="text-4xl w-9/12 font-bold float-left mt-8">Login</p>
        <p className="text-xl w-9/12 float-left font-medium text-slate-400 mt-2">
          Sign in to your account to continue{" "}
        </p>
        <form className="w-full mt-10">
          <label htmlFor="email"></label>
          <div className="w-full mt-1">
            <input
              type="email"
              name="email"
              id="email"
              className="w-9/12 text-xl flex rounded-md h-14 pl-2 mx-auto"
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
              className="w-9/12 text-xl flex rounded-md h-14 pl-2 mx-auto"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></input>
          </div>
          <button
            className="w-9/12 h-14 text-xl justify-center items-center flex font-semibold mx-auto mt-6 rounded-md"
            onClick={(e) => signInWithEmail(e)}
          >
            LOGIN
          </button>
        </form>
        <Link href={'/signup'} className="mt-2 text-slate-400">Don't have an account? Click here to make one</Link>
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