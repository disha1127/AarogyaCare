import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { LanguageProvider } from "./context/LanguageContext";
import { OfflineProvider } from "./context/OfflineContext";

createRoot(document.getElementById("root")!).render(
  <OfflineProvider>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </OfflineProvider>
);
