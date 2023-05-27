import { createBrowserRouter } from "react-router-dom";
import { Cafes } from "./Cafes";
import { Employees } from "./Employees";
import { LandingPage } from "./LandingPage";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/cafes",
    element: <Cafes />,
  },
  { path: "/employees", element: <Employees /> },
]);
