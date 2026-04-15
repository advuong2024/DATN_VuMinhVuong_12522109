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
      darkItemBg: "transparent",
      darkItemHoverBg: "#dbf5fc",
      darkItemSelectedBg: "#dbf5fc",
      darkItemSelectedColor: "#2d2e2e",
      darkItemColor: "#2d2e2e",
      darkItemHoverColor: "#2d2e2e",
      itemBorderRadius: 6,
      itemMarginInline: 8,
      itemHeight: 40,
    },
    Button: {
      defaultBg: COLORS.primary,
      defaultColor: COLORS.white,
      defaultHoverBg: COLORS.hover,
    },
    Table: {
      headerBg: COLORS.primary,
      headerColor: COLORS.white,
      headerSplitColor: COLORS.border,
      borderColor: COLORS.primary,
      headerSortHoverBg: "#0b6bca",
      rowHoverBg: "#d0e6fc",
    },
  },
};

export default function ThemeProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        ...theme,
        token: {
          ...theme.token,
          fontSize: 16,
          borderRadius: 8,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
