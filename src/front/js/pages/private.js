import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext';
import "../../styles/private.css";
import { Link } from 'react-router-dom';

export const Private = () => {
    const { store, actions } = useContext(Context);
    const [amount, setAmount] = useState('');
    const [number, setNumber] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        actions.getInvoices();
    }, []);

    useEffect(() => {
        console.log("Store in Private component:", store);
    }, [store]);

    const handleAddInvoice = async () => {
        const invoiceData = {
            invoice_amount: parseFloat(amount),
            invoice_number: number,
            invoice_date: date
        };
        const newInvoice = await actions.addInvoice(invoiceData);
        if (newInvoice) {
            // Update the invoices state immediately without refreshing the page
            actions.getInvoices();
        }
        setAmount('');
        setNumber('');
        setDate('');
    };

    const formatDate = (dateStr) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateObj = new Date(dateStr);
        return dateObj.toLocaleDateString(undefined, options);
    };

    return (
        <>
                   <h3 className='text-h1 text-center mt-5'>Add New Invoice</h3>
            <div className='container moveFooter'>
                <div className="row g-3 d-flex justify-content-center">
                    <div className="col-sm-2">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Enter Amount"
                            aria-label="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className="col-sm-2">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Enter Number"
                            aria-label="number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                        />
                    </div>
                    <div className="col-sm-2">
                        <input
                            type="date"
                            className="form-control"
                            placeholder="Enter Date"
                            aria-label="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className="col-sm-1 text-center">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={handleAddInvoice}
                        >
                            Add
                        </button>
                    </div>
                </div>
                           <div className='d-flex justify-content-center mt-3'>
                <table className='invoices'>
                    <thead>
                        <tr>
                            <th>Amount</th>
                            <th>Invoice Number</th>
                            <th>Invoice Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.invoices && Array.isArray(store.invoices) ? (
                            store.invoices.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.invoice_amount}</td>
                                    <td>{data.invoice_number}</td>
                                    <td>{formatDate(data.invoice_date)}</td>
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
            </div>
        </>
    );
};
