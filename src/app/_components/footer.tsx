"use client"

import React from "react";
import { SocialIcon } from "react-social-icons";

export default function Footer() {
  return (
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
  )
}
