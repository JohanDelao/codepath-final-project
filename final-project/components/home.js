import React, { useEffect } from "react";
import { useState } from "react";
import { supabase } from "@/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Upvote from "./upvote";
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [postsUpvotes, setPostsUpvotes] = useState([]);
  const [userName, setUserName] = useState(undefined);
  const [filterUpvotes, setFilterUpvotes] = useState(false);

  const router = useRouter();

  const session = useSession();
  const userID = session.user.id;

  const dropDown = document.getElementById("dropDownFilter")

  const teamOptions = [
    "None",
    "Atlanta Hawks",
    "Boston Celtics",
    "Brooklyn Nets",
    "Charlotte Hornets",
    "Chicago Bulls",
    "Cleveland Cavaliers",
    "Dallas Mavericks",
    "Denver Nuggets",
    "Detroit Pistons",
    "Golden State Warriors",
    "Houston Rockets",
    "Indiana Pacers",
    "LA Clippers",
    "LA Lakers",
    "Memphis Grizzlies",
    "Miami Heat",
    "Milwaukee Bucks",
    "Minnesota Timberwolves",
    "New Orleans Hornets",
    "New York Knicks",
    "Oklahoma City Thunder",
    "Orlando Magic",
    "Philadelphia Sixers",
    "Phoenix Suns",
    "Portland Trail Blazers",
    "Sacramento Kings",
    "San Antonio Spurs",
    "Toronto Raptors",
    "Utah Jazz",
    "Washington Wizards",
  ];

  // function to fetch all posts from supabase
  async function fetchPosts() {
    try{
      const { data } = await supabase.from("post").select();
      // Currently sorting by the date created but eventually want to give options by sorting by date or upvotes
      let temp = data;
      let time = temp.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setPosts(time);
    } catch (error) {
      router.push('/homePage')
    }
  }

  const getUserName = async () => {
    try{
      const resp = await supabase
        .from("profiles")
        .select("username")
        .eq("id", userID);
      const usernameStatus = resp.data[0].username;
      const dialog = document.getElementById("modal");
      if (usernameStatus == null) {
        if (!dialog.open) {
          dialog.showModal();
          dialog.style.display = "block";
        }
      } else {
        dialog.close();
        dialog.style.display = "none";
      }
    } catch (error) {
      router.push('/homePage')
    }
  };

  const filterUpvotesFunction = () => {
    let temp = posts;
    let upvotes = temp.sort((a, b) => b.upvotes - a.upvotes);
    setPostsUpvotes(upvotes);
    setFilterUpvotes(true);
    dropDown.value = "None"
  };

  const filterRecentFunction = () => {
    let temp = posts;
    let recent = temp.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    setFilterUpvotes(false);
    setPosts(recent);
    dropDown.value = "None"
  };

  const filterEventFunction = (e) => {
    if(e.target.value == "None"){
      setPostsUpvotes(posts)
    }else{
      let temp = posts;
      let temp2 = temp.filter((post) => {
        return post.teams.includes(e.target.value);
      })
      setPostsUpvotes(temp2)
      setFilterUpvotes(true)
    }
  }

  const filterMobile = (e) => {
    const mobileChoice = e.target.value
    if(mobileChoice == 'Recent'){
      filterRecentFunction();
    }else{
      filterUpvotesFunction();
    }
  }

  const insertUserName = async () => {
    try{
      await supabase
        .from("profiles")
        .update({ username: userName })
        .eq("id", userID);
      const dialog = document.getElementById("modal");
      dialog.close();
      router.push("/homePage");
    } catch (error) {
      toast.error('Something went wrong, try again!')
    }
  };

  // function to make time appear in 'x hours ago' or 'y days ago'
  function getElapsedTime(dateString) {
    const now = new Date();
    const posted = new Date(dateString);
    const elapsedTime = (now.getTime() - posted.getTime()) / 1000; // Convert milliseconds to seconds
    if (elapsedTime < 86400) {
      // Less than 24 hours ago
      const hoursAgo = Math.floor(elapsedTime / 3600);
      return `${hoursAgo} hour${hoursAgo === 1 ? "" : "s"} ago`;
    } else {
      // More than 24 hours ago
      const daysAgo = Math.floor(elapsedTime / 86400);
      return `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;
    }
  }

  useEffect(() => {
    fetchPosts();
    getUserName();
  }, []);

  return (
    <div className="flex min-h-[70vh] mt-10 mb-10">
      <dialog
        id="modal"
        className="border-none text-white lg:w-2/12 w-10/12 h-fit py-3 lg:h-48 rounded-lg flex flex-col items-center"
      >
        <p className="text-2xl font-bold text-center">
          Username needed to continue
        </p>
        <form className="w-full flex flex-col flex-wrap items-center mt-5">
          <input
            className="w-10/12 h-10 rounded-md pl-2"
            placeholder="Enter Username"
            onChange={(e) => setUserName(e.target.value)}
          ></input>
          <button
            className="w-28 h-9 rounded-md font-bold mt-5"
            onClick={insertUserName}
          >
            Submit
          </button>
        </form>
      </dialog>
      <div className="w-full flex flex-col flex-wrap items-center gap-8 flex-wrap">
        <div className="2xl:w-5/12 lg:w-8/12 md:w-10/12 flex flex-wrap gap-2 md:justify-start justify-between w-80">
          <p className="text-2xl font-bold md:block hidden">Order By:</p>
          <button
            className="w-36 h-9 rounded-md font-medium text-xl filters md:block hidden"
            onClick={filterRecentFunction}
          >
            Most Recent
          </button>
          <button
            className="w-36 h-9 rounded-md font-medium text-xl filters md:block hidden"
            onClick={filterUpvotesFunction}
          >
            Most Popular
          </button>
          <select
            required
            name="dropdownOne"
            id="dropDownFilter"
            className="md:w-52 w-36 h-9 bg-transparent border-solid border-slate-200 border-2 rounded pl-2 mb-6 pr-2"
            onChange={(e) => filterEventFunction(e)}
          >
            {teamOptions.map((option) => {
              return (
                <option key={option} value={option}>
                  {option}
                </option>
              );
            })}
          </select>
          <select
          required
          name="dropdownMobile"
          id="dropdownMobile"
          className="w-36 h-9 bg-transparent md:hidden block border-solid border-slate-200 border-2 rounded pl-2 mb-6 pr-2"
          onChange={(e) => filterMobile(e)}>
            <option value={"Recent"} onChange={filterRecentFunction}>Recent</option>
            <option value={"Popular"} onChange={filterUpvotesFunction}>Popular</option>
          </select>
        </div>
        {!filterUpvotes
          ? posts.map((post) => {
              let time = getElapsedTime(post.created_at);
              return (
                <div
                  className="2xl:w-5/12 lg:w-8/12 md:w-10/12 md:h-36 w-11/12 h-fit min-h-[112px] flex flex-col justify-around bg-slate-500 rounded-lg post px-5 py-2"
                  key={post.id}
                >
                  <div className="flex md:h-64 h-fit min-h-[112px] justify-between items-center">
                    <Link
                      href={`/Post?post=${post.id}`}
                      className="flex flex-col justify-around h-fit min-h-[36] w-11/12"
                    >
                      <div>
                        <p className="md:text-base text-sm text-slate-400 font-medium">
                          {"Posted " + time}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="md:text-2xl text-xl font-bold md:w-full w-64">{post.title}</p>
                        </div>
                        <div className="flex md:gap-4 mt-3 flex-wrap gap-2 ">
                          {post.teams &&
                            post.teams.map((team) => {
                              if (team == "None") {
                                return <div key={"None"}></div>;
                              } else {
                                return (
                                  <p
                                    className={`md:text-xl text-md px-2 py-1 bg-slate-400 rounded-lg font-semibold w-fit ${team}`}
                                    key={team}
                                  >
                                    {team}
                                  </p>
                                );
                              }
                            })}
                        </div>
                      </div>
                    </Link>
                    <Upvote alignUp={true} pid={post.id} />
                  </div>
                </div>
              );
            })
          : postsUpvotes.map((post) => {
              let time = getElapsedTime(post.created_at);
              return (
                <div
                  className="2xl:w-5/12 lg:w-8/12 md:w-10/12 w-11/12 h-fit md:h-36 flex flex-col justify-around bg-slate-500 rounded-lg post px-5 py-2"
                  key={post.id}
                >
                  <div className="flex md:h-64 h-fit justify-between items-center">
                    <Link
                      href={`/Post?post=${post.id}`}
                      className="flex flex-col justify-around h-36 w-11/12"
                    >
                      <div>
                        <p className="md:text-base text-sm text-slate-400 font-medium">
                          {"Posted " + time}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="md:text-2xl text-xl font-bold md:w-full w-64">{post.title}</p>
                        </div>
                        <div className="flex md:gap-4 mt-3 flex-wrap gap-2 ">
                          {post.teams &&
                            post.teams.map((team) => {
                              if (team == "None") {
                                return <div key={"None"}></div>;
                              } else {
                                return (
                                  <p
                                    className={`md:text-xl text-md px-2 py-1 bg-slate-400 rounded-lg font-semibold w-fit ${team}`}
                                    key={team}
                                  >
                                    {team}
                                  </p>
                                );
                              }
                            })}
                        </div>
                      </div>
                    </Link>
                    <Upvote alignUp={true} pid={post.id} />
                  </div>
                </div>
              );
            })}
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
};

export default HomePage;
