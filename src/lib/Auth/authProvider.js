// import axios from 'axios'
// import { PublicClientApplication } from '@azure/msal-browser'

// function msalProvider(idToken, token, expires) {

// console.log(idToken)
// console.log(token)
// console.log(expires)

// const is401 = error => /401/.test(error.message)
// const isValid = (token, expires) => token && expires > new Date().getTime()

// const retry = async (func, returnFullResponse) => {
//     if (isValid(idToken, expires)) {
//       axios.defaults.headers.common.Authorization = `Bearer ${idToken}`
//       try {
//         const res = await func()
//         return !returnFullResponse ? res.data : res
//       } catch (error) {
//         if (is401(error)) {
//           const accounts = PublicClientApplication.getAllAccounts()
//           if (accounts && accounts.length > 0) await updateToken(accounts[0])

//           axios.defaults.headers.common.Authorization = `Bearer ${idToken}`
//           try {
//             const res = await func()
//             return !returnFullResponse ? res.data : res
//           } catch (error) {
//             console.error(error)
//             return false
//           }
//         } else {
//           console.error(error)
//           return false
//         }
//       }
//     } else {
//       console.warn('invalid or expired token')
//       const accounts = publicClient.getAllAccounts()
//       if (accounts && accounts.length > 0) await updateToken(accounts[0])

//       return func()
//     }
//   }

// const apiGet = (url, returnFullResponse = false) => retry(() => axios.get(url), returnFullResponse)

// }
// export default msalProvider
