/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import { isAuthenticated } from "../features/auth/utils/session";
import LoadingSpinner from "../components/LoadingSpinner";

const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const SignupPage = lazy(() => import("../features/auth/pages/SignupPage"));
const DashboardLayout = lazy(
  () => import("../features/dashboard/layout/DashboardLayout"),
);
const DashboardPage = lazy(
  () => import("../features/dashboard/pages/DashboardPage"),
);
const MyBookingsPage = lazy(
  () => import("../features/dashboard/pages/MyBookingsPage"),
);
const BrowseVenuesPage = lazy(
  () => import("../features/dashboard/pages/BrowseVenuesPage"),
);
const ResourcesPage = lazy(
  () => import("../features/dashboard/pages/ResourcesPage"),
);
const ApprovalsPage = lazy(
  () => import("../features/dashboard/pages/ApprovalsPage"),
);
const UsersPage = lazy(() => import("../features/dashboard/pages/UsersPage"));
const ReportsPage = lazy(
  () => import("../features/dashboard/pages/ReportsPage"),
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: isAuthenticated() ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <Navigate to="/login" replace />
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<LoadingSpinner minHeight="100vh" />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/signup",
    element: (
      <Suspense fallback={<LoadingSpinner minHeight="100vh" />}>
        <SignupPage />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingSpinner minHeight="100vh" />}>
          <DashboardLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<LoadingSpinner minHeight="50vh" />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: "bookings",
        element: (
          <Suspense fallback={<LoadingSpinner minHeight="50vh" />}>
            <MyBookingsPage />
          </Suspense>
        ),
      },
      {
        path: "venues",
        element: (
          <Suspense fallback={<LoadingSpinner minHeight="50vh" />}>
            <BrowseVenuesPage />
          </Suspense>
        ),
      },
      {
        path: "resources",
        element: (
          <ProtectedRoute roles={["admin", "manager"]}>
            <Suspense fallback={<LoadingSpinner minHeight="50vh" />}>
              <ResourcesPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "approvals",
        element: (
          <ProtectedRoute roles={["admin", "manager"]}>
            <Suspense fallback={<LoadingSpinner minHeight="50vh" />}>
              <ApprovalsPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <Suspense fallback={<LoadingSpinner minHeight="50vh" />}>
              <UsersPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "reports",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <Suspense fallback={<LoadingSpinner minHeight="50vh" />}>
              <ReportsPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
