import {
  createUploadthing,
  type FileRouter,
} from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter:FileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async ({ file }) => {
    return {
      uploadedBy: "sketchly",
      url: file.ufsUrl,
    };
  }),
} satisfies FileRouter;

export type UploadRouter =
  typeof uploadRouter;