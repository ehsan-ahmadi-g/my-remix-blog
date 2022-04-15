import * as React from "react";
import { Link, Form } from "remix";
import { tw } from "twind";
import { Dropdown, Menu } from "antd";

import type { User } from "@prisma/client";

import RemixLogo from "../ui/Logo";
import { DownOutlined } from "@ant-design/icons";

interface P {
  className?: string;
  user?: User | null;
}

function Layout({ children, className, user }: React.PropsWithChildren<P>) {
  const [scrollTop, setScrollTop] = React.useState(0);

  React.useEffect(() => {
    window?.addEventListener("scroll", () => {
      const scrollTop = document.documentElement.scrollTop;

      setScrollTop(scrollTop);
    });
  }, []);

  return (
    <>
      <header
        className={tw(
          "z-50 fixed top-0 bg-xcolor1 h-16 px-12 left-0 right-0",
          scrollTop > 400 ? "border-b-2 border-xcolor3" : "border-b-0",
          className
        )}
      >
        <div className="h-16 flex flex-row justify-between items-center">
          <Link to="/" title="Remix">
            <RemixLogo />
          </Link>

          <nav
            className="flex flex-row items-center"
            aria-label="Main navigation"
          >
            <ul className="flex flex-row">
              {[
                {
                  href: "/",
                  text: "Home",
                },
                {
                  href: "/posts",
                  text: "Posts",
                },
                user ? [{ href: "/admin/new", text: "Add Post" }] : [],
                {
                  href: "https://github.com/remix-run/remix",
                  text: "GitHub",
                },
              ]
                .flat()
                .map((el) => (
                  <li
                    key={el.href}
                    className="mx-3 text-bold text-base font-semibold"
                  >
                    <Link to={el.href}>{el.text}</Link>
                  </li>
                ))}

              {user ? (
                <li className="mx-3">
                  <Dropdown
                    trigger={["click"]}
                    overlay={
                      <Menu className="bg-xcolor2">
                        <Menu.Item className="text-white hover:text-xcolor1 hover:bg-xcolor4">
                          <Form action="/auth/logout" method="post">
                            <button type="submit" className="text-white">
                              Logout
                            </button>
                          </Form>
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <a
                      className="w-20 flex flex-row items-center justify-between text-bold text-base font-semibold"
                      onClick={(e) => e.preventDefault()}
                    >
                      {user?.name}

                      <DownOutlined />
                    </a>
                  </Dropdown>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="h-16 pt-8 px-12 bg-primary">
        <div className="h-16 flex flex-row justify-center items-center">
          <p>
            Crafted By{" "}
            <span className="font-bold text-zinc-100">Ehsan Ahmadi</span>{" "}
          </p>
        </div>
      </footer>
    </>
  );
}

export default Layout;
