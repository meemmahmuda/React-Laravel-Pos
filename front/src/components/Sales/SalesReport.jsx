import React, { useState } from 'react';
import axios from 'axios';

const SalesReport = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [reportData, setReportData] = useState([]);
    const [error, setError] = useState('');

    const fetchReportData = async (date, month) => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/sales/report', {
                params: {
                    date,
                    month,
                },
            });
            setReportData(response.data.reportData);
            setError(''); // Clear any previous errors
        } catch (err) {
            setError('Failed to fetch report data.');
        }
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const handleDateSubmit = (e) => {
        e.preventDefault();
        setSelectedMonth(''); // Reset month selection
        fetchReportData(selectedDate, ''); // Pass the date and empty month
    };

    const handleMonthSubmit = (e) => {
        e.preventDefault();
        setSelectedDate(''); // Reset date selection
        fetchReportData('', selectedMonth); // Pass the empty date and month
    };

    return (
        <div className="container">
            <h2 style={{ textAlign: 'center' }}>Sales Report</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <form onSubmit={handleDateSubmit} style={{ marginRight: '20px' }}>
                    <div className="form-group">
                        <label htmlFor="date">Select Date:</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="form-control"
                            style={{ width: '200px' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Generate Date Report</button>
                </form>

                <form onSubmit={handleMonthSubmit}>
                    <div className="form-group">
                        <label htmlFor="month">Select Month:</label>
                        <select
                            id="month"
                            name="month"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            className="form-control"
                            style={{ width: '150px' }}
                        >
                            <option value="">Select Month</option>
                            {Array.from({ length: 12 }, (_, index) => (
                                <option key={index} value={index + 1}>
                                    {new Date(0, index).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Generate Month Report</button>
                </form>
            </div>

            {error && <p className="mt-4 text-danger">{error}</p>}

            {reportData.length > 0 ? (
                <table className="table table-bordered mt-4">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Product Name</th>
                            <th>Units Sold</th>
                            <th>Unit Price</th>
                            <th>Discount</th>
                            <th>Total Sales</th>
                            <th>Net Sales</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.map((data, index) => (
                            <tr key={index}>
                                <td>{data.category}</td>
                                <td>{data.product_name}</td>
                                <td>{data.units_sold}</td>
                                <td>TK {data.unit_price}</td>
                                <td>TK {data.discount}</td>
                                <td>TK {data.total_sales}</td>
                                <td>TK {data.net_sales}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="mt-4">No sales data available for the selected date or month.</p>
            )}
        </div>
    );
};

export default SalesReport;
