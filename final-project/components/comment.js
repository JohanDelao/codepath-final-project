import { useEffect, useState } from "react";
import { supabase } from "@/client";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Comment = ({ cid, userID, time, content, postID }) => {
  const [userName, setUserName] = useState(undefined);
  const [currentID, setCurrentID] = useState(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const getProfileName = async () => {
    try{
      const { data } = await supabase.from("profiles").select().eq("id", userID);
      setUserName(data[0].username);
    } catch (error) {
      router.push('/homePage')
    }
  };

  const getUser = async () => {
    try {
      const user = await supabase.auth.getUser();
      setCurrentID(user.data.user.id);
    } catch (error) {
      router.push('/homePage')
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const deleteComment = async () => {
    try{
      await supabase.from("comments").delete().eq("id", cid);
      handleToggle();
      router.push(`/homePage`);
    } catch (error) {
      toast.error("Something went wrong! Try again")
    }
  }

  useEffect(() => {
    getProfileName();
    getUser();
  }, []);

  return (
    <div className="2xl:w-5/12 lg:w-8/12 md:w-10/12 w-11/12 md:h-24 h-fit flex justify-between items-center bg-slate-500 rounded-lg post px-5 md:py-2 py-4" key={cid}>
      <div className="flex flex-col md:w-11/12 w-10/12">
        <div className="flex">
          <p className="md:text-base text-sm font-bold mr-2">{userName}</p>
          <p className="md:text-base text-sm text-slate-400 font-medium">{time}</p>
        </div>
        <p className="md:text-lg font-medium text text-justify h-fit md:mt-0 mt-1">{content}</p>
      </div>
      {currentID == userID && (
                  <div className="relative inline-block text-left w-1/12">
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        className="inline-flex justify-center w-fit px-0.5 py-0.25 rounded-md text-sm font-medium text-gray-700 hover:bg-slate-400"
                        id="options-menu"
                        onClick={handleToggle}
                      >
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 18C9.10457 18 10 17.1046 10 16C10 14.8954 9.10457 14 8 14C6.89543 14 6 14.8954 6 16C6 17.1046 6.89543 18 8 18Z"
                            fill="white"
                          />
                          <path
                            d="M16 18C17.1046 18 18 17.1046 18 16C18 14.8954 17.1046 14 16 14C14.8954 14 14 14.8954 14 16C14 17.1046 14.8954 18 16 18Z"
                            fill="white"
                          />
                          <path
                            d="M24 18C25.1046 18 26 17.1046 26 16C26 14.8954 25.1046 14 24 14C22.8954 14 22 14.8954 22 16C22 17.1046 22.8954 18 24 18Z"
                            fill="white"
                          />
                        </svg>
                      </button>
                    </div>

                    {isOpen && (
                      <div
                        className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <div className="py-1" role="none">
                          <div
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                            onClick={deleteComment}
                          >
                            Delete
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
};

export default Comment;
