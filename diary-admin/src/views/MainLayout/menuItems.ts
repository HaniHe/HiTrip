// menuItems.js
import { HddFilled, HighlightFilled } from "@ant-design/icons";
import React from "react";

interface MenuItem {
  key: string;
  path: string;
  label: string;
  icon: JSX.Element;
  roles: string[];
}

const menuItems: MenuItem[] = [
  // {
  //   key: "dataMiner",
  //   path: "/dataMiner",
  //   label: "Data Miner",
  //   icon: React.createElement(HeartOutlined),
  //   roles: ["common", "super"],
  // },
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
  },
  // {
  //   key: "event",
  //   path: "/event",
  //   label: "Event",
  //   icon: React.createElement(HeartOutlined),
  //   roles: ["common", "super"],
  // },
];

export default menuItems;
