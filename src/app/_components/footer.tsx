"use client"

import Link from "next/link";
import React, { useState } from "react";
import { Session } from "next-auth";

export function Footer(props: {session: Session}) {
    const session = props.session;
  
    const [isOpen, setIsOpen] = useState(false);
  
    return (
        <div>
            <Link href="/">Account</Link>
            <Link href="/">Dashboard</Link>
            <Link href="/">Pricing</Link>
        </div>
    );
  }
  