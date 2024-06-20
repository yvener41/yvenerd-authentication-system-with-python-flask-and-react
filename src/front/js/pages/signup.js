// This page will accept a user's email and password
// Create a function in flux which will make a POST request with users info in body
// SUCCESS means:
// 1. Info will be saved into database
// 2. Response will include a msg stored in flux store from backend
// 3. Redirect user to login page and display msg from store letting them know to log in

//FAILURE means:
// 1. Response will return a msg stored in flux store
// 2. msg will be displayed on signup page telling the user that the email already exists

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

export const SignUp = () =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] =useState("");
    const navigate = useNavigate();
    const {store, actions} = useContext(Context);

    const handleClick = () =>{
        actions.SignUp(email, password)
    }

    useEffect(() => {
        if(store.isSignUpSuccessful){
            navigate("/login")
        }
    },[store.isSignUpSuccessful])

    return(
        <>
               <div className='signup-page'>

                   <div>
                       <h1>Sign Up</h1>
                   </div>
                   <div>
                        {store.signupMessage || ""}
                   </div>
                   <div>
                      <input type='email'
                             placeholder='Enter email'
                             value={email}
                             onChange={e => setEmail(e.target.value)}
                             required />
                             
                      <input type='password'
                            placeholder='Enter password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required />
                   </div>
                   <div>
                       <button
                           onClick={handleClick}
                       >Sign Up</button>
                   </div>









               </div>
        </>
    );
}