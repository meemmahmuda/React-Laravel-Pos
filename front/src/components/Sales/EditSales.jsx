import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditSales = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [sale, setSale] = useState({
        customer_name: '',
        address: '',
        phone_no: '',
        product_id: '',
        product_name: '',
        product_code: '',
        category: '',
        selling_price: '',
        stock: '',
        discount: 0,
        quantity: '',
        total_price: '',
        money_taken: '',
        money_returned: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productsResponse = await axios.get('http://127.0.0.1:8000/api/products');
                setProducts(productsResponse.data);

                const saleResponse = await axios.get(`http://127.0.0.1:8000/api/sales/${id}`);
                const saleData = saleResponse.data;

                setSale({
                    ...saleData,
                    product_name: saleData.product.name,
                    product_code: saleData.product.code,
                    category: saleData.product.category.name,
                    selling_price: saleData.product.selling_price,
                    stock: saleData.product.stock // Ensure stock is also set
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    const handleProductChange = (e) => {
        const selectedProductId = e.target.value;
        const selectedOption = e.target.options[e.target.selectedIndex];

        if (selectedOption) {
            const productName = selectedOption.getAttribute('data-name');
            const productCode = selectedOption.getAttribute('data-code');
            const category = selectedOption.getAttribute('data-category');
            const sellingPrice = selectedOption.getAttribute('data-price');
            const stock = selectedOption.getAttribute('data-stock');

            setSale(prevSale => ({
                ...prevSale,
                product_id: selectedProductId,
                product_name: productName,
                product_code: productCode,
                category: category,
                selling_price: sellingPrice,
                stock: stock
            }));
        }
    };

    const handleQuantityChange = (e) => {
        const quantity = e.target.value;

        // Check if the quantity exceeds available stock
        if (quantity > sale.stock) {
            alert(`Quantity cannot exceed available stock of ${sale.stock}.`);
            return; // Prevent updating the state
        }

        setSale(prevSale => ({
            ...prevSale,
            quantity: quantity,
            total_price: calculateTotalPrice(quantity, prevSale.selling_price, prevSale.discount)
        }));
    };

    const handleDiscountChange = (e) => {
        const discount = e.target.value;
        setSale(prevSale => ({
            ...prevSale,
            discount: discount,
            total_price: calculateTotalPrice(prevSale.quantity, prevSale.selling_price, discount)
        }));
    };

    const handleMoneyTakenChange = (e) => {
        const moneyTaken = e.target.value;
        setSale(prevSale => ({
            ...prevSale,
            money_taken: moneyTaken,
            money_returned: calculateMoneyReturned(moneyTaken, prevSale.total_price)
        }));
    };

    const calculateTotalPrice = (quantity, sellingPrice, discount) => {
        const subtotal = quantity * sellingPrice;
        const discountAmount = (discount / 100) * subtotal;
        let totalPrice = subtotal - discountAmount;
        return totalPrice < 0 ? 0 : totalPrice;
    };

    const calculateMoneyReturned = (moneyTaken, totalPrice) => {
        return moneyTaken - totalPrice >= 0 ? moneyTaken - totalPrice : 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.put(`http://127.0.0.1:8000/api/sales/${id}`, sale)
            .then(response => {
                alert('Sale updated successfully.');
                navigate('/sales');
            })
            .catch(error => console.error('Error updating sale:', error));
    };

    return (
        <div className="container">
            <h2>Edit Sale</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '60px' }}>
                <div className="form-group">
                    <label htmlFor="customer_name">Customer Name</label>
                    <input
                        type="text"
                        id="customer_name"
                        name="customer_name"
                        className="form-control"
                        value={sale.customer_name}
                        onChange={(e) => setSale({ ...sale, customer_name: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        className="form-control"
                        value={sale.address}
                        onChange={(e) => setSale({ ...sale, address: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone_no">Phone No</label>
                    <input
                        type="number"
                        id="phone_no"
                        name="phone_no"
                        className="form-control"
                        value={sale.phone_no}
                        onChange={(e) => setSale({ ...sale, phone_no: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="product_id">Product</label>
                    <select
                        id="product_id"
                        name="product_id"
                        className="form-control"
                        value={sale.product_id}
                        onChange={handleProductChange}
                        required
                    >
                        <option value="">Select Product</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}
                                data-name={product.name}
                                data-code={product.code}
                                data-category={product.category.name}
                                data-price={product.selling_price}
                                data-stock={product.stock}
                            >
                                {product.name} (Stock: {product.stock})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="product_name">Product Name</label>
                    <input
                        type="text"
                        id="product_name"
                        className="form-control"
                        value={sale.product_name}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="product_code">Product Code</label>
                    <input
                        type="text"
                        id="product_code"
                        className="form-control"
                        value={sale.product_code}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input
                        type="text"
                        id="category"
                        className="form-control"
                        value={sale.category}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="selling_price">Selling Price</label>
                    <input
                        type="number"
                        id="selling_price"
                        className="form-control"
                        value={sale.selling_price}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="discount">Discount</label>
                    <input
                        type="number"
                        id="discount"
                        name="discount"
                        className="form-control"
                        value={sale.discount}
                        onChange={handleDiscountChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        className="form-control"
                        value={sale.quantity}
                        onChange={handleQuantityChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="total_price">Total Price</label>
                    <input
                        type="number"
                        id="total_price"
                        name="total_price"
                        className="form-control"
                        value={sale.total_price}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="money_taken">Money Taken</label>
                    <input
                        type="number"
                        id="money_taken"
                        name="money_taken"
                        className="form-control"
                        value={sale.money_taken}
                        onChange={handleMoneyTakenChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="money_returned">Money Returned</label>
                    <input
                        type="number"
                        id="money_returned"
                        name="money_returned"
                        className="form-control"
                        value={sale.money_returned}
                        readOnly
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Sale</button>
            </form>
        </div>
    );
};

export default EditSales;
