const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: localStorage.getItem('token') || null,
            invoices: [],
            isSignUpSuccessful: false,
            signupMessage: "",
            isLoginSuccessful: false,
            loginMessage: "",
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
                try {
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
                        setStore({ token: data.access_token, isLoginSuccessful: true, loginMessage: "Your Recent Login Were Successful!" });
                        getActions().getInvoices(); // Fetch invoices after login
                    } else {
                        setStore({ loginMessage: "Your Recent Login Was failed. Please try again.", isLoginSuccessful: false });
                    }
                } catch (error) {
                    setStore({ loginMessage: "An error occurred. Please try again.", isLoginSuccessful: false });
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                setStore({ token: null, invoices: [], isLoginSuccessful: false });
            },

            SignUp: async(userEmail, userPassword) =>{
                const options = {
					method: 'POST',
					mode: 'cors',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						email: userEmail,
						password: userPassword
					})
				}

				const response = await fetch(`${process.env.BACKEND_URL}/api/signup`, options)

				if(!response.ok){
					const data = await response.json()
					setStore({signupMessage: data.msg})
					return{
						error: {
							status: response.status,
							statusText: response.statusText
						}
					}
				}

				const data = await response.json()
				setStore({
					signupMessage: data.msg,
                    isSignUpSuccessful: response.ok
			    })
				return data;
			},
        }
    };
};

export default getState;
