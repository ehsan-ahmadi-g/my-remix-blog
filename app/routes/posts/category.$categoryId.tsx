import { useLoaderData, json } from "remix";
import type { LoaderFunction } from "remix";

import type { Post, Category, User } from "@prisma/client";

import { db } from "../../utils/db.server";

import { Layout, Post as PostComp } from "../../ui";
import { getUserInfo } from "../../utils/auth.server";

type PostWithCategory = Post & {
  author: User | null;
};

type LoaderData = {
  posts: Array<PostWithCategory>;
  category: Category;
  currentUser: User | null;
};

export let loader: LoaderFunction = async ({ request, params }) => {
  const category = await db.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  const data = {
    posts: await db.post.findMany({
      take: 1,
      where: {
        categories: {
          every: {
            id: params.categoryId,
          },
        },
      },
      include: {
        author: true,
      },
    }),
  };

  const currentUser = await getUserInfo(request);

  return json({ posts: data.posts, category, currentUser });
};

export default function Posts() {
  const data = useLoaderData<LoaderData>();

  return (
    <Layout user={data?.currentUser}>
      <div className="mt-16">
        <div
          style={{
            backgroundImage: `
          linear-gradient(to top right,rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
          url(${data.category.thumbnail})
          `,
          }}
          className="flex flex-col items-start justify-center h-96 px-20 rounded bg-center bg-cover"
        >
          <h1 className="text-6xl font-bold text-zinc-100">
            {data.category.name}
          </h1>

          <h3 className="w-1/2 text-xl font-normal font-sans text-zinc-500 mt-3">
            Publication template for blockchain enthusiast, including podcast,
            multiple CMS collections and eCommerce for donation.
          </h3>
        </div>

        <div className="grid grid-cols-4 gap-y-4 gap-x-8 px-12 mt-16">
          {data.posts.map((post) => (
            <PostComp
              key={post.id}
              to={`/posts/${post.slug}`}
              title={post.title}
              thumbnail={post.thumbnail}
              description={post.description}
              author={post.author}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
