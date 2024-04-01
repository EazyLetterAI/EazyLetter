import { HeaderBar } from "../_components/header-bar";
import GenerateLetter from "./components";

export default async function Home() {
  return (
    <main>
      <HeaderBar/>
      <div className="flex justify-center">
        <div className="w-screen md:max-w-5xl">
          <GenerateLetter/>
        </div>
      </div>
    </main>
  );
}
