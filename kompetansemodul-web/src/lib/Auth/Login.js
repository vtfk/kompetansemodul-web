
  import { PublicClientApplication } from '@azure/msal-browser'
  import config from './authConfig'
  // import authProvider from './authProvider.js'

  const scope = "api://3c19d9b4-20c0-43ba-a09e-929f3fb87fbc/Test.test"

  const account = {
    homeAccountId: "9c18-dfe735d0f547.08f3813c-9f29-482f-9aec-16ef7cbf477a",
    environment: "login.windows.net",
    tenantId: "08f3813c-9f21239-482f-9aec-16ef7cbf477a",
    username: "rune.ellingsen@vtfk.no",
    localAccountId: "1f5766eb-21238da-4bdc-9c18-dfe735d0f547",
    name: "Jorgen ",
    idTokenClaims: {
        aud: "4a919a81-b299-43f0-b3e9-8a9471df2f76",
        iss: "https://login.microsoftonline.com/08f3813c-9f29-482f-9aec-16ef7cbf477a/v2.0",
        iat: 1663065822,
        nbf: 1663065822,
        exp: 1663069722,
        nonce: "0384a803-824f-48c9-9e13-95e6d23d39cc",
        oid: "1f5766eb-28da-4bdc-9c18-dfe735d0f547",
        preferred_username: "robin.ellingsen@vtfk.no",
        rh: "0.AV8APIHzCCmfL0ia7BbvfL9HeoGakUqZsvBDs-mKlHHfL3ZfAEs.",
        sub: "bRenGvCTsGaiM-CvSb_EFVcv01oU2EJmfCJTeaVAyg8",
        tid: "08f3813c-9f29-482f-9aec-16ef7cbf477a",
        uti: "Q4vbOYN8KESc8yleN-4SAA",
        ver: "2.0"
    }
}

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
      // myMsal.setActiveAccount(loginResponse.account)
      const customApiToken = await myMsal.acquireTokenSilent({
        scopes: [scope], account: account
      });

      console.log(customApiToken.accessToken) //Denne skal sendes til et API for validering 
    
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