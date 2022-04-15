import { json, useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import { marked } from "marked";

import { Tag } from "antd";

import type { Post, User, Category } from "@prisma/client";

import { Layout } from "../../ui";

import { db } from "../../utils/db.server";
import { getUserInfo } from "../../utils/auth.server";

type LoaderData = {
  post: (Post & { categories: Category[] }) | null;
  currentUser: User | null;
} | null;
export const loader: LoaderFunction = async ({ params, request }) => {
  const post = await db.post.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      categories: true,
    },
  });

  const currentUser = await getUserInfo(request);

  return json({ post, currentUser });
};

export default function PostSlug() {
  const data = useLoaderData<LoaderData>();

  return (
    <Layout user={data?.currentUser}>
      <div className="mt-20 px-12">
        {data?.post?.thumbnail ? (
          <div
            className="bg-cover bg-center"
            style={{
              height: 600,
              width: "100%",
              backgroundImage: `
              linear-gradient(to top right,rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)),
              url(${data?.post?.thumbnail})
              `,
            }}
          />
        ) : null}

        <div className="flex flex-col px-2 mt-5">
          <h3 className="flex items-center text-4xl text-zinc-200">
            {data?.post?.title}
          </h3>

          <h4 className="text-2xl my-2 text-zinc-500">
            {data?.post?.description}
          </h4>

          <div className="flex flex-row items-center">
            {data?.post?.categories.map((category) => (
              <Tag
                key={category.name}
                className="w-28 mr-3 text-center text-sm mt-4 px-3 py-2 bg-[#0389A7] text-white border-0 capitalize font-semibold"
              >
                {category.name}
              </Tag>
            ))}
          </div>

          <div
            dangerouslySetInnerHTML={{
              __html: marked(data?.post?.content || "", {
                breaks: true,
              }),
            }}
            className="post-mdx-wrapper font-mono text-white mt-6 py-6"
          />
        </div>
      </div>
    </Layout>
  );
}
