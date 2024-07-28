import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Context } from '../store/appContext';

import "../../styles/sign-in.css";

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
               <main className="form-signin w-100 m-auto setPosition">
                {(store.token && store.token !== "" && store.token != undefined) ? (

                    <>
                         <h1 className='text-h1 text-center mb-5'>You are logged in 👏</h1>
                         <Link to='/private'>
                             <button type="button" className="btn btn-outline-secondary align-items-center">Go to your Invoices</button>
                         </Link>
                    </>
                ) : (

                    <>
                    
                        <div>
                         <div>
                         <h1 className="h1 mb-3 fw-normal text1">Sign In</h1>
                         </div>
                       <div className='storeMessage'>
                        {store.loginMessage || ""}
                       </div>
                       <div>

                <div className="form-floating">
                   <input type="email" 
                   className="form-control" 
                   id="floatingInput" 
                   placeholder="Enter Email"
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                   required />
                  <label htmlFor="floatingInput">Email address</label>
                </div>
                             
                <div className="form-floating">
                  <input type="password" 
                  className="form-control" 
                  id="floatingPassword" 
                  placeholder="Enter Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required />
                  <label htmlFor="floatingPassword">Password</label>
                 </div>
                   </div>
                   
                   <button 
                   onClick={handleClick}
                   className="btn w-100 py-2" type="submit">Sign in</button>
                                      
                    </div>   
                    </>
                )


                }

            
           </main>
               
        </>
    
    );
}