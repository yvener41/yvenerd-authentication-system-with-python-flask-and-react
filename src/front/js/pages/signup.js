import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

import "../../styles/signup.css";

export const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);

    const handleClick = () => {
        actions.SignUp(email, password);
    };

    useEffect(() => {
        if (store.isSignUpSuccessful) {
            navigate("/login");
        }
    }, [store.isSignUpSuccessful]);

    return (
        <main className="form-signin w-100 m-auto setPosition">
            <div>
                <h1 className="h3 mb-3 fw-normal text1">Sign Up</h1>
            </div>
            <div className='storeMessage'>
                {store.signupMessage || ""}
            </div>
            <div>
                <div className="form-floating">
                    <input
                        type="email"
                        className="form-control"
                        id="floatingInput"
                        placeholder="Enter Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating">
                    <input
                        type="password"
                        className="form-control"
                        id="floatingPassword"
                        placeholder="Enter Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="floatingPassword">Password</label>
                </div>
            </div>
            <div>
                <button
                    onClick={handleClick}
                    className="btn w-100 py-2"
                    type="submit"
                >
                    Sign Up
                </button>
            </div>
        </main>
    );
};
