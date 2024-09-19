import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CreateReturn = () => {
    const [sales, setSales] = useState([]);
    const [selectedSale, setSelectedSale] = useState('');
    const [quantity, setQuantity] = useState('');
    const [maxQuantity, setMaxQuantity] = useState(0); // Default to 0
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        // Fetch sales data from the backend
        const fetchSales = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/sales'); // Adjust the endpoint as needed
                setSales(response.data);
            } catch (error) {
                console.error('Error fetching sales:', error);
            }
        };
        fetchSales();
    }, []);

    const handleSaleChange = (e) => {
        const selectedId = e.target.value;
        const sale = sales.find(sale => sale.id.toString() === selectedId); // Convert to string for comparison
        
        if (sale) {
            setSelectedSale(sale.id);
            setMaxQuantity(sale.quantity);
        } else {
            setSelectedSale('');
            setMaxQuantity(0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (parseInt(quantity) > maxQuantity) { // Ensure quantity is a number for comparison
            alert('The quantity returned cannot exceed the quantity sold.');
            return;
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/sales_returns', {
                sale_id: selectedSale,
                quantity: quantity,
            });
            alert('Sales return processed successfully!');
            // Redirect to the index page
            navigate('/sales_returns'); // Adjust the path as needed
        } catch (error) {
            console.error('Error processing return:', error);
            alert('Failed to process return. Please check the input.');
        }
    };

    return (
        <div className="container">
            <h2>Create Sales Return</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="sale_id">Select Sale</label>
                    <select
                        name="sale_id"
                        id="sale_id"
                        className="form-control"
                        onChange={handleSaleChange}
                        required
                    >
                        <option value="">Select a sale</option>
                        {sales.map(sale => (
                            <option key={sale.id} value={sale.id} data-quantity={sale.quantity}>
                                {sale.product.name} - Qty Sold: {sale.quantity}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="quantity">Quantity Returned</label>
                    <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        className="form-control"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        min="1"
                        max={maxQuantity}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Process Return</button>
            </form>
        </div>
    );
};

export default CreateReturn;
