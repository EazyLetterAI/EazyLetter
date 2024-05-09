// INCOMPLETE CODE FROM CHARLES

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { files } from "~/server/db/schema";

const f = createUploadthing();

const auth = async (req: Request) => {
  const session = await getServerAuthSession();
  return session?.user;
};

export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload

      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user?.id) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id, category: req.headers.get("fileCategory") };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // db.insert(files).values([{ userId: metadata.userId }, { category: metadata.category }, { name: file.name }, { fileUrl: file.url]});
      // db.insert(files).values({
      //   userId: metadata.userId,
      //   category: metadata.category,
      //   name: file.name,
      //   fileUrl: file.url
      // });



      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;