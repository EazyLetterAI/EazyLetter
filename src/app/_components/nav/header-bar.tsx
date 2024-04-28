"use client"

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import Logo from "public/logo.png";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";

const genericHamburgerLine = `h-1 w-6 my-1 rounded-full bg-black transition ease transform duration-300`;

export function HeaderBar(props: { session: Session | null, dashboardHeader?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  const links = props.session && props.dashboardHeader ? [
    { name: "Resume", href: "/resume" },
    { name: "Cover Letter", href: "/letter" },
    { name: "Interview", href: "/interview" },
  ] : [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "About", href: "/#about" },
  ] as { name: string, href: string, highlight?: boolean }[];

  if (props.session) {
    links.push({ name: "Dashboard", href: "/dashboard", highlight: true });
  }

  const linksLayout = <>
    {links.map((link, i) => (
      <Link key={i} href={link.href} className={link.highlight ? "px-6 py-2 text-white rounded-md bg-gradient-to-r from-blue-600 to-fuchsia-600" : ""}>
        {link.name}
      </Link>
    ))}
    {props.session ? (
      <button onClick={() => signOut()}><span>Logout</span></button>
    ) : (
      <Link href="/api/auth/signin">Login</Link>
    )}
  </>

  return (
    <>
      <div className="h-16"></div>
      <div className="fixed top-0 z-50 w-full px-4 py-2 bg-white shadow-sm nav">
        <div className="flex flex-row items-center justify-between">
          <div className="px-4 logo scroll-smooth min-w-fit">
            <Link href="/#home" className="flex flex-row items-center space-x-5">
              <Image src={Logo} width={50} height={50} alt="picture" />
              <h1 className="font-sans text-4xl font-semibold">EazyLetter</h1>
            </Link>
          </div>
          <div className="navbar">
            <div className="items-center justify-between hidden space-x-8 nav md:block">
              {linksLayout}
            </div>
            <button
              className="flex flex-col items-center justify-center w-12 h-12 group md:hidden"
              onClick={() => setIsOpen(!isOpen)}>
              <div className={`${genericHamburgerLine} ${isOpen ? "rotate-45 translate-y-3 opacity-50" : "opacity-50"}`} />
              <div className={`${genericHamburgerLine} ${isOpen ? "opacity-0" : "opacity-50"}`} />
              <div className={`${genericHamburgerLine} ${isOpen ? "-rotate-45 -translate-y-3 opacity-50" : "opacity-50"}`} />
            </button>
          </div>
        </div>
        <hr className={`border-slate-700 border-y-1 transition-all ${isOpen ? "opacity-100 my-2" : "opacity-0 my-0"} md:opacity-0 md:my-0`}/>
        <div className={`flex flex-col items-center justify-center w-full space-y-3 overflow-hidden transition-all h-auto ${isOpen ? "max-h-96 duration-700" : "max-h-0 duration-300"} md:max-h-0 md:duration-300`}>
          {linksLayout}
        </div>
      </div>
    </>
  );
}
