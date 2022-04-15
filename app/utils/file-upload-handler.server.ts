import {
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "remix";
import type { ActionFunction } from "remix";

export const action: ActionFunction = async ({ request }) => {
  const uploadHandler = unstable_createFileUploadHandler({
    maxFileSize: 5_000_000,
    file: ({ filename }) => filename,
  });
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const file = formData.get("avatar");

  console.log("file-upload-handler.server", { file });

  // file is a "NodeFile" which has a similar API to "File"
  // ... etc

  return file;
};
