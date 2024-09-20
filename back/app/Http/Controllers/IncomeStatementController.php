<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Purchase;
use App\Models\SalesReturn;
use App\Models\Product;
use App\Models\Expense; // Import the Expense model
use Illuminate\Http\Request;

class IncomeStatementController extends Controller
{
    public function index(Request $request)
    {
        // Get the selected month from the request, default to the current month
        $selectedMonth = $request->input('month', date('Y-m'));
    
        // Aggregate data similarly to what you had before
        $sales = Sale::selectRaw('SUM(total_price) as total_sales, SUM(discount) as total_discounts')
            ->whereRaw('DATE_FORMAT(created_at, "%Y-%m") = ?', [$selectedMonth])
            ->first();
    
        $purchases = Purchase::selectRaw('SUM(total_price) as total_purchases')
            ->whereRaw('DATE_FORMAT(created_at, "%Y-%m") = ?', [$selectedMonth])
            ->first();
    
        $salesReturns = SalesReturn::selectRaw('SUM(total_price) as total_returns')
            ->whereRaw('DATE_FORMAT(created_at, "%Y-%m") = ?', [$selectedMonth])
            ->first();
    
        $beginningStock = Product::sum('stock');
        $endingStock = Product::sum('stock');
    
        $expenses = Expense::selectRaw('SUM(total_expense) as total_expenses')
            ->whereRaw('DATE_FORMAT(created_at, "%Y-%m") = ?', [$selectedMonth])
            ->first();
    
        // Handle cases where no data is returned
        $totalSales = $sales->total_sales ?? 0;
        $totalDiscounts = $sales->total_discounts ?? 0;
        $totalPurchases = $purchases->total_purchases ?? 0;
        $totalSalesReturns = $salesReturns->total_returns ?? 0;
        $totalExpenses = $expenses->total_expenses ?? 0;
    
        $interestIncome = 1000;
        $interestExpense = 500;
    
        $netSales = $totalSales - $totalDiscounts - $totalSalesReturns;
        $COGS = $beginningStock + $totalPurchases - $endingStock;
        $grossProfit = $netSales - $COGS;
        $operatingProfit = $grossProfit - $totalExpenses;
        $netIncomeBeforeTaxes = $operatingProfit + $interestIncome - $interestExpense;
        $taxes = 0.15 * $netIncomeBeforeTaxes;
        $netIncome = $netIncomeBeforeTaxes - $taxes;
    
        // Prepare the data in JSON format
        return response()->json([
            'gross_sales' => $totalSales,
            'discount_amount' => $totalDiscounts,
            'sales_return_amount' => $totalSalesReturns,
            'net_sales' => $netSales,
            'purchase_amount' => $totalPurchases,
            'cogs' => $COGS,
            'gross_profit' => $grossProfit,
            'operating_expenses' => $totalExpenses,
            'operating_profit' => $operatingProfit,
            'interest_income' => $interestIncome,
            'interest_expense' => $interestExpense,
            'net_income_before_taxes' => $netIncomeBeforeTaxes,
            'taxes' => $taxes,
            'net_income' => $netIncome,
            'selected_month' => $selectedMonth
        ]);
    }
    
}
