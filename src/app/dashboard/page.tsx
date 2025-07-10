"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

interface Transaction {
    sender: string,
    receiver: string,
    amount: number,
}

const Dashboard = () => {

    const router = useRouter();
    const [token, setToken] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [balance, setBalance] = useState(1000);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [receiver, setReceiver] = useState("");
    const [amount, setAmount] = useState("");

    const fetchTransactions = (userEmail: string) => {
        fetch("/api/transaction", {
            method: "POST",
            body: JSON.stringify({email: userEmail}),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => response.json().then(data => {
            if (data.status === 200) {
                setTransactions(data.transactions);
            }
        }));
    };

    useEffect(() => {
        const token = localStorage.getItem("userToken");

        if (token === null) {
            router.push('/login');        
        } else {
            setToken(token);

            fetch("/api/info", {
                method: "POST",
                body: JSON.stringify({key: token}),
                headers: {
                    'content-type': 'application/json',
                }
            }).then(response => response.json().then(data => {
                setBalance(data.balance);
                setName(data.username);
                setEmail(data.email);

                fetchTransactions(data.email);
            }))
        }
    }, []);

    const createTransaction = (event: FormEvent) => {
        event.preventDefault();

        if (Number(amount) > balance) {
            alert("You don't have that much money.")
            return;
        }

        fetch("/api/transaction/create", {
            method: "POST",
            body: JSON.stringify({
                receiver: receiver,
                sender: email,
                amount: amount
            }),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => response.json().then(data => {
            const code = data.status;

            if (code === 200) {
                setBalance(balance - Number(amount));
                setReceiver("");
                setAmount("");
                fetchTransactions(email);
            } else {
                alert("Failed to create a transaction.")
            }
        }));
    }

    const getTransactionDisplay = (transaction: Transaction) => {
        const isSender = transaction.sender === email;
        const sign = isSender ? "-" : "+";
        const type = isSender ? "Sent" : "Received";
        const otherParty = isSender ? transaction.receiver : transaction.sender;
        
        return {
            sign,
            type,
            otherParty,
            amount: transaction.amount
        };
    };

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        router.push('/login');
    };

    return(
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Banking Dashboard</h1>
                    <button 
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                    >
                        Logout
                    </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Your Account</h2>
                        <p className="text-gray-600">Name: <span className="font-semibold">{name}</span></p>
                        <p className="text-gray-600">Email: <span className="font-semibold">{email}</span></p>
                        <p className="text-gray-600">Balance: <span className="font-semibold text-green-600">${balance}</span></p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Send Money</h2>
                        <form className="space-y-4" onSubmit={createTransaction}>
                            <input 
                                type="email" 
                                placeholder="Receiver Email Address" 
                                value={receiver}
                                onChange={(e) => setReceiver(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                            <input 
                                type="number" 
                                placeholder="Amount" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                            <button 
                                type="submit" 
                                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
                    {transactions.length === 0 ? (
                        <p className="text-gray-500">No transactions yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((transaction, index) => {
                                const display = getTransactionDisplay(transaction);
                                return (
                                    <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-md">
                                        <div>
                                            <span className={`font-semibold ${display.sign === '+' ? 'text-green-600' : 'text-red-600'}`}>
                                                {display.sign}${display.amount}
                                            </span>
                                            <span className="text-gray-600 ml-2">
                                                {display.type} to/from {display.otherParty}
                                            </span>
                                        </div>
                                        <span className={`text-sm px-2 py-1 rounded-full ${
                                            display.sign === '+' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {display.type}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard;