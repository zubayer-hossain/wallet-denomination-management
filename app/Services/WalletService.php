<?php

namespace App\Services;

use App\Models\Wallet;
use App\Models\WalletBalance;
use Illuminate\Support\Facades\DB;

class WalletService
{
    public function createWallet($userId, $request)
    {
        return DB::transaction(function () use ($userId, $request) {
            $wallet = Wallet::create([
                'user_id' => $userId,
                'name' => $request->name
            ]);

            WalletBalance::create([
                'wallet_id' => $wallet->id,
                'currency_id' => $request->currency_id,
                'balance' => 0
            ]);

            // Load the wallet with its balances with currency
            $wallet->load('balances.currency');

            return $wallet;
        });
    }

    public function deleteWallet($wallet)
    {
        return DB::transaction(function () use ($wallet) {
            $wallet->balances()->delete();
            $wallet->delete();
        });
    }

    public function getWalletBalances($wallet_id)
    {
        $wallet = Wallet::with('balances.currency')->findOrFail($wallet_id);
        return $wallet->balances;
    }
}
