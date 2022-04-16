import * as React from "react";
import { setup } from "twind";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "remix";
import type { LinksFunction } from "remix";
import { ToastContainer } from "react-toastify";

import { Layout } from "./ui";

import styles from "./styles/tailwind.css";
import antdCustomStyles from "./styles/antd.customize.css";
import antdStyles from "antd/dist/antd.css";
import toastStyle from "react-toastify/dist/ReactToastify.css";

setup({
  theme: {
    extend: {
      colors: {
        xcolor1: "#01071D",
        xcolor2: "#1F2833",
        xcolor3: "#C5C6C7",
        xcolor4: "#66FCF1",
        xcolor5: "#45A29E",
      },
    },
  },
});

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: antdStyles },
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: antdCustomStyles },
    { rel: "stylesheet", href: toastStyle },
  ];
};

export default function App() {
  return (
    <Document>
      <Outlet />

      <ToastContainer />
    </Document>
  );
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body className="bg-xcolor1 text-white font-sans">
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Error!">
      <Layout>
        <div className="px-12 mt-12">
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p className="text-3xl font-bold text-center mt-5">
            Server is down , please try again later
          </p>
        </div>
      </Layout>
    </Document>
  );
}
