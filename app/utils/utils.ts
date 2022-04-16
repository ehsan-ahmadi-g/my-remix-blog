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
