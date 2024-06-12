import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TransactionTable from '@/Pages/Transactions/Table';
import { Head } from '@inertiajs/react';

const TransactionListPage = ({ auth, walletId }) => {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Transactions</h2>}
        >
            <Head title="Transactions" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <TransactionTable user={auth.user} walletId={walletId} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default TransactionListPage;
