import LoginPage from "@views/login";
import Manage from "@views/manage";
import Admin from "@views/admin";
import { HeartOutlined } from "@ant-design/icons";
import React from "react";

const routes = [
  {
    path: "/",
    component: LoginPage,
    label: "Login",
    icon: React.createElement(HeartOutlined, null),
  },
  {
    path: "/manage",
    component: Manage,
    label: "Manage",
    icon: React.createElement(HeartOutlined, null),
  },
  {
    path: "/admin",
    component: Admin,
    label: "Admin",
    icon: React.createElement(HeartOutlined, null),
  },
];

export default routes;