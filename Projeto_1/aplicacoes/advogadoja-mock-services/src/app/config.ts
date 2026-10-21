const viteEnv = ((import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {});

export const appConfig = {
  appName: "AdvogadoJá+ Mock Services",
  environment: viteEnv.VITE_MOCK_ENV ?? "local",
  firebaseProjectId: viteEnv.VITE_FIREBASE_PROJECT_ID ?? "advogadoja-mock",
  useFirebaseEmulator: (viteEnv.VITE_FIREBASE_USE_EMULATOR ?? "true") === "true",
  stripeMode: viteEnv.VITE_STRIPE_MODE ?? "mock",
  mapsMode: viteEnv.VITE_MAPS_MODE ?? "mock",
  mockApiUrl: viteEnv.VITE_MOCK_API_URL ?? "http://localhost:8787",
  defaultLocation: {
    lat: Number(viteEnv.VITE_DEFAULT_LAT ?? -10.9472),
    lng: Number(viteEnv.VITE_DEFAULT_LNG ?? -37.0731),
  },
} as const;
