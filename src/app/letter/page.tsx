import GenerateLetter from "./components";

export default async function Home() {
  return (
    <main className="flex justify-center">
      <div className="w-screen md:max-w-5xl">
        <GenerateLetter/>
      </div>
    </main>
  );
}
