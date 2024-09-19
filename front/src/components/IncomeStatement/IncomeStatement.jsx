import React, { useEffect, useState } from "react";
import axios from "axios";

const IncomeStatement = () => {
    const [incomeStatement, setIncomeStatement] = useState(null); // Initially set to null
    const [selectedMonth, setSelectedMonth] = useState("");

    useEffect(() => {
        // Fetch income statement data when component mounts
        const fetchIncomeStatement = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/income_statement", {
                    params: { month: selectedMonth },
                });
                setIncomeStatement(response.data.incomeStatement);
            } catch (error) {
                console.error("Error fetching income statement:", error);
            }
        };

        fetchIncomeStatement();
    }, [selectedMonth]);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    // Safeguard for accessing incomeStatement fields
    const formatAmount = (amount) =>
        typeof amount === "number" ? amount.toFixed(2) : "0.00";

    return (
        <div className="container">
            {/* Month selection form */}
            <form method="GET" className="mb-4">
                <div className="form-group row">
                    <label htmlFor="month" className="col-sm-2 col-form-label">
                        Select Month:
                    </label>
                    <div className="col-sm-4">
                        <input
                            type="month"
                            id="month"
                            name="month"
                            className="form-control"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                        />
                    </div>
                    <div className="col-sm-2">
                        <button type="submit" className="btn btn-primary">
                            Filter
                        </button>
                    </div>
                </div>
            </form>

            {/* Only render the table if incomeStatement is available */}
            {incomeStatement ? (
                <table className="table table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>Details</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Gross Sales</td>
                            <td>TK {formatAmount(incomeStatement.gross_sales)}</td>
                        </tr>
                        <tr>
                            <td>(-) Discounts</td>
                            <td>TK {formatAmount(incomeStatement.discount_amount)}</td>
                        </tr>
                        <tr>
                            <td>(-) Sales Returns</td>
                            <td>TK {formatAmount(incomeStatement.sales_return_amount)}</td>
                        </tr>
                        <tr style={{ fontWeight: "bold" }}>
                            <td>Net Sales</td>
                            <td>TK {formatAmount(incomeStatement.net_sales)}</td>
                        </tr>
                        <tr>
                            <td>(-) Purchases</td>
                            <td>TK {formatAmount(incomeStatement.purchase_amount)}</td>
                        </tr>
                        <tr>
                            <td>Cost of Goods Sold (COGS)</td>
                            <td>TK {formatAmount(incomeStatement.cogs)}</td>
                        </tr>
                        <tr style={{ fontWeight: "bold" }}>
                            <td>Gross Profit</td>
                            <td>TK {formatAmount(incomeStatement.gross_profit)}</td>
                        </tr>
                        <tr>
                            <td>(-) Operating Expenses</td>
                            <td>TK {formatAmount(incomeStatement.operating_expenses)}</td>
                        </tr>
                        <tr style={{ fontWeight: "bold" }}>
                            <td>Operating Profit (EBIT)</td>
                            <td>TK {formatAmount(incomeStatement.operating_profit)}</td>
                        </tr>
                        <tr>
                            <td>(+) Interest Income</td>
                            <td>TK {formatAmount(incomeStatement.interest_income)}</td>
                        </tr>
                        <tr>
                            <td>(-) Interest Expense</td>
                            <td>TK {formatAmount(incomeStatement.interest_expense)}</td>
                        </tr>
                        <tr style={{ fontWeight: "bold" }}>
                            <td>Net Income Before Taxes (EBT)</td>
                            <td>TK {formatAmount(incomeStatement.net_income_before_taxes)}</td>
                        </tr>
                        <tr>
                            <td>(-) Taxes (15%)</td>
                            <td>TK {formatAmount(incomeStatement.taxes)}</td>
                        </tr>
                        <tr style={{ fontWeight: "bold" }}>
                            <td>Net Income/Loss</td>
                            <td>TK {formatAmount(incomeStatement.net_income)}</td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <p>Loading income statement data...</p>
            )}
        </div>
    );
};

export default IncomeStatement;
