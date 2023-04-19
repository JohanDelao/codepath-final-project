import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from 'next/router'
import LoginPage from "@/components/loginPage";
import HomePage from "@/components/home";

const Home = () => {
  const session = useSession();

  return <div>{!session ? <LoginPage /> : <HomePage /> }</div>;
};

export default Home;
