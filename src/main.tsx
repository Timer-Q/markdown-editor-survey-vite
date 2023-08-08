import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import CherryMarkdown from "./pages/markdowns/CherryMarkdown";
import ByteMD from "./pages/markdowns/bytemd";
// import MarkText from "./pages/markdowns/marktext";
import Tui from "./pages/markdowns/tui-editor";
import Vditor from "./pages/markdowns/vditor";
import Tiptap from "./pages/markdowns/tiptap";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "cherry-markdown",
        element: <CherryMarkdown />,
      },
      {
        path: "bytemd",
        element: <ByteMD />,
      },
      // {
      //   path: "marktext",
      //   element: <MarkText />,
      // },
      {
        path: "tui",
        element: <Tui />,
      },
      {
        path: "vditor",
        element: <Vditor />,
      },
      {
        path: "tiptap",
        element: <Tiptap />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
