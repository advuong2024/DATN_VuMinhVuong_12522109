import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AppHeader from "./Header";
import AppFooter from "./Footer";

const { Content } = Layout;

export default function UserLayout() {
    return (
        <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
            <AppHeader />

            <Content style={{ flex: 1, paddingTop: 80}}>
                <Outlet />
            </Content>

            <AppFooter />
        </Layout>
    );
}