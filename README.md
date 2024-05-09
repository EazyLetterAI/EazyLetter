# EazyLetter
This repository/branch contains the work done Spring 2024 by Tamid at Brandeis.

The project uses the T3 Stack with most config files untouched. <u>You should understand the purpose of the frameworks included with T3 and have a good grasp of NextJS and React.</u> 

Here's a summary of each file in the repository (the ones that need explanation at least),

## /

**.env.example**: Copy this and fill in the necessary environment variables. EazyLetter should make accounts for all the necessary services. **src/env.js** ensures type-safety for the environment variables.

**public/**: Stores assets

**/src/trpc/**: TRPC configuration

**/src/styles/globals.css**: This is for manually styling elements. You should not generally use this, however it is necessary (mostly) for dealing with Quill's styling.

## /src/utils/

**pdf-generation.tsx**: This file uses react-pdf to render PDFs from templates. The "templates" are simply functions that act as React components, taking in specified info and rendering the react-pdf elements appropriately. Note that they should be able to take information as either a plain string or a Delta object (from Quill). This is for versatility but practically is used to handle default values. 

**pdf-reading.ts**: This converts a PDF to text (can be used in front-end) and also includes the code necessary to act as a web worker.

**uploadthing.ts**: Incomplete (along with other uploadthing related files); either ignore or delete. File management was going to be used to save files the user uploads or store generated PDFs.

## /src/server/

**auth.ts**: This configures authentication with NextAuth. Sign-in buttons need to be specified in **../signin-buttons.tsx**. 

**db/schema.ts**: This defines the Drizzle schema and should be mostly self-explanatory. Note that the interactions between the stored user-info, the user-info/settings form, and the resume page have not been fully thought out, so this should probably be refined a bit.

**api/routers/**: Routers are a way to organize API methods. They are registered in **root.ts**. 

**api/routers/generate-pdf.tsx**: Can be ignored or deleted, since we're not trying to generate PDFs in the server.

## /src/app/

**.tsx**: Note that many of these files use names required for NextJS.

**dashboard/**: This dashboard page is incomplete but currently displays the user-info form (which still needs a fair amount of work).

**letter/**: The cover letter page, with the bulk of logic stored in **letter/components.tsx**.

**resume/**: The resume page, with the bulk of logic stored in **resume/components.tsx**.

**api/**: This stores the authentication pages as well as some trpc logic.

**_components**: Most of these components are straightforward and require no explanation. 

**_components/widgets/pdf-uploader.tsx**: This is part of the incomplete UploadThing functionality.

**_components/rich-text/**: Due to the quirks of ReactQuill, this was quite hard to get working smoothly. **quill-dynamic.tsx** was needed to deal with forwardRefs and dynamic importing is also necessary because Quill is client-only. Feel free to modify the functionality in the main method of **rich-text.tsx** but be cautious tinkering with anything else.