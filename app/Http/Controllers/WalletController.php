<?php

namespace App\Http\Controllers;

use App\Http\Requests\WalletRequest;
use App\Models\Wallet;
use App\Services\WalletService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Exception;

class WalletController extends Controller
{
    protected $walletService;

    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }

    public function store(WalletRequest $request)
    {
        DB::beginTransaction();
        try {
            $wallet = $this->walletService->createWallet(auth()->id(), $request);
            DB::commit();
            return response()->json(['wallet' => $wallet], Response::HTTP_CREATED);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy(Request $request)
    {
        DB::beginTransaction();
        try {
            $wallet = Wallet::where('user_id', auth()->id())->firstOrFail();
            $this->walletService->deleteWallet($wallet);
            DB::commit();
            return response()->json(['message' => 'Wallet deleted successfully'], Response::HTTP_OK);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function getBalances($wallet_id)
    {
        try {
            $balances = $this->walletService->getWalletBalances($wallet_id);
            return response()->json($balances);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }
}

