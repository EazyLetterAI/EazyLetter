import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { HeaderBar } from "~/app/_components/header-bar";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { EditUserInfo } from "./_components/edit-info";

export default async function Home() {
  return (
    <main className=".">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        
        <div className="flex">
        <HeaderBar />
      </div>
      <div className="flex min-h-screen flex-col items-center justify-center text-black"> 
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">First Steps →</h3>
              <div className="text-lg">
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div>
            </Link>
        
        <EditUserInfo/>

        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {session && <span>Logged in as {session.user?.name}</span>}
            </p>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Documentation →</h3>
              <div className="text-lg">
                Learn more about Create T3 App, the libraries it uses, and how to
                deploy it.
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}