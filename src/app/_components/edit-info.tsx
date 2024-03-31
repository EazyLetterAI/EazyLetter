"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";

const educationInfo = {
  schoolName: "",
  location: "",
  startDate: undefined as Date | undefined,
  endDate: undefined as Date | undefined,
  gpa: "",
  degree: "",
  honors: "",
  relevantCoursework: "",
};

const experienceInfo = {
  title: "",
  type: "",
  location: "",
  startDate: undefined as Date | undefined,
  endDate: undefined as Date | undefined,
  description: "",
  link: "",
};

const linkInfo = {
  type: "",
  link: "",
};

type EducationInfo =
  RouterOutputs["userInfo"]["retrieveUserInfo"]["education"][0];

export function EditUserInfo() {
  const getUserInfo = api.userInfo.retrieveUserInfo.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: false,
  });
  const mutateUserInfo = api.userInfo.updatePersonalInfo.useMutation();
  const mutateEducationInfo = api.userInfo.updateEducationInfo.useMutation();
  const mutateExperienceInfo = api.userInfo.updateExperienceInfo.useMutation();
  const mutateSkillsInfo = api.userInfo.updateSkillsInfo.useMutation();
  const mutateLinkInfo = api.userInfo.updateLinkInfo.useMutation();

  //userInfo = current state
  //setUserInfo = function to update the state
  const [userInfo, setUserInfo] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    address: "",
    phone: "",
  });

  const [userEducation, setUserEducation] = useState([educationInfo]);
  const [userExperiences, setUserExperiences] = useState([experienceInfo]);
  const [userLinks, setUserLinks] = useState([linkInfo]);
  const [userSkills, setUserSkills] = useState([{ skill: "" }]);

  useEffect(() => {
    if (getUserInfo.data?.personal) {
      setUserInfo({
        firstname: getUserInfo.data?.personal?.firstname ?? "",
        middlename: getUserInfo.data?.personal?.middlename ?? "",
        lastname: getUserInfo.data?.personal?.lastname ?? "",
        address: getUserInfo.data?.personal?.address ?? "",
        phone: getUserInfo.data?.personal?.phone ?? "",
      });
    }

    if (getUserInfo.data?.education) {
      setUserEducation(
        getUserInfo.data?.education.map((education: EducationInfo) => ({
          schoolName: education.schoolName,
          location: education.location ?? "",
          startDate: education.startDate,
          endDate: education.endDate,
          gpa: education.gpa ?? "",
          degree: education.degree ?? "",
          honors: education.honors ?? "",
          relevantCoursework: education.relevantCoursework ?? "",
        })),
      );
    }

    if (getUserInfo.data?.experiences) {
      setUserExperiences(
        getUserInfo.data?.experiences.map((experience) => ({
          title: experience.title ?? "",
          type: experience.type,
          location: experience.location ?? "",
          startDate: experience.startDate,
          endDate: experience.endDate ?? new Date(),
          description: experience.description ?? "",
          link: experience.link ?? "",
        })),
      );
    }

    if (getUserInfo.data?.links) {
      setUserLinks(
        getUserInfo.data?.links.map((userlink) => ({
          type: userlink.type,
          link: userlink.link,
        })),
      );
    }

    if (getUserInfo.data?.skills) {
      setUserSkills(
        getUserInfo.data.skills.map((skill) => ({
          skill: skill.user_skills ?? "",
        })),
      );
    }
  }, [getUserInfo.data]);

  useEffect(() => {
    if (
      mutateUserInfo.isSuccess &&
      mutateEducationInfo.isSuccess &&
      mutateExperienceInfo.isSuccess &&
      mutateSkillsInfo.isSuccess &&
      mutateLinkInfo.isSuccess
    ) {
      void getUserInfo.refetch();
    }
  }, [
    mutateUserInfo.isSuccess,
    mutateEducationInfo.isSuccess,
    mutateExperienceInfo.isSuccess,
    mutateSkillsInfo.isSuccess,
    mutateLinkInfo.isSuccess,
  ]);

  const updateUserInfo = async () => {
    if (!userInfo) return;

    mutateUserInfo.mutate({
      firstname: userInfo.firstname,
      middlename: userInfo.middlename ?? "",
      lastname: userInfo.lastname,
      address: userInfo.address ?? "",
      phone: userInfo.phone ?? "",
    });

    mutateEducationInfo.mutate(userEducation);
    mutateExperienceInfo.mutate(userExperiences);
    mutateSkillsInfo.mutate(userSkills);
    mutateLinkInfo.mutate(userLinks);
  };

  const changeInfoState = (key: string, value: string) => {
    setUserInfo({ ...userInfo, [key]: value });
  };

  const addEducation = () => {
    setUserEducation([...userEducation, { ...educationInfo }]);
  };

  const changeEducationInfo = (
    index: number,
    key: string,
    value: string | Date,
  ) => {
    const newEducation = userEducation[index];
    if (newEducation) {
      (newEducation as any)[key] = value;
      const newEducationList = [...userEducation];
      newEducationList[index] = newEducation;
      setUserEducation(newEducationList);
    }
  };

  const removeEducation = (index: number) => {
    if (userEducation.length > 1) {
      const updatedEducation = [...userEducation];
      updatedEducation.splice(index, 1); // Remove the education entry
      setUserEducation(updatedEducation);
    }
  };

  const addExperience = () => {
    setUserExperiences([...userExperiences, { ...experienceInfo }]);
  };

  const changeExperienceInfo = (
    index: number,
    key: string,
    value: string | Date,
  ) => {
    const newExperience = userExperiences[index];
    if (newExperience) {
      (newExperience as any)[key] = value;
      const newExperienceList = [...userExperiences];
      newExperienceList[index] = newExperience;
      setUserExperiences(newExperienceList);
    }
  };

  const removeExperience = (index: number) => {
    if (userExperiences.length > 1) {
      const updatedExperience = [...userExperiences];
      updatedExperience.splice(index, 1); // Remove the education entry
      setUserExperiences(updatedExperience);
    }
  };

  const addSkills = () => {
    setUserSkills([...userSkills, { ...{ skill: "" } }]);
  };

  const changeSkillsInfo = (index: number, key: string, value: string) => {
    const newSkill = userSkills[index];
    if (newSkill) {
      (newSkill as any)[key] = value;
      const newSkillList = [...userSkills];
      newSkillList[index] = newSkill;
      setUserSkills(newSkillList);
    }
  };

  const addLinks = () => {
    setUserLinks([...userLinks, { ...linkInfo }]);
  };

  const changeLinksInfo = (index: number, key: string, value: string) => {
    const newLink = userLinks[index];
    if (newLink) {
      (newLink as any)[key] = value;
      const newLinkList = [...userLinks];
      newLinkList[index] = newLink;
      setUserLinks(newLinkList);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) {
      return "";
    }

    const year = date?.getFullYear();
    const month = date?.getMonth() + 1;
    const dt = date?.getDate();

    let formattedMonth: string | number = month; // Declare formattedMonth variable outside if statements
    let formatteddt: string | number = dt; // Declare formatteddt variable outside if statements

    if (month < 10) {
      formattedMonth = `0${month}`;
    }

    if (dt < 10) {
      formatteddt = `0${dt}`;
    }

    console.log(year + "-" + formattedMonth + "-" + formatteddt);
    const value = year + "-" + formattedMonth + "-" + formatteddt;

    return value;
  };

  return (
    <div>
      <h1 className="text-3xl">User Info</h1>
      <h2 className="text-2xl">Personal</h2>
      <input
        type="text"
        placeholder="Firstname"
        value={userInfo?.firstname}
        onChange={(e) => changeInfoState("firstname", e.target.value)}
      />
      <input
        type="text"
        placeholder="Middlename"
        value={userInfo?.middlename ?? ""}
        onChange={(e) => changeInfoState("middlename", e.target.value)}
      />
      <input
        type="text"
        placeholder="Lastname"
        value={userInfo?.lastname}
        onChange={(e) => changeInfoState("lastname", e.target.value)}
      />
      <input
        type="text"
        placeholder="Address"
        value={userInfo?.address ?? ""}
        onChange={(e) => changeInfoState("address", e.target.value)}
      />
      <input
        type="text"
        placeholder="Phone"
        value={userInfo?.phone ?? ""}
        onChange={(e) => changeInfoState("phone", e.target.value)}
      />
      <h2 className="text-2xl">Education</h2>
      {userEducation.map((education, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="School Name"
            value={education.schoolName}
            onChange={(e) =>
              changeEducationInfo(index, "schoolName", e.target.value)
            }
          />
          <input
            type="text"
            placeholder="Location"
            value={education.location ?? ""}
            onChange={(e) =>
              changeEducationInfo(index, "location", e.target.value)
            }
          />
          <input
            type="date"
            placeholder="Start Date"
            value={formatDate(education.startDate)}
            onChange={(e) =>
              changeEducationInfo(index, "startDate",  new Date(e.target.value))
            }
          />
          <input
            type="date"
            placeholder="End Date"
            value={formatDate(education.endDate)}
            onChange={(e) =>
              changeEducationInfo(index, "endDate",  new Date(e.target.value))
            }
          />
          <input
            type="text"
            placeholder="GPA"
            value={education.gpa ?? ""}
            onChange={(e) => changeEducationInfo(index, "gpa", e.target.value)}
          />
          <input
            type="text"
            placeholder="Degree"
            value={education.degree ?? ""}
            onChange={(e) =>
              changeEducationInfo(index, "degree", e.target.value)
            }
          />
          <input
            type="text"
            placeholder="Honors"
            value={education.honors ?? ""}
            onChange={(e) =>
              changeEducationInfo(index, "honors", e.target.value)
            }
          />
          <input
            type="text"
            placeholder="Relevant Coursework"
            value={education.relevantCoursework ?? ""}
            onChange={(e) =>
              changeEducationInfo(index, "relevantCoursework", e.target.value)
            }
          />
          <button
            className="bg-red-500 text-white"
            onClick={() => removeEducation(index)}
          >
            {" "}
            Remove{" "}
          </button>
        </div>
      ))}
      <button
        className="bg-white"
        onClick={() => {
          addEducation();
        }}
      >
        +
      </button>
      <h2 className="text-2xl">Experiences</h2>
      {userExperiences.map((experience, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Title"
            value={experience.title ?? ""}
            onChange={(event) =>
              changeExperienceInfo(index, "title", event.target.value)
            }
          />
          <input
            type="text"
            placeholder="Job Type"
            value={experience.type}
            onChange={(event) =>
              changeExperienceInfo(index, "type", event.target.value)
            }
          />
          <input
            type="text"
            placeholder="Location"
            value={experience.location ?? ""}
            onChange={(event) =>
              changeExperienceInfo(index, "location", event.target.value)
            }
          />
          <input
            type="date"
            placeholder="Start Date"
            value={experience?.startDate?.toISOString().split("T")[0]}
            onChange={(event) =>
              changeEducationInfo(
                index,
                "startDate",
                new Date(event.target.value),
              )
            }
          />
          <input
            type="date"
            placeholder="End Date"
            value={experience?.endDate?.toISOString().split("T")[0]}
            onChange={(event) =>
              changeEducationInfo(
                index,
                "endDate",
                new Date(event.target.value),
              )
            }
          />
          <input
            type="text"
            placeholder="Description"
            value={experience.description ?? ""}
            onChange={(event) =>
              changeExperienceInfo(index, "description", event.target.value)
            }
          />
          <input
            type="text"
            placeholder="Link"
            value={experience.link ?? ""}
            onChange={(event) =>
              changeExperienceInfo(index, "link", event.target.value)
            }
          />
          <button
            className="bg-red-500 text-white"
            onClick={() => removeExperience(index)}
          >
            {" "}
            Remove{" "}
          </button>
        </div>
      ))}
      <button
        className="bg-white"
        onClick={() => {
          addExperience();
        }}
      >
        +
      </button>

      <h2 className="text-2xl">Skills</h2>
      {userSkills.map((skill, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Enter Skill"
            value={skill.skill ?? ""}
            onChange={(event) =>
              changeSkillsInfo(index, "skill", event.target.value)
            }
          />
        </div>
      ))}
      <button
        className="bg-white"
        onClick={() => {
          addSkills();
        }}
      >
        +
      </button>

      <h2 className="text-2xl">Links</h2>
      {userLinks.map((link, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Type"
            value={link.type}
            onChange={(event) =>
              changeLinksInfo(index, "type", event.target.value)
            }
          />
          <input
            type="text"
            placeholder="Link"
            value={link.link}
            onChange={(event) =>
              changeLinksInfo(index, "link", event.target.value)
            }
          />
        </div>
      ))}
      <button
        className="bg-white"
        onClick={() => {
          addLinks();
        }}
      >
        +
      </button>

      <div>
        <button className="bg-white" onClick={() => updateUserInfo()}>
          Save
        </button>
      </div>
    </div>
  );
}
