"use client"

import React from "react";

import { RiInstagramFill, RiLinkedinFill, RiTwitterXFill } from "react-icons/ri";

export default function Footer() {
  return (
    <div className="py-4 text-black bg-white shadow-sm footer">
      <div className="container px-4 mx-auto text-center md:space-x-20">
        <div className="inline-block h-full col-span-2 space-x-2 text-lg align-middle">
          <span className="inline-block px-2 py-2 my-auto text-center transition-colors duration-500 bg-white rounded-lg hover:bg-slate-300">
            <RiTwitterXFill href="www.twitter.com"/>
          </span>
          <span className="inline-block px-2 py-2 my-auto text-center transition-colors duration-500 bg-white rounded-lg hover:bg-slate-300">
            <RiInstagramFill href="www.instagram.com"/>
          </span>
          <span className="inline-block px-2 py-2 my-auto text-center transition-colors duration-500 bg-white rounded-lg hover:bg-slate-300">
            <RiLinkedinFill href="www.linkedin.com"/>
          </span>
        </div>
        <div className="inline-block space-x-4 align-middle">
          <a href="/team" className="inline-block px-2 py-2 my-auto text-center transition-colors duration-500 bg-white rounded-lg hover:bg-slate-300">
            Our Team
          </a>
          <a href="/contact" className="inline-block px-2 py-2 my-auto text-center transition-colors duration-500 bg-white rounded-lg hover:bg-slate-300">
            Contact Us
          </a>
          <a href="/privacy" className="inline-block px-2 py-2 my-auto text-center transition-colors duration-500 bg-white rounded-lg hover:bg-slate-300">
            Privacy Policy
          </a>
          <a href="/terms" className="inline-block px-2 py-2 my-auto text-center transition-colors duration-500 bg-white rounded-lg hover:bg-slate-300">
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  )
}
