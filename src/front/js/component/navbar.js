import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

import "../../styles/navbar.css";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
    const navigate = useNavigate();

	const handleLogout = () => {
        actions.logout();
        navigate('/');
    };

	return (
        <nav>
		<div className="container">
		<header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
	
		  <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
		    <li><Link to="/" className="text-color nav-link px-2">Home</Link></li>
			{store.token && (
             <li><Link to="/private" className="text-color nav-link px-2">Invoices</Link></li>
            )}
		  </ul>
	
		  <div className="col-md-3 text-end">
           {store.token ? (
              <button type="button" className="btn btn-outline-secondary" onClick={handleLogout}>Logout</button>
            ) : (
            <>
            <Link to="/login">
                 <button type="button" className="btn btn-outline-secondary me-2">Login</button>
        </Link>
             <Link to="/signup">
                 <button type="button" className="btn btn-outline-secondary">Sign-up</button>
        </Link>
        </>
        )}
        </div>
		</header>
	  </div>
	  </nav>
	);
};
