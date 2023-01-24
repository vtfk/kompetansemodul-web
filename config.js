export const api = {
  // url: import.meta.env.VITE_API_URL ?? 'uriSomewhere',
  url: import.meta.env.VITE_API_URL_LOCAL, // Local API
  scopes: (import.meta.env.VITE_API_SCOPES && import.meta.env.VITE_API_SCOPES.split(',')) ?? ['et skikkelig skup']
}
export const authConfig = {
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID ?? 'klientID',
    authority: import.meta.env.VITE_CLIENT_ISS ?? 'autiruireuir',
    redirectUri: import.meta.env.VITE_REDIRECT_URI ?? 'uriSomewhere'
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
  }
}
export const environment = import.meta.env.VITE_ENV ?? 'test'
export const adminRole = import.meta.env.VITE_ADMIN_ROLE ?? 'hubbabubbabububub'
export const acosFlowProcessId = import.meta.env.VITE_ACOS_FLOW_PROCESS_ID ?? 'tullball'
