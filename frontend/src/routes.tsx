import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginScreen } from "./screens/auth/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginScreen />,
  },
  // Add more routes here as you create new screens
  // {
  //   path: "/dashboard",
  //   element: <DashboardScreen />,
  // },
  // {
  //   path: "/profile",
  //   element: <ProfileScreen />,
  // },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
