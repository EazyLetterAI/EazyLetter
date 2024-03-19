"use client"

import { useState } from "react";
import { api } from "~/trpc/react";

export function EditUserInfo() {
    api.userInfo.retrieveUserInfo()

    const [text, setText] = useState("");
    const [experiences, setExperiences] = useState([
        {
            title: "",
            name: "",
            location:"",
            startDate:"",
            endDate:"",
            description:"",
        }
    ]);
   

    return (
        <div>
            
            {/* <p>{text}</p>
            <input onChange={(e) => {setText(e.currentTarget.value)}}></input> */}
        </div>
    );
}