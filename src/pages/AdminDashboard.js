// src/pages/AdminDashboard.js
import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import {
  ShoppingBagIcon,
  UsersIcon,
  ClipboardListIcon,
  ChartBarIcon,
} from "@heroicons/react/outline"; // Importing icons
import ProductManagement from "./admin/ProductManagement";
import UserManagement from "./admin/UserManagement";
import OrderManagement from "./admin/OrderManagement";
import SalesAnalytics from "./admin/SalesAnalytics";


function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="admin-title">Admin Dashboard</h2>
        <nav>
          <ul className="admin-nav-list">
            <li>
              <NavLink
                to="products"
                className={({ isActive }) =>
                  `admin-nav-link ${isActive ? "active" : ""}`
                }
              >
                <ShoppingBagIcon className="admin-nav-icon" />
                Product Management
              </NavLink>
            </li>
            <li>
              <NavLink
                to="users"
                className={({ isActive }) =>
                  `admin-nav-link ${isActive ? "active" : ""}`
                }
              >
                <UsersIcon className="admin-nav-icon" />
                User Management
              </NavLink>
            </li>
            <li>
              <NavLink
                to="orders"
                className={({ isActive }) =>
                  `admin-nav-link ${isActive ? "active" : ""}`
                }
              >
                <ClipboardListIcon className="admin-nav-icon" />
                Order Management
              </NavLink>
            </li>
            <li>
              <NavLink
                to="analytics"
                className={({ isActive }) =>
                  `admin-nav-link ${isActive ? "active" : ""}`
                }
              >
                <ChartBarIcon className="admin-nav-icon" />
                Sales Analytics
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Content Area */}
      <main className="admin-content">
        <Routes>
          <Route path="products" element={<ProductManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="analytics" element={<SalesAnalytics />} />
          <Route path="*" element={<ProductManagement />} />{" "}
          {/* Default Route */}
        </Routes>
      </main>
    </div>
  );
}

export default AdminDashboard;
