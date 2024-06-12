<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    protected $fillable = ['user_id','name','balance'];

    public function user() {
        return $this->belongsTo('App\Models\User');
    }

    public function transactions() {
        return $this->hasMany('App\Models\Transaction');
    }

    public function balances()
    {
        return $this->hasMany(WalletBalance::class);
    }
}
