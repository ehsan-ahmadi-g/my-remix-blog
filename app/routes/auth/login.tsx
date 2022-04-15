import { useTransition, useActionData, Form, useSubmit } from "remix";
import type { ActionFunction } from "remix";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "antd";

import { login, signup, createUserSession } from "~/utils/auth.server";
import errorHandler from "~/utils/errorHandler";

import { Input, RadioGroup } from "~/ui/common";

import { useDisplayErrors } from "~/hooks";
import { AppErrors } from "~/types";

const LoginSchema = z.object({
  email: z
    .string()
    .nonempty("email is required")
    .email("email is not valid")
    .default(""),
  password: z
    .string()
    .nonempty("password is required")
    .min(8, "Password must be at least 8 characters long")
    .default(""),
  loginType: z.nativeEnum(
    {
      login: "login",
      signup: "signup",
    },
    {
      errorMap: () => {
        return { message: "Please select one of the options" };
      },
    }
  ),
});

type UserSchema = z.infer<typeof LoginSchema>;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");
  const loginType = formData.get("loginType");

  const x = LoginSchema.safeParse({ email, password, loginType });

  if (!x.success) {
    return errorHandler.formatError(x.error.formErrors.fieldErrors);
  }

  if (x.data.loginType === "login") {
    const user = await login({
      email: x.data.email,
      password: x.data.password,
    });

    if (!user)
      return errorHandler.formatError({
        message: ["wrong login info"],
      });

    return createUserSession(user.id, "/");
  } else {
    const newUser = await signup({
      email: x.data.email,
      password: x.data.password,
    });

    return createUserSession(newUser.id, "/");
  }
};

export default function LoginComp() {
  const errors = useActionData<AppErrors>();
  const transition = useTransition();
  const submit = useSubmit();

  console.log({ errors, transition });

  useDisplayErrors(errors);

  const form = useForm<UserSchema>({
    mode: "all",
    resolver: zodResolver(LoginSchema),
  });

  return (
    <Form
      className="flex flex-col justify-center items-center"
      onSubmit={form.handleSubmit((data) =>
        submit(data, { replace: true, method: "post" })
      )}
      method="post"
    >
      <div className="flex flex-col min-h-screen-height-with-header mt-16 justify-center items-center w-2/5">
        <Input control={form.control} name="email" />
        <Input
          className="mt-6"
          control={form.control}
          name="password"
          type="password"
        />

        <RadioGroup
          className="mt-3"
          values={[
            { key: "login", value: "login" },
            { key: "signup", value: "signup" },
          ]}
          control={form.control}
          name="loginType"
        />

        <Button htmlType="submit" className="mt-3" size="large" type="primary">
          {transition.submission ? "Submitting ..." : "Submit"}
        </Button>
      </div>
    </Form>
  );
}
