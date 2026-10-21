import { appConfig } from "../app/config";
export default function StatusBar() {
  return <footer className="statusbar">Ambiente: {appConfig.environment} · Firebase: {appConfig.firebaseProjectId}</footer>;
}
