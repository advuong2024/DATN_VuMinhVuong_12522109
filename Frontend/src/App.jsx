import ThemeProvider from "./theme";
import AppRouter from "./routes";

export default function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
}