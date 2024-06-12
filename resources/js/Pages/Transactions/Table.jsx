import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import InputLabel from '@/Components/InputLabel';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

const TransactionTable = ({ walletId }) => {
    const [transactions, setTransactions] = useState([]);
    const [balances, setBalances] = useState([]);  // State to store wallet balances
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactionType, setTransactionType] = useState('credit');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchTransactions(walletId);
        fetchWalletBalances(walletId);
    }, [walletId]);

    const fetchTransactions = (walletId) => {
        axios.get(`/wallet/${walletId}/transactions`)
            .then(response => {
                setTransactions(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching transactions:", error);
            });
    };

    const fetchWalletBalances = (walletId) => {
        axios.get(`/wallet/${walletId}/balances`)
            .then(response => {
                setBalances(response.data);
            })
            .catch(error => {
                console.error("Error fetching balances:", error);
            });
    };

    const handleTransaction = () => {
        if (!amount) {
            setError('Amount is required');
            return;
        }
        setProcessing(true);
        axios.post(`/wallet/${walletId}/transactions`, {
            type: transactionType,
            amount: parseFloat(amount),
            description
        }).then(response => {
            fetchWalletBalances(walletId);
            setTransactions([response.data, ...transactions]);
            closeModal();
        }).catch(error => {
            // Extracting error message from server response
            const serverError = error.response?.data?.error || 'Error processing transaction';
            setError(serverError);
            console.error("Transaction error:", error);
        }).finally(() => {
            setProcessing(false);
        });
    };

    const openModal = (type) => {
        setTransactionType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setAmount('');
        setDescription('');
        setError('');
    };

    return (
        <div>
            <div className="mt-4 grid grid-cols-3 gap-4 mb-10">
                {balances.map(balance => (
                    <div key={balance.currency.id}
                         className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
                        <div>
                            <div className="text-md">{balance.currency.symbol} ({balance.currency.name})</div>
                            <div className="text-2xl font-semibold">{balance.currency.icon} {balance.balance}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Transactions</h2>
                <div>
                    <PrimaryButton onClick={() => openModal('credit')} className="mr-2">
                        <ArrowDownIcon className="h-5 w-5 mr-2"/> Add Money
                    </PrimaryButton>
                    <PrimaryButton onClick={() => openModal('debit')}>
                        <ArrowUpIcon className="h-5 w-5 mr-2"/> Withdraw
                    </PrimaryButton>
                </div>
            </div>

            {loading ? (
                <p className="text-center pt-4">Loading transactions...</p>
            ) : (
                 transactions.length === 0 ? (
                     <p className="text-center pt-4">No transactions found</p>
                 ) : (
                     <table className="min-w-full">
                         <thead>
                         <tr>
                             <th className="py-2 text-left">&nbsp;</th>
                             <th className="py-2 px-4 text-left">Date</th>
                             <th className="py-2 px-4 text-left">Amount</th>
                             <th className="py-2 px-4 text-left">Description</th>
                             <th className="py-2 px-4 text-left">Status</th>
                         </tr>
                         </thead>
                         <tbody>
                         {transactions.map((transaction, index) => (
                             <tr key={index}>
                                 <td className="py-2">
                                     <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200">
                                         {transaction.type === 'debit' ? (
                                             <ArrowUpIcon className="h-5 w-5 text-gray-600"/>
                                         ) : (
                                              <ArrowDownIcon className="h-5 w-5 text-gray-600"/>
                                          )}
                                     </div>
                                 </td>
                                 <td className="py-2 px-4">{new Date(transaction.created_at).toLocaleDateString()}</td>
                                 <td className="py-2 px-4">{transaction.amount}</td>
                                 <td className="py-2 px-4">{transaction.description}</td>
                                 <td className="py-2 px-4">{transaction.status}</td>
                             </tr>
                         ))}
                         </tbody>
                     </table>
                 )
             )}

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-5">
                        {transactionType === 'credit' ? 'Add Money' : 'Withdraw Money'}
                    </h2>

                    {error &&
                     <div className="mb-2">
                         <div className="text-red-500 text-sm">{error}</div>
                     </div>
                    }

                    <div className="mb-2">
                        <div>
                            <InputLabel htmlFor="amount" value="Amount"/>
                            <TextInput
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                placeholder="Amount"
                            />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="description" value="Description"/>
                            <TextArea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Enter a description (optional)"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            className="bg-gray-300 text-gray-700 p-2 rounded-lg mr-2"
                            onClick={() => closeModal()}
                        >
                            Cancel
                        </button>
                        <PrimaryButton onClick={handleTransaction} disabled={processing}>
                            {processing ? 'Processing...' : (transactionType === 'credit' ? 'Add' : 'Withdraw')}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default TransactionTable;
