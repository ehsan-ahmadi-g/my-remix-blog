import { Link, LinkProps } from "remix";
import React from "react";

import { Tag } from "antd";
import { tw } from "twind";

import Avatar from "../assets/images/author-avatar.jpg";

import DefaultImage from "../assets/images/post1.jpg";

interface P extends LinkProps {
  title: string;
  description: string;
  thumbnail?: string | null;
  tags?: Array<{ name: string }>;
  author: {
    name: string;
  } | null;
}

const Post: React.FC<P> = ({
  to,
  title,
  description,
  thumbnail,
  tags,
  author,
  className,
}) => {
  return (
    <Link className={className} to={to}>
      <div className="group relative">
        <div
          className={tw(
            "transition-all opacity-100 group-hover:(bg-red-500 scale-105 opacity-10)"
          )}
        >
          <img
            src={thumbnail || DefaultImage}
            alt="post thumbnail"
            className="h-auto w-full mx-auto"
            style={{
              height: 320,
              minWidth: 320,
            }}
          />
        </div>

        <p
          className={tw(
            "bottom-3 invisible absolute w-full group-hover:(visible flex text-white)"
          )}
        >
          {description}
        </p>
      </div>

      <div className="flex flex-col items-center">
        <div className="py-2">
          {tags?.length
            ? tags.map((tag) => (
                <Tag
                  key={tag.name}
                  className="inline-flex text-sm m-2 p-2 bg-[#0389A7] text-white border-0 capitalize font-semibold"
                >
                  {tag.name}
                </Tag>
              ))
            : null}
        </div>

        <div className="flex flex-col">
          <h3 className="text-center mt-3 mb-2 text-lg w-52 text-[#bdbdbd] font-sansx">
            {title}
          </h3>

          <div className="flex flex-row justify-center items-center">
            <p className="text-center text-lg mr-3 text-[#bdbdbd] font-medium">
              {author?.name}
            </p>

            <img
              className="rounded-full w-8 h-8"
              src={Avatar}
              alt="author avatar"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Post;
