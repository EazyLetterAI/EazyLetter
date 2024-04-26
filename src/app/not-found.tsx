import { getServerAuthSession } from "~/server/auth";
import { HeaderBar } from "./_components/header-bar";
import Link from "next/link";
import Footer from "./_components/footer";

export default async function NotFound() {
  const session = await getServerAuthSession();

  return (
    <main>
      <div className="flex">
        <HeaderBar session={session} dashboardHeader/>
      </div>
      <div className="flex flex-col items-center min-h-screen text-black">
        <div className="container flex flex-col items-center justify-center gap-2 px-4 mt-32">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Error <span className="text-fuchsia-500">404</span>.
          </h1>
          <h3 className="text-2xl font-bold">
            This page could <span className="text-fuchsia-500">not be found!</span> <Link href="/" className="underline">Return home</Link>.
          </h3>
        </div>
      </div>
      <Footer />
    </main>
  );
}