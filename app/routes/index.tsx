import { useLoaderData, Link, json } from "remix";
import type { MetaFunction, LoaderFunction } from "remix";

import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import type { Post, Category, User } from "@prisma/client";

import { tw } from "twind";

import { db } from "../utils/db.server";
import { getUserInfo } from "../utils/auth.server";

import { Post as PostComp, Layout } from "../ui";

import HeaderBG from "../assets/images/home-header.jpeg";

import Carousel1 from "../assets/images/carousel-1.jpg";
import Carousel2 from "../assets/images/carousel-2.jpg";

type PostWithCategory = Exclude<Post, "headerImage"> & {
  categories: Array<Category>;
  author: User | null;
};

type LoaderData = {
  posts: Array<PostWithCategory>;
};

type FilteredLoaderData = {
  [x: Category["name"]]: Array<PostWithCategory>;
};

type LoaderReturnType = {
  posts: Record<Category["name"], Array<PostWithCategory>>;
  categories: Array<Category>;
  currentUser: User;
};

export let loader: LoaderFunction = async ({ request }) => {
  const data: LoaderData = {
    posts: await db.post.findMany({
      select: {
        categories: {
          select: {
            name: true,
            id: true,
          },
        },
        author: true,
        content: true,
        description: true,
        id: true,
        slug: true,
        thumbnail: true,
        createdAt: true,
        updatedAt: true,
        published: true,
        title: true,
        authorId: true,
        headerImage: false,
      },
    }),
  };

  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
      posts: false,
      slug: false,
      thumbnail: false,
      headerImage: false,
    },
  });

  const currentUser = await getUserInfo(request);

  const filteredPosts: FilteredLoaderData = {};

  categories.forEach((category) => {
    if (!filteredPosts[category.name]) {
      filteredPosts[category.name] = [];
    }

    filteredPosts[category.name] = data.posts
      .filter((post) =>
        post.categories.find((category2) => category2.name === category.name)
      )
      .flat();
  });

  return json({ posts: filteredPosts, categories, currentUser });
};

export const meta: MetaFunction = () => {
  return {
    title: "Ehsan Ahmadi Blog",
    description: "Welcome to my blog",
  };
};

export default function Index() {
  const data = useLoaderData<LoaderReturnType>();

  return (
    <Layout user={data.currentUser}>
      <div
        style={{
          backgroundImage: `
          linear-gradient(to top right,rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
          url(${HeaderBG})
          `,
        }}
        className="flex flex-col items-start justify-center h-96 px-20 rounded bg-center bg-cover"
      >
        <h1 className="text-6xl font-bold text-zinc-100">
          Everything blockchain.
        </h1>

        <h3 className="w-1/2 text-xl font-normal font-sans text-zinc-500 mt-3">
          Publication template for blockchain enthusiast, including podcast,
          multiple CMS collections and eCommerce for donation.
        </h3>
      </div>

      <div className="flex flex-row items-center bg-xcolor0 px-24">
        {data.categories.map((category) => (
          <div key={category.id} className="mr-6 py-4">
            <Link className="font-bold" to={`#${category.name}`}>
              {category.name.toUpperCase()}
            </Link>
          </div>
        ))}
      </div>

      <div className="px-24">
        <Carousel
          autoplay={false}
          arrows
          prevArrow={
            <div>
              <LeftOutlined className="inline-flex justify-center text-3xl" />
            </div>
          }
          nextArrow={
            <div>
              <RightOutlined className="inline-flex justify-center text-3xl" />
            </div>
          }
        >
          <div
            className={tw(
              "relative flex! flex-row justify-center items-center h-96 w-full text-red-500"
            )}
          >
            <img className="w-full h-auto" src={Carousel1} alt="carousel 1" />

            <p className="font-sans text-base absolute text-zinc-100 bg-xcolor0 p-3 bottom-4 right-14">
              What Nasdaq Thinks of Bloackchain
            </p>
          </div>

          <div
            className={tw(
              "relative flex! flex-row justify-center items-center h-96 w-full text-red-500"
            )}
          >
            <img className="w-full h-auto" src={Carousel2} alt="carousel 2" />

            <p className="font-sans text-base absolute text-xcolor0 bg-zinc-200 p-3 bottom-3 right-14">
              What Bitcoin Means for Web Security
            </p>
          </div>
        </Carousel>
      </div>

      {data.categories.map((category) => (
        <div id={category.name} key={category.id} className="mt-10 px-24">
          <h1 className="font-bold text-3xl mb-5">
            {category.name.toUpperCase()}
          </h1>

          <div className="grid grid-cols-3 gap-x-28">
            {data.posts[category.name].slice(0, 3).map((post) => (
              <PostComp
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

          <div className="flex flex-row justify-end items-center">
            <Link
              className="border-0 bg-xcolor4 text-xcolor0 rounded px-4 py-2 mr-2 hover:text-xcolor0"
              to={`/posts/category/${category.id}`}
            >
              More...
            </Link>
          </div>
        </div>
      ))}
    </Layout>
  );
}
