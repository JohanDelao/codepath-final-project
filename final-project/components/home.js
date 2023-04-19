import React, { useEffect } from "react";
import { useState } from "react";
import { supabase } from "@/client";
import "react-toastify/dist/ReactToastify.css";
import Post from "./Post";

export default function HomePage(){
    

    const [posts, setPosts] = useState([])

    async function fetchPosts(){
        const { data } = await supabase.from("post").select();
        // Currently sorting by the date created but eventually want to give options by sorting by date or upvotes
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        data.forEach((post) => {
            let time = getElapsedTime(post.created_at);
            post.created_at = time;
        })
        setPosts(data);
        console.log("data: ", data);
    }

    function getElapsedTime(dateString) {
        const now = new Date();
        const posted = new Date(dateString);
        const elapsedTime = (now.getTime() - posted.getTime()) / 1000; // Convert milliseconds to seconds
        if (elapsedTime < 86400) { // Less than 24 hours ago
          const hoursAgo = Math.floor(elapsedTime / 3600);
          return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
        } else { // More than 24 hours ago
          const daysAgo = Math.floor(elapsedTime / 86400);
          return `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
        }
      }      

    useEffect(() => {
        fetchPosts();
    }, [])

    return (
        <div className="flex min-h-[80vh] mt-10 mb-10">
            <div className="w-full flex flex-col items-center gap-8">
                {/* <Post title={"Maverick’s trade for Kyrie worst trade in NBA history?"} time={"21 hours ago"} upvotes={3} text={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."} teams={["Mavericks", "Nets"]} /> */}
                {posts && posts.map((post) => {
                    // let time = getElapsedTime(post.created_at)
                    return <Post title={post.title} time={post.created_at} upvotes={post.upvotes} text={post.content} teams={post.teams} key={post.id} />
                })}
            </div>
        </div>
    )
}