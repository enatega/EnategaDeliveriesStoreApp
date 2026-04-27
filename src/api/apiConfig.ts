export const apiConfig = {
  baseUrl:
    process.env.EXPO_PUBLIC_API_BASE_URL ??
    'https://enatega-super-app-production.up.railway.app/api/v1',
  timeoutMs: 15_000,
};
