import React, { useContext, useState, createContext, useEffect } from 'react';

const loginContext = createContext();

const api = import.meta.env.VITE_API;

export const LoginProvider = ({ children }) => {
    const [logedin, setLogedin] = useState(false);

    useEffect(() => {

        const isUserLoggedIn = localStorage.getItem('token');
        if (isUserLoggedIn) {
            setLogedin(true);
        }
    }, []);

    async function signin(credentials) {
        const target = api + "auth/sign-in";
        console.log(credentials);

        try {
            const response = await fetch(target, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });
            console.log(response);
            
            if (!response.ok) {
                const error = await response.text();
                console.error("Sign-in failed:", error);
                return false;
            }

            const data = await response.json();
            console.log(data.token);
            localStorage.setItem('token',data.token );
            setLogedin(true);
            return data;
        } catch (error) {
            console.error("Error during sign-in:", error);
            return false;
        }
    }

    async function signup(credentials) {
        const target = api + "auth/signup";
        console.log(credentials);
        
        const resp = await fetch(target, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        if (!resp.ok) {
            const error = await resp.text();
            console.error("Sign-up failed:", error);
            return false;
        }

        const data = resp.json();
        console.log(data.token);
        setLogedin(true);
        return data;
    }

    return (
        <loginContext.Provider value={{ logedin, setLogedin, signup, signin }}>
            {children}
        </loginContext.Provider>
    );
};

export const useLogin = () => {
    return useContext(loginContext);
};




















// ##################### CODE WITH REFRESH TOKEN ##############################

// import React, { useContext, useState, createContext, useEffect } from 'react';

// const loginContext = createContext();

// const api = import.meta.env.VITE_API ;


// export const LoginProvider = ({ children }) => {

//     const [accessToken, setAccessToken] = useState(null);
//     const [refreshToken, setRefreshToken] = useState(null);

//     async function signin(credentials) {
//         const target = api + "auth/sign-in";
//         console.log(credentials);
        
//         try {
//             const response = await fetch(target, {
//                 method: 'POST',
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(credentials),
//             });
    
//             if (!response.ok) {
//                 const error = await response.text();
//                 console.error("Sign-in failed:", error);
//                 return false;
//             }
    
//             const data = await response.json();
//             setAccessToken(data.accessToken);
//             setRefreshToken(data.refreshToken);
//             localStorage.setItem('accessToken', data.accessToken);
//             localStorage.setItem('refreshToken', data.refreshToken);

//             return data;
//         } catch (error) {
//             console.error("Error during sign-in:", error);
//             return false;
//         }
//     }

//     async function signup(credentials) {
//         const target = `${api}auth/signup`;
//         try {
//             const response = await fetch(target, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(credentials),
//             });

//             if (!response.ok) {
//                 const error = await response.text();
//                 console.error('Sign-up failed:', error);
//                 return false;
//             }

//             const data = await response.json();
//             return data;
//         } catch (error) {
//             console.error('Error during sign-up:', error);
//             return false;
//         }
//     }

//     async function refreshAccessToken() {
//         const target = `${api}auth/refresh-token`;
//         try {
//             const response = await fetch(target, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ refreshToken }),
//             });

//             if (!response.ok) {
//                 console.error('Failed to refresh access token.');
//                 signout();
//                 return;
//             }

//             const data = await response.json();
//             setAccessToken(data.accessToken);
//             localStorage.setItem('accessToken', data.accessToken);
//         } catch (error) {
//             console.error('Error during token refresh:', error);
//         }
//     }

//     function signout() {
//         setAccessToken(null);
//         setRefreshToken(null);
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('refreshToken');
//     }

//     useEffect(() => {
//         const interval = setInterval(() => {
//             if (accessToken) {
//                 const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
//                 const isExpired = tokenPayload.exp * 1000 < Date.now();

//                 if (isExpired) {
//                     refreshAccessToken();
//                 }
//             }
//         }, 60 * 1000); // refreach each 1 min 

//         return () => clearInterval(interval);
//     }, [accessToken]);

//     useEffect(() => {
//         const storedAccessToken = localStorage.getItem('accessToken');
//         const storedRefreshToken = localStorage.getItem('refreshToken');

//         if (storedAccessToken && storedRefreshToken) {
//             setAccessToken(storedAccessToken);
//             setRefreshToken(storedRefreshToken);
//         }
//     }, []);

//     // const [haveAccount, setHaveAccount] = useState(true);

//     return (
//         <loginContext.Provider 
//             value={{
//                 signin,
//                 signup,
//                 signout,
//                 accessToken,
//                 refreshToken,
//                 refreshAccessToken,
//             }}
//         >
//             {children}
//         </loginContext.Provider>
//     );
// };

// export const useLogin = () => {
//     return useContext(loginContext);
// };
