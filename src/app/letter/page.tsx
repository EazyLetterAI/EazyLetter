import { getServerAuthSession } from "~/server/auth";
import { HeaderBar } from "../_components/header-bar";
import GenerateLetter from "./components";
import { redirect } from "next/navigation";
import Footer from "../_components/footer";
import { api } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();
  const userInfo = await api.userInfo.retrieveUserInfo.query();
  const userEmail = session?.user?.email;

  if (!session?.user) {
    return redirect("/api/auth/signin");
  }

  return (
    <main>
      <HeaderBar session={session} dashboardHeader/>
      <div className="flex justify-center">
        <div className="w-screen md:max-w-5xl">
          <GenerateLetter userInfo={userInfo} userEmail={userEmail ?? ""} disableName={true}/>
        </div>
      </div>
      <Footer/>
    </main>
  );
}
