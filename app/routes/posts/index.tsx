import * as React from "react";
import { useLoaderData, json } from "remix";
import type { LoaderFunction } from "remix";

import type { Post, Category, User } from "@prisma/client";

import { db } from "../../utils/db.server";

import { tw } from "twind";

import { Post as PostComp, Layout } from "../../ui";

import { Button } from "antd";
import { getUserInfo } from "../../utils/auth.server";

type PostWithCategory = Post & {
  categories: Array<Pick<Category, "name" | "id">>;
  author: User | null;
};

type LoaderData = {
  posts: Array<PostWithCategory>;
  categories: Array<Pick<Category, "name" | "id">>;
  currentUser: User | null;
};

export let loader: LoaderFunction = async ({ request }) => {
  const posts = await db.post.findMany({
    include: {
      categories: {
        select: {
          name: true,
          id: true,
        },
      },
      author: true,
    },
  });

  const categories = await db.category.findMany({
    select: {
      name: true,
      id: true,
    },
  });

  const currentUser = await getUserInfo(request);

  return json({ posts, categories, currentUser });
};

export default function Posts() {
  const data = useLoaderData<LoaderData>();

  const [targetCategory, setTargetCategory] = React.useState("");

  return (
    <Layout user={data?.currentUser}>
      <div className="mt-20 px-12">
        <div className="flex flex-row items-center bg-xcolor1">
          {data.categories.map((category) => (
            <div key={category.id} className="mr-6 py-4">
              <Button
                onClick={() => setTargetCategory(category.id)}
                type="link"
                className={tw(
                  "font-semibold text-zinc-200",
                  targetCategory === category.id
                    ? "font-bold text-zinc-100"
                    : ""
                )}
              >
                {category.name.toUpperCase()}
              </Button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-8">
          {data.posts.map((post) => (
            <PostComp
              className={tw(
                targetCategory === "" ||
                  post.categories.find(
                    (category) => category.id === targetCategory
                  )
                  ? ""
                  : "hidden"
              )}
              key={post.id}
              to={`/posts/${post.slug}`}
              thumbnail={post.thumbnail}
              title={post.title}
              description={post.description}
              tags={post.categories}
              author={post.author}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
