import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; 
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CategoryList from './components/Categories/CategoryList';
import Sidebar from './components/Sidebar';
import CreateCategory from './components/Categories/CreateCategory';
import EditCategory from './components/Categories/EditCategory';
import SupplierList from './components/Suppliers/SupplierList';
import CreateSupplier from './components/Suppliers/CreateSupplier';
import EditSupplier from './components/Suppliers/EditSupplier';
import ExpenseList from './components/Expenses/ExpenseList';
import CreateExpense from './components/Expenses/CreateExpense';
import EditExpense from './components/Expenses/EditExpense';
import ProductList from './components/Products/ProductList';
import CreateProduct from './components/Products/CreateProduct';
import EditProduct from './components/Products/EditProduct';
import OrderList from './components/Orders/OrderList';
import CreateOrder from './components/Orders/CreateOrder';
import EditOrder from './components/Orders/EditOrder';
import PurchasesList from './components/Purchases/PurchaseList';
import CreatePurchase from './components/Purchases/CreatePurchase';
import EditPurchase from './components/Purchases/EditPurchase';
import PurchaseInvoice from './components/Purchases/PurchaseInvoice';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
  
    try {
      await axios.post('http://127.0.0.1:8000/api/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      localStorage.removeItem('token');
      navigate('/'); 
    } catch (error) {
      console.error('Error logging out:', error.response ? error.response.data : error.message);
    }
  };
  

  return (
    <header className="bg-light py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <h4>Dashboard</h4>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Login />} />

        
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />

        <Route path="/categories" element={<Layout><CategoryList /></Layout>} />
        <Route path="/categories/create" element={<Layout><CreateCategory /></Layout>} />
        <Route path="/categories/edit/:id" element={<Layout><EditCategory /></Layout>} />

        <Route path="/suppliers" element={<Layout><SupplierList /></Layout>} />
        <Route path="/suppliers/create" element={<Layout><CreateSupplier /></Layout>} />
        <Route path="/suppliers/edit/:id" element={<Layout><EditSupplier /></Layout>} />

        <Route path="/expenses" element={<Layout><ExpenseList /></Layout>} />
        <Route path="/expenses/create" element={<Layout><CreateExpense /></Layout>} />
        <Route path="/expenses/edit/:id" element={<Layout><EditExpense /></Layout>} />

        <Route path="/products" element={<Layout><ProductList /></Layout>} />
        <Route path="/products/create" element={<Layout><CreateProduct /></Layout>} />
        <Route path="/products/edit/:id" element={<Layout><EditProduct /></Layout>} />

        <Route path="/orders" element={<Layout><OrderList /></Layout>} />
        <Route path="/orders/create" element={<Layout><CreateOrder /></Layout>} />
        <Route path="/orders/edit/:id" element={<Layout><EditOrder /></Layout>} />
        
        <Route path="/purchases" element={<Layout><PurchasesList /></Layout>} />
        <Route path="/purchases/create" element={<Layout><CreatePurchase /></Layout>} />
        <Route path="/purchases/edit/:id" element={<Layout><EditPurchase /></Layout>} />
        <Route path="/purchases/invoice/:id" element={<PurchaseInvoice />} />

      </Routes>
    </Router>
  );
};

const Layout = ({ children }) => (
  <div className="d-flex">
    <Sidebar />
    <div className="main-content flex-grow-1">
      <Header />
      <main className="container mt-4">
        {children}
      </main>
    </div>
  </div>
);

export default App;
