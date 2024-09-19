import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faLayerGroup, faIdCard, faCube, faShoppingCart, faBagShopping, faDollarSign, faArrowCircleRight, faFlag, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <div className="d-flex">
      <div className="bg-dark text-white" style={{ width: '13rem' }}>
        <div className="p-3">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link text-white">
                <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/categories" className="nav-link text-white">
                <FontAwesomeIcon icon={faLayerGroup} /> Categories
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/suppliers" className="nav-link text-white">
                <FontAwesomeIcon icon={faIdCard} /> Suppliers
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/expenses" className="nav-link text-white">
                <FontAwesomeIcon icon={faRightToBracket} /> Expenses
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className="nav-link text-white">
                <FontAwesomeIcon icon={faCube} /> Products
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/orders" className="nav-link text-white">
                <FontAwesomeIcon icon={faShoppingCart} /> Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/purchases" className="nav-link text-white">
                <FontAwesomeIcon icon={faBagShopping} /> Purchases
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/sales" className="nav-link text-white">
                <FontAwesomeIcon icon={faDollarSign} /> Sales
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/sales_returns" className="nav-link text-white">
                <FontAwesomeIcon icon={faArrowCircleRight} /> Sales Return
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/sales/report" className="nav-link text-white">
                <FontAwesomeIcon icon={faFlag} /> Sales Report
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/purchases/report" className="nav-link text-white">
                <FontAwesomeIcon icon={faFlag} /> Purchases Report
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/income-statement" className="nav-link text-white">
                <FontAwesomeIcon icon={faChartLine} /> Income Statement
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
