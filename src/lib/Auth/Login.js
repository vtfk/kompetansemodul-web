
  import { PublicClientApplication } from '@azure/msal-browser'
  import config from './authConfig'
  import { myMsalStore } from '../services/store';
  // import authProvider from './authProvider.js'

  const scope = import.meta.env.VITE_API_SCOPE

  function login() {
    const loginRequest = {
      scopes: ["User.Read "],
    };
    
    let accountId = "";
    
    const myMsal = new PublicClientApplication(config);
  
    myMsal
    .loginPopup(loginRequest)
    .then(async function (loginResponse) {
      accountId = loginResponse.account.homeAccountId;

      
      console.log(loginResponse.account)
      myMsal.setActiveAccount(loginResponse.account)
      const customApiToken = await myMsal.acquireTokenSilent({
        scopes: [scope]
      });

      myMsalStore.set(myMsal) //Denne skal sendes til et API for validering 
    
    })
    .catch(function (error) {
      //login failure
      console.log(error);
    });
}

// async function sso() {
//   const myMsal = new PublicClientApplication(config);

//   const request = {
//     scopes: ["user.read"],
//     sid: sid,
//   };
  
//    try {
//       const loginResponse = await myMsal.ssoSilent(request);
//   } catch (err) {
//       if (err instanceof InteractionRequiredAuthError) {
//           const loginResponse = await myMsal.loginPopup(request).catch(error => {
//               // handle error
//           });
//       } else {
//           // handle error
//       }
//   }
// }

export default login