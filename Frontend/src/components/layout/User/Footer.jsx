import { Layout, theme } from "antd";

const { Footer } = Layout;

export default function AppFooter() {
  return (
    <Footer
        style = {{
            textAlign: "center",
            background: "#fff",
            padding: "15px 0",
            marginTop: "auto",
        }}
    >
        © {new Date().getFullYear()} Clinic Booking System
    </Footer>
  );
}