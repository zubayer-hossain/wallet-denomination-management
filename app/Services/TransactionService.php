<?php

namespace App\Services;

use App\Models\Wallet;
use App\Models\Transaction;
use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use Illuminate\Support\Facades\DB;

class TransactionService
{
    public function createTransaction($wallet_id, $data)
    {
        return DB::transaction(function () use ($wallet_id, $data) {
            $wallet = Wallet::with('balances')->findOrFail($wallet_id);
            // Get first balance record's currency_id
            $walletDefaultCurrencyBalance = $wallet->balances->first();

            // Check for sufficient funds in case of withdrawal
            if (($data['type'] == TransactionType::Debit->value) && ($walletDefaultCurrencyBalance->balance < $data['amount'])) {
                throw new \Exception("Insufficient funds.");
            }

            $transaction = new Transaction([
                'wallet_id' => $wallet_id,
                'currency_id' => $walletDefaultCurrencyBalance->currency_id,
                'type' => $data['type'],
                'amount' => $data['amount'],
                'description' => $data['description'] ?? null,
                'status' => TransactionStatus::Pending->value
            ]);

            $transaction->save();

            // Update wallet balance based on transaction type
            $wallet->balance += $data['type'] == TransactionType::Credit->value ? $data['amount'] : -$data['amount'];
            $wallet->save();

            $transaction->status = TransactionStatus::Completed->value;
            $transaction->save();

            // Add balance to $walletDefaultCurrencyBalance
            $walletDefaultCurrencyBalance->balance += $data['type'] == TransactionType::Credit->value ? $data['amount'] : -$data['amount'];
            $walletDefaultCurrencyBalance->save();

            return $transaction;
        });
    }

    public function listTransactions($wallet_id)
    {
        $wallet = Wallet::findOrFail($wallet_id);
        return $wallet->transactions()->with('currency')->orderBy('created_at', 'desc')->get();
    }
}
