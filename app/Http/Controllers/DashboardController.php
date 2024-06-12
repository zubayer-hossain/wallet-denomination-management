<?php

namespace App\Http\Controllers;

use App\Http\Requests\WalletRequest;
use App\Models\Currency;
use App\Models\Wallet;
use App\Services\WalletService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use Exception;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $wallet = $user->wallet()
            ->with('balances.currency')
            ->first();
        $currencies = Currency::get(['id', 'name', 'symbol', 'icon']);

        return Inertia::render('Dashboard', [
            'initialWallet' => $wallet ? $wallet->load('balances.currency') : null,
            'currencies' => $currencies
        ]);
    }

}

