<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\TransactionType;

class TransactionRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $transactionTypes = array_map(fn($type) => $type->value, TransactionType::cases());

        return [
            'type' => 'required|in:' . implode(',', $transactionTypes),
            'amount' => 'required|numeric|min:0.01',
            'description' => 'sometimes|string|max:255'
        ];
    }
}
