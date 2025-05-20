// menuItems.js
import { HddFilled, HighlightFilled, HomeFilled } from "@ant-design/icons";
import React from "react";

interface MenuItem {
  key: string;
  path: string;
  label: string;
  icon: JSX.Element;
  roles: string[];
}

const menuItems: MenuItem[] = [
  {
    key: "home",
    path: "/home",
    label: "首页",
    icon: React.createElement(HomeFilled),  
    roles: ["common", "super"],
  },
  {
    key: "tripAdmin",
    path: "/tripAdmin",
    label: "游记审核管理",
    icon: React.createElement(HighlightFilled),
    roles: ["common", "super"],
  },
  {
    key: "userAdmin",
    path: "/userAdmin",
    label: "审核人员管理",
    icon: React.createElement(HddFilled),
    roles: ["super"], // 仅'super'角色可以访问
  }
];

export default menuItems;
