// src/utils/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('wellnesshubToken'); // ✅ use correct token key
  return token ? children : <Navigate to="/user-login" />;
};

export default PrivateRoute;
