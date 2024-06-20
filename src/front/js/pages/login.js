// This page will accept a user's email and password
// Create a function in flux which will make a POST request with users info in body
// SUCCESS means:
// 1. The user is already register in the database
// 2. Response will include a msg stored in flux store from backend
// 3. Redirect user to /private page

//FAILURE means:
// 1. Response will return a msg stored in flux store
// 2. msg will be displayed on /login page telling the user that the email/password does not match

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Context } from '../store/appContext';

export const Login = () =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] =useState("");
    const navigate = useNavigate();
    const {store, actions} = useContext(Context);

    const handleClick = () =>{
        actions.login(email, password)
    }

    useEffect(() => {
        if(store.isLoginSuccessful){
            navigate("/private")
        }
    },[store.isLoginSuccessful])

    return(
        <>
               <div className='login-page'>
                {(store.token && store.token !== "" && store.token != undefined) ? (

                    <>
                         <h1>You are logged in</h1>
                         <Link to='/private'>
                             <button>Go to your Invoices</button>
                         </Link>
                    </>
                ) : (

                    <>
                         <div>
                              <h1>Log In</h1>
                         </div>
                       <div>
                        {store.loginMessage || ""}
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
                       >Login</button>
                   </div>
                    
                    </>
                )


                }

            
               </div>
        </>
    );
}