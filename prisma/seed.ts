import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs/promises";
import bcrypt from "bcryptjs";
import parseFrontMatter from "front-matter";

import { slugify } from "../app/utils/slugify";

import type { Category } from "@prisma/client";

const db = new PrismaClient();

const imagesPath = path.join(__dirname, "../app/assets/images");
const postsPath = path.join(__dirname, "../posts");

const convertImageToBase64 = async (imgPath: string) => {
  const fullPath = path.join(imagesPath, imgPath);
  const thumbnail = await fs.readFile(fullPath);

  const extensionName = path.extname(fullPath);

  const base64ImageStr = `data:image/${extensionName
    .split(".")
    .pop()};base64,${thumbnail.toString("base64")}`;

  return base64ImageStr;
};

async function seed() {
  await db.post.deleteMany();
  await db.user.deleteMany();
  await db.category.deleteMany();

  const passwordHash = await bcrypt.hash("password", 10);

  const dibi = await db.user.create({
    data: {
      email: "dibi@asb.gabi",
      name: "dibi",
      passwordHash,
    },
  });

  const filepath = path.join(postsPath, "post-example.md");
  const file = await fs.readFile(filepath);
  const postMDX = parseFrontMatter<{ title: string; description: string }>(
    file.toString()
  );

  const categories: Array<Category> = await Promise.all(
    getCategories().map(async (category, i) => {
      return db.category.create({
        data: {
          name: category.name,
          slug: slugify(`${category.name}--${i}`),
          thumbnail: await convertImageToBase64(category.thumbnail),
        },
      });
    })
  );

  console.log({ dibi });

  await Promise.all(
    getPosts().map(async (post) => {
      return db.post.create({
        data: {
          thumbnail: await convertImageToBase64(post.thumbnail),
          title: post.title.trim(),
          description: post.description,
          content: postMDX.body,
          authorId: dibi.id,
          slug: slugify(`${post.title}--${post.categories.join("--")}`),
          categories: {
            connect: post.categories
              .map((post2) => ({
                id: categories.find((category) => category.name === post2)?.id,
              }))
              .filter((el) => !!el.id),
          },
        },
      });
    })
  );
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

function getCategories() {
  return [
    {
      name: "news",
      thumbnail: "header-news.jpg",
    },
    {
      name: "wallets",
      thumbnail: "header-wallets.jpg",
    },
    {
      name: "mining",
      thumbnail: "header-mining.jpg",
    },
    {
      name: "security",
      thumbnail: "header-security.jpg",
    },
    {
      name: "blockchain",
      thumbnail: "header-blockchain.jpg",
    },
  ];
}

const description = "Lorem, ipsum dolor sit amet consectetur adipisicing elit.";
const content = `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat dicta
      dolor libero sint tenetur porro voluptatibus maiores tempora animi dolorem
      sunt repudiandae modi accusantium nostrum veniam, eius nemo tempore ad?`;

function getPosts() {
  return [
    {
      title: "What Nasdaq Thinks of Bloackchain",
      description,
      content,
      thumbnail: "post1.jpg",
      categories: ["news"],
    },
    {
      title: "Coinbases' Newest Products and What to Expect",
      description,
      content,
      thumbnail: "post2.jpg",
      categories: ["news"],
    },
    {
      title: "What Top Celebrities are Saying About Crypto",
      description,
      content,
      thumbnail: "post3.jpg",
      categories: ["news"],
    },
    {
      title: "Securing Your Digital Currencies",
      description,
      content,
      thumbnail: "post4.jpg",
      categories: ["wallets"],
    },
    {
      title: "Why You Need a Wallet for Your Tokens",
      description,
      content,
      thumbnail: "post5.jpg",
      categories: ["wallets"],
    },
    {
      title: "Top 5 Wallets for You to Use",
      description,
      content,
      thumbnail: "post6.jpg",
      categories: ["wallets"],
    },
    {
      title: "Mining Equipment that Works",
      description,
      content,
      thumbnail: "post7.jpg",
      categories: ["mining"],
    },
    {
      title: "Is Digital Mining Becoming a New Fad?",
      description,
      content,
      thumbnail: "post8.jpg",
      categories: ["mining"],
    },
    {
      title: "What this NYC Crypto Community Is Doing",
      description,
      content,
      thumbnail: "post9.jpg",
      categories: ["mining"],
    },
    {
      title: "The Exchange and What You Need to Know",
      description,
      content,
      thumbnail: "post10.jpg",
      categories: ["security"],
    },
    {
      title: "What Bitcoin Means for Web Security",
      description,
      content,
      thumbnail: "post11.jpg",
      categories: ["security"],
    },
    {
      title: "Security Matters Within Blockchain",
      description,
      content,
      thumbnail: "post12.jpg",
      categories: ["security"],
    },
    {
      title: "Blockchain - So, What Does It Mean?",
      description,
      content,
      thumbnail: "post13.jpg",
      categories: ["blockchain"],
    },
    {
      title: "How Blockchain Is Changing the Economy",
      description,
      content,
      thumbnail: "post14.jpg",
      categories: ["blockchain"],
    },
    {
      title: "Exchanges to Master in 2021",
      description,
      content,
      thumbnail: "post15.jpg",
      categories: ["blockchain"],
    },
    {
      title: "Will Bitcoin Destroy Banking?",
      description,
      content,
      thumbnail: "post16.jpg",
      categories: ["blockchain"],
    },
  ];
}
