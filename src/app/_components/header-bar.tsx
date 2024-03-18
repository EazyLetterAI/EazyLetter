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
        <div className="nav hidden md:flex justify-between items-center space-x-10">
            <Link href="/">Features</Link>
            <Link href="/">Pricing</Link>
            <Link href="/">About</Link>
            <Link href="/">Sign Up</Link>
            <Link href="/">Login</Link>
        </div>
        
      </div>
    </div>
  );
}