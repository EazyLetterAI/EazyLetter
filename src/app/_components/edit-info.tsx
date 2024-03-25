"use client"

import { useState } from "react";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";

const educationInfo = {
    schoolName: "",
    location: "",
    startDate: new Date(),
    endDate: new Date(),
    gpa: "",
    degree: "",
    honors: "",
    relevantCoursework: "",
};

type EducationInfo = RouterOutputs["userInfo"]["retrieveUserInfo"]["education"][0];

export function EditUserInfo() {
    const getUserInfo = api.userInfo.retrieveUserInfo.useQuery();
    const mutateUserInfo = api.userInfo.updatePersonalInfo.useMutation();
    const mutateEducationInfo = api.userInfo.updateEducationInfo.useMutation();

    const [userInfo, setUserInfo] = useState({
        firstname: "",
        middlename: "",
        lastname: "",
        address: "",
        phone: "",
    });

    const [userEducation, setUserEducation] = useState([educationInfo]);

    const [infoChanged, setInfoChanged] = useState(false);

    if (getUserInfo.isSuccess && !infoChanged) {
        setInfoChanged(true);
        setUserInfo({
            firstname: getUserInfo.data?.personal?.firstname ?? "",
            middlename: getUserInfo.data?.personal?.middlename ?? "",
            lastname: getUserInfo.data?.personal?.lastname ?? "",
            address: getUserInfo.data?.personal?.address ?? "",
            phone: getUserInfo.data?.personal?.phone ?? "",
        });
        setUserEducation(
            getUserInfo.data?.education?.map((education: EducationInfo) => ({
                schoolName: education.schoolName,
                location: education.location ?? "",
                startDate: education.startDate,
                endDate: education.endDate,
                gpa: education.gpa ?? "",
                degree: education.degree ?? "",
                honors: education.honors ?? "",
                relevantCoursework: education.relevantCoursework ?? "",
            })) ?? [educationInfo]
        );
    }

    const updateUserInfo = () => {
        if (!userInfo) return;
        mutateUserInfo.mutate({
            firstname: userInfo.firstname,
            middlename: userInfo.middlename ?? "",
            lastname: userInfo.lastname,
            address: userInfo.address ?? "",
            phone: userInfo.phone ?? "",
        });
        mutateEducationInfo.mutate(userEducation);
    }

    const changeInfoState = (key: string, value: string) => {
        setUserInfo({ ...userInfo, [key]: value });
    }

    const addEducation = () => {
        setUserEducation([
            ...userEducation, 
            {...educationInfo, startDate: new Date(), endDate: new Date() } 
        ]);
    }

    const changeEducationInfo = (index: number, key: string, value: string | Date) => {
        const newEducation = userEducation[index];
        if (newEducation) {
            newEducation[key] = value;
            const newEducationList = [...userEducation];
            newEducationList[index] = newEducation;
            setUserEducation(newEducationList);
        }
    }

    const removeEducation = (index: number) => {
        const updatedEducation = [...userEducation];
        updatedEducation.splice(index, 1); // Remove the education entry
        setUserEducation(updatedEducation);
    }

    return (
        <div>
            <h1 className="text-3xl">User Info</h1>
            <h2 className="text-2xl">Personal</h2>
            <input type="text" placeholder="Firstname" value={userInfo?.firstname} onChange={(e) => changeInfoState("firstname", e.target.value)} />
            <input type="text" placeholder="Middlename" value={userInfo?.middlename ?? ""} onChange={(e) => changeInfoState("middlename", e.target.value)} />
            <input type="text" placeholder="Lastname" value={userInfo?.lastname} onChange={(e) => changeInfoState("lastname", e.target.value)} />
            <input type="text" placeholder="Address" value={userInfo?.address ?? ""} onChange={(e) => changeInfoState("address", e.target.value)} />
            <input type="text" placeholder="Phone" value={userInfo?.phone ?? ""} onChange={(e) => changeInfoState("phone", e.target.value)} />         
            <h2 className="text-2xl">Education</h2>
            {userEducation.map((education, index) => (
                <div key={index}>
                    <input type="text" placeholder="School Name" value={education.schoolName} onChange={(e) => changeEducationInfo(index, "schoolName", e.target.value)} />
                    <input type="text" placeholder="Location" value={education.location ?? ""} onChange={(e) => changeEducationInfo(index, "location", e.target.value)} />
                    <input type="date" placeholder="Start Date" value={education.startDate?.toISOString().split('T')[0]} onChange={(e) => changeEducationInfo(index, "startDate", new Date(e.target.value))} />
                    <input type="date" placeholder="End Date" value={education.endDate?.toISOString().split('T')[0]} onChange={(e) => changeEducationInfo(index, "endDate", new Date(e.target.value))} />
                    <input type="text" placeholder="GPA" value={education.gpa ?? ""} onChange={(e) => changeEducationInfo(index, "gpa", e.target.value)} />
                    <input type="text" placeholder="Degree" value={education.degree ?? ""} onChange={(e) => changeEducationInfo(index, "degree", e.target.value)} />
                    <input type="text" placeholder="Honors" value={education.honors ?? ""} onChange={(e) => changeEducationInfo(index, "honors", e.target.value)} />
                    <input type="text" placeholder="Relevant Coursework" value={education.relevantCoursework ?? ""} onChange={(e) => changeEducationInfo(index, "relevantCoursework", e.target.value)} />
                    <button className="bg-red-500 text-white" onClick={() => removeEducation(index)} > Remove </button>
                </div>
            ))}
            <button className="bg-white" onClick={() => {addEducation()}}>+</button>
            <h2 className="text-2xl">Experiences</h2>
            <h2 className="text-2xl">Skills</h2>
            <h2 className="text-2xl">Links</h2>
            <button className="bg-white" onClick={() => updateUserInfo()}>Save</button>
        </div>
    );
}