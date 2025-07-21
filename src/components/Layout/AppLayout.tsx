import React from "react";
import { Layout, Typography } from "antd";
import NavigationMenu from "./NavigationMenu";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center px-6 bg-slate-800">
        <Title level={3} className="text-white my-4">
          User Management App
        </Title>
      </Header>
      <Layout>
        <Sider width={200} className="bg-white">
          <NavigationMenu />
        </Sider>
        <Layout className="p-6">
          <Content className="overflow-auto bg-white p-6 m-0 min-h-[280px] rounded-lg">
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
