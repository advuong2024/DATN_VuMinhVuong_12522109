import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AppHeader from "./Header";
import AppFooter from "./Footer";
import ScrollToTop from "@/components/common/ScrollToTop";

const { Content } = Layout;

export default function UserLayout() {
    return (
        <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
            <ScrollToTop />
            <AppHeader />

            <Content style={{ flex: 1 }}>
                <Outlet />
            </Content>

            <AppFooter />
        </Layout>
    );
}