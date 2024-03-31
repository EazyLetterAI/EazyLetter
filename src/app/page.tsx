import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";


import { HeaderBar } from "~/app/_components/header-bar";

export default async function Home() {
  const session =  await getServerAuthSession();

  return (
    <main>
      <div className="flex">
        <HeaderBar session={ session }/>
      </div>
    </main>
  );
}