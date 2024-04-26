import Link from "next/link";

import React from "react";
import { getServerAuthSession } from "~/server/auth";
import { HeaderBar } from "~/app/_components/header-bar";
import Footer from "./_components/footer";

const PricingPlan = (props: { title: string; description: string; price: string | number; buttonText: string; features: string[] }) => (
  <div className="flex items-center justify-center w-3/4 px-8 py-2 space-x-4 bg-white md:block rounded-3xl md:w-1/3">
    <div className="my-2">
      <div className="bg-purple-500"> </div>
      <p className="text-3xl font-medium">{props.title}</p>
      <p className="pt-2 text-gray-500">{props.description}</p>
      <p className="py-4 text-2xl font-medium">{props.price}</p>
      <Link href="/api/auth/signin">
        <button className="px-6 py-2 text-white rounded-md bg-gradient-to-r from-blue-600 to-fuchsia-600">{props.buttonText}</button>
      </Link>
    </div>
    <div className="hidden pt-6 pb-5 bottomhalf md:block">
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
      <div className="flex flex-col items-center justify-center min-h-screen text-black">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16" id="features">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Your <span className="text-fuchsia-500">dream job</span> starts here.
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
            <Link className="flex flex-col gap-4 p-4 transition-all duration-500 ease-in-out bg-white rounded-xl hover:bg-slate-900 hover:text-white"
              href="/resume">
              <h3 className="text-2xl font-bold text-fuchsia-500">Create my Resume →</h3>
              <div className="text-lg">
                {"Generate the perfect professional resume in minutes with the help of our AI. Certified ATS compliant."}
              </div>
            </Link>
            <Link className="flex flex-col gap-4 p-4 transition-all duration-500 ease-in-out bg-white rounded-xl hover:bg-slate-900 hover:text-white"
              href="/letter">
              <h3 className="text-2xl font-bold text-fuchsia-500">Write my Cover Letter →</h3>
              <div className="text-lg text-inherit">
                {"Construct a cover letter to land your next interview with our AI. Certified ATS compliant."}
              </div>
            </Link>
            <Link className="flex flex-col gap-4 p-4 transition-all duration-500 ease-in-out bg-white rounded-xl hover:bg-slate-900 hover:text-white"
              href="/interview">
              <h3 className="text-2xl font-bold text-fuchsia-500">Interview Me →</h3>
              <div className="text-lg text-inherit">
                {"Practice your interview questions with our AI's voice-to-text recognition software."}
              </div>
            </Link>
          </div>
        </div>

        {/* Pricing */}
        <div className="container px-4 py-4 text-center" id="pricing">
          <p className="pb-6 text-6xl font-bold text-black">Choose <span className="text-fuchsia-500">your plan</span>.</p>
          <div className="top-0 flex flex-col items-center justify-center w-full pb-6 space-y-5 md:flex-row md:items-start md:space-x-10 md:space-y-0">
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
      <Footer />
    </main>
  );
}
