import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';

export default function Dashboard({ auth, initialWallet, currencies }) {
    const [wallet, setWallet] = useState(initialWallet);
    const [name, setName] = useState('My Wallet');
    const [currencyId, setCurrencyId] = useState(currencies[0].id);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const createWallet = (e) => {
        e.preventDefault();
        setProcessing(true);
        axios.post('/wallet', { name, currency_id: currencyId })
            .then(response => {
                setWallet(response.data.wallet);
                setErrors({});
            })
            .catch(error => {
                if (error.response) {
                    setErrors(error.response.data.errors);
                }
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    const deleteWallet = () => {
        if (confirm('Are you sure you want to delete your wallet?')) {
            axios.delete(`/wallet`)
                .then(() => {
                    setWallet(null);
                })
                .catch(error => {
                    console.error('Failed to delete wallet:', error);
                    alert('Failed to delete wallet.');
                });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {wallet ? (
                                <div>
                                    <div className="flex justify-between">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Welcome to {wallet.name}
                                        </h3>
                                        <DangerButton className="ms-3" disabled={processing} onClick={deleteWallet}>
                                            Delete Wallet
                                        </DangerButton>
                                    </div>
                                    <div className="mt-4 grid grid-cols-3 gap-4">
                                        {wallet.balances.map(balance => (
                                            <div key={balance.currency.id}
                                                 className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
                                                <div>
                                                    <div className="text-md"> {balance.currency.symbol} ({balance.currency.name})</div>
                                                    <div className="text-2xl font-semibold">{balance.currency.icon} {balance.balance}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                 <div>
                                     <h3 className="text-lg leading-6 font-medium text-gray-900">
                                         You don't have a wallet yet, create one now
                                     </h3>
                                     <form onSubmit={createWallet}>
                                         <div className="mt-4 flex justify-between items-end">
                                             <div className="flex-grow mr-4">
                                                 <InputLabel htmlFor="name" value="Wallet Name"/>
                                                 <TextInput
                                                     id="name"
                                                     type="text"
                                                     name="name"
                                                     value={name}
                                                     onChange={e => setName(e.target.value)}
                                                     className="mt-1 block w-full"
                                                     required
                                                 />
                                                 {errors.name && <InputError message={errors.name} className="mt-2"/>}
                                             </div>
                                             <div className="flex-grow">
                                                 <InputLabel htmlFor="currency" value="Currency"/>
                                                 <SelectInput
                                                     id="currency"
                                                     value={currencyId}
                                                     onChange={e => setCurrencyId(e.target.value)}
                                                     className="mt-1 block w-full"
                                                 >
                                                     {currencies.map(currency => (
                                                         <option key={currency.id} value={currency.id}>
                                                             {currency.name} - {currency.symbol}
                                                         </option>
                                                     ))}
                                                 </SelectInput>
                                             </div>
                                         </div>
                                         <PrimaryButton className="mt-4" disabled={processing}>
                                             {processing ? 'Creating...' : 'Create Wallet'}
                                         </PrimaryButton>
                                     </form>
                                 </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
