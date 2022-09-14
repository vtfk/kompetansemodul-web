import { writable } from "svelte/store";
import { PublicClientApplication } from '@azure/msal-browser'
import config from '../Auth/authConfig'

const myMsal = new PublicClientApplication(config);

export const myMsalStore = writable(myMsal)