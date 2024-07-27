import React, { useContext, useEffect } from 'react';
import { Context } from '../store/appContext';

import "../../styles/private.css";

export const Private = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getInvoices();
    }, []);

    useEffect(() => {
        console.log("Store in Private component:", store);
    }, [store]);

    return (
        <>
              <div>
                <table className='invoices'>
                    <thead>
                        <tr>
                            <th>Amount</th>
                            <th>Number</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.invoices && Array.isArray(store.invoices) ? (
                            store.invoices.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.invoice_amount}</td>
                                    <td>{data.invoice_number}</td>
                                    <td>{data.invoice_date}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No invoices found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <button onClick={() => { actions.logout() }}>
                Logout
            </button>
        </>
    );
};
