import React from "react";
import { Navigate } from "react-router-dom";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import ForgetEmail from "../pages/Authentication/ForgetEmail"

// Dashboard
import Dashboard from "../pages/Dashboard/index";
import Profile from "../pages/Profile"
import LockScreen from "../pages/Authentication/auth-lock-screen"
import Contour from "../pages/Contour"

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name

  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  {
    path: "/profile",
    component: <Profile />,
  },
  {
    path: "/contour",
    component: <Contour />,
  },
];

const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/logout", component: <Logout /> },
  { path: "/forgot-email", component: <ForgetEmail /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
  { path: "/auth-lock-screen", component: <LockScreen /> },
];

export { authProtectedRoutes, publicRoutes };
