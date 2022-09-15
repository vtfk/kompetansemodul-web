import axios from 'axios'
import { api } from '../../../config'
import { get } from 'svelte/store';
import { msalClientStore } from './store';

// Implement method to execute requets
const apiRequest = async (method, endpoint, body) => {
    const msalClient = get(msalClientStore)
    const { accessToken } = await msalClient.acquireTokenSilent({ scopes: api.scopes });

    const headers = {
        "authorization": `Bearer ${accessToken}`
    }
    if (['get', 'delete'].includes(method)) {
        const res = await axios[method](`${api.url}/${endpoint}`, { headers })
        return res.data
    } else {
        const res = await axios[method](`${api.url}/${endpoint}`, body, { headers })
        return res.data
    }
}

// Get me 
const getMe = async() => await apiRequest("get", 'me')

export default getMe
