
  import { PublicClientApplication } from '@azure/msal-browser'
  import { authConfig } from '../../../config'
  import { msalClientStore } from '../services/store';
  // import authProvider from './authProvider.js'

  const login = async () => {
    const msalClient = new PublicClientApplication(authConfig);
    try {
      const loginResponse = await msalClient.loginPopup({ scopes: ["User.Read "] })
      msalClient.setActiveAccount(loginResponse.account)
      msalClientStore.set(msalClient)

      return loginResponse
    } catch (error) {
      throw error
    }
}

export default login
