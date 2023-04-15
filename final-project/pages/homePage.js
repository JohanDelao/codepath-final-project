import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from 'next/router'
import LoginPage from "@/components/loginPage";

const Home = () => {
  const session = useSession();
  const router = useRouter();

  return <div>{!session ? <LoginPage /> : <div></div>}</div>;
};

export default Home;
