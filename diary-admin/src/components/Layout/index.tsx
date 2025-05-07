import React,{ ReactNode, useState } from 'react';
import { HddFilled, HighlightFilled, InfoCircleOutlined, CloseCircleOutlined, 
         DownCircleOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import type { MenuProps} from 'antd';
import { Layout as AntdLayout, Menu, Dropdown, Space, Button, Breadcrumb } from 'antd';
import Image from 'next/image'
import { useRouter } from 'next/router';

import styles from './index.module.css'


const { Header, Content, Sider } = AntdLayout;


// 左侧菜单项
const ITEMS = [
    {
      label: "游记审核管理",
      key: "manage", //跳转至manage页面
      icon: React.createElement(HighlightFilled)
    },
    {
      label: "用户信息管理",
      key: "admin",//跳转至admin页面
      icon: React.createElement(HddFilled)
    },
    
]
// 用户下拉菜单项
const USER_ITEMS: MenuProps['items'] = [
  {
    key: 'admin',
    label: "用户中心",
    icon: <InfoCircleOutlined/>,
  },
  {
    key: 'exit',
    label: "退出",
    icon: <CloseCircleOutlined />,
  }
];

export function Layout ({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const handleMenuClick: MenuProps['onClick'] = ({key}) => {
      router.push(key);
    }
    
    return (
      <AntdLayout className={styles.main}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className={styles.logoBox}>
            <Image 
              src="/logo.png" 
              alt="logo" 
              width={50} 
              height={50} 
              className={styles.logo}/>
             <span>{!collapsed ? "HiTrip" : ""}</span>
          </div>
          <Menu 
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%', borderRight: 0}}
                items={ITEMS}
                onClick={handleMenuClick}
              />
        </Sider>
        <AntdLayout className= {styles.rightside} >
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
                      用户名
                      <DownCircleOutlined />
                    </Space>
                  </a>
              </Dropdown>
            </span>
          </Header>
          <AntdLayout className={styles.sectionContent}>
            <Content className={styles.content}>{children}</Content>
          </AntdLayout>
        </AntdLayout>
      </AntdLayout>
  );
};

export default Layout;