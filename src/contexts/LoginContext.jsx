import React, { useContext, useState, createContext } from 'react';

const loginContext = createContext();

const api = import.meta.env.VITE_API ;


export const LoginProvider = ({ children }) => {

    async function signin(credentials) {
        const target = api + "auth/sign-in";
        console.log(credentials);
        
        try {
            const response = await fetch(target, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });
    
            if (!response.ok) {
                const error = await response.text();
                console.error("Sign-in failed:", error);
                return false;
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error during sign-in:", error);
            return false;
        }
    }

    async function signup(credentials) {
        const target = api + "auth/signup";
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

        const data = await resp.json();
        return data;
    }
    
    const [haveAccount, setHaveAccount] = useState(true);

    return (
        <loginContext.Provider value={{ haveAccount, setHaveAccount ,signup , signin}}>
            {children}
        </loginContext.Provider>
    );
};

export const useLogin = () => {
    return useContext(loginContext);
};
