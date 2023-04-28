import { useRouter } from "next/router";
import { supabase } from "@/client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Upvote from "@/components/upvote";
import Comment from "@/components/comment";

const Post = () => {
  const router = useRouter();
  // Acquire post id from URL
  const pid = router.query.post;

  // states
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [userID, setUserID] = useState(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [edit, setEdit] = useState(false);

  // states for updated edited post to submit
  const [newTeamOne, setNewTeamOne] = useState("");
  const [newTeamTwo, setNewTeamTwo] = useState("");
  const [editedPost, setEditedPost] = useState({});
  const [newComment, setNewComment] = useState("");

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

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const toggleEdit = () => {
    setEdit(!edit);
  };

  // fetch the specific post to display
  const fetchPost = async () => {
    try{
      const { data } = await supabase.from("post").select().eq("id", pid);
      setPost(data[0]);
      setEditedPost(data[0]);
      setNewTeamOne(data[0].teams[0]);
      setNewTeamTwo(data[0].teams[1]);
    } catch (error) {
      router.push('/homePage')
    }
  };

  const fetchPostComments = async () => {
    try{
      const { data } = await supabase
        .from("comments")
        .select()
        .eq("post_id", pid);
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setComments(data);
    } catch (error) {
      router.push('/homePage')
    }
  };

  // getUserID from current user
  const getUser = async () => {
    const user = await supabase.auth.getUser();
    setUserID(user.data.user.id);
  };

  async function deletePost() {
    try{
      await supabase.from("post").delete().eq("id", pid);
      router.push("/homePage");
    } catch (error) {
      toast.error("Something went wrong! Try again");
    }
  } 

  const updatePost = async (event) => {
    event.preventDefault();
    try {
      // condition if the user did not edit anything, if they didn't will not allow to update since there is no update to be made
      if (
        editedPost.title != post.title ||
        editedPost.content != post.content ||
        newTeamOne != post.teams[0] ||
        newTeamTwo != post.teams[1]
      ) {
        // making a makeshift array to update the post with
        let array = [];
        array.push(newTeamOne);
        array.push(newTeamTwo);
        await supabase
          .from("post")
          .update({
            title: editedPost.title,
            content: editedPost.content,
            teams: array,
          })
          .eq("id", pid);
        setEdit(!edit);
        // bring user to main page
        router.push("/");
      } else {
        throw error;
      }
    } catch (error) {
      toast.error("Change something!");
    }
  };

  const addComment = async (event) => {
    event.preventDefault();
    try{
      await supabase
        .from("comments")
        .insert({ user_id: userID, content: newComment, post_id: pid });
      const { data } = await supabase
        .from("comments")
        .select()
        .eq("post_id", pid);
      setComments(data);
      clearInputs();
      router.push(`/Post?post=${pid}`);
    }catch (error) {
      toast.error("Something went wrong! Try again");
    }
  };

  const clearInputs = () => {
    document.getElementById("commentArea").value = "";
  };

  // Changes default time format to a more readable one
  function getElapsedTime(dateString) {
    const now = new Date();
    const posted = new Date(dateString);
    const elapsedTime = (now.getTime() - posted.getTime()) / 1000; // Convert milliseconds to seconds
    if (elapsedTime < 60) {
      // Less than 1 minute ago
      const secondsAgo = Math.floor(elapsedTime);
      return `${secondsAgo} second${secondsAgo === 1 ? "" : "s"} ago`;
    } else if (elapsedTime < 3600) {
      // Less than 1 hour ago
      const minutesAgo = Math.floor(elapsedTime / 60);
      return `${minutesAgo} minute${minutesAgo === 1 ? "" : "s"} ago`;
    } else if (elapsedTime < 86400) {
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
    fetchPost();
    fetchPostComments();
    getUser();
  }, []);

  return (
    <div className="flex flex-col min-h-[70vh] mt-10 mb-10">
      <p className="md:text-4xl text-3xl text-white items-left 2xl:w-5/12 lg:w-8/12 md:w-10/12 w-11/12 mx-auto font-bold mb-5">
        Post
      </p>
      <div className="w-full flex flex-col items-center gap-8">
        <div className="2xl:w-5/12 lg:w-8/12 md:w-10/12 w-11/12 h-fit flex md:flex-row flex-col justify-between items-center bg-slate-500 rounded-lg post md:px-5 px-2 py-2 mx-2">
          <div className="flex flex-col md:w-11/12 w-11/12">
            <div className="mt-2">
              <p className="md:text-base text-sm text-slate-400 font-medium">
                {"Posted " + getElapsedTime(post.created_at)}
              </p>
              <div className="flex justify-between items-center">
                {edit ? (
                  <input
                    className="md:text-3xl text-2xl h-8 rounded-md p-2 w-full md:w-8/12 lg:w-10/12 font-bold"
                    onChange={(e) =>
                      setEditedPost({ ...editedPost, title: e.target.value })
                    }
                    defaultValue={post.title}
                  ></input>
                ) : (
                  <p className="md:text-3xl text-2xl font-bold ">
                    {post.title}
                  </p>
                )}
              </div>
            </div>
            <div className="my-4 w-full">
              {edit ? (
                <textarea
                  rows={3}
                  className="rounded-md p-2 text-base w-full h-20"
                  onChange={(e) =>
                    setEditedPost({ ...editedPost, content: e.target.value })
                  }
                  defaultValue={post.content}
                ></textarea>
              ) : (
                <p className="md:text-lg text-base font-medium text text-justify h-fit">
                  {post.content}
                </p>
              )}
            </div>
            <div className="flex justify-between mt-3 w-fit items-center mb-2">
              <div
                className={
                  edit
                    ? "flex gap-2 items-center justify-between w-full"
                    : "flex gap-2 flex-wrap items-center md:justify-center justify-between md:w-fit w-full"
                }
              >
                {!edit ? (
                  post.teams &&
                  post.teams.map((team) => {
                    if (team == "None") {
                      return <div></div>;
                    } else {
                      return (
                        <p
                          className={`md:text-xl text-md px-2 py-1 bg-slate-400 rounded-lg font-semibold w-fit ${team}`}
                        >
                          {team}
                        </p>
                      );
                    }
                  })
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <select
                      required
                      name="dropdownOne"
                      className="2xl:w-56 w-48 h-9 bg-transparent border-solid border-slate-200 border-2 rounded pl-2 pr-2"
                      defaultValue={String(post.teams[0])}
                      onChange={(e) => {
                        setNewTeamOne(e.target.value);
                      }}
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
                      name="dropdownTwo"
                      className="2xl:w-56 w-48 h-9 bg-transparent border-solid border-slate-200 border-2 rounded pl-2"
                      defaultValue={String(post.teams[1])}
                      onChange={(e) => {
                        setNewTeamTwo(e.target.value);
                      }}
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
                )}
                {edit && (
                  <div className="flex flex-wrap gap-2 items-center xl:gap-4">
                    <button
                      className="w-28 h-9 rounded-md"
                      onClick={updatePost}
                    >
                      Save
                    </button>
                    <button
                      className="w-28 h-9 rounded-md"
                      id="cancel"
                      onClick={toggleEdit}
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {!edit && post.user_id == userID && (
                  <div className="relative md:inline-block hidden text-left">
                    <div className="flex items-center">
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
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            onClick={toggleEdit}
                          >
                            Edit
                          </div>
                          <div
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                            onClick={deletePost}
                          >
                            Delete
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          {!edit && (
            <div className="md:h-44 h-12 md:w-10 w-11/12 flex md:flex-col flex-row md:justify-center justify-between items-center">
              <Upvote alignUp={false} pid={pid} />
              {!edit && post.user_id == userID && (
                  <div className="relative inline-block text-left md:hidden">
                    <div className="flex items-center">
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
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            onClick={toggleEdit}
                          >
                            Edit
                          </div>
                          <div
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                            onClick={deletePost}
                          >
                            Delete
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
      <p className="md:text-4xl text-3xl text-white items-left 2xl:w-5/12 lg:w-8/12 md:w-10/12 w-11/12 mx-auto font-bold mb-5 mt-10">
        Comments
      </p>
      <div className="w-full flex flex-col items-center gap-8">
        {comments &&
          comments.map((comment) => {
            return (
              <Comment
                cid={comment.id}
                userID={comment.user_id}
                time={getElapsedTime(comment.created_at)}
                content={comment.content}
                postID={pid}
              />
            );
          })}
        <div className="2xl:w-5/12 lg:w-8/12 md:w-10/12 w-11/12 h-24 flex justify-between items-center bg-slate-500 rounded-lg post px-5 py-2">
          <div className="w-10/12 h-16">
            <textarea
              id="commentArea"
              rows={2}
              className="rounded-md p-2 text-base w-full h-16"
              placeholder="Leave a comment..."
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
          </div>
          <div className="w-2/10">
            <button className="w-24 h-16 rounded-md" onClick={addComment}>
              Send
            </button>
          </div>
        </div>
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
export default Post;
