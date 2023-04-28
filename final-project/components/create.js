import { useState } from "react";
import { supabase } from "@/client";
import { useRouter } from "next/router";

const Create = ({userID}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [teamOne, setTeamOne] = useState("None")
  const [teamTwo, setTeamTwo] = useState("None")
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
    const resp = await supabase.from("post").insert({ title: title, content: content, teams: array, user_id: userID });
    console.log(resp)
    router.push("/homePage");
  }

  const handleChangeOne = (event) => {
    event.preventDefault();
    setTeamOne(event.target.value)
  }

  return (
    <div className="flex justify-center items-center">
      <div
        className=" 2xl:w-3/12 xl:w-5/12 lg:w-5/12 md:w-8/12 w-80 flex flex-col md:py-10 py-5 xl:h-fit lg:h-2/6 h-fit rounded-lg absolute :top-1/3 xl:top-1/4 top-1/4 items-center"
        id="login"
      >
        <p className="md:text-4xl text-2xl md:w-9/12 w-11/12 font-bold float-left md:text-left text-center">Create a Post!</p>
        <form className="md:w-full w-11/12 mt-5">
          <label htmlFor="text"></label>
          <div className="w-full mt-1">
            <input
              type="text"
              name="title"
              id="title"
              className="md:w-9/12 w-11/12 md:text-xl text-lg flex rounded-md md:h-14 h-9 p-2 mx-auto"
              placeholder="Title"
              required
              onChange={(e) => setTitle(e.target.value)}
            ></input>
          </div>
          <div className="w-full mt-6 flex justify-center">
            <textarea
              rows={5}
              required
              className="rounded-md pl-2 pt-2 md:w-9/12 w-11/12 md:text-lg text-base"
              placeholder="Type here..."
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
          <div className="md:w-9/12 md:max-w-[9/12] md:px-0 px-3 w-full flex flex-wrap md:justify-between justify-center items-center mt-6 md:mx-auto">
            <select
              id="dropdownTwo"
              required
              name="dropdownOne"
              onChange={handleChangeOne}
              className="2xl:w-56 lg:w-52 md:w-48 md:h-14 w-full h-10 bg-transparent border-solid border-slate-200 border-2 rounded pl-2 mb-6 pr-2"
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
              className="2xl:w-56 lg:w-52 md:w-48 md:h-14 w-full h-10 bg-transparent border-solid border-slate-200 border-2 rounded pl-2 mb-6"
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
            className="md:w-9/12 w-7/12 md:h-14 h-9 md:text-xl text-lg justify-center items-center flex font-semibold mx-auto md:mt-6 rounded-md"
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
