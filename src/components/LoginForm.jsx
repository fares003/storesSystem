import React from 'react'
import { useState } from "react"
import Center from "./Center"
import {useLogin} from "../contexts/LoginContext"
import { toast } from 'react-toastify'
const LoginForm = () => {


    const {signin} = useLogin() ;
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")


    const evokeSignin = () => {
        if (!username || !password) {
            toast.error("plese enter your username & password",{
                autoClose:3000
            })
            return;
        }
    
        const creds = { username, password };
        signin(creds).then(data => {
            if (!data) {
                toast.error("Sign-in failed. Please check your credentials.")
            } else {
                toast.success("Sign-in successful!")
                console.log(data);
            }
        });
    };

  return (
    <Center >
        <h1 className="textGradient text-5xl md:text-6xl md:h-20 text-white">sign in</h1>
        <div className="flex flex-col gap-12 mt-4 items-center w-[90%] md:w-[50%] py-8 border border-white text-white rounded-lg shadow-lg shadow-slate-500">
            <div className="flex flex-col items-start gap-4 w-[80%]">
                <label>Username: </label>
                <input className="w-full bg-transparent border border-white rounded-lg p-2" placeholder="Username..." onChange={e => setUsername(e.target.value)} type='text' />
            </div>

            <div className="flex flex-col items-start gap-4 w-[80%]">
                <label>Password: </label>
                <input className="w-full bg-transparent border border-white rounded-lg p-2" placeholder="Password..." onChange={e => setPassword(e.target.value)} type='password' />
            </div>
            <p> dose not have account ? | <a href="/signup" className="text-blue-400">create account </a> </p>
            <button className="text-white px-6 py-2 rounded-lg gradient-btn duration-300 bg-[#4C5365] hover:bg-[#5A6172]" onClick={evokeSignin}>Submit</button>
        </div>
    </Center>
  )
}

export default LoginForm









