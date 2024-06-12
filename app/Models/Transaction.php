<?php

namespace App\Models;

use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = ['wallet_id','currency_id', 'type', 'amount', 'description', 'status'];

    protected $casts = [
        'type' => TransactionType::class,
        'status' => TransactionStatus::class,
    ];

    public function wallet() {
        return $this->belongsTo('App\Models\Wallet');
    }

    public function currency() {
        return $this->belongsTo('App\Models\Currency');
    }
}
