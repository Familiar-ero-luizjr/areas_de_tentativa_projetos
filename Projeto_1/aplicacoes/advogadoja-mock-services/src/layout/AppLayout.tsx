import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import StatusBar from "./StatusBar";

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Header />
      <div className="app-main">
        <Sidebar />
        <main className="content"><Outlet /></main>
      </div>
      <StatusBar />
    </div>
  );
}
