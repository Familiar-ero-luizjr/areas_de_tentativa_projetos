/** The client always speaks HTTP; DATA_PROVIDER is exclusively an API-side setting. */
export const servicesConfig={apiUrl:process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'};
