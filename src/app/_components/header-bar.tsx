"use client"

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import Logo from "../../../public/logo.png";
import type { Session } from "next-auth";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { signOut } from "next-auth/react";

export function HeaderBar(props: {session: Session | null}) {
  const session = props.session;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="h-16"></div>
      <div className="nav fixed top-0 flex w-full flex-row items-center justify-between px-4 py-2 bg-white shadow-sm z-50">
        <div className="logo">
          <Link
            href="/#"
            className="flex flex-row items-center justify-self-start"
          >
            <Image src={Logo} width={50} height={50} alt="picture" />
            <h1 className="font-sans text-4xl font-semibold">EazyLetter</h1>
          </Link>
        </div>
        <div className="navbar">
          <div className="nav hidden md:flex items-center justify-between space-x-8">
            {session?.user ? (
              <>
                <Link href="#features">Features</Link>
                <Link href="#pricing">Pricing</Link>
                <Link href="/">About</Link>
                <Link href="/dashboard">
                  <button className="bg-gradient-to-r from-blue-600 to-fuchsia-600 rounded-md py-2 px-6 text-white">
                    Dashboard
                  </button>
                </Link>
                <button onClick={() => signOut()}><span>Logout</span></button>
              </>
            ) : (
              <>
                <Link href="/">Features</Link>
                <Link href="/">Pricing</Link>
                <Link href="/">About</Link>
                <Link href="/api/auth/signin">Login</Link>
              </>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => {
                setIsOpen(!isOpen);
                console.log(isOpen);
              }}>
                {isOpen ? 
                  <IoClose className="size-9"/> 
                : 
                  <RxHamburgerMenu className="size-9"/>
                }
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
