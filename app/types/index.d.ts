import { z } from "zod";

type NormalObject = Record<string, any>;

export type AppErrors = Omit<
  z.ZodError<NormalObject>["formErrors"],
  "formErrors"
> & {
  lastUpdatedAt: number;
};
