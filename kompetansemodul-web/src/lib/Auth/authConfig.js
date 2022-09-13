// Config object to be passed to MSAL on creation
const msalConfig = {
  auth: {
    clientId: '',
    authority: 'https://login.microsoftonline.com/',
    redirectUri: 'http://localhost:5173/',
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  }
};

export default msalConfig