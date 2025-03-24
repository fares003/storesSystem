import React from 'react'
import { useState } from "react"
import Center from "./Center";
import { useLogin } from '@/contexts/LoginContext';
import { toast } from 'react-toastify';

function CreateAccountcomponent() {
  const {createAccount} = useLogin() ; 
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const evokeSignup = async () => {
    const creds = {
      username: username,
      password: password,
      email: email,
    };

    try {
      const result = await createAccount(creds);
      console.log(result);
      
      if (result) {
        toast.success("User created successfully!", {
          position: "top-right",
          autoClose: 2000,
        }

    );

    setUsername('')
    setPassword('')
 setEmail('')
      } else {
        toast.error("Error creating user. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error(error);
    }
};

  return (
    <Center>
      <h1 className="textGradient text-5xl md:text-6xl md:h-20 text-white mb-6">Create account</h1>
      <div className="flex flex-col gap-2 items-center w-[90%] md:w-[50%] py-8 border border-white text-white rounded-lg shadow-lg shadow-slate-500 bg-slate-950 z-10 opacity-90">
          <div className="flex flex-col items-start gap-2 w-[80%]">
              <label>Username: </label>
              <input className="w-full bg-transparent border border-white rounded-lg p-2" placeholder="Username..." type = 'text' onChange={e=>setUsername(e.target.value)} value={username}/><br/>
          </div>

          <div className="flex flex-col items-start gap-2 w-[80%]">
              <label>Email: </label>
              <input className="w-full bg-transparent border border-white rounded-lg p-2" placeholder="example@gmail.com" type='email' onChange={e=>setEmail(e.target.value)} value={email}/><br/>
          </div>
          <div className="flex flex-col items-start gap-2 w-[80%]">
              <label>Password: </label>
              <input className="w-full bg-transparent border border-white rounded-lg p-2" placeholder="Password..." type = 'password' onChange={e=>setPassword(e.target.value)} value={password}/><br/>
          </div>
          
          <p> have an account ? | <a href="/login" className="text-blue-400">sign in</a> </p>
          <button className="text-white px-6 py-2 rounded-lg gradient-btn duration-300  bg-[#4C5365] hover:bg-[#5A6172]"  onClick = {evokeSignup}>Submit</button>
      </div>
    </Center>
  )
}

export default CreateAccountcomponent