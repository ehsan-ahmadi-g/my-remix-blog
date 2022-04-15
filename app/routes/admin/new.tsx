import {
  useLoaderData,
  useTransition,
  useActionData,
  Form,
  redirect,
  useSubmit,
  json,
} from "remix";
import type { ActionFunction, LoaderFunction } from "remix";

import type { User, Category } from "@prisma/client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input, TextArea, Select, Upload } from "../../ui/common";

import { slugify } from "../../utils/utils";

import { db } from "../../utils/db.server";
import errorHandler from "../../utils/errorHandler";

import { useDisplayErrors } from "../../hooks";

import { AppErrors } from "../../types";

import { getUserId, getUserInfo, requireUserId } from "../../utils/auth.server";
import { Layout } from "../../ui";

const PostSchema = z.object({
  title: z.string().nonempty("title is required").default(""),
  description: z.string().nonempty("description is required").default(""),
  thubmnail: z.string().nonempty("thubmnail is required").default(""),
  markdown: z.string().nonempty("markdown is required").default(""),
  categories: z.array(z.string()),
});

type NewPostScheme = z.infer<typeof PostSchema>;

type LoaderData = {
  categories: Array<Pick<Category, "name" | "id">>;
  currentUser: User | null;
};

export let loader: LoaderFunction = async ({ request }) => {
  let userId = await getUserId(request);

  if (!userId) return redirect("/auth/login");

  const data = {
    categories: await db.category.findMany({
      select: {
        name: true,
        id: true,
      },
    }),
  };

  const currentUser = await getUserInfo(request);

  return json({ categories: data.categories, currentUser });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const data: Record<string, any> = {};

  formData.forEach((val, key) => {
    try {
      if (typeof val === "string") {
        const parsed = JSON.parse(val);

        if (Array.isArray(parsed)) {
          data[key] = parsed;
        } else {
          data[key] = val;
        }
      } else {
        data[key] = val;
      }
    } catch (e) {
      data[key] = val;
    }
  });

  const x = PostSchema.safeParse({
    title: data.title,
    description: data.description,
    markdown: data.markdown,
    categories: data.categories,
    thubmnail: data.thubmnail,
  });

  if (!x.success) {
    return errorHandler.formatError(x.error.formErrors.fieldErrors);
  }

  try {
    const userId = await requireUserId(request);

    const uuidRegex = new RegExp(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );

    const newPost = await db.post.create({
      data: {
        title: x.data.title,
        slug: slugify(x.data.title),
        description: x.data.description,
        content: x.data.markdown,
        authorId: userId,
        thumbnail: x.data.thubmnail,
        categories: {
          connect: x.data.categories
            .map((id) => ({ id }))
            .filter(({ id }) => uuidRegex.test(id)),
        },
      },
    });

    return redirect(`/posts/${newPost.slug}`);
  } catch (error) {
    const appErrors = errorHandler.detectPrismaError(error);
    const formattedErrors = errorHandler.formatError(appErrors);

    return formattedErrors;
  }
};

export default function NewPost() {
  const loaderData = useLoaderData<LoaderData>();

  const errors = useActionData<AppErrors>();
  const transition = useTransition();
  const submit = useSubmit();

  useDisplayErrors(errors);

  const form = useForm<NewPostScheme>({
    mode: "all",
    resolver: zodResolver(PostSchema),
  });

  return (
    <Layout user={loaderData?.currentUser}>
      <div className="flex flex-row justify-center items-center mt-16 px-12">
        <Form
          onSubmit={form.handleSubmit((data) => {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
              formData.append(
                key,
                typeof value === "string" ? value : JSON.stringify(value)
              );
            });

            submit(formData, { replace: true, method: "post" });
          })}
          method="post"
          className="w-full"
        >
          <Input className="m-2 my-3" name="title" control={form.control} />
          <Input
            className="m-2 my-3"
            name="description"
            control={form.control}
          />
          <TextArea
            rows={20}
            className="m-2 my-3"
            name="markdown"
            control={form.control}
          />

          <Select
            name="categories"
            control={form.control}
            className="w-1/2"
            placeholder="Categories"
            selectClassName="m-2 my-3"
            fieldNames={{
              label: "name",
              value: "id",
              options: "options",
            }}
            options={loaderData.categories}
          />

          <Upload className="my-3" name="thubmnail" control={form.control} />

          <button
            className="flex flex-row justify-center mx-auto border border-indigo-500 rounded px-4 py-2 mr-2"
            type="submit"
          >
            {transition.submission ? "Creating..." : "Create Post"}
          </button>
        </Form>
      </div>
    </Layout>
  );
}
