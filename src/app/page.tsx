import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { SocialIcon } from "react-social-icons"


import { HeaderBar } from "~/app/_components/header-bar";

export default async function Home() {
  const session =  await getServerAuthSession();
  return (
    <main>
      <div className="flex">
        <HeaderBar session = { session }/>
      </div>
      <div className="flex min-h-screen flex-col items-center justify-center text-black"> 
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Your <span className="text-[hsl(280,100%,70%)]">dream job</span> starts here.
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Create my Resume →</h3>
              <div className="text-lg">
                Generate the perfect professional resume in minutes with the help of our AI. Certified ATS compliant.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Write my Cover Letter →</h3>
              <div className="text-lg">
                Construct a cover letter to land your next interview with our AI. Certified ATS compliant.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Interview Me →</h3>
              <div className="text-lg">
                Practice your interview questions with our AI's voice-to-text recognition software.
              </div>
            </Link>
          </div>
        </div>
      </div>
      {/* <div className="resume">
        <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4">
          <a
            href="/resume"
            className="text-center px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors"
          >
            Create my Resume
          </a>
        </div>
      </div> */}
      <div className="cover">

      </div>
      <div className="interview">

      </div>
      <div className="pricing">

      </div>
      {/*format: resume -> cover letter -> interview -> pricing*/}
      <div className="footer bg-cyan-800 text-white py-4">
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
          <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2">
            <SocialIcon url="www.twitter.com" />
            <SocialIcon url="www.instagram.com" />
            <SocialIcon url="www.linkedin.com" />
          </div>
          <a
            href="/about"
            className="text-center px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors"
          >
            About Us
          </a>
          <a
            href="/contact"
            className="text-center px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors"
          >
            Contact Us
          </a>
          <a
            href="/privacy"
            className="text-center px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-center px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </div>
    </main>
  );
}