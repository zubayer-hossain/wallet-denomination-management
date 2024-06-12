<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Define the currencies to seed
        $currencies = [
            ['name' => 'U.S. Dollar', 'symbol' => 'USD', 'icon' => '$'],
            ['name' => 'Bangladeshi Taka', 'symbol' => 'BDT', 'icon' => '৳'],
            ['name' => 'Malaysian Ringgit', 'symbol' => 'MYR', 'icon' => 'RM']
        ];

        // Insert currencies into the database
        foreach ($currencies as $currency) {
            DB::table('currencies')->insert([
                'name' => $currency['name'],
                'symbol' => $currency['symbol'],
                'icon' => $currency['icon'],
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
}

