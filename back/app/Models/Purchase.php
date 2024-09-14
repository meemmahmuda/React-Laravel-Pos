<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'quantity',
        'total_price',
        'amount_given',  
        'change_returned'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // In Order.php model

public function product()
{
    return $this->belongsTo(Product::class);
}

public function supplier()
{
    return $this->belongsTo(Supplier::class);
}

}
