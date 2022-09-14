
  import { PublicClientApplication } from '@azure/msal-browser'
  import { authConfig } from '../../../config'
  import { msalClientStore } from '../services/store';
  // import authProvider from './authProvider.js'

  const login = async () => {

    const loginRequest = {
      scopes: ["User.Read "],
    };
    
    const msalClient = new PublicClientApplication(authConfig);
    try {
      const loginResponse = await msalClient.loginPopup({ scopes: ["User.Read "] })
      msalClient.setActiveAccount(loginResponse.account)
      msalClientStore.set(msalClient)
    } catch (error) {
      console.log('oh oh', error)
    }
}

export default login