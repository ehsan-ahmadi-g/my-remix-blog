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

const displayErrors = (errors: ErrorHandlerParams | undefined) => {
  if (errors)
    Object.values(errors).map((errorArr) =>
      errorArr.flat().forEach((err) => toast.error(err))
    );
};

const detectPrismaError: (error: unknown) => Record<string, string[]> = (
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

const formatError = (
  errors: ActionErrors | Prisma.PrismaClientKnownRequestError
) => {
  const fieldErrors =
    errors instanceof Prisma.PrismaClientKnownRequestError
      ? detectPrismaError(errors)
      : errors;

  console.log("==================");
  console.log({ fieldErrors });
  console.log("==================");

  return json(
    { fieldErrors, lastUpdatedAt: Date.now() },
    { status: 422, headers: { "cache-control": "no-cache" } }
  );
};

export default { detectPrismaError, displayErrors, formatError };
