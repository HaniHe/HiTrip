import LoginPage from "@views/login";
import Manage from "@views/manage";
import Admin from "@views/admin";
import EventPage from "@/views/event";
import { HeartOutlined } from "@ant-design/icons";
import React from "react";

interface Route {
  path: string;
  component: React.ComponentType;
  label: string;
  icon: React.ReactNode;
  isPublic?: boolean;
}

const routes: Route[] = [
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
  {
    path: "/event",
    component: EventPage,
    label: "EventPage",
    icon: React.createElement(HeartOutlined, null),
  },
];

export default routes;