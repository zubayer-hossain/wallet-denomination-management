<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
use App\Services\TransactionService;
use Inertia\Inertia;
use Illuminate\Http\Response;

class TransactionController extends Controller
{
    protected $transactionService;

    public function __construct(TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    public function index()
    {
        $user = auth()->user();
        $walletId = $user->wallet->id ?? null;

        if (!$walletId) {
            return redirect()->back()->withErrors('No wallet found for the user.');
        }

        return Inertia::render('Transactions/List', [
            'walletId' => $walletId
        ]);
    }

    public function storeTransaction(TransactionRequest $request, $wallet_id)
    {
        try {
            $transaction = $this->transactionService->createTransaction($wallet_id, $request->validated());
            return response()->json($transaction, Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    public function getTransactions($wallet_id)
    {
        try {
            $transactions = $this->transactionService->listTransactions($wallet_id);
            return response()->json($transactions);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
}
