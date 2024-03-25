"use client"

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import Logo from "../../../public/logo.png";
import burgerMenu from "../../../public/burger-menu.svg";
import { Session } from "next-auth";


export function HeaderBar(props: {session: Session}) {
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
          <div className="nav hidden md:flex items-center justify-between space-x-10 ">
            {session?.user ? (
              <>
                <Link href="/">Account</Link>
                <Link href="/">Dashboard</Link>
                <Link href="/">Pricing</Link>
                <Link href="/api/auth/signout">Logout</Link>
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
              }}>
              <Image src={burgerMenu} width={20} height={20} alt="burger menu" />

            </button>
          </div>
        </div>
      </div>
    </>
  );
}
