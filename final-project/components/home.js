import React, { use, useEffect } from "react";
import { useState } from "react";
import { supabase } from "@/client";
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
    const { data } = await supabase.from("post").select();
    // Currently sorting by the date created but eventually want to give options by sorting by date or upvotes
    let temp = data;
    let time = temp.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    setPosts(time);
  }

  const getUserName = async () => {
    const resp = await supabase
      .from("profiles")
      .select("username")
      .eq("id", userID);
    const usernameStatus = resp.data[0].username;
    const dialog = document.getElementById("modal");
    console.log(usernameStatus);
    if (usernameStatus == null) {
      if (!dialog.open) {
        dialog.showModal();
        dialog.style.display = "block";
      }
    } else {
      dialog.close();
      dialog.style.display = "none";
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
      console.log("nothing")
    }else{
      let temp = posts;
      let temp2 = temp.filter((post) => {
        return post.teams.includes(e.target.value);
      })
      setPostsUpvotes(temp2)
      setFilterUpvotes(true)
    }
  }

  const insertUserName = async () => {
    await supabase
      .from("profiles")
      .update({ username: userName })
      .eq("id", userID);
    const dialog = document.getElementById("modal");
    dialog.close();
    router.push("/homePage");
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
        className="border-none text-white w-2/12 h-48 rounded-lg flex flex-col items-center"
      >
        <p className="text-2xl font-bold text-center">
          Username needed to continue
        </p>
        <form className="w-full flex flex-col items-center mt-5">
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
      <div className="w-full flex flex-col items-center gap-8">
        <div className="2xl:w-5/12 w-8/12 flex gap-2">
          <p className="text-2xl font-bold">Order By:</p>
          <button
            className="w-36 h-9 rounded-md font-medium text-xl filters"
            onClick={filterRecentFunction}
          >
            Most Recent
          </button>
          <button
            className="w-36 h-9 rounded-md font-medium text-xl filters"
            onClick={filterUpvotesFunction}
          >
            Most Popular
          </button>
          <select
            required
            name="dropdownOne"
            id="dropDownFilter"
            className="w-50 h-9 bg-transparent border-solid border-slate-200 border-2 rounded pl-2 mb-6 pr-2"
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
        </div>
        {!filterUpvotes
          ? posts.map((post) => {
              let time = getElapsedTime(post.created_at);
              return (
                <div
                  className="2xl:w-5/12 w-8/12 h-36 flex flex-col justify-around bg-slate-500 rounded-lg post px-5 py-2"
                  key={post.id}
                >
                  <div className="flex h-64 justify-between items-center">
                    <Link
                      href={`/Post?post=${post.id}`}
                      className="flex flex-col justify-around h-36 w-11/12"
                    >
                      <div>
                        <p className="text-base text-slate-400 font-medium">
                          {"Posted " + time}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-2xl font-bold">{post.title}</p>
                        </div>
                        <div className="flex gap-4 mt-3">
                          {post.teams &&
                            post.teams.map((team) => {
                              if (team == "None") {
                                return <div></div>;
                              } else {
                                return (
                                  <p
                                    className={`text-xl px-2 py-1 bg-slate-400 rounded-lg font-semibold w-fit ${team}`}
                                  >
                                    {team}
                                  </p>
                                );
                              }
                            })}
                        </div>
                      </div>
                    </Link>
                    <Upvote pid={post.id} />
                  </div>
                </div>
              );
            })
          : postsUpvotes.map((post) => {
              let time = getElapsedTime(post.created_at);
              console.log(posts);
              return (
                <div
                  className="2xl:w-5/12 w-8/12 h-36 flex flex-col justify-around bg-slate-500 rounded-lg post px-5 py-2"
                  key={post.id}
                >
                  <div className="flex h-64 justify-between items-center">
                    <Link
                      href={`/Post?post=${post.id}`}
                      className="flex flex-col justify-around h-36 w-11/12"
                    >
                      <div>
                        <p className="text-base text-slate-400 font-medium">
                          {"Posted " + time}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-2xl font-bold">{post.title}</p>
                        </div>
                        <div className="flex gap-4 mt-3">
                          {post.teams &&
                            post.teams.map((team) => {
                              if (team == "None") {
                                return <div></div>;
                              } else {
                                return (
                                  <p
                                    className={`text-xl px-2 py-1 bg-slate-400 rounded-lg font-semibold w-fit ${team}`}
                                  >
                                    {team}
                                  </p>
                                );
                              }
                            })}
                        </div>
                      </div>
                    </Link>
                    <Upvote pid={post.id} />
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default HomePage;
