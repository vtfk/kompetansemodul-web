import axios from 'axios'
import { api } from '../../../config'
import { get } from 'svelte/store'
import { msalClientStore } from './store'
import login from '../Auth/Login'

// Implement method to execute requets
const apiRequest = async (method, endpoint, body) => {
  // console.log("NÅÅÅÅ STARTÆR JEG: ", method, endpoint) // om du er redd for at den spinner api-kall kan du teste dette ;)
  let accessToken
  try {
    const msalClient = get(msalClientStore)
    accessToken = (await msalClient.acquireTokenSilent({ scopes: api.scopes })).accessToken
  } catch (error) {
    // If acquireTokenSilent failed - we assume the user has been logged out or the refresh token has expired - simply log in again :)
    await login(true)
    const msalClient = get(msalClientStore)
    accessToken = (await msalClient.acquireTokenSilent({ scopes: api.scopes })).accessToken
  }

  const headers = {
    authorization: `Bearer ${accessToken}`
  }
  if (['get', 'delete'].includes(method)) {
    const res = await axios[method](`${api.url}/${endpoint}`, { headers })
    // console.log('NÅÅÅ ER JEG FÆRRI')
    return res.data
  } else {
    const res = await axios[method](`${api.url}/${endpoint}`, body, { headers })
    // console.log('NÅÅÅ HAR JEG BÆSJA PÅ MEG')
    return res.data
  }
}

// Get me
export const getMe = async () => await apiRequest('get', 'me')

// Get user
export const getPerson = async (parameter) => await apiRequest('get', `GetEmployee/${parameter}`)

// Get tasks
export const getTasks = async (parameter) => await apiRequest('get', `GetTasks/${parameter}`)

// Get org
export const getOrg = async () => await apiRequest('get', 'GetOrg')

// Save my edited competence
export const saveCompetence = async (competence) => await apiRequest('post', 'UpsertCompetence', competence)

// Get employee positions (data list)
export const getPositions = async () => await apiRequest('get', 'GetPositions')

// Get chucky
export const getChuck = async () => {
  const res = (await axios.get('https://api.chucknorris.io/jokes/categories')).data
  return res.map(ele => {
    return {
      value: ele,
      category: 'Et valg'
    }
  })
}
