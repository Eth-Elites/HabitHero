import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import AppLayout from "./layout";
import { LoginScreen } from "./screens/auth/Login";
import { DashboardScreen } from "./screens/dashboard/Dashboard";
import { HabitTrackingScreen } from "./screens/habits/HabitTracking";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppLayout>
        <Outlet />
      </AppLayout>
    ),
    children: [
      {
        path: "/",
        element: <LoginScreen />,
      },
      {
        path: "/dashboard",
        element: <DashboardScreen />,
      },
      {
        path: "/habit/:habitId",
        element: <HabitTrackingScreen />,
      },
      // Add more routes here as you create new screens
      // {
      //   path: "/profile",
      //   element: <ProfileScreen />,
      // },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
