import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import Logo from "../../../public/logo.png";

export function HeaderBar() {
  return (
    <div className="flex flex-row justify-between w-full h-20 px-4 fixed nav items-center">
      <div className="logo">
        <Link href="/#" className="flex flex-row justify-self-start items-center">
            <Image src={Logo} width={50} height={50} alt="picture"/>
            <h1 className="font-sans font-semibold text-4xl">
            EazyLetter
            </h1>
        </Link>
      </div>
      <div className="navbar">
        <ul className="hidden md:flex justify-between items-center space-x-11">
            <li>
              <Link href="/">Features</Link>
            </li>
            <li>
              <Link href="/">Pricing</Link>
            </li>
            <li>
              <Link href="/">About</Link>
            </li>
            <li>
              <Link href="/">Sign Up</Link>
            </li>
            <li>
              <Link href="/">Login</Link>
            </li>

        </ul>
      </div>
    </div>
  );
}