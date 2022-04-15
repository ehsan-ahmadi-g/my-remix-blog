import type { ActionFunction, LoaderFunction } from "remix";
import { redirect } from "remix";
import { logout } from "../../utils/auth.server";

export let action: ActionFunction = async ({ request }) => {
  return logout(request);
};

export let loader: LoaderFunction = async () => {
  return redirect("/");
};
