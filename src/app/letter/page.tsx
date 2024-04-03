import { getServerAuthSession } from "~/server/auth";
import { HeaderBar } from "../_components/header-bar";
import GenerateLetter from "./components";
import { redirect } from "next/navigation";
import Footer from "../_components/footer";
import { api } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();
  // const userInfo = await api.userInfo.retrieveUserInfo.query();

  if (!session?.user) {
    return redirect("/api/auth/signin");
  }

  return (
    <main>
      <HeaderBar session={session}/>
      <div className="flex justify-center">
        <div className="w-screen md:max-w-5xl">
          <GenerateLetter />
        </div>
      </div>
      <Footer/>
    </main>
  );
}
