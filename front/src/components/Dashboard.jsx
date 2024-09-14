import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [data, setData] = useState({
    categories: 0,
    suppliers: 0,
    products: 0,
    orders: 0,
    purchases: 0,
    sales: 0,
    salesreturn: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="d-flex">
      <main className="container mt-4">
        <div className="row" style={{ marginTop: '20px' }}>
          {/* Categories Box */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="small-box" style={boxStyle('#007bff')}>
              <div className="inner">
                <h3>{data.categories}</h3>
                <p>Total Categories</p>
              </div>
              <div className="icon" style={iconStyle('#007bff')}>
                <i className="fa-solid fa-layer-group"></i>
              </div>
              <Link to="/categories" className="small-box-footer" style={footerStyle}>
                View <i className="fa fa-arrow-circle-right"></i>
              </Link>
            </div>
          </div>

          {/* Suppliers Box */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="small-box" style={boxStyle('#f39c12')}>
              <div className="inner">
                <h3>{data.suppliers}</h3>
                <p>Total Suppliers</p>
              </div>
              <div className="icon" style={iconStyle('#f39c12')}>
                <i className="fa fa-id-card"></i>
              </div>
              <Link to="/suppliers" className="small-box-footer" style={footerStyle}>
                View <i className="fa fa-arrow-circle-right"></i>
              </Link>
            </div>
          </div>

          {/* Products Box */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="small-box" style={boxStyle('#28a745')}>
              <div className="inner">
                <h3>{data.products}</h3>
                <p>Total Products</p>
              </div>
              <div className="icon" style={iconStyle('#28a745')}>
                <i className="fa fa-box"></i>
              </div>
            </div>
          </div>

          {/* Orders Box */}
          <div className="col-lg-4 col-md-6 mb-4" style={{marginTop: '60px'}}>
            <div className="small-box" style={boxStyle('#dc3545')}>
              <div className="inner">
                <h3>{data.orders}</h3>
                <p>Total Orders</p>
              </div>
              <div className="icon" style={iconStyle('#dc3545')}>
                <i className="fa fa-shopping-cart"></i>
              </div>
            </div>
          </div>

          {/* Purchases Box */}
          <div className="col-lg-4 col-md-6 mb-4" style={{marginTop: '60px'}}>
            <div className="small-box" style={boxStyle('#17a2b8')}>
              <div className="inner">
                <h3>${data.purchases}</h3>
                <p>Total Purchases</p>
              </div>
              <div className="icon" style={iconStyle('#17a2b8')}>
                <i className="fa fa-money-bill-wave"></i>
              </div>
            </div>
          </div>

          {/* Sales Box */}
          <div className="col-lg-4 col-md-6 mb-4" style={{marginTop: '60px'}}>
            <div className="small-box" style={boxStyle('#6c757d')}>
              <div className="inner">
                <h3>${data.sales}</h3>
                <p>Total Sales</p>
              </div>
              <div className="icon" style={iconStyle('#6c757d')}>
                <i className="fa fa-cash-register"></i>
              </div>
            </div>
          </div>

          {/* Sales Returns Box */}
          <div className="col-lg-4 col-md-6 mb-4" style={{marginTop: '60px'}}>
            <div className="small-box" style={boxStyle('#ffc107')}>
              <div className="inner">
                <h3>${data.salesreturn}</h3>
                <p>Total Sales Returns</p>
              </div>
              <div className="icon" style={iconStyle('#ffc107')}>
                <i className="fa fa-undo"></i>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const boxStyle = (color) => ({
  backgroundColor: color,
  borderRadius: '5px',
  color: '#fff',
  position: 'relative',
  padding: '15px'
});

const iconStyle = (color) => ({
  fontSize: '50px',
  color,
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
  position: 'absolute',
  top: '-55px',
  right: '-5px'
});

const footerStyle = {
  display: 'block',
  padding: '10px',
  color: '#fff',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  textDecoration: 'none'
};

export default Dashboard;
