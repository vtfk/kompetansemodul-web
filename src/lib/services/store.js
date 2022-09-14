import { writable } from "svelte/store";
import { PublicClientApplication } from '@azure/msal-browser'
import config from '../Auth/authConfig'

const msalClientTemplate = new PublicClientApplication(config);

export const msalClientStore = writable(msalClientTemplate)