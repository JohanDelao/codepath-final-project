import { useEffect, useState } from "react"
import { supabase } from "@/client"

const Upvote = ({pid}) => {
    const [upvotes, setUpvotes] = useState(0)

  
    const addUpvote = async (pid) => {
        try {
            await supabase.from("post").update({upvotes: upvotes + 1}).eq('id', pid)
            setUpvotes(upvotes+1)
        } catch (error) {
            console.log(error)
        }
    }

    const subtractUpvote = async (pid) => {
        try {
            await supabase.from("post").update({upvotes: upvotes - 1}).eq('id', pid)
            setUpvotes(upvotes-1)
        }catch(error){
            console.log(error)
        }
    }

    const fetchUpvotes = async () => {
      const data = await supabase.from("post").select('upvotes').eq('id', pid);
      setUpvotes(data.data[0].upvotes)
    }

    useEffect(() => {
      fetchUpvotes();
    })
  
    return (
    <div className="upvote w-10 rounded-md flex flex-col justify-around items-center h-4/5">
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="hover:fill-green-200 fill-slate-300 hover:cursor-pointer"
        onClick={() => addUpvote(pid)}
      >
        <path
          d="M12.6875 5.6875H8.3125V1.3125C8.3125 0.964403 8.17422 0.630564 7.92808 0.384422C7.68194 0.138281 7.3481 0 7 0C6.6519 0 6.31806 0.138281 6.07192 0.384422C5.82578 0.630564 5.6875 0.964403 5.6875 1.3125V5.6875H1.3125C0.964403 5.6875 0.630564 5.82578 0.384422 6.07192C0.138281 6.31806 0 6.6519 0 7C0 7.3481 0.138281 7.68194 0.384422 7.92808C0.630564 8.17422 0.964403 8.3125 1.3125 8.3125H5.6875V12.6875C5.6875 13.0356 5.82578 13.3694 6.07192 13.6156C6.31806 13.8617 6.6519 14 7 14C7.3481 14 7.68194 13.8617 7.92808 13.6156C8.17422 13.3694 8.3125 13.0356 8.3125 12.6875V8.3125H12.6875C13.0356 8.3125 13.3694 8.17422 13.6156 7.92808C13.8617 7.68194 14 7.3481 14 7C14 6.6519 13.8617 6.31806 13.6156 6.07192C13.3694 5.82578 13.0356 5.6875 12.6875 5.6875Z"
          fill="currentColor"
          className="hover:fill-green-500 fill-white"
        />
      </svg>
      <p className="text-2xl font-bold cursor-default">{upvotes}</p>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={() => subtractUpvote(pid)}
        className="hover:cursor-pointer"
      >
        <g clip-path="url(#clip0_56_45)">
          <path
            d="M0.0273438 6.26993H14.0273V8.60235H0.0273438V6.26993Z"
            fill="currentColor"
            className="hover:fill-red-500 fill-white"
          />
        </g>
        <defs>
          <clipPath id="clip0_56_45">
            <rect width="14" height="14" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export default Upvote
