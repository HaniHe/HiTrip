// MainLayout.tsx
import React, { ReactNode, useState, useEffect } from "react";
import { getToken } from "@/utils/auth";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { Layout, Menu, Button, Modal, Dropdown, Space, MenuProps, Breadcrumb } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownCircleOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";
import menuItems from "./menuItems";
import { clearUser } from "@/store/actions";
import styles from './index.module.css'



const { Header, Sider, Content } = Layout;

// 定义Props类型，包括children
interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<string[]>([]);
  const userRole = Cookies.get("adminRole") || "admin";
  const username = Cookies.get("adminName");
  const token = getToken();
  // 如果用户未登录，直接重定向到登录页面
  if (!token) {
    return <Navigate to="/" replace />;
  }

  const filteredMenuItems = menuItems
    .filter((item) => item.roles.includes(userRole))
    .map((item) => ({
      ...item,
      label: <Link to={item.path}>{item.label}</Link>,
    }));

  // 退出登录
  const logout = () => {
    // 弹出确认框使用antd的Modal组件
    Modal.confirm({
      title: "确认退出登录？",
      onOk: () => {
        // 清除token
        // removeToken();
        // removeUser();
        clearUser();
        // 跳转到登录页面
        navigate("/");
      },
    });
  };
// 用户下拉菜单项
const USER_ITEMS: MenuProps['items'] = [
  {
    key: '1',
    label: "用户中心",
    icon: <InfoCircleOutlined/>,
  },
  {
    key: '2',
    label: (
      <span
        onClick={logout}
      >
        退出
      </span>
    ),
    icon: <CloseCircleOutlined />,
  }
];

  return (
    <Layout className={styles.main}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className={styles.logoBox}>
          <img src="src/assets/logo.png" className={styles.logo} alt="logo" />
          <span>{!collapsed ? "HiTrip" : ""}</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["tripAdmin"]}
          items={filteredMenuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
          }))}
          style={{ height: '100%', borderRight: 0}}
        />
      </Sider>
      <Layout className= {styles.rightside}>
        <Header className={styles.header}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className={styles.menubtn}
          />
          <span className={styles.user}>
              <Dropdown menu={{ items: USER_ITEMS }}>
                  <a onClick={(e) => e.preventDefault()}> 
                    <Space>
                      {username}
                      <DownCircleOutlined />
                    </Space>
                  </a>
              </Dropdown>
            </span>
        </Header>
        <Layout className={styles.sectionContent}>
          <Breadcrumb style={{ margin: '10px 15px' }}>
            {/* <Breadcrumb.Item>首页</Breadcrumb.Item> */}
            {selectedMenu.map((item, index) => (
              <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <Content className={styles.content}>{children}</Content>
        </Layout>
        </Layout>
      </Layout>
  );
};

export default MainLayout;
