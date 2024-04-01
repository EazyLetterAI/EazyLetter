import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { getServerAuthSession } from "~/server/auth";
import { SocialIcon } from "react-social-icons"
import Graphic1 from "../../public/homepage1.png";


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
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-2 hover:bg-white/20"
              href="/resume"
              target="_blank"
            >
              <h3 className="text-2xl font-bold text-[hsl(280,100%,70%)]">Create my Resume →</h3>
              <div className="text-lg">
                Generate the perfect professional resume in minutes with the help of our AI. Certified ATS compliant.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-2 hover:bg-white/20"
              href="/cover"
              target="_blank"
            >
              <h3 className="text-2xl font-bold text-[hsl(280,100%,70%)]">Write my Cover Letter →</h3>
              <div className="text-lg">
                Construct a cover letter to land your next interview with our AI. Certified ATS compliant.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-2 hover:bg-white/20"
              href="/interview"
              target="_blank"
            >
              <h3 className="text-2xl font-bold text-[hsl(280,100%,70%)]">Interview Me →</h3>
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
      <div className="top-0 flex w-full flex-row justify-between">
        <div className="w-1/2 ">
        <p className="text-4xl font-bold">Your dream job starts<br /><span style={{ color: "#2a49e4" }}> with a great resume</span>.</p>
        <p className="text-gray-600">Create professional resume and cover letters with the help of artificial intelligence and our ATS-compliant templates.</p>
        <button className="bg-gradient-linear rounded-md py-2 px-6">
          <p className="text-white text-xl">Create My Resume</p>
        </button>
        <p className="text-blue-800">Join over 5000 students that trusted us to land their first job.</p>
        </div>
        <div className="w-1/2">
          <Image src={Graphic1} alt="picture" />
        </div>
      </div>
      {/* Pricing */}
      <div className="PricingSection text-center">
        <p className="text-fuchsia-500 text-2xl font-medium">Pricing</p>
        <p className="text-black text-5xl font-medium">Choose your plan</p>
        <div className="top-0 flex w-full flex-row justify-between">
          <div className="w-1/2">
            <p>YOOYOY</p>
          </div>
          <div className="w-1/3">
            <p>YOOYOY</p>
          </div>
          <div className="w-1/3">
            <p>YOOYOY</p>
          </div>
        </div>
      </div>


  
    </main>
  );
}

