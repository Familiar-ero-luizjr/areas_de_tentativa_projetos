import { HashRouter } from "react-router-dom";
import { AppProviders } from "./app/providers";
import AppRouter from "./app/router";

export default function App() {
  return (
    <HashRouter>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </HashRouter>
  );
}
