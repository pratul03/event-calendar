import Calendar from "./components/Calender";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="container mx-auto p-4">
        <Calendar />
      </div>
    </ThemeProvider>
  );
}

export default App;
