import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { ColorsPage } from "./pages/ColorsPage";
import { PickerPage } from "./pages/PickerPage";
import { ColorDetail } from "./pages/ColorDetail";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "colors", Component: ColorsPage },
      { path: "picker", Component: PickerPage },
      { path: "color/:id", Component: ColorDetail },
      { path: "*", Component: NotFound },
    ],
  },
]);
