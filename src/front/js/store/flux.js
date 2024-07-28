const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: localStorage.getItem('token') || null,
            invoices: [],
        },
        actions: {
            syncSessionTokenFromStore: () => {
                const token = localStorage.getItem('token');
                if (token) {
                    setStore({ token });
                    getActions().getInvoices();
                }
            },

            getInvoices: async () => {
                const store = getStore();
                const token = store.token;

                if (!token) return;

                const response = await fetch(`${process.env.BACKEND_URL}/api/invoices`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setStore({ invoices: data.invoices });
                } else {
                    console.error('Failed to fetch invoices');
                }
            },

            addInvoice: async (invoiceData) => {
                const store = getStore();
                const token = store.token;

                const response = await fetch(`${process.env.BACKEND_URL}/api/invoices`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(invoiceData)
                });

                if (response.ok) {
                    const data = await response.json();
                    setStore({ invoices: [...store.invoices, data.invoice] });
                    return data.invoice;
                } else {
                    const error = await response.json();
                    console.error('Error adding invoice:', error);
                    return null;
                }
            },

            login: async (email, password) => {
                const response = await fetch(`${process.env.BACKEND_URL}/api/token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.access_token);
                    setStore({ token: data.access_token });
                    getActions().getInvoices(); // Fetch invoices after login
                    return data;
                } else {
                    const error = await response.json();
                    console.error('Login failed:', error);
                    return null;
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                setStore({ token: null, invoices: [] });
            }
        }
    };
};

export default getState;
