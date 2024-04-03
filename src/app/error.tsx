"use client"

import Link from "next/link"
import { useEffect } from "react"
import { HeaderBar } from "./_components/header-bar"
import Footer from "./_components/footer"
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
      <div className="flex min-h-screen flex-col items-center text-black">
        <div className="container flex flex-col items-center justify-center gap-2 px-4 mt-32">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="text-fuchsia-500">Uh</span> oh!
          </h1>
          <h3 className="text-2xl font-bold">
            <span>Something went <span className="text-fuchsia-500">unexpectedly</span> wrong. </span>
            <Link href="/" className="underline">Return home</Link> or <button onClick={() => reset()} className="underline">try again</button>.
          </h3>
          {searchParams?.error && (
            <div className="bg-red-200 text-red-600 p-1 rounded mt-3">
              <p>{errorMessages[searchParams.error]}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}