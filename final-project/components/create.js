import { useState } from "react";
import { supabase } from "@/client";
import { useRouter } from "next/router";
import Link from "next/link";

const Create = ({userID}) => {
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState(null);
  const [content, setContent] = useState("");
  const [teamOne, setTeamOne] = useState("None")
  const [teamTwo, setTeamTwo] = useState("None")
  const [teams, setTeams] = useState([]);
  let array = [];

  const router = useRouter();

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

  async function create(e) {
    e.preventDefault();
    array.push(teamOne)
    array.push(teamTwo)
    await supabase.from("post").insert({ title: title, content: content, teams: array, user_id: userID });
    router.push("/homePage");
  }

  const handleChangeOne = (event) => {
    event.preventDefault();
    setTeamOne(event.target.value)
  }

  return (
    <div className="flex justify-center items-center">
      <div
        className=" 2xl:w-3/12 xl:w-5/12 md:w-5/12 flex flex-col py-10 xl:h-fit h-2/6 rounded-lg absolute md:top-1/3 xl:top-1/4 items-center"
        id="login"
      >
        <p className="text-4xl w-9/12 font-bold float-left">Create a Post!</p>
        <form className="w-full mt-5">
          <label htmlFor="text"></label>
          <div className="w-full mt-1">
            <input
              type="text"
              name="title"
              id="title"
              className="w-9/12 text-xl flex rounded-md h-14 p-2 mx-auto"
              placeholder="Title"
              required
              onChange={(e) => setTitle(e.target.value)}
            ></input>
          </div>
          <div className="w-full mt-6 flex justify-center">
            <textarea
              rows={5}
              required
              className="rounded-md pl-2 pt-2 w-9/12 text-lg"
              placeholder="Type here..."
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
          <div className="w-9/12 max-w-[9/12] flex justify-between items-center mt-6 mx-auto">
            <select
              id="dropdownTwo"
              required
              name="dropdownOne"
              onChange={handleChangeOne}
              className="2xl:w-56 w-48 h-14 bg-transparent border-solid border-slate-200 border-2 rounded pl-2 mb-6 pr-2"
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
              id="dropdownOne"
              required
              name="dropdownTwo"
              className="2xl:w-56 w-48 h-14 bg-transparent border-solid border-slate-200 border-2 rounded pl-2 mb-6"
              onChange={(e) => setTeamTwo(e.target.value)}
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
          <button
            className="w-9/12 h-14 text-xl justify-center items-center flex font-semibold mx-auto mt-6 rounded-md"
            onClick={(e) => create(e)}
          >
            CREATE POST
          </button>
        </form>
      </div>
    </div>
  );
};
export default Create;
