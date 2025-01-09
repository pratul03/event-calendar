import Calendar from "./components/Calender";
import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="container mx-auto p-4">
        {/* Header */}
        <header className="flex justify-between items-center mb-4">
          <ModeToggle /> {/* Add the mode toggle button here */}
        </header>

        {/* Calendar Component */}
        <Calendar />
      </div>
    </ThemeProvider>
  );
}

export default App;
