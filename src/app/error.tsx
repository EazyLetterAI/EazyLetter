"use client"

import Link from "next/link"
import { useEffect } from "react"
import { HeaderBar } from "./_components/nav/header-bar"
import Footer from "./_components/nav/footer"
import { errorMessages } from "./api/auth/messages"

export default function Error({
  error,
  reset,
  searchParams,
}: {
  error: Error & { digest?: string }
  reset: () => void
  searchParams: { error?: string }
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <main>
      <div className="flex">
        <HeaderBar session={null}/>
      </div>
      <div className="flex flex-col items-center min-h-screen text-black">
        <div className="container flex flex-col items-center justify-center gap-2 px-4 mt-32">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="text-fuchsia-500">Uh</span> oh!
          </h1>
          <h3 className="text-2xl font-bold">
            <span>Something went <span className="text-fuchsia-500">unexpectedly</span> wrong. </span>
            <Link href="/" className="underline">Return home</Link> or <button onClick={() => reset()} className="underline">try again</button>.
          </h3>
          {searchParams?.error && (
            <div className="p-1 mt-3 text-red-600 bg-red-200 rounded">
              <p>{errorMessages[searchParams.error]}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}