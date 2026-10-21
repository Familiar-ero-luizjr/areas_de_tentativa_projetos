import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import FirebasePage from "../pages/firebase/FirebasePage";
import StripePage from "../pages/stripe/StripePage";
import MapsPage from "../pages/maps/MapsPage";
import ScenariosPage from "../pages/scenarios/ScenariosPage";
import ChaosPage from "../pages/chaos/ChaosPage";
import LogsPage from "../pages/logs/LogsPage";
import SettingsPage from "../pages/settings/SettingsPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="firebase/*" element={<FirebasePage />} />
        <Route path="stripe" element={<StripePage />} />
        <Route path="maps" element={<MapsPage />} />
        <Route path="scenarios/*" element={<ScenariosPage />} />
        <Route path="chaos" element={<ChaosPage />} />
        <Route path="logs" element={<LogsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
