import axios from 'axios'
// import { PublicClientApplication } from '@azure/msal-browser'
// import config from '../Auth/authConfig'
import { get } from 'svelte/store';
import { myMsalStore } from './store';

const value = get(myMsalStore)

console.log(value)

const accessToken = ''

const apiUrl = import.meta.env.VITE_API_URL

const axiosApi = axios.create({
    baseURL : apiUrl
})

// Implement method to execute requets
const apiRequest = async (method, endpoint, request) => {
   
    const headers = {
        "authorization": `Bearer ${accessToken}`
    }
    // Use the axios instance to performe the request
    return axiosApi({
        method,
        url: apiUrl+endpoint,
        data: request,
        headers
    }).then(res => {
        return Promise.resolve(res.data)
    }).catch(err => {
        return Promise.reject(err)
    })
}

// Get me 
const getMe = async() => apiRequest("get", '/me')
console.log(getMe)


export default getMe