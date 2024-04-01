import Link from "next/link";

import React from "react";
import { getServerAuthSession } from "~/server/auth";
import { SocialIcon } from "react-social-icons"
import { HeaderBar } from "~/app/_components/header-bar";

const PricingPlan = (props: { title: string; description: string; price: string | number; buttonText: string; features: string[] }) => (
  <div className="flex justify-center items-center space-x-4 md:block bg-white rounded-3xl py-2 px-8 w-3/4 md:w-1/3">
    <div className="my-2">
      <div className="bg-purple-500"> </div>
      <p className="text-3xl font-medium">{props.title}</p>
      <p className="text-gray-500 pt-2">{props.description}</p>
      <p className="text-2xl font-medium py-4">{props.price}</p>
      <a href="/api/auth/signin">
        <button className="bg-gradient-to-r from-blue-600 to-fuchsia-600 rounded-md py-2 px-6 text-white">{props.buttonText}</button>
      </a>
    </div>
    <div className="bottomhalf pt-6 pb-5 hidden md:block">
      <hr />
    </div>
    <ul className="pb-4">
      {props.features.map((feature, index) => (
        <li className="text-gray-700" key={index}><span className="text-fuchsia-500">✓</span> {feature}</li>
      ))}
    </ul>
  </div>
);

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main>
      <div className="flex">
        <HeaderBar session={session} />
      </div>

      {/* Features */}
      <div className="flex min-h-screen flex-col items-center justify-center text-black">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Your <span className="text-fuchsia-500">dream job</span> starts here.
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
            <Link className="flex flex-col gap-4 rounded-xl bg-white p-4 hover:bg-slate-900 hover:text-white transition-all ease-in-out duration-500"
              href="/resume" target="_blank">
              <h3 className="text-2xl font-bold text-fuchsia-500">Create my Resume →</h3>
              <div className="text-lg">
                {"Generate the perfect professional resume in minutes with the help of our AI. Certified ATS compliant."}
              </div>
            </Link>
            <Link className="flex flex-col gap-4 rounded-xl bg-white p-4 hover:bg-slate-900 hover:text-white transition-all ease-in-out duration-500"
              href="/cover" target="_blank">
              <h3 className="text-2xl font-bold text-fuchsia-500">Write my Cover Letter →</h3>
              <div className="text-lg text-inherit">
                {"Construct a cover letter to land your next interview with our AI. Certified ATS compliant."}
              </div>
            </Link>
            <Link className="flex flex-col gap-4 rounded-xl bg-white p-4 hover:bg-slate-900 hover:text-white transition-all ease-in-out duration-500"
              href="/interview" target="_blank">
              <h3 className="text-2xl font-bold text-fuchsia-500">Interview Me →</h3>
              <div className="text-lg text-inherit">
                {"Practice your interview questions with our AI's voice-to-text recognition software."}
              </div>
            </Link>
          </div>
        </div>

        {/* Pricing */}
        <div className="container text-center px-4 py-4">
          <p className="text-black text-6xl font-bold pb-6">Choose <span className="text-fuchsia-500">your plan</span>.</p>
          <div className="top-0 flex w-full flex-col md:flex-row justify-center items-center md:items-start pb-6 md:space-x-10 space-y-5 md:space-y-0">
            <PricingPlan
              title="Free"
              description="Try EazyLetter For Free"
              price="$0/mo"
              buttonText="Sign up"
              features={["Cover letter editor", "Resume editor"]}
            />
            <PricingPlan
              title="Eazy"
              description="Start Applying Today"
              price="$10/mo"
              buttonText="Get Started"
              features={["Cover letter editor", "Resume editor", "GPT4 Integration", "Limited interview tokens"]}
            />
            <PricingPlan
              title="Eazy+"
              description="Get Hired Faster"
              price="$20/mo"
              buttonText="Get Hired"
              features={["Cover letter editor", "Resume editor", "GPT4 Integration", "Unlimited interview tokens"]}
            />
          </div>
        </div>
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
              className="text-center px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors my-auto"
            >
              About Us
            </a>
            <a
              href="/contact"
              className="text-center px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors my-auto"
            >
              Contact Us
            </a>
            <a
              href="/privacy"
              className="text-center px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors my-auto"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-center px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors my-auto"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
{/* <div className="top-0 flex w-full flex-row justify-between">
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
      </div> */}

