const Post = ({title, time, upvotes, text, teams}) => {
    return (
        <div className="w-7/12 h-64 bg-slate-500 rounded-lg post p-5">
            <p className="text-base text-slate-400 font-medium">{'Posted ' + time}</p>
            <div className="flex justify-between items-center">
                <p className="text-2xl font-bold">{title}</p>
                <p className="text-xl font-medium upvotes">{upvotes} Upvotes</p>
            </div>
            <p className="text-base font-medium text text-justify mt-3">{text}</p>
            <div className="flex gap-2 mt-3">
                {teams && teams.map((team) => {
                    return (<p className="text-xl px-2 py-1 bg-slate-400 rounded-lg w-fit">{team}</p>)
                })}
            </div>
        </div>
    )
}
export default Post