<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\IncomeStatementController;
use App\Http\Controllers\SalesReturnController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpenseController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('auth.login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('categories', CategoryController::class);
    Route::resource('suppliers', SupplierController::class);
    Route::resource('products', ProductController::class);
    Route::resource('orders', OrderController::class);
    Route::resource('sales_returns', SalesReturnController::class);
    Route::resource('expenses', ExpenseController::class);

    Route::get('purchases/{purchase}/invoice', [PurchaseController::class, 'printInvoice'])->name('purchases.invoice');
    Route::get('sales/{sale}/invoice', [SaleController::class, 'printInvoice'])->name('sales.invoice');

    Route::get('/income-statement', [IncomeStatementController::class, 'index'])->name('income_statement.index');
    
    Route::get('sales/report', [SaleController::class, 'report'])->name('sales.report');
    Route::resource('sales', SaleController::class);

    Route::get('/purchases/report', [PurchaseController::class, 'report'])->name('purchases.report');
    Route::resource('purchases', PurchaseController::class);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
