# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

# EazyLetter Timeline

This document is a summary of the tasks you’ll encounter during the project. 
It lists the essentials steps into developing EazyLetter website.

1. Cloud provider: AWS
2. Tech Stack : AI

    2.1. Frontend: React, html, CSS
    
    2.2. Backend: Python, JS, OpenAI API, ExportSDK (PDF generation) 

    2.3.	Delivery model: Freemium with 3 pricing plans (TBD)

    | Free      | Eazy                                                                                     | Eazy+                                                                                       |
|-----------|------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| Templates | Templates GPT4 for resume Cover letters Limited monthly tokens for interview preparation | Templates GPT4 for resumes Cover letters Unlimited monthly tokens for interview preparation |

3.	Design: partially done (open to suggestions)
3.1.	Designs are already available on WordPress and on Mock React/CSS (Raphael’s previous work) 
Open to suggestions to make it look better 
This allows you to focus on what you like (backend development 😉)
4.	Development timeline: 
4.1.	Domain name connection: prod/testing
4.2.	Database creation: 
-	Login setup: SSO authentication (Google + social logins)
-	User account: user access and storage (store documents on personal account page)
4.3.	Backend functions design:
4.3.1.	EazyLetter: generate personalized cover letters using AI
-	OpenAI API calls to create cover letters according to a company name, job title, job description, and applicant’s background (user input)
-	Template creation (using ExportSDK) and download button
4.3.2.	EazyResume: streamline resume creation with integrated AI features 
-	OpenAI API calls to create bullet points of a resume according to a company name, position title and short summary (user input)
-	Template creation (using ExportSDK) and download button
4.3.3.	EazyInterview: mock interviews powered with AI
-	OpenAI API calls to run interview simulations. See examples on Wizco.io, Rezi.ai 
-	Text to speech functions: add audio rendering to the interview questions, allow user to record his voice with live text transcribing, or to put the voice of his choice on the AI
4.3.4.	Database: 
-	Connect database to user account page. Allow access to personal documents (edited resumes, cover letters, previous mock interviews)
4.3.5.	Ressource center
-	Host resource/tutorial videos on resource page (repeting React video component) with search bar to find interest subject 
5.	Testing:
Beta testing on 100 users, collect feedback (this one is on the other Tamid team 😉 ) and correct potential bugs 

