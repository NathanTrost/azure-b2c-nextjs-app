import React, { useState } from "react";
import "../styles/global.css";
import azureConfig from "../src/azureConfig";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";

const msalInstance = new PublicClientApplication(msalConfig);

export default function App({ Component, pageProps }) {
  const [error, setError] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});

  // Initialize the MSAL application object
  const publicClientApplication = new PublicClientApplication({
    auth: {
      clientId: azureConfig.appId,
      redirectUri: azureConfig.redirectUri,
      authority: azureConfig.authority,
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: true,
    },
  });

  const login = async () => {
    // Login via popup
    try {
      await publicClientApplication.loginPopup({
        scopes: azureConfig.scopes,
        prompt: "select_account",
      });
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      setUser({});
      setError(error);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser({});
    setError(error);
    publicClientApplication.logoutRedirect();
  };

  return (
    <>
      <div>
        <p>
          <MsalProvider instance={msalInstance}>
            {isAuthenticated ? (
              <Component
                loggedInHeader={
                  <>
                    <p>Successful logged in.</p>
                    <button onClick={logout}>Log out</button>
                  </>
                }
                {...pageProps}
              />
            ) : (
              <button onClick={login}>Log in</button>
            )}
          </MsalProvider>
        </p>
      </div>
    </>
  );
}
