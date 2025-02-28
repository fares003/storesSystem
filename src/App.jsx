import React , {useEffect, useState} from 'react'
import LogedInHome from './components/LogedInHome';
import { useLogin } from './contexts/LoginContext';
import NotLogedInHome from './components/NotLogedInHome';
import { AreYouSureProvider } from './contexts/AreYouSure';


export default function App() {
    const {logedin} = useLogin() ; 
    return (
        (logedin ?
            <AreYouSureProvider>
                <LogedInHome/> 
            </AreYouSureProvider>
            : <NotLogedInHome/>)
    )
}

