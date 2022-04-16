import path from "path";
import sharp from "sharp";
import fs from "fs/promises";
import { Prisma } from "@prisma/client";
import { toast } from "react-toastify";
import { z } from "zod";
import { json } from "remix";

export type ErrorHandlerParams = {
  [key: string]: string[];
};

type ActionErrors = z.ZodError<
  Record<string, any>
>["formErrors"]["fieldErrors"];

export const displayErrors = (errors: ErrorHandlerParams | undefined) => {
  if (errors)
    Object.values(errors).map((errorArr) =>
      errorArr.flat().forEach((err) => toast.error(err))
    );
};

export const detectPrismaError: (error: unknown) => Record<string, string[]> = (
  error
) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    let fieldErrors = {};

    switch (error.code) {
      case "P2002":
        {
          const keyName = (error?.meta as any)?.target?.[0];
          const errorMsg = `${keyName} value has already been taken`;

          fieldErrors = {
            ...fieldErrors,
            [keyName]: [errorMsg],
          };
        }
        break;

      default:
        {
          fieldErrors = {
            ...fieldErrors,
            error: [error.message],
          };
        }
        break;
    }

    return fieldErrors;
  }

  return {};
};

export const formatError = (
  errors: ActionErrors | Prisma.PrismaClientKnownRequestError
) => {
  const fieldErrors =
    errors instanceof Prisma.PrismaClientKnownRequestError
      ? detectPrismaError(errors)
      : errors;

  return json(
    { fieldErrors, lastUpdatedAt: Date.now() },
    { status: 422, headers: { "cache-control": "no-cache" } }
  );
};

export const slugify = (text: string) => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export const convertImageToBase64 = async (imgPath: string) => {
  const imagesPath = path.join(__dirname, "../assets/images");

  const fullPath = path.join(imagesPath, imgPath);
  const thumbnail = await fs.readFile(fullPath);

  const resizedImage = await sharp(thumbnail).resize(320, 320).toBuffer();

  const extensionName = path.extname(fullPath);

  const base64ImageStr = `data:image/${extensionName
    .split(".")
    .pop()};base64,${resizedImage.toString("base64")}`;

  return base64ImageStr;
};
