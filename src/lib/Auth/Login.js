
import { PublicClientApplication } from '@azure/msal-browser'
import { authConfig } from '../../../config'
import { msalClientStore } from '../services/store'
import { get } from 'svelte/store'
// import authProvider from './authProvider.js'

const login = async (forceLogin = false) => {
  const msalClient = get(msalClientStore) || new PublicClientApplication(authConfig)
  const accounts = msalClient.getAllAccounts()
  if (accounts.length === 0 || forceLogin) {
    const loginResponse = await msalClient.loginPopup({ scopes: ['User.Read '] })
    msalClient.setActiveAccount(loginResponse.account)
    msalClientStore.set(msalClient)
    return loginResponse.account
  }
  return accounts[0]
}

export default login
