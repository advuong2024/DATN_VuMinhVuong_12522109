import { ConfigProvider } from "antd";
import COLORS from "./color";
import "antd/dist/reset.css";

const theme = {
  token: {
    colorPrimary: COLORS.primary,
    colorInfo: COLORS.vnaBlue,
    colorSuccess: COLORS.success,
    colorWarning: COLORS.warning,
    colorError: COLORS.error,
    colorBgContainer: COLORS.white,
    borderRadius: 4,
  },
  components: {
    Layout: {
      siderBg: COLORS.sidebar,
      headerBg: COLORS.primary,
    },
    Menu: {
      darkItemBg: COLORS.sidebar,
      darkItemSelectedBg: COLORS.selected,
      darkItemHoverBg: COLORS.hover,
      darkItemSelectedColor: COLORS.white,
      itemSelectedColor: COLORS.vnaBlue,
    },
    Button: {
      defaultBg: COLORS.primary,
      defaultColor: COLORS.white,
      defaultHoverBg: COLORS.hover,
    },
  },
};

export default function ThemeProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 16,
          borderRadius: 8,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
